const router = require('express').Router();
const climate_http = require('./controler_http.js');
// 
router.get('/capstone/getDataTemperature', climate_http.getData);// route request to respond lastest 10 data for card 
// router.get('/climate/getRainHours', climate_http.getDataAccumulasiHours);// route request to respond rain gauge accumulation latest hours 
// router.get('/climate/getRainDaily',climate_http.getDataAccumulasiDay) //route request to respond rain gauge accumulation daily 


module.exports = router;