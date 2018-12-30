//Import dependencies
let ejs = require("ejs");
let electron = require("electron");
let fs = require("fs");
let mime = require("mime");
let path = require("path");
let url = require("url");
let util = require("util");
let EventEmitter = require("events").EventEmitter;

//Import app
let app = electron.app;

//Main function
let ElectronEjs = function (data, options) {
    let self = this;
    //Check for undefined emit
    if (typeof self.emit === "undefined") {
        throw Error("This initialization is obsolete! Please look documentation for more informations.");
    }
    //Check the provided data object
    if (typeof data === "undefined" || data === null) { 
        data = {}; 
    }
    //Check options
    if (typeof options === "undefined" || options === null) { 
        options = {}; 
    }
    //App ready event
    app.on("ready", function () {
        let protocol = electron.protocol;
        //Intercept the file protocol
        protocol.interceptBufferProtocol("file", function (request, callback) {
            let file = ParsePath(request.url);
            let extension = path.extname(file);
            //Check if path exists and is a file
            return fs.stat(file, function (error, stat) {
                if (error) {
                    self.emit("error", error);
                    //Check for not found path
                    if (error.code === "ENOENT") {
                        return callback(-6);
                    }
                    //Unexpected error
                    return callback(-9);
                }
                //Check if the provided path is not a file
                if (stat.isFile() === false) {
                    self.emit("error", new Error("Provided path is not a file"));
                    return callback(-6);
                }
                //Check the extension
                if (extension === ".ejs") {
                    //Add the path to options
                    options.filename = file;
                    //Render template function
                    let renderTemplate = function () {
                        //Render the full file
                        return ejs.renderFile(file, data, options, function (error, content) {
                            if (error) {
                                self.emit("error", error);
                                return callback(-2);
                            }
                            //Call the provided callback with the file content
                            return callback({
                                "data": new Buffer(content), 
                                "mimeType": "text/html"
                            });
                        });
                    };
                    //Check for event before render
                    if (!self.emit("before-render", file, data, options, renderTemplate)) {
                        return renderTemplate();
                    }
                }
                else {
                    //Read the file content
                    return fs.readFile(file, function (error, content) {
                        if (error) {
                            self.emit("error", error);
                            //Generic failure
                            return callback(-2);
                        }
                        //Call the callback with the file content
                        return callback({
                            "data": content, 
                            "mimeType": mime.getType(extension) 
                        });
                    });
                }
            });
        });
    });
};

//Function to parse the path
function ParsePath(u) {
    //Parse the url
    let p = url.parse(u);
    //Get the path name
    let pname = p.pathname;
    //Check for Windows
    if( process.platform === "win32") {
        //Remove the first / from the path
        //https://github.com/jmjuanes/electron-ejs/pull/4#issuecomment-219254028
        pname = pname.substr(1);
    }
    //Sanitize URL. Spaces turn into `%20` symbols in the path and
    //throws a `File Not Found Event`. This fix allows folder paths to have
    //spaces in the folder name.
    //https://github.com/jmjuanes/electron-ejs/pull/9
    return pname.replace(/\s/g, " ").replace(/%20/g, " ");
}

//Inherit EventEmmiter to ElectronEjs
util.inherits(ElectronEjs, EventEmitter);

//Export electron-ejs
module.exports = ElectronEjs;

