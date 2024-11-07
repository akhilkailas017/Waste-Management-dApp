let profile = {
    manufacturer: {
        "cryptoPath": "../network/organizations/peerOrganizations/manufacturer.management.com", 
		"keyDirectoryPath": "../network/organizations/peerOrganizations/manufacturer.management.com/users/User1@manufacturer.management.com/msp/keystore/",
        "certPath":     "../network/organizations/peerOrganizations/manufacturer.management.com/users/User1@manufacturer.management.com/msp/signcerts/cert.pem",
		"tlsCertPath":  "../network/organizations/peerOrganizations/manufacturer.management.com/peers/peer0.manufacturer.management.com/tls/ca.crt",
		"peerEndpoint": "localhost:7051",
		"peerHostAlias":  "peer0.manufacturer.management.com",
        "mspId": "manufacturerMSP"
    },
    WasteCollectionCompany: {
        "cryptoPath": "../network/organizations/peerOrganizations/WasteCollectionCompany.management.com", 
		"keyDirectoryPath": "../network/organizations/peerOrganizations/WasteCollectionCompany.management.com/users/User1@WasteCollectionCompany.management.com/msp/keystore/",
        "certPath":     "../network/organizations/peerOrganizations/WasteCollectionCompany.management.com/users/User1@WasteCollectionCompany.management.com/msp/signcerts/cert.pem",
		"tlsCertPath":  "../network/organizations/peerOrganizations/WasteCollectionCompany.management.com/peers/peer0.WasteCollectionCompany.management.com/tls/ca.crt",
		"peerEndpoint": "localhost:9051",
		"peerHostAlias":  "peer0.WasteCollectionCompany.management.com",
        "mspId": "WasteCollectionCompanyMSP"
    },
    government: {
        "cryptoPath": "../network/organizations/peerOrganizations/government.management.com", 
		"keyDirectoryPath": "../network/organizations/peerOrganizations/government.management.com/users/User1@government.management.com/msp/keystore/",
        "certPath":     "../network/organizations/peerOrganizations/government.management.com/users/User1@government.management.com/msp/signcerts/cert.pem",
		"tlsCertPath":  "../network/organizations/peerOrganizations/government.management.com/peers/peer0.government.management.com/tls/ca.crt",
		"peerEndpoint": "localhost:8051",
		"peerHostAlias":  "peer0.government.management.com",
        "mspId": "governmentMSP"
    },
    recyclingCenter: {
        "cryptoPath": "../network/organizations/peerOrganizations/recyclingCenter.management.com", 
		"keyDirectoryPath": "../network/organizations/peerOrganizations/recyclingCenter.management.com/users/User1@recyclingCenter.management.com/msp/keystore/",
        "certPath":     "../network/organizations/peerOrganizations/recyclingCenter.management.com/users/User1@recyclingCenter.management.com/msp/signcerts/cert.pem",
		"tlsCertPath":  "../network/organizations/peerOrganizations/recyclingCenter.management.com/peers/peer0.recyclingCenter.management.com/tls/ca.crt",
		"peerEndpoint": "localhost:11051",
		"peerHostAlias":  "peer0.recyclingCenter.management.com",
        "mspId": "recyclingCenterMSP"
    }
}
module.exports = { profile }
