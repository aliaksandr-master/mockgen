/* eslint-env node */

const { Chance } = require('chance');
const isFunction = require('lodash/isFunction');
const isNull = require('lodash/isNull');
const isBoolean = require('lodash/isBoolean');
const isString = require('lodash/isString');
const isNaN = require('lodash/isNaN');
const isNumber = require('lodash/isNumber');
const reduce = require('lodash/reduce');
const isPlainObject = require('lodash/isPlainObject');
const isArray = require('lodash/isArray');
const forIn = require('lodash/forIn');
const range = require('lodash/range');
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

  throw new TypeError(`invalid type of "${path}". ${Object.prototype.toString.call(value)} given`);
};

const wrapFn = (fn, name) => {
  return (...args) => {
    const hashes = [];

    calcMakingValue(args, hashes, `helper[${name}] arguments `);

    return setHashAndReturn(() => fn(...args), `${name}(${hashObj(hashes)})`);
  };
};

const mkHelpers = (salt) => {
  const chance = new Chance(salt);

  const helpers = chanceFunctionNames.reduce((helpers, key) => {
    helpers[key] = wrapFn(chance[key].bind(chance), `chance.${key}`);

    return helpers;
  }, {});

  helpers.$optional = wrapFn((fn, ...args) => {
    const defaults = args.length ? args[0] : null;
    const result = fn(); // need to be calculated before for consistent result

    return chance.bool() ? result : defaults;
  }, '$optional');

  return helpers;
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

const Schema = function Schema (definitionFn, { salt = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789' } = {}) {
  salt = sha1(salt).toString();

  const definition = definitionFn(mkHelpers(salt));

  const hashes = [ salt, definitionFn.toString() ];
  const value = calcMakingValue(definition, hashes);

  const hash = hashObj(hashes);
  const generator = setHashAndReturn({}, hash);

  const generateOne = () => scanningGenerate(value);

  generator.version = () => hash;

  generator.generate = (limit = null) => {
    if (limit === null) {
      return generateOne();
    }

    return range(0, limit).map(() => generateOne());
  };

  return generator;
};

module.exports = Schema;
