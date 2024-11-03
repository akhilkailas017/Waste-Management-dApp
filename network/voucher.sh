#!/bin/bash


echo ""
echo "create waste with id 1"
echo ""
export CHANNEL_NAME=mychannel
export FABRIC_CFG_PATH=./peercfg
export CORE_PEER_LOCALMSPID=wasteCollectionCompanyMSP
export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/wasteCollectionCompany.wasteManagement.com/peers/peer0.wasteCollectionCompany.wasteManagement.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/wasteCollectionCompany.wasteManagement.com/users/Admin@wasteCollectionCompany.wasteManagement.com/msp
export CORE_PEER_ADDRESS=localhost:5051
export ORDERER_CA=${PWD}/organizations/ordererOrganizations/wasteManagement.com/orderers/orderer.wasteManagement.com/msp/tlscacerts/tlsca.wasteManagement.com-cert.pem
export wasteCollectionCompany_PEER_TLSROOTCERT=${PWD}/organizations/peerOrganizations/wasteCollectionCompany.wasteManagement.com/peers/peer0.wasteCollectionCompany.wasteManagement.com/tls/ca.crt
export recyclingcenter_PEER_TLSROOTCERT=${PWD}/organizations/peerOrganizations/recyclingcenter.wasteManagement.com/peers/peer0.recyclingcenter.wasteManagement.com/tls/ca.crt
export government_PEER_TLSROOTCERT=${PWD}/organizations/peerOrganizations/government.wasteManagement.com/peers/peer0.government.wasteManagement.com/tls/ca.crt
export manufacture_PEER_TLSROOTCERT=${PWD}/organizations/peerOrganizations/manufacture.wasteManagement.com/peers/peer0.manufacture.wasteManagement.com/tls/ca.crt
sleep 3
peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.wasteManagement.com --tls --cafile $ORDERER_CA -C $CHANNEL_NAME -n wasteManagementzip --peerAddresses localhost:5051 --tlsRootCertFiles $wasteCollectionCompany_PEER_TLSROOTCERT --peerAddresses localhost:7051 --tlsRootCertFiles $recyclingcenter_PEER_TLSROOTCERT --peerAddresses localhost:6051 --tlsRootCertFiles $manufacture_PEER_TLSROOTCERT --peerAddresses localhost:9051 --tlsRootCertFiles $government_PEER_TLSROOTCERT -c '{"function":"createWaste","Args":["1", "abc", "100","Akhil"]}'
sleep 3

echo ""
echo "generate new voucher abc"
echo ""
export CHANNEL_NAME=mychannel
export FABRIC_CFG_PATH=./peercfg
export CORE_PEER_LOCALMSPID=governmentMSP
export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/government.wasteManagement.com/peers/peer0.government.wasteManagement.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/government.wasteManagement.com/users/Admin@government.wasteManagement.com/msp
export CORE_PEER_ADDRESS=localhost:9051
export ORDERER_CA=${PWD}/organizations/ordererOrganizations/wasteManagement.com/orderers/orderer.wasteManagement.com/msp/tlscacerts/tlsca.wasteManagement.com-cert.pem
export wasteCollectionCompany_PEER_TLSROOTCERT=${PWD}/organizations/peerOrganizations/wasteCollectionCompany.wasteManagement.com/peers/peer0.wasteCollectionCompany.wasteManagement.com/tls/ca.crt
export government_PEER_TLSROOTCERT=${PWD}/organizations/peerOrganizations/government.wasteManagement.com/peers/peer0.government.wasteManagement.com/tls/ca.crt

# Base64 encoding of transient data fields
export wasteId=$(echo -n "abc" | base64 | tr -d \\n)
export type=$(echo -n "incentive" | base64 | tr -d \\n)
export amount=$(echo -n "1000" | base64 | tr -d \\n)

Invoke command
peer chaincode invoke \
  -o localhost:7050 --ordererTLSHostnameOverride orderer.wasteManagement.com \
  --tls --cafile $ORDERER_CA \
  -C $CHANNEL_NAME -n wasteManagementzip \
  --peerAddresses localhost:5051 --tlsRootCertFiles $wasteCollectionCompany_PEER_TLSROOTCERT \
  --peerAddresses localhost:9051 --tlsRootCertFiles $government_PEER_TLSROOTCERT \
  -c '{"function":"issueVoucher","Args":["abc"]}' \
  --transient "{\"wasteId\":\"$wasteId\",\"type\":\"$type\",\"amount\":\"$amount\"}"

# peer chaincode invoke \
#   -o localhost:7050 --ordererTLSHostnameOverride orderer.wasteManagement.com \
#   --tls --cafile $ORDERER_CA \
#   -C $CHANNEL_NAME -n wasteManagementzip \
#   --peerAddresses localhost:5051 --tlsRootCertFiles $wasteCollectionCompany_PEER_TLSROOTCERT \
#   --peerAddresses localhost:9051 --tlsRootCertFiles $government_PEER_TLSROOTCERT \
#   -c '{"Args":["govContract:issueVoucher","V01"]}' \
#   --transient "{\"wasteId\":\"$wasteId\",\"type\":\"$type\",\"amount\":\"$amount\"}"


sleep 3

# echo ""
# echo "read voucher abc"
# echo ""
# export CHANNEL_NAME=mychannel
# export FABRIC_CFG_PATH=./peercfg
# export CORE_PEER_LOCALMSPID=governmentMSP
# export CORE_PEER_TLS_ENABLED=true
# export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/government.wasteManagement.com/peers/peer0.government.wasteManagement.com/tls/ca.crt
# export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/government.wasteManagement.com/users/Admin@government.wasteManagement.com/msp
# export CORE_PEER_ADDRESS=localhost:9051
# export ORDERER_CA=${PWD}/organizations/ordererOrganizations/wasteManagement.com/orderers/orderer.wasteManagement.com/msp/tlscacerts/tlsca.wasteManagement.com-cert.pem
# export wasteCollectionCompany_PEER_TLSROOTCERT=${PWD}/organizations/peerOrganizations/wasteCollectionCompany.wasteManagement.com/peers/peer0.wasteCollectionCompany.wasteManagement.com/tls/ca.crt
# export recyclingcenter_PEER_TLSROOTCERT=${PWD}/organizations/peerOrganizations/recyclingcenter.wasteManagement.com/peers/peer0.recyclingcenter.wasteManagement.com/tls/ca.crt
# export government_PEER_TLSROOTCERT=${PWD}/organizations/peerOrganizations/government.wasteManagement.com/peers/peer0.government.wasteManagement.com/tls/ca.crt
# export manufacture_PEER_TLSROOTCERT=${PWD}/organizations/peerOrganizations/manufacture.wasteManagement.com/peers/peer0.manufacture.wasteManagement.com/tls/ca.crt
# sleep 3
# peer chaincode query -C $CHANNEL_NAME -n wasteManagementzip -c '{"function":"readVoucher","Args":["abc"]}'
# sleep 3

# echo ""
# echo "delete waste with id 1"
# echo ""
# export CHANNEL_NAME=mychannel
# export FABRIC_CFG_PATH=./peercfg
# export CORE_PEER_LOCALMSPID=wasteCollectionCompanyMSP
# export CORE_PEER_TLS_ENABLED=true
# export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/wasteCollectionCompany.wasteManagement.com/peers/peer0.wasteCollectionCompany.wasteManagement.com/tls/ca.crt
# export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/wasteCollectionCompany.wasteManagement.com/users/Admin@wasteCollectionCompany.wasteManagement.com/msp
# export CORE_PEER_ADDRESS=localhost:5051
# export ORDERER_CA=${PWD}/organizations/ordererOrganizations/wasteManagement.com/orderers/orderer.wasteManagement.com/msp/tlscacerts/tlsca.wasteManagement.com-cert.pem
# export wasteCollectionCompany_PEER_TLSROOTCERT=${PWD}/organizations/peerOrganizations/wasteCollectionCompany.wasteManagement.com/peers/peer0.wasteCollectionCompany.wasteManagement.com/tls/ca.crt
# export recyclingcenter_PEER_TLSROOTCERT=${PWD}/organizations/peerOrganizations/recyclingcenter.wasteManagement.com/peers/peer0.recyclingcenter.wasteManagement.com/tls/ca.crt
# export government_PEER_TLSROOTCERT=${PWD}/organizations/peerOrganizations/government.wasteManagement.com/peers/peer0.government.wasteManagement.com/tls/ca.crt
# export manufacture_PEER_TLSROOTCERT=${PWD}/organizations/peerOrganizations/manufacture.wasteManagement.com/peers/peer0.manufacture.wasteManagement.com/tls/ca.crt
# sleep 3
# peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.wasteManagement.com --tls --cafile $ORDERER_CA -C $CHANNEL_NAME -n wasteManagementzip --peerAddresses localhost:5051 --tlsRootCertFiles $wasteCollectionCompany_PEER_TLSROOTCERT --peerAddresses localhost:7051 --tlsRootCertFiles $recyclingcenter_PEER_TLSROOTCERT --peerAddresses localhost:6051 --tlsRootCertFiles $manufacture_PEER_TLSROOTCERT --peerAddresses localhost:9051 --tlsRootCertFiles $government_PEER_TLSROOTCERT -c '{"function":"deleteWaste","Args":["1"]}'
# sleep 3