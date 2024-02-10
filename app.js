"use strict";
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const http = require('http');
// const https = require('https');
require('dotenv').config()

//const privateKey = fs.readFileSync('/etc/letsencrypt/live/vps.isi-net.org/privkey.pem','utf8');
//const certificate = fs.readFileSync('/etc/letsencrypt/live/vps.isi-net.org/cert.pem','utf8');
//const ca = fs.readFileSync('/etc/letsencrypt/live/vps.isi-net.org/chain.pem','utf8');

///const credentials = {
	//key: privateKey,
	//cert: certificate,
  //ca: ca
//};

const api = express();
api.use(bodyParser.urlencoded({ extended: false }))
api.use(bodyParser.json())
api.use(cors({
    origin:['http://localhost/3000','*']
}));


const dbase_dipasena = require('./config/database_config.js'); 
dbase_dipasena.query(`CREATE TABLE IF NOT EXISTS climate_kalimantan (
  timestamp TIMESTAMP NOT NULL,  
  pyrano_meter FLOAT,
  wind_direction FLOAT,
  anemometer FLOAT,
  rain_gauge FLOAT
  
 )
  `, function(err, result){
    console.log( `CONNECTED TO DATABASE : ${process.env.DB_KALIMANTAN} `);
  });


// API HANLDING FOR PANJANG
const climate_appRoute = require('./controler/route.js');
api.use('/', cors(), climate_appRoute);

api.use('/', cors(), (req, res) => {
    res.status(404);
    res.send('404 Not Found'); // respond 404 if not available
});  

// Starting both http & https servers
const httpServer = http.createServer(api);
//const httpsServer = https.createServer(credentials, api);

httpServer.listen(process.env.API_PORT, () => {
	console.log(`HTTP REST-API running on port ${process.env.API_PORT}`);
});


//httpsServer.listen(4443, () => {
	//console.log('HTTPS REST-API running on port 4443');
//});

const topic = process.env.TOPIC;
const mqtt_connect = require('./config/mqtt_config.js')
const {incomingData} = require('./controler/controler_mqtt.js') 
  // Subscribe topic to receive data from raspberryPi
  // Data From Canti
//Subscribe topic to receive API request
mqtt_connect.subscribe(topic, (err) => {
  if (!err) {
    console.log("Subscribed to topic : " + topic); 
  } else throw (err);
});

// Handle message from mqtt
mqtt_connect.on("message", incomingData);