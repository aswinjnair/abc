'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const emoji=require('node-emoji')

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
	let text = text1.toLowerCase();
	if(text.includes("summer"))
	{
        sendImage(sender)
	}
	else if(text.includes("winter"))
	{
           genericMsg(sender)
	}
	else
	{
		sendText(sender,"i like rain " +emoji.get('cloud')+" " +emoji.get('umbrella')+" !!!")
		sendButton(sender,"what is your favourate seson?")
	}

}



function sendText(sender, text) 
{
	let messageData = {text: text}
	sendRequest(sender, messageData)
	
}

function sentButton(sender, text)
{
	let messageData=
	{ 
		"attachment":
		{
      "type":"template",
      "payload":{
        "template_type":"button",
        "text":text,
        "buttons":[
          {
            "type":"postback",
            "title":"Summer",
            "payload":"Show Website"
          },
          {
            "type":"postback",
            "title":"Winter",
            "payload":"USER_DEFINED_PAYLOAD"
          }
        ]
      }
       }
    }
    sendRequest(sender,messageData)
}

function sendImage(sender){
	let messageData={
    "attachment":{
      "type":"image",
      "payload":{
        "url":"https://diethics.com/wp-content/uploads/2013/09/summer-planning.jpg"
      }
    }
  }
  sendRequest(sender,messageData)
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
}

app.listen(app.get('port'), function() {
	console.log("running: port")
})
