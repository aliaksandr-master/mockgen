/*eslint-env jest, browser*/
const Schema = require('../index');



describe('generate', () => {
  const mySchema = Schema((chance) => ({
    $stepOneOf1: chance.$stepOneOf(1, 2, 3, 4, 5),
    $stepOneOf2: chance.$stepOneOf(11, 22, 33, 44, 55),
    $optional1: chance.$optional(chance.integer(), null),
    $optional2: chance.$optional(chance.integer()),
    $optional3: chance.$optional({
      some: chance.integer()
    }),
    $optional4: chance.$optional([
      {
        some: chance.integer()
      }
    ]),
    // basic
    bool: chance.bool(),
    character: chance.character(),
    floating: chance.floating(),
    integer: chance.integer(),
    natural: chance.natural(),
    string: chance.string(),

    // text
    paragraph: chance.paragraph(),
    sentence: chance.sentence(),
    syllable: chance.syllable(),
    word: chance.word(),

    // person
    age: chance.age(),
    birthday: chance.birthday(),
    cf: chance.cf(),
    cpf: chance.cpf(),
    first: chance.first(),
    gender: chance.gender(),
    last: chance.last(),
    name: chance.name(),
    prefix: chance.prefix(),
    ssn: chance.ssn(),
    suffix: chance.suffix(),

    // mobile
    android_id: chance.android_id(),
    apple_token: chance.apple_token(),
    bb_pin: chance.bb_pin(),
    wp7_anid: chance.wp7_anid(),
    wp8_anid2: chance.wp8_anid2(),

    // web
    avatar: chance.avatar(),
    color: chance.color(),
    domain: chance.domain(),
    email: chance.email(),
    fbid: chance.fbid(),
    google_analytics: chance.google_analytics(),
    hashtag: chance.hashtag(),
    ip: chance.ip(),
    ipv6: chance.ipv6(),
    klout: chance.klout(),
    tld: chance.tld(),
    twitter: chance.twitter(),
    url: chance.url(),

    //Location
    address: chance.address(),
    altitude: chance.altitude(),
    areacode: chance.areacode(),
    city: chance.city(),
    coordinates: chance.coordinates(),
    country: chance.country(),
    depth: chance.depth(),
    geohash: chance.geohash(),
    latitude: chance.latitude(),
    longitude: chance.longitude(),
    phone: chance.phone(),
    postal: chance.postal(),
    province: chance.province(),
    state: chance.state(),
    street: chance.street(),
    zip: chance.zip(),

    // Time
    ampm: chance.ampm(),
    date: chance.date(),
    hammertime: chance.hammertime(),
    hour: chance.hour(),
    millisecond: chance.millisecond(),
    minute: chance.minute(),
    month: chance.month(),
    second: chance.second(),
    //timestamp: chance.timestamp(), -- DO NOT USE THIS
    timezone: chance.timezone(),
    year: chance.year(),

    // Finance
    cc: chance.cc(),
    cc_type: chance.cc_type(),
    currency: chance.currency(),
    currency_pair: chance.currency_pair(),
    dollar: chance.dollar(),
    euro: chance.euro(),
    exp: chance.exp(),
    exp_month: chance.exp_month(),
    exp_year: chance.exp_year(),

    // helpers
    pickone: chance.pickone([ '123', '234', '345', '456', '567' ]),
    pickset: chance.pickset([ '123', '234', '345', '456', '567' ], 3),
    shuffle: chance.shuffle([ '123', '234', '345', '456', '567' ]),
    d4: chance.d4(),
    d6: chance.d6(),
    d8: chance.d8(),
    d10: chance.d10(),
    d12: chance.d12(),
    d20: chance.d20(),
    d30: chance.d30(),
    d100: chance.d100(),
    guid: chance.guid(),
    hash: chance.hash(),
    n: chance.n(chance.state(), 30),
    normal: chance.normal(),
    radio: chance.radio(),
    rpg: chance.rpg('3d10'),
    tv: chance.tv(),
    unique: chance.unique(chance.state(), 5)
  }));

  it('should get version', () => {
    expect(mySchema.version()).toMatchSnapshot();
  });

  it('should generate list', () => {
    expect(mySchema.generate(3)).toMatchSnapshot();
  });

  new Array(1000).join(',').split(',').forEach((_1, i) => {
    it(`should generate and be compatible [${i}]`, () => {
      expect(mySchema.generate()).toMatchSnapshot();
    });
  });
});
