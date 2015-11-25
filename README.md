# electron-ejs

[![npm](https://img.shields.io/npm/v/electron-ejs.svg?style=flat-square)](https://www.npmjs.com/package/electron-ejs)
[![npm](https://img.shields.io/npm/dt/electron-ejs.svg?style=flat-square)](https://www.npmjs.com/package/electron-ejs)

Simple Electron plugin for render EJS templates. It allow you to use `ejs` files in your electron projects.


## How to use it

First, install **electron-ejs** using NPM:

```sh
npm install electron-ejs
```

For initialize **electron-ejs** on your project, simply add

```javascript
//Import template parser
var electronEjs = require('electron-ejs')(locals);
```

Where `locals` is an object where each key is used as a variable in your template.


## Issues

You can publish issues here https://github.com/jmjuanes/electron-ejs/issues

## License

**electron-ejs** is under the [MIT](LICENSE) license.
