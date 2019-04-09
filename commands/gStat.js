const Database = require('../helpers/database');
const Config = require('../helpers/config');
const Utils = require('../helpers/utils');

module.exports = {
    command: "~gStat",
    name: "~gStat",
    description: "Get group statistics!",
    usage: "~gStat (Will return stats for whole guild)\n    ~gStat class=Witch (Will return stats for witches)\n    ~gStat <key_word>=<target_value>",
    requiresAdmin: true,
    isEssential: true,
    execute: execute
}

function execute(args) {
    let commandArgs = args.message.content.split(" ");
    if(commandArgs.length <= 1) {
        // Return whole guilds stats
        Database.getWholeGuild(args.message.guild.id, handlePlayerRecords, args.message);
    }
    else {
        // Return guild by specific values
        args.message.reply("This function is not supported yet, pepe busy eating.");
        return;
    }
}

function handlePlayerRecords(error, players, discordMessage) {
    if(error) {
        discordMessage.reply("Sorry, I had a siezure.");
        console.log(error);
        return;
    }

    if(players.length <= 0) {
        discordMessage.reply("There's no players in this guild!");
        return;
    }

    let totalGs = 0;
    let totalAp = 0;
    let totalDp = 0;
    let totalAap = 0;
    let foundClasses = [];

    players.forEach((player, index) => {
        totalGs += player.gear_score;
        totalAp += player.attack_power;
        totalDp += player.defense_power;
        totalAap += player.awaken_atk_power;

        if(!foundClasses.includes(player.char_class)) {
            foundClasses.push(player.char_class);
        }

        if(index == players.length -1) {
            discordMessage.channel.send({embed: {
                color: 0x4d0272,
                title: discordMessage.guild.name + " Stats",
                thumbnail: {url: discordMessage.iconURL},
                fields: [{
                    name: "Avg Attack Power",
                    value: Math.ceil(totalAp / players.length)
                }, {
                    name: "Avg Awaken Attack Power (AAP)",
                    value: Math.ceil(totalAap / players.length)
                },{
                    name: "Avg Defense Power (DP)",
                    value: Math.ceil(totalDp / players.length)
                },{
                    name: "Avg Gear Score",
                    value: Math.ceil(totalGs / players.length)
                },{
                    name: "Members in Filter",
                    value: players.length
                },{
                    name: "Class Diversity",
                    value: foundClasses.length + " different classes"
                }]
            }});
        }
    });
}