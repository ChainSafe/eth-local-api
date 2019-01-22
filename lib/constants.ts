import os = require("os");
import path = require("path");

export const ETH_HOME = ".eth-local";
export const HOME_DIR = os.homedir();
export const FULL_PATH = path.join(HOME_DIR, ETH_HOME);
