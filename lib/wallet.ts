import ethers = require("ethers");
import {Transaction} from "ethers/utils";
import fs = require("fs");
import path = require("path");
import { FULL_PATH } from "./constants";

/**
 * Creates a new wallet and encrypts it in the .eth-local directory
 * @param {string} password - to encrypt the file
 * @param {string} name - optional name for the file
 * @param {Function} percentLoader - optional percent loader to dispaly to the screen.
 * @returns {boolean}
 */
export async function createWallet(password: string, name?: string, percentLoader?: void) {
  const wallet = ethers.Wallet.createRandom();
  const walletName = name === "" ? wallet.address : `${name} - ${wallet.address}`;
  const filePath = path.join(FULL_PATH, walletName);
  // Exit if wallet name already exists.
  if (fs.existsSync(filePath)) {
    return false;
  }
  // Encrypt Wallet
  const encryptedWallet = await wallet.encrypt(password, percentLoader);

  // write to a new file
  fs.writeFile(filePath, JSON.stringify(encryptedWallet), (err) => {
    if (err) {
      throw new Error("Wallet encryption failed :: " + err);
    }
    return true;
  });
}

/**
 * Gets wallets form the eth-local directory.
 * @returns {{}}
 */
export function getWallets() {
  const files = fs.readdirSync(FULL_PATH);
  const wallets = {};
  files.map((file, i) => {
    // Get name from 'name - address'
    wallets[file.split("-")[1].trim()] = FULL_PATH + "/" + file;
  });
  return wallets;
}

export async function SignTX(tx: Transaction, walletAddress: string, password: string) {
  // Update wallet list
  const wallets = getWallets();
  const keyStore = JSON.parse(fs.readFileSync(wallets[walletAddress]));
  const privateKey = await ethers.Wallet.fromEncryptedWallet(keyStore, password);
  const signingKey = new ethers.SigningKey(privateKey.privateKey);
  // Encode tx
  const txBytes = ethers.utils.toUtf8Bytes(tx);
  const txDigest = ethers.utils.keccak256(txBytes);
  // Sign tx and return it
  return signingKey.signDigest(txDigest);
}
