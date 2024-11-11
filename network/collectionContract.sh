#!/bin/bash

echo ""
echo "createWaste function waste-01,waste-02,waste-03"
echo ""
export CHANNEL_NAME=managementchannel
export FABRIC_CFG_PATH=./peercfg
export CORE_PEER_LOCALMSPID=WasteCollectionCompanyMSP
export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/WasteCollectionCompany.management.com/peers/peer0.WasteCollectionCompany.management.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/WasteCollectionCompany.management.com/users/Admin@WasteCollectionCompany.management.com/msp
export CORE_PEER_ADDRESS=localhost:9051
export ORDERER_CA=${PWD}/organizations/ordererOrganizations/management.com/orderers/orderer.management.com/msp/tlscacerts/tlsca.management.com-cert.pem
export manufacturer_PEER_TLSROOTCERT=${PWD}/organizations/peerOrganizations/manufacturer.management.com/peers/peer0.manufacturer.management.com/tls/ca.crt
export WasteCollectionCompany_PEER_TLSROOTCERT=${PWD}/organizations/peerOrganizations/WasteCollectionCompany.management.com/peers/peer0.WasteCollectionCompany.management.com/tls/ca.crt
export government_PEER_TLSROOTCERT=${PWD}/organizations/peerOrganizations/government.management.com/peers/peer0.government.management.com/tls/ca.crt
export recyclingCenter_PEER_TLSROOTCERT=${PWD}/organizations/peerOrganizations/recyclingCenter.management.com/peers/peer0.recyclingCenter.management.com/tls/ca.crt
sleep 3
peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.management.com --tls --cafile $ORDERER_CA -C $CHANNEL_NAME -n basic \
    --peerAddresses localhost:7051 --tlsRootCertFiles $manufacturer_PEER_TLSROOTCERT \
    --peerAddresses localhost:9051 --tlsRootCertFiles $WasteCollectionCompany_PEER_TLSROOTCERT \
    --peerAddresses localhost:8051 --tlsRootCertFiles $government_PEER_TLSROOTCERT \
    --peerAddresses localhost:11051 --tlsRootCertFiles $recyclingCenter_PEER_TLSROOTCERT \
    -c '{"function":"createWaste","Args":["waste-01", "company1", "100","akhil"]}'
sleep 3
peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.management.com --tls --cafile $ORDERER_CA -C $CHANNEL_NAME -n basic \
    --peerAddresses localhost:7051 --tlsRootCertFiles $manufacturer_PEER_TLSROOTCERT \
    --peerAddresses localhost:9051 --tlsRootCertFiles $WasteCollectionCompany_PEER_TLSROOTCERT \
    --peerAddresses localhost:8051 --tlsRootCertFiles $government_PEER_TLSROOTCERT \
    --peerAddresses localhost:11051 --tlsRootCertFiles $recyclingCenter_PEER_TLSROOTCERT \
    -c '{"function":"createWaste","Args":["waste-02", "company1", "1005","akhil1"]}'
sleep 3
peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.management.com --tls --cafile $ORDERER_CA -C $CHANNEL_NAME -n basic \
    --peerAddresses localhost:7051 --tlsRootCertFiles $manufacturer_PEER_TLSROOTCERT \
    --peerAddresses localhost:9051 --tlsRootCertFiles $WasteCollectionCompany_PEER_TLSROOTCERT \
    --peerAddresses localhost:8051 --tlsRootCertFiles $government_PEER_TLSROOTCERT \
    --peerAddresses localhost:11051 --tlsRootCertFiles $recyclingCenter_PEER_TLSROOTCERT \
    -c '{"function":"createWaste","Args":["waste-03", "company1", "1010","akhil2"]}'
sleep 3


echo ""
echo "wasteExist function waste-01"
echo ""
export CHANNEL_NAME=managementchannel
export FABRIC_CFG_PATH=./peercfg
export CORE_PEER_LOCALMSPID=WasteCollectionCompanyMSP
export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/WasteCollectionCompany.management.com/peers/peer0.WasteCollectionCompany.management.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/WasteCollectionCompany.management.com/users/Admin@WasteCollectionCompany.management.com/msp
export CORE_PEER_ADDRESS=localhost:9051
export ORDERER_CA=${PWD}/organizations/ordererOrganizations/management.com/orderers/orderer.management.com/msp/tlscacerts/tlsca.management.com-cert.pem
export manufacturer_PEER_TLSROOTCERT=${PWD}/organizations/peerOrganizations/manufacturer.management.com/peers/peer0.manufacturer.management.com/tls/ca.crt
export WasteCollectionCompany_PEER_TLSROOTCERT=${PWD}/organizations/peerOrganizations/WasteCollectionCompany.management.com/peers/peer0.WasteCollectionCompany.management.com/tls/ca.crt
export government_PEER_TLSROOTCERT=${PWD}/organizations/peerOrganizations/government.management.com/peers/peer0.government.management.com/tls/ca.crt
export recyclingCenter_PEER_TLSROOTCERT=${PWD}/organizations/peerOrganizations/recyclingCenter.management.com/peers/peer0.recyclingCenter.management.com/tls/ca.crt
sleep 3
peer chaincode query -C $CHANNEL_NAME -n basic -c '{"function":"wasteExist","Args":["waste-01"]}'
sleep 3


echo ""
echo "readWaste function waste-01"
echo ""
export CHANNEL_NAME=managementchannel
export FABRIC_CFG_PATH=./peercfg
export CORE_PEER_LOCALMSPID=WasteCollectionCompanyMSP
export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/WasteCollectionCompany.management.com/peers/peer0.WasteCollectionCompany.management.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/WasteCollectionCompany.management.com/users/Admin@WasteCollectionCompany.management.com/msp
export CORE_PEER_ADDRESS=localhost:9051
export ORDERER_CA=${PWD}/organizations/ordererOrganizations/management.com/orderers/orderer.management.com/msp/tlscacerts/tlsca.management.com-cert.pem
export manufacturer_PEER_TLSROOTCERT=${PWD}/organizations/peerOrganizations/manufacturer.management.com/peers/peer0.manufacturer.management.com/tls/ca.crt
export WasteCollectionCompany_PEER_TLSROOTCERT=${PWD}/organizations/peerOrganizations/WasteCollectionCompany.management.com/peers/peer0.WasteCollectionCompany.management.com/tls/ca.crt
export government_PEER_TLSROOTCERT=${PWD}/organizations/peerOrganizations/government.management.com/peers/peer0.government.management.com/tls/ca.crt
export recyclingCenter_PEER_TLSROOTCERT=${PWD}/organizations/peerOrganizations/recyclingCenter.management.com/peers/peer0.recyclingCenter.management.com/tls/ca.crt
sleep 3
peer chaincode query -C $CHANNEL_NAME -n basic -c '{"function":"readWaste","Args":["waste-01"]}'
sleep 3


echo ""
echo "updateWasteDetails function waste-01"
echo ""
export CHANNEL_NAME=managementchannel
export FABRIC_CFG_PATH=./peercfg
export CORE_PEER_LOCALMSPID=recyclingCenterMSP
export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/recyclingCenter.management.com/peers/peer0.recyclingCenter.management.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/recyclingCenter.management.com/users/Admin@recyclingCenter.management.com/msp
export CORE_PEER_ADDRESS=localhost:11051
export ORDERER_CA=${PWD}/organizations/ordererOrganizations/management.com/orderers/orderer.management.com/msp/tlscacerts/tlsca.management.com-cert.pem
export manufacturer_PEER_TLSROOTCERT=${PWD}/organizations/peerOrganizations/manufacturer.management.com/peers/peer0.manufacturer.management.com/tls/ca.crt
export WasteCollectionCompany_PEER_TLSROOTCERT=${PWD}/organizations/peerOrganizations/WasteCollectionCompany.management.com/peers/peer0.WasteCollectionCompany.management.com/tls/ca.crt
export government_PEER_TLSROOTCERT=${PWD}/organizations/peerOrganizations/government.management.com/peers/peer0.government.management.com/tls/ca.crt
export recyclingCenter_PEER_TLSROOTCERT=${PWD}/organizations/peerOrganizations/recyclingCenter.management.com/peers/peer0.recyclingCenter.management.com/tls/ca.crt
sleep 3
peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.management.com --tls --cafile $ORDERER_CA -C $CHANNEL_NAME -n basic \
    --peerAddresses localhost:7051 --tlsRootCertFiles $manufacturer_PEER_TLSROOTCERT \
    --peerAddresses localhost:9051 --tlsRootCertFiles $WasteCollectionCompany_PEER_TLSROOTCERT \
    --peerAddresses localhost:8051 --tlsRootCertFiles $government_PEER_TLSROOTCERT \
    --peerAddresses localhost:11051 --tlsRootCertFiles $recyclingCenter_PEER_TLSROOTCERT \
    -c '{"function":"updateWasteDetails","Args":["waste-01", "10", "arun"]}'
sleep 3


echo ""
echo "buyWaste function waste-01"
echo ""
export CHANNEL_NAME=managementchannel
export FABRIC_CFG_PATH=./peercfg
export CORE_PEER_LOCALMSPID=manufacturerMSP
export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/manufacturer.management.com/peers/peer0.manufacturer.management.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/manufacturer.management.com/users/Admin@manufacturer.management.com/msp
export CORE_PEER_ADDRESS=localhost:7051
export ORDERER_CA=${PWD}/organizations/ordererOrganizations/management.com/orderers/orderer.management.com/msp/tlscacerts/tlsca.management.com-cert.pem
export manufacturer_PEER_TLSROOTCERT=${PWD}/organizations/peerOrganizations/manufacturer.management.com/peers/peer0.manufacturer.management.com/tls/ca.crt
export WasteCollectionCompany_PEER_TLSROOTCERT=${PWD}/organizations/peerOrganizations/WasteCollectionCompany.management.com/peers/peer0.WasteCollectionCompany.management.com/tls/ca.crt
export government_PEER_TLSROOTCERT=${PWD}/organizations/peerOrganizations/government.management.com/peers/peer0.government.management.com/tls/ca.crt
export recyclingCenter_PEER_TLSROOTCERT=${PWD}/organizations/peerOrganizations/recyclingCenter.management.com/peers/peer0.recyclingCenter.management.com/tls/ca.crt
sleep 3
peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.management.com --tls --cafile $ORDERER_CA -C $CHANNEL_NAME -n basic \
    --peerAddresses localhost:7051 --tlsRootCertFiles $manufacturer_PEER_TLSROOTCERT \
    --peerAddresses localhost:9051 --tlsRootCertFiles $WasteCollectionCompany_PEER_TLSROOTCERT \
    --peerAddresses localhost:8051 --tlsRootCertFiles $government_PEER_TLSROOTCERT \
    --peerAddresses localhost:11051 --tlsRootCertFiles $recyclingCenter_PEER_TLSROOTCERT \
    -c '{"function":"buyWaste","Args":["waste-01","buyed owner"]}'
sleep 3


echo ""
echo "readWaste function waste-01"
echo ""
export CHANNEL_NAME=managementchannel
export FABRIC_CFG_PATH=./peercfg
export CORE_PEER_LOCALMSPID=WasteCollectionCompanyMSP
export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/WasteCollectionCompany.management.com/peers/peer0.WasteCollectionCompany.management.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/WasteCollectionCompany.management.com/users/Admin@WasteCollectionCompany.management.com/msp
export CORE_PEER_ADDRESS=localhost:9051
export ORDERER_CA=${PWD}/organizations/ordererOrganizations/management.com/orderers/orderer.management.com/msp/tlscacerts/tlsca.management.com-cert.pem
export manufacturer_PEER_TLSROOTCERT=${PWD}/organizations/peerOrganizations/manufacturer.management.com/peers/peer0.manufacturer.management.com/tls/ca.crt
export WasteCollectionCompany_PEER_TLSROOTCERT=${PWD}/organizations/peerOrganizations/WasteCollectionCompany.management.com/peers/peer0.WasteCollectionCompany.management.com/tls/ca.crt
export government_PEER_TLSROOTCERT=${PWD}/organizations/peerOrganizations/government.management.com/peers/peer0.government.management.com/tls/ca.crt
export recyclingCenter_PEER_TLSROOTCERT=${PWD}/organizations/peerOrganizations/recyclingCenter.management.com/peers/peer0.recyclingCenter.management.com/tls/ca.crt
sleep 3
peer chaincode query -C $CHANNEL_NAME -n basic -c '{"function":"readWaste","Args":["waste-01"]}'
sleep 3


echo ""
echo "queryAllWaste function"
echo ""
export CHANNEL_NAME=managementchannel
export FABRIC_CFG_PATH=./peercfg
export CORE_PEER_LOCALMSPID=WasteCollectionCompanyMSP
export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/WasteCollectionCompany.management.com/peers/peer0.WasteCollectionCompany.management.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/WasteCollectionCompany.management.com/users/Admin@WasteCollectionCompany.management.com/msp
export CORE_PEER_ADDRESS=localhost:9051
export ORDERER_CA=${PWD}/organizations/ordererOrganizations/management.com/orderers/orderer.management.com/msp/tlscacerts/tlsca.management.com-cert.pem
export manufacturer_PEER_TLSROOTCERT=${PWD}/organizations/peerOrganizations/manufacturer.management.com/peers/peer0.manufacturer.management.com/tls/ca.crt
export WasteCollectionCompany_PEER_TLSROOTCERT=${PWD}/organizations/peerOrganizations/WasteCollectionCompany.management.com/peers/peer0.WasteCollectionCompany.management.com/tls/ca.crt
export government_PEER_TLSROOTCERT=${PWD}/organizations/peerOrganizations/government.management.com/peers/peer0.government.management.com/tls/ca.crt
export recyclingCenter_PEER_TLSROOTCERT=${PWD}/organizations/peerOrganizations/recyclingCenter.management.com/peers/peer0.recyclingCenter.management.com/tls/ca.crt
sleep 3
peer chaincode query -C $CHANNEL_NAME -n basic -c '{"function":"queryAllWaste","Args":[]}'
sleep 3


echo ""
echo "createProduct function p-01,waste-01"
echo ""
export CHANNEL_NAME=managementchannel
export FABRIC_CFG_PATH=./peercfg
export CORE_PEER_LOCALMSPID=manufacturerMSP
export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/manufacturer.management.com/peers/peer0.manufacturer.management.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/manufacturer.management.com/users/Admin@manufacturer.management.com/msp
export CORE_PEER_ADDRESS=localhost:7051
export ORDERER_CA=${PWD}/organizations/ordererOrganizations/management.com/orderers/orderer.management.com/msp/tlscacerts/tlsca.management.com-cert.pem
export manufacturer_PEER_TLSROOTCERT=${PWD}/organizations/peerOrganizations/manufacturer.management.com/peers/peer0.manufacturer.management.com/tls/ca.crt
export WasteCollectionCompany_PEER_TLSROOTCERT=${PWD}/organizations/peerOrganizations/WasteCollectionCompany.management.com/peers/peer0.WasteCollectionCompany.management.com/tls/ca.crt
export government_PEER_TLSROOTCERT=${PWD}/organizations/peerOrganizations/government.management.com/peers/peer0.government.management.com/tls/ca.crt
export recyclingCenter_PEER_TLSROOTCERT=${PWD}/organizations/peerOrganizations/recyclingCenter.management.com/peers/peer0.recyclingCenter.management.com/tls/ca.crt
sleep 3
peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.management.com --tls --cafile $ORDERER_CA -C $CHANNEL_NAME -n basic \
    --peerAddresses localhost:7051 --tlsRootCertFiles $manufacturer_PEER_TLSROOTCERT \
    --peerAddresses localhost:9051 --tlsRootCertFiles $WasteCollectionCompany_PEER_TLSROOTCERT \
    --peerAddresses localhost:8051 --tlsRootCertFiles $government_PEER_TLSROOTCERT \
    --peerAddresses localhost:11051 --tlsRootCertFiles $recyclingCenter_PEER_TLSROOTCERT \
    -c '{"function":"createProduct","Args":["p-01","waste-01","product1"]}'
sleep 3
peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.management.com --tls --cafile $ORDERER_CA -C $CHANNEL_NAME -n basic \
    --peerAddresses localhost:7051 --tlsRootCertFiles $manufacturer_PEER_TLSROOTCERT \
    --peerAddresses localhost:9051 --tlsRootCertFiles $WasteCollectionCompany_PEER_TLSROOTCERT \
    --peerAddresses localhost:8051 --tlsRootCertFiles $government_PEER_TLSROOTCERT \
    --peerAddresses localhost:11051 --tlsRootCertFiles $recyclingCenter_PEER_TLSROOTCERT \
    -c '{"function":"createProduct","Args":["p-02","waste-02","product1"]}'
sleep 3
peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.management.com --tls --cafile $ORDERER_CA -C $CHANNEL_NAME -n basic \
    --peerAddresses localhost:7051 --tlsRootCertFiles $manufacturer_PEER_TLSROOTCERT \
    --peerAddresses localhost:9051 --tlsRootCertFiles $WasteCollectionCompany_PEER_TLSROOTCERT \
    --peerAddresses localhost:8051 --tlsRootCertFiles $government_PEER_TLSROOTCERT \
    --peerAddresses localhost:11051 --tlsRootCertFiles $recyclingCenter_PEER_TLSROOTCERT \
    -c '{"function":"createProduct","Args":["p-03","waste-03","product1"]}'
sleep 3


echo ""
echo "productExist function p-01"
echo ""
export CHANNEL_NAME=managementchannel
export FABRIC_CFG_PATH=./peercfg
export CORE_PEER_LOCALMSPID=manufacturerMSP
export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/manufacturer.management.com/peers/peer0.manufacturer.management.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/manufacturer.management.com/users/Admin@manufacturer.management.com/msp
export CORE_PEER_ADDRESS=localhost:7051
export ORDERER_CA=${PWD}/organizations/ordererOrganizations/management.com/orderers/orderer.management.com/msp/tlscacerts/tlsca.management.com-cert.pem
export manufacturer_PEER_TLSROOTCERT=${PWD}/organizations/peerOrganizations/manufacturer.management.com/peers/peer0.manufacturer.management.com/tls/ca.crt
export WasteCollectionCompany_PEER_TLSROOTCERT=${PWD}/organizations/peerOrganizations/WasteCollectionCompany.management.com/peers/peer0.WasteCollectionCompany.management.com/tls/ca.crt
export government_PEER_TLSROOTCERT=${PWD}/organizations/peerOrganizations/government.management.com/peers/peer0.government.management.com/tls/ca.crt
export recyclingCenter_PEER_TLSROOTCERT=${PWD}/organizations/peerOrganizations/recyclingCenter.management.com/peers/peer0.recyclingCenter.management.com/tls/ca.crt
sleep 3
peer chaincode query -C $CHANNEL_NAME -n basic -c '{"function":"productExist","Args":["p-01"]}'
sleep 3


echo ""
echo "readProduct function p-01"
echo ""
export CHANNEL_NAME=managementchannel
export FABRIC_CFG_PATH=./peercfg
export CORE_PEER_LOCALMSPID=manufacturerMSP
export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/manufacturer.management.com/peers/peer0.manufacturer.management.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/manufacturer.management.com/users/Admin@manufacturer.management.com/msp
export CORE_PEER_ADDRESS=localhost:7051
export ORDERER_CA=${PWD}/organizations/ordererOrganizations/management.com/orderers/orderer.management.com/msp/tlscacerts/tlsca.management.com-cert.pem
export manufacturer_PEER_TLSROOTCERT=${PWD}/organizations/peerOrganizations/manufacturer.management.com/peers/peer0.manufacturer.management.com/tls/ca.crt
export WasteCollectionCompany_PEER_TLSROOTCERT=${PWD}/organizations/peerOrganizations/WasteCollectionCompany.management.com/peers/peer0.WasteCollectionCompany.management.com/tls/ca.crt
export government_PEER_TLSROOTCERT=${PWD}/organizations/peerOrganizations/government.management.com/peers/peer0.government.management.com/tls/ca.crt
export recyclingCenter_PEER_TLSROOTCERT=${PWD}/organizations/peerOrganizations/recyclingCenter.management.com/peers/peer0.recyclingCenter.management.com/tls/ca.crt
sleep 3
peer chaincode query -C $CHANNEL_NAME -n basic -c '{"function":"readProduct","Args":["p-01"]}'
sleep 3


echo ""
echo "queryAllProduct function"
echo ""
export CHANNEL_NAME=managementchannel
export FABRIC_CFG_PATH=./peercfg
export CORE_PEER_LOCALMSPID=manufacturerMSP
export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/manufacturer.management.com/peers/peer0.manufacturer.management.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/manufacturer.management.com/users/Admin@manufacturer.management.com/msp
export CORE_PEER_ADDRESS=localhost:7051
export ORDERER_CA=${PWD}/organizations/ordererOrganizations/management.com/orderers/orderer.management.com/msp/tlscacerts/tlsca.management.com-cert.pem
export manufacturer_PEER_TLSROOTCERT=${PWD}/organizations/peerOrganizations/manufacturer.management.com/peers/peer0.manufacturer.management.com/tls/ca.crt
export WasteCollectionCompany_PEER_TLSROOTCERT=${PWD}/organizations/peerOrganizations/WasteCollectionCompany.management.com/peers/peer0.WasteCollectionCompany.management.com/tls/ca.crt
export government_PEER_TLSROOTCERT=${PWD}/organizations/peerOrganizations/government.management.com/peers/peer0.government.management.com/tls/ca.crt
export recyclingCenter_PEER_TLSROOTCERT=${PWD}/organizations/peerOrganizations/recyclingCenter.management.com/peers/peer0.recyclingCenter.management.com/tls/ca.crt
sleep 3
peer chaincode query -C $CHANNEL_NAME -n basic -c '{"function":"queryAllProduct","Args":[]}'
sleep 3


echo ""
echo "deleteProduct function p-01,p-02,p-03"
echo ""
export CHANNEL_NAME=managementchannel
export FABRIC_CFG_PATH=./peercfg
export CORE_PEER_LOCALMSPID=manufacturerMSP
export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/manufacturer.management.com/peers/peer0.manufacturer.management.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/manufacturer.management.com/users/Admin@manufacturer.management.com/msp
export CORE_PEER_ADDRESS=localhost:7051
export ORDERER_CA=${PWD}/organizations/ordererOrganizations/management.com/orderers/orderer.management.com/msp/tlscacerts/tlsca.management.com-cert.pem
export manufacturer_PEER_TLSROOTCERT=${PWD}/organizations/peerOrganizations/manufacturer.management.com/peers/peer0.manufacturer.management.com/tls/ca.crt
export WasteCollectionCompany_PEER_TLSROOTCERT=${PWD}/organizations/peerOrganizations/WasteCollectionCompany.management.com/peers/peer0.WasteCollectionCompany.management.com/tls/ca.crt
export government_PEER_TLSROOTCERT=${PWD}/organizations/peerOrganizations/government.management.com/peers/peer0.government.management.com/tls/ca.crt
export recyclingCenter_PEER_TLSROOTCERT=${PWD}/organizations/peerOrganizations/recyclingCenter.management.com/peers/peer0.recyclingCenter.management.com/tls/ca.crt
sleep 3
peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.management.com --tls --cafile $ORDERER_CA -C $CHANNEL_NAME -n basic \
    --peerAddresses localhost:7051 --tlsRootCertFiles $manufacturer_PEER_TLSROOTCERT \
    --peerAddresses localhost:9051 --tlsRootCertFiles $WasteCollectionCompany_PEER_TLSROOTCERT \
    --peerAddresses localhost:8051 --tlsRootCertFiles $government_PEER_TLSROOTCERT \
    --peerAddresses localhost:11051 --tlsRootCertFiles $recyclingCenter_PEER_TLSROOTCERT \
    -c '{"function":"deleteProduct","Args":["p-01"]}'
sleep 3
peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.management.com --tls --cafile $ORDERER_CA -C $CHANNEL_NAME -n basic \
    --peerAddresses localhost:7051 --tlsRootCertFiles $manufacturer_PEER_TLSROOTCERT \
    --peerAddresses localhost:9051 --tlsRootCertFiles $WasteCollectionCompany_PEER_TLSROOTCERT \
    --peerAddresses localhost:8051 --tlsRootCertFiles $government_PEER_TLSROOTCERT \
    --peerAddresses localhost:11051 --tlsRootCertFiles $recyclingCenter_PEER_TLSROOTCERT \
    -c '{"function":"deleteProduct","Args":["p-02"]}'
sleep 3
peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.management.com --tls --cafile $ORDERER_CA -C $CHANNEL_NAME -n basic \
    --peerAddresses localhost:7051 --tlsRootCertFiles $manufacturer_PEER_TLSROOTCERT \
    --peerAddresses localhost:9051 --tlsRootCertFiles $WasteCollectionCompany_PEER_TLSROOTCERT \
    --peerAddresses localhost:8051 --tlsRootCertFiles $government_PEER_TLSROOTCERT \
    --peerAddresses localhost:11051 --tlsRootCertFiles $recyclingCenter_PEER_TLSROOTCERT \
    -c '{"function":"deleteProduct","Args":["p-03"]}'
sleep 3


echo ""
echo "deleteWaste function waste-01,waste-02,waste-03"
echo ""
export CHANNEL_NAME=managementchannel
export FABRIC_CFG_PATH=./peercfg
export CORE_PEER_LOCALMSPID=WasteCollectionCompanyMSP
export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/WasteCollectionCompany.management.com/peers/peer0.WasteCollectionCompany.management.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/WasteCollectionCompany.management.com/users/Admin@WasteCollectionCompany.management.com/msp
export CORE_PEER_ADDRESS=localhost:9051
export ORDERER_CA=${PWD}/organizations/ordererOrganizations/management.com/orderers/orderer.management.com/msp/tlscacerts/tlsca.management.com-cert.pem
export manufacturer_PEER_TLSROOTCERT=${PWD}/organizations/peerOrganizations/manufacturer.management.com/peers/peer0.manufacturer.management.com/tls/ca.crt
export WasteCollectionCompany_PEER_TLSROOTCERT=${PWD}/organizations/peerOrganizations/WasteCollectionCompany.management.com/peers/peer0.WasteCollectionCompany.management.com/tls/ca.crt
export government_PEER_TLSROOTCERT=${PWD}/organizations/peerOrganizations/government.management.com/peers/peer0.government.management.com/tls/ca.crt
export recyclingCenter_PEER_TLSROOTCERT=${PWD}/organizations/peerOrganizations/recyclingCenter.management.com/peers/peer0.recyclingCenter.management.com/tls/ca.crt
sleep 3
peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.management.com --tls --cafile $ORDERER_CA -C $CHANNEL_NAME -n basic \
    --peerAddresses localhost:7051 --tlsRootCertFiles $manufacturer_PEER_TLSROOTCERT \
    --peerAddresses localhost:9051 --tlsRootCertFiles $WasteCollectionCompany_PEER_TLSROOTCERT \
    --peerAddresses localhost:8051 --tlsRootCertFiles $government_PEER_TLSROOTCERT \
    --peerAddresses localhost:11051 --tlsRootCertFiles $recyclingCenter_PEER_TLSROOTCERT \
    -c '{"function":"deleteWaste","Args":["waste-01"]}'
sleep 3
peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.management.com --tls --cafile $ORDERER_CA -C $CHANNEL_NAME -n basic \
    --peerAddresses localhost:7051 --tlsRootCertFiles $manufacturer_PEER_TLSROOTCERT \
    --peerAddresses localhost:9051 --tlsRootCertFiles $WasteCollectionCompany_PEER_TLSROOTCERT \
    --peerAddresses localhost:8051 --tlsRootCertFiles $government_PEER_TLSROOTCERT \
    --peerAddresses localhost:11051 --tlsRootCertFiles $recyclingCenter_PEER_TLSROOTCERT \
    -c '{"function":"deleteWaste","Args":["waste-02"]}'
sleep 3
peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.management.com --tls --cafile $ORDERER_CA -C $CHANNEL_NAME -n basic \
    --peerAddresses localhost:7051 --tlsRootCertFiles $manufacturer_PEER_TLSROOTCERT \
    --peerAddresses localhost:9051 --tlsRootCertFiles $WasteCollectionCompany_PEER_TLSROOTCERT \
    --peerAddresses localhost:8051 --tlsRootCertFiles $government_PEER_TLSROOTCERT \
    --peerAddresses localhost:11051 --tlsRootCertFiles $recyclingCenter_PEER_TLSROOTCERT \
    -c '{"function":"deleteWaste","Args":["waste-03"]}'
sleep 3