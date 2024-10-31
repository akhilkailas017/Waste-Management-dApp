"use strict";

const { ChaincodeStub, ClientIdentity } = require("fabric-shim");
const { WasteManagementContract } = require("../lib/WasteManagementContract");
const winston = require("winston");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");

chai.should();
chai.use(chaiAsPromised);
chai.use(sinonChai);

class TestContext {
    constructor() {
        this.stub = sinon.createStubInstance(ChaincodeStub);
        this.clientIdentity = sinon.createStubInstance(ClientIdentity);
        this.logger = {
            getLogger: sinon.stub().returns(sinon.createStubInstance(winston.createLogger().constructor)),
            setLevel: sinon.stub(),
        };
    }
}

describe("WasteManagementContract", () => {
    let contract;
    let ctx;

    beforeEach(() => {
        contract = new WasteManagementContract();
        ctx = new TestContext();

        // Mock existing waste entries
        ctx.stub.getPrivateData.withArgs("WasteCollection", "waste1").resolves(Buffer.from(JSON.stringify({
            collectionCompany: "WasteCompany1",
            totalWeight: 100,
            reusableWeight: null,
            status: "Collected",
            assetType: "waste",
        })));
        ctx.stub.getPrivateData.withArgs("WasteCollection", "waste2").resolves(Buffer.from(JSON.stringify({
            collectionCompany: "WasteCompany2",
            totalWeight: 200,
            reusableWeight: null,
            status: "Collected",
            assetType: "waste",
        })));

        // Set the default client identity
        ctx.clientIdentity.getMSPID.returns("WasteCompany1MSP");
    });

    describe("#wasteExists", () => {
        it("should return true for an existing waste", async () => {
            await contract.wasteExists(ctx, "waste1").should.eventually.be.true;
        });

        it("should return false for a non-existing waste", async () => {
            await contract.wasteExists(ctx, "waste3").should.eventually.be.false;
        });
    });

    describe("#createWaste", () => {
        it("should create a new waste entry", async () => {
            await contract.createWaste(ctx, "waste3", "WasteCompany1", 150);
            ctx.stub.putPrivateData.should.have.been.calledOnceWithExactly("WasteCollection", "waste3", Buffer.from(JSON.stringify({
                collectionCompany: "WasteCompany1",
                totalWeight: 150,
                reusableWeight: null,
                status: "Collected",
                assetType: "waste",
            })));
        });

        it("should throw an error for a waste that already exists", async () => {
            await contract.createWaste(ctx, "waste1", "WasteCompany1", 150)
                .should.be.rejectedWith(/The waste waste1 already exists/);
        });
    });

    describe("#readWaste", () => {
        it("should return an existing waste", async () => {
            await contract.readWaste(ctx, "waste1").should.eventually.deep.equal({
                collectionCompany: "WasteCompany1",
                totalWeight: 100,
                reusableWeight: null,
                status: "Collected",
                assetType: "waste",
            });
        });

        it("should throw an error for a non-existing waste", async () => {
            await contract.readWaste(ctx, "waste3").should.be.rejectedWith(/The waste waste3 does not exist/);
        });
    });

    describe("#updateWasteAfterSorting", () => {
        beforeEach(() => {
            ctx.clientIdentity.getMSPID.returns("RecyclingCenterMSP");
        });

        it("should update waste after sorting", async () => {
            const reusableWeight = 60;
            const percentageReusable = 60;

            await contract.updateWasteAfterSorting(ctx, "waste1", reusableWeight, percentageReusable);
            
            // Check if putPrivateData was called with the correct arguments
            ctx.stub.putPrivateData.should.have.been.calledOnce;
            const args = ctx.stub.putPrivateData.getCall(0).args;
            args[0].should.equal("WasteCollection");
            args[1].should.equal("waste1");
            
            const updatedWaste = JSON.parse(args[2].toString('utf8'));
            updatedWaste.should.deep.equal({
                collectionCompany: "WasteCompany1",
                totalWeight: 100,
                reusableWeight: reusableWeight,
                percentageReusable: percentageReusable,
                status: "Sorted",
                assetType: "waste",
            });
        });

        it("should throw an error for a non-existing waste", async () => {
            await contract.updateWasteAfterSorting(ctx, "waste3", 60, 60)
                .should.be.rejectedWith(/Waste waste3 does not exist/);
        });
    });

    describe("#purchaseWaste", () => {
        beforeEach(() => {
            ctx.clientIdentity.getMSPID.returns("ManufacturerMSP");
        });

        it("should purchase sorted waste", async () => {
            ctx.stub.getPrivateData.withArgs("WasteCollection", "waste1").resolves(Buffer.from(JSON.stringify({
                collectionCompany: "WasteCompany1",
                totalWeight: 100,
                reusableWeight: null,
                status: "Sorted",
                assetType: "waste",
            })));

            await contract.purchaseWaste(ctx, "waste1");
            ctx.stub.putPrivateData.should.have.been.calledOnceWithExactly("WasteCollection", "waste1", Buffer.from(JSON.stringify({
                collectionCompany: "WasteCompany1",
                totalWeight: 100,
                reusableWeight: null,
                status: "Purchased by Manufacturer",
                assetType: "waste",
            })));
        });

        it("should throw an error for a non-existing waste", async () => {
            await contract.purchaseWaste(ctx, "waste3")
                .should.be.rejectedWith(/Waste waste3 is not available for purchase/);
        });

        it("should throw an error for waste that is not sorted", async () => {
            ctx.stub.getPrivateData.withArgs("WasteCollection", "waste1").resolves(Buffer.from(JSON.stringify({
                collectionCompany: "WasteCompany1",
                totalWeight: 100,
                reusableWeight: null,
                status: "Collected",
                assetType: "waste",
            })));

            await contract.purchaseWaste(ctx, "waste1")
                .should.be.rejectedWith(/Waste waste1 is not available for purchase/);
        });
    });

    describe("#awardIncentiveOrPenalty", () => {
        beforeEach(() => {
            ctx.clientIdentity.getMSPID.returns("GovernmentMSP");
        });

        it("should award an incentive", async () => {
            await contract.awardIncentiveOrPenalty(ctx, "waste1", "incentive", 100);
            ctx.stub.putPrivateData.should.have.been.calledOnceWithExactly("WasteCollection", "waste1", Buffer.from(JSON.stringify({
                collectionCompany: "WasteCompany1",
                totalWeight: 100,
                reusableWeight: null,
                status: "Incentive/Penalty Awarded",
                assetType: "waste",
                incentive: 100,
            })));
        });

        it("should throw an error for a non-existing waste", async () => {
            await contract.awardIncentiveOrPenalty(ctx, "waste3", "incentive", 100)
                .should.be.rejectedWith(/Waste waste3 does not exist/);
        });

        it("should throw an error for an invalid type", async () => {
            await contract.awardIncentiveOrPenalty(ctx, "waste1", "invalidType", 100)
                .should.be.rejectedWith(/Invalid type. Must be either 'incentive' or 'penalty'/);
        });
    });

    describe("#markVoucherAsUsed", () => {
        beforeEach(() => {
            ctx.clientIdentity.getMSPID.returns("GovernmentMSP");
        });

        it("should mark the voucher as used", async () => {
            await contract.markVoucherAsUsed(ctx, "waste1");
            ctx.stub.putPrivateData.should.have.been.calledOnceWithExactly("WasteCollection", "waste1", Buffer.from(JSON.stringify({
                collectionCompany: "WasteCompany1",
                totalWeight: 100,
                reusableWeight: null,
                status: "Voucher Used",
                assetType: "waste",
            })));
        });

        it("should throw an error for a non-existing waste", async () => {
            await contract.markVoucherAsUsed(ctx, "waste3")
                .should.be.rejectedWith(/Waste waste3 does not exist/);
        });
    });

    describe("#queryWasteByStatus", () => {
        it("should query waste by status", async () => {
            ctx.stub.getQueryResult.resolves({
                next: sinon.stub()
                    .onFirstCall().resolves({ done: false, value: { key: "waste1", value: Buffer.from(JSON.stringify({
                        collectionCompany: "WasteCompany1",
                        totalWeight: 100,
                        status: "Collected",
                        assetType: "waste",
                    })) } })
                    .onSecondCall().resolves({ done: true }),
                close: sinon.stub()
            });

            const results = await contract.queryWasteByStatus(ctx, "Collected");
            results.should.be.an("array").with.lengthOf(1);
            results[0].key.should.equal("waste1");
        });
    });

    describe("#querySortedWasteByReusablePercentage", () => {
        it("should query sorted waste by reusable percentage", async () => {
            ctx.stub.getQueryResult.resolves({
                next: sinon.stub()
                    .onFirstCall().resolves({ done: false, value: { key: "waste1", value: Buffer.from(JSON.stringify({
                        collectionCompany: "WasteCompany1",
                        totalWeight: 100,
                        reusableWeight: 60,
                        percentageReusable: 60,
                        status: "Sorted",
                        assetType: "waste",
                    })) } })
                    .onSecondCall().resolves({ done: true }),
                close: sinon.stub()
            });

            const results = await contract.querySortedWasteByReusablePercentage(ctx, 50);
            results.should.be.an("array").with.lengthOf(1);
            results[0].key.should.equal("waste1");
        });
    });

    describe("#queryPurchasedWaste", () => {
        it("should query purchased waste", async () => {
            ctx.stub.getQueryResult.resolves({
                next: sinon.stub()
                    .onFirstCall().resolves({ done: false, value: { key: "waste1", value: Buffer.from(JSON.stringify({
                        collectionCompany: "WasteCompany1",
                        totalWeight: 100,
                        status: "Purchased by Manufacturer",
                        assetType: "waste",
                    })) } })
                    .onSecondCall().resolves({ done: true }),
                close: sinon.stub()
            });

            const results = await contract.queryPurchasedWaste(ctx);
            results.should.be.an("array").with.lengthOf(1);
            results[0].key.should.equal("waste1");
        });
    });

    describe("#queryWasteIncentives", () => {
        it("should query waste incentives", async () => {
            ctx.stub.getQueryResult.resolves({
                next: sinon.stub()
                    .onFirstCall().resolves({ done: false, value: { key: "waste1", value: Buffer.from(JSON.stringify({
                        collectionCompany: "WasteCompany1",
                        totalWeight: 100,
                        status: "Incentive/Penalty Awarded",
                        incentive: 100,
                        assetType: "waste",
                    })) } })
                    .onSecondCall().resolves({ done: true }),
                close: sinon.stub()
            });

            const results = await contract.queryWasteIncentives(ctx);
            results.should.be.an("array").with.lengthOf(1);
            results[0].key.should.equal("waste1");
        });
    });
});
