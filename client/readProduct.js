const { clientApplication } = require('./client')

let userClient = new clientApplication()
userClient.submitTxn(
    "manufacturer", //user role
    "managementchannel", //channel name
    "basic", //chaincode name
    "collectionContract",
    "queryTxn",
    "",
    "readProduct",
    "P-1",
).then(result => {
            // Decode the Uint8Array to a string
            const decodedString = new TextDecoder().decode(result);
    
            // Parse the string as JSON
            const jsonObject = JSON.parse(decodedString);
            
            console.log("product details: ")
            // Log the JSON object
            console.log(jsonObject);
});



