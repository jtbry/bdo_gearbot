const fs = require("fs");

var commandArray = [];

(() => {
    fs.readdirSync('./commands/').forEach((file) => {
        if(file != "index.js") {
            commandArray.push(require(__dirname + "/" + file));
        }
    });
})();


function findCommand(cmd, callback) {
    let hasCalledBack = false;
    commandArray.forEach((element, index) => {
        if(cmd.toLowerCase().startsWith(element.command.toLowerCase())) {
            hasCalledBack = true;
            callback(element);
        }
        if(index == commandArray.length-1 && !hasCalledBack) {
            callback(null);
        }
    });
}

function startCommand(cmd) {
    commandArray.forEach((element) => {
        if(element.command == cmd) {
            element.execute();
        }
    });
}

function getAllModules(callback) {
    return commandArray;
}

module.exports.getAllModules = getAllModules;
module.exports.startCommand = startCommand;
module.exports.findCommand = findCommand;