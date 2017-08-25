/* eslint-env node */

const { Chance } = require('chance');
const isFunction = require('lodash/isFunction');
const isNull = require('lodash/isNull');
const isBoolean = require('lodash/isBoolean');
const isString = require('lodash/isBoolean');
const isNaN = require('lodash/isNaN');
const isNumber = require('lodash/isNumber');
const reduce = require('lodash/reduce');
const isPlainObject = require('lodash/isPlainObject');
const isArray = require('lodash/isArray');
const forIn = require('lodash/forIn');
const sha1 = require('crypto-js/sha1');



const chance = new Chance();

const chanceFunctionNames = [];

forIn(chance, (v, k) => {
  if (isFunction(v) && Object.prototype[k] !== v && Function.prototype[k] !== v) {
    chanceFunctionNames.push(k);
  }
});

const hashProp = `__${Math.random()}__`;

const getHash = (obj) => {
  return obj[hashProp];
};

const setHashAndReturn = (obj, hash) => {
  obj[hashProp] = hash;

  return obj;
};

const hashObj = (obj) => {
  if (obj && getHash(obj)) {
    return getHash(obj);
  }

  return sha1(JSON.stringify(obj)).toString();
};

const calcMakingValue = (value, hashes, path = '') => {
  if (isArray(value)) {
    return value
      .map((item, index) => calcMakingValue(item, hashes, `${path}[${index}]`));
  }

  if (isPlainObject(value)) {
    return Object
      .keys(value)
      .sort()
      .map((key) => [ key, calcMakingValue(value[key], hashes, `${path}.${key}`) ])
      .reduce((obj, [ key, value ]) => {
        obj[key] = value;
        return obj;
      }, {});
  }

  if ((isFunction(value) && getHash(value)) || (isNumber(value) && !isNaN(value)) || isString(value) || isBoolean(value) || isNull(value)) {
    hashes.push(`${path}::${hashObj(value)}`);

    return value;
  }

  throw new TypeError(`invalid type of "${path}"`);
};

const mkHelpers = (salt) => {
  const chance = new Chance(salt);

  return chanceFunctionNames.reduce((helpers, key) => {
    helpers[key] = (...args) => {
      const hashes = [];

      calcMakingValue(args, hashes);

      return setHashAndReturn(chance[key].bind(chance), `chance.${key}(${hashObj(hashes)},${salt})`);
    };

    return helpers;
  }, {});
};

const scanningGenerate = (value) => {
  if (isPlainObject(value) || isArray(value)) {
    return reduce(value, (result, value, key) => {
      result[key] = scanningGenerate(value);

      return result;
    }, isArray(value) ? [] : {});
  }

  if (isFunction(value)) {
    return scanningGenerate(value());
  }

  return value;
};

const Schema = function Schema (definitionFn, salt = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789') {
  salt = sha1(salt).toString();

  const definition = definitionFn(mkHelpers(salt));

  const hashes = [ salt ];
  const value = calcMakingValue(definition, hashes);

  return setHashAndReturn(() => scanningGenerate(value), hashObj(hashes));
};

module.exports = Schema;

module.exports.getHash = getHash;
