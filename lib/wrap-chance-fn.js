const functionNames = require('./fn-names');
const wrapFn = require('./wrap-fn');



module.exports = (chance) =>
  functionNames(chance, true).reduce((helpers, key) => {
    helpers[key] = wrapFn(chance[key].bind(chance), `chance.${key}`);

    return helpers;
  }, {});
