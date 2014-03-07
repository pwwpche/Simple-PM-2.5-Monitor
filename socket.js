var app = require('express')()
    , server = require('http').createServer(app)
    , io = require('socket.io').listen(server);
server.listen(1111);


app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html');
});

app.get('/style.css', function (req, res) {
    res.sendfile(__dirname + '/style.css');
});

app.get('/jquery.min.js', function (req, res) {
    res.sendfile(__dirname + '/jquery.min.js');
});

app.get('/script.js', function (req, res) {
    res.sendfile(__dirname + '/script.js');
});

app.get('/date.js', function (req, res) {
    res.sendfile(__dirname + '/date.js');
});

app.get('/Chart.js', function (req, res) {
    res.sendfile(__dirname + '/Chart.js');
});

app.get('/fineday.jpg', function (req, res) {
    res.sendfile(__dirname + '/fineday.jpg');
});

app.get('/jqplot.cursor.js', function (req, res) {
    res.sendfile(__dirname + '/jqplot.cursor.js');
});

app.get('/jqplot.highlighter.js', function (req, res) {
    res.sendfile(__dirname + '/jqplot.highlighter.js');
});

app.get('/jqplot.dateAxisRenderer.js', function (req, res) {
    res.sendfile(__dirname + '/jqplot.dateAxisRenderer.js');
});

app.get('/jquery.jqplot.js', function (req, res) {
    res.sendfile(__dirname + '/jquery.jqplot.js');
});

app.get('/jquery.jqplot.css', function (req, res) {
    res.sendfile(__dirname + '/jquery.jqplot.css');
});

app.get('/bg.jpg', function (req, res) {
    res.sendfile(__dirname + '/bg.jpg');
});


function reqData(server, addr, socket, emitStr) {
    var proxyContent = '';
    console.log("reqData");
    var req = server.request(addr, function (res) {
        res.on('data', function (dataChunk) {
            proxyContent += dataChunk;
        });
        res.on('end', function () {
            if (res.statusCode == 200) {
                // Send data to html page
                if (emitStr != "") {
                    socket.emit(emitStr, proxyContent);
                }
                else {
                    return proxyContent;
                }
                console.log("end");
            }
        });
        if (res.statusCode != 200) {
            console.log("error1");
            reqData(server, addr, socket, emitStr);
        }
    });
    req.end();
    req.on("error", function () {
        console.log("error2");
    });
}

//Send PM 2.5 data on the first connection
io.sockets.on('connection', function (socket) {
    /*  Get Content Data  */
    var proxyServer = require("http");
    var proxyAddr = {
        host: 'localhost',
        port: '8087',
        method: 'GET',
        path: 'http://tweettunnel.com/reverse2.php?textfield=cgshanghaiair'
    }
    reqData(proxyServer, proxyAddr, socket, 'Content');

    /*--------------------*/

    /*
     //Just for testing...
     var proxyContent = require("fs").readFileSync('D:/nodejs/1.html', "utf8");
     socket.emit('Content', proxyContent);
     */
    socket.on('received', function (data) {
        console.log("Done");
    });


//Send weather data on second connection
//Should be multiple dates???   NO!
//Date format: date[year, month, day], all of them are string or int
    socket.on('reqDate', function (range) {
        console.log("reqDate");
        var proxyContent = '';
<<<<<<< HEAD
<<<<<<< HEAD
        /*
=======
>>>>>>> 4f895333d9034d21510d05c337cbc22affa666e3
=======
>>>>>>> 4f895333d9034d21510d05c337cbc22affa666e3
        //Generate request address
        for (var i = 0; i < range.days; i++) {
            var path = '/history/airport/ZSSS/' + range.start.year + '/' + range.start.month + '/'
                + (range.start.day + i) + '/DailyHistory.html?format=1';
            var addr = {
                host: 'www.wunderground.com',
                path: path,
                method: 'GET'
            }
            var server = require('http');
            proxyContent = proxyContent + reqData(server, addr, socket, 'weather');
        }
<<<<<<< HEAD
<<<<<<< HEAD
        socket.emit('weather', proxyContent)
        */

=======
        /*
>>>>>>> 4f895333d9034d21510d05c337cbc22affa666e3
=======
        /*
>>>>>>> 4f895333d9034d21510d05c337cbc22affa666e3
         var pathStart = '/history/airport/ZSSS/' + range.start.year + '/' + range.start.month + '/'
         + range.start.day + '/DailyHistory.html?format=1';
         var pathEnd = '/history/airport/ZSSS/' + range.end.year + '/' + range.end.month + '/'
         + range.end.day + '/DailyHistory.html?format=1';
         var addr = {
         host: 'www.wunderground.com',
         path: pathStart,
         method: 'GET'
         }
         var server = require('http');
         var proxyContent = '';
         reqData(server, addr, socket, 'weather');
<<<<<<< HEAD
<<<<<<< HEAD


=======
         */
        socket.emit('weather', proxyContent)
>>>>>>> 4f895333d9034d21510d05c337cbc22affa666e3
=======
         */
        socket.emit('weather', proxyContent)
>>>>>>> 4f895333d9034d21510d05c337cbc22affa666e3
    });

});


