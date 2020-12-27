'use strict';

const express = require('express');
const line = require('@line/bot-sdk');
const config = {
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.CHANNEL_SECRET
};
const client = new line.Client(config);

const app = express();
app.post('/webhook', line.middleware(config), (req, res) => {
    if (!Array.isArray(req.body.events)) {
        return res.status(500).end();
    }
    Promise
        .all(req.body.events.map(event => {
            return handleEvent(event);
        }))
        .then(()=>res.end())
        .catch((err)=>{
            console.error(err);;
            res.status(500).end();
        })
})

let replyText = (token, texts) => {
    texts = Array.isArray(texts)?texts:[texts];
    return client.replyMessage(
        token,
        texts.map((text) => ({type: 'text', text}))
    );
};

function handleEvent(event){
    switch (event.type) {
        case 'message':
            const message = event.message;
            switch (message.type) {
                case 'text':
                    if(event.message.text[0]=='!'){
                      return replyText(event.replyToken, 'apaan sih');
                    }
                default:
                    return replyText(event.replyToken, 'Unknown message');
            }
        default:
            return replyText(event.replyToken, 'Unknown Event Type');
    }
}

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`listening on ${port}`);
});