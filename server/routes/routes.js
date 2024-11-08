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
  const { voucherId, wasteId, type, amount } = req.body;
  let userClient = new clientApplication();
  if (!voucherId || !wasteId || !type || !amount) {
      return res.status(400).json({ message: "All fields are required." });
  }

  try {
      const transientData = {
          wasteId: Buffer.from(wasteId),
          type: Buffer.from(type),
          amount: Buffer.from(amount),
      };
      console.log("transient data",transientData);
      
      const result = await userClient.submitTxn(
          "government",
          "managementchannel",
          "basic",
          "govContract",
          "privateTxn",
          transientData,
          "createVoucher",
          voucherId
      );

      res.status(200).json({ message: "created successfully.", result: new TextDecoder().decode(result) });
  } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ message: "Error creating.", error: error.message });
  }
});


router.get("/readVoucher", async (req, res) => {
  // const { voucherId } = req.body;
  const { voucherId } = req.query;
  let userClient = new clientApplication();

  try {
      const result = await userClient.submitTxn(
          "government",
          "managementchannel",
          "basic",
          "govContract",
          "queryTxn",
          "",
          "readVoucher",
          voucherId
      );

      const decodedResult = new TextDecoder().decode(result);
      res.status(200).json(JSON.parse(decodedResult));
  } catch (error) {
      console.error("Error reading :", error);
      res.status(500).json({ message: `Error reading  ${voucherId}.`, error: error.message });
  }
});



module.exports = router;