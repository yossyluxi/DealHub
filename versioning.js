// versioning.js
export let versions = [];

export function saveVersion(tableId = "deal-table") {
  const tableBody = document.querySelector(`#${tableId} tbody`);
  const rows = Array.from(tableBody.querySelectorAll("tr")).map((row) =>
    Array.from(row.querySelectorAll("td input")).map((input) => input.value),
  );

  const versionName = prompt("Enter version name:");
  if (versionName) {
    versions.push({ name: versionName, data: rows });
    updateVersionDropdown();
  }
}

export function loadVersion(versionIndex, tableId = "deal-table") {
  const tableBody = document.querySelector(`#${tableId} tbody`);
  tableBody.innerHTML = "";
  const version = versions[versionIndex];
  if (!version) return;

  version.data.forEach((row) => {
    const tr = document.createElement("tr");
    row.forEach((cell) => {
      const td = document.createElement("td");
      const input = document.createElement("input");
      input.className = "editable-cell";
      input.value = cell;
      td.appendChild(input);
      tr.appendChild(td);
    });
    tableBody.appendChild(tr);
  });
}

export function updateVersionDropdown(selectId = "version-select") {
  const dropdown = document.getElementById(selectId);
  if (!dropdown) return;

  dropdown.innerHTML = "";
  versions.forEach((v, i) => {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = v.name;
    dropdown.appendChild(option);
  });
}
