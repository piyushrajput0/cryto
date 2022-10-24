const express = require('express');
const app = express();
const port = 3000
var request = require('request'); //npm i request to get data from url
                                 // now you will not get its updates of this library("request")
var multer = require('multer');
var upload = multer();
const bodyParser = require('body-parser');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public')); //__dirname is your current path. Here we are giving command to it 
                                                // to use public folder for every static files

app.set('view engine', 'ejs'); // for render we should have a template engine 
                                  //so we use ejs and al the files in view directory must 
                                // use .ejs extension
app.use(upload.array());

let mData = ""
let coinName = "bitcoin"
let mChart = ""


async function resData(coinName){  // we declare it async function so we are able to use await function
    var marketData = await new Promise((resolve,reject)=>{ // it wait till the given below function produces it output and then it return it
        request('https://api.coingecko.com/api/v3/coins/' + coinName, function (error, response, body) {
            console.error('error:', error); 
            console.log('statusCode:', response && response.statusCode); 
            console.log('body:', typeof body);
            mData = JSON.parse(body)
        resolve(mData)
        });
    })

    if(marketData){
    var marketChart = await new Promise((resolve,reject)=>{
        request('https://api.coingecko.com/api/v3/coins/' + coinName + '/market_chart?vs_currency=usd&days=30', function (error, response, body) {
            console.error('error:', error); 
            console.log('statusCode:', response && response.statusCode); 
            console.log('body:', typeof body);
            mChart = JSON.parse(body)
            //console.log(mChart)
        resolve(mData)
        });
    })
}
}



app.get('/', async(req, res) => {
    await resData(coinName)
    res.render('index', { mData,mChart,coinName })
})

app.post('/', async (req, res) => {
    coinName = req.body.selectCoin;
    await resData(coinName)
    res.render('index', { mData,mChart,coinName })
})


app.listen(port, () => {
    console.log(`Example app listening on http://localhost:${port}`)
})