const dbase_mqtt = require('../config/database_config.js');
const mqtt_connect = require('../config/mqtt_config.js');

require('dotenv').config()
// VARIABLE IN Topic MQTT 
TOPIC_KALIMANTAN = process.env.TOPIC;
// TS_PATH = process.env.PAYLOAD_TS;
Temperature_PATH = process.env.PAYLOAD_Temperature;
WIND_HUMIDITY_PATH = process.env.PAYLOAD_WIND_HUMIDITY;
LDR_PATH = process.env.PAYLOAD_LDR;


var {  Temperature,Humidity,LDR } = [];

module.exports = {
        // MQTT HANDLING
        async incomingData(topic,message){
            if (topic === TOPIC_KALIMANTAN){
                const payload = JSON.parse(message.toString());
        
                // Checking property of payload topic send from mqtt. so it will never null
                if ((payload.hasOwnProperty(Temperature_PATH))
                    && (payload.hasOwnProperty(WIND_HUMIDITY_PATH))
                    && (payload.hasOwnProperty(LDR_PATH))
            
            ) {
                    if ((payload[Temperature_PATH] != null)
                        && (payload[WIND_HUMIDITY_PATH] != null)
                        && (payload[LDR_PATH] != null)
                    ) {
                        // Save Payload to variable
                        // TS = payload[TS_PATH];
                        Temperature = parseFloat(payload[Temperature_PATH]);
                        WIND_HUMIDITY= parseFloat(payload[WIND_HUMIDITY_PATH]);
                        LDR = parseFloat(payload[LDR_PATH]);

                    }
        
                }
                // input semua data kedalam main database 
                const dataArray = [Temperature,Humidity,LDR];
                const insertQuery = `INSERT INTO capstone ( temperature,humidity,ldr) VALUES 
                ($1,$2,$3)`;
                dbase_mqtt.query(insertQuery, dataArray, (err, res) => {
                    if (err) throw err;
                console.log(`DATA INSERTED TO MAIN DATABASE : Temperature = ${Temperature}, Humidity=${Humidity},LDR=${LDR}`);
                });
            }
        }
}