//Import dependencies
var ejs = require('ejs');
var electron = require('electron');
var fs = require('fs');
var mime = require('mime');
var path = require('path');
var url = require('url');

//Import app
var app = electron.app;

//Main function
module.exports = function(options)
{
  //Check options
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

      //Get the file content
      fs.readFile(file, 'utf8', function(err, content){

        //Check for error opening the file
        if(err)
        {
          //File not found
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
            var full = ejs.render(content.toString('utf8'), options)

            //Return the callback
            return callback({ data: new Buffer(full), mimeType:'text/html' });
          }
          else
          {
            //Get the mime type
            var mimet = mime.lookup(extension);

            //Return the callback
            return callback({ data: content, mimeType: mimet });
          }
        }
        catch(ex)
        {
          //A generic failure occurred
          return callback(-2);
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
