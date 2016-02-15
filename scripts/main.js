/*!
 * Copyright 2015, Michael Spiss
 * Released under the MIT license
 *
 * Date: 2015-11-27
 */

var n = 0,
    k = 0,
    ValueN = null,
    ValueK = null,
    ValueKOverN = null;

$(document).ready(function(){
    ValueN = document.getElementById('valN');
    ValueK = document.getElementById('valK');
    ValueKOverN = document.getElementById('valKOverN');
});

function getRandomInt() {
    return Math.floor(Math.random() * 1000) / 1000;
}

document.getElementById('startButton').onclick = function() {
    startCalculations();
};

document.getElementById('resetButton').onclick = function() {
    resetCalculations();
};


function resetCalculations()
{
    ValueN.innerHTML = '0';
    ValueK.innerHTML = '0';
    ValueKOverN.innerHTML = '0';
    n = 0;
    k = 0;
    AccessSeries.series[0].setData([], false, false, false);
    AccessSeries.series[1].setData([], true, false, false);
}

function startCalculations(){
    var maxTimes = document.getElementById('valNNew').value,
        times = 0;

    while ( times < maxTimes ) {
        times++;
        n++;
        var newX = getRandomInt(),
            newY = getRandomInt(),
            newZ = getRandomInt();

        if( ( newX * newX ) + ( newY * newY ) + ( newZ * newZ ) <= 1 ) {
            k++;
            AccessSeries.series[1].addPoint([newX, newY, newZ], false, false, false);
        } else {
            AccessSeries.series[0].addPoint([newX, newY, newZ], false, false, false);
        }
    }

    ValueN.innerHTML = n.toString();
    ValueK.innerHTML = k.toString();
    var KOverN = n == 0 ? 0 : ((k / n) * 8);
    ValueKOverN.innerHTML = KOverN.toString();

    //display the result before drawing
    setTimeout(function(){
        AccessSeries.redraw();
    }, 10);

}



//SCATTER PLOT


var AccessSeries;

$(function () {

    // Set up the chart
    var chart = new Highcharts.Chart({
        chart: {
            renderTo: 'diagram',
            margin: 100,
            events: {

            },
            type: 'scatter',
            options3d: {
                enabled: true,
                alpha: 5,
                beta: 50,
                depth: 200,
                viewDistance: 5,

                frame: {
                    bottom: { size: 1, color: 'rgba(0,0,0,.02)' },
                    back: { size: 1, color: 'rgba(0,0,0,.04)' },
                    side: { size: 1, color: 'rgba(0,0,0,.06)' }
                }
            }
        },
        title: {
            text: 'An eighth of a sphere'
        },
        subtitle: {
            text: 'Click and drag to move'
        },
        plotOptions: {
            scatter: {
                width: 1,
                height: 1,
                depth: 1
            }
        },
        yAxis: {
            min: 0,
            max: 1,
            title: null
        },
        xAxis: {
            min: 0,
            max: 1,
            gridLineWidth: 0.5
        },
        zAxis: {
            min: 0,
            max: 1,
            showFirstLabel: false
        },
        legend: {
            enabled: false
        },
        series: [
            { marker: { radius: 2, fillColor: 'rgba(44, 62, 80,.2)' }, data: [] },
            { marker: { radius: 2, fillColor: 'rgba(211, 84, 0,1.0)' }, data: [] }
        ]
    });


    // Add mouse events for rotation
    $(chart.container).bind('mousedown.hc touchstart.hc', function (e) {
        e = chart.pointer.normalize(e);

        var posX = e.pageX,
            posY = e.pageY,
            alpha = chart.options.chart.options3d.alpha,
            beta = chart.options.chart.options3d.beta,
            newAlpha,
            newBeta,
            sensitivity = 5; // lower is more sensitive

        $(document).bind({
            'mousemove.hc touchdrag.hc': function (e) {
                // Run beta
                newBeta = beta + (posX - e.pageX) / sensitivity;
                chart.options.chart.options3d.beta = newBeta;

                // Run alpha
                newAlpha = alpha + (e.pageY - posY) / sensitivity;
                chart.options.chart.options3d.alpha = newAlpha;

                chart.redraw(false);
            },
            'mouseup touchend': function () {
                $(document).unbind('.hc');
            }
        });
    });
    AccessSeries = chart;
});