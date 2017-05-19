'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const emoji=require('node-emoji')
const APIAI_TOKEN = "411f0f79f5584f85b62c193ebc4275ce";
const API_KEY = "AIzaSyAo4DkMcfZ6eFnN0nY3_PiPtNF8ch5ffW4";


const apiai= require("apiai");
const apiaiApp= apiai(APIAI_TOKEN);

const app = express()

app.set('port', (process.env.PORT || 3000))

// Allows us to process the data
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// ROUTES

app.get('/', function(req, res) {
	res.send("Hi I am a chatbot")
})

let token = "EAAafRi5SJtUBAK7wlZCgAXrlLeUZBW4iDlowKkAZAmoBkHruTrQeLkZABjyaRoFxT2PZAxpHEy8VBX1LlX84iZC7HZCyUHhZCKcZCgSzaaZCnZAZCjm5ZAXqBgnAnywZAhnFe0Ce4H2OFcfjapvLsWRehprqZAx8zsj4v0he83JjGHfYTrZBzyacmRjAKkgr"

// Facebook 

app.get('/webhook/', function(req, res) {
	if (req.query['hub.verify_token'] === "testbot_verify_token") {
		res.send(req.query['hub.challenge'])

	}
	res.send("Wrong token")
})

app.post('/webhook/', function(req, res) 
{
	let messaging_events = req.body.entry[0].messaging
	for (let i = 0; i < messaging_events.length; i++) 
	{
		let event = messaging_events[i]
		let sender = event.sender.id
		if (event.message && event.message.text)
		{
			let text = event.message.text
			decideMessage(sender, text)
			//sendText(sender, "Text echo: " + text.substring(0, 100))
		}
	}
	res.sendStatus(200)
})



function decideMessage(sender, text1)
{
	
  let text = event.message.text;

  let apiai = apiaiApp.textRequest(text, {
    sessionId: 'tabby_cat'
  });

  app.post('/ai', (req, res) => {
  console.log('*** Webhook for api.ai query ***');
  

  if (req.body.result.action === 'booking') {
    console.log('*** weather ***');
    let city = req.body.result.parameters['place'];
    let restUrl = ''; 
        let msg = 'The current condition in ';
        genericMsg(sender)
	
  }

});
	

}



function sendText(sender, text) 
{
	let messageData = {text: text}
	sendRequest(sender, messageData)
	
}




function genericMsg(sender){
	let messageData={
		"attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements":[
           {
            "title":"Winter",
            "image_url":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZDk3XTZgge48kZmiXVWZgmK2sAuJMA7BRevNRdeHJSIuMPO6d",
            "subtitle":"I love winter",
            
            "buttons":[
              {
                "type":"web_url",
                "url":"https://en.wikipedia.org/wiki/Winter",
                "title":"Findout more"
              }             
            ]      
          }
        ]
      }
    }
	}

	sendRequest(sender,messageData)
}



function sendRequest(sender, messageData){
	let apiai = apiaiApp.textRequest(text, {
    sessionId: 'tabby_cat'
  });
apiai.on('response', (response) => {
    console.log(response)
    let aiText = response.result.fulfillment.speech;
     messageData = aiText;
	request({
		url: "https://graph.facebook.com/v2.6/me/messages",
		qs : {access_token: token},
		method: "POST",
		json: {
			recipient: {id: sender},
			message : messageData,
		}
	}, function(error, response, body) {
		if (error) {
			console.log("sending error")
		} else if (response.body.error) {
			console.log("response body error")
		}
	})
});
}

app.listen(app.get('port'), function() {
	console.log("running: port")
})
