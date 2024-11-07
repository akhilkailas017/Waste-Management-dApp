#!/bin/bash


export CHANNEL_NAME=managementchannel
export FABRIC_CFG_PATH=./peercfg
export CORE_PEER_LOCALMSPID=governmentMSP
export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/government.management.com/peers/peer0.government.management.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/government.management.com/users/Admin@government.management.com/msp
export CORE_PEER_ADDRESS=localhost:8051
export ORDERER_CA=${PWD}/organizations/ordererOrganizations/management.com/orderers/orderer.management.com/msp/tlscacerts/tlsca.management.com-cert.pem
export manufacturer_PEER_TLSROOTCERT=${PWD}/organizations/peerOrganizations/manufacturer.management.com/peers/peer0.manufacturer.management.com/tls/ca.crt
export WasteCollectionCompany_PEER_TLSROOTCERT=${PWD}/organizations/peerOrganizations/WasteCollectionCompany.management.com/peers/peer0.WasteCollectionCompany.management.com/tls/ca.crt
export government_PEER_TLSROOTCERT=${PWD}/organizations/peerOrganizations/government.management.com/peers/peer0.government.management.com/tls/ca.crt
export recyclingCenter_PEER_TLSROOTCERT=${PWD}/organizations/peerOrganizations/recyclingCenter.management.com/peers/peer0.recyclingCenter.management.com/tls/ca.crt
sleep 3
# peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.management.com --tls --cafile $ORDERER_CA -C $CHANNEL_NAME -n basic \
#     --peerAddresses localhost:9051 --tlsRootCertFiles $WasteCollectionCompany_PEER_TLSROOTCERT \
#     --peerAddresses localhost:8051 --tlsRootCertFiles $government_PEER_TLSROOTCERT \
#     -c '{"function":"govContract:useVoucher","Args":["v-02"]}'
peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.management.com --tls --cafile $ORDERER_CA -C $CHANNEL_NAME -n basic \
    --peerAddresses localhost:9051 --tlsRootCertFiles $WasteCollectionCompany_PEER_TLSROOTCERT \
    --peerAddresses localhost:8051 --tlsRootCertFiles $government_PEER_TLSROOTCERT \
    -c '{"function":"govContract:updatev","Args":["v-02"]}'