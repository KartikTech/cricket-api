const express = require('express');
const router = express.Router();
const cheerio = require('cheerio');
const randomUseragent = require('random-useragent');
const apicache = require("apicache");
const axios = require('axios');
const { rateLimit } = require('express-rate-limit');
const rua = randomUseragent.getRandom();
const cache = apicache.middleware
const matchdata = require('../utlis/app.json');
const { dummydata } = require('../utlis/error.js');
const { errormsg } = require('../utlis/msg.js');

const apiRequestLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 40,
    handler: function (req, res) {
        return res.status(429).json(
          dummydata()
        )
    }
})

router.get('/', cache('0.5 minutes'), apiRequestLimiter, function(req, res) {
    res.header('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods, Authorization, X-Requested-With');
    res.header('Access-Control-Allow-Methods', 'GET');
    res.header('X-Frame-Options', 'DENY');
    res.header('X-XSS-Protection', '1; mode=block');
    res.header('X-Content-Type-Options', 'nosniff');
    res.header('Strict-Transport-Security', 'max-age=63072000');
    res.setHeader('Content-Type', 'application/json');

    const match_url = req.query.url;

    let str = match_url || '';
    let live_url = str.replace('www', 'm');

    axios({
        method: 'GET',
        url: live_url,
        headers: {
            'User-Agent': rua
        }
    }).then(function(response) {

        $ = cheerio.load(response.data);

        var inn_1=[]
        var player_inn1={}
        var inn_2=[]
        var player_inn2={}

        var title = $("h4.ui-header").text();
        var j=1
        for(let i=0; i<($('#inn_1 .table-row:first > .table-responsive').length)*6;i++){
            if (i==(6*j)-1){
                if(Object.keys(player_inn1).length!==0){
                    inn_1.push(player_inn1)
                    player_inn1={}
                }
                player_inn1['name']=$('#inn_1 td[class="cbz-grid-table-fix "]').eq(i).text().trim();
            }
            else if(i==(6*j)){
                player_inn1['runs']=$('#inn_1 td[class="cbz-grid-table-fix "]').eq(i).text();
            }
            else if(i==(6*j)+1){
                player_inn1['fours']=$('#inn_1 td[class="cbz-grid-table-fix "]').eq(i).text();
            }
            else if(i==(6*j)+2){
                player_inn1['sixes']=$('#inn_1 td[class="cbz-grid-table-fix "]').eq(i).text();
            }
            else if(i==(6*j)+3){
                player_inn1['sr']=$('#inn_1 td[class="cbz-grid-table-fix "]').eq(i).text();
            }
            else if(i==(6*j)+4){
                player_inn1['status']=$('#inn_1 td[class="cbz-grid-table-fix "]').eq(i).text();
                j+=1
            }

        }

        var k=1;
        for(let i=5; i<($('#inn_2 .table-row:first > .table-responsive').length)*6;i++){
            if (i==(6*k)-1){
                if(Object.keys(player_inn2).length!==0){
                    inn_2.push(player_inn2)
                    player_inn2={}
                }
                player_inn2['name']=$('#inn_2 td[class="cbz-grid-table-fix "]').eq(i).text().trim();
            }
            else if(i==(6*k)){
                player_inn2['runs']=$('#inn_2 td[class="cbz-grid-table-fix "]').eq(i).text();
            }
            else if(i==(6*k)+1){
                player_inn2['fours']=$('#inn_2 td[class="cbz-grid-table-fix "]').eq(i).text();
            }
            else if(i==(6*k)+2){
                player_inn2['sixes']=$('#inn_2 td[class="cbz-grid-table-fix "]').eq(i).text();
            }
            else if(i==(6*k)+3){
                player_inn2['sr']=$('#inn_2 td[class="cbz-grid-table-fix "]').eq(i).text();
            }
            else if(i==(6*k)+4){
                player_inn2['status']=$('#inn_2 td[class="cbz-grid-table-fix "]').eq(i).text();
                k+=1
            }

        }

        var livescore = ({
            title: title || "Data Not Found",
            score_1:inn_1 || "Data not found",
            score_2:inn_2 || "Data not found"
        });

        res.send(JSON.stringify(livescore, null, 4));

    }).catch(function(error) {
        if (!error.response) {
            res.json(errormsg());
        } else {
            res.json(errormsg());
        }
    });

});

module.exports = router;