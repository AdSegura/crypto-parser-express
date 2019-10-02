[![Build Status](https://api.travis-ci.org/adsegura/crypto-parser-express.svg?branch=master)](https://travis-ci.org/adsegura/crypto-parser-express)

# crypto-parser-express

# Not for Prod, on WIP mode.
Express Response Cookie override to add crypto cookie support
and cookie-parser module replacement.

crypto-parser-express use `node-laravel-encryptor` to cipher/decipher cookies with signature verification support

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
    ✓ should return express instance with res.cookie method overridden
    ✓ should return express instance with res.cookie_async new method

  Test Errors...
    ✓ should throw Error 'overrideCookie express argument not an express instance' when trying to override Cookie method on non express instance

  Express cookie override
    ✓ should client send cipher cookie and cookieParser should decipher it (59ms)
    ✓ should server res.cookie not populate response Headers Set-Cookie when cookie name is not allowed 
    ✓ should server res.cookie populate response Headers Set-Cookie when cookie name is not allowed and allow_all = true
    ✓ should client send not allowed cookie and cookieParser should discard
    ✓ should client send not allowed cookie when allow_all option true and should not decipher but should be parsed in req.cookies

  Express response res.cookie method and res.cookie_async method
    ✓ should client get cipher cookie using res.cookie_async
    ✓ should client get cipher cookie using res.cookie method overridden


  10 passing (114ms)
```


### Dependencies
* [node-laravel-encryptor](https://github.com/adsegura/node-laravel-encryptor/blob/master/README.md)
    * [php-serialize](https://github.com/steelbrain/php-serialize#readme)

### Contributing
Pull requests are welcome.

### License
[MIT](https://choosealicense.com/licenses/mit/)
