const Database = require('../helpers/database');

module.exports = {
    command: "~botStat",
    name: "botStat",
    description: "Get bot statistics!",
    usage: "~botStat",
    requiresAdmin: true,
    execute: execute
}

function execute(args) {
    Database.getTotalNumberOfUsers((err, numberOfUsers) => {
        if(err) {
            args.message.reply("Issue fetching some info.. wtf man");
        } else {
            args.message.channel.send({embed: {
                color: 0xfd3232,
                title: "",
                thumbnail: {url: args.discordClient.user.displyAvatarURL},
                fields: [{
                    name: "Bot Tag",
                    value: args.discordClient.user.tag
                }, {
                    name: "Uptime",
                    value: Math.ceil(args.discordClient.uptime / 60000) + " minutes"
                }, {
                    name: "Guilds",
                    value: "Busy in " + args.discordClient.guilds.array().length + " guilds"
                }, {
                    name: "Stalking",
                    value: numberOfUsers + " users' gear"
                }
                ]}});
        }
    });
}