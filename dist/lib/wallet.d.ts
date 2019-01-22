import { Transaction } from "ethers/utils";
/**
 * Creates a new wallet and encrypts it in the .eth-local directory
 * @param {string} password - to encrypt the file
 * @param {string} name - optional name for the file
 * @param {Function} percentLoader - optional percent loader to dispaly to the screen.
 * @returns {boolean}
 */
export declare function createWallet(password: string, name?: string, percentLoader?: Function): Promise<boolean>;
/**
 * Gets wallets form the eth-local directory.
 * @returns {{}}
 */
export declare function getWallets(): {};
export declare function SignTX(tx: Transaction, walletAddress: string, password: string): Promise<any>;
