"use strict";

var express = require("express"), lintapp = express(), result;

function errorMessage(message, data, index) 
{
    return "<p><code>" + data.substr(Math.max(index - 10, 0), 20) + "</code></p><p>" + message + "</p><p>Received: <code>" + data.substr(index, 5) + "</code></p>";
}
    
function match(regex, data, index) 
{
    var searchResult = regex.exec(data.substr(index));
    return (searchResult === null ? -1 : (searchResult.index + searchResult[0].length));
}

function matchArray(data, index) 
{
    var dataIndex = index, pos = match(/^\s*\[/, data, dataIndex);
    if (pos == -1) return -1;
    
    dataIndex += pos;
    while (dataIndex < data.length && !/^\s*\]/.test(data.substr(dataIndex)))
    {
        pos = matchValue(data, dataIndex);
        if (pos == -1)
        {
            result += errorMessage("Expected a value", data, dataIndex);
            return -1;
        }
        
        dataIndex = pos;
        pos = match(/^\s*,/, data, dataIndex);
        if (pos == -1)
        {
            if (!/^\s*\]/.test(data.substr(dataIndex)))
            {
                result += errorMessage("Expected array separator <code>,</code>", data, dataIndex);
                return -1;
            }
            break;
        }
        
        dataIndex += pos;
    }
    
    if (dataIndex >= data.length)
    {
        result += errorMessage("Unexpected end of data", data, data.length - 1);
        return -1;
    }
    
    pos = match(/^\s*\]/, data, dataIndex);
    if (pos == -1)
    {
        result += errorMessage("Expected array ending delimiter <code>]</code>", data, dataIndex);
        return -1;
    }
    
    return dataIndex + pos;
}

function matchString(data, index) 
{
    var dataIndex = index, pos = match(/^\s*\"/, data, dataIndex);
    if (pos == -1) return -1;
    
    dataIndex += pos;
    while (dataIndex < data.length && data.charAt(dataIndex) != '"')
    {
        if (data.charAt(dataIndex) == '\\')
        {
            pos = match(/^["\\\/bfnrt]|(u[0-9a-fA-F]{4})/, data, dataIndex + 1);
            if (pos == -1)
            {
                result += errorMessage("Invalid string", data, dataIndex);
                return -1;
            }
            dataIndex += pos;
        }
        dataIndex++;
    }
    
    if (dataIndex >= data.length)
    {
        result += errorMessage("Unterminated string", data, data.length - 1);
        return -1;
    }
    
    return dataIndex + 1;
}

function matchValue(data, index) 
{
    var dataIndex = index, pos = 0;
    
    if (/^\s*\"/.test(data.substr(dataIndex)))
        dataIndex = matchString(data, dataIndex);
    else if (/^\s*\{/.test(data.substr(dataIndex)))
        dataIndex = matchObject(data, dataIndex);
    else if (/^\s*\[/.test(data.substr(dataIndex)))
        dataIndex = matchArray(data, dataIndex);
    else if (/^\s*-?[0-9]/.test(data.substr(dataIndex)))
    {
        pos = match(/^\s*-?(0|([1-9][0-9]*))(\.[0-9]*)?([eE][+-]?[0-9]+)?/, data, dataIndex);
        if (pos == -1)
        {
            result += errorMessage("Invalid number", data, dataIndex);
            return -1;
        }
    }
    else
        pos = match(/^\s*(true|false|null)/, data, dataIndex);
        
    if (pos == -1)
    {
        result += errorMessage("Expected a value", data, dataIndex);
        return -1;
    }
    
    return dataIndex + pos;
}
    
function matchObject(data, index) 
{
    var dataIndex = index, pos = match(/^\s*\{/, data, dataIndex);
    if (pos == -1)
    {
        result += errorMessage("Expected object start delimiter <code>{</code> ", data, dataIndex);
        return -1;
    }
    
    dataIndex += pos;
    while (dataIndex < data.length && !/^\s*\}/.test(data.substr(dataIndex)))
    {
        pos = matchString(data, dataIndex);
        if (pos == -1)
        {
            result += errorMessage("Expected name/value pair name string", data, dataIndex);
            return -1;
        }
        
        dataIndex = pos;
        pos = match(/^\s*:/, data, dataIndex);
        if (pos == -1)
        {
            result += errorMessage("Expected name/value pair separator <code>:</code>", data, dataIndex);
            return -1;
        }
        
        dataIndex += pos;
        pos = matchValue(data, dataIndex);
        if (pos == -1)
        {
            result += errorMessage("Expected name/value pair value", data, dataIndex);
        }
        
        dataIndex = pos;
        pos = match(/^\s*,/, data, dataIndex);
        if (pos == -1)
        {
            if (/^\s*\"/.test(data.substr(dataIndex)))
            {
                result += errorMessage("Excpected <code>,</code>", data, dataIndex);
                return -1;
            }
            break;
        }
            
        dataIndex += pos;
    }
    
    if (dataIndex >= data.length)
    {
        result += errorMessage("Unexpected end of data", data, data.length - 1);
        return -1;
    }
    
    pos = match(/^\s*\}/, data, dataIndex);
    if (pos == -1)
    {
        result += errorMessage("Expected object end delimiter </code>}</code>", data, dataIndex);
        return -1;
    }

    return dataIndex + pos;
}
    
lintapp.route("/").get((req, res) => {
        if (req.query.json)
        {
            result = "";
            matchObject(req.query.json, 0);
        }
        res.send(req.query.json ? (result == "" ? "<p>Valid JSON</p>" : result) : "<h1>Usage:</h1><p><code>" + req.headers["x-forwarded-proto"] + "://" + req.headers.host + req.baseUrl + "/?json={JSON Object}</code></p><h3>Example:</h3><p><code>https://cp-jsonlint-elrolfe305.c9users.io/?json={\"name\" : \"test\"}</code></p>");
    });
    
// lintapp.listen(process.env.PORT, () => {
//     console.log("JSONLint lintapp listening on " + process.env.PORT + "...");
// });

module.exports = lintapp;