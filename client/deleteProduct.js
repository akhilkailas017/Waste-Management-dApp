const { clientApplication } = require('./client');

let userClient = new clientApplication();
userClient.submitTxn(
    "manufacturer",            // User role
    "managementchannel",              // Channel name
    "basic",      // Chaincode name
    "collectionContract",              // Contract name
    "invokeTxn",                  // Transaction function
    "",                           // No additional arguments for invokeTxn
    "deleteProduct",                // Method to be invoked
    "P-1",                  // productId
).then(result => {
    console.log(new TextDecoder().decode(result));
    console.log("Waste record successfully created");
});