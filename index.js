//Import electron
var electron = require('electron');
var app = electron.app;

//Import dependencies
var fs = require('fs');
var path = require('path');
var pathurl = require('url');
var ejs = require('ejs');
var mime = require('mime');

//Main function
function ElectronEjs(options)
{
  //Check options
  if(typeof options === 'undefined') { var options = {}; }

  //App ready event
  app.on('ready', function(){

    //Import protocol
    var protocol = require('protocol');

    //Intercept the file protocol
    protocol.interceptBufferProtocol('file', function(request, callback){

      //Get the file
      var file = ParsePath(request.url);

      //Get the file extension
      var extension = path.extname(file);

      //Get the file content
      fs.readFile(file, 'utf8', (err, content) => {
        if(err)
        {
          return callback(-6);
        }
        try
        {
          //Check the extension
          if(extension === '.ejs')
          {
            //Add the path to options
            options.filename = file;

            //Get the full file
            var full = ejs.render(content.toString("utf8"), options)

            //Return the callback
            return callback({data: new Buffer(full), mimeType:'text/html'});
          }
          else
          {
            //Get the mime type
            var mimet = mime.lookup(extension);

            //Return the callback
            return callback({data: content, mimeType: mimet});
          }
        }
        catch(ex)
        {
          return callback(-2);
        }
      });
    });
  });
}

//Function for parse the path
function ParsePath(url)
{
  //Parse the url
  var p = pathurl.parse(url);
  var path = p.pathname;
  
  if(process.platform === 'win32') {
    path = path.substr(1);
  }
  
  //Return the path name
  return path;
}

//Exports to node
module.exports = ElectronEjs;
