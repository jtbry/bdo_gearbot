const Config = require('../helpers/config');

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
        args.message.reply("No role mentions, weirdo.");
        return;
    }

    let existingManagers = Config.get("managers") == undefined ? [] : Config.get("managers");
    for (let index = 0; index < existingManagers.length; index++) {
        const manager = existingManagers[index];
        if(manager == null) {
            existingManagers.splice(index, 1);
            Config.set("managers", existingManagers);
            args.message.reply("Sorry, I had a smol issue. Please try again");
            return;
        }
        else if(manager.id == args.message.mentions.roles.first().id && manager.guild == args.message.guild.id) {
            existingManagers.splice(index, 1);
            Config.set("managers", existingManagers);
            args.message.reply("Removed that role from managers!");
            return;
        }
    }

}