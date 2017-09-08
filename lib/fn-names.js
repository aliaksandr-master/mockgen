/*eslint-env node*/

const isFunction = require('lodash/isFunction');
const forIn = require('lodash/forIn');
const forEach = require('lodash/forEach');


/**
 * @param {Object} obj
 * @param {Boolean} searchInPrototype
 * @returns {Array}
 * */
module.exports = (obj, searchInPrototype) => {
  const iterate = searchInPrototype ? forIn : forEach;
  const fns = [];

  iterate(obj, (v, k) => {
    if (isFunction(v) && Object.prototype[k] !== v && Function.prototype[k] !== v) {
      fns.push(k);
    }
  });

  return fns;
};
