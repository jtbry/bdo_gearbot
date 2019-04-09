const Database = require("../helpers/database");
const Utils = require("../helpers/utils");

module.exports = {
    command: "~updateMe",
    name: "updateMe",
    description: "Update your current gear!",
    usage: "~updateMe <key_string>\n    i.e: ~updateMe ap=<new_ap> dp=<new_dp>\n    i.e: ~updateMe screenshot <link_or_file>",
    requiresAdmin: false,
    isEssential: true,
    execute: execute
}

function execute(args) {
    let updateTarget = args.message.author.id;
    let updateArgs = args.cmd.split(" ");
    let newGsObject = {};

    if(updateArgs[1] == "screenshot") {
        // Update Screenshot Only
        if(args.message.embeds[0]) {
            newGsObject["gear_screenshot"] = args.message.embeds[0].url;
            Database.updateUser(updateTarget, newGsObject, args.message, handleUpdateCallback);
        } else if(args.message.attachments.first()) {
            newGsObject["gear_screenshot"] = args.message.attachments.first().url;
            Database.updateUser(updateTarget, newGsObject, args.message, handleUpdateCallback);
        }
    }else {
        if(args.message.content.indexOf("=") == -1 && !(args.message.attachments.first() || args.message.embeds[0])) {
            args.message.reply("Invalid usage, read ~help");
            return;
        }
        for (let index = 0; index < updateArgs.length; index++) {
            const argument = updateArgs[index];
            if(argument.includes("=")) {
                let keyWord = argument.substr(0, argument.indexOf('='));
                let keyValue = argument.substr(argument.indexOf("=")+1);

                switch (keyWord) {
                    case "ap":
                        newGsObject["attack_power"] = parseInt(keyValue);
                        break;
                    case "aap":
                        newGsObject["awaken_atk_power"] = parseInt(keyValue);
                        break;
                    case "dp":
                        newGsObject["defense_power"] = parseInt(keyValue);
                        break;
                    case "level":
                        newGsObject["char_level"] = parseInt(keyValue);
                        break;
                    case "class": 
                        if(!Utils.getValidClass(keyValue)) {
                            args.message.reply("Sorry but " + keyValue + " is not a valid class... idiot.");
                            return;
                        } else {
                            newGsObject["char_class"] = Utils.getValidClass(keyValue);
                        }
                        break;
                    case "axe":
                        if(!Utils.getValidEnhanceValue(keyValue)) {
                            args.message.reply("That's not a valid enhancement level, noob.");
                            return;
                        } else {
                            newGsObject["nw_axe_lvl"] = keyValue;
                        }
                        break;
                    default:
                        break;
                }


            }
            if(index == updateArgs.length-1) {

                if(args.message.embeds[0]) {
                    newGsObject["gear_screenshot"] = args.message.embeds[0].url;
                } else if(args.message.attachments.first()) {
                    newGsObject["gear_screenshot"] = args.message.attachments.first().url;
                }

                Database.findUser(updateTarget, (user) => {
                    if(user) {
                        let apChange = newGsObject.attack_power == null ? user.attack_power : newGsObject.attack_power;
                        let aapChange = newGsObject.awaken_atk_power == null ? user.awaken_atk_power : newGsObject.awaken_atk_power;
                        let dpChange = newGsObject.defense_power == null ? user.defense_power : newGsObject.defense_power;
                        let gsChange = Math.ceil(((apChange + aapChange) / 2) + dpChange);
                        newGsObject.gear_score = gsChange;

                        Database.updateUser(updateTarget, newGsObject, args.message, (discordMessage, error) => {
                            if(!error) {
                                if(newGsObject.attack_power || newGsObject.defense_power || newGsObject.awaken_atk_power) {
                                    let response = "Updates: ```\n";

                                    response += "AP: " + user.attack_power + " -> " + apChange + "\n";
                                    response += "AAP: " + user.awaken_atk_power + " -> " + aapChange + "\n";
                                    response += "DP: " + user.defense_power + " -> " + dpChange + "\n";
                                    response += "GS: " + user.gear_score + " -> " + gsChange + "\n";

                                    response += "```";

                                    args.message.reply(response);
                                } else {
                                    args.message.reply("I updated you, nice progression!");
                                }
                            }
                        });
                    } else {
                        args.message.reply("You're not in the database... bully.");
                    }
                });
                
            }
        };
    }
}

function handleUpdateCallback(discordMessage, error) {
    if(!error) {
        discordMessage.reply("I updated your screenshot.");
    } else {
        discordMessage.reply("Sorry, I had a siezure!");
        console.log(error);
    }
}