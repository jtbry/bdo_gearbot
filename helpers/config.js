const fs = require('fs');

var isConfigReady = false;
var config = {};
var cache = {};

// Get a value from the file based config
function get(key) {
    if(!isConfigReady) {
        console.log("No config loaded...");
    } else {
        return config[key];
    }
}

// Set a value in the file based config
function set(key, value) {
    if(!isConfigReady) {
        console.log("No config loaded...");
    } else {
        config[key] = value;
        saveConfig();
    }
}

// Set a value in the cache based config
function cacheSet(key, value) {
    cache[key] = value;
}

// Get a value in the cache based config
function cacheGet(key) {
    if(!cache[key]) {
        return false;
    }
    if(cache[key].error) {
        console.log("There is an error with the " + key + " cache item");
        return null;
    } else {
        return cache[key];
    }
}

// Return the full array which holds the cache
function getFullCache() {
    return cache;
}

// Load the file config 
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

// Force a save to the config file
function saveConfig() {
    fs.writeFileSync("config.json", JSON.stringify(config));
}

// Return the full array holds the file based config
function getFullConfig() {
    return config;
}

// Set a callback for waiting on the config to load
function onConfigLoad(callback) {
    if(isConfigReady) {
        callback();
    } else {
        setTimeout(() => {onConfigLoad(callback)}, 300);
    }
}

// Auto ran when file is loaded
(() => {
    loadConfig();
})()

// File based config exports
module.exports.get = get;
module.exports.set = set;
module.exports.loadConfig = loadConfig;
module.exports.saveConfig = saveConfig;
module.exports.onConfigLoad = onConfigLoad;
module.exports.getFullConfig = getFullConfig;

// Cache based config exports
module.exports.cacheSet = cacheSet;
module.exports.cacheGet = cacheGet;
module.exports.getFullCache = getFullCache;
