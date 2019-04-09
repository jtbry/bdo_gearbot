const Database = require('../helpers/database');

module.exports = {
    command: "~delete",
    name: "delete",
    description: "Delete a person from the bot!",
    usage: "~delete @person",
    requiresAdmin: true,
    execute: execute
}

function execute(args) {
    let target = args.message.mentions.users.first().id;
    Database.findUser(target, (result) => {
        if(!result) {
            args.message.reply("That user doesn't exist.");
        } else {
            Database.deleteUser(target, (error) => {
                if(error) {
                    console.log(error);
                    args.message.reply("Sorry, I had a siezure!");
                } else {
                    args.message.reply("Removed " + target + " from the bot!");
                }
            });
        }
    });
}
