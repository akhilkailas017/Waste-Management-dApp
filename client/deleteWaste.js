const { clientApplication } = require('./client');

let userClient = new clientApplication();
userClient.submitTxn(
    "WasteCollectionCompany",            // User role
    "managementchannel",              // Channel name
    "basic",      // Chaincode name
    "collectionContract",              // Contract name
    "invokeTxn",                  // Transaction function
    "",                           // No additional arguments for invokeTxn
    "deleteWaste",                // Method to be invoked
    "W-1",                  // wasteId
).then(result => {
    console.log(new TextDecoder().decode(result));
    console.log("Waste record successfully created");
});