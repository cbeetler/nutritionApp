// Import functions from helpers.js
import { capitalize, calculateCalories } from "./helpers.js";

// Import "snackbar" package
import snackbar from "snackbar";

// Import AppData class and methods
import AppData from "./app-data.js";
const appData = new AppData();

// Import ChartJS package
import Chart from "chart.js/auto";

// Import FetchWrapper class and declare new instance of API base URL
import FetchWrapper from "./fetch-wrapper.js";
// In order to create a fresh DB, replace "cbeetler2" with any value
// i.e. ==> "https://firestore.googleapis.com/v1/projects/jsdemo-3f387/databases/(default)/documents/YOUR_VALUE_HERE"
const API = new FetchWrapper(
  "https://firestore.googleapis.com/v1/projects/jsdemo-3f387/databases/(default)/documents/cbeetler2"
);

// DOM Points
const form = document.querySelector("#create-form");
const name = document.querySelector("#create-name");
const carbs = document.querySelector("#create-carbs");
const protein = document.querySelector("#create-protein");
const fat = document.querySelector("#create-fat");
const list = document.querySelector("#food-list");
const calories = document.querySelector("#total-calories");

// Renders and displays new and historical entries on screen
const displayEntry = (name, carbs, protein, fat) => {
  appData.addFood(carbs, protein, fat);

  list.insertAdjacentHTML(
    "afterbegin",
    `<li class="card">
      <div>
        <h3 class="name">${capitalize(name)}</h3>
        <div class="calories">${calculateCalories(
          carbs,
          protein,
          fat
        )} calories</div>
        <ul class="macros">
          <li class="carbs"><div>Carbs</div><div class="value">${carbs}g</div></li>
          <li class="protein"><div>Protein</div><div class="value">${protein}g</div></li>
          <li class="fat"><div>Fat</div><div class="value">${fat}g</div></li>
        </ul>
      </div>
    </li>`
  );

  // Now that the HTML for the list has been generated, render the Macronutrient chart and total number of calories
  renderChart();
  calories.textContent = appData.getTotalCalories();
};

// Make a POST request to the Firebase API when the user submits the form #create-form
form.addEventListener("submit", (event) => {
  event.preventDefault();

  // API Post request
  API.post("/", {
    fields: {
      name: { stringValue: name.value },
      carbs: { integerValue: carbs.value },
      protein: { integerValue: protein.value },
      fat: { integerValue: fat.value },
    },
  }).then((data) => {
    console.log(data);
    if (data.error) {
      snackbar.show("Some data is missing.");
      console.error(data.error);
      return;
    }

    // Show success message
    snackbar.show("Food added successfully.");

    // Render the entered food item on the screen
    displayEntry(name.value, carbs.value, protein.value, fat.value);

    // Reset the form values to take new entries
    name.value = "";
    carbs.value = "";
    protein.value = "";
    fat.value = "";
  });
});

// Grabs and then displays previous API entries
const init = () => {
  API.get("/?pageSize=100").then((data) => {
    data.documents?.forEach((document) => {
      const fields = document.fields;
      displayEntry(
        fields.name.stringValue,
        fields.carbs.integerValue,
        fields.protein.integerValue,
        fields.fat.integerValue
      );
    });
  });
};

// Create and render Macronutrient chart
// First set the chartInstance to null so it can be destroyed and recreated as needed
let chartInstance = null;
const renderChart = () => {
  // Destroy old instance of the chart if it exists
  chartInstance?.destroy();

  const context = document.querySelector("#app-chart").getContext("2d");

  chartInstance = new Chart(context, {
    type: "bar",
    data: {
      labels: ["Carbs", "Protein", "Fat"],
      datasets: [
        {
          label: "Macronutrients",
          data: [
            appData.getTotal("carbs"),
            appData.getTotal("protein"),
            appData.getTotal("fat"),
          ],
          backgroundColor: ["#25AEEE", "#FECD52", "#57D269"],
          borderWidth: 3,
        },
      ],
    },
    options: {
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
          },
        ],
      },
    },
  });
};

init();
