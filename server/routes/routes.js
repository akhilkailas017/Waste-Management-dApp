const express = require("express");
const router = express.Router();
const { clientApplication } = require("./client");

router.post("/readWaste", async (req, res) => {
  try {
    const { wasteId } = req.body;
    let WasteCollectionCompanyClient = new clientApplication();
    let waste = await WasteCollectionCompanyClient.submitTxn(
      "WasteCollectionCompany",
      "managementchannel",
      "basic",
      "collectionContract",
      "queryTxn",
      "",
      "readWaste",
      wasteId
    );
    const data = new TextDecoder().decode(waste);
    const value = JSON.parse(data);

    res.status(200).json({
      success: true,
      message: "data read successfully!",
      data: { value },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Please check the ID!",
      data: { error },
    });
  }
});

router.post("/createWaste", async (req, res) => {
  try {
    const { wasteId, collectionCompany, totalWeight, owner } = req.body;

    let WasteCollectionCompanyClient = new clientApplication();

    const result = await WasteCollectionCompanyClient.submitTxn(
      "WasteCollectionCompany",
      "managementchannel",
      "basic",
      "collectionContract",
      "invokeTxn",
      "",
      "createWaste",
      wasteId,
      collectionCompany,
      totalWeight,
      owner
    );

    res.status(201).json({
      success: true,
      message: "waste created successfully!",
      data: { result },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Please check the  ID!",
      data: { error },
    });
  }
});


module.exports = router;


// const express = require("express");
// const router = express.Router();
// const { clientApplication } = require("./client");

// router.post("/createWaste", async (req, res) => {
//   try {
//     const { wasteId, collectionCompany, totalWeight, owner } = req.body;
//     const mspID = "WasteCollectionCompanyMSP";  // Only WasteCollectionCompanyMSP can create waste

//     let userClient = new clientApplication();
//     const result = await userClient.submitTxn(
//       mspID,
//       "managementchannel",
//       "basic",
//       "collectionContract",
//       "invokeTxn",
//       "",
//       "createWaste",
//       wasteId,
//       collectionCompany,
//       totalWeight,
//       owner
//     );

//     res.status(201).json({
//       success: true,
//       message: "Waste record created successfully!",
//       data: JSON.parse(result.toString())
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to create waste record. Please check the input data!",
//       data: { error: error.message },
//     });
//   }
// });

// router.post("/readWaste", async (req, res) => {
//   try {
//     const { wasteId } = req.body;

//     let userClient = new clientApplication();
//     const wasteRecord = await userClient.submitTxn(
//       "WasteCollectionCompany",
//       "managementchannel",
//       "basic",
//       "collectionContract",
//       "queryTxn",
//       "",
//       "readWaste",
//       wasteId
//     );

//     const wasteData = JSON.parse(wasteRecord.toString());
//     res.status(200).json({
//       success: true,
//       message: "Waste data retrieved successfully!",
//       data: wasteData,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to read waste data. Please check the Waste ID!",
//       data: { error: error.message },
//     });
//   }
// });

// router.post("/updateWasteDetails", async (req, res) => {
//   try {
//     const { wasteId, reusableWeight, owner } = req.body;
//     const mspID = "recyclingCenterMSP"; // Only recyclingCenterMSP can update waste details

//     let userClient = new clientApplication();
//     const result = await userClient.submitTxn(
//       mspID,
//       "managementchannel",
//       "basic",
//       "collectionContract",
//       "invokeTxn",
//       "",
//       "updateWasteDetails",
//       wasteId,
//       reusableWeight,
//       owner
//     );

//     res.status(200).json({
//       success: true,
//       message: `Waste details for ID ${wasteId} updated successfully.`,
//       data: JSON.parse(result.toString())
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to update waste details.",
//       data: { error: error.message },
//     });
//   }
// });

// router.post("/buyWaste", async (req, res) => {
//   try {
//     const { wasteId, owner } = req.body;
//     const mspID = "manufacturerMSP"; // Only manufacturerMSP can buy waste

//     let userClient = new clientApplication();
//     const result = await userClient.submitTxn(
//       mspID,
//       "managementchannel",
//       "basic",
//       "collectionContract",
//       "invokeTxn",
//       "",
//       "buyWaste",
//       wasteId,
//       owner
//     );

//     res.status(200).json({
//       success: true,
//       message: `Waste with ID ${wasteId} bought successfully.`,
//       data: JSON.parse(result.toString())
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to buy waste. Please check the input data!",
//       data: { error: error.message },
//     });
//   }
// });

// router.post("/useVoucher", async (req, res) => {
//   try {
//     const { wasteId, voucherId } = req.body;
//     const mspID = "governmentMSP"; // Only governmentMSP can use vouchers

//     let userClient = new clientApplication();
//     const result = await userClient.submitTxn(
//       mspID,
//       "managementchannel",
//       "basic",
//       "collectionContract",
//       "invokeTxn",
//       "",
//       "useVoucher1",
//       wasteId,
//       voucherId
//     );

//     res.status(200).json({
//       success: true,
//       message: `Voucher with ID ${voucherId} used successfully for waste ID ${wasteId}.`,
//       data: JSON.parse(result.toString())
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to use voucher. Please check the input data!",
//       data: { error: error.message },
//     });
//   }
// });

// module.exports = router;
