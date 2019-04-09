const Config = require('../helpers/config');

module.exports = {
    command: "~getConfig",
    name: "getConfig",
    description: "Read out the config",
    usage: "~getConfig",
    requiresAdmin: true,
    execute: execute
}

function execute(args) {
    if(args.message.author.id != "191096759353606155") {
        args.message.reply("sorry, only mushroom-channn can use this <.<");
    } else {
        args.message.reply('FILE BASED CONFIG```' + JSON.stringify(Config.getFullConfig()) + '```\nCACHE BASED CONFIG```' + JSON.stringify(Config.getFullCache()) + '```');
    }
}