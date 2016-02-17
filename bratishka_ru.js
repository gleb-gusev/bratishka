var Botkit = require('./lib/Botkit.js');


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

var Phrases = ['Ок','Понял','Записал','Готово','Добре','Не вопрос','Вкусненько']
var orders = [];
var str = "";
var list = "";
var activeOrder = false;

controller.hears(['хелп'],['ambient'], function(bot,message) {

 bot.reply(message,"Привет. \n Я, Братишка, буду помогать вам собирать заказы. \n 1) Чтобы начать заказ напишите /Открываем заказ/. \n 2) После, пишите в меншены, что вы хотите заказать. \n 3)  Напишите /Закрыт заказ/ и я выдам вам весь список того, что вы назаказывали. \n 4) А, если хотите, еще могу вам отправить список в дм с помощью команды /список/.");
 
});

controller.hears(['Открываем заказ'],['ambient'],function(bot,message) {
 activeOrder = true;
 bot.reply(message,"Пишем, что хотим заказать братишке в меншены");
 
});

controller.on('direct_mention',function(bot,message) {

    if (activeOrder) {

      var phrase = Phrases[Math.floor(Math.random()*Phrases.length)];
      bot.reply(message,phrase);

      userid=message.user;

      bot.api.users.info({'user':userid},function(err,response) {

        orders.push(response.user.name + ": " + message.text);

      })

      

    } else {

      bot.reply(message,"Здраститя, а мы еще не заказываем. Подожди немного.")

    }

});


controller.hears(['Закрыт заказ','хватит'],['ambient'],function(bot,message) {

    var date = new Date();

    // Display the month, day, and year. getMonth() returns a 0-based number.
    var month = date.getMonth()+1;
    var day = date.getDate();
    var year = date.getFullYear();
    var time = date.getHours()+':'+date.getMinutes()+':'+date.getSeconds()

    activeOrder = false;
    
    for (i=0;i<orders.length;i++) {

        str = (str + orders[i] + "\n");

      }

    str = "*Дата: " + day + '-' + month + '-' + year + " " + "Время: " + time + "*\n" + "----------------------------------------*" + "\n" + str;
    orders = [];
    bot.reply(message,str);
    bot.reply(message,"Приятного аппетита, братишки");
    list = str;
    str = "";
    
});

controller.hears(['список'],['ambient'],function(bot,message) {
  bot.startConversation(message,function(err,convo) {

    convo.say('Список отправлен' + "" + message);

  });

  bot.startPrivateConversation(message,function(err,dm) {
    dm.say(list);
  });

});
