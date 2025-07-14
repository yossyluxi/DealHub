// ui-helpers.js
export function createMappingModal(columns, headers, onMapConfirm) {
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

  const selects = [];

  columns.forEach((colData, index) => {
    const div = document.createElement("div");
    div.innerHTML = `
      <strong>Column ${index + 1}</strong><br>
      <select id="map-col-${index}">
        ${headers.map((h) => `<option value="${h}">${h || "[Choose One]"}</option>`).join("")}
      </select>
      <pre>${colData.slice(0, 3).join("\n")}</pre>
      <hr>
    `;
    mapperDiv.appendChild(div);
    selects.push(`map-col-${index}`);
  });

  const button = document.createElement("button");
  button.textContent = "Map and Import";
  button.onclick = () => {
    const selected = selects.map((id) => {
      const el = document.getElementById(id);
      return el ? el.value : "";
    });
    document.body.removeChild(mapperDiv);
    onMapConfirm(selected);
  };
  mapperDiv.appendChild(button);

  return mapperDiv;
}
