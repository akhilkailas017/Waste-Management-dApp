/*
 * SPDX-License-Identifier: Apache-2.0
 */

"use strict";

const Waste = require("./lib/waste");

module.exports.Waste = Waste;

module.exports.contracts = [Waste];

// const Waste = require("./lib/waste-contract");
// const govContract = require("./lib/government-contract");

// module.exports.Waste = Waste;
// module.exports.govContract = govContract;

// module.exports.contracts = [Waste, govContract];