const fs = require('fs');

var isConfigReady = false;
var config = {};
var cache = {};

function get(key) {
    if(!isConfigReady) {
        console.log("No config loaded...");
    } else {
        return config[key];
    }
}

function set(key, value) {
    if(!isConfigReady) {
        console.log("No config loaded...");
    } else {
        config[key] = value;
        saveConfig();
    }
}

function cacheSet(key, value) {
    cache[key] = value;
}

function cacheGet(key) {
    if(cache[key].error) {
        console.log("There is an error with the " + key + " cache item");
        return null;
    } else {
        return cache[key];
    }
}

function getFullCache() {
    return cache;
}

function loadConfig() {
    if(!fs.existsSync("config.json")) {
        console.log("Creating config.json file");
        fs.writeFileSync("config.json", "{}");
    }
    let configData = fs.readFileSync("config.json");
    config = JSON.parse(configData);
    isConfigReady = true;
    console.log("Loaded Config.json");
}

function saveConfig() {
    fs.writeFileSync("config.json", JSON.stringify(config));
}

function getFullConfig() {
    return config;
}

function onConfigLoad(callback) {
    if(isConfigReady) {
        callback();
    } else {
        setTimeout(() => {onConfigLoad(callback)}, 300);
    }
}

(() => {
    loadConfig();
})()

module.exports.get = get;
module.exports.set = set;
module.exports.loadConfig = loadConfig;
module.exports.saveConfig = saveConfig;
module.exports.onConfigLoad = onConfigLoad;
module.exports.getFullConfig = getFullConfig;
module.exports.cacheSet = cacheSet;
module.exports.cacheGet = cacheGet;
module.exports.getFullCache = getFullCache;
