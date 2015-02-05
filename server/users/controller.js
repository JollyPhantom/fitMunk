var db      = require('../utils/db.js');
var request = require('request');
var q       = require('Q');
var User    = require('../users/model.js');

//Mongoose methods, promisified
var findOneUser   = Q.nbind(User.find, User);
var enterTournament   = Q.nbind(U)

var user = {};

user.readTournament = function(req, res, next) {
  var full_name = req.body.full_name;
  var tournament_ids;
  findOneUser({full_name: full_name})
    .then(function(user){
      if (!user) {
        res.send(new Error('user doesnt exist'));
      } else {
        res.send(user.tournaments);
      }
    });
};

user.enterTournament = function(username, tournament_id){

};

user.leaveTournament = function(username, tournament_id){

};

module.exports = user;



module.exports = {
  addUser: function (token, tokenSecret, profile, done){
    var err = '';
    //Add the user's profile info to the db
    db.child('users').child(profile.id).once('value', function (data) {
      if (data.val() === null) {
        var user = {};
        user.id = profile.id;
        user.tokenSecret = tokenSecret;
        user.token = token;
        user.name = profile._json.user.fullName;
        user.strideRunning = profile._json.user.strideLengthRunning;
        user.strideWalking = profile._json.user.strideLengthWalking;
        user.units = profile._json.user.distanceUnit;
        //if user is not already in the db
        db.child('users').child(profile.id).set(user);
      } else {
        //if user is already in db, update their profile info
        db.child('users').child(profile.id).update({tokenSecret: tokenSecret, token: token});
      }
    });
  },
  
  getUserStats: function (userID, callback) {
    //take user id and query the firebase database
    return db.child('users').child(userID);
    
  },
  
  //add user activity, such as stairs and steps to their profile in the db
  addUserStats: function (userID, userStats) {
    db.child('users').child(userID).child('stats').update(JSON.parse(userStats));
  }

};