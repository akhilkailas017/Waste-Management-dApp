/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { ChaincodeStub, ClientIdentity } = require('fabric-shim');
const { Waste } = require('../lib/waste'); // Adjust the path according to your project structure
const sinon = require('sinon');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.should();
chai.use(chaiAsPromised);

class TestContext {
    constructor() {
        this.stub = sinon.createStubInstance(ChaincodeStub);
        this.clientIdentity = sinon.createStubInstance(ClientIdentity);
    }
}

describe('WasteContract', () => {
    let contract;
    let ctx;

    beforeEach(() => {
        contract = new Waste();
        ctx = new TestContext();
    });

    describe('#wasteExists', () => {
        it('should return true for an existing waste', async () => {
            ctx.stub.getState.withArgs('waste1').resolves(Buffer.from(JSON.stringify({ wasteId: 'waste1' })));
            await contract.wasteExists(ctx, 'waste1').should.eventually.be.true;
        });

        it('should return false for a non-existing waste', async () => {
            ctx.stub.getState.withArgs('waste2').resolves(Buffer.from(''));
            await contract.wasteExists(ctx, 'waste2').should.eventually.be.false;
        });
    });

    describe('#createWaste', () => {
        it('should create a waste item', async () => {
            ctx.clientIdentity.getMSPID.returns('wasteCollectionCompanyMSP');
            await contract.createWaste(ctx, 'waste1', 'Company A', 100, 'Owner A');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('waste1', sinon.match.instanceOf(Buffer));
        });

        it('should throw an error if the waste already exists', async () => {
            ctx.clientIdentity.getMSPID.returns('wasteCollectionCompanyMSP');
            ctx.stub.getState.withArgs('waste1').resolves(Buffer.from(JSON.stringify({ wasteId: 'waste1' })));
            await contract.createWaste(ctx, 'waste1', 'Company A', 100, 'Owner A')
                .should.be.rejectedWith(/The waste with ID waste1 already exists/);
        });

        it('should throw an error for unauthorized MSP', async () => {
            ctx.clientIdentity.getMSPID.returns('otherMSP');
            await contract.createWaste(ctx, 'waste1', 'Company A', 100, 'Owner A')
                .should.be.rejectedWith(/Unauthorized MSP/);
        });
    });

    describe('#readWaste', () => {
        it('should return the waste item', async () => {
            ctx.stub.getState.withArgs('waste1').resolves(Buffer.from(JSON.stringify({ wasteId: 'waste1', collectionCompany: 'Company A' })));
            await contract.readWaste(ctx, 'waste1').should.eventually.deep.equal({ wasteId: 'waste1', collectionCompany: 'Company A' });
        });

        it('should throw an error if the waste does not exist', async () => {
            ctx.stub.getState.withArgs('waste2').resolves(Buffer.from(''));
            await contract.readWaste(ctx, 'waste2').should.be.rejectedWith(/The waste with ID waste2 does not exist/);
        });
    });

    describe('#deleteWaste', () => {
        it('should delete the waste item', async () => {
            ctx.clientIdentity.getMSPID.returns('wasteCollectionCompanyMSP');
            ctx.stub.getState.withArgs('waste1').resolves(Buffer.from(JSON.stringify({ wasteId: 'waste1' })));
            await contract.deleteWaste(ctx, 'waste1');
            ctx.stub.deleteState.should.have.been.calledOnceWithExactly('waste1');
        });

        it('should throw an error if the waste does not exist', async () => {
            ctx.stub.getState.withArgs('waste2').resolves(Buffer.from(''));
            await contract.deleteWaste(ctx, 'waste2').should.be.rejectedWith(/The waste with ID waste2 does not exist/);
        });

        it('should throw an error for unauthorized MSP', async () => {
            ctx.clientIdentity.getMSPID.returns('otherMSP');
            await contract.deleteWaste(ctx, 'waste1').should.be.rejectedWith(/Unauthorized MSP/);
        });
    });

    describe('#upsertWasteDetails', () => {
        it('should update the waste details', async () => {
            ctx.clientIdentity.getMSPID.returns('recyclingcenterMSP');
            ctx.stub.getState.withArgs('waste1').resolves(Buffer.from(JSON.stringify({ wasteId: 'waste1', totalWeight: 100 })));
            await contract.upsertWasteDetails(ctx, 'waste1', 50, 'Owner B');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('waste1', sinon.match.instanceOf(Buffer));
        });

        it('should throw an error if the waste does not exist', async () => {
            ctx.stub.getState.withArgs('waste1').resolves(Buffer.from(''));
            await contract.upsertWasteDetails(ctx, 'waste1', 50, 'Owner B').should.be.rejectedWith(/The waste with ID waste1 does not exist/);
        });

        it('should throw an error for unauthorized MSP', async () => {
            ctx.clientIdentity.getMSPID.returns('otherMSP');
            await contract.upsertWasteDetails(ctx, 'waste1', 50, 'Owner B').should.be.rejectedWith(/Unauthorized MSP/);
        });

        it('should throw an error if total weight is zero or less', async () => {
            ctx.clientIdentity.getMSPID.returns('recyclingcenterMSP');
            ctx.stub.getState.withArgs('waste1').resolves(Buffer.from(JSON.stringify({ wasteId: 'waste1', totalWeight: 0 })));
            await contract.upsertWasteDetails(ctx, 'waste1', 50, 'Owner B').should.be.rejectedWith(/Total weight must be greater than zero to calculate usable percentage/);
        });
    });

    describe('#issueVoucher', () => {
        it('should issue a voucher', async () => {
            ctx.clientIdentity.getMSPID.returns('governmentMSP');
            ctx.stub.getTransient.returns(new Map([['wasteId', Buffer.from('waste1')], ['type', Buffer.from('incentive')], ['amount', Buffer.from('100')]]));
            ctx.stub.getState.withArgs('waste1').resolves(Buffer.from(JSON.stringify({ wasteId: 'waste1', collectionCompany: 'Company A' })));
            await contract.issueVoucher(ctx, 'voucher1');
            ctx.stub.putPrivateData.should.have.been.calledOnceWithExactly('WasteCollection', 'voucher1', sinon.match.instanceOf(Buffer));
        });

        it('should throw an error for existing voucher', async () => {
            ctx.clientIdentity.getMSPID.returns('governmentMSP');
            ctx.stub.getPrivateDataHash.withArgs('WasteCollection', 'voucher1').resolves(Buffer.from('somehash'));
            await contract.issueVoucher(ctx, 'voucher1').should.be.rejectedWith(/The asset order voucher1 already exists/);
        });

        it('should throw an error for missing transient data', async () => {
            ctx.clientIdentity.getMSPID.returns('governmentMSP');
            ctx.stub.getTransient.returns(new Map());
            await contract.issueVoucher(ctx, 'voucher1').should.be.rejectedWith(/The expected key was not specified in transient data/);
        });

        it('should throw an error for invalid waste ID', async () => {
            ctx.clientIdentity.getMSPID.returns('governmentMSP');
            ctx.stub.getTransient.returns(new Map([['wasteId', Buffer.from('waste1')], ['type', Buffer.from('incentive')], ['amount', Buffer.from('100')]]));
            ctx.stub.getState.withArgs('waste1').resolves(Buffer.from(''));
            await contract.issueVoucher(ctx, 'voucher1').should.be.rejectedWith(/The waste with ID waste1 does not exist/);
        });

        it('should throw an error for invalid voucher type', async () => {
            ctx.clientIdentity.getMSPID.returns('governmentMSP');
            ctx.stub.getTransient.returns(new Map([['wasteId', Buffer.from('waste1')], ['type', Buffer.from('invalid')], ['amount', Buffer.from('100')]]));
            await contract.issueVoucher(ctx, 'voucher1').should.be.rejectedWith(/Invalid type. Must be either 'incentive' or 'penalty'/);
        });

        it('should throw an error for unauthorized MSP', async () => {
            ctx.clientIdentity.getMSPID.returns('otherMSP');
            await contract.issueVoucher(ctx, 'voucher1').should.be.rejectedWith(/Organisation with mspid otherMSP cannot perform this action/);
        });
    });

    describe('#readVoucher', () => {
        it('should return the voucher', async () => {
            ctx.stub.getPrivateData.withArgs('WasteCollection', 'voucher1').resolves(Buffer.from(JSON.stringify({ voucherId: 'voucher1', type: 'incentive' })));
            await contract.readVoucher(ctx, 'voucher1').should.eventually.deep.equal({ voucherId: 'voucher1', type: 'incentive' });
        });

        it('should throw an error if the voucher does not exist', async () => {
            ctx.stub.getPrivateData.withArgs('WasteCollection', 'voucher2').resolves(Buffer.from(''));
            await contract.readVoucher(ctx, 'voucher2').should.be.rejectedWith(/The voucher with ID voucher2 does not exist/);
        });
    });

    describe('#useVoucher', () => {
        it('should use the voucher', async () => {
            ctx.stub.getPrivateData.withArgs('WasteCollection', 'voucher1').resolves(Buffer.from(JSON.stringify({ voucherId: 'voucher1', status: 'issued' })));
            await contract.useVoucher(ctx, 'voucher1');
            ctx.stub.putPrivateData.should.have.been.calledOnceWithExactly('WasteCollection', 'voucher1', sinon.match.instanceOf(Buffer));
        });

        it('should throw an error if the voucher does not exist', async () => {
            ctx.stub.getPrivateData.withArgs('WasteCollection', 'voucher2').resolves(Buffer.from(''));
            await contract.useVoucher(ctx, 'voucher2').should.be.rejectedWith(/The voucher with ID voucher2 does not exist/);
        });
    });

    describe('#buyWaste', () => {
        it('should buy the waste item', async () => {
            ctx.clientIdentity.getMSPID.returns('manufactureMSP');
            ctx.stub.getState.withArgs('waste1').resolves(Buffer.from(JSON.stringify({ wasteId: 'waste1', owner: 'Owner A', status: 'In Waste collection Company' })));
            await contract.buyWaste(ctx, 'waste1', 'Owner B');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('waste1', sinon.match.instanceOf(Buffer));
        });

        it('should throw an error for unauthorized MSP', async () => {
            ctx.clientIdentity.getMSPID.returns('otherMSP');
            await contract.buyWaste(ctx, 'waste1', 'Owner B').should.be.rejectedWith(/Unauthorized MSP/);
        });

        it('should throw an error if the waste does not exist', async () => {
            ctx.stub.getState.withArgs('waste2').resolves(Buffer.from(''));
            await contract.buyWaste(ctx, 'waste2', 'Owner B').should.be.rejectedWith(/The waste with ID waste2 does not exist/);
        });
    });
});
