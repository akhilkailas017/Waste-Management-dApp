"use strict";

const { Contract } = require("fabric-contract-api");

// Constants for collection name and statuses
const STATUSES = {
    COLLECTED: "Collected",
    SORTED: "Sorted",
    PURCHASED: "Purchased by Manufacturer",
    INCENTIVE_PENALTY_AWARDED: "Incentive/Penalty Awarded",
    VOUCHER_USED: "Voucher Used",
};

const ASSET_TYPE = {
    WASTE: "waste",
};

class WasteManagementContract extends Contract {

    // Check if waste exists in the WasteCollection
    async wasteExists(ctx, wasteId) {
        const buffer = await ctx.stub.getPrivateData("WasteCollection", wasteId);
        return (!!buffer && buffer.length > 0);
    }

    // Create a new waste entry
    async createWaste(ctx, wasteId, collectionCompany, totalWeight) {
        const mspID = ctx.clientIdentity.getMSPID();
        this.checkWasteCompany(mspID);

        if (await this.wasteExists(ctx, wasteId)) {
            throw new Error(`The waste ${wasteId} already exists`);
        }

        const waste = {
            collectionCompany,
            totalWeight,
            reusableWeight: null,
            status: STATUSES.COLLECTED,
            assetType: ASSET_TYPE.WASTE,
        };

        // Store in the private collection
        await ctx.stub.putPrivateData("WasteCollection", wasteId, Buffer.from(JSON.stringify(waste)));
        await this.logOperation(ctx, "createWaste", wasteId);
    }

    // Check if the calling company is a valid waste collection company
    checkWasteCompany(mspID) {
        const validCompanies = ["wasteCollectionCompanyMSP"];
        if (!validCompanies.includes(mspID)) {
            throw new Error("Only Waste Collection companies can log waste.");
        }
    }

    // Read existing waste entry from the WasteCollection
    async readWaste(ctx, wasteId) {
        if (!await this.wasteExists(ctx, wasteId)) {
            throw new Error(`The waste ${wasteId} does not exist`);
        }

        const buffer = await ctx.stub.getPrivateData("WasteCollection", wasteId);
        return JSON.parse(buffer.toString());
    }

    // Update waste entry after sorting
    async updateWasteAfterSorting(ctx, wasteId, reusableWeight, percentageReusable) {
        const mspID = ctx.clientIdentity.getMSPID();
        this.checkRecyclingCenter(mspID);

        if (!await this.wasteExists(ctx, wasteId)) {
            throw new Error(`Waste ${wasteId} does not exist`);
        }

        const wasteBuffer = await ctx.stub.getPrivateData("WasteCollection", wasteId);
        const waste = JSON.parse(wasteBuffer.toString());

        await this.updateWasteProperties(ctx, wasteId, waste, reusableWeight, percentageReusable);
        await this.logOperation(ctx, "updateWasteAfterSorting", wasteId);
    }

    // Helper method to update waste properties
    async updateWasteProperties(ctx, wasteId, waste, reusableWeight, percentageReusable) {
        waste.reusableWeight = reusableWeight;
        waste.percentageReusable = percentageReusable;
        waste.status = STATUSES.SORTED;

        await ctx.stub.putPrivateData("WasteCollection", wasteId, Buffer.from(JSON.stringify(waste)));
    }

    // Check if the calling entity is a recycling center
    checkRecyclingCenter(mspID) {
        if (mspID !== "recyclingcenterMSP") {
            throw new Error("Only Recycling Centers can update sorted waste.");
        }
    }

    // Purchase sorted waste
    async purchaseWaste(ctx, wasteId) {
        const mspID = ctx.clientIdentity.getMSPID();
        this.checkManufacturer(mspID);

        if (!await this.wasteExists(ctx, wasteId)) {
            throw new Error(`Waste ${wasteId} is not available for purchase`);
        }

        const wasteBuffer = await ctx.stub.getPrivateData("WasteCollection", wasteId);
        const waste = JSON.parse(wasteBuffer.toString());

        if (waste.status !== STATUSES.SORTED) {
            throw new Error(`Waste ${wasteId} is not available for purchase`);
        }

        waste.status = STATUSES.PURCHASED;
        await ctx.stub.putPrivateData("WasteCollection", wasteId, Buffer.from(JSON.stringify(waste)));
        await this.logOperation(ctx, "purchaseWaste", wasteId);
    }

    // Check if the calling entity is a manufacturer
    checkManufacturer(mspID) {
        if (mspID !== "manufactureMSP") {
            throw new Error("Only Manufacturers can purchase reusable waste.");
        }
    }

    // Award an incentive or penalty
    async awardIncentiveOrPenalty(ctx, wasteId, type, amount) {
        const mspID = ctx.clientIdentity.getMSPID();
        this.checkGovernmentAgency(mspID);

        if (!await this.wasteExists(ctx, wasteId)) {
            throw new Error(`Waste ${wasteId} does not exist`);
        }

        if (type !== "incentive" && type !== "penalty") {
            throw new Error("Invalid type. Must be either 'incentive' or 'penalty'");
        }

        const wasteBuffer = await ctx.stub.getPrivateData("WasteCollection", wasteId);
        const waste = JSON.parse(wasteBuffer.toString());
        waste.status = STATUSES.INCENTIVE_PENALTY_AWARDED;

        if (type === "incentive") {
            waste.incentive = amount;
        } else {
            waste.penalty = amount;
        }

        await ctx.stub.putPrivateData("WasteCollection", wasteId, Buffer.from(JSON.stringify(waste)));
        await this.logOperation(ctx, "awardIncentiveOrPenalty", wasteId);
    }

    // Check if the calling entity is a government agency
    checkGovernmentAgency(mspID) {
        if (mspID !== "governmentMSP") {
            throw new Error("Only Government agencies can award incentives/penalties.");
        }
    }

    // Mark voucher as used
    async markVoucherAsUsed(ctx, wasteId) {
        const mspID = ctx.clientIdentity.getMSPID();
        this.checkGovernmentAgency(mspID);

        if (!await this.wasteExists(ctx, wasteId)) {
            throw new Error(`Waste ${wasteId} does not exist`);
        }

        const wasteBuffer = await ctx.stub.getPrivateData("WasteCollection", wasteId);
        const waste = JSON.parse(wasteBuffer.toString());
        waste.status = STATUSES.VOUCHER_USED;

        await ctx.stub.putPrivateData("WasteCollection", wasteId, Buffer.from(JSON.stringify(waste)));
        await this.logOperation(ctx, "markVoucherAsUsed", wasteId);
    }

    // Log operations
    async logOperation(ctx, operation, wasteId) {
        const userId = ctx.clientIdentity.getID();
        const logEntry = {
            operation,
            wasteId,
            userId,
            timestamp: new Date().toISOString(),
        };
        await ctx.stub.putState(`log_${userId}_${Date.now()}`, Buffer.from(JSON.stringify(logEntry)));
    }

    // Query waste by status for Waste Collection companies
    async queryWasteByStatus(ctx, status) {
        const query = {
            selector: {
                status: status
            }
        };
        const results = await ctx.stub.getPrivateDataQueryResult("WasteCollection", JSON.stringify(query));
        return this.getAllResults(results);
    }

    // Query sorted waste by reusable percentage for Recycling Centers
    async querySortedWasteByReusablePercentage(ctx, minPercentage) {
        const query = {
            selector: {
                assetType: ASSET_TYPE.WASTE,
                status: STATUSES.SORTED,
                percentageReusable: {
                    $gte: minPercentage
                }
            }
        };
        const results = await ctx.stub.getPrivateDataQueryResult("WasteCollection", JSON.stringify(query));
        return this.getAllResults(results);
    }

    // Query purchased waste for Manufacturers
    async queryPurchasedWaste(ctx) {
        const query = {
            selector: {
                status: STATUSES.PURCHASED,
            }
        };
        const results = await ctx.stub.getPrivateDataQueryResult("WasteCollection", JSON.stringify(query));
        return this.getAllResults(results);
    }

    // Query waste incentives for Government Agencies
    async queryWasteIncentives(ctx) {
        const query = {
            selector: {
                incentive: {
                    $exists: true
                }
            }
        };
        const results = await ctx.stub.getPrivateDataQueryResult("WasteCollection", JSON.stringify(query));
        return this.getAllResults(results);
    }

    // Query penalties for Government Agencies
    async queryWastePenalties(ctx) {
        const query = {
            selector: {
                penalty: {
                    $exists: true
                }
            }
        };
        const results = await ctx.stub.getPrivateDataQueryResult("WasteCollection", JSON.stringify(query));
        return this.getAllResults(results);
    }

    // Helper function to get all results from the iterator
    async getAllResults(iterator) {
        const allResults = [];
        let res = await iterator.next();
        while (!res.done) {
            const jsonRes = {};
            jsonRes.key = res.value.key;
            jsonRes.record = JSON.parse(res.value.value.toString('utf8'));
            allResults.push(jsonRes);
            res = await iterator.next();
        }
        return allResults;
    }
}

module.exports = WasteManagementContract;