#!/bin/bash

# Setting Channel and Fabric Config Path
export CHANNEL_NAME=managementchannel
export FABRIC_CFG_PATH=./peercfg

# Orderer TLS and CA configuration
export ORDERER_CA=${PWD}/organizations/ordererOrganizations/management.com/orderers/orderer.management.com/msp/tlscacerts/tlsca.management.com-cert.pem

# Peers TLS Root Certificates
export manufacturer_PEER_TLSROOTCERT=${PWD}/organizations/peerOrganizations/manufacturer.management.com/peers/peer0.manufacturer.management.com/tls/ca.crt
export WasteCollectionCompany_PEER_TLSROOTCERT=${PWD}/organizations/peerOrganizations/WasteCollectionCompany.management.com/peers/peer0.WasteCollectionCompany.management.com/tls/ca.crt
export government_PEER_TLSROOTCERT=${PWD}/organizations/peerOrganizations/government.management.com/peers/peer0.government.management.com/tls/ca.crt
export recyclingCenter_PEER_TLSROOTCERT=${PWD}/organizations/peerOrganizations/recyclingCenter.management.com/peers/peer0.recyclingCenter.management.com/tls/ca.crt

# Setting peer environment for the Government Peer
export CORE_PEER_LOCALMSPID=governmentMSP
export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/government.management.com/peers/peer0.government.management.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/government.management.com/users/Admin@government.management.com/msp
export CORE_PEER_ADDRESS=localhost:8051

# Wait a few seconds for peer containers to be ready
sleep 3

# List of peer containers
declare -A peer_containers
peer_containers=( 
    [manufacturer]="peer0.manufacturer.management.com"
    [WasteCollectionCompany]="peer0.WasteCollectionCompany.management.com"
    [government]="peer0.government.management.com"
    [recyclingCenter]="peer0.recyclingCenter.management.com"
)

# Check if peers are synchronized
for peer in "${!peer_containers[@]}"; do
    container_name=${peer_containers[$peer]}
    if ! docker ps | grep -q "${container_name}"; then
        echo "Container $container_name does not exist. Please check if it is running."
        exit 1
    fi
    if ! docker exec -it "${container_name}" peer channel list | grep -q "${CHANNEL_NAME}"; then
        echo "Peer $container_name is not synchronized with the channel ${CHANNEL_NAME}."
        exit 1
    fi
done

# Chaincode invocation
peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.management.com --tls --cafile $ORDERER_CA -C $CHANNEL_NAME -n basic \
    --peerAddresses localhost:7051 --tlsRootCertFiles $manufacturer_PEER_TLSROOTCERT \
    --peerAddresses localhost:9051 --tlsRootCertFiles $WasteCollectionCompany_PEER_TLSROOTCERT \
    --peerAddresses localhost:8051 --tlsRootCertFiles $government_PEER_TLSROOTCERT \
    --peerAddresses localhost:11051 --tlsRootCertFiles $recyclingCenter_PEER_TLSROOTCERT \
    -c '{"function":"govContract:useVoucher","Args":["v-01"]}'

# Wait for transaction to process
sleep 3
