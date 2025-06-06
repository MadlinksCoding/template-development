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

// Bar Chart Main Function
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

    // Create Default Tooltip Settings
    var defaultTooltipSettings = { preText: "USD", totalText: "Total Earnings", showTotal: true, };
    // Get tooltip settings from data attribute or use default values /* Added by NayHtetSoe 15/11/2024. task link: https://app.clickup.com/t/86eq9wnxg */
    var tooltipSettings = renderingEl.dataset.chartTooltip ? JSON.parse(renderingEl.dataset.chartTooltip): defaultTooltipSettings;

    // combine default and custom tooltip settings
    tooltipSettings = { ...defaultTooltipSettings, ...tooltipSettings };

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
            minGridDistance: renderingEl.dataset.chartTimeframes === 'day' ? 0 : 30 // Reduce the minimum grid distance to show all labels
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

    // Custom label formatting for day timeframe /* Added by NayHtetSoe 18/11/2024. task link: https://app.clickup.com/t/86eq96d7j */
    if (renderingEl.dataset.chartTimeframes === 'day') {
        // Show only specific x-axis labels (1, 5, 10, 15, 20, 25, 30)
        xAxis.get("renderer").labels.template.adapters.add("visible", function(visible, target) {
            if (target.dataItem) {

                var category = target.dataItem.get("category");
                var date = new Date(category);
                var day = date.getDate();
                return [1, 5, 10, 15, 20, 25, 30].includes(day);
            }
            return visible;
        });

        // Set default paddingRight to chart // NayHtetSoe 02/12/2024. task link: https://app.clickup.com/t/86eq96d7j
        chart.set("paddingRight", 20);
    }

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
        makeSeries("Pay to view", "payToView", 0x4361EE);
        makeSeries("Merch", "merch", 0x3A0BA3);
        makeSeries("Wishtender", "wishTender", 0xF72485);
        makeSeries("Custom request", "customRequest", 0x98A2B3);
    }

    // if 'renderingEl' is 'tokenInsight' and 'data-chart-timeframes' is 'month', 'week', 'day'
    if (renderingEl.dataset.chartName === 'tokenInsight' && (renderingEl.dataset.chartTimeframes === 'month' || renderingEl.dataset.chartTimeframes === 'week' || renderingEl.dataset.chartTimeframes === 'day')) {
        makeSeries("Tip", "tip", 0x4CC9F0);
        makeSeries("Call", "call", 0x4361EE);
        makeSeries("Chat", "chat", 0x3A0BA3);
        makeSeries("Live streaming", "liveStreaming", 0xF72585);
    }

    // if 'renderingEl' is 'salesInsight' and 'data-chart-timeframes' is 'month', 'week', 'day'
    if (renderingEl.dataset.chartName === 'fansInsight' && (renderingEl.dataset.chartTimeframes === 'month' || renderingEl.dataset.chartTimeframes === 'week' || renderingEl.dataset.chartTimeframes === 'day')) {
        makeSeries("New Followers", "newFollowers", 0x4CC9F0);
        makeSeries("Profile visit", "profileVisit", 0x4361EE);
    }

    // if 'renderingEl' is 'subscriptionInsight' and 'data-chart-timeframes' is 'month', 'week', 'day'
    if (renderingEl.dataset.chartName === 'subscriptionInsight' && (renderingEl.dataset.chartTimeframes === 'month' || renderingEl.dataset.chartTimeframes === 'week' || renderingEl.dataset.chartTimeframes === 'day')) {
        makeSeries("New", "newSubscriber", 0x4CC9F0);
        makeSeries("Recurring", "recurringSubscriber", 0x4361EE);
    }

    // if 'renderingEl' is 'tiersBreakdownInsight' and 'data-chart-timeframes' is 'month', 'week', 'day'
    if (renderingEl.dataset.chartName === 'tiersBreakdownInsight' && (renderingEl.dataset.chartTimeframes === 'month' || renderingEl.dataset.chartTimeframes === 'week' || renderingEl.dataset.chartTimeframes === 'day')) {
        makeSeries("Free", "free", 0x4CC9F0);
        makeSeries("Tier 1", "tier1", 0x4361EE);
        makeSeries("Tier 2", "tier2", 0x3A0BA3);
        makeSeries("Tier 3", "tier3", 0xAE4AEF);
        makeSeries("Tier 4", "tier4", 0x98A2B3);
        makeSeries("Tier 5", "tier5", 0xF72485);
    }

    // Calculate total values for each month and format tooltip text
    tooltip.label.adapters.add("text", function(text, target) {
        text = "";
        var total = 0;
        var i = 0;
        var xAxisLabel = "";
        var year = "";

        // Hide tooltip if the pointer is not over the chart /* Added by NayHtetSoe 12/11/2024 */
        if (!target.root.dom.classList.contains("amcharts-tooltip-visible")) {
            // Hide the tooltip
            tooltip.hide();
        }

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
                text += '[' + series.get("fill").toString() + ' width:12px height:12px fontSize: 16px]●[/] [fontWeight:normal width:120px]' + series.get("name") + '[/] [font color="#101828"][fontWeight:600 width:0px] ' + tooltipSettings.preText + ' ' + tooltipDataItem.get("valueY") + '[/]';
            }
            i++;
        });

        // Replace abbreviated month name with full month name
        var fullMonthName = monthMapping[xAxisLabel] || xAxisLabel;

        // Add x-axis label with year at the top
        text = "[font color='#667085'][bold]" + fullMonthName + " " + year + "[/]\n" + text;

        if (tooltipSettings.showTotal) {
            // Add total value with a line above it
            text += "\n[font color='#D0D5DD']───────────────────────[/font]\n[fontWeight:normal width:135px height: 0px][font color='#667085'] " + tooltipSettings.totalText + "[/font][/] [bold width:0px] " + tooltipSettings.preText + " " + total + "[/]";
        }

        return text;
    });

    /* Added by NayHtetSoe 12/11/2024 */
    // Add event listener to show tooltip when pointer enters the chart.
    chart.events.on("pointerover", function() {
        // Add class to the root element to show the tooltip.
        chart.root.dom.classList.add("amcharts-tooltip-visible");
    });

    // Add event listener to hide tooltip when pointer leaves the chart.
    chart.events.on("pointerout", function() {
        // Remove class from the root element to hide the tooltip.
        chart.root.dom.classList.remove("amcharts-tooltip-visible");
    });
    /* End by NayHtetSoe 12/11/2024 */

    // Add scrollbar
    chart.set("scrollbarX", am5.Scrollbar.new(root, {
        orientation: "horizontal",
        visible: false,
    }));

    // Make stuff animate on load
    chart.appear(1000, 100);

    // Added by NayHtetSoe 14/11/2024. task link: https://app.clickup.com/t/86eq96ev6
    // Media query to adjust bar width for smaller screens
    const mediaQuery = window.matchMedia('(max-width: 767px)');
    function handleMediaQueryChange(e) {
        if (e.matches) {
            // Remove yAxis labels for weekly bar chart
            yAxis.get("renderer").labels.template.setAll({
                visible: false
            });

            // If the screen width is 300px or less, increase the bar width
            chart.series.each(function(series) {
                series.columns.template.setAll({
                    width: am5.percent(35) // Increase the width of the bars
                });
            });
        } else {
            // Remove yAxis labels for weekly bar chart
            yAxis.get("renderer").labels.template.setAll({
                visible: true
            });

            // Reset to default width for larger screens
            chart.series.each(function(series) {
                series.columns.template.setAll({
                    width: am5.percent(25) // Default width of the bars
                });
            });
        }
    }

    // Check the chartTimeframes attribute to determine if the chart is for weekly data
    if (renderingEl.dataset.chartTimeframes === 'week') {
        // Add listener for media query changes
        mediaQuery.addListener(handleMediaQueryChange);

        // Initial check
        handleMediaQueryChange(mediaQuery);
    }
    // Ended.
}

// Bar Chart Contributors Function
function ContributorsBarChart(renderingEl, data) {
    // Create root element
    var root = am5.Root.new(renderingEl);

    root._logo.dispose();

    // Set themes
    root.setThemes([am5themes_Animated.new(root)]);

    // Create chart
    var chart = root.container.children.push(
        am5xy.XYChart.new(root, {
            panX: false,
            panY: false,
            wheelX: "none",
            wheelY: "none",
            paddingBottom: 70,
            paddingTop: 20,
            paddingLeft: 0,
            paddingRight: 0,
        })
    );

    // Create axes
    var xRenderer = am5xy.AxisRendererX.new(root, {
        minGridDistance: 0,
        cellStartLocation: 0.2,
        cellEndLocation: 0.8,
    });
    xRenderer.grid.template.set("visible", false);

    var xAxis = chart.xAxes.push(
        am5xy.CategoryAxis.new(root, {
            categoryField: "name",
            renderer: xRenderer,
            bullet: function(root, axis, dataItem) {
                var container = am5.Container.new(root, {});
                var picture = container.children.push(
                    am5.Picture.new(root, {
                        width: 32,
                        height: 32,
                        centerY: am5.p50,
                        centerX: am5.p50,
                        src: dataItem.dataContext.thumbnailURL?.src,
                        mask: am5.Circle.new(root, {
                            radius: 50
                        }),
                    })
                );
                picture.set("y", 28);
                return am5xy.AxisBullet.new(root, {
                    location: 0.5,
                    sprite: container
                });
            },
        })
    );
    xAxis.set("dy", 20);
    xAxis.get("renderer").labels.template.set("forceHidden", true);

    var yRenderer = am5xy.AxisRendererY.new(root, {});
    yRenderer.grid.template.set("strokeDasharray", [3]);

    var yAxis = chart.yAxes.push(
        am5xy.ValueAxis.new(root, {
            min: 0,
            max: 1000,
            strictMinMax: true,
            renderer: yRenderer,
        })
    );
    yAxis.get("renderer").grid.template.setAll({
        stroke: am5.color(0xf2f4f7),
        strokeOpacity: 1,
    });
    xAxis.get("renderer").grid.template.setAll({
        stroke: am5.color(0xf2f4f7),
    });

    // Get tooltip settings from data attribute or use default values /* Added by NayHtetSoe 15/11/2024. task link: https://app.clickup.com/t/86eq9wnxg */
    var tooltipSettings = renderingEl.dataset.chartTooltip ? JSON.parse(renderingEl.dataset.chartTooltip) : { preText: "USD", totalText: "Total Earnings" };

    // Create tooltip
    var tooltip = am5.Tooltip.new(root, {
        getFillFromSprite: false,
        pointerOrientation: "horizontal",
        background: am5.RoundedRectangle.new(root, {
            fill: am5.color(0xffffff),
            shadowColor: am5.color(0xe2e2e2),
            shadowBlur: 8,
            shadowOffsetX: 0,
            shadowOffsetY: 0,
        }),
    });
    tooltip.get("background").setAll({
        cornerRadiusTL: 2,
        cornerRadiusTR: 2,
        cornerRadiusBL: 2,
        cornerRadiusBR: 2,
    });
    tooltip.label.setAll({
        paddingLeft: 0,
        paddingRight: 0,
        paddingTop: 0,
        paddingBottom: 0,
        textAlign: "left",
        fill: am5.color(0x344054),
        fontSize: "0.75rem",
        fontFamily: "'Poppins', sans-serif",
        lineHeight: 1.4,
    });
    tooltip.get("background").set("cssClass", "custom-tooltip");
    chart.plotContainer.set("tooltipPosition", "pointer");
    chart.plotContainer.set("tooltip", tooltip);

    // Create series dynamically based on available data fields
    function addSeries(fieldName, displayName, color) {
        var series = chart.series.push(
            am5xy.ColumnSeries.new(root, {
                name: displayName,
                xAxis: xAxis,
                yAxis: yAxis,
                valueYField: fieldName,
                categoryXField: "name",
                sequencedInterpolation: true,
                stacked: true,
            })
        );
        series.columns.template.setAll({
            fill: am5.color(color),
            strokeOpacity: 0,
            width: am5.percent(30),
            maxWidth: 50,
            fillOpacity: 1,
            tooltipY: 0,
        });
        series.columns.template.set("interactive", true);
        series.columns.template.states.create("hover", {
            fillOpacity: 1,
        });
        return series;
    }

    var fields = Object.keys(data[0]);
    var seriesList = [];

    // Add relevant series based on data fields
    if (fields.includes("orders") && fields.includes("tokens")) {
        seriesList.push(addSeries("orders", "Orders", "#4CC9F0"));
        seriesList.push(addSeries("tokens", "Tokens", "#4361EE"));
    } else if (fields.includes("tip")) {
        seriesList.push(addSeries("tip", "Tip", "#4CC9F0"));
        seriesList.push(addSeries("call", "Call", "#4361EE"));
        seriesList.push(addSeries("chat", "Chat", "#3A0BA3"));
        seriesList.push(addSeries("liveStreaming", "Live Streaming", "#F72485"));
    } else if (fields.includes("subscription")) {
        seriesList.push(addSeries("subscription", "Subscription", "#4CC9F0"));
        seriesList.push(addSeries("payToView", "Pay to View", "#4361EE"));
        seriesList.push(addSeries("merch", "Merch", "#3A0BA3"));
        seriesList.push(addSeries("wishTender", "Wishtender", "#F72485"));
        seriesList.push(addSeries("customRequest", "Custom Request", "#98A2B3"));
    }

    // Handle tooltip dynamically
    function handleHover(event) {
        var dataItem = event.target.dataItem;
        if (dataItem) {
            var categoryX = dataItem.get("categoryX");
            var avatarSrc = dataItem.dataContext.thumbnailURL?.src || "";
            var tag = dataItem.dataContext.tag || "";

            var tooltipHTML = `<div style="display: flex; align-items: center; margin-bottom: 12px;">
                <span style="display: flex; width: 20px; height: 20px; background-color: #ffffff; border-radius: 50%; margin-right: 4px;">
                <img src="${avatarSrc}" style="width: 100%; height: 100%; border-radius: 50%;"></span>
                <strong style="font-size: 12px; font-weight: 600; font-family: 'Poppins', sans-serif; color: #101828;">${categoryX}</strong>
                ${tag ? `<span style="margin-left: 4px; font-family: 'Poppins', sans-serif; font-size: 12px; color: #101828;">@${tag}</span>` : ''}
            </div>`;

            seriesList.forEach(function(series) {
                var fieldValue = dataItem.dataContext[series.get("valueYField")];
                var seriesColor = am5.color(series.get("fill")).toCSS();
                tooltipHTML += `<div style="display: flex; align-items: center; margin-bottom: 4px;">
                    <div style="display: flex; width: 8px; height: 8px; background-color: ${seriesColor}; border-radius: 50%; margin-right: 8px;"></div>
                    <span style="width: 120px; font-family: 'Poppins', sans-serif; font-size: 12px; color: #344054;">${series.get("name")}</span>
                    <strong style="font-family: 'Poppins', sans-serif; font-size: 12px; font-weight: 500; color: #101828;">${tooltipSettings.preText} ${fieldValue}</strong>
                </div>`;
            });

            tooltip.set("html", tooltipHTML);
            var columnRect = event.target.getPrivate("bbox");
            if (columnRect) {
                var x = columnRect.x + columnRect.width / 2;
                var y = columnRect.y;
                tooltip.set("pointTo", {
                    x: x,
                    y: y
                });
            }
            tooltip.show();
        }
    }

    // Event listeners for tooltips
    chart.series.each(function(series) {
        series.columns.template.events.on("pointerover", handleHover);
        series.columns.template.events.on("pointerout", function() {
            tooltip.hide();
        });
        series.columns.template.events.on("pointermove", function(event) {
            var columnRect = event.target.getPrivate("bbox");
            if (columnRect) {
                var x = columnRect.x + columnRect.width / 2;
                var y = columnRect.y;
                tooltip.set("pointTo", {
                    x: x,
                    y: y
                });
            }
        });
    });

    // Update chart data based on screen size
    function updateChartData() {
			var isMobile = window.innerWidth <= 767
			var chartData = isMobile ? data.slice(0, 5) : data
			seriesList.forEach(function (series) {
				series.data.setAll(chartData)
			})
			xAxis.data.setAll(chartData)
			chart.series.each(function (series) {
				series.appear(1000, 100)
			})

			// Disable Y-axis in mobile view
			yAxis.get('renderer').labels.template.set('visible', !isMobile) // Hide labels
			yAxis.set('visible', !isMobile)
		}

    updateChartData();
    chart.appear(1000, 100);
}

// Line Chart Main Function
function LineChart(renderingEl, data, hexCode) {
    var root = am5.Root.new(renderingEl);

    // Set themes
    // https://www.amcharts.com/docs/v5/concepts/themes/
    root.setThemes([
        am5themes_Animated.new(root)
    ]);

    // Create chart
    // https://www.amcharts.com/docs/v5/charts/xy-chart/
    var chart = root.container.children.push(am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        wheelX: "none",
        wheelY: "none",
        paddingLeft: 0,
        paddingRight: 0,
        paddingBottom: 0,
        paddingTop: 0,
    }));

    // Add cursor
    // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
    var cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
        behavior: "none"
    }));
    cursor.lineY.set("visible", false);

    // Generate random data
    var date = new Date();
    date.setHours(0, 0, 0, 0);
    var value = 30;

    function generateData() {
        value = Math.round((Math.random() * 10 - 5) + value);
        am5.time.add(date, "day", 10);
        return {
            date: date.getTime(),
            value: value
        };
    }

    function generateDatas(count) {
        var data = [];
        for (var i = 0; i < count; ++i) {
            data.push(generateData());
        }
        return data;
    }

    // Create axes
    // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
    var xAxis = chart.xAxes.push(am5xy.DateAxis.new(root, {
        maxDeviation: 0,
        baseInterval: {
            timeUnit: "day",
            count: 1
        },
        renderer: am5xy.AxisRendererX.new(root, {
            minGridDistance: 80,
            minorGridEnabled: false,
            visible: false,
        }),
        //tooltip: am5.Tooltip.new(root, {})
    }));

    var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
        maxDeviation: 0,
        renderer: am5xy.AxisRendererY.new(root, {
            visible: false,
        })
    }));

    // Add series
    // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
    var series = chart.series.push(am5xy.SmoothedXLineSeries.new(root, {
        name: "Series",
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "value",
        //valueXField: "date",
        valueXField: "dateInMilliSeconds",
        stroke: am5.color(hexCode)
    }));

    //Y-Axis Label Removed
    yAxis.get("renderer").labels.template.setAll({
        visible: false,
        paddingLeft: 0,
    });

    //X-Axis Label Removed
    xAxis.get("renderer").labels.template.setAll({
        visible: false,
        paddingBottom: 0,
    });

    //Y-Axis Grid Removed
    yAxis.get("renderer").grid.template.setAll({
        visible: false,
        paddingLeft: 0,
    });

    //X-Axis Grid Removed
    xAxis.get("renderer").grid.template.setAll({
        visible: false,
        paddingBottom: 0,
    });

    series.fills.template.set("fillGradient", am5.LinearGradient.new(root, {
        stops: [{
                color: am5.color(hexCode),
                opacity: 0.2
            },
            {
                color: am5.color(hexCode),
                opacity: 0.2
            },
            {
                color: am5.color(0xffffff),
                opacity: 0
            },
        ],
        rotation: 90
    }));

    series.fills.template.setAll({
        visible: true,
        fillOpacity: 1
    });

    series.strokes.template.setAll({
        strokeWidth: 2
    });

    series.bullets.push(function() {
        return am5.Bullet.new(root, {
            locationY: 0,
            sprite: am5.Circle.new(root, {
                radius: 0,
                stroke: root.interfaceColors.get("background"),
                strokeWidth: 2,
                fill: series.get("fill")
            })
        });
    });

    // Add scrollbar
    // https://www.amcharts.com/docs/v5/charts/xy-chart/scrollbars/
    chart.set("scrollbarX", am5.Scrollbar.new(root, {
        orientation: "none",
        visible: false,
    }));

    // function to take dataset and convert date in 'dd-mm-yyyy' to milli seconds and return new dataset with 'dateInMilliSeconds' as a new key
    function convertDateToMillis(dataset) {
        return dataset.map((data) => {
            const [day, month, year] = data.date.split('-');
            const date = new Date(year, month - 1, day); // month is 0-indexed
            const dateInMilliSeconds = date.getTime();
            return { ...data, dateInMilliSeconds };
        });
    } 

    // convert dataset
    var convertedData = convertDateToMillis(data);
    //console.log(convertedData);
    
    // set data
    //var data = generateDatas(50);
    //var data = data;
    var data = convertedData;
    series.data.setAll(data);

    // Make stuff animate on load
    // https://www.amcharts.com/docs/v5/concepts/animations/
    series.appear(1000);
    chart.appear(1000, 100);

    cursor.lineY.set("forceHidden", true);
    cursor.lineX.set("forceHidden", true);
}

// Smoothed Line Chart Main Function
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
            minGridDistance: renderingEl.dataset.chartTimeframes === 'day' ? 0 : 30 // Reduce the minimum grid distance to show all labels
        })
    }));
    xAxis.data.setAll(staticValues); // Set the X-axis categories as the months
    xAxis.get("renderer").labels.template.setAll({
        fontSize: "0.75rem", // Set the font size for X-axis labels
        fill: am5.color(0x475467), // Text color
    });

     // Custom label formatting for day timeframe /* Added by NayHtetSoe 18/11/2024. task link: https://app.clickup.com/t/86eq96d7j */
    if (renderingEl.dataset.chartTimeframes === 'day') {
        // Show only specific x-axis labels (1, 5, 10, 15, 20, 25, 30)
        xAxis.get("renderer").labels.template.adapters.add("visible", function(visible, target) {
            if (target.dataItem) {

                var category = target.dataItem.get("category");
                var date = new Date(category);
                var day = date.getDate();
                return [1, 5, 10, 15, 20, 25, 30].includes(day);
            }
            return visible;
        });
    }

    var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {})
    }));
    yAxis.get("renderer").labels.template.setAll({
        visible: false,
        paddingLeft: 0,
    });

    // Get tooltip settings from data attribute or use default values /* Added by NayHtetSoe 15/11/2024. task link: https://app.clickup.com/t/86eq9wnxg */
    var tooltipSettings = renderingEl.dataset.chartTooltip ? JSON.parse(renderingEl.dataset.chartTooltip) : { preText: "USD", totalText: "Total Earnings" };

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
                labelText: "[font color='#667085' fontFamily: 'Poppins' fontWeight:600 fontSize: .75rem]{fullMonth} {year.formatNumber('#')}[/]\n[font color='{stroke}' fontSize: 16px]● [/][font color='#344054' fontFamily: 'Poppins' fontWeight:400 fontSize: .75rem]{name}\t\t\t[/][font color='#101828' fontFamily: 'Poppins' fontWeight:500 fontSize: .75rem]"+tooltipSettings.preText+" {valueY}[/]", // Custom tooltip 

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
                    opacity: 0 // Start with unvisible bullet. /* updated by NayHtetSoe 13/11/2024 */
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

        /* added by NayHtetSoe 13/11/2024 */
        // Access tooltip directly and control bullet visibility with shown/hidden events
        var tooltip = series.get("tooltip");

        // Show bullet when tooltip is pointed over
        tooltip.events.on("pointerover", function() {
            // Get the data item associated with the tooltip
            var dataItem = tooltip.dataItem;
            
            // Get the first bullet from the data item's bullets array
            var bullet = dataItem.bullets[0];
            
            // Check if the bullet and its sprite are defined
            if (bullet && bullet.get("sprite")) {
                // Set the opacity of the bullet's sprite to 1 to make it visible
                bullet.get("sprite").set("opacity", 1);
            }
        });

        // Hide bullet when tooltip is pointed out
        tooltip.events.on("pointerout", function() {
            // Loop through all data items and hide the bullet
            series.dataItems.forEach(function(item) {
                // var item = series.dataItems[key];
                if (item.bullets) {
                    // Hide the bullet
                    item.bullets[0].get("sprite").set("opacity", 0);
                }
            });
        });
        /* ended */

        series.data.setAll(staticValues);
        series.appear(1000);
    }

    // Add series with explicit colors
    // if 'renderingEl' is 'salesTrend' and 'data-chart-timeframes' is 'month', 'week', 'day'
    if ( renderingEl.dataset.chartName === 'salesTrend' && (renderingEl.dataset.chartTimeframes === 'month' || renderingEl.dataset.chartTimeframes === 'week' || renderingEl.dataset.chartTimeframes === 'day') ) {
        addSeries("Subscription", "subscription", am5.color(0x4CC9F0));
        addSeries("Pay to view", "payToView", am5.color(0x4361EE));
        addSeries("Merch", "merch", am5.color(0x3A0BA3));
        addSeries("Wishtender", "wishTender", am5.color(0xF72585));
        addSeries("Custom request", "customRequest", am5.color(0x98A2B3));
    }

    // if 'renderingEl' is 'tokenTrend' and 'data-chart-timeframes' is 'month', 'week', 'day'
    if ( renderingEl.dataset.chartName === 'tokenTrend' && (renderingEl.dataset.chartTimeframes === 'month' || renderingEl.dataset.chartTimeframes === 'week' || renderingEl.dataset.chartTimeframes === 'day') ) {
        addSeries("Tip", "tip", am5.color(0x4CC9F0));
        addSeries("Call", "call", am5.color(0x4361EE));
        addSeries("Chat", "chat", am5.color(0x3A0BA3));
        addSeries("Live Streaming", "liveStreaming", am5.color(0xF72585));
    }

    // if 'renderingEl' is 'fansTrend' and 'data-chart-timeframes' is 'month', 'week', 'day'
    if ( renderingEl.dataset.chartName === 'fansTrend' && (renderingEl.dataset.chartTimeframes === 'month' || renderingEl.dataset.chartTimeframes === 'week' || renderingEl.dataset.chartTimeframes === 'day') ) {
        addSeries("New Followers", "newFollowers", am5.color(0x4CC9F0));
        addSeries("Profile visit", "profileVisit", am5.color(0x4361EE));
    }

    // if 'renderingEl' is 'subscriptionTrend' and 'data-chart-timeframes' is 'month', 'week', 'day'
    if ( renderingEl.dataset.chartName === 'subscriptionTrend' && (renderingEl.dataset.chartTimeframes === 'month' || renderingEl.dataset.chartTimeframes === 'week' || renderingEl.dataset.chartTimeframes === 'day') ) {
        addSeries("New", "newSubscriber", am5.color(0x4CC9F0));
        addSeries("Recurring", "recurringSubscriber", am5.color(0x4361EE));
    }

    // if 'renderingEl' is 'tiersBreakdownTrend' and 'data-chart-timeframes' is 'month', 'week', 'day'
    if ( renderingEl.dataset.chartName === 'tiersBreakdownTrend' && (renderingEl.dataset.chartTimeframes === 'month' || renderingEl.dataset.chartTimeframes === 'week' || renderingEl.dataset.chartTimeframes === 'day') ) {
        addSeries("Free", "free", am5.color(0x4CC9F0));
        addSeries("Tier 1", "tier1", am5.color(0x4361EE));
        addSeries("Tier 2", "tier2", am5.color(0x3A0BA3));
        addSeries("Tier 3", "tier3", am5.color(0xAE4AEF));
        addSeries("Tier 4", "tier4", am5.color(0x98A2B3));
        addSeries("Tier 5", "tier5", am5.color(0xF72485));
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

// Doughnut Chart Main Function
function DonutChart(renderingEl, data) {
    // Create root element
    var root = am5.Root.new(renderingEl);

    root._logo.dispose();

    // Set themes
    root.setThemes([
        am5themes_Animated.new(root)
    ]);

    // Create chart
    var chart = root.container.children.push(am5percent.PieChart.new(root, {
        layout: root.verticalLayout,
        innerRadius: am5.percent(130), // Increase this value to make slices thinner
        paddingTop: 10,
        paddingBottom: 0 // Add padding to the bottom to ensure space for the legend
    }));

    // Get tooltip settings from data attribute or use default values /* Added by NayHtetSoe 15/11/2024. task link: https://app.clickup.com/t/86eq9wnxg */
    var tooltipSettings = renderingEl.dataset.chartTooltip ? JSON.parse(renderingEl.dataset.chartTooltip) : { preText: "USD", totalText: "" };

    function escapeHTML(str) {
        return str.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    // Create series
    var series = chart.series.push(am5percent.PieSeries.new(root, {
        name: "Value",
        valueField: "value",
        categoryField: "category",
        fillField: "color",
        legendLabelText: "[bold {fill}]{category}",
        legendValueText: ""
    }));

    series.labels.template.set("forceHidden", true);
    series.ticks.template.set("forceHidden", true);

    // Customize slices to only show tooltip
    series.slices.template.setAll({
        tooltipText: "{category}: {value}", // Tooltip content
        tooltip: am5.Tooltip.new(root, { // Create a tooltip with custom styling
            pointerOrientation: "horizontal",
            getFillFromSprite: false,
            background: am5.RoundedRectangle.new(root, {
                fill: am5.color(0xffffff), // Set tooltip background to white
                strokeOpacity: 0, // Remove border if not needed
                cornerRadius: 2, // Optional: add rounded corners
                shadowColor: am5.color(0xE2E2E2, 0.08), // Shadow color with opacity
            }),
            strokeWidth: 0,
            scale: 1,
            stroke: am5.color(0xffffff),
            labelText: "{category}: {value}" // Tooltip text
        }),
        // Disable click interactions
        clickTarget: "none",
        toggleKey: "none",
        interactive: false
    });

    // Apply corner radius to the tooltip background
    series.slices.template.get("tooltip").get("background").setAll({
        cornerRadiusTL: 2,
        cornerRadiusTR: 2,
        cornerRadiusBL: 2,
        cornerRadiusBR: 2
    });

    // Add hover state
    series.slices.template.states.create("hover", {
        scale: 1,
        fillOpacity: 1,
        shadowBlur: 20, // Blur effect of the shadow
        shadowOffsetX: 0, // Horizontal offset of the shadow
        shadowOffsetY: 0, // Vertical offset of the shadow
        transitionDuration: 100
    });

    // Use series color for shadow
    /* series.slices.template.adapters.add("shadowColor", function(shadowColor, target) {
        return target.get("fill");
        return am5.color(0xE2E2E2);
    }); */

    // Add events for smooth transition
    series.slices.template.events.on("pointerover", function(ev) {
        ev.target.animate({
            key: "shadowBlur",
            to: 0,
            duration: 100,
            easing: am5.ease.out(am5.ease.cubic)
        });
    });

    // Explicitly set tooltip label color and font properties
    series.slices.template.adapters.add("tooltipHTML", function(tooltipHTML, target) {
        var slice = target.dataItem.dataContext;
        return "<div style='font-size: 12px; overflow: hidden; font-family: Poppins, sans-serif; color: #344054;'>" +
            "<span style='color:" + slice.color + "; font-size: 16px;'>●</span> " + escapeHTML(slice.category) + "<br>" +
            "<strong style='font-size: 12px;'>" + tooltipSettings.preText + " " + slice.value + " " + tooltipSettings.totalText +  "</strong>" +
            "</div>";
    });

    // Set data
    var data = data;

    series.data.setAll(data);

    // Create legend
    var legend = chart.children.push(am5.Legend.new(root, {
        x: am5.percent(50),
        y: am5.percent(95),
        centerX: am5.percent(50),
        layout: root.horizontalLayout,
        marginBottom: 0, // Ensure space for the legend
        centerX: am5.percent(50),
        maxHeight: 50, // Adjust the maxHeight as needed
        maxWidth: am5.percent(100),
        fillField: "color",
        marginTop: 8,
        marginBottom: 0,
    }));

    // Custom adapter for legend labels
    legend.labels.template.adapters.add("text", function(text, target) {
        var dataItem = target.dataItem;
        if (dataItem && dataItem.dataContext) {
            return "[#667085]" + dataItem.dataContext.category + "[/]";
        }
        return text;
    });

    // Customize legend
    legend.labels.template.setAll({
        fontSize: "0.75rem",
        fontFamily: "'Poppins', sans-serif",
        lineHeight: 1,
        paddingLeft: 2,
        oversizedBehavior: "truncate",
        maxWidth: 90
    });

    // Create custom marker
    legend.markers.template.setAll({
        width: 6,
        height: 6,
    });

    legend.markerRectangles.template.setAll({
        cornerRadiusTL: 10,
        cornerRadiusTR: 10,
        cornerRadiusBL: 10,
        cornerRadiusBR: 10
    });
    // Adjust legend item container
    legend.itemContainers.template.setAll({
        paddingTop: 0,
        paddingBottom: 0,
        paddingLeft: 0,
        paddingRight: 8,
        marginLeft: 0,
        marginRight: 0
    });

    // Ensure value labels in the legend do not display percentages
    legend.valueLabels.template.set("forceHidden", true);

    // Reduce spacing between legend items
    legend.set("itemGap", 4);

    //legend.data.setAll(series.dataItems);

    // Play initial series animation
    series.appear(1000, 100);
}