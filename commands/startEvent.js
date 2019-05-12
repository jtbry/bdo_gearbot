const Database = require('../helpers/database');
const Utils = require('../helpers/utils');

module.exports = {
    command: "~startEvent",
    name: "startEvent",
    description: "Start an event and get attendence",
    usage: "~startEvent <month/day/year> <title> <role_to_message>",
    requiresAdmin: true,
    isEssential: true,
    execute: execute
}

function execute(args) {
    let eventArgs = args.cmd.split(" ");

    if(eventArgs.length < 4) {
        args.message.reply("Invalid args, usage: `" + module.exports.usage + "`");
        return;
    }

    let eventUnixTimeString = Date.parse(eventArgs[1]);
    let eventChannel = args.message.channel.id;
    let eventTitle = Utils.combineStringArray(eventArgs, 2, eventArgs.length-1);
    let eventId = Utils.generateRandomString(5);
    let eventRoleTarget = args.message.mentions.roles.array()[0].id;

    if(isNaN(eventUnixTimeString) || 
        eventChannel == undefined || 
        eventTitle == undefined || 
        eventId == undefined || 
        eventRoleTarget == undefined || 
        eventUnixTimeString == undefined) {
            args.message.reply("Invalid args, usage: `" + module.exports.usage + "`");
            return;
    } else {
        Database.addGuildEvent(args.message.guild.id, eventId, eventUnixTimeString, eventTitle, eventChannel, eventRoleTarget, (error) => {
            if(error) {
                args.message.reply("Sorry, I had an error adding that event!");
                return;
            } else {
                args.message.delete();
                args.message.channel.send({embed: {
                    color: 0xf4f418,
                    thumbnail: {url: args.message.guild.iconURL},
                    fields: [{
                        name: `${eventTitle} | Event ID: ${eventId}`,
                        value: `${Utils.getHumanStringFromUnix(eventUnixTimeString)}, please react with ✅ if you can attend and ❌ if you can't.`,
                    }]
                }}).then((msg) => {
                    Database.updateGuildEventMessage(args.message.guild.id, eventId, msg.id, (error) => {
                        if(error) {
                            args.message.reply("You may need to recreate this event, I failed to add it's message ID.");
                        }
                    });
                    msg.react("✅");
                    msg.react("❌");
                });
            }
        });
    }

}
