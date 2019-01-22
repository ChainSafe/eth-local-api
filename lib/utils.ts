import fs = require("fs");
import {FULL_PATH} from "./constants";

/**
 * Checks to see if the eth-local directory exist.
 * @returns {boolean}
 */
export function verify(): boolean {
  return !fs.existsSync(FULL_PATH);
}

/**
 * Creates the eth-local directory in the users root.
 * @returns {boolean}
 */
export function setup(): boolean {
  fs.mkdir(FULL_PATH, (err) => {
    if (err) {
      throw new Error("Directory could not be created :: " + err);
    }
  });
  return true;
}
