const Database = require('../helpers/database');

module.exports = {
    command: "~findUser",
    name: "findUser",
    description: "Find a user!",
    usage: "~findUser @user",
    requiresAdmin: false,
    isEssential: true,
    execute: execute
}

function execute(args) {
    if(args.message.mentions.users.first()) {
        let target = args.message.mentions.users.first().id;
        Database.findUser(target, (user) => {
            if(user && (user.guild == args.message.guild.id || args.message.author.id == user.discord_id)) {
                args.message.channel.send({embed: {
                    color: 0xfd3232,
                    title: "Gear Statistics for " + args.message.mentions.users.first().username,
                    thumbnail: {url: user.gear_screenshot},
                    fields: [{
                        name: "Attack Power (AP)",
                        value: isNaN(user.attack_power) ? "ERROR" : user.attack_power
                    }, {
                        name: "Awaken Attack Power (AAP)",
                        value: isNaN(user.awaken_atk_power) ? "ERROR" : user.awaken_atk_power
                    },{
                        name: "Defense Power (DP)",
                        value: isNaN(user.defense_power) ? "ERROR" : user.defense_power
                    },{
                        name: "Gear Score",
                        value: isNaN(user.gear_score) ? "ERROR" : user.gear_score
                    },{
                        name: "Character",
                        value: (user.char_class == null ? "ERROR" : user.char_class) + " - " + (user.char_level == null ? "ERROR" : user.char_level)
                    },{
                        name: "Trina Axe",
                        value: user.nw_axe_lvl == null ? "Unknown" : user.nw_axe_lvl
                    }]
                }});
            } else {
                args.message.reply("That person hasn't added their gear PeepoSad, do they not love me?");
            }
    });
    } else {
        args.message.reply("You didn't mention anyone... dummy.")
    }
}
