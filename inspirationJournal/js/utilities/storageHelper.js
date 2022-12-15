/**
 * @file storageHelper contains functions for reading and writing to LocalStorage.
 * 
 * @author Alexander DK Courter
 * @version 1.0.0
 */

/**
 * saves data to LocalStorage under a key.
 * @since 1.0.0
 * @access public
 * 
 * @param {string} key a string specifying the key to save the data under.
 * @param {*} data the data to store in LS.
 */
export function writeToLS(key, data){
    window.localStorage.setItem(key, JSON.stringify(data));
}

/**
 * retrieves data from LocalStorage via a key.
 * @since 1.0.0
 * @access public
 * 
 * @param {string} key a string specifying the key to find the data.
 * @param {*} data the data to retrieve from LS.
 * @return {*} data is parsed and returned in its natural data type.
 */
export function readFromLS(key){
    return JSON.parse(window.localStorage.getItem(key));
}