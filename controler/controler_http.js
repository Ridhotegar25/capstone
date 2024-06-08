
const path = require('path');
// const moment = require('moment');
const {Pool} = require('pg')
// const { off } = require('process');
// const { start } = require('repl');
require('dotenv').config()
// require('fs');
const dbase_rest= new Pool({
    host:process.env.DB_HOST,
    port:process.env.DB_PORT,
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_KALIMANTAN
})
dbase_rest.connect();
module.exports = {
    
    // HTTP HANDLING
    // Respond request to give latest 10 NEW data FOR CARD 
    async getData(req, res) {
        data = await dbase_rest.query(`SELECT  temperature,humidity,ldr FROM capstone 
        ORDER BY temperature ASC LIMIT 10`);
    
        res.status(200);
        res.send({
            count:data.rowCount,
            result:data.rows,
        })
        console.log("[REST-API ] GET :10 NEW DATA  ");
    },
    // // Respond request to acummulation rain gauge latest hours
    // async getDataAccumulasiHours(req, res) {
    //     // take value from new table accumulation
    //     var dataAccumulationHours = await dbase_rest.query(`SELECT to_char(time, 'DD-MM-YYYY HH24:MI:SS') 
    //     as time,rain_gauge_hours FROM rain_hours
    //     ORDER BY time DESC LIMIT 10`)
    
    //     res.status(200);
    //     res.send({
    //         count: dataAccumulationHours.rowCount,
    //         result: dataAccumulationHours.rows,
    //     })
    //     console.log("[REST-API ] GET DATA ACCUMULATION 1 HOURS RAIN GAUGE  ");
    // },
    // // Respond request to acummulation rain gauge daily
    // async getDataAccumulasiDay(req, res) {
    //     // take value from new table accumulation
    //     var dataAccumulationDay = await dbase_rest.query(`SELECT * FROM rain_hours
    //     WHERE time BETWEEN (NOW() - INTERVAL '1 day') 
    //     AND NOW() ORDER BY time DESC`);

    //     // akumulasi data rain_gauge 24 jam terakhir 
    //     var totalRainGaugeDay = 0;
    //     for (var i = 0; i < dataAccumulationDay.rows.length; i++) {
    //         totalRainGaugeDay += dataAccumulationDay.rows[i].rain_gauge_hours;
    //     }
    //     // format totalRainGaugeDay
    //     totalRainGaugeDay = parseFloat(totalRainGaugeDay.toFixed(2));

    //     res.status(200);
    //     res.send({
    //         totalRainGaugeDaily: totalRainGaugeDay.toFixed(2)
    //     })
    //     console.log("[REST-API ] GET DATA ACCUMULATION  RAIN GAUGE DAILY ");
    // },
    
}
