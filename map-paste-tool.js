// map-paste-tool.js
let parsedColumns = [];
let selectedHeaders = [];

function mapPastedData() {
  const text = document.getElementById("map-box").value.trim();
  if (!text) return;

  const lines = text.split("\n").map((line) => line.split("\t"));
  const numCols = Math.max(...lines.map((line) => line.length));

  parsedColumns = Array.from({ length: numCols }, (_, i) =>
    lines.map((row) => row[i] || ""),
  );

  renderDropdownMapping();
}

function renderDropdownMapping() {
  const headers = [
    "",
    "SKU",
    "Model",
    "Description",
    "Color",
    "Size",
    "QTY",
    "MSRP",
    "Cost",
    "Buy Ext",
    "Price",
    "Sell Ext",
  ];
  const mapperDiv = document.createElement("div");
  mapperDiv.id = "mapping-modal";
  mapperDiv.style.position = "fixed";
  mapperDiv.style.top = "50%";
  mapperDiv.style.left = "50%";
  mapperDiv.style.transform = "translate(-50%, -50%)";
  mapperDiv.style.background = "#fff";
  mapperDiv.style.padding = "20px";
  mapperDiv.style.border = "1px solid #ccc";
  mapperDiv.style.zIndex = 1000;

  parsedColumns.forEach((colData, index) => {
    const div = document.createElement("div");
    div.innerHTML = `
      <strong>Column ${index + 1}</strong><br>
      <select id="header-select-${index}">
        ${headers.map((h) => `<option value="${h}">${h || "[Choose One]"}</option>`).join("")}
      </select>
      <pre>${colData.slice(0, 3).join("\n")}</pre>
      <hr>
    `;
    mapperDiv.appendChild(div);
  });

  const button = document.createElement("button");
  button.textContent = "Map and Import";
  button.onclick = () => {
    selectedHeaders = parsedColumns.map((_, i) => {
      const select = document.getElementById(`header-select-${i}`);
      return select ? select.value : "";
    });
    document.body.removeChild(mapperDiv);
    applySelectedMappings();
  };
  mapperDiv.appendChild(button);
  document.body.appendChild(mapperDiv);
}

function applySelectedMappings() {
  const tableBody = document.querySelector("#deal-table tbody");
  const existingRows = Array.from(tableBody.querySelectorAll("tr"));
  const rowCount = parsedColumns[0]?.length || 0;

  for (let r = 0; r < rowCount; r++) {
    let tr = existingRows[r];
    if (!tr) {
      tr = document.createElement("tr");
      for (let i = 0; i < 11; i++) {
        const td = document.createElement("td");
        const input = document.createElement("input");
        input.className = "editable-cell";
        td.appendChild(input);
        tr.appendChild(td);
      }
      tableBody.appendChild(tr);
    }

    const cells = tr.querySelectorAll("td input");
    selectedHeaders.forEach((h, c) => {
      const orderedHeaders = [
        "SKU",
        "Model",
        "Description",
        "Color",
        "Size",
        "QTY",
        "MSRP",
        "Cost",
        "Buy Ext",
        "Price",
        "Sell Ext",
      ];
      const index = orderedHeaders.indexOf(h);
      if (index !== -1) {
        cells[index].value = parsedColumns[c][r] || "";
      }
    });
  }

  document.getElementById("map-box").value = "";
  parsedColumns = [];
  selectedHeaders = [];
}
