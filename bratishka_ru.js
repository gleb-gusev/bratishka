var Botkit = require('../lib/Botkit.js');


if (!process.env.token) {
  console.log('Error: Specify token in environment');
  process.exit(1);
}

var controller = Botkit.slackbot({
 debug: false
});

controller.spawn({
  token: process.env.token
}).startRTM(function(err) {
  if (err) {
    throw new Error(err);
  }
});

var orders = [];
var str = "";
var list = "";

controller.hears(['Заказываем'],['ambient'],function(bot,message) {
  
 bot.reply(message,"Пишем что хотим заказать мне в меншены");

});

controller.on('direct_mention',function(bot,message) {
  //bot.reply(message,"Hello.");
    orders.push(message.text);
    console.log(message.text);
    console.log(orders);

});


controller.hears(['Время вышло','хватит'],['ambient'],function(bot,message) {
   
     for (i=0;i<orders.length;i++) {
      str = (str + orders[i] + "\n")
    }
    orders = [];
    console.log(str)
    bot.reply(message,str);
    list = str
    str = ""
    
});

controller.hears(['список'],['direct_message','direct_mention'],function(bot,message) {
  bot.startConversation(message,function(err,convo) {
    convo.say('Sent');
  });

  bot.startPrivateConversation(message,function(err,dm) {
    dm.say(list);
  });

});
