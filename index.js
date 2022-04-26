const express = require('express');
const app = express();
const rp = require('request-promise');
const cors = require('cors');

app.use(cors());

let companyCode = [{ "Id": "AAPL" }, { "Id": "NFLX" }, { "Id": "GOOG" }, { "Id": "AMZN" }, { "Id": "TSLA" }];

function getLogo(cc) {
   return `https://storage.googleapis.com/iex/api/logos/${cc}.png`;
}


function make_api_call(cc) {
    return rp({
        url: `https://cloud.iexapis.com/stable/stock/${cc}/quote?token=sk_e89ac88f38b0490e8188d656c429f244&format=json`,
        method: 'GET',
        json: true
    })
}

async function processStocks() {
    let result;
    for (let i = 0; i < companyCode.length; i++) {
        result = await make_api_call(companyCode[i].Id);
        logo =  getLogo(companyCode[i].Id);

        companyCode[i]['result'] = result;
        companyCode[i]['result'].logo = logo;

    }
    return companyCode;
}


app.get('/api/stocks', async (req, res) => {

    let result = await processStocks();
    res.send(result);
})

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`lisenting to port ${port}`));

