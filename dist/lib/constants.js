"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HOME_DIR = require('os').homedir();
exports.ETH_HOME = '.eth-local';
exports.FULL_PATH = require('path').join(exports.HOME_DIR, exports.ETH_HOME);
