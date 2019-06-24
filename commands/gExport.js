const Database = require('../helpers/database');
const { parse } = require('json2csv');


module.exports = {
    command: "~gExport",
    name: "gExport",
    description: "Export guild data as CSV or JSON!",
    usage: "~gExport <format>",
    requiresAdmin: true,
    isEssential: true,
    execute: execute
}

function execute(args) {
    let commandArgs = args.message.content.split(" ");
    Database.getUsersWithSort({guild: args.message.guild.id}, {gear_score: -1}, (err, resultArray) => {
        if(err) {
            args.message.reply("Sorry, I had an issue with this command :(");
            console.log(`gExport -> getUsersWithSort: ${err}`);
        } else {
            let userJsonArray = [];

            for (let index = 0; index < resultArray.length; index++) {
                const databaseUser = resultArray[index];
                const discordUser = args.discordClient.users.find(user => user.id == databaseUser.discord_id);
                if(discordUser) {
                    delete databaseUser._id;
                    userJsonArray.push(Object.assign(databaseUser, {discordUsername: discordUser.username}));
                }
            }

            if(commandArgs[1].toLowerCase() == "json") {
                args.message.author.send(`\`\`\`${JSON.stringify(userJsonArray)}\`\`\``)
                    .then(msg => {
                        args.message.reply("I've DMed you with a JSON export! :D");
                    });
            } else {
                const csv = parse(userJsonArray, null);
                args.message.author.send(`\`\`\`${csv}\`\`\``)
                    .then(msg => {
                        args.message.reply("I've DMed you with a CSV export! :D");
                    });
            }
        }
    });
}

