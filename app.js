var request = require('request');
var express = require('express');
var TelegramBot = require('node-telegram-bot-api');
var app = express();



/*配置开始*/
var token = '5980147722:AAG0c8OZTi9HAq0OTUN8Co0l29_WH1Wm980'; //机器人的token
var showCount = 20; //展示的条数
/*配置结束*/


var amount;
var bot = new TelegramBot(token, {polling: true});
bot.on('message', (msg) => { 
	amount = 0;
	var textarray = [];
	if (msg.text.search("u")!=-1) {
		amount = parseFloat(msg.text.split("u")[0])
		textarray = msg.text.split("u");
	}
	if (msg.text.search("U")!=-1) {
		amount = parseFloat(msg.text.split("U")[0])
		textarray = msg.text.split("U");
	}
	if (amount%1!=0 || amount==0 || textarray[1]!="") {
		return
	}else{
		main(msg)
	}
	
});


function main(msg) {
	request({
		url: 'https://www.okx.com/v3/c2c/tradingOrders/books?quoteCurrency=cny&baseCurrency=usdt&side=sell&paymentMethod=bank',
	}, (error, response, body) => {
		if (!error && response.statusCode == 200) {
			var sendvalue = "[ 欧易(okx)银行卡实时汇率 ]\n\n";
			var allprice = 0
			for (let index = 0; index < showCount; index++) {
				const element = JSON.parse(body).data.sell[index];
				sendvalue = `${sendvalue}${element.nickName}  ${element.price}\n`
				allprice+= parseFloat(element.price)
			}
			sendvalue =`${sendvalue}\n实时价格：${amount} USDT * ${(allprice/showCount).toFixed(5)} = ${(amount*(allprice/showCount)).toFixed(2)}`
			bot.sendMessage(msg.chat.id,sendvalue );	
		}
	})
}