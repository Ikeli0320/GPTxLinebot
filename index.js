//==================================================================
//                    NPM Require
//==================================================================
const linebot = require('linebot');
const express = require('express'); 
const axios = require('axios');   
//==================================================================
//                     Key Setting
//==================================================================
//請替換成自己的OPENAI API KEY
const apiKey = process.env.OPENAI_Key;  

//請輸入Line Developer Messaging API的ID , Secret ,AccessToken (沒替換會出錯)
var bot = linebot({
    channelId: process.env.LINE_channelId,
    channelSecret: process.env.LINE_channelSecret,
    channelAccessToken: process.env.LINE_channelAccessToken
});

//==================================================================
//                     WEB Server
//==================================================================

const app = express();
const linebotParser = bot.parser();
app.post('/', linebotParser);

//因為 express 預設走 port 3000 (可自行更改)
var server = app.listen(process.env.PORT || 3000, function() {
    var port = server.address().port;
    p("@@@@@@ App now running on port :"+ port + " @@@@@@ " + new Date());
});

//==================================================================
//                     Line Messaging API Pars
//==================================================================

bot.on('message', function(event) {
    const str = event.message.text;
	
	if (typeof str === 'string' && str.length > 0){
		const substr = str.substring(0, 2); // 擷取左邊兩個全型字元
		
		switch(substr)       
		{
			case '請問':  
			_apicompletions(event);
				break;
      case '請畫':  
      _apigenerations(event);
        break;
			default:
		}
	}
})
//==================================================================
//                     OPENAI API Function
//==================================================================
function _apicompletions (event)
{
    const chatapi = 'https://api.openai.com/v1/chat/completions'; //OPENAI CHAT API 網址
    const requestData = {
        model: 'gpt-3.5-turbo',
        messages: [{"role": "user", "content": event.message.text}]
    }; 

    axios.post(chatapi, requestData, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }).then(function (response) {
        // 处理API响应
        event.reply([response.data.choices[0].message.content.trimLeft()]);
         
      }).catch(function (error) {
        // 处理API错误
        console.error('Error calling API:', error);
      });
}

function _apigenerations (event)
{
  const chatapi = 'https://api.openai.com/v1/images/generations'; //OPENAI images create API 網址
    const requestData = {
        prompt: event.message.text,
        n: 1
    }; 

    axios.post(chatapi, requestData, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }).then(function (response) {
        // 处理API响应
        event.reply(
          {
            type: 'image',
            originalContentUrl: response.data.data[0].url.trimLeft(),
            previewImageUrl: response.data.data[0].url.trimLeft()
          });
         
      }).catch(function (error) {
        // 处理API错误
        console.error('Error calling API:', error);
      });
  
}


//==================================================================
//                     Public Function
//==================================================================
function p(obj) //console.log
{
    console.log(obj);
	return;
}