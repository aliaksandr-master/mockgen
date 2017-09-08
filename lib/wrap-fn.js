const mkValueRecursive = require('./mk-value-recursive');
const mkHash = require('./mk-hash');



module.exports = (fn, name) => (...args) => {
  const hashes = [];

  mkValueRecursive(args, hashes, `helper[${name}] arguments `);

  const wrFn = () => fn(...args);

  wrFn.__mockGenHash__ = `${name}(${mkHash(hashes)})`;

  return wrFn;
};
