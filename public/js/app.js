const pages = [
  ["dashboard", "dashboard", "Dashboard"],
  ["products", "inventory_2", "Products"],
  ["plan", "shopping_cart", "Buy Plan"],
  ["prices", "trending_up", "Prices"],
  ["recommendations", "lightbulb", "Suggestions"],
  ["settings", "settings", "Settings"]
];

let state = { page: "dashboard" };
const WATCHLIST_KEY = "supplyit_watchlist";

function nav() {
  const el = document.getElementById("side-nav");
  const mainPages = pages.filter(([key]) => key !== "settings");
  el.innerHTML = mainPages.map(([key, icon, label]) => `<button data-page="${key}" class="nav-item flex items-center gap-3 ${state.page===key?"bg-primary-container text-on-primary-container rounded-lg px-4 py-3 scale-[0.98] transition-transform":"text-on-surface-variant px-4 py-3 hover:bg-surface-container-high transition-colors"}"><span class="material-symbols-outlined" ${state.page===key?"style=\"font-variation-settings: 'FILL' 1;\"":""}>${icon}</span><span class="font-label-md text-label-md">${label}</span></button>`).join("");
  el.querySelectorAll(".nav-item").forEach((b)=>b.addEventListener("click",()=>route(b.dataset.page)));
  document.querySelectorAll(".mobile-nav").forEach((b)=>b.addEventListener("click",()=>route(b.dataset.page)));
}

async function api(path, options) { const r = await fetch(`/api/${path}`, options); return r.json(); }

function card(title, value, sub) {
  return `<div class="bg-surface border border-outline-variant p-lg rounded-xl soft-lift"><div class="text-xs text-on-surface-variant uppercase">${title}</div><div class="text-2xl font-semibold mt-2">${value}</div><div class="mt-2 text-sm text-on-surface-variant">${sub}</div></div>`;
}

function getWatchlist() {
  try {
    return JSON.parse(localStorage.getItem(WATCHLIST_KEY) || "[]");
  } catch {
    return [];
  }
}

function setWatchlist(ids) {
  localStorage.setItem(WATCHLIST_KEY, JSON.stringify(ids));
}

function sparklineSvg(series = []) {
  const vals = series.map((s) => Number(s.price)).filter((v) => Number.isFinite(v));
  if (vals.length < 2) return `<span class="text-xs text-on-surface-variant">n/a</span>`;
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const range = max - min || 1;
  const points = vals.map((v, i) => {
    const x = (i / (vals.length - 1)) * 80;
    const y = 24 - ((v - min) / range) * 20;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
  return `<svg width="84" height="24" viewBox="0 0 84 24" class="inline-block"><polyline fill="none" stroke="#0d631b" stroke-width="2" points="${points}" /></svg>`;
}

async function renderDashboard() {
  const d = await api("dashboard");
  const prices = await api("prices");
  const recs = d.recommendations || [];
  const tracked = d.summary?.trackedCommodities ?? d.market?.length ?? 0;
  const avg = d.summary?.avgChange ?? (recs.length ? Number((recs.reduce((s, r) => s + Number(r.changePct || 0), 0) / recs.length).toFixed(2)) : 0);
  const gainers = d.summary?.priceUp ?? recs.filter((r) => Number(r.changePct || 0) > 0).length;
  const buys = d.summary?.quickBuy ?? recs.filter((r) => r.action === "BUY").length;
  return `<section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter mb-xl">
    <button data-drill="products" class="text-left bg-surface border border-outline-variant p-lg rounded-xl soft-lift"><div class="flex items-center justify-between"><div class="text-xs text-on-surface-variant uppercase">Tracked Commodities</div><span class="material-symbols-outlined text-secondary">inventory_2</span></div><div class="text-2xl font-semibold mt-2">${tracked}</div><div class="mt-2 text-sm text-on-surface-variant">From DA vegetables feed</div></button>
    <div class="bg-surface border border-outline-variant p-lg rounded-xl soft-lift"><div class="flex items-center justify-between"><div class="text-xs text-on-surface-variant uppercase">Average Weekly Change</div><span class="material-symbols-outlined text-tertiary">swap_vert</span></div><div class="text-2xl font-semibold mt-2">${avg > 0 ? "+" : ""}${Number(avg).toFixed(2)}%</div><div class="mt-2 text-sm text-on-surface-variant">Across monitored products</div></div>
    <button data-drill="gainers" class="text-left bg-surface border border-outline-variant p-lg rounded-xl soft-lift"><div class="flex items-center justify-between"><div class="text-xs text-on-surface-variant uppercase">Price Gainers</div><span class="material-symbols-outlined text-primary">trending_up</span></div><div class="text-2xl font-semibold mt-2">${gainers}</div><div class="mt-2 text-sm text-on-surface-variant">Open positive movers</div></button>
    <button data-drill="buys" class="text-left bg-surface border border-outline-variant p-lg rounded-xl soft-lift"><div class="flex items-center justify-between"><div class="text-xs text-on-surface-variant uppercase">Actionable Buys</div><span class="material-symbols-outlined text-primary">shopping_basket</span></div><div class="text-2xl font-semibold mt-2">${buys}</div><div class="mt-2 text-sm text-on-surface-variant">Open BUY suggestions</div></button>
  </section>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-gutter">
    <div class="bg-surface border border-outline-variant rounded-xl p-lg soft-lift"><h2 class="text-xl font-semibold mb-3 inline-flex items-center gap-2"><span class="material-symbols-outlined text-primary">lightbulb</span>Top Recommendations</h2>${recs.slice(0,4).map(r=>{ const chip = actionChip(r.action); return `<div class="p-3 border border-outline-variant rounded-lg mb-2"><div class="flex justify-between items-center"><div class="inline-flex items-center gap-2"><span class="material-symbols-outlined text-primary">${productIcon({name:r.productName,commodityGroup:r.productName})}</span><strong>${r.productName}</strong></div><span class="px-2 py-1 rounded-full text-xs font-semibold ${chip.cls}">${chip.label}</span></div><p class="text-sm text-on-surface-variant mb-2">Qty: ${r.quantity} | ${verbalMarketSignal(r.changePct)}</p><div class="flex flex-wrap gap-2"><button data-rec-action="${r.productId}|BUY" class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-primary-fixed text-on-primary-fixed text-xs"><span class="material-symbols-outlined text-[14px]">check_circle</span>Approve</button><button data-rec-action="${r.productId}|HOLD" class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-surface-container-high text-on-surface-variant text-xs"><span class="material-symbols-outlined text-[14px]">pause_circle</span>Hold</button><button data-rec-action="${r.productId}|DELAY" class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant text-xs"><span class="material-symbols-outlined text-[14px]">schedule</span>Delay</button><button data-send-plan="${r.productId}" class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full border border-outline-variant text-xs"><span class="material-symbols-outlined text-[14px]">send</span>Send to Buy Plan</button></div></div>`;}).join("") || `<p class="text-sm text-on-surface-variant">No recommendation data yet.</p>`}</div>
    <div class="bg-surface border border-outline-variant rounded-xl p-lg soft-lift"><h2 class="text-xl font-semibold mb-3 inline-flex items-center gap-2"><span class="material-symbols-outlined text-secondary">query_stats</span>Market Summary</h2><div class="space-y-2">${(d.market || []).slice(0,5).map(m=>{ const full=[...(prices.rows||[])].find(p=>p.productName===m.productName); return `<div class="p-3 border border-outline-variant rounded-lg"><div class="flex items-center justify-between"><div class="inline-flex items-center gap-2"><span class="material-symbols-outlined text-primary">${productIcon({name:m.productName,commodityGroup:m.productName})}</span><span class="font-semibold">${m.productName}</span></div><span class="text-sm font-semibold">₱${Number(m.currentPrice||0).toFixed(2)}</span></div><div class="mt-2 flex items-center justify-between"><span class="text-xs text-on-surface-variant">${verbalMarketSignal(m.changePct)}</span><span>${sparklineSvg(full?.series||[])}</span></div></div>`;}).join("") || `<div class="text-sm text-on-surface-variant">No market data yet.</div>`}</div></div>
  </div>`;
}

function table(rows, headers) {
  return `<div class="bg-surface border border-outline-variant rounded-xl p-lg soft-lift overflow-x-auto"><table class="w-full text-sm"><thead><tr>${headers.map(h=>`<th class="text-left text-on-surface-variant py-2">${h}</th>`).join("")}</tr></thead><tbody>${rows.map(r=>`<tr class="border-t border-outline-variant">${r.map(c=>`<td class="py-2">${c}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
}

function productIcon(product) {
  const n = `${product.name} ${product.commodityGroup}`.toLowerCase();
  if (n.includes("rice")) return "grain";
  if (n.includes("garlic")) return "nutrition";
  if (n.includes("ginger")) return "spa";
  if (n.includes("tomato")) return "eco";
  if (n.includes("potato")) return "compost";
  if (n.includes("cabbage")) return "yard";
  return "inventory_2";
}

function productStatus(product) {
  if (product.stockQty <= product.lowStockThreshold) {
    return { label: "Top-up/Priority", cls: "bg-[#DCEDC8] text-[#33691E]" };
  }
  if (product.stockQty <= product.lowStockThreshold * 1.25) {
    return { label: "Wait/Pending", cls: "bg-[#FFECB3] text-[#5D4037]" };
  }
  return { label: "Hold/Inactive", cls: "bg-[#F5F5F5] text-[#424242]" };
}

function verbalMarketSignal(changePct) {
  const v = Number(changePct || 0);
  if (v >= 3) return "Prices are moving up";
  if (v <= -3) return "Prices are easing down";
  return "Prices are mostly stable";
}

function actionChip(action) {
  if (action === "BUY") return { label: "BUY", cls: "bg-primary-fixed text-on-primary-fixed" };
  if (action === "DELAY") return { label: "DELAY", cls: "bg-tertiary-fixed text-on-tertiary-fixed-variant" };
  return { label: "HOLD", cls: "bg-surface-container-high text-on-surface-variant" };
}

function categoryChip(category) {
  const highland = String(category || "").toUpperCase().includes("HIGHLAND");
  return highland
    ? `<span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-secondary text-white">Highland</span>`
    : `<span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-primary-fixed text-on-primary-fixed">Lowland</span>`;
}

async function render() {
  nav();
  const app = document.getElementById("app");
  if (state.page === "dashboard") {
    app.innerHTML = await renderDashboard();
    const updateProduct = async (id, patch) => api(`products/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(patch) });
    document.querySelectorAll("[data-drill]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const t = btn.dataset.drill;
        if (t === "gainers") {
          localStorage.setItem("drill_prices", "GAINERS");
          route("prices");
          return;
        }
        if (t === "buys") {
          localStorage.setItem("drill_reco", "BUY");
          route("recommendations");
          return;
        }
        route("products");
      });
    });
    document.querySelectorAll("[data-rec-action]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const [id, action] = btn.dataset.recAction.split("|");
        await updateProduct(id, { manualAction: action });
        route("dashboard");
      });
    });
    document.querySelectorAll("[data-send-plan]").forEach((btn) => {
      btn.addEventListener("click", () => {
        localStorage.setItem("plan_focus_product", btn.dataset.sendPlan);
        route("plan");
      });
    });
  }
  if (state.page === "products") {
    const data = await api("products");
    const allProducts = await api("products?includeArchived=1");
    const archivedProducts = (allProducts || []).filter((p) => p.archived);
    const recPayload = await api("recommendations");
    const recMap = new Map((recPayload.rows || []).map((r) => [r.productId, r]));
    const pricesPayload = await api("prices");
    const priceMap = new Map((pricesPayload.rows || []).map((r) => [r.productId, r]));
    const decisionFilterChips = [
      { key: "ALL", label: "All" },
      { key: "BUY", label: "BUY" },
      { key: "HOLD", label: "HOLD" },
      { key: "DELAY", label: "DELAY" },
      { key: "LOW_STOCK", label: "Low Stock" }
    ];
    app.innerHTML = `
      <header class="mb-xl">
        <h1 class="text-headline-lg font-headline-lg text-on-surface">Products</h1>
        <p class="text-body-lg text-on-surface-variant">Manage monitored DA commodities and act on buy/hold/delay signals.</p>
      </header>
      <div class="mb-4 flex flex-wrap gap-2" id="decision-filters">
        ${decisionFilterChips.map((f, idx) => `<button data-filter="${f.key}" class="decision-filter px-3 py-1.5 rounded-full text-sm ${idx === 0 ? "bg-primary text-white" : "bg-surface-container-high text-on-surface-variant"}">${f.label}</button>`).join("")}
      </div>
      <div class="mb-4 bg-surface border border-outline-variant rounded-xl p-3 flex flex-wrap items-center gap-2" id="bulk-bar">
        <span class="text-sm text-on-surface-variant mr-2">Bulk actions:</span>
        <button data-bulk="HOLD" class="bulk-action px-3 py-1 rounded-lg bg-surface-container-high text-on-surface-variant text-sm">Set HOLD</button>
        <button data-bulk="BUY" class="bulk-action px-3 py-1 rounded-lg bg-primary-fixed text-on-primary-fixed text-sm">Set BUY</button>
        <button data-bulk="DELAY" class="bulk-action px-3 py-1 rounded-lg bg-tertiary-fixed text-on-tertiary-fixed-variant text-sm">Set DELAY</button>
        <button data-bulk="LOW_STOCK_120" class="bulk-action px-3 py-1 rounded-lg border border-outline-variant text-sm">Reorder Level 120</button>
        <span id="selected-count" class="ml-auto text-sm text-on-surface-variant">0 selected</span>
      </div>
      <div class="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
        <div class="p-lg flex flex-col sm:flex-row justify-between gap-4 items-center bg-surface-container-low border-b border-outline-variant">
          <div class="relative w-full sm:max-w-xs">
            <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-md">search</span>
            <input id="products-search" class="w-full bg-surface border border-outline-variant rounded-lg py-2 pl-10 pr-4 text-body-md focus:ring-2 focus:ring-primary focus:border-transparent transition-all" placeholder="Search products..." type="text">
          </div>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-surface-container-low border-b border-outline-variant">
                <th class="px-lg py-4 text-label-md text-on-surface-variant uppercase tracking-wider">Select</th>
                <th class="px-lg py-4 text-label-md text-on-surface-variant uppercase tracking-wider">Product Name</th>
                <th class="px-lg py-4 text-label-md text-on-surface-variant uppercase tracking-wider">Category</th>
                <th class="px-lg py-4 text-label-md text-on-surface-variant uppercase tracking-wider">Stock Level</th>
                <th class="px-lg py-4 text-label-md text-on-surface-variant uppercase tracking-wider">Price (PHP/kg)</th>
                <th class="px-lg py-4 text-label-md text-on-surface-variant uppercase tracking-wider">Indicator</th>
                <th class="px-lg py-4 text-label-md text-on-surface-variant uppercase tracking-wider">Guidance</th>
                <th class="px-lg py-4 text-label-md text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody id="products-body" class="divide-y divide-outline-variant">
              ${data.map((p) => {
                const rec = recMap.get(p.id);
                const chip = actionChip(rec?.action);
                const lowStock = Number(p.stockQty || 0) <= Number(p.lowStockThreshold || 0);
                const priceRow = priceMap.get(p.id);
                const actionText = rec?.action || "HOLD";
                return `<tr class="hover:bg-surface-container-low transition-colors group product-row">
                  <td class="px-lg py-4"><input type="checkbox" class="row-select" data-id="${p.id}" /></td>
                  <td class="px-lg py-4">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 rounded-lg bg-surface-container-high flex-shrink-0 flex items-center justify-center">
                        <span class="material-symbols-outlined text-primary">${productIcon(p)}</span>
                      </div>
                      <span class="font-label-md text-on-surface">${p.name}</span>
                    </div>
                  </td>
                  <td class="px-lg py-4 text-body-md text-on-surface">${categoryChip(p.commodityGroup)}</td>
                  <td class="px-lg py-4 text-body-md text-on-surface">${p.stockQty} ${p.unit} <span class="text-xs text-on-surface-variant">(Reorder ${p.lowStockThreshold})</span></td>
                  <td class="px-lg py-4 text-body-md text-on-surface">₱${Number(p.pricePerUnit).toFixed(2)}</td>
                  <td class="px-lg py-4"><button data-explain="${p.id}" class="explain-chip inline-flex items-center px-3 py-1 rounded-full text-label-sm font-bold ${chip.cls}">${chip.label}</button></td>
                  <td class="px-lg py-4 text-body-md text-on-surface-variant">${verbalMarketSignal(rec?.changePct)}</td>
                  <td class="px-lg py-4 text-right">
                    <div class="inline-flex gap-1">
                      <button data-detail="${p.id}" class="p-2 hover:bg-surface-container-high rounded-full transition-colors text-on-surface-variant" title="Details"><span class="material-symbols-outlined">visibility</span></button>
                      <button data-stock="${p.id}" class="p-2 hover:bg-surface-container-high rounded-full transition-colors text-on-surface-variant" title="Adjust Stock"><span class="material-symbols-outlined">edit</span></button>
                      <button data-alias="${p.id}" class="p-2 hover:bg-surface-container-high rounded-full transition-colors text-on-surface-variant" title="Rename Alias"><span class="material-symbols-outlined">drive_file_rename_outline</span></button>
                      <button data-archive="${p.id}" class="p-2 hover:bg-surface-container-high rounded-full transition-colors text-on-surface-variant" title="Archive"><span class="material-symbols-outlined">archive</span></button>
                    </div>
                  </td>
                </tr>`;
              }).join("")}
            </tbody>
          </table>
        </div>
        <div class="p-lg flex flex-col sm:flex-row justify-between items-center gap-4 bg-surface-container-low border-t border-outline-variant">
          <p class="text-label-sm text-on-surface-variant">Showing 1 to ${data.length} of ${data.length} products</p>
          <div class="flex items-center gap-2">
            <button class="p-2 border border-outline-variant rounded hover:bg-surface transition-colors disabled:opacity-50" disabled><span class="material-symbols-outlined">chevron_left</span></button>
            <button class="px-4 py-2 bg-primary text-white rounded text-label-md">1</button>
            <button class="p-2 border border-outline-variant rounded hover:bg-surface transition-colors"><span class="material-symbols-outlined">chevron_right</span></button>
          </div>
        </div>
      </div>
      <div class="mt-4">
        <button
          id="open-archived-page"
          class="w-full rounded-xl border border-outline-variant bg-surface-container-lowest hover:bg-surface-container-high transition-colors px-4 py-4 flex items-center gap-4 text-left"
        >
          <div class="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center flex-shrink-0">
            <span class="material-symbols-outlined text-on-surface-variant">archive</span>
          </div>
          <div class="min-w-0">
            <div class="text-label-md font-semibold text-on-surface">Archived Products</div>
            <div class="text-sm text-on-surface-variant">View hidden commodities and restore them back to active monitoring.</div>
          </div>
          <span class="material-symbols-outlined ml-auto text-on-surface-variant">chevron_right</span>
        </button>
      </div>
      <div id="product-modal" class="hidden fixed inset-0 z-[80] bg-black/30 items-center justify-center p-4">
        <div class="bg-surface w-full max-w-xl rounded-xl border border-outline-variant p-5">
          <div class="flex items-center justify-between mb-3">
            <h3 id="modal-title" class="text-xl font-semibold">Details</h3>
            <button id="modal-close" class="p-1 rounded hover:bg-surface-container-high"><span class="material-symbols-outlined">close</span></button>
          </div>
          <div id="modal-body" class="text-sm text-on-surface-variant"></div>
        </div>
      </div>
    `;

    const selected = new Set();
    let activeFilter = "ALL";
    const searchInput = document.getElementById("products-search");
    const rows = [...document.querySelectorAll("#products-body tr")];
    const selectedCount = document.getElementById("selected-count");
    const modal = document.getElementById("product-modal");
    const modalBody = document.getElementById("modal-body");
    const modalTitle = document.getElementById("modal-title");
    const showModal = (title, html) => {
      modalTitle.textContent = title;
      modalBody.innerHTML = html;
      modal.classList.remove("hidden");
      modal.classList.add("flex");
    };
    document.getElementById("modal-close")?.addEventListener("click", () => {
      modal.classList.add("hidden");
      modal.classList.remove("flex");
    });
    modal?.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.add("hidden");
        modal.classList.remove("flex");
      }
    });

    const evaluateRowVisibility = (row) => {
      const q = (searchInput?.value || "").toLowerCase();
      const id = row.querySelector(".row-select")?.dataset.id;
      const rec = recMap.get(id);
      const prod = data.find((p) => p.id === id);
      const action = rec?.action || "HOLD";
      const lowStock = Number(prod?.stockQty || 0) <= Number(prod?.lowStockThreshold || 0);
      const textMatch = row.innerText.toLowerCase().includes(q);
      const filterMatch =
        activeFilter === "ALL"
        || activeFilter === action
        || (activeFilter === "LOW_STOCK" && lowStock);
      row.style.display = textMatch && filterMatch ? "" : "none";
    };

    searchInput?.addEventListener("input", (e) => {
      rows.forEach((row) => evaluateRowVisibility(row));
    });
    rows.forEach((row) => evaluateRowVisibility(row));

    document.querySelectorAll(".decision-filter").forEach((btn) => {
      btn.addEventListener("click", () => {
        activeFilter = btn.dataset.filter;
        document.querySelectorAll(".decision-filter").forEach((b) => {
          b.className = `decision-filter px-3 py-1.5 rounded-full text-sm ${b.dataset.filter === activeFilter ? "bg-primary text-white" : "bg-surface-container-high text-on-surface-variant"}`;
        });
        rows.forEach((row) => evaluateRowVisibility(row));
      });
    });

    document.querySelectorAll(".row-select").forEach((cb) => {
      cb.addEventListener("change", () => {
        if (cb.checked) selected.add(cb.dataset.id);
        else selected.delete(cb.dataset.id);
        selectedCount.textContent = `${selected.size} selected`;
      });
    });

    const updateProduct = async (id, patch) => api(`products/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(patch) });

    document.querySelectorAll(".bulk-action").forEach((btn) => {
      btn.addEventListener("click", async () => {
        if (!selected.size) return;
        const ids = [...selected];
        if (btn.dataset.bulk === "LOW_STOCK_120") {
          await Promise.all(ids.map((id) => updateProduct(id, { lowStockThreshold: 120 })));
        } else {
          await Promise.all(ids.map((id) => updateProduct(id, { manualAction: btn.dataset.bulk })));
        }
        route("products");
      });
    });

    document.querySelectorAll("[data-stock]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const id = btn.dataset.stock;
        const prod = data.find((p) => p.id === id);
        const qty = window.prompt(`Set stock for ${prod.name} (${prod.unit})`, String(prod.stockQty || 0));
        if (qty == null) return;
        await updateProduct(id, { stockQty: Number(qty) || 0 });
        route("products");
      });
    });
    document.querySelectorAll("[data-alias]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const id = btn.dataset.alias;
        const prod = data.find((p) => p.id === id);
        const alias = window.prompt(`Display name for ${prod.name}`, prod.name);
        if (alias == null) return;
        await updateProduct(id, { alias });
        route("products");
      });
    });
    document.querySelectorAll("[data-archive]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const id = btn.dataset.archive;
        const prod = data.find((p) => p.id === id);
        const ok = window.confirm(`Archive ${prod.name}? It will be hidden from products list.`);
        if (!ok) return;
        await updateProduct(id, { archived: true });
        route("products");
      });
    });
    document.getElementById("open-archived-page")?.addEventListener("click", () => route("archived"));

    document.querySelectorAll("[data-detail]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.detail;
        const prod = data.find((p) => p.id === id);
        const rec = recMap.get(id);
        const price = priceMap.get(id);
        const series = price?.series || [];
        const bars = series.map((s) => `${s.weekStart}: ₱${Number(s.price).toFixed(2)}`).join("<br>");
        showModal(`${prod.name} Details`, `
          <div class="space-y-2">
            <div><strong>Current Action:</strong> ${rec?.action || "HOLD"}</div>
            <div><strong>Guidance:</strong> ${verbalMarketSignal(rec?.changePct)}</div>
            <div><strong>Stock:</strong> ${prod.stockQty} ${prod.unit} (Reorder ${prod.lowStockThreshold})</div>
            <div><strong>Recent Weekly Prices:</strong><br>${bars || "No series available"}</div>
          </div>
        `);
      });
    });

    document.querySelectorAll(".explain-chip").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.explain;
        const rec = recMap.get(id);
        const price = priceMap.get(id);
        const votes = price?.votes || {};
        const trendText = votes.regression === "UP" ? "Regression sees upward price direction." : "Regression sees downward price direction.";
        const treeText = votes.decisionTree === "HIGH DEMAND"
          ? "Decision Tree indicates high demand from recent drop pattern."
          : votes.decisionTree === "LOW DEMAND"
            ? "Decision Tree indicates low demand from recent rise pattern."
            : "Decision Tree indicates neutral demand.";
        const knnText = `kNN matched historical pattern: ${votes.knn || "UNAVAILABLE"}.`;
        showModal("Why this indicator", `
          <div class="space-y-2">
            <div><strong>Final Action:</strong> ${rec?.action || "HOLD"}</div>
            <div>${treeText}</div>
            <div>${trendText}</div>
            <div>${knnText}</div>
            <div><strong>Final vote:</strong> ${price?.demand || "UNAVAILABLE"}</div>
          </div>
        `);
      });
    });

    rows.forEach((row) => {
      row.addEventListener("mouseenter", () => { row.style.boxShadow = "inset 0 0 10px rgba(0,0,0,0.02)"; });
      row.addEventListener("mouseleave", () => { row.style.boxShadow = "none"; });
    });
  }
  if (state.page === "archived") {
    const allProducts = await api("products?includeArchived=1");
    const archivedProducts = (allProducts || []).filter((p) => p.archived);
    app.innerHTML = `
      <header class="mb-xl">
        <h1 class="text-headline-lg font-headline-lg text-on-surface">Archived Products</h1>
        <p class="text-body-lg text-on-surface-variant">Review archived commodities and restore them when needed.</p>
      </header>
      <div class="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-surface-container-low border-b border-outline-variant">
                <th class="px-lg py-4 text-label-md text-on-surface-variant uppercase tracking-wider">Product Name</th>
                <th class="px-lg py-4 text-label-md text-on-surface-variant uppercase tracking-wider">Category</th>
                <th class="px-lg py-4 text-label-md text-on-surface-variant uppercase tracking-wider">Price (PHP/kg)</th>
                <th class="px-lg py-4 text-label-md text-on-surface-variant uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-outline-variant">
              ${archivedProducts.length ? archivedProducts.map((p) => `
                <tr class="hover:bg-surface-container-low transition-colors">
                  <td class="px-lg py-4">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center">
                        <span class="material-symbols-outlined text-on-surface-variant">${productIcon(p)}</span>
                      </div>
                      <span class="font-label-md text-on-surface">${p.name}</span>
                    </div>
                  </td>
                  <td class="px-lg py-4 text-body-md text-on-surface">${categoryChip(p.commodityGroup)}</td>
                  <td class="px-lg py-4 text-body-md text-on-surface">₱${Number(p.pricePerUnit).toFixed(2)}</td>
                  <td class="px-lg py-4 text-right">
                    <button data-unarchive="${p.id}" class="px-3 py-1.5 rounded-lg border border-outline-variant hover:bg-surface-container-high text-sm">Unarchive</button>
                  </td>
                </tr>
              `).join("") : `<tr><td colspan="4" class="px-lg py-4 text-on-surface-variant text-sm">No archived products.</td></tr>`}
            </tbody>
          </table>
        </div>
      </div>
      <div class="mt-4">
        <button id="back-products" class="px-4 py-2 rounded-lg border border-outline-variant hover:bg-surface-container-high text-sm">Back to Products</button>
      </div>
    `;
    const updateProduct = async (id, patch) => api(`products/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(patch) });
    document.querySelectorAll("[data-unarchive]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        await updateProduct(btn.dataset.unarchive, { archived: false });
        route("archived");
      });
    });
    document.getElementById("back-products")?.addEventListener("click", () => route("products"));
  }
  if (state.page === "plan") {
    const products = await api("products");
    const recPayload = await api("recommendations");
    const recMap = new Map((recPayload.rows || []).map((r) => [r.productId, r]));
    const savedBudget = Number(localStorage.getItem("plan_budget_php") || 150000);
    const savedRegion = localStorage.getItem("plan_region") || "NCR";
    const savedScenario = localStorage.getItem("plan_scenario") || "Base";
    const versions = JSON.parse(localStorage.getItem("plan_versions") || "[]");
    const focusProductId = localStorage.getItem("plan_focus_product");
    localStorage.removeItem("plan_focus_product");

    const scenarioMultiplier = { Base: 1, Conservative: 0.85, Aggressive: 1.15 };
    const makeItems = (scenario) => products.map((prod) => {
      const rec = recMap.get(prod.id);
      const action = rec?.action || "HOLD";
      const base = Math.max(Number(prod.lowStockThreshold || 100), 80);
      const actionBoost = action === "BUY" ? 1.4 : action === "DELAY" ? 0.6 : 1;
      const suggested = Math.round(base * actionBoost * (scenarioMultiplier[scenario] || 1));
      const qty = focusProductId === prod.id ? Math.max(suggested, 250) : suggested;
      return { ...prod, qty, suggested, action };
    });
    const items = makeItems(savedScenario);

    app.innerHTML = `
      <div class="max-w-[1100px] mx-auto p-container-margin md:p-xl space-y-xl pb-36">
        <section class="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 class="font-headline-lg text-headline-lg text-on-background">Create Buy Plan</h1>
            <p class="font-body-md text-body-md text-on-surface-variant">Strategize your stock purchases using budget + demand signals.</p>
          </div>
          <div class="flex items-center gap-2">
            <button id="auto-allocate" class="px-4 py-2 rounded-lg bg-primary text-white text-sm inline-flex items-center gap-1"><span class="material-symbols-outlined text-[16px]">auto_awesome</span>Auto Allocate</button>
            <button id="save-version" class="px-4 py-2 rounded-lg border border-outline-variant text-sm inline-flex items-center gap-1"><span class="material-symbols-outlined text-[16px]">bookmark_add</span>Save Version</button>
            <select id="version-select" class="px-3 py-2 rounded-lg border border-outline-variant text-sm bg-surface">
              <option value="">Load Version</option>
              ${versions.map((v, i) => `<option value="${i}">${v.name}</option>`).join("")}
            </select>
          </div>
        </section>
        <section class="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
          <div class="lg:col-span-8 bg-surface-container-lowest border border-outline-variant p-lg rounded-xl shadow-sm space-y-md">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-md">
              <div class="space-y-unit"><label class="text-label-md font-label-md text-on-surface-variant">Current Budget</label><div class="relative"><span class="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">₱</span><input id="plan-budget" class="w-full pl-8 pr-4 py-3 rounded-lg border border-outline focus:border-primary focus:ring-1 focus:ring-primary bg-white text-body-md" type="text" value="${savedBudget.toLocaleString()}" placeholder="Enter budget"></div></div>
              <div class="space-y-unit"><label class="text-label-md font-label-md text-on-surface-variant">Target Region</label><select id="plan-region" class="w-full px-4 py-3 rounded-lg border border-outline focus:border-primary focus:ring-1 focus:ring-primary bg-white text-body-md"><option ${savedRegion === "NCR" ? "selected" : ""}>NCR</option><option ${savedRegion === "CAR" ? "selected" : ""}>CAR</option></select></div>
              <div class="space-y-unit"><label class="text-label-md font-label-md text-on-surface-variant">Scenario</label><select id="plan-scenario" class="w-full px-4 py-3 rounded-lg border border-outline focus:border-primary focus:ring-1 focus:ring-primary bg-white text-body-md"><option ${savedScenario === "Base" ? "selected" : ""}>Base</option><option ${savedScenario === "Conservative" ? "selected" : ""}>Conservative</option><option ${savedScenario === "Aggressive" ? "selected" : ""}>Aggressive</option></select></div>
            </div>
          </div>
          <div class="lg:col-span-4 bg-surface-container border border-outline-variant p-lg rounded-xl">
            <div class="flex items-center gap-2 mb-2 text-primary"><span class="material-symbols-outlined">psychology</span><span class="font-label-md">AI Plan Insight</span></div>
            <p id="plan-ai-insight" class="font-body-md text-body-md text-on-surface-variant">Preparing insight...</p>
          </div>
        </section>
        <section class="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
          <div class="overflow-x-auto">
            <table class="w-full border-collapse">
              <thead><tr class="bg-surface-container border-b border-outline-variant"><th class="px-md py-4 text-left font-label-md text-on-surface-variant tracking-wider uppercase text-[12px]">Product</th><th class="px-md py-4 text-left font-label-md text-on-surface-variant tracking-wider uppercase text-[12px]">Signal</th><th class="px-md py-4 text-left font-label-md text-on-surface-variant tracking-wider uppercase text-[12px]">Suggested</th><th class="px-md py-4 text-left font-label-md text-on-surface-variant tracking-wider uppercase text-[12px]">My Qty</th><th class="px-md py-4 text-right font-label-md text-on-surface-variant tracking-wider uppercase text-[12px]">Cost</th><th class="px-md py-4 text-center font-label-md text-on-surface-variant tracking-wider uppercase text-[12px]">Quick Actions</th></tr></thead>
              <tbody id="plan-body" class="divide-y divide-outline-variant">
                ${items.map((i) => {
                  const chip = actionChip(i.action);
                  return `<tr class="hover:bg-surface-container-low transition-colors group" data-item="${i.id}">
                    <td class="px-md py-md"><div class="flex items-center gap-3"><div class="w-12 h-12 rounded-lg bg-surface-container flex-shrink-0 flex items-center justify-center"><span class="material-symbols-outlined text-primary text-[24px]">${productIcon(i)}</span></div><div><div class="font-label-md text-on-surface">${i.name}</div><div class="text-label-sm text-on-surface-variant">₱ ${Number(i.pricePerUnit).toFixed(2)} / ${i.unit}</div></div></div></td>
                    <td class="px-md py-md"><span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${chip.cls}">${chip.label}</span></td>
                    <td class="px-md py-md"><div class="inline-flex items-center px-2 py-1 bg-primary-fixed text-on-primary-fixed rounded text-label-sm font-semibold">${i.suggested} ${i.unit}</div></td>
                    <td class="px-md py-md"><input data-product="${i.id}" class="plan-qty w-24 px-3 py-1.5 border border-outline rounded focus:ring-1 focus:ring-primary text-body-md" type="number" min="0" value="${i.qty}"></td>
                    <td class="px-md py-md text-right font-label-md text-on-surface plan-cost" data-cost="${i.id}">₱ ${(i.qty * Number(i.pricePerUnit)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td class="px-md py-md"><div class="flex justify-center gap-1"><button data-qaction="${i.id}|SUGGESTED" class="w-8 h-8 rounded border border-outline text-xs">S</button><button data-qaction="${i.id}|ZERO" class="w-8 h-8 rounded border border-outline text-xs">0</button><button data-qaction="${i.id}|PLUS10" class="w-8 h-8 rounded border border-outline text-xs">+10</button><button data-qaction="${i.id}|MINUS10" class="w-8 h-8 rounded border border-outline text-xs">-10</button></div></td>
                  </tr>`;
                }).join("")}
              </tbody>
            </table>
          </div>
        </section>
      </div>
      <footer class="fixed bottom-0 left-0 right-0 bg-surface-container-lowest border-t border-outline-variant z-40 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
        <div class="max-w-[1100px] mx-auto px-container-margin py-4 space-y-3">
          <div id="budget-warning" class="hidden px-3 py-2 rounded-lg bg-error-container text-on-error-container text-sm inline-flex items-center gap-1"><span class="material-symbols-outlined text-[16px]">warning</span>Plan exceeds budget. Reduce quantities before saving.</div>
          <div class="flex flex-col md:flex-row justify-between items-center gap-4">
            <div class="flex gap-8 items-center flex-wrap">
              <div class="flex flex-col"><span class="text-label-sm text-on-surface-variant uppercase">Total Cost</span><span id="plan-total" class="text-headline-sm font-bold text-on-background">₱ 0.00</span></div>
              <div class="h-10 w-[1px] bg-outline-variant hidden md:block"></div>
              <div class="flex flex-col"><span class="text-label-sm text-on-surface-variant uppercase">Budget Remaining</span><span id="plan-remaining" class="text-headline-sm font-bold text-primary">₱ 0.00</span></div>
              <div class="h-10 w-[1px] bg-outline-variant hidden md:block"></div>
              <div class="flex flex-col"><span class="text-label-sm text-on-surface-variant uppercase">Approval Summary</span><span id="approval-summary" class="text-sm text-on-surface-variant">-</span></div>
            </div>
            <div class="flex gap-4 w-full md:w-auto">
              <button class="flex-1 md:flex-none px-6 py-3 rounded-xl border border-outline font-label-md text-on-surface-variant hover:bg-surface-container transition-colors">Export PDF</button>
              <button class="flex-1 md:flex-none px-10 py-3 rounded-xl bg-primary text-white font-headline-sm shadow-md hover:bg-primary-container active:scale-95 transition-all flex items-center justify-center gap-2" id="savePlan"><span class="material-symbols-outlined">save</span>Save Plan</button>
            </div>
          </div>
        </div>
      </footer>
    `;

    let working = items.map((x) => ({ ...x }));
    const qtyInputs = [...document.querySelectorAll(".plan-qty")];
    const budgetInput = document.getElementById("plan-budget");
    const totalEl = document.getElementById("plan-total");
    const remEl = document.getElementById("plan-remaining");
    const warningEl = document.getElementById("budget-warning");
    const summaryEl = document.getElementById("approval-summary");
    const aiInsightEl = document.getElementById("plan-ai-insight");

    const getBudget = () => Number(String(budgetInput.value).replace(/,/g, "")) || 0;
    const scenario = () => document.getElementById("plan-scenario").value;

    const recompute = () => {
      const budget = getBudget();
      localStorage.setItem("plan_budget_php", String(budget));
      localStorage.setItem("plan_region", document.getElementById("plan-region").value);
      localStorage.setItem("plan_scenario", scenario());
      let total = 0;
      let buyCount = 0;
      let holdCount = 0;
      let delayCount = 0;
      const expensive = [];

      working.forEach((it) => {
        const input = qtyInputs.find((x) => x.dataset.product === it.id);
        it.qty = Number(input?.value || 0);
        const cost = it.qty * Number(it.pricePerUnit);
        total += cost;
        if (it.action === "BUY") buyCount += 1;
        if (it.action === "HOLD") holdCount += 1;
        if (it.action === "DELAY") delayCount += 1;
        expensive.push({ name: it.name, cost });
        const costNode = document.querySelector(`[data-cost="${it.id}"]`);
        if (costNode) costNode.textContent = `₱ ${cost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      });

      const remaining = budget - total;
      totalEl.textContent = `₱ ${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      remEl.textContent = `₱ ${Math.max(0, remaining).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      remEl.className = `text-headline-sm font-bold ${remaining < 0 ? "text-error" : "text-primary"}`;
      warningEl.classList.toggle("hidden", remaining >= 0);

      const topDrivers = expensive.sort((a, b) => b.cost - a.cost).slice(0, 3).map((x) => x.name).join(", ");
      summaryEl.textContent = `BUY ${buyCount} | HOLD ${holdCount} | DELAY ${delayCount} | Top cost: ${topDrivers || "-"}`;

      const utilization = budget > 0 ? (total / budget) : 0;
      const risk = delayCount > buyCount ? "lower-risk posture" : "growth posture";
      aiInsightEl.textContent = utilization > 1
        ? `Plan is over budget with a ${risk}. Cut high-cost items first: ${topDrivers || "none"}.`
        : `Plan is within budget (${Math.round(utilization * 100)}% utilized) using a ${risk}. Focus execution on BUY items first.`;
    };

    const applyScenario = () => {
      const sc = scenario();
      working = makeItems(sc);
      working.forEach((it) => {
        const input = qtyInputs.find((x) => x.dataset.product === it.id);
        if (input) input.value = String(it.suggested);
        const row = document.querySelector(`tr[data-item="${it.id}"]`);
        if (row) {
          const chipNode = row.querySelector("td:nth-child(2) span");
          const sugNode = row.querySelector("td:nth-child(3) div");
          if (chipNode) {
            const chip = actionChip(it.action);
            chipNode.textContent = chip.label;
            chipNode.className = `inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${chip.cls}`;
          }
          if (sugNode) sugNode.textContent = `${it.suggested} ${it.unit}`;
        }
      });
      recompute();
    };

    qtyInputs.forEach((i) => i.addEventListener("input", recompute));
    budgetInput?.addEventListener("input", recompute);
    document.getElementById("plan-region")?.addEventListener("change", recompute);
    document.getElementById("plan-scenario")?.addEventListener("change", applyScenario);

    document.getElementById("auto-allocate")?.addEventListener("click", () => {
      const budget = getBudget();
      let weights = working.map((it) => ({ ...it, weight: it.action === "BUY" ? 3 : it.action === "HOLD" ? 2 : 1 }));
      const totalWeightCost = weights.reduce((s, w) => s + (w.weight * Number(w.pricePerUnit)), 0) || 1;
      weights.forEach((w) => {
        const targetCost = (budget * w.weight * Number(w.pricePerUnit)) / totalWeightCost;
        const qty = Math.max(0, Math.round(targetCost / Number(w.pricePerUnit)));
        const input = qtyInputs.find((x) => x.dataset.product === w.id);
        if (input) input.value = String(qty);
      });
      recompute();
    });

    document.querySelectorAll("[data-qaction]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const [id, op] = btn.dataset.qaction.split("|");
        const item = working.find((x) => x.id === id);
        const input = qtyInputs.find((x) => x.dataset.product === id);
        if (!item || !input) return;
        let q = Number(input.value || 0);
        if (op === "SUGGESTED") q = item.suggested;
        if (op === "ZERO") q = 0;
        if (op === "PLUS10") q = Math.round(q * 1.1);
        if (op === "MINUS10") q = Math.max(0, Math.round(q * 0.9));
        input.value = String(q);
        recompute();
      });
    });

    document.getElementById("save-version")?.addEventListener("click", () => {
      const name = window.prompt("Version name", `Plan ${new Date().toLocaleString()}`);
      if (!name) return;
      const payload = {
        name,
        at: new Date().toISOString(),
        budget: getBudget(),
        region: document.getElementById("plan-region").value,
        scenario: scenario(),
        rows: working.map((w) => ({ id: w.id, qty: Number(qtyInputs.find((x) => x.dataset.product === w.id)?.value || 0) }))
      };
      const next = [...versions, payload];
      localStorage.setItem("plan_versions", JSON.stringify(next));
      route("plan");
    });

    document.getElementById("version-select")?.addEventListener("change", (e) => {
      const idx = Number(e.target.value);
      if (!Number.isFinite(idx)) return;
      const v = versions[idx];
      if (!v) return;
      budgetInput.value = Number(v.budget || 0).toLocaleString();
      document.getElementById("plan-region").value = v.region || "NCR";
      document.getElementById("plan-scenario").value = v.scenario || "Base";
      applyScenario();
      (v.rows || []).forEach((r) => {
        const input = qtyInputs.find((x) => x.dataset.product === r.id);
        if (input) input.value = String(r.qty);
      });
      recompute();
    });

    const saveBtn = document.getElementById("savePlan");
    saveBtn?.addEventListener("click", () => {
      const budget = getBudget();
      const total = working.reduce((s, it) => {
        const q = Number(qtyInputs.find((x) => x.dataset.product === it.id)?.value || 0);
        return s + q * Number(it.pricePerUnit);
      }, 0);
      if (total > budget) {
        warningEl.classList.remove("hidden");
        return;
      }
      const original = saveBtn.innerHTML;
      saveBtn.innerHTML = '<span class="material-symbols-outlined animate-spin">sync</span> Saving...';
      saveBtn.disabled = true;
      setTimeout(() => {
        saveBtn.innerHTML = '<span class="material-symbols-outlined">check_circle</span> Plan Saved!';
        setTimeout(() => {
          saveBtn.innerHTML = original;
          saveBtn.disabled = false;
        }, 1500);
      }, 900);
    });

    recompute();
  }
  if (state.page === "prices") {
    const pricePayload = await api("prices");
    let byChange = [...(pricePayload.rows || [])];
    const drill = localStorage.getItem("drill_prices");
    if (drill === "GAINERS") {
      byChange = byChange.filter((r) => Number(r.changePct || 0) > 0);
      localStorage.removeItem("drill_prices");
    }
    const topGainer = [...byChange].sort((a, b) => (b.changePct || 0) - (a.changePct || 0))[0];
    const topLoser = [...byChange].sort((a, b) => (a.changePct || 0) - (b.changePct || 0))[0];
    const volatility = byChange.some((x) => Math.abs(x.changePct || 0) > 10) ? "High" : byChange.some((x) => Math.abs(x.changePct || 0) > 5) ? "Medium" : "Low";

    app.innerHTML = `
      <section class="mb-xl">
        <h1 class="text-headline-lg font-headline-lg text-on-surface mb-2">Market Price Movements</h1>
        <p class="text-body-lg text-on-surface-variant">Real-time agricultural commodity tracking across regional hubs.</p>
        <div class="mt-2 inline-flex items-center px-3 py-1 rounded-full bg-surface-container-high text-on-surface-variant text-label-sm">Data Week: ${pricePayload.dataWeek || "N/A"}</div>
      </section>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-gutter mb-xl">
        <div class="bg-surface-container-lowest border border-outline-variant p-lg rounded-xl soft-lift flex flex-col justify-between">
          <div><div class="flex justify-between items-start mb-md"><span class="text-label-md text-on-surface-variant uppercase tracking-wider">Top Gainer</span><span class="material-symbols-outlined text-primary">arrow_upward</span></div><h3 class="text-headline-sm font-headline-sm mb-1">${topGainer?.productName || "N/A"}</h3></div>
          <div class="flex items-end gap-2"><span class="text-headline-md font-headline-md text-primary">${topGainer?.changePct > 0 ? "+" : ""}${Number(topGainer?.changePct || 0).toFixed(2)}%</span><span class="text-label-sm text-on-surface-variant mb-1">from last DA week</span></div>
        </div>
        <div class="bg-surface-container-lowest border border-outline-variant p-lg rounded-xl soft-lift flex flex-col justify-between">
          <div><div class="flex justify-between items-start mb-md"><span class="text-label-md text-on-surface-variant uppercase tracking-wider">Top Loser</span><span class="material-symbols-outlined text-error">arrow_downward</span></div><h3 class="text-headline-sm font-headline-sm mb-1">${topLoser?.productName || "N/A"}</h3></div>
          <div class="flex items-end gap-2"><span class="text-headline-md font-headline-md text-error">${Number(topLoser?.changePct || 0).toFixed(2)}%</span><span class="text-label-sm text-on-surface-variant mb-1">from last DA week</span></div>
        </div>
        <div class="bg-surface-container-lowest border border-outline-variant p-lg rounded-xl soft-lift flex flex-col justify-between">
          <div><div class="flex justify-between items-start mb-md"><span class="text-label-md text-on-surface-variant uppercase tracking-wider">Market Volatility</span><span class="material-symbols-outlined text-tertiary">speed</span></div><h3 class="text-headline-sm font-headline-sm mb-1">${volatility}</h3></div>
          <div class="flex items-end gap-2"><span class="text-body-md text-on-surface-variant">Last updated just now</span></div>
        </div>
      </div>
      <div class="flex flex-col md:flex-row justify-between items-center gap-4 mb-lg">
        <div class="relative w-full md:w-96"><span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span><input id="price-search" class="w-full bg-surface border border-outline-variant rounded-lg pl-12 pr-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-body-md" placeholder="Search products or regions..." type="text"/></div>
        <div class="flex gap-2 w-full md:w-auto">
          <button class="flex-1 md:flex-none flex items-center justify-center gap-2 border border-outline-variant bg-surface px-6 py-3 rounded-lg hover:bg-surface-container-high transition-colors font-label-md"><span class="material-symbols-outlined text-[20px]">filter_list</span> Filter</button>
          <button class="flex-1 md:flex-none flex items-center justify-center gap-2 border border-outline-variant bg-surface px-6 py-3 rounded-lg hover:bg-surface-container-high transition-colors font-label-md"><span class="material-symbols-outlined text-[20px]">download</span> Export</button>
        </div>
      </div>
      <div class="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden soft-lift mb-xl">
        <div class="overflow-x-auto no-scrollbar">
          <table class="w-full text-left border-collapse">
            <thead><tr class="bg-surface-container-low border-b border-outline-variant"><th class="px-lg py-4 text-label-md text-on-surface-variant uppercase tracking-wider">Product Name</th><th class="px-lg py-4 text-label-md text-on-surface-variant uppercase tracking-wider">Last Price (₱)</th><th class="px-lg py-4 text-label-md text-on-surface-variant uppercase tracking-wider">Current Price (₱)</th><th class="px-lg py-4 text-label-md text-on-surface-variant uppercase tracking-wider">Change (%)</th><th class="px-lg py-4 text-label-md text-on-surface-variant uppercase tracking-wider">Trend</th><th class="px-lg py-4 text-label-md text-on-surface-variant uppercase tracking-wider text-right">Action</th></tr></thead>
            <tbody id="prices-body" class="divide-y divide-outline-variant">
              ${byChange.map((r) => {
                const current = Number(r.currentPrice || 0);
                const last = Number(r.lastPrice || 0);
                const trendUp = r.changePct > 1;
                const stable = Math.abs(r.changePct) <= 1;
                return `<tr class="hover:bg-surface-container transition-colors price-row">
                  <td class="px-lg py-md"><div class="flex items-center gap-4"><div class="w-10 h-10 rounded-full bg-primary-container/10 flex items-center justify-center"><span class="material-symbols-outlined text-primary">${productIcon({ name: r.productName, commodityGroup: r.productName })}</span></div><span class="font-label-md text-on-surface">${r.productName}</span></div></td>
                  <td class="px-lg py-md font-body-md">${last ? last.toFixed(2) : "-"}</td>
                  <td class="px-lg py-md font-body-md font-bold">${current ? current.toFixed(2) : "-"}</td>
                  <td class="px-lg py-md font-body-md ${trendUp ? "text-primary" : stable ? "text-on-surface-variant" : "text-error"}">${r.changePct > 0 ? "+" : ""}${Number(r.changePct || 0).toFixed(2)}%</td>
                  <td class="px-lg py-md"><span class="px-3 py-1 ${trendUp ? "bg-[#d1e7dd] text-[#0f5132]" : stable ? "bg-surface-container-high text-on-surface-variant" : "bg-error-container text-on-error-container"} rounded-full text-label-sm font-bold inline-flex items-center gap-1"><span class="material-symbols-outlined text-[14px]">${trendUp ? "trending_up" : stable ? "horizontal_rule" : "trending_down"}</span>${trendUp ? "Going Up" : stable ? "Stable" : "Going Down"}</span></td>
                  <td class="px-lg py-md text-right"><button class="trade-btn bg-primary text-white font-label-md px-4 py-2 rounded-lg hover:opacity-90">Trade</button></td>
                </tr>`;
              }).join("")}
            </tbody>
          </table>
        </div>
      </div>
      <section class="relative overflow-hidden bg-primary-container text-on-primary rounded-2xl p-xl flex flex-col md:flex-row items-center justify-between gap-8 mb-xl">
        <div class="absolute inset-0 opacity-10 pointer-events-none" style="background-image: radial-gradient(circle at 2px 2px, white 1px, transparent 0); background-size: 24px 24px;"></div>
        <div class="relative z-10 text-center md:text-left"><h2 class="text-headline-md font-headline-md mb-2 text-on-primary-container">Master Your Inventory with Precision</h2><p class="text-body-md opacity-90 max-w-lg">Sync your trading decisions with local market data and optimize your profits using our predictive analytics tools.</p></div>
        <button class="relative z-10 bg-on-primary-container text-primary-container px-8 py-4 rounded-xl font-bold soft-lift hover:scale-105 transition-transform">Get Market Insights</button>
      </section>
      <footer class="bg-surface-container-lowest border-t border-outline-variant py-xl"><div class="flex flex-col md:flex-row justify-between items-center w-full px-container-margin max-w-[1280px] mx-auto"><div class="mb-4 md:mb-0"><span class="text-label-md font-label-md font-bold text-primary">SupplyIT</span><p class="text-label-sm text-on-surface-variant mt-1">© 2024 SupplyIT. Filipino Agricultural Decision Support.</p></div><div class="flex gap-8"><a class="text-label-sm text-on-surface-variant hover:text-secondary underline transition-colors" href="#">Help Center</a><a class="text-label-sm text-on-surface-variant hover:text-secondary underline transition-colors" href="#">Privacy Policy</a><a class="text-label-sm text-on-surface-variant hover:text-secondary underline transition-colors" href="#">Terms of Service</a></div></div></footer>
    `;

    const s = document.getElementById("price-search");
    const rows = [...document.querySelectorAll("#prices-body tr")];
    s?.addEventListener("input", (e) => {
      const q = e.target.value.toLowerCase();
      rows.forEach((row) => { row.style.display = row.innerText.toLowerCase().includes(q) ? "" : "none"; });
    });
    document.querySelectorAll(".trade-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        btn.style.transform = "scale(0.95)";
        setTimeout(() => { btn.style.transform = "scale(1)"; }, 100);
      });
    });
  }
  if (state.page === "demand") {
    const payload = await api("demand");
    const data = payload.rows || [];
    app.innerHTML = `<h1 class="text-2xl font-bold mb-4">Demand Estimation</h1><div class="mb-3 text-sm text-on-surface-variant">Data Week: ${payload.dataWeek || "N/A"}</div>${table(data.map(p=>[p.productName,p.demand]),["Product","Demand"])} `;
  }
  if (state.page === "recommendations") {
    const recoPayload = await api("recommendations");
    let data = recoPayload.rows || [];
    const drill = localStorage.getItem("drill_reco");
    if (drill === "BUY") {
      data = data.filter((r) => r.action === "BUY");
      localStorage.removeItem("drill_reco");
    }
    const rising = data.filter((d) => d.action === "BUY" || d.action === "TOP-UP");
    const top = rising[0] || data[0];
    const overallTrend = rising.length >= Math.ceil(Math.max(1, data.length / 2)) ? "Rising" : "Stable";
    const nextPeak = `Week ${40 + (new Date().getDate() % 4)}`;
    const avgChange = data.length ? (data.reduce((s, d) => s + Number(d.changePct || 0), 0) / data.length) : 0;
    const sortedUp = [...data].sort((a, b) => Number(b.changePct || 0) - Number(a.changePct || 0));
    const sortedDown = [...data].sort((a, b) => Number(a.changePct || 0) - Number(b.changePct || 0));

    app.innerHTML = `
      <section class="mb-xl">
        <h1 class="text-headline-lg font-headline-lg text-on-surface mb-2">Demand Estimation</h1>
        <p class="text-body-lg text-on-surface-variant">Predictive commodity analytics to optimize your inventory sourcing.</p>
        <div class="mt-2 inline-flex items-center px-3 py-1 rounded-full bg-surface-container-high text-on-surface-variant text-label-sm">Data Week: ${recoPayload.dataWeek || "N/A"}</div>
      </section>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-gutter mb-xl">
        <div class="bg-surface-container-lowest border border-outline-variant p-lg rounded-xl soft-lift flex flex-col justify-between">
          <div><div class="flex justify-between items-start mb-md"><span class="text-label-md text-on-surface-variant uppercase tracking-wider">Overall Demand Trend</span><span class="material-symbols-outlined text-primary">trending_up</span></div><h3 class="text-headline-sm font-headline-sm mb-1">${overallTrend}</h3></div>
          <div class="flex items-end gap-2"><span class="text-headline-md font-headline-md ${avgChange >= 0 ? "text-primary" : "text-error"}">${avgChange >= 0 ? "+" : ""}${avgChange.toFixed(2)}%</span><span class="text-label-sm text-on-surface-variant mb-1">latest DA week avg</span></div>
        </div>
        <div class="bg-surface-container-lowest border border-outline-variant p-lg rounded-xl soft-lift flex flex-col justify-between">
          <div><div class="flex justify-between items-start mb-md"><span class="text-label-md text-on-surface-variant uppercase tracking-wider">Top In-Demand Product</span><span class="material-symbols-outlined text-tertiary">inventory</span></div><h3 class="text-headline-sm font-headline-sm mb-1">${top?.productName || "N/A"}</h3></div>
          <div class="flex items-end gap-2"><span class="text-body-md text-on-surface-variant">Critical stock level suggested</span></div>
        </div>
        <div class="bg-surface-container-lowest border border-outline-variant p-lg rounded-xl soft-lift flex flex-col justify-between">
          <div><div class="flex justify-between items-start mb-md"><span class="text-label-md text-on-surface-variant uppercase tracking-wider">Next High-Demand Peak</span><span class="material-symbols-outlined text-secondary">event</span></div><h3 class="text-headline-sm font-headline-sm mb-1">${nextPeak}</h3></div>
          <div class="flex items-end gap-2"><span class="text-body-md text-on-surface-variant">Based on highest positive weekly movers</span></div>
        </div>
      </div>

      <section class="bg-surface-container-lowest border border-outline-variant p-lg rounded-xl soft-lift mb-xl">
        <div class="flex justify-between items-center mb-lg">
          <h3 class="font-headline-sm text-headline-sm">8-Week Demand Forecast (Metric Tons)</h3>
          <div class="flex gap-sm">
            <span class="inline-flex items-center gap-xs text-label-sm text-on-surface-variant"><span class="w-3 h-3 rounded-full bg-primary"></span> Historical</span>
            <span class="inline-flex items-center gap-xs text-label-sm text-on-surface-variant"><span class="w-3 h-3 rounded-full bg-secondary-container"></span> Forecasted</span>
          </div>
        </div>
        <div class="relative h-64 flex items-end justify-between gap-md border-l border-b border-outline-variant pb-xs pl-xs">
          <div class="w-full h-24 bg-primary-container/20 rounded-t-sm relative"><div class="absolute bottom-0 w-full h-3/4 bg-primary rounded-t-sm"></div></div>
          <div class="w-full h-32 bg-primary-container/20 rounded-t-sm relative"><div class="absolute bottom-0 w-full h-4/5 bg-primary rounded-t-sm"></div></div>
          <div class="w-full h-40 bg-primary-container/20 rounded-t-sm relative"><div class="absolute bottom-0 w-full h-1/2 bg-primary rounded-t-sm"></div></div>
          <div class="w-full h-48 bg-secondary-container/20 rounded-t-sm relative border-l border-dashed border-outline"><div class="absolute bottom-0 w-full h-3/5 bg-secondary-container rounded-t-sm"></div></div>
          <div class="w-full h-56 bg-secondary-container/20 rounded-t-sm relative"><div class="absolute bottom-0 w-full h-4/5 bg-secondary-container rounded-t-sm"></div></div>
          <div class="w-full h-64 bg-secondary-container/20 rounded-t-sm relative"><div class="absolute bottom-0 w-full h-full bg-secondary-container rounded-t-sm"></div></div>
          <div class="w-full h-56 bg-secondary-container/20 rounded-t-sm relative"><div class="absolute bottom-0 w-full h-2/3 bg-secondary-container rounded-t-sm"></div></div>
          <div class="w-full h-48 bg-secondary-container/20 rounded-t-sm relative"><div class="absolute bottom-0 w-full h-1/2 bg-secondary-container rounded-t-sm"></div></div>
        </div>
        <div class="flex justify-between mt-sm text-label-sm text-on-surface-variant"><span>W35</span><span>W36</span><span>W37</span><span class="font-bold text-outline">Today</span><span>W39</span><span>W40</span><span>W41</span><span>W42</span></div>
      </section>

      <section class="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden soft-lift mb-xl">
        <div class="p-lg border-b border-outline-variant flex flex-col sm:flex-row justify-between items-start sm:items-center gap-md">
          <h3 class="text-headline-sm font-headline-sm">Commodity Demand Breakdown</h3>
          <div class="flex gap-2 w-full sm:w-auto">
            <div class="relative flex-1 sm:w-64"><span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">search</span><input id="sugg-search" class="w-full bg-surface border border-outline-variant rounded-lg pl-10 pr-4 py-2 text-label-md focus:border-primary outline-none" placeholder="Search products..." type="text"/></div>
            <button class="flex items-center gap-2 border border-outline-variant bg-surface px-4 py-2 rounded-lg hover:bg-surface-container-high transition-colors font-label-md"><span class="material-symbols-outlined text-[20px]">filter_list</span> Filter</button>
          </div>
        </div>
        <div class="overflow-x-auto no-scrollbar">
          <table class="w-full text-left border-collapse">
            <thead><tr class="bg-surface-container-low border-b border-outline-variant"><th class="px-lg py-4 text-label-md text-on-surface-variant uppercase tracking-wider">Product Name</th><th class="px-lg py-4 text-label-md text-on-surface-variant uppercase tracking-wider">Current Demand</th><th class="px-lg py-4 text-label-md text-on-surface-variant uppercase tracking-wider">Forecast (Next Month)</th><th class="px-lg py-4 text-label-md text-on-surface-variant uppercase tracking-wider">Confidence Score</th><th class="px-lg py-4 text-label-md text-on-surface-variant uppercase tracking-wider">Estimated Volume Needed</th><th class="px-lg py-4 text-label-md text-on-surface-variant uppercase tracking-wider text-right">Action</th></tr></thead>
            <tbody id="sugg-body" class="divide-y divide-outline-variant">
              ${data.map((r) => {
                const risingRow = r.action === "BUY";
                const stable = r.action === "HOLD";
                const pct = `${r.changePct > 0 ? "+" : ""}${Number(r.changePct || 0).toFixed(2)}%`;
                const confidence = Number(r.confidence || 0);
                return `<tr class="hover:bg-surface-container transition-colors sugg-row">
                  <td class="px-lg py-md"><div class="flex items-center gap-4"><div class="w-10 h-10 rounded-full bg-primary-container/10 flex items-center justify-center"><span class="material-symbols-outlined text-primary">${productIcon({ name: r.productName, commodityGroup: r.productName })}</span></div><span class="font-label-md text-on-surface font-bold">${r.productName}</span></div></td>
                  <td class="px-lg py-md"><span class="px-3 py-1 ${r.demand === "HIGH DEMAND" ? "bg-error-container text-on-error-container" : r.demand === "NEUTRAL" ? "bg-surface-container-high text-on-surface-variant" : "bg-green-100 text-green-800"} rounded-full text-label-sm font-bold">${r.demand}</span></td>
                  <td class="px-lg py-md font-body-md ${r.changePct > 0 ? "text-primary font-bold" : Math.abs(r.changePct) <= 1 ? "text-on-surface-variant" : "text-error font-bold"}"><div class="flex items-center gap-1"><span class="material-symbols-outlined text-sm">${r.changePct > 0 ? "arrow_upward" : Math.abs(r.changePct) <= 1 ? "horizontal_rule" : "arrow_downward"}</span> ${pct}</div></td>
                  <td class="px-lg py-md"><div class="flex flex-col gap-1"><div class="w-32 h-2 bg-surface-container-high rounded-full overflow-hidden"><div class="${confidence > 85 ? "bg-primary" : confidence > 70 ? "bg-secondary-container" : "bg-amber-500"} h-full" style="width: ${confidence}%;"></div></div><span class="text-label-sm text-on-surface-variant">${confidence}% ${confidence > 85 ? "High" : "Moderate"}</span></div></td>
                  <td class="px-lg py-md font-body-md font-bold text-on-surface">${Number(r.quantity || 0).toLocaleString()} kg</td>
                  <td class="px-lg py-md text-right"><button class="${risingRow ? "bg-primary text-white" : "border border-outline-variant text-on-surface"} font-label-md px-4 py-2 rounded-lg hover:opacity-90">${risingRow ? "Buy Now" : "Hold"}</button></td>
                </tr>`;
              }).join("")}
            </tbody>
          </table>
        </div>
        <div class="p-lg border-t border-outline-variant bg-surface-container-low text-center"><button class="text-primary font-label-md flex items-center justify-center gap-xs mx-auto hover:underline">View All Commodity Predictions <span class="material-symbols-outlined">expand_more</span></button></div>
      </section>

      <section class="mb-xl">
        <h3 class="font-headline-sm text-headline-sm mb-gutter">AI Market Insights & Advisory</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
          <div class="bg-secondary-container/10 border-l-4 border-secondary p-md rounded-lg flex gap-md soft-lift"><span class="material-symbols-outlined text-secondary">info</span><div><p class="font-label-md font-bold text-on-secondary-container">Top Upward Mover</p><p class="text-label-sm text-on-surface-variant">${sortedUp[0]?.productName || "N/A"} at ${Number(sortedUp[0]?.changePct || 0).toFixed(2)}% weekly change.</p></div></div>
          <div class="bg-primary-container/10 border-l-4 border-primary p-md rounded-lg flex gap-md soft-lift"><span class="material-symbols-outlined text-primary">check_circle</span><div><p class="font-label-md font-bold text-primary">Best Buy Signal</p><p class="text-label-sm text-on-surface-variant">${rising[0]?.productName || "No strong buy signal this week"}.</p></div></div>
          <div class="bg-tertiary-container/10 border-l-4 border-tertiary p-md rounded-lg flex gap-md soft-lift"><span class="material-symbols-outlined text-tertiary">warning</span><div><p class="font-label-md font-bold text-tertiary">Top Downward Mover</p><p class="text-label-sm text-on-surface-variant">${sortedDown[0]?.productName || "N/A"} at ${Number(sortedDown[0]?.changePct || 0).toFixed(2)}% weekly change.</p></div></div>
          <div class="bg-secondary-container/10 border-l-4 border-secondary p-md rounded-lg flex gap-md soft-lift"><span class="material-symbols-outlined text-secondary">rocket_launch</span><div><p class="font-label-md font-bold text-on-secondary-container">Coverage Snapshot</p><p class="text-label-sm text-on-surface-variant">${data.length} DA commodities in active monitoring.</p></div></div>
        </div>
      </section>

      <section class="relative overflow-hidden bg-primary-container text-on-primary rounded-2xl p-xl flex flex-col md:flex-row items-center justify-between gap-8 mb-xl">
        <div class="absolute inset-0 opacity-10 pointer-events-none" style="background-image: radial-gradient(circle at 2px 2px, white 1px, transparent 0); background-size: 24px 24px;"></div>
        <div class="relative z-10 text-center md:text-left"><h2 class="text-headline-md font-headline-md mb-2 text-on-primary-container font-bold">Act on Predicted Demand Trends</h2><p class="text-body-md opacity-90 max-w-lg">Leverage our high-confidence forecasts to secure your supply chains before market fluctuations hit.</p></div>
        <button class="relative z-10 bg-on-primary-container text-primary-container px-8 py-4 rounded-xl font-bold soft-lift hover:scale-105 transition-transform">Download Full Forecast Report</button>
      </section>

      <footer class="bg-surface-container-lowest border-t border-outline-variant py-xl"><div class="flex flex-col md:flex-row justify-between items-center w-full px-container-margin max-w-[1280px] mx-auto"><div class="mb-4 md:mb-0 text-center md:text-left"><span class="text-label-md font-label-md font-bold text-primary">SupplyIT</span><p class="text-label-sm text-on-surface-variant mt-1">© 2024 SupplyIT. Filipino Agricultural Decision Support.</p></div><div class="flex gap-8"><a class="text-label-sm text-on-surface-variant hover:text-secondary underline transition-colors" href="#">Help Center</a><a class="text-label-sm text-on-surface-variant hover:text-secondary underline transition-colors" href="#">Privacy Policy</a><a class="text-label-sm text-on-surface-variant hover:text-secondary underline transition-colors" href="#">Terms of Service</a></div></div></footer>
    `;

    const srch = document.getElementById("sugg-search");
    const rows = [...document.querySelectorAll("#sugg-body tr")];
    srch?.addEventListener("input", (e) => {
      const q = e.target.value.toLowerCase();
      rows.forEach((row) => { row.style.display = row.innerText.toLowerCase().includes(q) ? "" : "none"; });
    });
    document.querySelectorAll("button").forEach((btn) => {
      btn.addEventListener("click", () => {
        btn.style.transform = "scale(0.95)";
        setTimeout(() => { btn.style.transform = "scale(1)"; }, 100);
      });
    });
  }
  if (state.page === "settings") {
    const s = await api("settings");
    app.innerHTML = `<h1 class="text-2xl font-bold mb-4">Settings</h1><pre class="bg-surface border border-outline-variant rounded-xl p-lg soft-lift text-sm">${JSON.stringify(s, null, 2)}</pre>`;
  }
  document.querySelectorAll('.soft-lift').forEach((card) => {
    card.onmouseenter = () => { card.style.transform = 'translateY(-2px)'; card.style.transition='transform .2s ease-out'; };
    card.onmouseleave = () => { card.style.transform = 'translateY(0)'; };
  });
}

function route(page) { state.page = page; render(); }
render();
