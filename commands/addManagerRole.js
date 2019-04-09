const Config = require('../helpers/config');

module.exports = {
    command: "~addManagerRole",
    name: "addManagerRole",
    description: "Add a manager role!",
    usage: "~addManagerRole @role",
    requiresAdmin: true,
    execute: execute
}

function execute(args) {
    let configManagers = Config.get("managers");
    let existingManagers = (configManagers == undefined || configManagers == null) ? [] : configManagers;

    if(existingManagers != []) {
        for (let index = 0; index < existingManagers.length; index++) {
            const manager = existingManagers[index];
            if(manager == null) {
                existingManagers.splice(index, 1);
                Config.set("managers", existingManagers);
                args.message.reply("Sorry, I had a smol issue. Please try again");
                return;
            }
            else if(manager.id == args.message.mentions.roles.first().id && manager.guild == args.message.guild.id) {
                args.message.reply("That role is already a manager...silly");
                return;
            }
        }
    }

    if(args.message.mentions.roles.first()) {
        existingManagers.push({"id": args.message.mentions.roles.first().id, "guild": args.message.guild.id});
        Config.set("managers", existingManagers);
        args.message.reply("Added " + args.message.mentions.roles.first().name);
    }
}