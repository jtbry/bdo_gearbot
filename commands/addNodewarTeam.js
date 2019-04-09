const Config = require('../helpers/config');

module.exports = {
    command: "~addNodewarTeam",
    name: "addNodewarTeam",
    description: "Add a nodewar role!",
    usage: "~addNodewarTeam @role",
    requiresAdmin: true,
    execute: execute
}

function execute(args) {
    let configTeams = Config.get("nodewar_teams");
    let existingTeams = (configTeams == undefined || configTeams == null) ? [] : configTeams;

    if(existingTeams != []) {
        for (let index = 0; index < existingTeams.length; index++) {
            const team = existingTeams[index];
            if(team == null) {
                existingTeams.splice(index, 1);
                Config.set("nodewar_teams", existingTeams);
                args.message.reply("Sorry, I had a smol issue. Please try again");
                return;
            }
            else if(team.id == args.message.mentions.roles.first().id && team.guild == args.message.guild.id) {
                args.message.reply("That role is already a team...silly");
                return;
            }
        }
    }

    if(args.message.mentions.roles.first()) {
        existingTeams.push({"id": args.message.mentions.roles.first().id, "guild": args.message.guild.id, "name": args.message.mentions.roles.first().name});
        Config.set("nodewar_teams", existingTeams);
        args.message.reply("Added " + args.message.mentions.roles.first().name);
    }
}