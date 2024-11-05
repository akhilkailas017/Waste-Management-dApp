'use strict';

const { Contract } = require('fabric-contract-api');

async function getCollectionName(ctx) {
    const collectionName = 'WasteCollection';
    return collectionName;
}

class govContract extends Contract {

    async voucherExist(ctx, voucherId) {
        const collectionName = await getCollectionName(ctx);
        const data = await ctx.stub.getPrivateDataHash(collectionName, voucherId);
        return (!!data && data.length > 0);
    }

    async createVoucher(ctx, voucherId) {
        const mspid = ctx.clientIdentity.getMSPID();
        if (mspid === 'governmentMSP') {
            const exists = await this.voucherExist(ctx, voucherId);
            if (exists) {
                throw new Error(`${voucherId} already exists`);
            }
            const voucherAsset = {};
            const transientData = ctx.stub.getTransient();
            if (transientData.size === 0 || !transientData.has("wasteId") || !transientData.has("type") || !transientData.has("amount")) {
                throw new Error("The expected key was not specified in transient data. Please try again.");
            }
            voucherAsset.wasteId = transientData.get("wasteId").toString();
            voucherAsset.type = transientData.get("type").toString();
            voucherAsset.amount = transientData.get("amount").toString();
            voucherAsset.assetType = "voucher";
            voucherAsset.status = "issued";
            const collectionName = await getCollectionName(ctx);
            await ctx.stub.putPrivateData(collectionName, voucherId, Buffer.from(JSON.stringify(voucherAsset)));
        } else {
            return `Organization with MSP ID ${mspid} cannot perform this action`;
        }
    }

    async readVoucher(ctx, voucherId) {
        const exists = await this.voucherExist(ctx, voucherId);
        if (!exists) {
            throw new Error(`The order ${voucherId} does not exist`);
        }
        const collectionName = await getCollectionName(ctx);
        const privateData = await ctx.stub.getPrivateData(collectionName, voucherId);
        return JSON.parse(privateData.toString());
    }

    async deleteVoucher(ctx, voucherId) {
        const mspid = ctx.clientIdentity.getMSPID();
        if (mspid === 'governmentMSP') {
            const exists = await this.voucherExist(ctx, voucherId);
            if (!exists) {
                throw new Error(`The order ${voucherId} does not exist`);
            }
            const collectionName = await getCollectionName(ctx);
            await ctx.stub.deletePrivateData(collectionName, voucherId);
        } else {
            return `Organization with MSP ID ${mspid} cannot perform this action`;
        }
    }

    // async useVoucher(ctx, voucherId) {
    //     const mspid = ctx.clientIdentity.getMSPID();
    //     if (mspid !== 'governmentMSP') {
    //         throw new Error(`Organization with MSP ID ${mspid} is not authorized to use the voucher`);
    //     }
    //     const exists = await this.voucherExist(ctx, voucherId);
    //     if (!exists) {
    //         throw new Error(`The voucher with ID ${voucherId} does not exist`);
    //     }
    //     const collectionName = await getCollectionName(ctx);
    //     const privateData = await ctx.stub.getPrivateData(collectionName, voucherId);
    //     const voucher = JSON.parse(privateData.toString());
    //     voucher.status = "used";
    //     await ctx.stub.putPrivateData(collectionName, voucherId, Buffer.from(JSON.stringify(voucher)));
    //     console.log(`Voucher with ID ${voucherId} used successfully.`);
    //     return `Voucher with ID ${voucherId} used successfully.`;
    // }
    
}

module.exports = govContract;
