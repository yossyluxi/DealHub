let expenses = [];
let editingIndex = null;

function addExpense() {
  const amount = parseFloat(document.getElementById("expense-amount").value);
  const type = document.getElementById("expense-type").value;
  if (!amount || amount <= 0) return;

  if (editingIndex !== null) {
    expenses[editingIndex] = { type, amount };
    editingIndex = null;
  } else {
    expenses.push({ type, amount });
  }

  document.getElementById("expense-amount").value = "";
  renderExpenses();
}

function editExpense(index) {
  const exp = expenses[index];
  document.getElementById("expense-amount").value = exp.amount;
  document.getElementById("expense-type").value = exp.type;
  editingIndex = index;
}

function removeExpense(index) {
  expenses.splice(index, 1);
  renderExpenses();
}

function renderExpenses() {
  const container = document.getElementById("expense-list");
  container.innerHTML = "";
  expenses.forEach((e, i) => {
    const div = document.createElement("div");
    div.className = "expense-row";
    div.innerHTML = `$${e.amount.toFixed(2)} — ${e.type} 
      <button onclick="editExpense(${i})">✏️</button>
      <button onclick="removeExpense(${i})">❌</button>`;
    container.appendChild(div);
  });
}

function getDealHeader() {
  const form = document.getElementById("deal-header-form");
  const formData = new FormData(form);
  return Object.fromEntries(formData.entries());
}

function parsePastedData() {
  const rawText = document.getElementById("paste-box").value.trim();
  if (!rawText) return;

  const lines = rawText.split("\n");
  const tableBody = document.querySelector("#deal-table tbody");
  tableBody.innerHTML = "";

  lines.forEach((line) => {
    const cells = line.split("\t");
    const row = document.createElement("tr");

    for (let i = 0; i < 11; i++) {
      const td = document.createElement("td");
      const input = document.createElement("input");
      input.className = "editable-cell";
      input.value = cells[i] || "";
      td.appendChild(input);
      row.appendChild(td);
    }

    tableBody.appendChild(row);
  });
}

function collectDealData() {
  const header = getDealHeader();
  const rows = document.querySelectorAll("#deal-table tbody tr");

  const lineItems = Array.from(rows).map((row) => {
    const cells = row.querySelectorAll("td input");
    return {
      sku: cells[0]?.value || "",
      model: cells[1]?.value || "",
      description: cells[2]?.value || "",
      color: cells[3]?.value || "",
      size: cells[4]?.value || "",
      qty: parseFloat(cells[5]?.value) || 0,
      msrp: parseFloat(cells[6]?.value) || 0,
      cost: parseFloat(cells[7]?.value) || 0,
      buyExtended: parseFloat(cells[8]?.value) || 0,
      price: parseFloat(cells[9]?.value) || 0,
      sellExtended: parseFloat(cells[10]?.value) || 0,
    };
  });

  return { header, lineItems };
}

function calculateDeal() {
  const { header, lineItems } = collectDealData();
  let totalBuy = 0,
    totalSell = 0;

  const custDisc =
    parseFloat(document.getElementById("cust-discount").value) || 0;
  const custDiscType = document.getElementById("cust-discount-type").value;
  const vendDisc =
    parseFloat(document.getElementById("vendor-discount").value) || 0;
  const vendDiscType = document.getElementById("vendor-discount-type").value;

  lineItems.forEach((item) => {
    let price = item.price;
    let cost = item.cost;

    if (custDiscType === "percent") {
      price -= price * (custDisc / 100);
    } else {
      price -= custDisc / (item.qty || 1);
    }

    if (vendDiscType === "percent") {
      cost -= cost * (vendDisc / 100);
    } else {
      cost -= vendDisc / (item.qty || 1);
    }

    totalBuy += cost * item.qty;
    totalSell += price * item.qty;
  });

  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
  const grossProfit = totalSell - totalBuy;
  const netProfit = grossProfit - totalExpense;
  const roi = totalBuy ? (grossProfit / totalBuy) * 100 : 0;
  const margin = totalSell ? (netProfit / totalSell) * 100 : 0;

  document.getElementById("total-expense").textContent =
    totalExpense.toFixed(2);
  document.getElementById("gross-profit").textContent = grossProfit.toFixed(2);
  document.getElementById("net-profit").textContent = netProfit.toFixed(2);
  document.getElementById("roi").textContent = roi.toFixed(2) + "%";
  document.getElementById("margin").textContent = margin.toFixed(2) + "%";
}
