/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class Waste extends Contract {

    async wasteExists(ctx, wasteId) {
        const buffer = await ctx.stub.getState(wasteId);
        return (!!buffer && buffer.length > 0);
    }

    async createWaste(ctx, wasteId, collectionCompany, totalWeight, owner) {
        const mspID = ctx.clientIdentity.getMSPID();
        if (mspID === 'wasteCollectionCompanyMSP') {
            const exists = await this.wasteExists(ctx, wasteId);
            if (exists) {
                throw new Error(`The ${wasteId} already exists`);
            }
            const asset = {
                collectionCompany,
                totalWeight: parseFloat(totalWeight),
                owner,
                status: 'In Waste Collection Company',
                assetType: 'waste'
            };
            const buffer = Buffer.from(JSON.stringify(asset));
            await ctx.stub.putState(wasteId, buffer);
            let addWasteEventData = { Type: 'waste created', totalWeight: totalWeight };
            await ctx.stub.setEvent('addWasteEvent', Buffer.from(JSON.stringify(addWasteEventData)));
        }
        else {
            return `User under the following MSP: ${mspID} cannot perform this action`;
        }

    }

    async readWaste(ctx, wasteId) {
        const exists = await this.wasteExists(ctx, wasteId);
        if (!exists) {
            throw new Error(`The ${wasteId} does not exist`);
        }
        const buffer = await ctx.stub.getState(wasteId);
        const asset = JSON.parse(buffer.toString());
        return asset;
    }


    async deleteWaste(ctx, wasteId) {
        const mspID = ctx.clientIdentity.getMSPID();
        if (mspID === 'wasteCollectionCompanyMSP') {
            const exists = await this.wasteExists(ctx, wasteId);
            if (!exists) {
                throw new Error(`The car ${wasteId} does not exist`);
            }
            await ctx.stub.deleteState(wasteId);
        }
        else {
            return `User under the following MSP: ${mspID} cannot perform this action`;
        }

    }

    async upsertWasteDetails(ctx, wasteId, reusableWeight, owner) {
        const mspID = ctx.clientIdentity.getMSPID();
        if (mspID !== 'recyclingcenterMSP') {
            return `User under the following MSP: ${mspID} cannot perform this action`;
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