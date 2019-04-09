const Discord = require('discord.js');
const client = new Discord.Client();
const Database = require('./helpers/database');
const Commands = require('./commands');
const Config = require('./helpers/config');
const Utils = require('./helpers/utils');
const CURRENT_VERSION = "1.3";

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setPresence({ game: { name: 'with Mushroom-chan | v'+CURRENT_VERSION }, status: 'dnd' });
});

client.on('message', msg => {
    if(msg.content.startsWith("~") && msg.channel == Discord.DMChannel) {
        processCommand(msg.content, msg);
    }
});

function processCommand(str, msg) {
    if(str.startsWith("~help")){
        moduleHelpArr = Commands.getAllModules();
        let helpString = "```";
        moduleHelpArr.forEach((cmdModule, index) => {
            if(cmdModule.isEssential) {
                helpString += cmdModule.name + ": " + cmdModule.description + "\n     " + cmdModule.usage +"\n\n";
            }

            if(index == (moduleHelpArr.length -1)) {
                helpString += "```\nFor more, non essential, commands visit https://github.com/ImpossibleMushroom/`";
                msg.channel.send((helpString));
            }

        });
    } else {
        Commands.findCommand(str, (mod) => {
            if(mod != null) {
                if(mod.requiresAdmin &&  Utils.isManagerMessage(msg)) {
                    mod.execute({cmd: str, message: msg, discordClient: client});
                } else if(!mod.requiresAdmin) {
                    mod.execute({cmd: str, message: msg});
                } else {
                    msg.reply("You're not authorized for that... stupid.");
                }
            } else {
                msg.reply("Sorry, I couldn't find that command. Please read the ~help 8)");
            }
        });
    }
}

client.on("guildMemberRemove", (member) => {
    Database.findUser(member.id, (user) => {
        if(user) {
            Database.deleteUser(member.id, (error) => {
                if(error) {
                    console.log("I had an error removing " + member.id + " from the database");
                }
            });
        }
    })
});

client.on("guildMemberUpdate", (oldMember, newMember) => {
    if(!oldMember.roles.find(role => role.name == "Guildies") && newMember.roles.find(role => role.name == "Guildies")) {
        newMember.send("Welcome to " + newMember.guild.name + ", I'm PepeGear!\nPlease go to the gear_bot channel in our discord and add your gear!\nType ~help if you need help with it!");
    }   
    
    let existingTeamRoles = Config.get("nodewar_teams") == undefined ? [] : Config.get("nodewar_teams");
    existingTeamRoles.forEach(teamRole => {
        if(oldMember.roles.find(role => role.id == teamRole.id) && !newMember.roles.find(role => role.id == teamRole.id)) {
            // A team role has been removed
            Database.findUser(newMember.id, (user) => {
                if(user) {
                    Database.customUpdate(user.discord_id, {$pull: {teams: {id: teamRole.id, guild: teamRole.guild}}}, (error) => {
                        if(error) {
                            console.log("Error Updating Teams: " + error);
                        }
                    });
                }
            });
        } else if(newMember.roles.find(role => role.id == teamRole.id) && !oldMember.roles.find(role => role.id == teamRole.id)) {
            // A team role has been added
            Database.findUser(newMember.id, (user) => {
                if(user) {
                    Database.customUpdate(user.discord_id, {$push: {teams: {id: teamRole.id, guild: teamRole.guild, name: teamRole.name}}}, (error) => {
                        if(error) {
                            console.log("Error Updating Teams: " + error);
                        }
                    });
                }
            });
        }
    });
});

Config.onConfigLoad(() => {
    client.login((process.env.BOT_TOKEN != undefined ? process.env.BOT_TOKEN : Config.get("bot_token")));
});

// 

/* TODO:
    Guild Outliers
    Highest GS Player
    Lowest GS Player
    GS Leaderboard
    Add filters to gstat so users can search by class, team, level, etc
    Do NW functions with Teams
    Prepare bot to assist in nodewars where possible
    Rework config storage (store items by guild)
    Create better interaction for users in multiple guilds using the bot
*/