/*!
 * Copyright 2016, Michael Spiss
 * Released under the MIT license
 *
 * Date: 2016-02-16
 */

var n = 0,
    k = 0,
    DisplayN = null,
    DisplayK = null,
    DisplayKOverN = null;

$(document).ready(function(){
    //setup
    DisplayN = document.getElementById('valN');
    DisplayK = document.getElementById('valK');
    DisplayKOverN = document.getElementById('valKOverN');

    //register start button handler
    document.getElementById('startButton').onclick = function() {
        startCalculations();
    };

    //register reset button handler
    document.getElementById('resetButton').onclick = function() {
        resetCalculations();
    };
});

function getRandomInt() {
    return Math.floor(Math.random() * 1000) / 1000;
}


function resetCalculations()
{
    DisplayN.innerHTML = '0';
    DisplayK.innerHTML = '0';
    DisplayKOverN.innerHTML = '0';
    n = 0;
    k = 0;
    diagram.series[0].setData([], false, false, false);
    diagram.series[1].setData([], true, false, false);
}

function startCalculations(){
    //get the string the user entered
    var newCount = document.getElementById('valNNew').value;

    //make sure the input is a number and if not return 0
    if(isNaN(parseInt(newCount)))
    {
        return false;
    }

    newCount = parseInt(newCount);

    //set the new n (old n + new n)
    n = n + newCount;

    //generate n new coordinates
    for(var i = 0; i < newCount; i++)
    {
        var newX = getRandomInt(),
            newY = getRandomInt(),
            newZ = getRandomInt();

        //if x^2 + y^2 + z^2 <= 1 the coordinate lies within the sphere
        if( ( newX * newX ) + ( newY * newY ) + ( newZ * newZ ) <= 1 ) {
            //if coordinate lies within the sphere add 1 positive test to K
            k++;
            //add coordinate as a positive test to the diagram, suppress redraw
            diagram.series[1].addPoint([newX, newY, newZ], false, false, false);
        } else {
            //add coordinate as a negative test to the diagram, suppress redraw
            diagram.series[0].addPoint([newX, newY, newZ], false, false, false);
        }
    }

    //update view
    DisplayN.innerHTML = n.toString();
    DisplayK.innerHTML = k.toString();
    //to prevent division by 0
    var KOverN = n == 0 ? 0 : ((k / n) * 8);
    DisplayKOverN.innerHTML = KOverN.toString();

    //wait a bit to give the numbers a chance to update
    setTimeout(function(){
        //draw all points
        diagram.redraw();
    }, 15);

}

/*
    diagram code (highcharts.js)
*/

var diagram;

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
                depth: 1,
                enableMouseTracking: false
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
    diagram = chart;
});