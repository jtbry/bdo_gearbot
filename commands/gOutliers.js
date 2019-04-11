const Database = require('../helpers/database');

module.exports = {
    command: "~gOutliers",
    name: "gOutliers",
    description: "Get group outliers!",
    usage: "~gOutliers",
    requiresAdmin: true,
    isEssential: false,
    execute: execute
}

function execute(args) {
    Database.getWholeGuild(args.message.guild.id, handlePlayerRecords, args.message);
}

function handlePlayerRecords(error, players, discordMessage) {
    if(players.length <= 2) {
        discordMessage.reply("Sorry, you need more than two players for an outlier!");
        return;
    }

    let lowestGearscorePlayer = null;
    let highestGearscorePlayer = null;
    let totalAverages = {ap: 0, dp: 0, aap: 0, gs: 0};

    for (let index = 0; index < players.length; index++) {
        const currentPlayer = players[index];
        
        totalAverages.ap += currentPlayer.attack_power;
        totalAverages.dp += currentPlayer.defense_power;
        totalAverages.aap += currentPlayer.awaken_atk_power;
        totalAverages.gs += currentPlayer.gear_score;

        if(lowestGearscorePlayer == null) {
            lowestGearscorePlayer = currentPlayer;
        } else {
            if(currentPlayer.gear_score < lowestGearscorePlayer.gear_score){
                lowestGearscorePlayer = currentPlayer;
            }
        }  

        if(highestGearscorePlayer == null) {
            highestGearscorePlayer = currentPlayer;
        } else {
            if(currentPlayer.gear_score > highestGearscorePlayer.gear_score){
                highestGearscorePlayer = currentPlayer;
            }
        }
        
    }

    let gsAvgWithoutLowest = Math.ceil((totalAverages.gs - lowestGearscorePlayer.gear_score) / (players.length -1));
    let gsAvgWithoutHighest = Math.ceil((totalAverages.gs - highestGearscorePlayer.gear_score) / (players.length -1));
    let gsTotalAvg = Math.ceil(totalAverages.gs / players.length);

    discordMessage.channel.send({embed: {
        color: 0x4d0272,
        title: discordMessage.guild.name + " Stats",
        thumbnail: {url: discordMessage.guild.iconURL},
        fields: [{
            name: "Lowest GS Member",
            value: `${discordMessage.guild.members.find(member => member.id == lowestGearscorePlayer.discord_id).user.tag} | GS: ${lowestGearscorePlayer.gear_score}`
        }, {
            name: "Highest GS Member",
            value: `${discordMessage.guild.members.find(member => member.id == highestGearscorePlayer.discord_id).user.tag} | GS: ${highestGearscorePlayer.gear_score}`
        },{
            name: "Outlier Impacts",
            value:  `W/O Lowest: ${gsAvgWithoutLowest} | W/O Highest: ${gsAvgWithoutHighest} | | Normal: ${gsTotalAvg}`
        }]
    }});
}