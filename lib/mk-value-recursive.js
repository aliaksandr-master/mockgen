const isNull = require('lodash/isNull');
const isArray = require('lodash/isArray');
const isBoolean = require('lodash/isBoolean');
const isString = require('lodash/isString');
const isNumber = require('lodash/isNumber');
const isFunction = require('lodash/isFunction');
const isPlainObject = require('lodash/isPlainObject');
const reduce = require('lodash/reduce');
const isNaN = require('lodash/isNaN');
const mkHash = require('./mk-hash');



const mkValueRecursive = (value, mutHashes, path = '') => {
  if (isArray(value)) {
    return value
      .map((item, index) => mkValueRecursive(item, mutHashes, `${path}[${index}]`));
  }

  if (isPlainObject(value)) {
    return Object
      .keys(value)
      .sort()
      .map((key) => [ key, mkValueRecursive(value[key], mutHashes, `${path}.${key}`) ])
      .reduce((obj, [ key, value ]) => {
        obj[key] = value;
        return obj;
      }, {});
  }

  if ((isFunction(value) && value.__mockGenHash__) || (isNumber(value) && !isNaN(value)) || isString(value) || isBoolean(value) || isNull(value)) {
    mutHashes.push(`${path}::${mkHash(value)}`);

    return value;
  }

  throw new TypeError(`invalid type of "${path}". ${Object.prototype.toString.call(value)} given`);
};


const evaluate = (value) => {
  if (isPlainObject(value) || isArray(value)) {
    return reduce(value, (result, value, key) => {
      result[key] = evaluate(value);

      return result;
    }, isArray(value) ? [] : {});
  }

  if (isFunction(value)) {
    return evaluate(value());
  }

  return value;
};


module.exports = (value, mutHashes = []) => {
  const valueFnMap = mkValueRecursive(value, mutHashes);

  return () => evaluate(valueFnMap);
};


module.exports.evaluate = evaluate;
