# electron-ejs

[![npm](https://img.shields.io/npm/v/electron-ejs.svg?style=flat-square)](https://www.npmjs.com/package/electron-ejs)
[![npm](https://img.shields.io/npm/dt/electron-ejs.svg?style=flat-square)](https://www.npmjs.com/package/electron-ejs)

Simple Electron plugin for render EJS templates. It allows you to use `ejs` files in your electron projects.


## Install

Install **electron-ejs** using NPM:

```
npm install electron-ejs
```

## Usage

```javascript
//Import dependencies 
var electron = require('electron');
var electronEjs = require('electron-ejs')(); 

//Initialize the app 
var app = electron.app;

//Initialize the ejs parser 
var ejs = new electronEjs({ key: 'my value' }, {}); 

//Now you can read EJS files
app.on('ready', function()
{
  //Create the new window
  mainWindow = new BrowserWindow({ width: 800, height: 600 });
  
  //More app configuration
  // ....
  
  //Load the ejs file
  mainWindow.loadUrl('file://' + __dirname + '/index.ejs');
});
``` 

## API

### electronEjs(data, options)

Initializes the `electron-ejs` parser. This can take the following arguments: 

#### data 

An object with the data that will be used as a variable in your `ejs` files. 

#### options 

An object with the `ejs` options. The list with all the options are available here: [https://github.com/mde/ejs#options](https://github.com/mde/ejs#options). 

The `filename` options is not necessary and will be ignored.


## Want to contribute?

Pull requests and issues are always welcome :)

## Contributors

[![Josemi Juanes](https://avatars3.githubusercontent.com/u/5751201?v=3&s=100)](https://github.com/jmjuanes) | [![Marek Kraus](https://avatars3.githubusercontent.com/u/1665373?v=3&s=100)](https://github.com/gamelaster)
---|---
[Josemi Juanes](https://github.com/jmjuanes) | [Marek Kraus](https://github.com/gamelaster)


## License

[MIT](LICENSE) &copy; Josemi Juanes.
