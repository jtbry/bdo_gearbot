const Database = require('../helpers/database');

module.exports = {
    command: "~removeManagerRole",
    name: "removeManagerRole",
    description: "Remove a manager role!",
    usage: "~removeManagerRole @role",
    requiresAdmin: true,
    execute: execute
}

function execute(args) {
    if(!args.message.mentions.roles.first()) {
        return;
    }

    Database.findGuild(args.message.guild.id, (err, guild) => {
        if(err) {
            args.message.reply("Sorry, I had an issue finding your guild. u_u");
        } else {
            if(guild) {
                let proposedRoleJson = {"id": args.message.mentions.roles.first().id, "name": args.message.mentions.roles.first().name};
                let existingManagers = guild.guildManagers;
                if(!existingManagers.find(manager => manager.id == proposedRoleJson.id)) {
                    args.message.reply("That role isn't a manager >:(");
                } else {
                    Database.updateGuild(args.message.guild.id, {$pull: {guildManagers: proposedRoleJson}}, (err) => {
                        if(err) {
                            console.log(err);
                            args.message.reply("I had an error removing that role, sorry.");
                        } else {
                            args.message.reply("I removed " + proposedRoleJson.name + " from your guild managers!");
                        }
                    });
                }
            } else {
                args.message.reply("Nani!?!?? Your guild doesn't exist, how did you send this?!");
            }
        }
    });
}