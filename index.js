//==================================================================
//                    NPM Require
//==================================================================
const linebot = require('linebot');
const express = require('express'); 
const axios = require('axios');   
//==================================================================
//                     Key Setting (統一改用env變數輸入)
//==================================================================
//OPENAI API KEY 
const apiKey = process.env.OPENAI_Key;  

//Line Developer Messaging API的ID , Secret ,AccessToken
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
		if (event.source.type === 'group') {
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
    }else if(event.source.type === 'user' || event.source.type === 'room'){
      _apicompletions(event);
    }
	}
})
//==================================================================
//                     OPENAI API Function
//==================================================================
function _apicompletions (event)
{
    const requestData = {
        model: 'gpt-3.5-turbo',
        messages: [{"role": "user", "content": event.message.text}]
    }; 

    axios.post('https://api.openai.com/v1/chat/completions', requestData, {
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

    const promptstr = event.message.text.slice(2);  //移除請畫
    const requestData = {
        prompt: promptstr,
        n: 1,
        size: "512x512"
    }; 

    axios.post('https://api.openai.com/v1/images/generations', requestData, {
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
