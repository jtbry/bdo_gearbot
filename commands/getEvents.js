const Config = require('../helpers/config');
const Utils = require('../helpers/utils');

module.exports = {
    command: "~getEvents",
    name: "getEvents",
    description: "List all events",
    usage: "getEvents",
    requiresAdmin: true,
    isEssential: true,
    execute: execute
}

function execute(args) {
    let cachedGuild = Config.cacheGet(args.message.guild.id);
    let guildEvents = cachedGuild.guildEvents;
    let guildEventsListString = "";
    
    if(guildEvents.length < 1) {
        args.message.reply("You've got no events planned... weirdo tbh.");
        return;
    }
    for(let i = 0; i < guildEvents.length; i++) {
        guildEventsListString += `${guildEvents[i].eventId} - ${guildEvents[i].eventTitle} | ${Utils.getHumanStringFromUnix(guildEvents[i].eventDate)}\n`;
    }

    args.message.reply("```" + guildEventsListString + "```");
}