'use strict';

const { Contract } = require('fabric-contract-api');

class collectionContract extends Contract {

    async wasteExist(ctx, wasteId) {
        const buffer = await ctx.stub.getState(wasteId);
        return (!!buffer && buffer.length > 0);
    }

    async createWaste(ctx, wasteId, collectionCompany, totalWeight, owner) {
        const mspID = ctx.clientIdentity.getMSPID();
        if (mspID === 'WasteCollectionCompanyMSP') {
            const exists = await this.wasteExist(ctx, wasteId);
            if (exists) {
                throw new Error(`The ${wasteId} already exists`);
            }
            const product = {
                collectionCompany,
                totalWeight,
                owner,
                status: "In Waste Collection Company",
                assetType: "waste",
            };
            const buffer = Buffer.from(JSON.stringify(product));
            await ctx.stub.putState(wasteId, buffer);
        } else {
            return `User under the following MSP: ${mspID} cannot perform this action`;
        }
    }

    async readWaste(ctx, wasteId) {
        const exists = await this.wasteExist(ctx, wasteId);
        if (!exists) {
            throw new Error(`${wasteId} does not exist`);
        }
        const buffer = await ctx.stub.getState(wasteId);
        return JSON.parse(buffer.toString());
    }

    async deleteWaste(ctx, wasteId) {
        const mspID = ctx.clientIdentity.getMSPID();
        if (mspID === 'WasteCollectionCompanyMSP') {
            const exists = await this.wasteExist(ctx, wasteId);
            if (!exists) {
                throw new Error(`The product ${wasteId} does not exist`);
            }
            await ctx.stub.deleteState(wasteId);
        } else {
            return `User under the following MSP: ${mspID} cannot perform this action`;
        }
    }

    async updateWasteDetails(ctx, wasteId, reusableWeight, owner) {
        const mspID = ctx.clientIdentity.getMSPID();
        console.log(`MSP ID for upsertWasteDetails: ${mspID}`);
        if (mspID !== "recyclingCenterMSP") {
            throw new Error("Unauthorized MSP");
        }
        const exists = await this.wasteExist(ctx, wasteId);
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
        if (mspID !== "manufacturerMSP") {
            throw new Error("Unauthorized MSP");
        }
        const exists = await this.wasteExist(ctx, wasteId);
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

    async productExist(ctx, productId) {
        const buffer = await ctx.stub.getState(productId);
        return (!!buffer && buffer.length > 0);
    }

    async createProduct(ctx,productId, wasteId, name) {
        const mspID = ctx.clientIdentity.getMSPID();
        if (mspID === 'manufacturerMSP') {
            const exists = await this.productExist(ctx, productId);
            if (exists) {
                throw new Error(`The ${wasteId} already exists`);
            }
            const product = {
                wasteId,
                name,
                owner:"manufature",
                status: "at Manufacture",
                assetType: "product",
            };
            const buffer = Buffer.from(JSON.stringify(product));
            await ctx.stub.putState(productId, buffer);
        } else {
            return `User under the following MSP: ${mspID} cannot perform this action`;
        }
    }

    async readProduct(ctx, productId) {
        const exists = await this.productExist(ctx, productId);
        if (!exists) {
            throw new Error(`${productId} does not exist`);
        }
        const buffer = await ctx.stub.getState(productId);
        return JSON.parse(buffer.toString());
    }

    async deleteProduct(ctx, productId) {
        const mspID = ctx.clientIdentity.getMSPID();
        if (mspID === 'manufacturerMSP') {
            const exists = await this.wasteExist(ctx, productId);
            if (!exists) {
                throw new Error(`The product ${productId} does not exist`);
            }
            await ctx.stub.deleteState(productId);
        } else {
            return `User under the following MSP: ${mspID} cannot perform this action`;
        }
    }

    async _getAllResults(iterator) {
        let allResult = [];
        let res = await iterator.next();
        while (!res.done) {
            if (res.value && res.value.value.toString()) {
                let jsonRes = {};
                    jsonRes.Key = res.value.key;
                    jsonRes.Record = JSON.parse(res.value.value.toString());
                allResult.push(jsonRes)
            }
            res = await iterator.next()
        }
        await iterator.close()
        return allResult
    }

    async queryAllWaste(ctx) {
        const queryString = {
            selector: {
                assetType: 'waste'
            }
        };
        let resultIterator = await ctx.stub.getQueryResult(JSON.stringify(queryString));
        let result = await this._getAllResults(resultIterator);
        return JSON.stringify(result)
    }

    async queryAllProduct(ctx) {
        const queryString = {
            selector: {
                assetType: 'product'
            }
        };
        let resultIterator = await ctx.stub.getQueryResult(JSON.stringify(queryString));
        let result = await this._getAllResults(resultIterator);
        return JSON.stringify(result)
    }

}

module.exports = collectionContract;
