'use strict';

const collectionContract = require('./lib/collectionContract');
const govContract = require('./lib/govContract');


module.exports.collectionContract = collectionContract;
module.exports.govContract = govContract;  

module.exports.contracts = [collectionContract,govContract];

