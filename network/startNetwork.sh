#!/bin/bash

echo "------------Register the ca admin for each organization—----------------"

docker compose -f docker/docker-compose-ca.yaml up -d
sleep 3
sudo chmod -R 777 organizations/

echo "------------Register and enroll the users for each organization—-----------"

chmod +x registerEnroll.sh

./registerEnroll.sh
sleep 3

echo "—-------------Build the infrastructure—-----------------"

docker compose -f docker/docker-compose-4org.yaml up -d
sleep 3

echo "-------------Generate the genesis block—-------------------------------"

export FABRIC_CFG_PATH=${PWD}/config

export CHANNEL_NAME=managementchannel

configtxgen -profile ChannelUsingRaft -outputBlock ${PWD}/channel-artifacts/${CHANNEL_NAME}.block -channelID $CHANNEL_NAME

echo "------ Create the application channel------"

export ORDERER_CA=${PWD}/organizations/ordererOrganizations/management.com/orderers/orderer.management.com/msp/tlscacerts/tlsca.management.com-cert.pem

export ORDERER_ADMIN_TLS_SIGN_CERT=${PWD}/organizations/ordererOrganizations/management.com/orderers/orderer.management.com/tls/server.crt

export ORDERER_ADMIN_TLS_PRIVATE_KEY=${PWD}/organizations/ordererOrganizations/management.com/orderers/orderer.management.com/tls/server.key

osnadmin channel join --channelID $CHANNEL_NAME --config-block ${PWD}/channel-artifacts/$CHANNEL_NAME.block -o localhost:7053 --ca-file $ORDERER_CA --client-cert $ORDERER_ADMIN_TLS_SIGN_CERT --client-key $ORDERER_ADMIN_TLS_PRIVATE_KEY
sleep 2
osnadmin channel list -o localhost:7053 --ca-file $ORDERER_CA --client-cert $ORDERER_ADMIN_TLS_SIGN_CERT --client-key $ORDERER_ADMIN_TLS_PRIVATE_KEY
sleep 2

export FABRIC_CFG_PATH=${PWD}/peercfg
export manufacturer_PEER_TLSROOTCERT=${PWD}/organizations/peerOrganizations/manufacturer.management.com/peers/peer0.manufacturer.management.com/tls/ca.crt
export WasteCollectionCompany_PEER_TLSROOTCERT=${PWD}/organizations/peerOrganizations/WasteCollectionCompany.management.com/peers/peer0.WasteCollectionCompany.management.com/tls/ca.crt
export recyclingCenter_PEER_TLSROOTCERT=${PWD}/organizations/peerOrganizations/recyclingCenter.management.com/peers/peer0.recyclingCenter.management.com/tls/ca.crt
export government_PEER_TLSROOTCERT=${PWD}/organizations/peerOrganizations/government.management.com/peers/peer0.government.management.com/tls/ca.crt


export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID=manufacturerMSP
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/manufacturer.management.com/peers/peer0.manufacturer.management.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/manufacturer.management.com/users/Admin@manufacturer.management.com/msp
export CORE_PEER_ADDRESS=localhost:7051
sleep 2

echo "—---------------Join manufacturer peer to the channel—-------------"

echo ${FABRIC_CFG_PATH}
sleep 2
peer channel join -b ${PWD}/channel-artifacts/${CHANNEL_NAME}.block
sleep 3

echo "-----channel List----"
peer channel list

echo "—-------------manufacturer anchor peer update—-----------"


peer channel fetch config ${PWD}/channel-artifacts/config_block.pb -o localhost:7050 --ordererTLSHostnameOverride orderer.management.com -c $CHANNEL_NAME --tls --cafile $ORDERER_CA
sleep 1

cd channel-artifacts

configtxlator proto_decode --input config_block.pb --type common.Block --output config_block.json
jq '.data.data[0].payload.data.config' config_block.json > config.json

cp config.json config_copy.json

jq '.channel_group.groups.Application.groups.manufacturerMSP.values += {"AnchorPeers":{"mod_policy": "Admins","value":{"anchor_peers": [{"host": "peer0.manufacturer.management.com","port": 7051}]},"version": "0"}}' config_copy.json > modified_config.json

configtxlator proto_encode --input config.json --type common.Config --output config.pb
configtxlator proto_encode --input modified_config.json --type common.Config --output modified_config.pb
configtxlator compute_update --channel_id ${CHANNEL_NAME} --original config.pb --updated modified_config.pb --output config_update.pb

configtxlator proto_decode --input config_update.pb --type common.ConfigUpdate --output config_update.json
echo '{"payload":{"header":{"channel_header":{"channel_id":"'$CHANNEL_NAME'", "type":2}},"data":{"config_update":'$(cat config_update.json)'}}}' | jq . > config_update_in_envelope.json
configtxlator proto_encode --input config_update_in_envelope.json --type common.Envelope --output config_update_in_envelope.pb

cd ..

peer channel update -f ${PWD}/channel-artifacts/config_update_in_envelope.pb -c $CHANNEL_NAME -o localhost:7050  --ordererTLSHostnameOverride orderer.management.com --tls --cafile $ORDERER_CA
sleep 1

echo "—---------------package chaincode—-------------"

peer lifecycle chaincode package managementpdt.tar.gz --path ${PWD}/../chaincode --lang node --label managementpdt_1.0
sleep 1

echo "—---------------install chaincode in Manufacturer peer—-------------"

peer lifecycle chaincode install managementpdt.tar.gz
sleep 3

peer lifecycle chaincode queryinstalled
sleep 1

export CC_PACKAGE_ID=$(peer lifecycle chaincode calculatepackageid managementpdt.tar.gz)

echo "—---------------Approve chaincode in Manufacturer peer—-------------"

peer lifecycle chaincode approveformyorg -o localhost:7050 --ordererTLSHostnameOverride orderer.management.com --channelID $CHANNEL_NAME --name basic --version 1.0 --collections-config ../chaincode/collection.json --package-id $CC_PACKAGE_ID --sequence 1 --tls --cafile $ORDERER_CA --waitForEvent
sleep 2




export CORE_PEER_LOCALMSPID=WasteCollectionCompanyMSP 
export CORE_PEER_ADDRESS=localhost:9051 
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/WasteCollectionCompany.management.com/peers/peer0.WasteCollectionCompany.management.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/WasteCollectionCompany.management.com/users/Admin@WasteCollectionCompany.management.com/msp

echo "—---------------Join WasteCollectionCompany peer0 to the channel—-------------"

peer channel join -b ${PWD}/channel-artifacts/$CHANNEL_NAME.block
sleep 1
peer channel list

echo "—-------------WasteCollectionCompany anchor peer update—-----------"

# peer channel join -b ${PWD}/channel-artifacts/$CHANNEL_NAME.block --tls --cafile $ORDERER_CA

peer channel fetch config ${PWD}/channel-artifacts/config_block.pb -o localhost:7050 --ordererTLSHostnameOverride orderer.management.com -c $CHANNEL_NAME --tls --cafile $ORDERER_CA
sleep 1

cd channel-artifacts

configtxlator proto_decode --input config_block.pb --type common.Block --output config_block.json
jq '.data.data[0].payload.data.config' config_block.json > config.json

cp config.json config_copy.json

jq '.channel_group.groups.Application.groups.WasteCollectionCompanyMSP.values += {"AnchorPeers":{"mod_policy": "Admins","value":{"anchor_peers": [{"host": "peer0.WasteCollectionCompany.management.com","port": 9051}]},"version": "0"}}' config_copy.json > modified_config.json

configtxlator proto_encode --input config.json --type common.Config --output config.pb
configtxlator proto_encode --input modified_config.json --type common.Config --output modified_config.pb
configtxlator compute_update --channel_id ${CHANNEL_NAME} --original config.pb --updated modified_config.pb --output config_update.pb

configtxlator proto_decode --input config_update.pb --type common.ConfigUpdate --output config_update.json
echo '{"payload":{"header":{"channel_header":{"channel_id":"'$CHANNEL_NAME'", "type":2}},"data":{"config_update":'$(cat config_update.json)'}}}' | jq . > config_update_in_envelope.json
configtxlator proto_encode --input config_update_in_envelope.json --type common.Envelope --output config_update_in_envelope.pb

cd ..

peer channel update -f ${PWD}/channel-artifacts/config_update_in_envelope.pb -c $CHANNEL_NAME -o localhost:7050  --ordererTLSHostnameOverride orderer.management.com --tls --cafile $ORDERER_CA
sleep 2

echo "—---------------install chaincode in WasteCollectionCompany peer0—-------------"

peer lifecycle chaincode install managementpdt.tar.gz
sleep 3

peer lifecycle chaincode queryinstalled
sleep 1

export CC_PACKAGE_ID=$(peer lifecycle chaincode calculatepackageid managementpdt.tar.gz)

echo "—---------------Approve chaincode in WasteCollectionCompany peer0—-------------"

peer lifecycle chaincode approveformyorg -o localhost:7050 --ordererTLSHostnameOverride orderer.management.com --channelID $CHANNEL_NAME --name basic --version 1.0 --collections-config ../chaincode/collection.json --package-id $CC_PACKAGE_ID --sequence 1 --tls --cafile $ORDERER_CA --waitForEvent
sleep 2

echo "—---------------Join WasteCollectionCompany peer1 to the channel—-------------"

export CORE_PEER_LOCALMSPID=WasteCollectionCompanyMSP 
export CORE_PEER_ADDRESS=localhost:9053
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/WasteCollectionCompany.management.com/peers/peer1.WasteCollectionCompany.management.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/WasteCollectionCompany.management.com/users/Admin@WasteCollectionCompany.management.com/msp

echo ${FABRIC_CFG_PATH}
sleep 2
peer channel join -b ${PWD}/channel-artifacts/${CHANNEL_NAME}.block
sleep 3

echo "-----channel List----"
peer channel list

# echo "—---------------install chaincode in WasteCollectionCompany peer—-------------"

# peer lifecycle chaincode install managementpdt.tar.gz
# sleep 3

# peer lifecycle chaincode queryinstalled
# sleep 1

# export CC_PACKAGE_ID=$(peer lifecycle chaincode calculatepackageid managementpdt.tar.gz)

# echo "—---------------Approve chaincode in WasteCollectionCompany peer—-------------"

# peer lifecycle chaincode approveformyorg -o localhost:7050 --ordererTLSHostnameOverride orderer.management.com --channelID $CHANNEL_NAME --name basic --version 1.0 --collections-config ../Chaincode/basic/collection-supplychain.json --package-id $CC_PACKAGE_ID --sequence 1 --tls --cafile $ORDERER_CA --waitForEvent
# sleep 2


export CORE_PEER_LOCALMSPID=governmentMSP
export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/government.management.com/peers/peer0.government.management.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/government.management.com/users/Admin@government.management.com/msp
export CORE_PEER_ADDRESS=localhost:8051

echo "—---------------Join government peer0 to the channel—-------------"

peer channel join -b ${PWD}/channel-artifacts/$CHANNEL_NAME.block
sleep 1
peer channel list

echo "—-------------government anchor peer update—-----------"


peer channel fetch config ${PWD}/channel-artifacts/config_block.pb -o localhost:7050 --ordererTLSHostnameOverride orderer.management.com -c $CHANNEL_NAME --tls --cafile $ORDERER_CA
sleep 1

cd channel-artifacts

configtxlator proto_decode --input config_block.pb --type common.Block --output config_block.json
jq '.data.data[0].payload.data.config' config_block.json > config.json

cp config.json config_copy.json

jq '.channel_group.groups.Application.groups.governmentMSP.values += {"AnchorPeers":{"mod_policy": "Admins","value":{"anchor_peers": [{"host": "peer0.government.management.com","port": 8051}]},"version": "0"}}' config_copy.json > modified_config.json

configtxlator proto_encode --input config.json --type common.Config --output config.pb
configtxlator proto_encode --input modified_config.json --type common.Config --output modified_config.pb
configtxlator compute_update --channel_id ${CHANNEL_NAME} --original config.pb --updated modified_config.pb --output config_update.pb

configtxlator proto_decode --input config_update.pb --type common.ConfigUpdate --output config_update.json
echo '{"payload":{"header":{"channel_header":{"channel_id":"'$CHANNEL_NAME'", "type":2}},"data":{"config_update":'$(cat config_update.json)'}}}' | jq . > config_update_in_envelope.json
configtxlator proto_encode --input config_update_in_envelope.json --type common.Envelope --output config_update_in_envelope.pb

cd ..

peer channel update -f ${PWD}/channel-artifacts/config_update_in_envelope.pb -c $CHANNEL_NAME -o localhost:7050  --ordererTLSHostnameOverride orderer.management.com --tls --cafile $ORDERER_CA
peer channel getinfo -c $CHANNEL_NAME
sleep 1
echo "-----channel List----"
peer channel list

echo "—---------------install chaincode in government peer—-------------"

peer lifecycle chaincode install managementpdt.tar.gz
sleep 3

peer lifecycle chaincode queryinstalled
sleep 1

export CC_PACKAGE_ID=$(peer lifecycle chaincode calculatepackageid managementpdt.tar.gz)

echo "—---------------Approve chaincode in government peer—-------------"

peer lifecycle chaincode approveformyorg -o localhost:7050 --ordererTLSHostnameOverride orderer.management.com --channelID $CHANNEL_NAME --name basic --version 1.0 --collections-config ../chaincode/collection.json --package-id $CC_PACKAGE_ID --sequence 1 --tls --cafile $ORDERER_CA --waitForEvent
sleep 2




export CORE_PEER_LOCALMSPID=recyclingCenterMSP 
export CORE_PEER_ADDRESS=localhost:11051 
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/recyclingCenter.management.com/peers/peer0.recyclingCenter.management.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/recyclingCenter.management.com/users/Admin@recyclingCenter.management.com/msp

echo "—---------------Join recyclingCenter peer to the channel—-------------"

peer channel join -b ${PWD}/channel-artifacts/$CHANNEL_NAME.block
sleep 1
peer channel list

echo "—-------------recyclingCenter anchor peer update—-----------"


peer channel fetch config ${PWD}/channel-artifacts/config_block.pb -o localhost:7050 --ordererTLSHostnameOverride orderer.management.com -c $CHANNEL_NAME --tls --cafile $ORDERER_CA
sleep 1

cd channel-artifacts

configtxlator proto_decode --input config_block.pb --type common.Block --output config_block.json
jq '.data.data[0].payload.data.config' config_block.json > config.json

cp config.json config_copy.json

jq '.channel_group.groups.Application.groups.recyclingCenterMSP.values += {"AnchorPeers":{"mod_policy": "Admins","value":{"anchor_peers": [{"host": "peer0.recyclingCenter.management.com","port": 11051}]},"version": "0"}}' config_copy.json > modified_config.json

configtxlator proto_encode --input config.json --type common.Config --output config.pb
configtxlator proto_encode --input modified_config.json --type common.Config --output modified_config.pb
configtxlator compute_update --channel_id ${CHANNEL_NAME} --original config.pb --updated modified_config.pb --output config_update.pb

configtxlator proto_decode --input config_update.pb --type common.ConfigUpdate --output config_update.json
echo '{"payload":{"header":{"channel_header":{"channel_id":"'$CHANNEL_NAME'", "type":2}},"data":{"config_update":'$(cat config_update.json)'}}}' | jq . > config_update_in_envelope.json
configtxlator proto_encode --input config_update_in_envelope.json --type common.Envelope --output config_update_in_envelope.pb

cd ..

peer channel update -f ${PWD}/channel-artifacts/config_update_in_envelope.pb -c $CHANNEL_NAME -o localhost:7050  --ordererTLSHostnameOverride orderer.management.com --tls --cafile $ORDERER_CA
peer channel getinfo -c $CHANNEL_NAME

sleep 1
echo "-----channel List----"
peer channel list



echo "—---------------install chaincode in recyclingCenter peer—-------------"

peer lifecycle chaincode install managementpdt.tar.gz
sleep 3

peer lifecycle chaincode queryinstalled

echo "—---------------Approve chaincode in recyclingCenter peer—-------------"

peer lifecycle chaincode approveformyorg -o localhost:7050 --ordererTLSHostnameOverride orderer.management.com --channelID $CHANNEL_NAME --name basic --version 1.0 --collections-config ../chaincode/collection.json --package-id $CC_PACKAGE_ID --sequence 1 --tls --cafile $ORDERER_CA --waitForEvent
sleep 1


echo "—---------------Commit chaincode in recyclingCenter peer—-------------"


peer lifecycle chaincode checkcommitreadiness --channelID $CHANNEL_NAME --name basic --version 1.0 --sequence 1 --collections-config ../chaincode/collection.json --tls --cafile $ORDERER_CA --output json

peer lifecycle chaincode commit -o localhost:7050 --ordererTLSHostnameOverride orderer.management.com --channelID $CHANNEL_NAME --name basic --version 1.0 --sequence 1 --collections-config ../chaincode/collection.json --tls --cafile $ORDERER_CA --peerAddresses localhost:7051 --tlsRootCertFiles $manufacturer_PEER_TLSROOTCERT --peerAddresses localhost:9051 --tlsRootCertFiles $WasteCollectionCompany_PEER_TLSROOTCERT --peerAddresses localhost:8051 --tlsRootCertFiles $government_PEER_TLSROOTCERT --peerAddresses localhost:11051 --tlsRootCertFiles $recyclingCenter_PEER_TLSROOTCERT
sleep 1

peer lifecycle chaincode querycommitted --channelID $CHANNEL_NAME --name basic --cafile $ORDERER_CA

echo "—---------------Completed—-------------"
