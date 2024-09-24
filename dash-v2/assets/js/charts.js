// Map Chart Function
function MapChart(renderingEl, data) {
    // Data
    var groupData = data;
    // Create root and chart
    var root = am5.Root.new(renderingEl);

    root._logo.dispose();
    // Set themes
    root.setThemes([
        am5themes_Animated.new(root)
    ]);

    // Create tooltip
    var tooltip = am5.Tooltip.new(root, {
        //pointerOrientation: "horizontal", // Ensure the tooltip is positioned horizontally
        getFillFromSprite: false, // Prevent tooltip from inheriting color from sprite
        background: am5.RoundedRectangle.new(root, {
            fill: am5.color(0xFFFFFF), // White background
            shadowColor: am5.color(0xE2E2E2), // Shadow color (light gray)
            shadowBlur: 8, // Blur effect of the shadow
            shadowOffsetX: 0, // Horizontal offset of the shadow
            shadowOffsetY: 0, // Vertical offset of the shadow
        })
    });

    // Apply corner radius to the tooltip background
    tooltip.get("background").set("cornerRadiusTL", 2);
    tooltip.get("background").set("cornerRadiusTR", 2);
    tooltip.get("background").set("cornerRadiusBL", 2);
    tooltip.get("background").set("cornerRadiusBR", 2);

    // Set label properties after tooltip creation
    tooltip.label.setAll({
        paddingLeft: 0,
        paddingRight: 0,
        paddingTop: 0,
        paddingBottom: 0,
        textAlign: "left", // Align text to the left
        fill: am5.color(0x344054), // Text color (dark gray)
        fontSize: "0.75rem", // Font size
        fontFamily: "'Poppins', sans-serif", // Font family
        lineHeight: 0,
    });
    // Create chart
    var chart = root.container.children.push(am5map.MapChart.new(root, {
        homeZoomLevel: 1,
        homeGeoPoint: {
            longitude: 0,
            latitude: 40
        }
    }));
    // Create world polygon series
    var worldSeries = chart.series.push(am5map.MapPolygonSeries.new(root, {
        geoJSON: am5geodata_worldLow,
        exclude: ["AQ"]
    }));
    worldSeries.mapPolygons.template.setAll({
        fill: am5.color(0xD0D5DD)
    });
    worldSeries.events.on("datavalidated", () => {
        chart.goHome();
    });
    // Create series for each group
    var colors = am5.ColorSet.new(root, {
        step: 1
    });
    colors.next();
    am5.array.each(groupData, function(group) {
        var countries = [];
        var color = group.color; // This can be removed if you are using the color from group data
        am5.array.each(group.data, function(country) {
            countries.push(country.id);
        });
        var polygonSeries = chart.series.push(am5map.MapPolygonSeries.new(root, {
            geoJSON: am5geodata_worldLow,
            include: countries,
            name: group.name,
            fill: group.color // Use the color variable here if needed
        }));
        // Set default fill color based on the country data
        am5.array.each(group.data, function(country) {
            polygonSeries.mapPolygons.template.set("fill", am5.color(group.color)); // Set fill color from country data
        });
        // Ensure the US polygon is rendered with the correct color
        polygonSeries.data.setAll(group.data);
        polygonSeries.mapPolygons.template.setAll({
            //fill: am5.color(group.color),
            //stroke: am5.color(0xD0D5DD),// Set default fill color
            tooltip: tooltip, // Use the custom tooltip
            tooltipText: "[font color='#344054'][fontSize:12px]{name}[/]\t [font color='#344054'][fontSize:12px fontWeight:600]USD {sales}",
            //interactive: true,
            //strokeWidth: .75,
        });
        polygonSeries.mapPolygons.template.states.create("hover", {
            fill: am5.color("#" + (
                (1 << 24) +
                (Math.max(0, parseInt(group.color.slice(1, 3), 16) - 30) << 16) +
                (Math.max(0, parseInt(group.color.slice(3, 5), 16) - 30) << 8) +
                (Math.max(0, parseInt(group.color.slice(5, 7), 16) - 30))
            ).toString(16).slice(1)), // Darken the original color
            transitionDuration: 200 // Duration of the transition in milliseconds
        });
        polygonSeries.mapPolygons.template.events.on("pointerover", function(ev) {
            ev.target.series.mapPolygons.each(function(polygon) {
                polygon.states.applyAnimate("hover");
            });
        });
        polygonSeries.mapPolygons.template.events.on("pointerout", function(ev) {
            ev.target.series.mapPolygons.each(function(polygon) {
                polygon.states.applyAnimate("default");
            });
        });
        // Do not add the legend if you want to hide it
        // legend.data.push(polygonSeries);
    });
}

// Bar Chart Main Function for Sales Insight
function BarChart(renderingEl, data) {
    // Create root element
    var root = am5.Root.new(renderingEl);

    root._logo.dispose();

    // Set themes
    root.setThemes([
        am5themes_Animated.new(root)
    ]);

    // Create chart
    var chart = root.container.children.push(am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        wheelX: "none",
        wheelY: "none",
        maxTooltipDistance: 1,
        paddingLeft: 0,
        paddingRight: 0,
        paddingBottom: 0,
        paddingTop: 0,
    }));

    // Create tooltip
    var tooltip = am5.Tooltip.new(root, {
        pointerOrientation: "horizontal", // Ensure the tooltip is positioned horizontally
        background: am5.RoundedRectangle.new(root, {
            fill: am5.color(0xFFFFFF), // White background
            shadowColor: am5.color(0xE2E2E2), // Shadow color (black)
            shadowBlur: 8, // Blur effect of the shadow
            shadowOffsetX: 0, // Horizontal offset of the shadow
            shadowOffsetY: 0, // Vertical offset of the shadow
        })
    });

    // Apply corner radius to the tooltip background
    tooltip.get("background").set("cornerRadiusTL", 2);
    tooltip.get("background").set("cornerRadiusTR", 2);
    tooltip.get("background").set("cornerRadiusBL", 2);
    tooltip.get("background").set("cornerRadiusBR", 2);

    // Set label properties after tooltip creation
    tooltip.label.setAll({
        paddingLeft: 0,
        paddingRight: 0,
        paddingTop: 0,
        paddingBottom: 0,
        textAlign: "left", // Align text to the left
        fill: am5.color(0x344054), // Text color (black)
        fontSize: "0.75rem", // Font size
        fontFamily: "'Poppins', sans-serif", // Font family
        lineHeight: 1.4,
    });

    // Assign CSS class to the tooltip
    tooltip.get("background").set("cssClass", "custom-tooltip");

    chart.plotContainer.set("tooltipPosition", "pointer");
    chart.plotContainer.set("tooltipText", "a");
    chart.plotContainer.set("tooltip", tooltip);

    // Mapping of abbreviated month names to full month names
    var monthMapping = {
        "Jan": "JANUARY",
        "Feb": "FEBRUARY",
        "Mar": "MARCH",
        "Apr": "APRIL",
        "May": "MAY",
        "Jun": "JUNE",
        "Jul": "JULY",
        "Aug": "AUGUST",
        "Sep": "SEPTEMBER",
        "Oct": "OCTOBER",
        "Nov": "NOVEMBER",
        "Dec": "DECEMBER"
    };

    // Add cursor
    var cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
        behavior: "none"
    }));
    cursor.lineY.set("visible", false);
    cursor.lineX.set("visible", false);

    // Updated data with months
    var data = data;

    // Create axes
    var xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
        categoryField: renderingEl.dataset.chartCategoryXField, // reading month, day, year, week etc, from dataset
        renderer: am5xy.AxisRendererX.new(root, {
            minGridDistance: 30
        }),
        // Disable the tooltip on the category axis
        //tooltip: am5.Tooltip.new(root, {
        //visible: false
        //})
    }));

    xAxis.data.setAll(data);

    xAxis.get("renderer").labels.template.setAll({
        fontSize: "0.75rem", // Set the font size for X-axis labels
        fill: am5.color(0x475467), // Text color (black)
    });

    var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {}),
        min: 0, // Minimum value on the Y-axis
        max: 1000, // Maximum value on the Y-axis
        strictMinMax: true // Enforce min and max values
    }));

    // Create Y-axis (left axis)
    yAxis.get("renderer").labels.template.setAll({
        fontSize: "0.75rem", // Set the font size for Y-axis labels
        fill: am5.color(0x475467), // Text color (black)
    });


    // Add series
    function makeSeries(name, fieldName, color) {
        var series = chart.series.push(am5xy.ColumnSeries.new(root, {
            name: name,
            stacked: true,
            xAxis: xAxis,
            yAxis: yAxis,
            valueYField: fieldName,
            categoryXField: renderingEl.dataset.chartCategoryXField, // reading month, day, year, week etc, from dataset
            fill: am5.color(color),
            stroke: am5.color(color)
        }));

        series.columns.template.setAll({
            width: am5.percent(25), // Adjust the width of the bars (narrower than before)
            fill: am5.color(color),
            stroke: am5.color(color)
        });

        series.data.setAll(data);
        series.appear();
    }

    //Y-Axis Grid Removed
    yAxis.get("renderer").grid.template.setAll({
        stroke: am5.color(0xf2f4f7),
        strokeOpacity: 1
    });

    //X-Axis Grid Removed
    xAxis.get("renderer").grid.template.setAll({
        stroke: am5.color(0xf2f4f7)
    });

    // if 'renderingEl' is 'salesInsight' and 'data-chart-timeframes' is 'month', 'week', 'day'
    if (renderingEl.dataset.chartName === 'salesInsight' && (renderingEl.dataset.chartTimeframes === 'month' || renderingEl.dataset.chartTimeframes === 'week' || renderingEl.dataset.chartTimeframes === 'day')) {
        makeSeries("Subscription", "subscription", 0x4CC9F0);
        makeSeries("Pay to view", "paytoview", 0x4361EE);
        makeSeries("Merch", "merch", 0x3A0BA3);
        makeSeries("Wishtender", "wishtender", 0xF72485);
        makeSeries("Custom request", "customrequest", 0x98A2B3);
    }

    // if 'renderingEl' is 'tokenInsight' and 'data-chart-timeframes' is 'month', 'week', 'day'
    if (renderingEl.dataset.chartName === 'tokenInsight' && (renderingEl.dataset.chartTimeframes === 'month' || renderingEl.dataset.chartTimeframes === 'week' || renderingEl.dataset.chartTimeframes === 'day')) {
        makeSeries("Tip", "tip", 0x4CC9F0);
        makeSeries("Call", "call", 0x4361EE);
        makeSeries("Chat", "chat", 0x3A0BA3);
        makeSeries("Live streaming", "livestreaming", 0xF72585);
    }

    // Calculate total values for each month and format tooltip text
    tooltip.label.adapters.add("text", function(text, target) {
        text = "";
        var total = 0;
        var i = 0;
        var xAxisLabel = "";
        var year = "";

        chart.series.each(function(series) {
            var tooltipDataItem = series.get("tooltipDataItem");
            if (tooltipDataItem) {
                total += tooltipDataItem.get("valueY");
                if (i == 0) {
                    xAxisLabel = tooltipDataItem.get("categoryX");
                    year = tooltipDataItem.dataContext ? tooltipDataItem.dataContext.year : ""; // Get the year from the data context
                }
                if (i != 0) {
                    text += "\n";
                }
                text += '[' + series.get("fill").toString() + ' width:12px height:12px fontSize: 16px]●[/] [fontWeight:normal width:120px]' + series.get("name") + '[/] [font color="#101828"][fontWeight:600 width:0px] USD ' + tooltipDataItem.get("valueY") + '[/]';
            }
            i++;
        });

        // Replace abbreviated month name with full month name
        var fullMonthName = monthMapping[xAxisLabel] || xAxisLabel;

        // Add x-axis label with year at the top
        text = "[font color='#667085'][bold]" + fullMonthName + " " + year + "[/]\n" + text;

        // Add total value with a line above it
        text += "\n[font color='#D0D5DD']───────────────────────[/font]\n[fontWeight:normal width:135px height: 0px][font color='#667085'] Total Earnings[/font][/] [bold width:0px] USD " + total + "[/]";
        return text;
    });

    // Add scrollbar
    chart.set("scrollbarX", am5.Scrollbar.new(root, {
        orientation: "horizontal",
        visible: false,
    }));

    // Make stuff animate on load
    chart.appear(1000, 100);
}

// Bar Chart Main Function for Sales Trend
function SmoothLineChart(renderingEl, data) {
    // Create root element
    var root = am5.Root.new(renderingEl);
    root._logo.dispose();

    // Create chart
    var chart = root.container.children.push(am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        wheelX: "none",
        wheelY: "none",
        pinchZoomX: false,
        paddingLeft: 0,
        paddingRight: 0,
        paddingBottom: 0,
        paddingTop: 0,
        maxTooltipDistance: 0
    }));

    // Add cursor
    var cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
        behavior: "none"
    }));
    cursor.lineY.set("visible", false);
    cursor.lineX.set("visible", false);

    // Static data with short month names for xAxis and full month names in uppercase for tooltips
    var staticValues = data;

    // Create axes
    var xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
        categoryField: renderingEl.dataset.chartCategoryXField, // reading month, day, year, week etc, from dataset
        renderer: am5xy.AxisRendererX.new(root, {
            minGridDistance: 30
        })
    }));
    xAxis.data.setAll(staticValues); // Set the X-axis categories as the months
    xAxis.get("renderer").labels.template.setAll({
        fontSize: "0.75rem", // Set the font size for X-axis labels
        fill: am5.color(0x475467), // Text color
    });

    var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {})
    }));
    yAxis.get("renderer").labels.template.setAll({
        visible: false,
        paddingLeft: 0,
    });

    // Function to add series with debugging and tooltips
    function addSeries(name, fieldName, color) {
        var series = chart.series.push(am5xy.SmoothedXLineSeries.new(root, {
            name: name,
            xAxis: xAxis,
            yAxis: yAxis,
            valueYField: fieldName,
            categoryXField: renderingEl.dataset.chartCategoryXField, // reading month, day, year, week etc, from dataset
            stroke: color,
            tooltip: am5.Tooltip.new(root, {
                label: {
                    fill: am5.color(0x000000), // Set text color to black
                    lineHeight: 1.8
                },
                labelText: "[font color='#667085' fontFamily: 'Poppins' fontWeight:600 fontSize: .75rem]{fullMonth} {year.formatNumber('#')}[/]\n[font color='{stroke}' fontSize: 16px]● [/][font color='#344054' fontFamily: 'Poppins' fontWeight:400 fontSize: .75rem]{name}\t\t\t[/][font color='#101828' fontFamily: 'Poppins' fontWeight:500 fontSize: .75rem]USD {valueY}[/]", // Custom tooltip 

                getFillFromSprite: false, // Prevent inheriting color from the series
                pointerOrientation: "horizontal", // Ensure the tooltip is positioned horizontally
                tooltipPosition: "pointer", // Fix the tooltip position
                background: am5.RoundedRectangle.new(root, {
                    fill: am5.color(0xFFFFFF), // White background
                    cornerRadiusTL: 0,
                    cornerRadiusTR: 0,
                    cornerRadiusBL: 0,
                    cornerRadiusBR: 0,
                    shadowColor: am5.color(0xE2E2E2, 0.08), // Shadow color with opacity
                    shadowBlur: 8,
                    shadowOffsetX: 0,
                    shadowOffsetY: 0
                })
            })
        }));

        series.strokes.template.setAll({
            strokeWidth: 3,
            stroke: color
        });

        // Ensure the tooltip references the correct stroke color
        series.get("tooltip").label.adapters.add("text", function(text, target) {
            return text.replace("{stroke}", am5.color(color).toCSSHex());
        });

        // Create a bullet template
        var bulletTemplate = am5.Template.new({});

        // Add bullet to the series
        series.bullets.push(function() {
            return am5.Bullet.new(root, {
                sprite: am5.Circle.new(root, {
                    radius: 5,
                    fill: color,
                    opacity: 0 // Start with invisible bullet
                }, bulletTemplate)
            });
        });

        // Show bullet when tooltip is shown
        series.events.on("tooltipshownat", function(ev) {
            var dataItem = ev.target.get("tooltipDataItem");
            var bullet = dataItem.bullets[0];
            if (bullet && bullet.get("sprite")) {
                bullet.get("sprite").set("opacity", 1); // Make bullet visible
            }
        });

        // Hide bullet when tooltip is hidden
        series.events.on("tooltiphiddenat", function(ev) {
            var dataItem = ev.target.get("tooltipDataItem");
            if (dataItem) {
                var bullet = dataItem.bullets[0];
                if (bullet && bullet.get("sprite")) {
                    bullet.get("sprite").set("opacity", 0); // Make bullet invisible
                }
            }
        });

        series.data.setAll(staticValues);
        series.appear(1000);
    }

    // Add series with explicit colors
    // if 'renderingEl' is 'salesTrend' and 'data-chart-timeframes' is 'month', 'week', 'day'
    if ( renderingEl.dataset.chartName === 'salesTrend' && (renderingEl.dataset.chartTimeframes === 'month' || renderingEl.dataset.chartTimeframes === 'week' || renderingEl.dataset.chartTimeframes === 'day') ) {
        addSeries("Subscription", "subscription", am5.color(0x4CC9F0));
        addSeries("Pay to view", "paytoview", am5.color(0x4361EE));
        addSeries("Merch", "merch", am5.color(0x3A0BA3));
        addSeries("Wishtender", "wishtender", am5.color(0xF72585));
        addSeries("Custom request", "customrequest", am5.color(0x98A2B3));
    }

    // if 'renderingEl' is 'tokenTrend' and 'data-chart-timeframes' is 'month', 'week', 'day'
    if ( renderingEl.dataset.chartName === 'tokenTrend' && (renderingEl.dataset.chartTimeframes === 'month' || renderingEl.dataset.chartTimeframes === 'week' || renderingEl.dataset.chartTimeframes === 'day') ) {
        addSeries("Tip", "tip", am5.color(0x4CC9F0));
        addSeries("Call", "call", am5.color(0x4361EE));
        addSeries("Chat", "chat", am5.color(0x3A0BA3));
        addSeries("Live Streaming", "livestreaming", am5.color(0xF72585));
    }

    //Y-Axis Grid Removed
    yAxis.get("renderer").grid.template.setAll({
        stroke: am5.color(0xf2f4f7),
        strokeOpacity: 1
    });

    // Remove X-Axis Grid
    xAxis.get("renderer").grid.template.setAll({
        stroke: am5.color(0xf2f4f7)
    });

    // Add scrollbar
    chart.set("scrollbarX", am5.Scrollbar.new(root, {
        orientation: "horizontal",
        visible: false
    }));

    // Animate chart on load
    chart.appear(1000, 100);

}