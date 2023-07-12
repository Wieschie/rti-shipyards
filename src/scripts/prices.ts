import { TabulatorFull as Tabulator } from 'tabulator-tables';

const iskFormatParams = { symbol: "", precision: false }
var dataLoaded = false;

var table = new Tabulator("#table", {
  importFormat: "array",
  columns: [
    { title: "Ship", field: "ship", sorter: "string", headerSort: true, minWidth: 100, width: 250, resizable: "header" },
    { title: "Corp Cost", field: "corp", sorter: "number", headerSort: true, formatter: "money", formatterParams: iskFormatParams, resizable: "header" },
    { title: "Contract Cost", field: "contract", sorter: "number", headerSort: true, formatter: "money", formatterParams: iskFormatParams, resizable: "header" },
    { title: "Notes", field: "notes", headerSort: false, resizable: "header" },
  ],
  initialSort: [
    { column: "corp", dir: "desc" }
  ],
  height: "100%",
  maxHeight: "100%",
  layout: "fitDataFill",
  placeholder: () => dataLoaded ? "No matching ships..." : "Loading pricing data...",
});

var filter_value = document.getElementById("filter-value") as HTMLInputElement;
document.getElementById("filter-clear").addEventListener("click", function () {
  filter_value.value = "";
  table.clearFilter();
});

filter_value.addEventListener("keyup", function() {
  table.setFilter("ship", "like", filter_value.value);
});

var xhr = new XMLHttpRequest();
xhr.open("GET", "https://docs.google.com/spreadsheets/d/e/2PACX-1vR_vyJQIfgyMQlaSkYyKn06diXmm3CHsz3KkEnde3pDAF0rXTmZfkToQTColscxaGLKrkaw-LWSpkE5/pub?gid=1545930268&single=true&output=tsv");
xhr.onload = function () {
  if (xhr.status === 200) {
    // split into rows, discarding the header
    let lines = xhr.responseText.split("\n").slice(1);
    // split each row into an array of values. parse the prices to ints
    let data = lines.map(row => {
      let arr: (string | number)[] = row.split("\t");
      arr[1] = parseInt(arr[1] as string);
      arr[2] = parseInt(arr[2] as string);
      return arr;
    });
    table.setData(data);
    dataLoaded = true;
  } else {
    console.log(xhr)
  }
};
xhr.send();