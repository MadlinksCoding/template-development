// Bar Chart Main Function for Top Contributors
function TopContributorsBarChart(renderingEl, data) {
  // Create root element
  var root = am5.Root.new(renderingEl);

  root._logo.dispose();

  // Set themes
  root.setThemes([
      am5themes_Animated.new(root)
  ]);

  var data = data;

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
          paddingRight: 0
      })
  );

  // Create axes
  var xRenderer = am5xy.AxisRendererX.new(root, {
      minGridDistance: 0,
      cellStartLocation: 0.2,
      cellEndLocation: 0.8
  });
  xRenderer.grid.template.set("visible", false);

  var xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
          categoryField: "name",
          renderer: xRenderer,
          bullet: function(root, axis, dataItem) {
              var container = am5.Container.new(root, {});

              var picture = container.children.push(am5.Picture.new(root, {
                  width: 32,
                  height: 32,
                  centerY: am5.p50,
                  centerX: am5.p50,
                  src: dataItem.dataContext.pictureSettings.src,
                  mask: am5.Circle.new(root, {
                      radius: 50
                  }) // Adjusted to match the new size
              }));

              // Adjust the y position of the image to create space from the Y-axis
              picture.set("y", 28); // Move the image 20 pixels up

              return am5xy.AxisBullet.new(root, {
                  location: 0.5,
                  sprite: container
              });
          }
      })
  );

  // Adjust the position of the entire x-axis
  xAxis.set("dy", 20); // Move the entire x-axis down by 20 pixels

  // Remove text labels from x-axis
  xAxis.get("renderer").labels.template.set("forceHidden", true);

  var yRenderer = am5xy.AxisRendererY.new(root, {});
  yRenderer.grid.template.set("strokeDasharray", [3]);

  var yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
          min: 0, // Minimum value on the Y-axis
          max: 1000, // Maximum value on the Y-axis
          strictMinMax: true, // Enforce min and max values
          renderer: yRenderer,
      })
  );

  //Y-Axis Grid Removed
  yAxis.get("renderer").grid.template.setAll({
      stroke: am5.color(0xf2f4f7),
      strokeOpacity: 1
  });

  //X-Axis Grid Removed
  xAxis.get("renderer").grid.template.setAll({
      stroke: am5.color(0xf2f4f7)
  });

  // Create tooltip
  var tooltip = am5.Tooltip.new(root, {
      getFillFromSprite: false,
      pointerOrientation: "horizontal", // Ensure the tooltip is positioned horizontally
      background: am5.RoundedRectangle.new(root, {
          fill: am5.color(0xFFFFFF), // White background
          shadowColor: am5.color(0xE2E2E2), // Shadow color (black)
          shadowBlur: 8, // Blur effect of the shadow
          shadowOffsetX: 0, // Horizontal offset of the shadow
          shadowOffsetY: 0, // Vertical offset of the shadow
      })
  });

  // Create a container for the avatar
  var avatarContainer = am5.Container.new(root, {
      width: 32,
      height: 32,
      marginRight: 12
  });

  // Apply corner radius to the tooltip background
  tooltip.get("background").setAll({
      cornerRadiusTL: 2,
      cornerRadiusTR: 2,
      cornerRadiusBL: 2,
      cornerRadiusBR: 2
  });

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

  // Add series for Orders
  var orderSeries = chart.series.push(
      am5xy.ColumnSeries.new(root, {
          name: "Orders",
          xAxis: xAxis,
          yAxis: yAxis,
          valueYField: "orders",
          categoryXField: "name",
          sequencedInterpolation: true,
          stacked: true
      })
  );
  orderSeries.columns.template.setAll({
      fill: am5.color("#4CC9F0"), // Set custom color for Tip series
  });

  // Add series for Tokens
  var tokenSeries = chart.series.push(
      am5xy.ColumnSeries.new(root, {
          name: "Tokens",
          xAxis: xAxis,
          yAxis: yAxis,
          valueYField: "tokens",
          categoryXField: "name",
          sequencedInterpolation: true,
          stacked: true
      })
  );

  tokenSeries.columns.template.setAll({
      fill: am5.color("#4361EE"), // Set custom color for Tip series
  });

  // Apply common column settings and enable tooltips
  chart.series.each(function(series) {
      series.columns.template.setAll({
          strokeOpacity: 0,
          width: am5.percent(30),
          maxWidth: 50,
          fillOpacity: 1,
          tooltipY: 0
      });
      series.columns.template.set("interactive", true);

      // Add hover state
      series.columns.template.states.create("hover", {
          fillOpacity: 1
      });

      // Add event listeners to each column
      series.columns.template.events.on("pointerover", function(event) {
          handleHover(event);
      });

      series.columns.template.events.on("pointerout", function() {
          tooltip.hide();
      });

      series.columns.template.events.on("pointermove", function(event) {
          handleMove(event);
      });
  });

  function handleHover(event) {
      var dataItem = event.target.dataItem;
      if (dataItem) {
          var categoryX = dataItem.get("categoryX");
          var tokens = dataItem.dataContext.tokens;
          var orders = dataItem.dataContext.orders;
          var total = tokens + orders;
          var avatarSrc = dataItem.dataContext.pictureSettings.src;
          var tag = dataItem.dataContext.tag || ""; // Assuming tag data is available

          // Get the colors of the series
          var orderColor = am5.color(orderSeries.get("fill")).toCSS();
          var tokenColor = am5.color(tokenSeries.get("fill")).toCSS();

          var tooltipHTML = `<div style="display: flex; align-items: center; margin-bottom: 12px;">
              <span style="display: flex; width: 20px; height: 20px; background-color: #ffffff; border-radius: 50%; margin-right: 4px;">
              <img src="${avatarSrc}" style="width: 100%; height: 100%; border-radius: 50%;"></span>
              <strong style="font-size: 12px; font-weight: 600; font-family: 'Poppins', sans-serif; color: #101828;">${categoryX}</strong>
              ${tag ? `<span style="margin-left: 4px; font-family: 'Poppins', sans-serif; font-size: 12px; color: #101828; text-overflow: ellipsis;">@${tag}...</span>` : ''}
          </div>
          <div style="display: flex; align-items: center; margin-bottom: 4px;">
              <div style="display: flex; width: 8px; height: 8px; background-color: ${orderColor}; border-radius: 50%; margin-right: 8px;"></div>
              <span style="width: 120px; font-family: 'Poppins', sans-serif; font-size: 12px; color: #344054;">Orders</span>
              <strong style="font-family: 'Poppins', sans-serif; font-size: 12px; font-weight: 500; color: #101828;">USD ${orders}</strong>
          </div>
          <div style="display: flex; align-items: center; margin-bottom: 4px;">
              <div style="display: flex; width: 8px; height: 8px; background-color: ${tokenColor}; border-radius: 50%; margin-right: 8px;"></div>
              <span style="width: 120px; font-family: 'Poppins', sans-serif; font-size: 12px; color: #344054;">Tokens</span>
              <strong style="font-family: 'Poppins', sans-serif; font-size: 12px; font-weight: 500; color: #101828;">USD ${tokens}</strong>
          </div>
          <div style="display: flex; border-top: 1px solid #D0D5DD; margin-top: 8px; padding-top: 8px;">
              <span style="width: 135px; color: #667085; font-family: 'Poppins', sans-serif; font-size: 12px;">Total spending</span>
              <strong style="font-family: 'Poppins', sans-serif; font-size: 12px; font-weight: 600; color: #101828;">USD ${total}</strong>
          </div>`;

          tooltip.set("html", tooltipHTML);

          // Get the position of the hovered column
          var columnRect = event.target.getPrivate("bbox");
          if (columnRect) {
              var x = columnRect.x + columnRect.width / 2;
              var y = columnRect.y;

              // Set the tooltip position
              tooltip.set("pointTo", {
                  x: x,
                  y: y
              });
          }
          tooltip.show();
      }
  }

  function handleMove(event) {
      // Get the position of the hovered column
      var columnRect = event.target.getPrivate("bbox");
      if (columnRect) {
          var x = columnRect.x + columnRect.width / 2;
          var y = columnRect.y;

          // Set the tooltip position
          tooltip.set("pointTo", {
              x: x,
              y: y
          });
      }
  }
  // Function to update chart data
  function updateChartData() {
      var isMobile = window.innerWidth <= 767;
      var chartData = isMobile ? data.slice(0, 5) : data;

      orderSeries.data.setAll(chartData);
      tokenSeries.data.setAll(chartData);
      xAxis.data.setAll(chartData);

      chart.series.each(function(series) {
          series.appear(1000, 100);
      });
  }

  // Initial data set
  updateChartData();

  // Make stuff animate on load
  chart.appear(1000, 100);
}
