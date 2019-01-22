"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require('fs');
var FULL_PATH = require('./constants').FULL_PATH;
/**
 * Checks to see if the eth-local directory exist.
 * @returns {boolean}
 */
function verify() {
    return !fs.existsSync(FULL_PATH);
}
exports.verify = verify;
/**
 * Creates the eth-local directory in the users root.
 * @returns {boolean}
 */
function setup() {
    fs.mkdir(FULL_PATH, function (err) {
        if (err) {
            throw new Error("Directory could not be created :: " + err);
        }
    });
    return true;
}
exports.setup = setup;
