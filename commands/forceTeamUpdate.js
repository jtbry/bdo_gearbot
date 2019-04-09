const Database = require('../helpers/database');
const Config = require("../helpers/config");

module.exports = {
    command: "~forceTeamUpdate",
    name: "forceTeamUpdate",
    description: "Force a team update for all guild users",
    usage: "~forceTeamUpdate",
    requiresAdmin: true,
    execute: execute
}

function execute(args) {
    if(args.message.author.id != "191096759353606155") {
        args.message.reply("sorry, only mushroom-channn can use this <.<");
    } else {
        let existingTeamRoles = Config.cacheGet(msg.guild.id).guildTeams == null ? [] : Config.cacheGet(msg.guild.id).guildTeams;
        let guildMembers = args.message.guild.members.array();
        guildMembers.forEach(member => {
            Database.findUser(member.id, (user) => {
                if(user) {
                    let userExistingTeams = user.teams == null ? [] : user.teams;
                    let guildMemberRoles = member.roles.array();
                    guildMemberRoles.forEach(role => {
                        existingTeamRoles.forEach(existingTeam => {
                            if(role.id == existingTeam.id && existingTeam.guild == role.guild.id) {
                                if(!userExistingTeams.find(team => team.id == role.id)) {
                                    // Add this role to user in database
                                    userExistingTeams.push({"id": role.id, "guild": role.guild.id, "name": role.name});
                                    Database.updateUser(user.discord_id, {teams: userExistingTeams}, args, (msg, error) => {
                                        if(error) {
                                            args.message.reply("Please check the logs.");
                                            console.log(error);
                                        }
                                    });
                                }
                            }
                        });
                    });
                }
            });
        });
    }
}