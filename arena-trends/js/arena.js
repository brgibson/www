---
#we need this yaml block to get the jekyll templating
---
var BRG = BRG || {};

(function () {
    BRG.ARENA = BRG.ARENA || {};
    BRG.ARENA.CONFIG = {
        isShowBasic: true,
        isShowFeatured: false,
        dateIndexMin: {{site.data.arena.size}} - 20,
        dateIndexMax: {{site.data.arena.size}} - 1,
        pointsMin: 0,
        pointsMax: 20000000
    };

    var svg = d3.select("svg"),
        margin = {top: 20, right: 80, bottom: 30, left: 70},
        // margin = {top: 0, right: 0, bottom: 0, left: 0},
        width = svg.attr("width") - margin.left - margin.right,
        height = svg.attr("height") - margin.top - margin.bottom,
        graphWrapper = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")"),
        graphDataWrapper= graphWrapper.append("g");

    var parseTime = d3.timeParse("%m/%d/%Y");

    var scaleX = d3.scaleTime().range([0, width]),
        scaleY = d3.scaleLinear().range([height, 0]),
        scaleZ = d3.scaleOrdinal(d3.schemeCategory10);

    var line = d3.line()
        .x(function (d) {
            return scaleX(d.date);
        })
        .y(function (d) {
            return scaleY(d.score);
        });

    var getIntValue = (function () {
        var previousInt = 0;
        return function (numStr) {
            var toReturn;
            try {
                toReturn = parseInt(numStr.replace(/,/g, '')) || previousInt;
            } catch (ex) {
                toReturn = previousInt;
            } finally {
                previousInt = toReturn;
                return toReturn;
            }
        };
    })();

    BRG.ARENA.getDateBasedOnIndex = function(index) {
        return BRG.ARENA.dataForD3[0].values[index].date
    };

    ////////////////////////////////////////////////////////////////////////////
    var axisX;
    var axisY;

    BRG.ARENA.formatJsonForD3 = function(jsonData) {
        var dataForD3 = [];

        if (BRG.ARENA.CONFIG.isShowBasic) {
            dataForD3.push({
                id: "Basic",
                values: jsonData.map(function (d) {
                    return {
                        date: parseTime(d.date),
                        name: d.basic,
                        score: getIntValue(d.scores[1])
                    };
                })
            });
        }

        if (BRG.ARENA.CONFIG.isShowFeatured) {
            dataForD3.push({
                id: "Featured",
                values: jsonData.map(function (d) {
                    return {
                        date: parseTime(d.date),
                        name: d.featured,
                        score: getIntValue(d.scores[0])
                    };
                })
            });
        }

        return dataForD3;
    };

    BRG.ARENA.setDomainXBasedOnData = function(dataForD3) {
        //set x domain based on the data to be displayed
        scaleX.domain(d3.extent(dataForD3[0].values, function (d) {
            return d.date;
        }));
    };

    BRG.ARENA.setDomainYBasedOnData = function(dataForD3) {
        BRG.ARENA.CONFIG.pointsMin = d3.min(dataForD3, function (c) {
            return d3.min(c.values, function (d) {
                return d.score;
            });
        });

        BRG.ARENA.CONFIG.pointsMax = d3.max(dataForD3, function (c) {
            return d3.max(c.values, function (d) {
                return d.score;
            });
        });

        scaleY.domain([
            BRG.ARENA.CONFIG.pointsMin,
            BRG.ARENA.CONFIG.pointsMax
        ]);
    };

    BRG.ARENA.setDomainZ = function(cities) {
        scaleZ.domain(cities.map(function (c) {
            return c.id;
        }));
    };

    BRG.ARENA.updateAxisX = function() {
        if (!axisX) {
            axisX = graphWrapper.append("g").attr("class", "axis axis--x");
        }
        axisX
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(scaleX));
    };

    BRG.ARENA.updateAxisY = function() {
        if (!axisY) {
            axisY = graphWrapper.append("g").attr("class", "axis axis--y")
        }
        axisY
            .call(d3.axisLeft(scaleY))
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "0.71em")
            .text("Points");
    };

    BRG.ARENA.appendGraphData = function(champLine) {
        var path = champLine.selectAll("path");
        if (path) {
            path.remove();
        }
        path = champLine.append("path");
        path.attr("class", function (d) {
                return "line " + d.id;
            })
            .attr("d", function (d) {
                return line(d.values);
            });
    };

    BRG.ARENA.appendGraphDataLabels = function (champLine) {
        var championLabels = champLine.selectAll("text");
        if (championLabels) {
            championLabels.remove();
        }
        championLabels = champLine.append("text");
        championLabels
            .datum(function (d) {
                return {id: d.id, value: d.values[d.values.length - 1]};
            })
            .attr("transform", function (d) {
                return "translate(" + scaleX(d.value.date) + "," + scaleY(d.value.score) + ")";
            })
            .attr("x", 3)
            .attr("dy", "0.35em")
            .style("font", "10px sans-serif")
            .text(function (d) {
                return d.id;
            });
    };

    ////////////////////////////////////////////////////////////////////////////

    BRG.ARENA.dataForD3 = null;
    BRG.ARENA.jsonData = null;
    var champLines;

    d3.json("arena.json", function (error, jsonData) {
        if (error) { throw error; }
        BRG.ARENA.jsonData = jsonData.reverse();
        updateAll();
    });

    BRG.ARENA.updateXBounds = function(min, max) {
        BRG.ARENA.CONFIG.dateIndexMin = min;
        BRG.ARENA.CONFIG.dateIndexMax = max;
        updateAll();
    };

    BRG.ARENA.updateYBounds = function(min, max) {
        BRG.ARENA.CONFIG.pointsMin = min;
        BRG.ARENA.CONFIG.pointsMax = max;
        updateAll();
    };

    BRG.ARENA.updateAll = updateAll;
    function updateAll() {
        BRG.ARENA.dataForD3 = BRG.ARENA.formatJsonForD3(BRG.ARENA.jsonData);
        BRG.ARENA.updateTimeDisplay();
        BRG.ARENA.hideTooltip();

        if (BRG.ARENA.CONFIG.dateIndexMin !== null && BRG.ARENA.CONFIG.dateIndexMax !== null) { //will be null until interaction with slider
            scaleX.domain([
                BRG.ARENA.getDateBasedOnIndex(BRG.ARENA.CONFIG.dateIndexMin),
                BRG.ARENA.getDateBasedOnIndex(BRG.ARENA.CONFIG.dateIndexMax)
            ]);
        } else {
            BRG.ARENA.setDomainXBasedOnData(BRG.ARENA.dataForD3);
        }

        if (BRG.ARENA.CONFIG.pointsMin !== null && BRG.ARENA.CONFIG.pointsMax !== null) { //this will always be true now...
            scaleY.domain([
                BRG.ARENA.CONFIG.pointsMin,
                BRG.ARENA.CONFIG.pointsMax
            ]);
        } else {
            BRG.ARENA.setDomainYBasedOnData(BRG.ARENA.dataForD3);
        }

        BRG.ARENA.setDomainZ(BRG.ARENA.dataForD3);

        BRG.ARENA.updateAxisX();
        BRG.ARENA.updateAxisY();

        if (champLines) {
            champLines.data(BRG.ARENA.dataForD3).exit().remove();
        } else {
            champLines = graphDataWrapper.selectAll(".champLine")
                .data(BRG.ARENA.dataForD3)
                .enter().append("g")
                .attr("class", "champLine");
        }

        BRG.ARENA.appendGraphData(champLines);
        BRG.ARENA.appendGraphDataLabels(champLines);
    }

    BRG.ARENA.updateTimeDisplay = function() {
        var start = BRG.ARENA.getDateBasedOnIndex(BRG.ARENA.CONFIG.dateIndexMin);
        var end = BRG.ARENA.getDateBasedOnIndex(BRG.ARENA.CONFIG.dateIndexMax);

        if (window.$) {
            $("#time").text(start.toLocaleDateString() + " - " + end.toLocaleDateString());
        }
    };


    BRG.ARENA.updateDetailDisplay = function(d) {
        document.getElementById('champ-date').innerHTML = d.date && d.date.toLocaleDateString();
        document.getElementById('champ-name').innerHTML = d.name && d.name || "foo";
        document.getElementById('champ-score').innerHTML = d.score && d.score.toLocaleString();

        document.getElementById('tooltip-champ-date').innerHTML = document.getElementById('champ-date').innerHTML;
        document.getElementById('tooltip-champ-name').innerHTML = document.getElementById('champ-name').innerHTML;
        document.getElementById('tooltip-champ-score').innerHTML = document.getElementById('champ-score').innerHTML;
    };

    (function() {
        //finds the closest date using a bisect search
        var bisectDate = d3.bisector(function(d) {
            return d.date;
        }).left;

        //add circle
        var focus = graphWrapper.append("g").style("display", "none");
        focus.append("circle").attr("class", "selected-data");

        //add tooltip
        var tooltipHeight = 64;
        var tooltipWidth = 600;
        focus.append("g")
            .attr("class", "tooltip-container")
            .html('<foreignObject class="node" width="' + tooltipWidth + '" height="' + tooltipHeight + '"><body xmlns="http://www.w3.org/1999/xhtml">' +
                '<div class="tooltip">' +
                        '<span id="tooltip-champ-date"></span><br>' +
                        '<span id="tooltip-champ-name"></span><br>' +
                        '<span id="tooltip-champ-score"></span>' +
                '</div>' +
                '</body></foreignObject>');

        BRG.ARENA.hideTooltip = function() {
            focus.style("display", "none");
        };

        //capture mouse movements
        graphWrapper.append("rect")
                .attr("width", width)
                .attr("height", height)
                .style("fill", "none")
                .style("pointer-events", "all")
                .on("mouseover", function() { focus.style("display", null); })
                .on("mouseout", function() { /*BRG.ARENA.hideTooltip()*/ })
                .on("mousemove", mousemove);

        function mousemove() {
          //determine which will be highlighted
            var x0 = scaleX.invert(d3.mouse(this)[0]),
                i = bisectDate(BRG.ARENA.dataForD3[0].values, x0, 1),
                d0 = BRG.ARENA.dataForD3[0].values[i - 1] || {},
                d1 = BRG.ARENA.dataForD3[0].values[i] || {},
                d = x0 - d0.date > d1.date - x0 ? d1 : d0;

            BRG.ARENA.updateDetailDisplay(d);

            //move the circle to the right spot
            focus.select("circle.selected-data")
                .attr("transform","translate(" + scaleX(d.date) + "," + scaleY(d.score) + ")");
            focus.select(".tooltip-container")
                .attr("transform","translate(" +
                    (scaleX(d.date) - tooltipWidth/2) + "," +
                    (scaleY(d.score) - tooltipHeight) + ")");
        }
    })();
})();

