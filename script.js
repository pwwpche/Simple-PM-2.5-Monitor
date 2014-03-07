var proxyContent = '';
var socket = io.connect('http://localhost:1111');
var plotPM;
var pmRange =
{
    x_max : 0,
    x_min : 0,
    y_max : 0,
    y_min : 0
};
var plotWeather;
var weatherLoaded = false;

var pwFunction = {};
pwFunction[0] = paintWeather;
pwFunction[1] = paintWeather;
pwFunction[2] = paintWeather2;
pwFunction[3] = paintWeather3;
/*
 function paint2(data,canvasId){
 var time = {};
 var aqi = {};
 for(var i = 0 ; i < data.length ; i++){
 time[i] = data[i].time[0].replace(/(\d+)-(\d+)-(\d+)/ , "$3-$1-$2");
 console.log(time[i]);
 aqi[i] = parseInt(data[i].AQI[0]);
 console.log(aqi[i]);
 }
 console.log(aqi);
 var mydata={
 labels : time,
 datasets : [
 {
 fillColor : "rgba(220,220,220,0.5)",
 strokeColor : "rgba(220,220,220,1)",
 pointColor : "rgba(220,220,220,1)",
 pointStrokeColor : "#fff",
 data : aqi
 }
 ]
 }
 //Get context with jQuery - using jQuery's .get() method.
 var ctx = document.getElementById(canvasId).getContext("2d");
 //This will get the first returned node in the jQuery collection.
 var myNewChart = new Chart(ctx).Line(mydata);

 }
 */


function paintPM(data, divId)
{
    var data2 = new Array();
    for (var i = 0; i < data.length; i++) {
        var time = data[i].time[0].replace(/(\d+)-(\d+)-(\d+)/, "$3-$1-$2");
        var aqi = parseInt(data[i].AQI[0]);
        data2.push([time, aqi]);
    }
    /*
     var time = {};
     var aqi = {};
     var data = {};
     for(var i = 0 ; i < 7 ; i++){
     time[i] = "01-2"+i +"-2014 1" + i + ":00"
     aqi[i] = 110 + 2*i;
     data[i] = [time[i].replace(/(\d+)-(\d+)-(\d+)/ , "$3-$1-$2"), aqi[i]];
     console.log(data[i]);
     }
     */
    plotPM = $.jqplot(divId, [data2], {
        title: '@Con Gen ShanghaiAir',
        axes: {
            xaxis: {
                renderer: $.jqplot.DateAxisRenderer,
                tickOptions: {
                    formatString: '%b&nbsp;%#d %H:00'
                }
            },
            yaxis: {
                tickOptions: {
                    formatString: '%d'
                }
            }
        },
        highlighter: {
            show: true,
            sizeAdjust: 7.5
        },
        cursor: {
            show: true,
            zoom: true,
            showToolTip: true
        }
    });

}

function paintWeather(data, divId, labels)
{
    console.log(data);
    plotWeather = $.jqplot(divId, data, {
        title: '@Shanghai Weather',
        legend:
        {
            show: true,
            labels: labels
        },
        axes: {
            xaxis: {
                renderer: $.jqplot.DateAxisRenderer,
                tickOptions: {
                    formatString: '%b&nbsp;%#d %H:00'
                }
            },
            yaxis: {
                tickOptions: {
                    formatString: '%d'
                }
            }
        },
        highlighter: {
            show: true,
            sizeAdjust: 7.5
        },
        cursor: {
            show: true,
            zoom: true,
            showToolTip: true
        }
    });

}

function paintWeather2(data, divId, labels)
{

    plotWeather = $.jqplot(divId, data, {
        title: '@Shanghai Weather',
        series: [
            {},
            {yaxis: 'y2axis'}
        ],
        cursor: {
            show: true,
            tooltipLocation: 'sw',
            zoom: true
        },
        axesDefaults: {useSeriesColor: true},
        legend:
        {
            show: true,
            labels: labels
        },
        axes: {
            xaxis: {
                renderer: $.jqplot.DateAxisRenderer,
                tickOptions: {
                    formatString: '%b&nbsp;%#d %H:00'
                }
            },
            yaxis: {
                tickOptions: {
                    formatString: '%d'
                }
            },
            y2axis: {
                tickOptions: {
                    formatString: '%d'
                }
            }
        },
        highlighter: {
            show: true,
            sizeAdjust: 7.5
        },
        cursor: {
            show: true,
            zoom: true,
            showToolTip: true
        }
    });

}
function updateWeather()
{
    console.log("hook");
    if(plotPM.axes.xaxis.min != pmRange.x_min)
    {
        reqWeatherByPM();
        pmRange.x_min = plotPM.axes.xaxis.min;
        pmRange.x_max = plotPM.axes.xaxis.max;
        pmRange.y_min = plotPM.axes.yaxis.min;
        pmRange.y_max = plotPM.axes.yaxis.max;
    }
}


function paintWeather3(data, divId, labels)
{

    plotWeather = $.jqplot(divId, data, {
        title: '@Shanghai Weather',
        series: [
            {},
            {yaxis: 'y2axis'},
            {yaxis: 'y3axis'}
        ],
        cursor: {
            show: true,
            tooltipLocation: 'sw',
            zoom: true
        },
        axesDefaults: {useSeriesColor: true},
        legend:
        {
            show: true,
            labels: labels
        },
        axes: {
            xaxis: {
                renderer: $.jqplot.DateAxisRenderer,
                tickOptions: {
                    formatString: '%b&nbsp;%#d %H:00'
                }
            },
            yaxis: {
                tickOptions: {
                    formatString: '%d'
                }
            },
            y2axis: {
                tickOptions: {
                    formatString: '%d',
                    showGridline:false
                }
            },
            y3axis: {
                tickOptions: {
                    formatString: '%d',
                    showGridline:false
                }
            }
        },
        highlighter: {
            show: true,
            sizeAdjust: 7.5
        },
        cursor: {
            show: true,
            zoom: true,
            showToolTip: true
        }
    });

}
function getWeatherDay(str)
{
    var dayInfo = new Array();
    var infoData = new Array();
    var startPos = 0;
    var endPos = 0;
    var dayStr;
    while(1)
    {
        startPos = str.indexOf('TimeCST');
        endPos = str.indexOf('TimeCST', startPos + 1);
        if(endPos == -1 )
        {
            endPos = str.length;
            dayStr = str.substring(startPos, endPos);
            dayInfo.push(formatWeather(dayStr));
            break;
        }
        dayStr = str.substring(startPos, endPos);
        dayInfo.push(formatWeather(dayStr));
        endPos = startPos;
    }

    for(var i = 0 ; i < dayInfo.length ; i++)
    {
        for(var j=0 ; j < dayInfo[i].length ; j++)
        {
            infoData.push(dayInfo[i][j]);
        }
    }
    return infoData;

}

function formatWeather(str)
{
    /*
     var str = "TimeCST,TemperatureC,Dew PointC,Humidity,Sea Level PressurehPa,VisibilityKm,Wind Direction,Wind SpeedKm/h,Gust SpeedKm/h,Precipitationmm,Events,Conditions,WindDirDegrees,DateUTC<br />12:00 AM,8.0,4.0,76,1028,6.0,East,10.8,-,N/A,,Unknown,90,2014-02-23 16:00:00<br />12:30 AM,8.0,4.0,76,1028,6.0,East,7.2,-,N/A,,Unknown,90,2014-02-23 16:30:00<br />1:00 AM,7.0,4.0,81,1028,6.0,East,7.2,-,N/A,,Unknown,80,2014-02-23 17:00:00<br />"
     */
    var lineStr = new Array();
    var infoData = new Array();
    var startPos = str.indexOf('DateUTC') + 13;
    var endPos = startPos;
    var i = 0;
    while (1) {
        endPos = str.indexOf("<br />", startPos);
        if (endPos == -1) {
            endPos = str.length;
            lineStr[i] = str.substring(startPos, endPos);
            break;
        }
        lineStr[i] = str.substring(startPos, endPos);
        infoData[i] = extractWeather(lineStr[i]);
        startPos = endPos + 6;
        i++;
    }
    return infoData;
}

function extractWeather(str)
{
    console.log("in extractWeather");
    var data = new Array();
    var i = 0;
    var startPos = 1;
    var endPos = 0;
    while (1) {
        endPos = str.indexOf(",", startPos);
        if (endPos == -1) {
            endPos = str.length;
            data[i] = str.substring(startPos, endPos);
            startPos = startPos + 1;
            break;
        }
        data[i] = str.substring(startPos, endPos);
        startPos = endPos + 1;
        i++;
    }
    //TimeCST,TemperatureC,Dew PointC,Humidity,Sea Level PressurehPa,VisibilityKm,Wind Direction,Wind SpeedKm/h,Gust SpeedKm/h,Precipitationmm,Events,Conditions,WindDirDegrees,DateUTC
    var dayInfo =
    {
        'timeCST': data[0],
        'temperature': data[1],
        'dewPoint': data[2],
        'humidity': data[3],
        'seaLevelPressure': data[4],
        'visibility': data[5],
        'windDirection': data[6],
        'windSpeed': data[7],
        'gustSpeed': data[8],
        'precipitation': data[19],
        'events': data[10],
        'conditions': data[11],
        'windDirDegrees': data[12],
        'dataUTC': data[13],
        'millisecond': 0
    }
    dayInfo.millisecond = convertMillisec(dayInfo);
    return dayInfo;
}
function reqWeatherByPM()
{
    var start = new Date();
    var end = new Date();
    start.setTime(plotPM.axes.xaxis.min);
    end.setTime(plotPM.axes.xaxis.max);
    var range =
    {
        start: {
            year: start.getFullYear(),
            month: start.getMonth() + 1,
            day: start.getDay()
        },
        end: {
            year: end.getFullYear(),
            month: end.getMonth() + 1,
            day: end.getDay()
        },
        day: (end.getTime() - start.getTime()) / (1000*3600*24)
    }
    console.log("range is");
    console.log(range);
    socket.emit('reqDate', range);
}
function requestWeather()
{
    var range2 =
    {
        start: {
            year: "2014",
            month: "2",
            day: "13"
        },
        end: {
            year: "2014",
            month: "2",
            day: "13"
        }
    };
    var range =
    {
        start: {
            year: document.getElementById("s_year").options[document.getElementById("s_year").selectedIndex].text,
            month: document.getElementById("s_month").options[document.getElementById("s_month").selectedIndex].text,
            day: document.getElementById("s_day").options[document.getElementById("s_day").selectedIndex].text
        },
        end: {
            year: document.getElementById("s_year").options[document.getElementById("s_year").selectedIndex].text,
            month: document.getElementById("s_month").options[document.getElementById("s_month").selectedIndex].text,
            day: document.getElementById("s_day").options[document.getElementById("s_day").selectedIndex].text
        }
    };
    socket.emit('reqDate', range);
}

function convertMillisec(info)
{
    //dataUTC: "2000-01-18 16:00:00"
    var utc = info.dataUTC;
    var year = parseInt(utc.substring(0, 4));
    var month = parseInt(utc.substring(5, 7));
    var day = parseInt(utc.substring(8, 10));
    var hour = parseInt(utc.substring(11, 13));
    var min = parseInt(utc.substring(14, 16));
    var sec = parseInt(utc.substring(17, 19));
    return Date.UTC(year, month, day, hour, min, sec)
}

/*Received PM 2.5 Data of this day*/
socket.on('Content', function (data)
{
    /*===Many of the variants and lines below can be eliminated, but I'm too lazy, so...===*/
    proxyContent = data;
    var start = proxyContent.indexOf('<div class="content">');
    var end = proxyContent.indexOf("</div><a")
    proxyContent = proxyContent.substr(start + 21, end - start - 40);
    console.log("Proxy Conent Done");

    var group = new Array();
    proxyContent = proxyContent.replace(/<script[^>]*>[^<]*?<\/script>/ig, "     ");

    /* Temporary Variables  */
    var avg = new Array();
    var avgIdx = 0;
    var realtime = new Array();
    var realtimeIdx = 0;
    var pattern = new RegExp("avg");
    var pattern2 = new RegExp("No Data");

    /*  Records of Real Time Report */
    var rt_time;
    var rt_aqi;
    var rt_record = new Array();

    /* Look for one record item  */
    group = proxyContent.match(/..-..-....\s..:..*?\s\s\s\s\s/gi);

    for (var j = 0; j < group.length; j++) {
        /* If item contains 'avg' , then true */
        if (pattern.test(group[j])) {
            avg[avgIdx++] = group[j];
        } else {
            /*If item contains 'No Data', then true */
            if (pattern2.test(group[j])) {
                realtime[realtimeIdx] = group[j];
                /*Extract time*/
                rt_time = realtime[realtimeIdx].match(/..-..-.... ..:../);
                rt_record[realtimeIdx] = {
                    "time": rt_time,
                    "AQI": "0"
                }
                continue;
            }

            realtime[realtimeIdx] = group[j];
            /*  Extract time  */
            rt_time = realtime[realtimeIdx].match(/..-..-.... ..:../);
            /*  Extract AQI  */
            rt_aqi = realtime[realtimeIdx].match(/ [^.:]\d+;/)[0].match(/\d+/);
            rt_record[realtimeIdx] = {
                "time": rt_time,
                "AQI": rt_aqi
            };
            realtimeIdx++;
        }
        /*  $("div#extract").append(group[j] + "<br>");  */
    }

    socket.emit('received', "Done");
    paintPM(rt_record, "pmChart");
    $.jqplot.postDrawHooks.push(updateWeather);
    reqWeatherByPM();
});

/*Weather of that day received, parse it and then paint the chart*/
socket.on('weather', function (data)
{

    if (weatherLoaded == false) {
        weatherLoaded = true;
    }
    else {
        plotWeather.destroy();
    }
    var weatherInfo = getWeatherDay(data);
    console.log("painting...");
    var paintData = new Array();
    var labels = new Array();
    if(document.getElementById("c_temperature").checked == true)
    {
        var temp = new Array();
        for (var i = 0; i < weatherInfo.length; i++) {
            temp.push([weatherInfo[i].dataUTC, parseInt(weatherInfo[i].temperature)]);
        }
        paintData.push(temp);
        labels.push("temperature");
    }

    if(document.getElementById("c_humidity").checked == true)
    {
        var temp = new Array();
        for (var i = 0; i < weatherInfo.length; i++) {
            temp.push([weatherInfo[i].dataUTC, parseInt(weatherInfo[i].humidity)]);
        }
        labels.push("humidity");
        paintData.push(temp);
    }

    if(document.getElementById("c_windSpeed").checked == true)
    {
        var temp = new Array();
        for (var i = 0; i < weatherInfo.length; i++) {
            temp.push([weatherInfo[i].dataUTC, parseInt(weatherInfo[i].windSpeed)]);
        }
        labels.push("windSpeed");
        paintData.push(temp);
    }

    pwFunction[paintData.length](paintData,  'weatherChart', labels);
});

$(document).ready(function ()
{
    $("#resetZoomPM").click(function () {
        console.log("x_min = " + plotPM.axes.xaxis.min);
        console.log("x_max = " + plotPM.axes.xaxis.max);
        console.log("y_min = " + plotPM.axes.yaxis.min);
        console.log("y_max = " + plotPM.axes.yaxis.max);
        var start = new Date();
        var end = new Date();
        start.setTime(parseInt(plotPM.axes.xaxis.min));
        end.setTime(plotPM.axes.xaxis.max);
        console.log(start.toUTCString());
        console.log(end.toUTCString());
        plotPM.resetZoom();
    });

    $("#resetZoomWeather").click(function () {
        plotWeather.resetZoom();
    });
    //$(".weatherType").click(requestWeather());
    s_list();
});
