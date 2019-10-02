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
```


### Dependencies
* [node-laravel-encryptor](https://github.com/adsegura/node-laravel-encryptor/blob/master/README.md)
    * [php-serialize](https://github.com/steelbrain/php-serialize#readme)

### Contributing
Pull requests are welcome.

### License
[MIT](https://choosealicense.com/licenses/mit/)
