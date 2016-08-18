"use strict";

module.exports = function(app) {
    app.route("/")
        .get((req, res) => {
            res.render("index");
        })
        .post((req, res) => {
            var boundary = req.headers["content-type"].match(/boundary=(.*)$/)[1];
            var dataBuffer = Buffer(0);
            
            req.on("data", (chunk) => {
                dataBuffer = Buffer.concat([dataBuffer, chunk]);
            });
            
            req.on("end", () => {
                var bufferIndex = 0;
                var buffChar;
                var lineEndingLength = 0;
                
                while (true) {
                    // Get the boundary marker
                    var buffStr = dataBuffer.toString("utf8", bufferIndex, bufferIndex + 2 + boundary.length);
                    if (buffStr != "--" + boundary) {
                        console.log("Expected boundary marker, found '" + buffStr + "'");
                        break;
                    }
                    
                    // Is this the final boundary marker?
                    bufferIndex += 2 + boundary.length;
                    if (dataBuffer.toString("utf8", bufferIndex, bufferIndex + 2) == "--") {
                        break;
                    }
                    
                    // Move past the line ending
                    if (lineEndingLength === 0) {
                        // Store the line ending if we don't have it yet
                        buffChar = dataBuffer.toString("utf8", bufferIndex, bufferIndex + 1);
                        while (buffChar == "\n" || buffChar == "\r") {
                            lineEndingLength++;
                            bufferIndex++;
                            buffChar = dataBuffer.toString("utf8", bufferIndex, bufferIndex + 1);
                        }
                    } else
                        bufferIndex += lineEndingLength;
                    
                    // Get the Content-Disposition line
                    buffStr = "";
                    buffChar = dataBuffer.toString("utf8", bufferIndex, bufferIndex + 1);
                    while (buffChar != "\n" && buffChar != "\r") {
                        buffStr += buffChar;
                        bufferIndex++;
                        buffChar = dataBuffer.toString("utf8", bufferIndex, bufferIndex + 1);
                    }
                    
                    // Check to make sure everything is cool
                    var cdArray = buffStr.split("; ");
                    if (cdArray[0] != "Content-Disposition: form-data") {
                        console.log("Expected 'Content-Disposition: form-data', received '" + cdArray[0] + "'");
                        break;
                    }
                    
                    // Get the form item name
                    var formItem = cdArray[1].match(/name="(.*)"$/)[1];
        
                    // If this is a file item, get the filename and content type
                    if (cdArray.length == 3) {
                        var formFileName = cdArray[2].match(/filename="(.*)"$/)[1];
                        
                        // Move past the line ending
                        bufferIndex += lineEndingLength;
                        
                        // Get the Content-Type
                        buffStr = "";
                        buffChar = dataBuffer.toString("utf8", bufferIndex, bufferIndex + 1);
                        while (buffChar != "\n" && buffChar != "\r") {
                            buffStr += buffChar;
                            bufferIndex++;
                            buffChar = dataBuffer.toString("utf8", bufferIndex, bufferIndex + 1);
                        }
                        
                        var contentType = buffStr.match(/Content-Type: (.*)$/)[1];
                    }
        
                    // Move to the beginning of the data area
                    bufferIndex += lineEndingLength * 2;
                    
                    // Find the end of the data area by looking for the next boundary marker
                    var dataEndIndex = dataBuffer.indexOf("--" + boundary, bufferIndex);
        
                    // Copy the data area
                    var data = new Buffer(dataEndIndex - bufferIndex - lineEndingLength);
                    dataBuffer.copy(data, 0, bufferIndex, dataEndIndex - lineEndingLength);
                    
                    // Move the buffer index past the data area
                    bufferIndex = dataEndIndex;
                    
                    res.send({filename: formFileName, size: data.length});
                }
            });
        });
}