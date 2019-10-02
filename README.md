[![Build Status](https://api.travis-ci.org/adsegura/crypto-parser-express.svg?branch=master)](https://travis-ci.org/adsegura/crypto-parser-express)

# crypto-parser-express

# Not for Prod, on WIP mode.
Express Response Cookie override to add crypto cookie support
and cookie-parser module replacement.

crypto-parser-express use `node-laravel-encryptor` to cipher/decipher cookies with signature verification support [TODO]

## Prerequisites
* NodeJs `>=v8.16.1 (npm v6.4.1)`
* expressJS `>=v4.1.1`

# Usage
```js
const express = require('express');
const CryptoCookieParser = require('crypto-parser-express');
const cryptoCookieParser = new CryptoCookieParser(options);
//instead of const app = express();
const app = cryptoCookieParser.overrideCookie(express());
```

### Options
```js
const options = {
  encryptor: {key: 'app_key', serialize_mode: 'php|json'},
  cookie: {
      allow_all: false,
      allowed: ['session', 'superCookie'],
      options: {
          secure: false,
          httpOnly: false,
          ....
      }
  }
}
```

# Tests
```bash
> npm run test

Class CryptoCookie
    ✓ should return express instance with cookie method overridden

  Test Errors...
    ✓ should throw Error 'overrideCookie express argument not an express instance' when trying to override Cookie method on non express instance

  Express cookie override
    ✓ should receive cipher cookie with name fooBarCookie (46ms)
    ✓ should send cipher cookie and cookieParser should decipher it
    ✓ should res.cookie not populate response Headers Set-Cookie when cookie name is not allowed 
    ✓ should server res.cookie populate response Headers Set-Cookie when cookie name is not allowed and allow_all = true
    ✓ should client send not allowed cookie and cookieParser should discard
    ✓ should client send not allowed cookie when allow_all option true and should not decipher but should be parsed in req.cookies

  8 passing (91ms)
```


### Dependencies
* [node-laravel-encryptor](https://github.com/adsegura/node-laravel-encryptor/blob/master/README.md)
    * [php-serialize](https://github.com/steelbrain/php-serialize#readme)

### Contributing
Pull requests are welcome.

### License
[MIT](https://choosealicense.com/licenses/mit/)
