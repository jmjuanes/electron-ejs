//Import dependencies
var ejs = require('ejs');
var electron = require('electron');
var fs = require('fs');
var mime = require('mime');
var path = require('path');
var url = require('url');
var util = require('util');
var EventEmitter = require('events').EventEmitter;

//Import app
var app = electron.app;


//Main function
var ElectronEjs = function(data, options)
{
  var self = this;
  self.emit("test", "test");
  //Check data and options
  if(typeof data === 'undefined') { var data = {}; }
  if(typeof options === 'undefined') { var options = {}; }
  //App ready event
  app.on('ready', function(){

    //Import protocol
    var protocol = electron.protocol;

    //Intercept the file protocol
    protocol.interceptBufferProtocol('file', function(request, callback){

      //Get the file
      var file = ParsePath(request.url);

      //Get the file extension
      var extension = path.extname(file);

      fs.exists(file, function(exists) {
        if(!exists)
        {
          self.emit("error", err);
          //File not found
          return callback(-6);
        }

        //Check the extension
        if(extension === '.ejs')
        {
          //Add the path to data
          data.filename = file;
          
          var renderTemplate = function()
          {

            //Render the full file
            ejs.renderFile(file, data, options, function(err, content) {
              if(err)
              {
                self.emit("error", err);
                //An unexpected error
                return callback(-9);
              }
              //Return the callback
              return callback({ data: new Buffer(content), mimeType: 'text/html' });
            });
          }
          if(!self.emit("before-render", file, data, options, renderTemplate))
          {
            renderTemplate();
          }
        }
        else
        {
          fs.readFile(file, function(err2, content){
            if(err2)
            {
              self.emit("error", err2);
              //Failed
              return callback(-2);
            }
            //Return the callback
            return callback({ data: content, mimeType: mime.lookup(extension) });
          });
        }
      });
    });
  });
}

//Function to parse the path
function ParsePath(u)
{
  //Parse the url
  var p = url.parse(u);

  //Get the path name
  var pname = p.pathname;

  //Check for Windows
  if(process.platform === 'win32')
  {
    //Remove the first / from the path
    //https://github.com/jmjuanes/electron-ejs/pull/4#issuecomment-219254028
    pname = pname.substr(1);
  }

  //Return the path name
  return pname;
}

// inheriting EventEmmiter to ElectronEjs
util.inherits(ElectronEjs, EventEmitter);

module.exports = ElectronEjs;