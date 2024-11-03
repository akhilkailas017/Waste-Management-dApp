"use strict";

const { Contract } = require("fabric-contract-api");

async function getCollectionName(ctx) {
    const collectionName = 'WasteCollection';
    console.log(`Collection name retrieved: ${collectionName}`);
    return collectionName;
}

class Waste extends Contract {

    async wasteExists(ctx, wasteId) {
        const buffer = await ctx.stub.getState(wasteId);
        const exists = !!buffer && buffer.length > 0;
        console.log(`Checking if waste exists with ID ${wasteId}: ${exists}`);
        return exists;
    }

    async createWaste(ctx, wasteId, collectionCompany, totalWeight, owner) {
        const mspID = ctx.clientIdentity.getMSPID();
        console.log(`MSP ID for createWaste: ${mspID}`);
        if (mspID === "wasteCollectionCompanyMSP") {
            const exists = await this.wasteExists(ctx, wasteId);
            if (exists) {
                throw new Error(`The waste with ID ${wasteId} already exists`);
            }
            const waste = {
                wasteId,
                collectionCompany,
                totalWeight: parseFloat(totalWeight),
                owner,
                status: "In Waste Collection Company",
                assetType: "waste",
            };
            const buffer = Buffer.from(JSON.stringify(waste));
            await ctx.stub.putState(wasteId, buffer);
            console.log(`Waste with ID ${wasteId} created successfully.`);
            return `Waste with ID ${wasteId} created successfully.`;
        } else {
            throw new Error("Unauthorized MSP");
        }
    }

    async readWaste(ctx, wasteId) {
        const exists = await this.wasteExists(ctx, wasteId);
        if (!exists) {
            throw new Error(`The waste with ID ${wasteId} does not exist`);
        }
        const buffer = await ctx.stub.getState(wasteId);
        const waste = JSON.parse(buffer.toString());
        console.log(`Read waste details: ${JSON.stringify(waste)}`);
        return waste;
    }

    async deleteWaste(ctx, wasteId) {
        const mspID = ctx.clientIdentity.getMSPID();
        console.log(`MSP ID for deleteWaste: ${mspID}`);
        if (mspID === "wasteCollectionCompanyMSP") {
            const exists = await this.wasteExists(ctx, wasteId);
            if (!exists) {
                throw new Error(`The waste with ID ${wasteId} does not exist`);
            }
            await ctx.stub.deleteState(wasteId);
            console.log(`Waste with ID ${wasteId} deleted successfully.`);
            return `Waste with ID ${wasteId} deleted successfully.`;
        } else {
            throw new Error("Unauthorized MSP");
        }
    }

    async upsertWasteDetails(ctx, wasteId, reusableWeight, owner) {
        const mspID = ctx.clientIdentity.getMSPID();
        console.log(`MSP ID for upsertWasteDetails: ${mspID}`);
        if (mspID !== "recyclingcenterMSP") {
            throw new Error("Unauthorized MSP");
        }
        const exists = await this.wasteExists(ctx, wasteId);
        if (!exists) {
            throw new Error(`The waste with ID ${wasteId} does not exist`);
        }
        const buffer = await ctx.stub.getState(wasteId);
        const waste = JSON.parse(buffer.toString());
        waste.reusableWeight = parseFloat(reusableWeight);
        if (waste.totalWeight > 0) {
            waste.usablePercentage = (waste.reusableWeight / waste.totalWeight) * 100;
        } else {
            throw new Error("Total weight must be greater than zero to calculate usable percentage");
        }
        waste.status = "at Recycling Center";
        waste.owner = owner;
        const updatedBuffer = Buffer.from(JSON.stringify(waste));
        await ctx.stub.putState(wasteId, updatedBuffer);
        console.log(`Waste with ID ${wasteId} updated successfully with reusable weight and usable percentage.`);
        return `Waste with ID ${wasteId} updated successfully with reusable weight and usable percentage.`;
    }

    async voucherExists(ctx, voucherId) {
        const collectionName = await getCollectionName(ctx);
        const data = await ctx.stub.getPrivateDataHash(collectionName, voucherId);
        const exists = !!data && data.length > 0;
        console.log(`Checking if voucher exists with ID ${voucherId}: ${exists}`);
        return exists;
    }

    async issueVoucher(ctx, voucherId) {
        const mspid = ctx.clientIdentity.getMSPID();
        console.log(`MSP ID for issueVoucher: ${mspid}`);
        if (mspid !== 'governmentMSP') {
            throw new Error(`Organisation with MSP ID ${mspid} cannot perform this action.`);
        }
    
        // Check if the voucher already exists in private data
        const collectionName = 'WasteCollection';
        const exists = await this.voucherExists(ctx, voucherId);
        if (exists) {
            throw new Error(`The asset order ${voucherId} already exists`);
        }
    
        // Retrieve and validate transient data
        const transientData = ctx.stub.getTransient();
        console.log("Received transient data:", JSON.stringify(Object.fromEntries(transientData.entries())));
    
        if (!transientData.has('wasteId') || !transientData.has('type') || !transientData.has('amount')) {
            throw new Error('The expected key was not specified in transient data. Please provide wasteId, type, and amount.');
        }
    
        const wasteId = transientData.get('wasteId').toString();
        const type = transientData.get('type').toString();
        const amount = transientData.get('amount').toString();
    
        // Check for valid type and non-empty values
        if (!wasteId || !type || !amount) {
            throw new Error('Transient data fields wasteId, type, and amount cannot be empty.');
        }
    
        if (type !== "incentive" && type !== "penalty") {
            throw new Error("Invalid type. Must be either 'incentive' or 'penalty'");
        }
    
        // Retrieve waste asset to ensure wasteId exists
        const wasteBuffer = await ctx.stub.getState(wasteId);
        if (!wasteBuffer || wasteBuffer.length === 0) {
            throw new Error(`The waste with ID ${wasteId} does not exist`);
        }
        const waste = JSON.parse(wasteBuffer.toString());
    
        // Create VoucherAsset and store it in the private data collection
        const VoucherAsset = {
            wasteId,
            type,
            amount,
            status: 'issued',
            collectionCompany: waste.collectionCompany,
            assetType: 'voucher'
        };
    
        await ctx.stub.putPrivateData(collectionName, voucherId, Buffer.from(JSON.stringify(VoucherAsset)));
        console.log(`Voucher with ID ${voucherId} issued successfully.`);
        return `Voucher with ID ${voucherId} issued successfully.`;
    }
    

    async readVoucher(ctx, voucherId) {
        const exists = await this.voucherExists(ctx, voucherId);
        if (!exists) {
            throw new Error(`The voucher with ID ${voucherId} does not exist`);
        }
        const collectionName = await getCollectionName(ctx);
        const privateData = await ctx.stub.getPrivateData(collectionName, voucherId);
        const voucher = JSON.parse(privateData.toString());
        console.log(`Read voucher details: ${JSON.stringify(voucher)}`);
        return voucher;
    }

    async useVoucher(ctx, voucherId) {
        const exists = await this.voucherExists(ctx, voucherId);
        if (!exists) {
            throw new Error(`The voucher with ID ${voucherId} does not exist`);
        }
        const collectionName = await getCollectionName(ctx);
        const privateData = await ctx.stub.getPrivateData(collectionName, voucherId);
        const voucher = JSON.parse(privateData.toString());
        voucher.status = "used";
        await ctx.stub.putPrivateData(collectionName, voucherId, Buffer.from(JSON.stringify(voucher)));
        console.log(`Voucher with ID ${voucherId} used successfully.`);
        return `Voucher with ID ${voucherId} used successfully.`;
    }

    async buyWaste(ctx, wasteId, owner) {
        const mspID = ctx.clientIdentity.getMSPID();
        console.log(`MSP ID for buyWaste: ${mspID}`);
        if (mspID !== "manufactureMSP") {
            throw new Error("Unauthorized MSP");
        }
        const exists = await this.wasteExists(ctx, wasteId);
        if (!exists) {
            throw new Error(`The waste with ID ${wasteId} does not exist`);
        }
        const buffer = await ctx.stub.getState(wasteId);
        const waste = JSON.parse(buffer.toString());
        waste.status = "at Manufacture";
        waste.owner = owner;
        const updatedBuffer = Buffer.from(JSON.stringify(waste));
        await ctx.stub.putState(wasteId, updatedBuffer);
        console.log(`Waste with ID ${wasteId} bought successfully.`);
        return `Waste with ID ${wasteId} bought successfully.`;
    }
}

module.exports = Waste;
