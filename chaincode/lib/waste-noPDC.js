"use strict";

const { Contract } = require("fabric-contract-api");

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
        const buffer = await ctx.stub.getState(voucherId);
        return !!buffer && buffer.length > 0;
    }

    async issueVoucher(ctx, wasteId, type, amount) {
        const mspID = ctx.clientIdentity.getMSPID();
        if (mspID !== "governmentMSP") {
            throw new Error("Unauthorized MSP");
        }
        const exists = await this.wasteExists(ctx, wasteId);
        if (!exists) {
            throw new Error(`The waste with ID ${wasteId} does not exist`);
        }
        if (type !== "incentive" && type !== "penalty") {
            throw new Error("Invalid type. Must be either 'incentive' or 'penalty'");
        }
        const buffer = await ctx.stub.getState(wasteId);
        const waste = JSON.parse(buffer.toString());
        const voucherId = `${wasteId}_voucher_${new Date().getTime()}`;
        const voucherIssue = {
            voucherId,
            wasteId,
            collectionCompany: waste.collectionCompany,
            type,
            amount: parseFloat(amount),
            status: "issued",
            assetType: "voucher",
        };
        const voucherBuffer = Buffer.from(JSON.stringify(voucherIssue));
        await ctx.stub.putState(voucherId, voucherBuffer);
        return `Voucher with ID ${voucherId} of type '${type}' for amount ${amount} issued successfully for waste ID ${wasteId}.`;
    }

    async readVoucher(ctx, voucherId) {
        const exists = await this.voucherExists(ctx, voucherId);
        if (!exists) {
            throw new Error(`The voucher with ID ${voucherId} does not exist`);
        }
        const buffer = await ctx.stub.getState(voucherId);
        const voucher = JSON.parse(buffer.toString());
        return voucher;
    }

    async useVoucher(ctx, voucherId) {
        const exists = await this.voucherExists(ctx, voucherId);
        if (!exists) {
            throw new Error(`The voucher with ID ${voucherId} does not exist`);
        }
        const buffer = await ctx.stub.getState(voucherId);
        const voucher = JSON.parse(buffer.toString());
        voucher.status = "used";
        const updatedBuffer = Buffer.from(JSON.stringify(voucher));
        await ctx.stub.putState(voucherId, updatedBuffer);
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

    // Rich query to retrieve wastes by status
    async queryWastesByStatus(ctx, status) {
        const queryString = {
            selector: {
                assetType: "waste",
                status: status,
            },
        };
        const iterator = await ctx.stub.getQueryResult(JSON.stringify(queryString));
        const results = [];
        for await (const res of iterator) {
            const waste = JSON.parse(res.value.toString("utf8"));
            results.push(waste);
        }
        return results;
    }

    // Rich query to retrieve vouchers by type and status
    async queryVouchersByTypeAndStatus(ctx, type, status) {
        const queryString = {
            selector: {
                assetType: "voucher",
                type: type,
                status: status,
            },
        };
        const iterator = await ctx.stub.getQueryResult(JSON.stringify(queryString));
        const results = [];
        for await (const res of iterator) {
            const voucher = JSON.parse(res.value.toString("utf8"));
            results.push(voucher);
        }
        return results;
    }

    // Rich query to retrieve all wastes owned by a specific owner
    async queryWastesByOwner(ctx, owner) {
        const queryString = {
            selector: {
                assetType: "waste",
                owner: owner,
            },
        };
        const iterator = await ctx.stub.getQueryResult(JSON.stringify(queryString));
        const results = [];
        for await (const res of iterator) {
            const waste = JSON.parse(res.value.toString("utf8"));
            results.push(waste);
        }
        return results;
    }

    // Rich query to retrieve vouchers by collectionCompany
    async queryVouchersByCollectionCompany(ctx, collectionCompany) {
        const queryString = {
            selector: {
                assetType: "voucher",
                collectionCompany: collectionCompany,
            },
        };
        const iterator = await ctx.stub.getQueryResult(JSON.stringify(queryString));
        const results = [];
        for await (const res of iterator) {
            const voucher = JSON.parse(res.value.toString("utf8"));
            results.push(voucher);
        }
        return results;
    }

}

module.exports = Waste;
