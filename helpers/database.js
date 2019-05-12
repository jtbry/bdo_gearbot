const Config = require('./config');
const MongoClient = require('mongodb').MongoClient;
var client;

// Wait for config to load before logging into MongoDB (incase mongodb details are in the config)
Config.onConfigLoad(() => {
  let uri = (process.env.MONGODB_URI != undefined ? process.env.MONGODB_URI : Config.get("mongodb_uri"));
  client = new MongoClient(uri, { useNewUrlParser: true });
  client.connect(err => {
    console.log("Connected to MongoDB");
  });
});

// Find a user based on their discord id
function findUser(discordId, callback) {
  const gearDb = client.db("gear");
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

// Add a user with default necessary values
function addUser(ap, aap, dp, gs, level, cls, screenshot_link, guild, discordId, callback) {
  findUser(discordId, (user) => {
    if(user == null) {
      const gearDb = client.db("gear");
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

// Delete a given id from the `users` collection
function deleteUser(discordId, callback) {
  const gearDb = client.db("gear");
  gearDb.collection("users").deleteOne({discord_id: discordId}, (err, obj) => {
    if(err) {
      callback(err);
    } else {
      callback(null);
    }
  });
}

// Update a user's basic gear object
function updateUser(discordId, gearObject, discordMessage, callback) {
  const gearDb = client.db("gear");
  gearDb.collection("users").updateOne({discord_id: discordId}, {$set: gearObject}, (error, record) => {
    if(error) {
      callback(discordMessage, error.message);
    } else {
      callback(discordMessage, null);
    }
  })
}

// Get all users who have the specified guildId attached to their user
function getWholeGuild(guildId, callback, discordMessage) {
  const gearDb = client.db("gear");
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

// Get all users who match a filter and are in the given guild
function getGuildWithFilter(guildId, filter, callback, discordMessage){
  const gearDb = client.db("gear");
  const filterWithGuildId = Object.assign({guild: guildId}, filter);
  
  gearDb.collection("users").find(filterWithGuildId, (err, records) => {
    if(err) {
      callback(err, null, discordMessage);
    } else {
      records.toArray().then((array) => {
        callback(null, array, discordMessage);
      });
    }
  });
}

// Get all users matching a filter and sort them
function getUsersWithSort(searchFilter, sortFilter, callback){
  const gearDb = client.db("gear");
  
  gearDb.collection("users").find(searchFilter, (err, records) => {
    if(err) {
      callback(err, null);
    } else {
      records.sort(sortFilter).toArray((err, result) => {
        if(err) {
          callback(err, null)
        }
        else {
          callback(null, result);
        }
      });
    }
  });
}

// Get the total number of documents in the `gear.users` collection
function getTotalNumberOfUsers(callback) {
  const gearDb = client.db("gear");
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

// Execute a custom update query on a given user id
function customUpdateUser(discordId, updateQuery, callback) {
  const gearDb = client.db("gear");
  gearDb.collection("users").updateOne({discord_id: discordId}, updateQuery, (error, record) => {
    if(error) {
      callback(error.message);
    } else {
      callback(null);
    }
  })
}

// Find a guild from the `guilds` collection, searching by gid
function findGuild(guildId, callback) {
  const gearDb = client.db("gear");
  gearDb.collection("guilds").findOne({gid: guildId}, (err, record) => {
    if(err) {
      callback(err, null);
    } else {
      if(record) {
        Config.cacheSet(guildId, record);
        callback(null, record);
      } else {
        callback(null, null);
      }
    }
  });
}

// Execute a custom update query on a guild from `guilds` collection with the specified guildId
function updateGuild(guildId, updateQuery, callback) {
  const gearDb = client.db("gear");
  gearDb.collection("guilds").findOneAndUpdate({gid: guildId}, updateQuery, (error, record) => {
    if(error) {
      callback(error.message);
    } else {
      if(record) {
        findGuild(guildId, (err, guild) => {
          if(err) {
            Config.cacheSet(guildId, {error: "Error setting this guild's cache"});
          } else {
            Config.cacheSet(guildId, guild);
          }
        });
      }
      callback(null);
    }
  })
}

// Delete a guild from the `guilds` collection, searching by gid
function deleteGuild(guildId, callback) {
  const gearDb = client.db("gear");
  gearDb.collection("guilds").deleteOne({gid: guildId}, (err, obj) => {
    if(err) {
      callback(err);
    } else {
      callback(null);
    }
  });
}

// Add a new guild to the `guilds` collection with default values
function addGuild(guildId, guildName, callback) {
  const gearDb = client.db("gear");
  gearDb.collection("guilds").insertOne({
    gid: guildId,
    name: guildName,
    guildTeams: [],
    guildManagers: [],
    guildEvents: []
  }, (err, record) => {
    if(err) {
      callback(err);
    } else {
      callback(null);
    }
  });
}

// Add a guild event to a guild's database
function addGuildEvent(guildId, eventId, date, title, eventChannel, roleTarget, callback) {
  let eventJson = {eventId: eventId, eventDate: date, eventTitle: title, eventChannel: eventChannel, eventTargetRole: roleTarget, eventMessage: null};
  let guildUpdateQuery = {$push: {guildEvents: eventJson}};

  updateGuild(guildId, guildUpdateQuery, (error) => {
    if(error) {
      callback(error);
    } else {
      callback(null);
    }
  });
}

// Remove a guild event from a guild's database
function removeGuildEvent(guildId, eventId, callback) {
  let eventJson = {eventId: eventId};
  let guildUpdateQuery = {$pull: {guildEvents: eventJson}};

  updateGuild(guildId, guildUpdateQuery, (error) => {
    if(error) {
      callback(error);
    } else {
      callback(null);
    }
  });
}

// Update a guild event
function updateGuildEventMessage(guildId, eventId, messageId, callback) {
  const gearDb = client.db("gear");
  gearDb.collection("guilds").updateOne({gid: guildId, 'guildEvents.eventId': eventId}, {$set: {'guildEvents.$.eventMessage': messageId}}, (error, record) => {
    if(error) {
      callback(error.message);
    } else {
      callback(null);
      
      // Call find guild to simply update the cache (this can be done better)
      findGuild(guildId, () => {});
    }
  }) 
}

// Get a guild's events
function getGuildEvents(guildId) {
  
} 

// User Function Exports
module.exports.getTotalNumberOfUsers = getTotalNumberOfUsers;
module.exports.addUser = addUser;
module.exports.findUser = findUser;
module.exports.deleteUser = deleteUser;
module.exports.updateUser = updateUser;
module.exports.getWholeGuild = getWholeGuild;
module.exports.customUpdateUser = customUpdateUser;
module.exports.getUsersWithSort = getUsersWithSort;

// Guild Function Exports
module.exports.updateGuild = updateGuild;
module.exports.deleteGuild = deleteGuild;
module.exports.addGuild = addGuild;
module.exports.findGuild = findGuild;
module.exports.getGuildWithFilter = getGuildWithFilter;

// Guild Event Exports
module.exports.addGuildEvent = addGuildEvent;
module.exports.removeGuildEvent = removeGuildEvent;
module.exports.updateGuildEventMessage = updateGuildEventMessage;
module.exports.getGuildEvents = getGuildEvents;