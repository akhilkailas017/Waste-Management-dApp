const { clientApplication } = require('./client')

let userClient = new clientApplication();

const transientData = {
    wasteId: Buffer.from("W-1"),
    type: Buffer.from("incentive"),
    amount: Buffer.from("100")
}

userClient.submitTxn(
    "government",
    "managementchannel",
    "basic",
    "govContract",
    "privateTxn",
    transientData,
    "createVoucher",
    "V-1",
).then(result => {
    console.log(new TextDecoder().decode(result))
    console.log("Order successfully created")
})