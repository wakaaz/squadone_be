!function(r) {
    "use strict";
    var a=function() {
        this.$body=r("body"),
        this.charts=[]
    }
    ;
    a.prototype.respChart=function(a, t, e, o) {
        var n=Chart.controllers.line.prototype.draw;
        Chart.controllers.line.prototype.draw=function() {
            n.apply(this, arguments);
            var r=this.chart.chart.ctx,
            a=r.stroke;
            r.stroke=function() {
                r.save(),
                r.shadowColor="rgba(0,0,0,0.01)",
                r.shadowBlur=20,
                r.shadowOffsetX=0,
                r.shadowOffsetY=5,
                a.apply(this, arguments),
                r.restore()
            }
        }
        ;
        var s=Chart.controllers.doughnut.prototype.draw;
        Chart.controllers.doughnut=Chart.controllers.doughnut.extend( {
            draw:function() {
                s.apply(this, arguments);
                var r=this.chart.chart.ctx, a=r.fill;
                r.fill=function() {
                    r.save(), r.shadowColor="rgba(0,0,0,0.03)", r.shadowBlur=4, r.shadowOffsetX=0, r.shadowOffsetY=3, a.apply(this, arguments), r.restore()
                }
            }
        }
        );
        var l=Chart.controllers.bar.prototype.draw;
        Chart.controllers.bar=Chart.controllers.bar.extend( {
            draw:function() {
                l.apply(this, arguments);
                var r=this.chart.chart.ctx, a=r.fill;
                r.fill=function() {
                    r.save(), r.shadowColor="rgba(0,0,0,0.01)", r.shadowBlur=20, r.shadowOffsetX=4, r.shadowOffsetY=5, a.apply(this, arguments), r.restore()
                }
            }
        }
        ),
        Chart.defaults.global.defaultFontColor="#8391a2",
        Chart.defaults.scale.gridLines.color="#8391a2";
        var i=a.get(0).getContext("2d"),
        d=r(a).parent();
        return function() {
            var n;
            switch(a.attr("width", r(d).width()), t) {
                case"Line":n=new Chart(i, {
                    type: "line", data: e, options: o
                }
                );
                break;
                case"Doughnut":n=new Chart(i, {
                    type: "doughnut", data: e, options: o
                }
                );
                break;
                case"Pie":n=new Chart(i, {
                    type: "pie", data: e, options: o
                }
                );
                break;
                case"Bar":n=new Chart(i, {
                    type: "bar", data: e, options: o
                }
                );
                break;
                case"Radar":n=new Chart(i, {
                    type: "radar", data: e, options: o
                }
                );
                break;
                case"PolarArea":n=new Chart(i, {
                    data: e, type: "polarArea", options: o
                }
                )
            }
            return n
        }
        ()
    }
    ,
    a.prototype.initCharts=function() {
        var a=[];
        if(r("#line-chart-example").length>0) {
            a.push(this.respChart(r("#line-chart-example"), "Line", {
                labels:["First Week", "Second Week", "Third Week", "Fourth Week","Fifth Week"], datasets:[ {
                    label: "Current Week", backgroundColor: "transparent", borderColor: "#0c397a", data: [32, 42, 42, 62, 52]
                }
                , {
                    label: "Previous Week", fill: !0, backgroundColor: "transparent", borderColor: "#fbd536", borderDash: [5, 5], data: [42, 58, 66, 93, 82]
                }
                ]
            }
            , {
                maintainAspectRatio:!1, legend: {
                    display: !1
                }
                , tooltips: {
                    intersect: !1
                }
                , hover: {
                    intersect: !0
                }
                , plugins: {
                    filler: {
                        propagate: !1
                    }
                }
                , scales: {
                    xAxes:[ {
                        reverse:!0, gridLines: {
                            color: "rgba(0,0,0,0.05)"
                        }
                    }
                    ], yAxes:[ {
                        ticks: {
                            stepSize: 20
                        }
                        , display:!0, borderDash:[5, 5], gridLines: {
                            color: "rgba(0,0,0,0)", fontColor: "#fff"
                        }
                    }
                    ]
                }
            }
            ))
        }
        if(r("#bar-chart-example").length>0) {
            var t=document.getElementById("bar-chart-example").getContext("2d").createLinearGradient(0, 40, 0, 100);
            t.addColorStop(0, "#fbd439"),
            t.addColorStop(1, "#0c397a");
			
            var e= {
                labels:["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], 
                datasets:[ {
                    label: "Booked Shippments", backgroundColor: t, borderColor: t, hoverBackgroundColor: t, hoverBorderColor: t, data: [89, 59, 80, 81, 56, 89, 50, 32, 65, 59, 80, 41]
                }
                ,
                {
                    label: "Deliverd Shippments", backgroundColor: "#e3eaef", borderColor: "#e3eaef", hoverBackgroundColor: "#fbd439", hoverBorderColor: "#fbd439", data: [65, 40, 32, 65, 59, 80, 41, 56, 89, 40, 65, 59]
                }
                ]
            }
            ;
            a.push(this.respChart(r("#bar-chart-example"), "Bar", e, {
                maintainAspectRatio:!1, legend: {
                    display: !1
                }
                , scales: {
                    yAxes:[ {
                        gridLines: {
                            display: !1, color: "rgba(0,0,0,0.05)"
                        }
                        , stacked:!1, ticks: {
                            stepSize: 20
                        }
                    }
                    ], xAxes:[ {
                        barPercentage:.7, categoryPercentage:.5, stacked:!1, gridLines: {
                            color: "rgba(0,0,0,0.04)"
                        }
                    }
                    ]
                }
            }
            ))
        }
		
        if(r("#donut-chart-example").length>0) {
            a.push(this.respChart(r("#donut-chart-example"), "Doughnut", {
                labels:["Direct", "Affilliate", "Sponsored", "E-mail"], datasets:[ {
                    data: [300, 135, 48, 154], backgroundColor: ["#727cf5", "#fa5c7c", "#0acf97", "#ebeff2"], borderColor: "transparent", borderWidth: "3"
                }
                ]
            }
            , {
                maintainAspectRatio:!1, cutoutPercentage:60, legend: {
                    display: !1
                }
            }
            ))
        }
        if(r("#radar-chart-example").length>0) {
            a.push(this.respChart(r("#radar-chart-example"), "Radar", {
                labels:["Eating", "Drinking", "Sleeping", "Designing", "Coding", "Cycling", "Running"], datasets:[ {
                    label: "Desktops", backgroundColor: "rgba(57,175,209,0.2)", borderColor: "#39afd1", pointBackgroundColor: "#39afd1", pointBorderColor: "#fff", pointHoverBackgroundColor: "#fff", pointHoverBorderColor: "#39afd1", data: [65, 59, 90, 81, 56, 55, 40]
                }
                , {
                    label: "Tablets", backgroundColor: "rgba(161, 127, 224,0.2)", borderColor: "#a17fe0", pointBackgroundColor: "#a17fe0", pointBorderColor: "#fff", pointHoverBackgroundColor: "#fff", pointHoverBorderColor: "#a17fe0", data: [28, 48, 40, 19, 96, 27, 100]
                }
                ]
            }
            , {
                maintainAspectRatio: !1
            }
            ))
        }
        return a
    }
    ,
    a.prototype.init=function() {
        var a=this;
        Chart.defaults.global.defaultFontFamily='-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
        a.charts=this.initCharts(),
        r(window).on("resize", function(t) {
            r.each(a.charts, function(r, a) {
                try {
                    a.destroy()
                }
                catch(r) {}
            }
            ), a.charts=a.initCharts()
        }
        )
    }
    ,
    r.ChartJs=new a,
    r.ChartJs.Constructor=a
}

(window.jQuery),
function(r) {
    "use strict";
    r.ChartJs.init()
}

(window.jQuery);



 