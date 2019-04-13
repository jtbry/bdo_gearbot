const Database = require('../helpers/database');

module.exports = {
    command: "~gLeaderboard",
    name: "gLeaderboard",
    description: "Get top 10 gear scores.",
    usage: "~gLeaderboard",
    requiresAdmin: true,
    isEssential: true,
    execute: execute
}

function execute(args) {
    Database.getUsersWithSort({guild: args.message.guild.id}, {gear_score: -1}, (err, resultArray) => {
        let leaderboardString = "";
        const playersToRank = resultArray.length > 10 ? 10 : resultArray.length;

        for (let index = 0; index < playersToRank; index++) {
            const databaseUser = resultArray[index];
            const discordUser = args.discordClient.users.find(user => user.id == databaseUser.discord_id);
            if(discordUser) {
                leaderboardString += ((index+1).toString() + ") " + discordUser.username + " - " + databaseUser.gear_score + "\n");
            }
        }

        args.message.channel.send({embed: {
            color: 0x4ef442,
            fields: [{
                name: "Ranks!",
                value: leaderboardString
            }]
        }});
    });
}