var BRG = BRG || {};

(function () {
    BRG.ARENA = BRG.ARENA || {};

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
            return scaleY(d.temperature);
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
    var path;

    BRG.ARENA.formatJsonForD3 = function(data) {
        return [
            {
                id: "Featured",
                values: data.map(function (d) {
                    return {
                        date: parseTime(d.date),
                        temperature: getIntValue(d.scores[0])
                    };
                })
            },
            {
                id: "Basic",
                values: data.map(function (d) {
                    return {
                        date: parseTime(d.date),
                        temperature: getIntValue(d.scores[1])
                    };
                })
            }
        ];
    };

    BRG.ARENA.setDomainX = function(cities) {
        scaleX.domain(d3.extent(cities[0].values, function (d) {
            return d.date;
        }));
    };

    BRG.ARENA.setDomainY = function(cities) {
        scaleY.domain([
            d3.min(cities, function (c) {
                return d3.min(c.values, function (d) {
                    return d.temperature;
                });
            }),
            d3.max(cities, function (c) {
                return d3.max(c.values, function (d) {
                    return d.temperature;
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
            //            .attr("fill", "#fff")
            .text("Points");
    };

    BRG.ARENA.appendGraphData = function(champLine) {
        if (!path) {
            path = champLine.append("path");
        }
        path.attr("class", "line")
            .attr("d", function (d) {
                return line(d.values);
            })
            .style("stroke", function (d) {
                return scaleZ(d.id);
            });
    };

    BRG.ARENA.appendGraphDataLabels = function (champLine) {
        champLine.append("text")
            .datum(function (d) {
                return {id: d.id, value: d.values[0]};
            })
            .attr("transform", function (d) {
                return "translate(" + scaleX(d.value.date) + "," + scaleY(d.value.temperature) + ")";
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

        if (error) {
            throw error;
        }

        BRG.ARENA.jsonData = jsonData;
        BRG.ARENA.dataForD3 = BRG.ARENA.formatJsonForD3(BRG.ARENA.jsonData);

        BRG.ARENA.setDomainX(BRG.ARENA.dataForD3);
        BRG.ARENA.setDomainY(BRG.ARENA.dataForD3);
        BRG.ARENA.setDomainZ(BRG.ARENA.dataForD3);

        BRG.ARENA.updateAxisX();
        BRG.ARENA.updateAxisY();

        champLines = graphWrapper.selectAll(".champLine")
            .data(BRG.ARENA.dataForD3)
            .enter().append("g")
            .attr("class", "champLine");

        BRG.ARENA.appendGraphData(champLines);
        BRG.ARENA.appendGraphDataLabels(champLines);
    });

    BRG.ARENA.updateXBounds = function(min, max) {
        updateAll(min, max, null, null);
    };

    BRG.ARENA.updateYBounds = function(min, max) {
        updateAll(null, null, min, max);
    };

    function updateAll(minX, maxX, minY, maxY) {
        var cities = BRG.ARENA.formatJsonForD3(BRG.ARENA.jsonData);

        if (minX && maxX) {
            scaleX.domain([
                minX,
                maxX
            ]);
        }

        if (minY && maxY) {
            scaleY.domain([
                minY,
                maxY
            ]);
        }

        BRG.ARENA.setDomainZ(cities);

        BRG.ARENA.updateAxisX();
        BRG.ARENA.updateAxisY();

        champLines = graphWrapper.selectAll(".champLine")
            .data(cities)
            .enter().append("g")
            .attr("class", "champLine");

        BRG.ARENA.appendGraphData(champLines);
        BRG.ARENA.appendGraphDataLabels(champLines);
    }
})();