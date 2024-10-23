/**
 * Verifies username format. The name must be between 4 and 25 characters long and should not include "@" symbol
 *
 * @param {string} name Username
 * @returns {bool} True - Name is correct
 */
export function validateName (name) {
  if (name !== undefined && Object.prototype.hasOwnProperty.call(name, 'length') && name.length >= 4 && name.length <= 25 && !name.includes('@')) {
    return true
  } else {
    return false
  }
}

/**
 * Verifies email address format
 *
 * @param {string} email Email
 * @returns {bool} True - email address is correct
 */
export function validateEmail (email) {
let re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  if (email !== undefined && re.test(email)) {
    return true
  } else {
    return false
  }
}

/**
 * Verifies password format. The password must be between 8 and 25 characters long
 *
 * @param {string} password Password
 * @returns {bool} True - password is correct
 */
export function validatePassword (password) {
  if (password !== undefined && Object.prototype.hasOwnProperty.call(password, 'length') && password.length >= 8 && password.length <= 25) {
    return true
  } else {
    return false
  }
}

export function formatNumber(num) {
  if (typeof num === 'number') {
      // Check if the number has a decimal part
      if (num % 1 !== 0) {
          // Get the string representation of the number
          const strNum = num.toString();
          
          // If the number has more than 2 decimal places
          const decimalIndex = strNum.indexOf('.');
          if (decimalIndex !== -1 && strNum.length - decimalIndex - 1 > 2) {
              return num.toFixed(2); // Format to 2 decimal places
          } else {
              return num.toString(); // Return as is to keep the existing decimal
          }
      } else {
          // If it's a whole number, return it as a string
          return num.toString();
      }
  }
  return null; // Handle case where input is not a number
}
