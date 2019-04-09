const Config = require('./config');
const MongoClient = require('mongodb').MongoClient;
var client;

Config.onConfigLoad(() => {
  let uri = (process.env.MONGODB_URI != undefined ? process.env.MONGODB_URI : Config.get("mongodb_uri"));
  client = new MongoClient(uri, { useNewUrlParser: true });
  client.connect(err => {
    console.log("Connected to MongoDB");
  });
});

function findUser(discordId, callback) {
  let gearDb = client.db("gear");
  gearDb.collection("users").findOne({discord_id: discordId}, (err, record) => {
    if(err) {
      console.log("Error: " + err);
      callback(null);
    } else {
      if(!record) {
        callback(null);
      } else {
        callback(record);
      }
    }
  });

}

function addUser(ap, aap, dp, gs, level, cls, screenshot_link, guild, discordId, callback) {
  findUser(discordId, (user) => {
    if(user == null) {
      let gearDb = client.db("gear");
      gearDb.collection("users").insertOne({
        discord_id: discordId,
        attack_power: ap,
        awaken_atk_power: aap,
        defense_power: dp,
        gear_score: gs,
        char_level: level,
        char_class: cls,
        gear_screenshot: screenshot_link,
        guild: guild,
        teams: null,
        nw_axe_lvl: null
      }, (err, record) => {
        if(err) {
          callback("Sorry! I've had a siezure.");
        } else {
          callback("Added you to the database 8)");
        }
      });
    } else {
      callback("You're already in the database...");
    }
  });
}

function deleteUser(discordId, callback) {
  let gearDb = client.db("gear");
  gearDb.collection("users").deleteOne({discord_id: discordId}, (err, obj) => {
    if(err) {
      callback(err);
    } else {
      callback(null);
    }
  });
}

function updateUser(discordId, gearObject, discordMessage, callback) {
  let gearDb = client.db("gear");
  gearDb.collection("users").updateOne({discord_id: discordId}, {$set: gearObject}, (error, record) => {
    if(error) {
      callback(discordMessage, error.message);
    } else {
      callback(discordMessage, null);
    }
  })
}

function getWholeGuild(guildId, callback, discordMessage) {
  let gearDb = client.db("gear");
  gearDb.collection("users").find({guild: guildId}, (err, records) => {
    if(err) {
      callback(err, null, discordMessage);
    } else {
      records.toArray().then((array) => {
        callback(null, array, discordMessage);
      });
    }
  });
}

function getTotalNumberOfUsers(callback) {
  let gearDb = client.db("gear");
  gearDb.collection("users").find({}, (err, records) => {
    if(err) {
      callback(err, null);
    } else {
      records.toArray().then((array) => {
        callback(null, array.length);
      });
    }
  })
}

function customUpdate(discordId, updateQuery, callback) {
  let gearDb = client.db("gear");
  gearDb.collection("users").updateOne({discord_id: discordId}, updateQuery, (error, record) => {
    if(error) {
      callback(error.message);
    } else {
      callback(null);
    }
  })
}

module.exports.getTotalNumberOfUsers = getTotalNumberOfUsers;
module.exports.addUser = addUser;
module.exports.findUser = findUser;
module.exports.deleteUser = deleteUser;
module.exports.updateUser = updateUser;
module.exports.getWholeGuild = getWholeGuild;
module.exports.customUpdate = customUpdate;