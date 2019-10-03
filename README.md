[![Build Status](https://api.travis-ci.org/adsegura/crypto-parser-express.svg?branch=master)](https://travis-ci.org/adsegura/crypto-parser-express)
[![npm version](https://badge.fury.io/js/crypto-parser-express.svg)](https://badge.fury.io/js/crypto-parser-express)
[![node version](https://badgen.net/badge/node/%3E=8.10.0/green)](https://badgen.net/badge/node/%3E=8.10.0/green)

# crypto-parser-express

Express `>=v4.10.0` Response Cookie override to add crypto cookie support
and cookie-parser middleware module replacement.

crypto-parser-express use `node-laravel-encryptor` to cipher/decipher cookies
with signature verification support.

This module borrows parts of cookieParse and parse methods from [cookie-parser module](https://github.com/expressjs/cookie-parser#readme) 
kudos to that dev.

# Features
* cipher/decipher cookies with
    * res.cookies
    * res.cookies_async
* Laravel Cookie Compatible `>=5.4` if serialize_mode `php` (default mode `node-laravel-encryptor`)
* only parse allowed cookies.
* only decipher encrypted cookie payload instead of every cookie params [path, domain, expires, secure, etc].
* option to allow all cookies, only allowed cookies will be deciphered. 
  

## Install
```sh
$> npm i crypto-parser-express
```

## Prerequisites
* NodeJs `>=v8.10.0 (npm v5.6.0)`
* expressJS `>=v4.10.0`

# Usage
```js
const express = require('express');
const CryptoCookieParser = require('crypto-parser-express');
const cryptoCookieParser = new CryptoCookieParser(options);

//instead of const app = express();
const app = cryptoCookieParser.overrideCookie(express());

//use custom cookieParser middleware
app.use(cryptoCookieParser.cookieParser())
```

### Options
```js
const options = {
  encryptor: {key: 'app_key', serialize_mode: 'php|json'},
  cookie: {
      allow_all: false,
      allowed: ['session', 'superCookie'],
      options: {
          domain: 'localhost',
          expires: 0,
          maxAge: 60*60*1000,
          path: '/',
          sameSite: true,
          secure: false,
          httpOnly: false
      }
  }
}
```

## Options 
### Encryptor options
[node-laravel-encryptor](https://github.com/adsegura/node-laravel-encryptor/blob/master/README.md)
### Cookie options
* allow_all: `<boolean>` [default] `false`
* allowed:   `<array>` list allowed cookie name
* options: `npm cookie package` options 

# Tests
```bash
> npm run test

  Class CryptoCookie
    ✓ should return express instance with res.cookie method overridden
    ✓ should return express instance with res.cookie_async new method

  Test Errors...
    ✓ should throw Error 'overrideCookie express argument not an express instance' when trying to override Cookie method on non express instance
    ✓ should Throw Error MAC signature failed (53ms)

  Express cookie override
    ✓ should client send cipher cookie and cookieParser should decipher it
    ✓ should server res.cookie not populate response Headers Set-Cookie when cookie name is not allowed 
    ✓ should server res.cookie populate response Headers Set-Cookie when cookie name is not allowed and allow_all = true
    ✓ should client send not allowed cookie and cookieParser should discard
    ✓ should client send not allowed cookie when allow_all option true and should not decipher but should be parsed in req.cookies

  Express response res.cookie method and res.cookie_async method
    ✓ should client get cipher cookie using res.cookie_async
    ✓ should client get cipher cookie using res.cookie method overridden

  11 passing (112ms)
```


### Dependencies
* [node-laravel-encryptor](https://github.com/adsegura/node-laravel-encryptor/blob/master/README.md)
    * [php-serialize](https://github.com/steelbrain/php-serialize#readme)

### Contributing
Pull requests are welcome.

### License
[MIT](https://choosealicense.com/licenses/mit/)
