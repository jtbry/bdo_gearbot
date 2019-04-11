const Config = require('../helpers/config');
const listOfBdoClasses = ["Warrior", "Ranger", "Sorceress", "Berserker", "Valkyrie", "Wizard", "Witch", "Tamer", "Maehwa", "Musa", "Ninja", "Kunoichi", "Dark Knight", "Striker", "Mystic", "Lahn", "Archer"];
const validEnhancementValues = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "PRI", "DUO", "TRI", "TET", "PEN"];

// Check if a given string is a valid BDO class
function getValidClass(classString) {
    if(isEmptyString(classString)) {
        return null;
    }

    for (let index = 0; index < listOfBdoClasses.length; index++) {
        const bdoClass = listOfBdoClasses[index];
        if(bdoClass.toLowerCase().startsWith(classString.toLowerCase())) {
            return bdoClass;
        } else {
            if(index == listOfBdoClasses.length -1) {
                return null;
            }
        }
    }
}

// Check if given string is empty and unable to be processed for data
function isEmptyString(str) {
    if(str == "" || str == " " || str == null || str == undefined) {
        return true;
    } else {
        return false;
    }
}

// Check if the given message is sent by someone who is considered a Guild Manager
function isManagerMessage(msg) {
    if(msg.member.hasPermission('ADMINISTRATOR') || msg.member.hasPermission('MANAGE_GUILD')) {
        return true;
    } else {
        let possibleAdminRoles = Config.cacheGet(msg.guild.id).guildManagers == null ? [] : Config.cacheGet(msg.guild.id).guildManagers
        if(possibleAdminRoles == undefined || possibleAdminRoles == null) {
            return false;
        }
        for (let index = 0; index < possibleAdminRoles.length; index++) {
            const adminRole = possibleAdminRoles[index];
            if(msg.member.roles.find(role => role.id = adminRole.id)) {
                return true;
            }

            if(index == possibleAdminRoles.length -1) {
                return false;
            }
        }
    }
}

// Check if given string is a valid BDO enhancement value
function getValidEnhanceValue(val) {
    for (let index = 0; index < validEnhancementValues.length; index++) {
        const level = validEnhancementValues[index];
        if(val == level) {
            return true;
        }
        if(index == validEnhancementValues.length -1) {
            return false;
        }
    }
}

// Module Exports
module.exports.getValidClass = getValidClass;
module.exports.isEmptyString = isEmptyString;
module.exports.isManagerMessage = isManagerMessage;
module.exports.getValidEnhanceValue = getValidEnhanceValue;