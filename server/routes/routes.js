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


router.post("/deleteWaste", async (req, res) => {
  try {
    const { wasteId } = req.body;

    let WasteCollectionCompanyClient = new clientApplication();

    const result = await WasteCollectionCompanyClient.submitTxn(
      "WasteCollectionCompany",
      "managementchannel",
      "basic",
      "collectionContract",
      "invokeTxn",
      "",
      "deleteWaste",
      wasteId
    );

    res.status(201).json({
      success: true,
      message: "waste deleted successfully!",
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

router.post("/updateWasteDetails", async (req, res) => {
  try {
    const { wasteId , reusableWeight, owner } = req.body;

    let recyclingCenterClient = new clientApplication();

    const result = await recyclingCenterClient.submitTxn(
      "recyclingCenter",
      "managementchannel",
      "basic",
      "collectionContract",
      "invokeTxn",
      "",
      "updateWasteDetails",
      wasteId,
      reusableWeight,
      owner
    );

    res.status(201).json({
      success: true,
      message: "waste updated successfully!",
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

router.post("/buyWaste", async (req, res) => {
  try {
    const { wasteId , owner } = req.body;

    let manufacturerClient = new clientApplication();

    const result = await manufacturerClient.submitTxn(
      "manufacturer",
      "managementchannel",
      "basic",
      "collectionContract",
      "invokeTxn",
      "",
      "buyWaste",
      wasteId,
      owner
    );

    res.status(201).json({
      success: true,
      message: "waste buyed successfully!",
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


router.post("/createProduct", async (req, res) => {
  try {
    const { productId, wasteId , name } = req.body;

    let manufacturerClient = new clientApplication();

    const result = await manufacturerClient.submitTxn(
      "manufacturer",
      "managementchannel",
      "basic",
      "collectionContract",
      "invokeTxn",
      "",
      "createProduct",
      productId,
      wasteId,
      name
    );

    res.status(201).json({
      success: true,
      message: "Product created successfully!",
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

router.post("/readProduct", async (req, res) => {
  try {
    const { productId } = req.body;
    let manufacturerClient = new clientApplication();
    let waste = await manufacturerClient.submitTxn(
      "manufacturer",
      "managementchannel",
      "basic",
      "collectionContract",
      "queryTxn",
      "",
      "readProduct",
      productId
    );
    const data = new TextDecoder().decode(waste);
    const value = JSON.parse(data);

    res.status(200).json({
      success: true,
      message: "product read successfully!",
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

router.post("/deleteProduct", async (req, res) => {
  try {
    const { productId } = req.body;

    let manufacturerClient = new clientApplication();

    const result = await manufacturerClient.submitTxn(
      "manufacturer",
      "managementchannel",
      "basic",
      "collectionContract",
      "invokeTxn",
      "",
      "deleteProduct",
      productId,
    );

    res.status(201).json({
      success: true,
      message: "Product deleted successfully!",
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

router.post("/queryAllWaste", async (req, res) => {
  try {
    let WasteCollectionCompanyClient = new clientApplication();
    let waste = await WasteCollectionCompanyClient.submitTxn(
      "WasteCollectionCompany",
      "managementchannel",
      "basic",
      "collectionContract",
      "queryTxn",
      "",
      "queryAllWaste"
    );
    const data = new TextDecoder().decode(waste);
    const value = JSON.parse(data);

    res.status(200).json({
      success: true,
      message: "data query successfully!",
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

router.post("/queryAllProduct", async (req, res) => {
  try {
    let manufacturerClient = new clientApplication();
    let products = await manufacturerClient.submitTxn(
      "manufacturer",
      "managementchannel",
      "basic",
      "collectionContract",
      "queryTxn",
      "",
      "queryAllProduct"
    );
    const data = new TextDecoder().decode(products);
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


router.post("/createVoucher", async (req, res) => {
  try {
    const { voucherId, wasteId, type, amount } = req.body;

    let governmentClient = new clientApplication();

    // Prepare transient data
    const transientData = new Map();
    transientData.set("wasteId", Buffer.from(wasteId));  // Ensure wasteId is valid
    transientData.set("type", Buffer.from(type));        // Ensure type is valid
    transientData.set("amount", Buffer.from(amount));    // Ensure amount is valid

    // Debug: log transient data to ensure it's set correctly
    console.log("Transient Data:", transientData);

    const result = await governmentClient.submitTxn(
      "government", // Organization (government)
      "managementchannel", // Channel name
      "basic", // Chaincode name (ensure your contract supports this)
      "govContract", // Contract name
      "privateTxn", // Transaction type (private)
      transientData, // Transient data
      "createVoucher", // Function name
      voucherId // Pass voucherId
    );

    res.status(201).json({
      success: true,
      message: "Voucher created successfully!",
      data: { result },
    });
  } catch (error) {
    // Debug: log error to understand the issue
    console.error("Error creating voucher:", error);
    res.status(500).json({
      success: false,
      message: "Error creating voucher!",
      data: { error },
    });
  }
});

router.post("/readVoucher", async (req, res) => {
  try {
    const { voucherId } = req.body;

    let governmentClient = new clientApplication();

    const result = await governmentClient.submitTxn(
      "government", // Organization (government)
      "managementchannel", // Channel name
      "basic", // Chaincode name
      "govContract", // Contract name
      "queryTxn", // Transaction type
      "", // No transient data for querying
      "readVoucher", // Function name
      voucherId // Pass voucherId for querying
    );

    // Decode the result (ensure it returns a Buffer to decode)
    const decodedString = new TextDecoder().decode(result);
    const jsonObject = JSON.parse(decodedString);

    res.status(200).json({
      success: true,
      message: "Voucher details retrieved successfully!",
      data: { value: jsonObject },
    });
  } catch (error) {
    // Debug: log error to understand the issue
    console.error("Error retrieving voucher:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving voucher details!",
      data: { error },
    });
  }
});



module.exports = router;