const Discord = require('discord.js');
const client = new Discord.Client();
const Database = require('./helpers/database');
const Commands = require('./commands');
const Config = require('./helpers/config');
const Utils = require('./helpers/utils');

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setPresence({ game: { name: 'with Mushroom-chan'}, status: 'dnd' });

    client.guilds.array().forEach(userGuild => {
        Database.findGuild(userGuild.id, (err, foundGuild) => {
            if(err) {
                console.log("Error finding guild: " + err);
            } else {
                if(!foundGuild) {
                    Database.addGuild(userGuild.id, userGuild.name, (err) => {
                        if(err) {
                            console.log("Error adding a guild: " + err);
                        }
                    });
                }
            }
        });
    });

});

client.on('error', console.error);

client.on('guildCreate', (guild) => {
    Database.addGuild(guild.id, guild.name, (err) => {
        if(err) {
            console.log("I failed to add " + guild.name + " to the db");
        }
    })
});

client.on('guildDelete', (guild) => {
    Database.deleteGuild(guild.id, (err) => {
        if(err) {
            console.log("I failed to delete"  +  guild.name + " from the db");
        }
    });
});

client.on('message', msg => {
    if(msg.content.startsWith("~") && msg.channel.type == 'text') {
        processCommand(msg.content, msg);
    }
});

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
    
    let existingTeamRoles = Config.cacheGet(newMember.guild.id).guildTeams == null ? [] : Config.cacheGet(newMember.guild.id).guildTeams;
    existingTeamRoles.forEach(teamRole => {
        if(oldMember.roles.find(role => role.id == teamRole.id) && !newMember.roles.find(role => role.id == teamRole.id)) {
            // A team role has been removed
            Database.findUser(newMember.id, (user) => {
                if(user) {
                    Database.customUpdateUser(user.discord_id, {$pull: {teams: {id: teamRole.id, guild: newMember.guild.id}}}, (error) => {
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
                    Database.customUpdateUser(user.discord_id, {$push: {teams: {id: teamRole.id, guild: newMember.guild.id, name: teamRole.name}}}, (error) => {
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
    client.login((process.env.BOT_TOKEN != undefined ? process.env.BOT_TOKEN : Config.get("bot_token")))
        .catch((result) => {
            console.log("Failed to login, exiting with code 1.");
            process.exit(1);
        });
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
                helpString += "\n\nFor more, non essential, commands visit https://github.com/ImpossibleMushroom/bdo_gearbot/wiki/Help-Page```";
                msg.channel.send((helpString));
            }

        });
    } else {
        Commands.findCommand(str, (mod) => {
            if(mod != null) {
                if(mod.requiresAdmin &&  Utils.isManagerMessage(msg)) {
                    mod.execute({cmd: str, message: msg, discordClient: client});
                } else if(!mod.requiresAdmin) {
                    mod.execute({cmd: str, message: msg, discordClient: client});
                } else {
                    msg.reply("You're not authorized for that... stupid.");
                }
            } else {
                msg.reply("Sorry, I couldn't find that command. Please read the ~help 8)");
            }
        });
    }
}
