/* eslint-env node */

const { Chance } = require('chance');
const range = require('lodash/range');
const mkHash = require('./mk-hash');
const mkValueRecursive = require('./mk-value-recursive');
const wrapCustomFn = require('./wrap-custom-fn');
const wrapChanceFn = require('./wrap-chance-fn');
const systemFn = require('./system-fn');



const MockGen = function MockGen (definitionFn, { salt = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', fn = {} } = {}) {
  const chance = new Chance(salt);
  const fns = Object.assign({},
    wrapCustomFn(fn),
    wrapChanceFn(chance),
    systemFn(chance)
  );

  const definition = definitionFn(fns);
  const mutHashes = [ salt, definitionFn.toString() ];
  const generate = mkValueRecursive(definition, mutHashes);

  generate.__mockGenHash__ = mkHash(mutHashes);

  const generator = () => generate;

  generator.version = () => generate.__mockGenHash__;

  generator.generate = (limit = null) =>
    limit === null ? generate() : range(0, limit).map(generate);

  return generator;
};

module.exports = MockGen;
