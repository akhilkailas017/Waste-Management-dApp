"use strict";

const { Contract } = require("fabric-contract-api");

async function getCollectionName(ctx){
    const collectionName = 'WasteCollection';
    return collectionName;
}

class Waste extends Contract {

    async wasteExists(ctx, wasteId) {
        const buffer = await ctx.stub.getState(wasteId);
        return !!buffer && buffer.length > 0;
    }

    async createWaste(ctx, wasteId, collectionCompany, totalWeight, owner) {
        const mspID = ctx.clientIdentity.getMSPID();
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
                status: "In Waste collection Company",
                assetType: "waste",
            };
            const buffer = Buffer.from(JSON.stringify(waste));
            await ctx.stub.putState(wasteId, buffer);
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
        return waste;
    }

    async deleteWaste(ctx, wasteId) {
        const mspID = ctx.clientIdentity.getMSPID();
        if (mspID === "wasteCollectionCompanyMSP") {
            const exists = await this.wasteExists(ctx, wasteId);
            if (!exists) {
                throw new Error(`The waste with ID ${wasteId} does not exist`);
            }
            await ctx.stub.deleteState(wasteId);
            return `Waste with ID ${wasteId} deleted successfully.`;
        } else {
            throw new Error("Unauthorized MSP");
        }
    }

    async upsertWasteDetails(ctx, wasteId, reusableWeight, owner) {
        const mspID = ctx.clientIdentity.getMSPID();
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
        return `Waste with ID ${wasteId} updated successfully with reusable weight and usable percentage.`;
    }

    async voucherExists(ctx, voucherId) {
        const collectionName = await getCollectionName(ctx);
        const data = await ctx.stub.getPrivateDataHash(collectionName, voucherId);
        return !!data && data.length > 0;
    }

    async issueVoucher(ctx, voucherId) {
        const mspid = ctx.clientIdentity.getMSPID();
        if (mspid === 'governmentMSP') {
            const exists = await this.voucherExists(ctx, voucherId);
            if (exists) {
                throw new Error(`The asset order ${voucherId} already exists`);
            }

            const transientData = ctx.stub.getTransient();
            if (transientData.size === 0 || !transientData.has('wasteId') || !transientData.has('type') || !transientData.has('amount')) {
                throw new Error('The expected key was not specified in transient data. Please try again.');
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
            return `Voucher with ID ${voucherId} issued successfully.`;
        } else {
            throw new Error(`Organisation with mspid ${mspid} cannot perform this action.`);
        }
    }

    async readVoucher(ctx, voucherId) {
        const exists = await this.voucherExists(ctx, voucherId);
        if (!exists) {
            throw new Error(`The voucher with ID ${voucherId} does not exist`);
        }
        const collectionName = await getCollectionName(ctx);
        const privateData = await ctx.stub.getPrivateData(collectionName, voucherId);
        return JSON.parse(privateData.toString());
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
        return `Voucher with ID ${voucherId} used successfully.`;
    }

    async buyWaste(ctx, wasteId, owner) {
        const mspID = ctx.clientIdentity.getMSPID();
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
        return `Waste with ID ${wasteId} bought successfully.`;
    }
}

module.exports = Waste;
