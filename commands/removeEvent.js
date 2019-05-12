const Database = require('../helpers/database');
const Utils = require('../helpers/utils');

module.exports = {
    command: "~removeEvent",
    name: "removeEvent",
    description: "Remove an existing event",
    usage: "~removeEvent <eventId>",
    requiresAdmin: true,
    isEssential: true,
    execute: execute
}

function execute(args) {
    let eventArgs = args.cmd.split(" ");

    if(eventArgs.length != 2) {
        args.message.reply("Invalid args, usage: `" + module.exports.usage + "`");
        return;
    }

    Database.removeGuildEvent(args.message.guild.id, eventArgs[1], (error) => {
        if(error) {
            args.message.reply(`❌ I couldn't ${eventArgs[1]} from your guild! D:`);
            return;
        } else {
            args.message.reply(`✅ I removed ${eventArgs[1]} from your guild!`);
            return;
        }
    });
}
