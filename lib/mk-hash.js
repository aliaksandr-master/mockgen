const sha1 = require('crypto-js/sha1');



module.exports = (obj) => {
  if (obj && obj.__mockGenHash__) {
    return obj.__mockGenHash__;
  }

  return sha1(JSON.stringify(obj)).toString();
};
