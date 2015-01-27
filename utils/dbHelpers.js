var db = require('./db.js');


module.exports = {
  addUser: function (token, tokenSecret, profile, done){
    var err = '';
    db.child('users').child(profile.id).once('value', function (data) {
      if (data.val() === null){
        err = 'user not in DB!';
      }
      var user = {};
      user.id = profile.id;
      user.tokenSecret = tokenSecret;
      user.token = token;
      user.name = profile._json.user.fullName;
      user.strideRunning = profile._json.user.strideLengthRunning;
      user.strideWalking = profile._json.user.strideLengthWalking;
      user.units = profile._json.user.distanceUnit;
      db.child('users').push(user);
      console.log('THIS IS USER', user);
      done(err, profile._json.user);
      
    });
    this.getUserStats(user);
  },
  getUserStats: function (user) {
    var oath = {
      callbackURL: 'http://localhost:1337/auth/fitbit/callback',
      token: user.token,
      tokenSecret: user.tokenSecret
    }
    request.get({url: "https://api.fitbit.com/1/user/" + user.id + "/activities/date/2015-01-23.json",
      oath: oath},
      function(err, response, body) {
        if (err) {
          console.log('error occurred')
        }
      console.log('this is body', body)
    })
  },
  addUserStats: function () {

  }


};