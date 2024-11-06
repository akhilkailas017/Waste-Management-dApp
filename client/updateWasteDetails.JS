const { clientApplication } = require('./client');

let userClient = new clientApplication();
userClient.submitTxn(
    "recyclingCenter",            // User role
    "managementchannel",              // Channel name
    "basic",      // Chaincode name
    "collectionContract",              // Contract name
    "invokeTxn",                  // Transaction function
    "",                           // No additional arguments for invokeTxn
    "updateWasteDetails",                // Method to be invoked
    "W-1",                  // wasteId
    "50",                 // reusable weight
    "Arun"                        // owner
).then(result => {
    console.log(new TextDecoder().decode(result));
    console.log("Waste record successfully created");
});