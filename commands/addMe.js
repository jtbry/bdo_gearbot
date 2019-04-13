const Database = require('../helpers/database');
const Utils = require('../helpers/utils');

module.exports = {
    command: "~addMe",
    name: "addMe",
    description: "Add your user to the gear bot!",
    usage: "~addMe <ap> <aap> <dp> <level> <class> <optional_screenshot>",
    requiresAdmin: false,
    isEssential: true,
    execute: execute
}

function execute(args) {
    let gearArgs = args.cmd.split(" ");
    if(gearArgs.length < 6 || gearArgs.length >= 8) {
        args.message.reply("Did you do that right? No, stoopid.");
        return;
    }
    for (let index = 0; index < gearArgs.length; index++) {
        const arg = gearArgs[index];
        if(Utils.isEmptyString(arg)) {
            args.message.reply("Did you do that right? You gave me an empty value. Weirdo.");
            return;
        }
    }

    let ap = parseInt(gearArgs[1]);
    let aap = parseInt(gearArgs[2]);
    let dp = parseInt(gearArgs[3]);
    let gs = Math.ceil(((ap + aap) / 2) + dp);

    if(ap == NaN || aap == NaN || dp == NaN || gs == NaN) {
        args.message.reply("These aren't real numbers! :(");
        return;
    }

    let char_class = Utils.getValidClass(gearArgs[5]);
    if(!char_class) {
        args.message.reply("Sorry but " + gearArgs[5] + " is not a valid clas... idiot.");
        return;
    }
    let screenshot_link = null;

    if(args.message.embeds[0]) {
        screenshot_link = args.message.embeds[0].url;
    } else if(args.message.attachments.first()) {
        screenshot_link = args.message.attachments.first().url;
    }

    Database.addUser(ap, aap, dp, gs, parseInt(gearArgs[4]), char_class, screenshot_link, args.message.guild.id, args.message.author.id, (result) => {
        args.message.reply(result);
    });
}
