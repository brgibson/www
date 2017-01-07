var BRG = BRG || {};

(function () {
    BRG.ARENA = BRG.ARENA || {};
    BRG.ARENA.CONFIG = {
        isShowBasic: true,
        isShowFeatured: false
    };

    var svg = d3.select("svg"),
        margin = {top: 20, right: 80, bottom: 30, left: 70},
        width = svg.attr("width") - margin.left - margin.right,
        height = svg.attr("height") - margin.top - margin.bottom,
        graphWrapper = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var parseTime = d3.timeParse("%m/%d/%Y");

    var scaleX = d3.scaleTime().range([0, width]),
        scaleY = d3.scaleLinear().range([height, 0]),
        scaleZ = d3.scaleOrdinal(d3.schemeCategory10);

    var line = d3.line()
        //.curve(d3.curveBasis)
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
                        score: getIntValue(d.scores[0])
                    };
                })
            });
        }

        return dataForD3;
    };

    BRG.ARENA.setDomainX = function(dataForD3) {
        scaleX.domain(d3.extent(dataForD3[0].values, function (d) {
            return d.date;
        }));
    };

    BRG.ARENA.setDomainY = function(dataForD3) {
        scaleY.domain([
            d3.min(dataForD3, function (c) {
                return d3.min(c.values, function (d) {
                    return d.score;
                });
            }),
            d3.max(dataForD3, function (c) {
                return d3.max(c.values, function (d) {
                    return d.score;
                });
            })
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
        path.attr("class", "line")
            .attr("d", function (d) {
                return line(d.values);
            })
            .style("stroke", function (d) {
                return scaleZ(d.id);
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
                return {id: d.id, value: d.values[0]};
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
    var champLabels;

    d3.json("arena.json", function (error, jsonData) {
        if (error) { throw error; }
        BRG.ARENA.jsonData = jsonData;
        updateAll();
    });

    BRG.ARENA.updateXBounds = function(min, max) {
        updateAll(min, max, null, null);
    };

    BRG.ARENA.updateYBounds = function(min, max) {
        updateAll(null, null, min, max);
    };

    function updateAll(minX, maxX, minY, maxY) {
        BRG.ARENA.dataForD3 = BRG.ARENA.formatJsonForD3(BRG.ARENA.jsonData);

        if (minX && maxX) {
            scaleX.domain([
                minX,
                maxX
            ]);
        } else {
            BRG.ARENA.setDomainX(BRG.ARENA.dataForD3);
        }

        if (minY && maxY) {
            scaleY.domain([
                minY,
                maxY
            ]);
        } else {
            BRG.ARENA.setDomainY(BRG.ARENA.dataForD3);
        }

        BRG.ARENA.setDomainZ(BRG.ARENA.dataForD3);

        BRG.ARENA.updateAxisX();
        BRG.ARENA.updateAxisY();

        if (champLines) {
            champLines.data(BRG.ARENA.dataForD3).exit().remove();

            // var thing =     champLines.data(BRG.ARENA.dataForD3);
            // var thing2 = thing.exit();
            // var thing3 = thing2.remove();

        } else {
            // champLines = graphWrapper.selectAll(".champLine").order().data(BRG.ARENA.dataForD3).order();
            // champLines = champLines.exit().remove();

            // BRG.ARENA.removeGraphData(champLines);

            champLines = graphWrapper.selectAll(".champLine").order()
                .data(BRG.ARENA.dataForD3).order()
                .enter().append("g")
                .attr("class", "champLine");
        }

        // champLines.exit().remove();

        BRG.ARENA.appendGraphData(champLines);
        // BRG.ARENA.removeGraphData(champLines);
        BRG.ARENA.appendGraphDataLabels(champLines);
    }
})();