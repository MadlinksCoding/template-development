/**
 * @function fetchChartData
 * @description Fetches the chart data asynchronously from the file 'analytics-data-new.js'.
 * @returns {Promise<Object>} A promise that resolves to the JSON data (chartDataSet) or an empty object if there's an error.
 */
async function fetchChartData() {
  try {
    // Fetch the content of the 'analytics-data.js' file
    const response = await fetch('assets/js/analytics-data-formatted.js');
    // Parse the response as JSON (assuming the response is a JSON object)
    const chartDataSet = await response.json();
    return chartDataSet;
  } catch (error) {
    // Log the error in case of failure
    console.error('Error fetching chart data:', error);
    // Return an empty object in case of an error to avoid breaking the app
    return {};
  }
}

/**
 * @class ChartRenderer
 * @classdesc This class handles the rendering of charts by reading the chart data and matching it with
 * corresponding DOM elements. It determines the chart type and timeframe, then calls appropriate methods to render charts.
 * @param {Object} chartDataSet - The JSON object that contains all the chart data.
 */
class ChartRenderer {
  /**
   * @constructor
   * @param {Object} chartDataSet - The chart data set passed from the fetched data.
   */
  constructor(chartDataArray) {
    this.chartDataArray = chartDataArray; // Store the fetched chart data array
    //this.chartDataSet = chartDataSet; // Store the fetched chart data
  }

  /**
   * @function processDatasetDates
   * @description Processes a dataset by extracting date information and adding new keys.
   * @param {Array<Object>} dataset - The input dataset with a "date" key in "dd-mm-yyyy" format.
   * @returns {Array<Object>} The updated dataset with additional date-related keys.
   */
  processDatasetDates(dataset) {
    // Define arrays for month names
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    // Define arrays for full month names
    const fullMonths = [
      'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
      'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
    ];

    // Use map() to iterate over the dataset and create a new array with updated objects
    return dataset.map((data) => {
      // Split the date string into day, month, and year
      const [day, month, year] = data.date.split('-');

      // Create a new Date object to ensure correct date parsing
      const date = new Date(year, month - 1, day);

      // Return a new object with the original data and additional date-related keys
      return {
        ...data,
        // Day of the month in "Month Day" format (e.g., "July 1")
        day: `${months[month - 1]} ${day}`,
        
        // Abbreviated month name (e.g., "July")
        month: months[month - 1],
        
        // Full month name (e.g., "JULY")
        fullMonth: fullMonths[month - 1],
        
        // Year as an integer
        year: parseInt(year),
      };
    });
  }


  /**
   * @function renderCharts
   * @description Loops through the chart data, finds matching DOM elements using attributes, and renders charts based on their type.
   */
  renderCharts() {
    // Iterate through the array of chart data objects
    this.chartDataArray.forEach((chartDataObject) => {
      // For each chartDataObject, get its keys (e.g., 'salesInsight', 'salesTrend')
      Object.keys(chartDataObject).forEach((key) => {
        const chartData = chartDataObject[key]; // Get the chart data for the current key
        // Find the DOM element that matches the 'data-chart-name' attribute with the current key
        const chartElement = document.querySelector(`[data-chart-name="${key}"]`);

        // Proceed if the DOM element is found
        if (chartElement) {
          // Check if 'chartType' matches the DOM element's 'data-chart-type' attribute
          if (chartElement.getAttribute('data-chart-type') === chartData.chartType) {
            // Retrieve the 'data-chart-timeframes' attribute from the DOM element
            const timeframe = chartElement.getAttribute('data-chart-timeframes');

            // Check if the chartData has a matching timeframe and get the corresponding data
            if (chartData.timeFrames && chartData.timeFrames[timeframe]) {
              const timeFrameData = chartData.timeFrames[timeframe];

              // process data using 'date' key for new date 'key' & 'value' pairs
              const processedTimeFrameData = this.processDatasetDates(timeFrameData);

              // Call the appropriate chart rendering method based on the chart type
              this.renderChartByType(chartElement, chartData.chartType, processedTimeFrameData);
            }
          }
        }
      });
    });
  }

  /**
   * @function renderChartByType
   * @description Renders a chart by determining its type (e.g., bar, line, smoothed line, map, doughnut) and calling the corresponding method.
   * @param {HTMLElement} element - The DOM element where the chart should be rendered.
   * @param {string} chartType - The type of chart to render (e.g., 'bar', 'line', 'smoothedline', 'map', '').
   * @param {Array|Object} data - The data to be used for rendering the chart.
   */
  renderChartByType(element, chartType, data) {
    // Switch case to call the appropriate chart rendering method based on chart type
    switch (chartType) {
      case 'bar':
        this.barChart(element, data);
        break;
      case 'line':
        this.lineChart(element, data);
        break;
      case 'smoothedline':
        this.smoothedLineChart(element, data);
        break;
      case 'map':
        this.mapChart(element, data);
        break;
      case 'donut':
        this.donutChart(element, data);
        break;
      // Add other chart types as necessary
      default:
        console.warn(`Unknown chart type: ${chartType}`); // Warn if an unknown chart type is encountered
    }
  }

  /**
   * @function barChart
   * @description Renders a bar chart using the provided DOM element and data.
   * @param {HTMLElement} element - The DOM element where the bar chart will be rendered.
   * @param {Array|Object} data - The data to be used for rendering the bar chart.
   */
  barChart(element, data) {
    // Logic to render a bar chart
    //console.log('Rendering bar chart for', element, data);
    // Implementation for rendering the bar chart goes here
    if ( element.dataset.popupType == 'popup-contributors-insight' ) {
      //console.log('Call contributors bar chart');
      ContributorsBarChart(element, data);
    }
    else {
      //console.log('Call common bar chart');
      BarChart(element, data);
    }
  }

  /**
   * @function lineChart
   * @description Renders a line chart using the provided DOM element and data.
   * @param {HTMLElement} element - The DOM element where the line chart will be rendered.
   * @param {Array|Object} data - The data to be used for rendering the line chart.
   */
  lineChart(element, data) {
    // Logic to render a line chart
    //console.log('Rendering line chart for', element, data);
    // Implementation for rendering the line chart goes here
    LineChart(element, data, element.dataset.chartHex);
  }

  /**
   * @function smoothedLineChart
   * @description Renders a line chart using the provided DOM element and data.
   * @param {HTMLElement} element - The DOM element where the smoothed line chart will be rendered.
   * @param {Array|Object} data - The data to be used for rendering the smoothed line chart.
   */
  smoothedLineChart(element, data) {
    // Logic to render a line chart
    //console.log('Rendering smoothed line chart for', element, data);
    // Implementation for rendering the line chart goes here
    SmoothLineChart(element, data);
  }

  /**
   * @function mapChart
   * @description Renders a map chart using the provided DOM element and data.
   * @param {HTMLElement} element - The DOM element where the map chart will be rendered.
   * @param {Array|Object} data - The data to be used for rendering the map chart.
   */
  mapChart(element, data) {
    // Logic to render a map chart
    //console.log('Rendering map chart for', element, data);
    // Implementation for rendering the map chart goes here
    MapChart(element, data);
  }

  /**
   * @function donutChart
   * @description Renders a map chart using the provided DOM element and data.
   * @param {HTMLElement} element - The DOM element where the donut chart will be rendered.
   * @param {Array|Object} data - The data to be used for rendering the donut chart.
   */
  donutChart(element, data) {
    // Logic to render a map chart
    //console.log('Rendering donut chart for', element, data);
    // Implementation for rendering the map chart goes here
    DonutChart(element, data);
  }

  // Additional chart rendering methods (e.g., areaChart, pieChart) can be added here as needed.
}

/**
 * @event DOMContentLoaded
 * @description Listens for the DOMContentLoaded event to ensure the DOM is fully loaded before rendering charts.
 */
document.addEventListener('DOMContentLoaded', function() {
  // Fetch the chart data asynchronously after DOM is ready
  fetchChartData().then(chartDataSet => {
    // Once data is fetched, initialize the ChartRenderer with the fetched chart data
    const chartRenderer = new ChartRenderer(chartDataSet);
    // Start rendering charts
    chartRenderer.renderCharts();
  });
});
