const dbase_mqtt = require('../config/database_config.js');
const mqtt_connect = require('../config/mqtt_config.js');

require('dotenv').config()
// VARIABLE IN Topic MQTT 
TOPIC_KALIMANTAN = process.env.TOPIC;
TS_PATH = process.env.PAYLOAD_TS;
PYRANOMETER_PATH = process.env.PAYLOAD_PYRANOMETER;
WIND_DIRECTION_PATH = process.env.PAYLOAD_WIND_DIRECTION
ANEMOMETER_PATH = process.env.PAYLOAD_ANEMOMETER
RAIN_GAUGE_PATH = process.env.PAYLOAD_RAIN_GAUGE

var { TS, PYRANOMETER, WIND_DIRECTION, ANEMOMETER, RAIN_GAUGE } = [];

module.exports = {
        // MQTT HANDLING
        async incomingData(topic,message){
            if (topic === TOPIC_KALIMANTAN){
                const payload = JSON.parse(message.toString());
        
                // Checking property of payload topic send from mqtt. so it will never null
                if ((payload.hasOwnProperty(TS_PATH))
                    && (payload.hasOwnProperty(PYRANOMETER_PATH)) 
                    && (payload.hasOwnProperty(WIND_DIRECTION_PATH))
                    && (payload.hasOwnProperty(ANEMOMETER_PATH))
                    && (payload.hasOwnProperty(RAIN_GAUGE_PATH))
            
            ) {
                    if ((payload[TS_PATH] != null)
                        && (payload[PYRANOMETER_PATH] != null)
                        && (payload[WIND_DIRECTION_PATH] != null)
                        && (payload[ANEMOMETER_PATH] != null)
                        && (payload[RAIN_GAUGE_PATH] != null)
                    ) {
                        // Save Payload to variable
                        TS = payload[TS_PATH];
                        PYRANOMETER = parseFloat(payload[PYRANOMETER_PATH]);
                        WIND_DIRECTION= payload[WIND_DIRECTION_PATH];
                        ANEMOMETER = parseFloat(payload[ANEMOMETER_PATH]);
                        RAIN_GAUGE = parseFloat(payload[RAIN_GAUGE_PATH]);

                    }
        
                }
                // input semua data kedalam main database 
                const dataArray = [TS,PYRANOMETER, ANEMOMETER, RAIN_GAUGE, [WIND_DIRECTION]];
                const insertQuery = `INSERT INTO climate_kalimantan (timestamp, pyrano_meter, anemometer, rain_gauge, wind_direction  ) VALUES 
                ($1, $2, $3, $4, $5)`;
                dbase_mqtt.query(insertQuery, dataArray, (err, res) => {
                    if (err) throw err;
                console.log(`DATA INSERTED TO MAIN DATABASE : Time = ${TS}, PYRANOMETER = ${PYRANOMETER},WIND_DIRECTION =${WIND_DIRECTION} ANEMOMETER = ${ANEMOMETER}, RAIN_GAUGE = ${RAIN_GAUGE}`);
                });

                // Mengambil data time dan rain_gauge dari tabel climate_kalimantan untuk 1 jam terakhir 
                var data = await dbase_mqtt.query(`SELECT timestamp, rain_gauge FROM climate_kalimantan 
                WHERE timestamp BETWEEN (NOW() - INTERVAL '1 day' - INTERVAL '1 hours') 
                AND NOW() ORDER BY timestamp DESC`);
                
                // akumulasi data rain_gauge 1 jam terakhir 
                var totalRainGaugeHours = 0;
                for (var i = 0; i < data.rows.length; i++) {
                    totalRainGaugeHours += data.rows[i].rain_gauge;
                }
                // format totalRainGaugeHours a
                totalRainGaugeHours = parseFloat(totalRainGaugeHours.toFixed(2));

                // Memasukkan data akumulasi ke dalam tabel baru
                await dbase_mqtt.query(`INSERT INTO rain_hours 
                (time, rain_gauge_hours) VALUES (DATE_TRUNC('minute', NOW()),
                 ${totalRainGaugeHours})`);
                console.log(`DATA Accumulation INSERTED TO Table : rain_hours  : Time = ${TS}, RAIN_GAUGE_HOURS = ${totalRainGaugeHours}`);

            }
        }
}