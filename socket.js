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


function reqPM(socket, emitStr, reqDay) {
    var server = require("http");
    var addr = {
        host: 'localhost',
        port: '8087',
        method: 'GET',
        path: 'http://tweettunnel.com/reverse3.php?b=&pgn=32&bt=443314230825975809&st=441909971714727936&id=562768872&pn=' + reqDay
    }
    var proxyContent = '';
    console.log("reqPM");
    var req = server.request(addr, function (res) {
        res.on('data', function (dataChunk) {
            proxyContent += dataChunk;
        });
        res.on('end', function () {
            if (res.statusCode == 200) {
                if (emitStr != "") {
                    socket.emit(emitStr, proxyContent);
                }
                else {
                    reqPM(socket, emitStr, reqDay);
                }
            }
        });
        if (res.statusCode != 200) {
            console.log("error1");
            reqPM(socket, emitStr, reqDay);
        }
    });
    req.end();
    req.on("error", function () {
        console.log("error2");
    });
}


function reqWeather(socket, range, i, content) {
    var fs = require('fs');
    var fileName = range.start.year + '-' + range.start.month + '-' + (range.start.day + i) + "_Weather.txt";
    var proxyContent = '';
    if (i >= range.day) {
        for (var j = 0; j < range.day; j++) {
            proxyContent = proxyContent + content[j];
        }
        socket.emit('weather', proxyContent);
        return;
    }
    fs.readFile(fileName, function (err, data) {
        if (err) {
            var path = '/history/airport/ZSSS/' + range.start.year + '/' + range.start.month + '/'
                + (range.start.day + i) + '/DailyHistory.html?format=1';
            var addr = {
                host: 'www.wunderground.com',
                path: path,
                method: 'GET'
            }
            var server = require('http');


            var req = server.request(addr, function (res) {
                res.on('data', function (dataChunk) {
                    proxyContent += dataChunk;
                });
                res.on('end', function () {
                    if (res.statusCode == 200) {
                        console.log(fileName + " not exists, create file");
                        content[i] = proxyContent;
                        fs.writeFile(fileName, proxyContent, 'utf-8');
                        return reqWeather(socket, range, i + 1, content);
                    }
                });
                if (res.statusCode != 200) {
                    console.log("error1");
                    return reqWeather(socket, range, i, content);
                }
            });
            req.end();
            req.on("error", function () {
                console.log("error2");
            });
        }
        else
        {
            console.log(fileName + "exists!");
            content[i] = data;
            return reqWeather(socket, range, i + 1, content);
        }
    });
}


//Send PM 2.5 data on the first connection
io.sockets.on('connection', function (socket) {
    /*  Get Content Data  */
    reqPM(socket, 'Content', 1);

    /*--------------------*/

    /*
     //Just for testing...
     var proxyContent = require("fs").readFileSync('D:/nodejs/1.html', "utf8");
     socket.emit('Content', proxyContent);
     */
    socket.on('received', function (data) {
        console.log(data);
    });


//Send weather data on second connection
    socket.on('reqDate', function (range) {
        console.log("reqDate");
        var proxyContent = new Array();
        //Generate request address
        reqWeather(socket, range, 0, proxyContent);
    });

    socket.on("reqPM", function(day){
        reqPM(socket, 'Content', day);
    });

});


