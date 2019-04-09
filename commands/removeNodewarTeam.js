const Database = require('../helpers/database');

module.exports = {
    command: "~removeNodewarTeam",
    name: "removeNodewarTeam",
    description: "Remove a nodewar team role!",
    usage: "~removeNodewarTeam @role",
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
                let existingTeams = guild.guildTeams;
                if(!existingTeams.find(team => team.id == proposedRoleJson.id)) {
                    args.message.reply("That role isn't a nodewar team, don't waste my time. :(");
                } else {
                    Database.updateGuild(args.message.guild.id, {$pull: {guildTeams: proposedRoleJson}}, (err) => {
                        if(err) {
                            console.log(err);
                            args.message.reply("I had an error removing that role, sorry.");
                        } else {
                            args.message.reply("I removed " + proposedRoleJson.name + " from your guild's nodewar teams!");
                        }
                    });
                }
            } else {
                args.message.reply("Nani!?!?? Your guild doesn't exist, how did you send this?!");
            }
        }
    });
}