const Config = require('../helpers/config');
const Utils = require('../helpers/utils');

module.exports = {
    command: "~remindEvent",
    name: "remindEvent",
    description: "Remind the target role of an event",
    usage: "~remindEvent <eventId>",
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

    let cachedGuild = Config.cacheGet(args.message.guild.id);
    let guildEvents = cachedGuild.guildEvents;
    
    for(let i = 0; i < guildEvents.length; i++) {
        const thisEvent = guildEvents[i];
        if(thisEvent.eventId == eventArgs[1]) {
            let membersSnowflake = args.message.guild.roles.get(thisEvent.eventTargetRole).members;
            let eventChannel = args.message.guild.channels.find(channel => channel.id == thisEvent.eventChannel);
            eventChannel.fetchMessage(thisEvent.eventMessage)
                .then(message => messageAllMembers(membersSnowflake, eventChannel, message, thisEvent));
            
            args.message.channel.send("Sending a reminder to users... 8)")
                .then((responseMessage) => {
                    setTimeout(() => {
                        responseMessage.delete();
                    }, 5000);
                });
            args.message.delete();
            
        }
        else if(i == guildEvents.length - 1) {
            args.message.reply("I didn't find that event, wtf man!");
        }
    }
}

function messageAllMembers(memberArray, eventChannel, eventMessage, eventObject) {
    memberArray.forEach(member => {
        if(!memberHasReacted(eventMessage, member)) {
            member.send(`You haven't set your attendance for ${eventObject.eventTitle}. Please goto <#${eventChannel.id}> and set your attendance!`)
                .catch(error => console.log(error));
        }
    });
}

function memberHasReacted(message, member) {
    if(message.reactions.get("❌").users.find(usr => usr.id == member.id) || message.reactions.get("✅").users.find(usr => usr.id == member.id)) {
        return true;
    } else {
        return false;
    }
}