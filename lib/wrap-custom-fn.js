const wrapFn = require('./wrap-fn');
const functionNames = require('./fn-names');



module.exports = (fns) =>
  functionNames(fns, false).reduce((helpers, key) => {
    helpers[key] = wrapFn(fns[key].bind(fns), `additional.${key}`);

    return helpers;
  }, {});
