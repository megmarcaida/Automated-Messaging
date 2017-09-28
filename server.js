// server.js
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var PORT = 5000;



//phantom mysql
const Nightmare = require('nightmare')
var nightmare = Nightmare({show: true })
var mysql = require('mysql');

var connection = mysql.createConnection({host : 'localhost',user : 'root',password : '',database : 'fb_phone',});
var queryString = 'Select id,number from numbers where status = "0"';
var updatequeryNo = 'update numbers set status = "N" where id = ?';
var updatequeryYes = 'update numbers set status = "Y", url = ? where id = ?';


var korText= "GTA스포츠 빅 이벤트 " +
    " 첫충15%/매충10%지급" +
    " 다폴적중올미적이벤트 " +
    " 출책 및 생일이벤트 " +
    " 메이저실시간스포츠GTA " +
    "실시간해외배당연동 " +
    " 스포츠전종목  " +
    " 주요경기고배당제공 " +
    " 다양한실시간게임 " +
    "";


app.use(express.static(__dirname + '/public'));
//redirect / to our index.html file
app.get('/', function(req, res,next) {
    res.sendFile(__dirname + '/public/index.html');
});




io.on('connection', function(client) {
    console.log('Client connected...');

    client.on('restart', function(data) {
           process.exit();

    });

    client.on('clicked', function(data) {
        console.log("RUNNING...");
        //console.log(data);
        var goNumbers = nightmare.goto('https://facebook.com').wait('body').type('#email', data.username/*"xim.zuiq.5"*//*"mix.quiz.37"*/).type('#pass', data.password/*"UltimateP@ssw0rd"*/).wait(2000).click('#loginbutton');
        //START
        connection.query(queryString, function (err, rows, fields) {
            if (err) throw err;
            return goNumbers.wait()
                    .then(function (result) {
                        return loopAgain(nightmare, rows, 0, data.image, data.message) //and finally run the function again since it's still here
                    })
                    .catch((error) => {
                    console.log('Search Failed: ' + error)
                    });
        });





        function loopAgain(nightmare,numbers,count,image,message){

            return nightmare
                    .wait('._1frb')
                    .click('a._19eb')
                    .wait('._1frb')
                    .wait(10000)
                    .type('._1frb', numbers[count].number + "\u000d")
                    .wait(5000)
                    .wait('a._2yet')
                    .click('a._1ii5')
                    .wait(5000)
                    .click('div._51xa a')
                    .wait('._1mf span br')
                    .type('._1mf span br',message + " \n" + image)
                    .wait(5000)
                    .type('._1mf span span'," \u000d")
                    .click('a._3olu')
                    .wait(10000)
                    .evaluate(() => document.querySelector('a._2nlw').href)
                    .then(function(result)
                    {
                        if(result)
                        {
                            var x = count++;
                            console.log("url: " + result + "num: " + numbers[x].number )

                            connection.query(updatequeryYes,[result,numbers[x].id],function(err,results){
                                io.emit('searchUpdate', "Number: " + numbers[x].number + ", Result :" + "User Exist. , URL :" + result  + "<br>" + JSON.stringify(results));
                                console.log(results);
                            });

                            return loopAgain(nightmare,numbers,x+1,image,message)
                        }
                    })
                    .catch((error) => {

                        var x = count++;
                        console.log("url: " + "No Result " + "num: " + numbers[x].number )

                        connection.query(updatequeryNo,[numbers[x].id],function(err,results){
                            io.emit('searchUpdate', "Number: " + numbers[x].number + ", Result :" + "User Doesn't Exist."  + "<br>" + JSON.stringify(results));
                            console.log(results);
                        });
                        return loopAgain(nightmare,numbers,x+1,image,message)
                    });

        }

        //END

        //send a message to ALL connected clients



    });
});

//start our web server and socket.io server listening

/*server.listen(5000, function(){
    console.log('listening on *:5000');
    console.log(korText)
});*/




server.listen( PORT, "latte.local", 34, function(){
    console.log( "Server listening on port:%s", PORT );
});