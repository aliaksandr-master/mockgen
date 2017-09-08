const wrapFn = require('./wrap-fn');



module.exports = (chance) => {
  return {
    $optional: wrapFn((fn, ...args) => {
      const defaults = args.length ? args[0] : null;
      const result = fn(); // need to be calculated before for consistent result

      return chance.bool() ? result : defaults;
    }, '$optional'),

    $stepOneOf: (...args) => {
      let cursor = 0;

      return wrapFn((...items) => {
        if (!items.length) {
          throw new Error('has not enough items for $stepOneOf');
        }
        const result = items[cursor];

        if (++cursor >= items.length) {
          cursor = 0;
        }

        return result;
      }, '$oneOf')(...args);
    }
  };
};
