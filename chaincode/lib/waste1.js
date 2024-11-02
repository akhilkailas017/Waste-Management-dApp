"use strict";

const { Contract } = require("fabric-contract-api");

// Utility function to get the collection name
async function getCollectionName(ctx) {
    const collectionName = 'WasteCollection';
    console.log(`Collection name retrieved: ${collectionName}`);
    return collectionName;
}

class Waste extends Contract {

    // Check if a waste asset exists
    async wasteExists(ctx, wasteId) {
        const buffer = await ctx.stub.getState(wasteId);
        const exists = !!buffer && buffer.length > 0;
        console.log(`Checking if waste exists with ID ${wasteId}: ${exists}`);
        return exists;
    }

    // Create a new waste asset, accessible only to waste collection companies
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
            throw new Error("Unauthorized MSP: Only waste collection companies can create waste assets.");
        }
    }

    // Read a waste asset's details
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

    // Delete a waste asset, accessible only to waste collection companies
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
            throw new Error("Unauthorized MSP: Only waste collection companies can delete waste assets.");
        }
    }

    // Upsert details of waste at the recycling center, accessible only to recycling centers
    async upsertWasteDetails(ctx, wasteId, reusableWeight, owner) {
        const mspID = ctx.clientIdentity.getMSPID();
        console.log(`MSP ID for upsertWasteDetails: ${mspID}`);
        if (mspID !== "recyclingcenterMSP") {
            throw new Error("Unauthorized MSP: Only recycling centers can update waste details.");
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
        waste.status = "At Recycling Center";
        waste.owner = owner;
        const updatedBuffer = Buffer.from(JSON.stringify(waste));
        await ctx.stub.putState(wasteId, updatedBuffer);
        console.log(`Waste with ID ${wasteId} updated successfully with reusable weight and usable percentage.`);
        return `Waste with ID ${wasteId} updated successfully with reusable weight and usable percentage.`;
    }

    // Check if a voucher exists in private data
    async voucherExists(ctx, voucherId) {
        const collectionName = await getCollectionName(ctx);
        const data = await ctx.stub.getPrivateDataHash(collectionName, voucherId);
        const exists = !!data && data.length > 0;
        console.log(`Checking if voucher exists with ID ${voucherId}: ${exists}`);
        return exists;
    }

    // Issue a new voucher, accessible only to the government
    async issueVoucher(ctx, voucherId) {
        const mspid = ctx.clientIdentity.getMSPID();
        console.log(`MSP ID for issueVoucher: ${mspid}`);
        if (mspid === 'governmentMSP') {
            const exists = await this.voucherExists(ctx, voucherId);
            if (exists) {
                throw new Error(`The voucher with ID ${voucherId} already exists`);
            }

            const transientData = ctx.stub.getTransient();
            if (transientData.size === 0 || !transientData.has('wasteId') || !transientData.has('type') || !transientData.has('amount')) {
                throw new Error('Expected transient data keys were not provided. Please include wasteId, type, and amount.');
            }

            const wasteId = transientData.get('wasteId').toString();
            const wasteBuffer = await ctx.stub.getState(wasteId);
            if (!wasteBuffer || wasteBuffer.length === 0) {
                throw new Error(`The waste with ID ${wasteId} does not exist`);
            }
            const waste = JSON.parse(wasteBuffer.toString());

            const VoucherAsset = {
                wasteId,
                type: transientData.get('type').toString(),
                amount: transientData.get('amount').toString(),
                status: 'issued',
                collectionCompany: waste.collectionCompany,
                assetType: 'voucher'
            };

            if (VoucherAsset.type !== "incentive" && VoucherAsset.type !== "penalty") {
                throw new Error("Invalid type. Must be either 'incentive' or 'penalty'");
            }

            const collectionName = await getCollectionName(ctx);
            await ctx.stub.putPrivateData(collectionName, voucherId, Buffer.from(JSON.stringify(VoucherAsset)));
            console.log(`Voucher with ID ${voucherId} issued successfully.`);
            return `Voucher with ID ${voucherId} issued successfully.`;
        } else {
            throw new Error(`Organization with MSP ID ${mspid} is not authorized to issue vouchers.`);
        }
    }

    // Read voucher details, accessible only to the waste collection company
    async readVoucher(ctx, voucherId) {
        const mspID = ctx.clientIdentity.getMSPID();
        if (mspID !== "wasteCollectionCompanyMSP") {
            throw new Error("Unauthorized MSP: Only waste collection companies can read vouchers.");
        }
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

    // Mark a voucher as used, accessible only to the government
    async useVoucher(ctx, voucherId) {
        const mspid = ctx.clientIdentity.getMSPID();
        console.log(`MSP ID for useVoucher: ${mspid}`);
        if (mspid !== 'governmentMSP') {
            throw new Error("Unauthorized MSP: Only the government can mark vouchers as used.");
        }
        const exists = await this.voucherExists(ctx, voucherId);
        if (!exists) {
            throw new Error(`The voucher with ID ${voucherId} does not exist`);
        }
        const collectionName = await getCollectionName(ctx);
        const privateData = await ctx.stub.getPrivateData(collectionName, voucherId);
        const voucher = JSON.parse(privateData.toString());
        voucher.status = "used";
        await ctx.stub.putPrivateData(collectionName, voucherId, Buffer.from(JSON.stringify(voucher)));
        console.log(`Voucher with ID ${voucherId} marked as used.`);
        return `Voucher with ID ${voucherId} marked as used.`;
    }

    // Buy waste, accessible only to manufacturers
    async buyWaste(ctx, wasteId, owner) {
        const mspID = ctx.clientIdentity.getMSPID();
        console.log(`MSP ID for buyWaste: ${mspID}`);
        if (mspID !== "manufactureMSP") {
            throw new Error("Unauthorized MSP: Only manufacturers can buy waste.");
        }
        const exists = await this.wasteExists(ctx, wasteId);
        if (!exists) {
            throw new Error(`The waste with ID ${wasteId} does not exist`);
        }
        const buffer = await ctx.stub.getState(wasteId);
        const waste = JSON.parse(buffer.toString());
        waste.status = "At Manufacture";
        waste.owner = owner;
        const updatedBuffer = Buffer.from(JSON.stringify(waste));
        await ctx.stub.putState(wasteId, updatedBuffer);
        console.log(`Waste with ID ${wasteId} bought successfully.`);
        return `Waste with ID ${wasteId} bought successfully.`;
    }
}

module.exports = Waste;
