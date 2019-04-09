const Config = require('../helpers/config');

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
        args.message.reply("No role mentions, weirdo.");
        return;
    }

    let existingTeams = Config.get("nodewar_teams") == undefined ? [] : Config.get("nodewar_teams");
    for (let index = 0; index < existingTeams.length; index++) {
        const team = existingTeams[index];
        if(team == null) {
            existingTeams.splice(index, 1);
            Config.set("nodewar_teams", existingTeams);
            args.message.reply("Sorry, I had a smol issue. Please try again");
            return;
        }
        else if(team.id == args.message.mentions.roles.first().id && team.guild == args.message.guild.id) {
            existingTeams.splice(index, 1);
            Config.set("nodewar_teams", existingTeams);
            args.message.reply("Removed that role from teams!");
            return;
        }
    }

}