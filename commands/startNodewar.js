const Database = require('../helpers/database');

module.exports = {
    command: "~startNodewar",
    name: "startNodewar",
    description: "Start a nodewar and get attendence",
    usage: "~startNodewar <date> <title> <message>",
    requiresAdmin: true,
    isEssential: false,
    execute: execute
}

function execute(args) {
    args.message.reply("This function is not ready yet");
}
