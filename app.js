var items = {"clarity": "Use: Restores mana over time. If the user is attacked, the effect is lost. \nDURATION: 30\nMANA RESTORED: 100", "tango": "Use: Eat Tree - Consume a tree to restore HP over time. Comes with 3 charges. \nDURATION: 16 \nHEALTH RESTORED: 115", "healing salve": "Use: Regenerate - Restores HP over time. If the user is attacked, the effect is lost. \nDURATION: 10 \nHEALTH RESTORED: 400 ", "smoke of deceit": "Use: Upon activation, the user and all nearby allied player-controlled units gain invisiblity and bonus movement speed for a brief time. Minimap icons will also be hidden. Upon moving within 1025 range of an enemy hero or tower, the invisibility is lost. \nBONUS SPEED: 15% \nDURATION: 40 \nCooldown: 90"};

var Domo, domo;
Domo = require('domo-kun');

var express = require('express');
var app = express();

app.get('/', function(req, res){
  res.send("TinkerBot!");
});

app.listen(5000);

var request = require('request');
var jsdom = require("jsdom");

domo = new Domo({
  nick: 'Tinker',
  userName: 'Tinker',
  realName: 'Tinker the Dota Bot',
  address: 'irc.synirc.net',
  channels: ['#dota'],
  users: [
    {
      username: 'ambushsabre',
      password: 'barley'
    }
  ],
  debug: true
});

domo.route('!item :item', function(res){
  var item = res.params.item.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
  request('http://www.dotafire.com/dota-2/items', function (error, response, body) {
  if (!error && response.statusCode == 200) {
    jsdom.env(
    body,
    ["http://code.jquery.com/jquery.js"],
    function (errors, window) {
      console.log("into jsdom");
      var url = window.$("a:contains(" + item +")").attr('href');
      if (typeof url == "undefined"){
        domo.say(res.channel, "Item not found.");
        return;
      }
      request('http://dotafire.com' + url, function(e, r, b){
        if (!error && response.statusCode == 200){
          console.log(e);
          console.log(r.statusCode);
          jsdom.env(
            b,
            ["http://code.jquery.com/jquery.js"],
            function(er, w){
              var full = w.$('.self-clear .mb3').text() + w.$('.box-t').text();
              full = full.replace(/(\r\n|\n|\r)/gm," ");
              domo.say(res.channel, full);

            }
          );
        }
      });
    });
    //domo.say(res.channel, body); // Print the google web page.
  }
  });
});

domo.connect();