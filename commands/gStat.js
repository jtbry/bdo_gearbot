const Database = require('../helpers/database');
const Utils = require('../helpers/utils');

module.exports = {
    command: "~gStat",
    name: "gStat",
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
        let searchFilter = {}
        for (let index = 0; index < commandArgs.length; index++) {
            const argument = commandArgs[index];
            if(argument.includes("=")){
                let keyWord = argument.substr(0, argument.indexOf('='));
                let keyValue = argument.substr(argument.indexOf("=")+1);

                switch(keyWord) {
                    case "class":
                        searchFilter["char_class"] = Utils.getValidClass(keyValue);
                        break;
                    case "level":
                        searchFilter["char_level"] = parseInt(keyValue);
                        break;
                    case "axe": 
                        searchFilter["new_axe_lvl"] = keyValue;
                        break;
                }
            }
        }

        Database.getGuildWithFilter(args.message.guild.id, searchFilter, handlePlayerRecords, args.message);
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
        if(player.gear_score == NaN || player.attack_power == NaN || player.defense_power == NaN || player.awaken_atk_power == NaN) {
            console.log(`${player.discord_id} was excluded from gStat due to errors.`);
            return;
        }
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
                thumbnail: {url: discordMessage.guild.iconURL},
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