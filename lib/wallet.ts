import {Transaction} from "ethers/utils";

const ethers = require('ethers');
const fs = require('fs');
const path = require('path');

const { FULL_PATH } = require('./constants');

/**
 * Creates a new wallet and encrypts it in the .eth-local directory
 * @param {string} password - to encrypt the file
 * @param {string} name - optional name for the file
 * @param {Function} percentLoader - optional percent loader to dispaly to the screen.
 * @returns {boolean}
 */
export async function createWallet(password: string, name?: string, percentLoader?: Function) {
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
  let files = fs.readdirSync(FULL_PATH);
  let wallets = {};
  files.map((file, i) => {
    // Get name from 'name - address'
    wallets[file.split('-')[1].trim()] = FULL_PATH + '/' + file
  });
  return wallets;
}

export async function SignTX(tx: Transaction, walletAddress: string, password: string) {
  // Update wallet list
  let wallets = getWallets();
  let keyStore = JSON.parse(fs.readFileSync(wallets[walletAddress]));
  let privateKey = await ethers.Wallet.fromEncryptedWallet(keyStore, password);
  let signingKey = new ethers.SigningKey(privateKey.privateKey);
  // Encode tx
  let txBytes = ethers.utils.toUtf8Bytes(tx);
  let txDigest = ethers.utils.keccak256(txBytes);
  // Sign tx and return it
  return signingKey.signDigest(txDigest)
}
