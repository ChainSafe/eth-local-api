"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var ethers = require('ethers');
var fs = require('fs');
var path = require('path');
var FULL_PATH = require('./constants').FULL_PATH;
/**
 * Creates a new wallet and encrypts it in the .eth-local directory
 * @param {string} password - to encrypt the file
 * @param {string} name - optional name for the file
 * @param {Function} percentLoader - optional percent loader to dispaly to the screen.
 * @returns {boolean}
 */
function createWallet(password, name, percentLoader) {
    return __awaiter(this, void 0, void 0, function () {
        var wallet, walletName, filePath, encryptedWallet;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    wallet = ethers.Wallet.createRandom();
                    walletName = name === "" ? wallet.address : name + " - " + wallet.address;
                    filePath = path.join(FULL_PATH, walletName);
                    // Exit if wallet name already exists.
                    if (fs.existsSync(filePath)) {
                        return [2 /*return*/, false];
                    }
                    return [4 /*yield*/, wallet.encrypt(password, percentLoader)];
                case 1:
                    encryptedWallet = _a.sent();
                    // write to a new file
                    fs.writeFile(filePath, JSON.stringify(encryptedWallet), function (err) {
                        if (err) {
                            throw new Error("Wallet encryption failed :: " + err);
                        }
                        return true;
                    });
                    return [2 /*return*/];
            }
        });
    });
}
exports.createWallet = createWallet;
/**
 * Gets wallets form the eth-local directory.
 * @returns {{}}
 */
function getWallets() {
    var files = fs.readdirSync(FULL_PATH);
    var wallets = {};
    files.map(function (file, i) {
        // Get name from 'name - address'
        wallets[file.split('-')[1].trim()] = FULL_PATH + '/' + file;
    });
    return wallets;
}
exports.getWallets = getWallets;
function SignTX(tx, walletAddress, password) {
    return __awaiter(this, void 0, void 0, function () {
        var wallets, keyStore, privateKey, signingKey, txBytes, txDigest;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    wallets = getWallets();
                    keyStore = JSON.parse(fs.readFileSync(wallets[walletAddress]));
                    return [4 /*yield*/, ethers.Wallet.fromEncryptedWallet(keyStore, password)];
                case 1:
                    privateKey = _a.sent();
                    signingKey = new ethers.SigningKey(privateKey.privateKey);
                    txBytes = ethers.utils.toUtf8Bytes(tx);
                    txDigest = ethers.utils.keccak256(txBytes);
                    // Sign tx and return it
                    return [2 /*return*/, signingKey.signDigest(txDigest)];
            }
        });
    });
}
exports.SignTX = SignTX;
