const Config = require('../helpers/config');
const listOfBdoClasses = ["Warrior", "Ranger", "Sorceress", "Berserker", "Valkyrie", "Wizard", "Witch", "Tamer", "Maehwa", "Musa", "Ninja", "Kunoichi", "Dark Knight", "Striker", "Mystic", "Lahn", "Archer"];
const validEnhancementValues = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "PRI", "DUO", "TRI", "TET", "PEN"];

function getValidClass(classString) {
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

function isEmptyString(str) {
    if(str == "" || str == " " || str == null) {
        return true;
    } else {
        return false;
    }
}

function isManagerMessage(msg) {
    if(msg.member.hasPermission('ADMINISTRATOR') || msg.member.hasPermission('MANAGE_GUILD')) {
        return true;
    } else {
        let possibleAdminRoles = Config.get("managers");
        if(possibleAdminRoles == undefined || possibleAdminRoles == null) {
            return false;
        }
        for (let index = 0; index < possibleAdminRoles.length; index++) {
            const adminRole = possibleAdminRoles[index];
            if(adminRole.guild == msg.guild.id && msg.member.roles.find(role => role.id = adminRole.id)) {
                return true;
            }

            if(index == possibleAdminRoles.length -1) {
                return false;
            }
        }
    }
}

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

module.exports.getValidClass = getValidClass;
module.exports.isEmptyString = isEmptyString;
module.exports.isManagerMessage = isManagerMessage;
module.exports.getValidEnhanceValue = getValidEnhanceValue;