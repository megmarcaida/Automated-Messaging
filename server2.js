// server.js
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);



//phantom mysql
const Nightmare = require('nightmare')
var nightmare = Nightmare({show: true })
var mysql = require('mysql');
var goNumbers = nightmare.goto('https://facebook.com').wait('body').insert('#email', /*"xim.zuiq.5"*/"mix.quiz.37").insert('#pass', "UltimateP@ssw0rd").click('#u_0_2');
var connection = mysql.createConnection({host : 'localhost',user : 'root',password : '',database : 'fb_phone',});
var queryString = 'Select id,number from numbers where status = "0"';
var updatequeryNo = 'update numbers set status = "N" where id = ?';
var updatequeryYes = 'update numbers set status = "Y", url = ? where id = ?';


//var korText= "GTA스포츠 빅 이벤트 \u000A 첫충15%/매충10%지급 \u000A 다폴적중올미적이벤트 \u000A 출책 및 생일이벤트 \u000A \u000A 메이저실시간스포츠GTA \u000A 실시간해외배당연동 \u000A 스포츠전종목  \u000A 주요경기고배당제공 \u000A 다양한실시간게임 \u000A \u000A https://i.imgur.com/FFIwMRU.jpg";
//keep track of how times clients have clicked the button
var clickCount = 0;

app.use(express.static(__dirname + '/public'));
//redirect / to our index.html file
app.get('/', function(req, res,next) {
    res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', function(client) {
    console.log('Client connected...');
    //when the server receives clicked message, do this
    client.on('clicked', function(data) {

        //START
        connection.query(queryString, function (err,rows,fields) {
            if(err) throw err;
            goNumbers.wait()
                .then(function(result)
                {
                    return loopAgain(nightmare,rows,0) //and finally run the function again since it's still here
                })
                .catch((error) => {
                console.error('Search failed:', error);
        });

        });

        function loopAgain(nightmare,numbers,count){

            /*console.log(numbers[count])*/
            return nightmare
                    .wait('._1frb')
                    .click('a._19eb')
                    .wait('._1frb')
                    .wait(10000)
                    .type('._1frb', numbers[count].number + " \u000d")
                    /*.wait(5000)
                     .wait('._19bs')
                     .click('._19bs')*/
                    .wait(5000)
                    .wait('a._2yet')
                    .click('a._1ii5')
                    .wait(5000)
                    .click('div._51xa a')/*.click('div._51xa a:nth-child(1)')*/
                    .wait('._1mf span br')
                    .type('._1mf span br',"어홀")
                    //.insert('._1mf span span','')
                    .wait(5000)
                    .type('._1mf span span',' ')
                    //.type('._1mf span br',"http://i1076.photobucket.com/albums/w450/migzquiz304/fbbanner_zps2v8x7tah.jpg \u000d")
                    .wait(10000)
                    .click('a._3olu')
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

                    return loopAgain(nightmare,numbers,x+1)
                }
            })
                .catch((error) => {

                var x = count++;
            console.log("url: " + "No Result " + "num: " + numbers[x].number )

            connection.query(updatequeryNo,[numbers[x].id],function(err,results){
                io.emit('searchUpdate', "Number: " + numbers[x].number + ", Result :" + "User Doesn't Exist."  + "<br>" + JSON.stringify(results));
                console.log(results);
            });
            return loopAgain(nightmare,numbers,x+1)
        });

        }

        //END

        //send a message to ALL connected clients



    });
});

//start our web server and socket.io server listening

server.listen(5000, function(){
    console.log('listening on *:5000');
});