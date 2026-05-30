let state = { page: "dashboard", currentPlanId: null };
const WATCHLIST_KEY = "supplyit_watchlist";
const SIDEBAR_STATE_KEY = "supplyit_sidebar_collapsed";
const LANG_KEY = "supplyit_lang";
const UI_I18N = {
  en: {
    nav: { dashboard: "Dashboard", products: "Products", plan: "Buy Plan", plans: "Plans", prices: "Prices", recommendations: "Suggestions", settings: "Settings" },
    dashboardTitle: "Dashboard",
    productsTitle: "Products",
    planTitle: "Create Buy Plan",
    pricesTitle: "Market Price Movements",
    suggestionsTitle: "Suggestions",
    savedPlansTitle: "Saved Plans"
  },
  tl: {
    nav: { dashboard: "Dashboard", products: "Mga Produkto", plan: "Buy Plan", plans: "Mga Plano", prices: "Mga Presyo", recommendations: "Mga Mungkahi", settings: "Settings" },
    dashboardTitle: "Dashboard",
    productsTitle: "Mga Produkto",
    planTitle: "Gumawa ng Buy Plan",
    pricesTitle: "Paggalaw ng Presyo sa Merkado",
    suggestionsTitle: "Mga Mungkahi",
    savedPlansTitle: "Mga Nai-save na Plano"
  }
};
const lang = () => localStorage.getItem(LANG_KEY) || "en";
const t = () => UI_I18N[lang()] || UI_I18N.en;
const TL_MAP = {
  "Dashboard": "Dashboard",
  "Products": "Mga Produkto",
  "Buy Plan": "Buy Plan",
  "Plans": "Mga Plano",
  "Prices": "Mga Presyo",
  "Suggestions": "Mga Mungkahi",
  "Settings": "Settings",
  "Manage monitored DA commodities and act on buy/hold/delay signals.": "Pamahalaan ang mga mino-monitor na commodity ng DA at kumilos gamit ang buy/hold/delay signals.",
  "Logout": "Mag-logout",
  "Search...": "Maghanap...",
  "Bulk actions:": "Maramihang aksyon:",
  "Tracked Commodities": "Mga Mino-monitor na Commodity",
  "Average Weekly Change": "Average na Lingguhang Pagbabago",
  "Price Gainers": "Mga Tumaas ang Presyo",
  "Actionable Buys": "Mga Maaaring Bilhin",
  "From DA vegetables feed": "Mula sa DA vegetables feed",
  "Across monitored products": "Sa lahat ng mino-monitor na produkto",
  "Open positive movers": "Buksan ang mga tumataas",
  "Open BUY suggestions": "Buksan ang BUY suggestions",
  "Top Recommendations": "Nangungunang Rekomendasyon",
  "Market Summary": "Buod ng Merkado",
  "Product Name": "Pangalan ng Produkto",
  "Price (₱)": "Presyo (₱)",
  "Stock Status": "Katayuan ng Stock",
  "Trend": "Trend",
  "Archived Products": "Naka-archive na Produkto",
  "Review archived commodities and restore them when needed.": "Suriin ang mga naka-archive na commodity at ibalik kung kinakailangan.",
  "Unarchive": "Ibalik mula archive",
  "Back to Products": "Bumalik sa Mga Produkto",
  "Saved Plans": "Mga Nai-save na Plano",
  "Create Plan": "Gumawa ng Plano",
  "Open/Edit": "Buksan/I-edit",
  "Duplicate": "Kopyahin",
  "Archive": "I-archive",
  "Delete": "Burahin",
  "Created": "Ginawa",
  "Updated": "Na-update",
  "Actions": "Mga Aksyon",
  "No saved plans yet.": "Wala pang nai-save na plano.",
  "No archived products.": "Walang naka-archive na produkto.",
  "Create Buy Plan": "Gumawa ng Buy Plan",
  "Open Saved Plans": "Buksan ang Nai-save na Plano",
  "Step 1: Set Budget": "Hakbang 1: Itakda ang Badyet",
  "Choose your plan style and let auto-allocation prepare quantities.": "Piliin ang estilo ng plano at hayaang auto-allocation ang maghanda ng dami.",
  "Step 2: Review Recommended Items": "Hakbang 2: Suriin ang Inirekumendang Items",
  "Adjust only what you need. Default view shows the highest-priority products.": "Ayusin lang ang kailangan. Ang default na view ay nagpapakita ng pinaka-prayoridad na produkto.",
  "Plan Name": "Pangalan ng Plano",
  "Budget": "Badyet",
  "Plan Style": "Estilo ng Plano",
  "Sort": "Ayos",
  "Auto Allocate": "Awtomatikong Hati",
  "Reset Recommended": "Ibalik sa Rekomendado",
  "Show more products": "Ipakita pa ang produkto",
  "Show fewer products": "Ipakita nang kaunti",
  "Plan Details": "Detalye ng Plano",
  "Plan Summary": "Buod ng Plano",
  "Plan Tip": "Tip sa Plano",
  "Draft not saved yet": "Hindi pa nai-save ang draft",
  "Saving draft...": "Sine-save ang draft...",
  "Draft auto-saved": "Awtomatikong na-save ang draft",
  "Draft autosave failed": "Hindi na-save ang draft",
  "Total": "Kabuuan",
  "Remaining": "Natitira",
  "Export CSV": "I-export CSV",
  "Export PDF": "I-export PDF",
  "Save Plan": "I-save ang Plano",
  "Confirm Save Plan": "Kumpirmahin ang Pag-save",
  "Cancel": "Kanselahin",
  "Confirm Save": "Kumpirmahin",
  "Within budget": "Pasok sa badyet",
  "Over budget by": "Lumampas sa badyet ng",
  "Fix Budget to Save": "Ayusin ang badyet para ma-save",
  "Saved": "Nai-save",
  "Save failed": "Nabigo ang pag-save",
  "Checking plan...": "Sinusuri ang plano...",
  "Market Price Movements": "Paggalaw ng Presyo sa Merkado",
  "Decision-first price monitoring for vegetable commodities.": "Pagmo-monitor ng presyo para sa vegetable commodities na nakatuon sa desisyon.",
  "Selected Commodity Trend": "Trend ng Napiling Commodity",
  "All": "Lahat",
  "Buy": "Bili",
  "Hold": "I-hold",
  "Delay": "I-delay",
  "BUY Now": "BILI Ngayon",
  "Search products...": "Maghanap ng produkto...",
  "Data week:": "Linggo ng data:",
  "4 weeks": "4 linggo",
  "8 weeks": "8 linggo",
  "12 weeks": "12 linggo",
  "Watch": "Subaybayan",
  "Product": "Produkto",
  "Category": "Kategorya",
  "Stock": "Stock",
  "Region": "Rehiyon",
  "Last": "Huling",
  "Current": "Kasalukuyan",
  "Trend": "Trend",
  "To Plan": "Sa Plano",
  "High Volatility": "Mataas ang galaw",
  "No series data.": "Walang series data.",
  "No series available": "Walang available na series",
  "Current Action:": "Kasalukuyang Aksyon:",
  "Recommended Action:": "Inirekomendang Aksyon:",
  "Recent Weekly Prices:": "Kamakailang Lingguhang Presyo:",
  "Market Signal:": "Signal sa Merkado:",
  "Final Action:": "Pinal na Aksyon:",
  "Demand Estimation": "Pagtataya ng Demand",
  "Demand": "Demand",
  "Action-ready recommendations from DA prices + model voting.": "Handang aksyon na rekomendasyon mula sa presyo ng DA at model voting.",
  "Data Week:": "Linggo ng Data:",
  "Urgent Actions": "Agarang Aksyon",
  "urgent": "agarang",
  "More filters": "Mas maraming filter",
  "High confidence only": "Mataas na kumpiyansa lang",
  "High impact only": "Mataas na epekto lang",
  "Search suggestions...": "Maghanap ng mungkahi...",
  "No matching suggestions.": "Walang tumugmang mungkahi.",
  "Show 10 more": "Magpakita pa ng 10",
  "Set BUY": "Itakda sa BILI",
  "Set HOLD": "Itakda sa HOLD",
  "Set DELAY": "Itakda sa DELAY",
  "Show details": "Ipakita ang detalye",
  "Send to Buy Plan": "Ipadala sa Buy Plan",
  "Apply Hold": "Ilapat ang Hold",
  "Apply Delay": "Ilapat ang Delay",
  "Price falling": "Bumababa ang presyo",
  "Low stock": "Mababa ang stock",
  "Trend up": "Pataas ang trend",
  "Rising": "Pataas",
  "Rising fast": "Mabilis na pagtaas",
  "Cooling": "Pababa",
  "Cooling fast": "Mabilis na pagbaba",
  "Stable": "Stable",
  "Prices are moving up": "Pataas ang presyo",
  "Prices are easing down": "Bumababa ang presyo",
  "Prices are mostly stable": "Kadalasang stable ang presyo",
  "Expect higher buy cost soon.": "Posibleng tumaas ang gastos sa pagbili.",
  "Good timing to monitor buys.": "Magandang panahon para bantayan ang bili.",
  "No major price pressure now.": "Walang malaking pressure sa presyo ngayon.",
  "horizontal_rule": "",
  "trending_up": "",
  "trending_down": "",
  "Stable trend": "Stable na trend",
  "Unchanged": "Walang pagbabago",
  "New signal": "Bagong signal",
  "Changed from": "Nagbago mula",
  "Confidence:": "Kumpiyansa:",
  "Impact:": "Epekto:",
  "Urgency:": "Agarang Kailangan:",
  "Regression:": "Regression:",
  "Estimated volume:": "Tinatayang dami:",
  "How to use SupplyIT (Quick Steps)": "Paano Gamitin ang SupplyIT (Mabilis na Hakbang)",
  "No recommendation data yet.": "Wala pang recommendation data.",
  "No market data yet.": "Wala pang market data."
};
function localizeAppShell() {
  const appRoot = document.getElementById("app-shell");
  if (!appRoot) return;
  const toTL = lang() === "tl";
  const pairs = Object.entries(TL_MAP);
  const replacements = toTL ? pairs : pairs.map(([en, tl]) => [tl, en]);

  const walker = document.createTreeWalker(appRoot, NodeFilter.SHOW_TEXT);
  const textNodes = [];
  while (walker.nextNode()) textNodes.push(walker.currentNode);
  textNodes.forEach((node) => {
    let txt = node.nodeValue;
    if (!txt || !txt.trim()) return;
    replacements.forEach(([from, to]) => {
      if (txt.includes(from)) txt = txt.replaceAll(from, to);
    });
    node.nodeValue = txt;
  });
  document.querySelectorAll("#app-shell input[placeholder]").forEach((el) => {
    let ph = el.getAttribute("placeholder");
    if (!ph) return;
    replacements.forEach(([from, to]) => { if (ph.includes(from)) ph = ph.replaceAll(from, to); });
    el.setAttribute("placeholder", ph);
  });
}
const getPages = () => [
  ["dashboard", "dashboard", t().nav.dashboard],
  ["products", "inventory_2", t().nav.products],
  ["plan", "shopping_cart", t().nav.plan],
  ["plans", "folder_open", t().nav.plans],
  ["prices", "trending_up", t().nav.prices],
  ["recommendations", "lightbulb", t().nav.recommendations],
  ["settings", "settings", t().nav.settings]
];

function initSidebarCollapse() {
  const toggle = document.getElementById("sidebar-toggle");
  const label = document.getElementById("sidebar-toggle-label");
  const icon = document.getElementById("sidebar-toggle-icon");
  if (!toggle) return;
  const syncToggleUI = (collapsed) => {
    if (label) label.textContent = collapsed ? "Expand" : "Collapse";
    if (icon) icon.textContent = collapsed ? "left_panel_open" : "left_panel_close";
    const hint = collapsed ? "Expand sidebar" : "Collapse sidebar";
    toggle.title = hint;
    toggle.setAttribute("aria-label", hint);
  };
  const isCollapsed = localStorage.getItem(SIDEBAR_STATE_KEY) === "1";
  document.body.classList.toggle("nav-collapsed", isCollapsed);
  syncToggleUI(isCollapsed);
  toggle.onclick = () => {
    const next = !document.body.classList.contains("nav-collapsed");
    document.body.classList.toggle("nav-collapsed", next);
    localStorage.setItem(SIDEBAR_STATE_KEY, next ? "1" : "0");
    syncToggleUI(next);
  };
}

function nav() {
  const pages = getPages();
  const el = document.getElementById("side-nav");
  const mainPages = pages.filter(([key]) => key !== "settings" && key !== "plans");
  el.innerHTML = mainPages.map(([key, icon, label]) => `<button data-page="${key}" class="nav-item flex items-center gap-3 ${state.page===key?"bg-primary-container text-on-primary-container rounded-lg px-4 py-3 scale-[0.98] transition-transform":"text-on-surface-variant px-4 py-3 hover:bg-surface-container-high transition-colors"}"><span class="material-symbols-outlined" ${state.page===key?"style=\"font-variation-settings: 'FILL' 1;\"":""}>${icon}</span><span class="nav-label font-label-md text-label-md">${label}</span></button>`).join("");
  el.querySelectorAll(".nav-item").forEach((b)=>b.addEventListener("click",()=>route(b.dataset.page)));
  document.querySelectorAll(".mobile-nav").forEach((b)=>b.addEventListener("click",()=>route(b.dataset.page)));
  const plansBtn = document.getElementById("open-plans-btn");
  if (plansBtn) plansBtn.onclick = () => route("plans");
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
    <div class="bg-surface border border-outline-variant rounded-xl p-lg soft-lift"><h2 class="text-xl font-semibold mb-3 inline-flex items-center gap-2"><span class="material-symbols-outlined text-primary">lightbulb</span>Top Recommendations</h2>${recs.slice(0,4).map(r=>{ const chip = actionChip(r.action); return `<div class="p-3 border border-outline-variant rounded-lg mb-2"><div class="flex justify-between items-center"><div class="inline-flex items-center gap-2"><span class="material-symbols-outlined text-primary">${productIcon({name:r.productName,commodityGroup:r.productName})}</span><strong>${r.productName}</strong></div><span class="px-2 py-1 rounded-full text-xs font-semibold ${chip.cls}">${chip.label}</span></div><p class="text-sm text-on-surface-variant mb-2">Qty: ${r.quantity} | ${verbalMarketSignal(r.changePct)}</p><div class="flex flex-wrap gap-2"><button data-rec-action="${r.productId}|BUY" class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-primary-fixed text-on-primary-fixed"><span class="material-symbols-outlined text-[14px]">shopping_cart</span>Buy</button><button data-rec-action="${r.productId}|HOLD" class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-surface-container-high text-on-surface-variant"><span class="material-symbols-outlined text-[14px]">pause_circle</span>Hold</button><button data-rec-action="${r.productId}|DELAY" class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-tertiary-fixed text-on-tertiary-fixed-variant"><span class="material-symbols-outlined text-[14px]">schedule</span>Delay</button><button data-send-plan="${r.productId}" class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs border border-outline-variant"><span class="material-symbols-outlined text-[14px]">send</span>To Plan</button></div></div>`;}).join("") || `<p class="text-sm text-on-surface-variant">No recommendation data yet.</p>`}</div>
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

function guidanceMeta(changePct) {
  const v = Number(changePct || 0);
  if (v >= 3) {
    return {
      icon: "trending_up",
      short: "Rising",
      detail: "Expect higher buy cost soon.",
      cls: "bg-error-container/40 text-on-error-container border-error-container"
    };
  }
  if (v <= -3) {
    return {
      icon: "trending_down",
      short: "Cooling",
      detail: "Good timing to monitor buys.",
      cls: "bg-primary-fixed/60 text-on-primary-fixed border-primary-fixed-dim"
    };
  }
  return {
    icon: "horizontal_rule",
    short: "Stable",
    detail: "No major price pressure now.",
    cls: "bg-surface-container-high text-on-surface-variant border-outline-variant"
  };
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
  app.classList.remove("page-enter");
  // Restart entry animation on every route render.
  void app.offsetWidth;
  app.classList.add("page-enter");
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
        <h1 class="text-headline-lg font-headline-lg text-on-surface">${t().productsTitle}</h1>
        <p class="text-body-lg text-on-surface-variant">Manage monitored DA commodities and act on buy/hold/delay signals.</p>
      </header>
      <div class="mb-4" id="decision-filters">
        <div class="inline-flex rounded-xl border border-outline-variant overflow-hidden bg-surface">
          ${decisionFilterChips.map((f, idx) => `<button data-filter="${f.key}" class="decision-filter px-4 py-2 text-sm ${idx === 0 ? "bg-primary text-white" : "text-on-surface-variant"}">${f.label}</button>`).join("")}
        </div>
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
                const guide = guidanceMeta(rec?.changePct);
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
                  <td class="px-lg py-4">
                    <div class="inline-flex items-start gap-2 px-2.5 py-2 rounded-lg border ${guide.cls}">
                      <span class="material-symbols-outlined text-[16px] mt-[1px]">${guide.icon}</span>
                      <div class="leading-tight">
                        <div class="text-xs font-semibold">${guide.short}</div>
                        <div class="text-[11px] opacity-90">${guide.detail}</div>
                      </div>
                    </div>
                  </td>
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
          b.className = `decision-filter px-4 py-2 text-sm ${b.dataset.filter === activeFilter ? "bg-primary text-white" : "text-on-surface-variant"}`;
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
  if (state.page === "plans") {
    const plans = await api("plans");
    const fmt = (iso) => iso ? new Date(iso).toLocaleString() : "-";
    const badge = (status) => {
      if (status === "approved") return `<span class="px-2 py-1 rounded-full text-xs bg-primary-fixed text-on-primary-fixed">Approved</span>`;
      if (status === "archived") return `<span class="px-2 py-1 rounded-full text-xs bg-surface-container-high text-on-surface-variant">Archived</span>`;
      return `<span class="px-2 py-1 rounded-full text-xs bg-tertiary-fixed text-on-tertiary-fixed-variant">Draft</span>`;
    };
    app.innerHTML = `
      <header class="mb-xl">
        <h1 class="text-headline-lg font-headline-lg text-on-surface">${t().savedPlansTitle}</h1>
        <p class="text-body-lg text-on-surface-variant">Create, edit, duplicate, archive, and delete buying plans.</p>
      </header>
      <div class="mb-4">
        <button id="create-plan" class="bg-primary text-white px-4 py-2.5 rounded-lg inline-flex items-center gap-2">
          <span class="material-symbols-outlined text-[18px]">add</span>Create Plan
        </button>
      </div>
      <div class="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-surface-container-low border-b border-outline-variant">
                <th class="px-lg py-4 text-label-md text-on-surface-variant uppercase tracking-wider">Name</th>
                <th class="px-lg py-4 text-label-md text-on-surface-variant uppercase tracking-wider">Status</th>
                <th class="px-lg py-4 text-label-md text-on-surface-variant uppercase tracking-wider">Updated</th>
                <th class="px-lg py-4 text-label-md text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-outline-variant">
              ${plans.length ? plans.map((p) => `
                <tr class="hover:bg-surface-container-low transition-colors">
                  <td class="px-lg py-4">
                    <div class="font-label-md text-on-surface">${p.name || "Untitled Plan"}</div>
                    <div class="text-xs text-on-surface-variant">Created ${fmt(p.createdAt)}</div>
                  </td>
                  <td class="px-lg py-4">${badge(p.status)}</td>
                  <td class="px-lg py-4 text-sm text-on-surface-variant">${fmt(p.updatedAt)}</td>
                  <td class="px-lg py-4">
                    <div class="flex justify-end gap-2">
                      <button data-plan-open="${p.id}" class="px-3 py-1.5 rounded-lg border border-outline-variant text-sm inline-flex items-center gap-1"><span class="material-symbols-outlined text-[16px]">edit</span>Open/Edit</button>
                      <button data-plan-dup="${p.id}" class="px-3 py-1.5 rounded-lg border border-outline-variant text-sm inline-flex items-center gap-1"><span class="material-symbols-outlined text-[16px]">content_copy</span>Duplicate</button>
                      <button data-plan-archive="${p.id}" class="px-3 py-1.5 rounded-lg border border-outline-variant text-sm inline-flex items-center gap-1"><span class="material-symbols-outlined text-[16px]">archive</span>Archive</button>
                      <button data-plan-delete="${p.id}" class="px-3 py-1.5 rounded-lg border border-error-container text-on-error-container text-sm inline-flex items-center gap-1"><span class="material-symbols-outlined text-[16px]">delete</span>Delete</button>
                    </div>
                  </td>
                </tr>
              `).join("") : `<tr><td colspan="4" class="px-lg py-8 text-center text-on-surface-variant">No saved plans yet.</td></tr>`}
            </tbody>
          </table>
        </div>
      </div>
    `;
    document.getElementById("create-plan")?.addEventListener("click", () => {
      localStorage.removeItem("plan_edit_id");
      state.currentPlanId = null;
      route("plan");
    });
    document.querySelectorAll("[data-plan-open]").forEach((btn) => btn.addEventListener("click", () => {
      const id = btn.dataset.planOpen;
      localStorage.setItem("plan_edit_id", id);
      state.currentPlanId = id;
      route("plan");
    }));
    document.querySelectorAll("[data-plan-dup]").forEach((btn) => btn.addEventListener("click", async () => {
      await api(`plans/${btn.dataset.planDup}/duplicate`, { method: "POST" });
      route("plans");
    }));
    document.querySelectorAll("[data-plan-archive]").forEach((btn) => btn.addEventListener("click", async () => {
      await api(`plans/${btn.dataset.planArchive}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "archived" })
      });
      route("plans");
    }));
    document.querySelectorAll("[data-plan-delete]").forEach((btn) => btn.addEventListener("click", async () => {
      await api(`plans/${btn.dataset.planDelete}`, { method: "DELETE" });
      route("plans");
    }));
  }
  if (state.page === "plan") {
    const products = await api("products");
    const recPayload = await api("recommendations");
    const recMap = new Map((recPayload.rows || []).map((r) => [r.productId, r]));
    const planList = await api("plans");
    const editingPlanId = localStorage.getItem("plan_edit_id");
    const editingPlan = editingPlanId ? (planList || []).find((p) => p.id === editingPlanId) : null;
    if (editingPlanId && !editingPlan) localStorage.removeItem("plan_edit_id");
    const payload = editingPlan?.payload || {};
    const savedBudget = Number(payload.budget ?? localStorage.getItem("plan_budget_php") ?? 150000);
    const savedScenario = payload.scenario || localStorage.getItem("plan_scenario") || "Balanced";
    const savedPlanName = editingPlan?.name || payload.planName || `Plan ${new Date().toLocaleDateString()}`;
    const scenarioMultiplier = { Safe: 0.85, Balanced: 1, Growth: 1.15 };

    const seedItems = products.map((prod) => {
      const rec = recMap.get(prod.id);
      const action = rec?.action || "HOLD";
      const base = Math.max(Number(prod.lowStockThreshold || 100), 80);
      const actionBoost = action === "BUY" ? 1.4 : action === "DELAY" ? 0.6 : 1;
      const suggested = Math.round(base * actionBoost);
      return { ...prod, action, suggested, qty: suggested, priority: action === "BUY" ? 3 : action === "HOLD" ? 2 : 1 };
    }).sort((a, b) => b.priority - a.priority || a.name.localeCompare(b.name));

    let working = seedItems.map((x) => ({ ...x }));
    if (Array.isArray(payload.items) && payload.items.length) {
      const map = new Map(payload.items.map((it) => [it.id, it]));
      working = seedItems.map((x) => {
        const prev = map.get(x.id);
        return prev ? { ...x, qty: Number(prev.qty ?? x.qty), suggested: Number(prev.suggested ?? x.suggested), action: prev.action || x.action } : x;
      });
    }
    let expanded = Boolean(payload.expanded);
    let sortMode = payload.sortMode || "priority";
    let currentPlanId = editingPlan?.id || state.currentPlanId || null;
    state.currentPlanId = currentPlanId;

    app.innerHTML = `
      <div class="max-w-[1280px] mx-auto space-y-xl pb-[26rem] md:pb-[22rem]">
        <section class="mb-xl">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <h1 class="font-headline-lg text-headline-lg text-on-background">${t().planTitle}</h1>
            <button id="open-plans-inline" class="px-3 py-2 rounded-lg border border-outline-variant text-sm inline-flex items-center gap-1">
              <span class="material-symbols-outlined text-[16px]">folder_open</span>Open Saved Plans
            </button>
          </div>
          <p class="font-body-md text-body-md text-on-surface-variant">Set budget, review top BUY items, then save when status is green.</p>
        </section>
        <section class="bg-surface-container-lowest border border-outline-variant p-lg rounded-xl">
          <h2 class="font-semibold text-on-surface">Step 1: Set Budget</h2>
          <p class="text-sm text-on-surface-variant mb-3">Choose your plan style and let auto-allocation prepare quantities.</p>
          <div class="grid grid-cols-1 md:grid-cols-6 gap-5 items-end">
            <div><label class="text-sm text-on-surface-variant">Plan Name</label><input id="plan-name" class="w-full mt-1 px-3 py-2.5 rounded-lg border border-outline bg-white" value="${savedPlanName}"></div>
            <div><label class="text-sm text-on-surface-variant">Budget</label><div class="relative mt-1"><span class="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">₱</span><input id="plan-budget" class="w-full pl-8 pr-3 py-2.5 rounded-lg border border-outline bg-white" value="${savedBudget.toLocaleString()}"></div></div>
            <div><label class="text-sm text-on-surface-variant">Plan Style</label><select id="plan-scenario" class="w-full mt-1 px-3 py-2.5 rounded-lg border border-outline bg-white"><option ${savedScenario === "Safe" ? "selected" : ""}>Safe</option><option ${savedScenario === "Balanced" ? "selected" : ""}>Balanced</option><option ${savedScenario === "Growth" ? "selected" : ""}>Growth</option></select></div>
            <div><label class="text-sm text-on-surface-variant">Sort</label><select id="plan-sort" class="w-full mt-1 px-3 py-2.5 rounded-lg border border-outline bg-white"><option value="priority">Priority</option><option value="cost">Cost</option><option value="name">Name</option></select></div>
            <button id="auto-allocate" class="px-4 py-2.5 rounded-lg bg-primary text-white text-sm inline-flex items-center justify-center gap-1"><span class="material-symbols-outlined text-[16px]">auto_awesome</span>Auto Allocate</button>
            <button id="reset-plan" class="px-4 py-2.5 rounded-lg border border-outline-variant text-sm inline-flex items-center justify-center gap-1"><span class="material-symbols-outlined text-[16px]">restart_alt</span>Reset Recommended</button>
          </div>
        </section>
        <section>
          <h2 class="font-semibold text-on-surface">Step 2: Review Recommended Items</h2>
          <p class="text-sm text-on-surface-variant mb-3">Adjust only what you need. Default view shows the highest-priority products.</p>
          <div id="plan-cards" class="grid grid-cols-1 md:grid-cols-2 gap-5"></div>
          <div class="mt-4 flex justify-center">
            <button id="show-more-plan" class="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-outline-variant bg-surface hover:bg-surface-container-high text-sm text-on-surface-variant">
              <span id="show-more-label">Show more products</span>
              <span id="show-more-icon" class="material-symbols-outlined text-[18px]">keyboard_arrow_down</span>
            </button>
          </div>
        </section>
        <section class="bg-surface border border-outline-variant rounded-xl p-4 soft-lift">
          <details open class="group">
            <summary class="cursor-pointer flex items-center justify-between">
              <div class="inline-flex items-center gap-2">
                <span class="material-symbols-outlined text-secondary">summarize</span>
                <span class="text-base font-semibold text-on-surface">Plan Details</span>
              </div>
              <span class="material-symbols-outlined text-on-surface-variant transition-transform group-open:rotate-180">expand_more</span>
            </summary>
            <div class="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
              <div class="rounded-lg border border-outline-variant bg-surface-container-low p-3">
                <div class="text-sm uppercase text-on-surface-variant mb-1">Plan Summary</div>
                <div id="plan-breakdown" class="text-base text-on-surface-variant leading-relaxed"></div>
              </div>
              <div class="rounded-lg border border-outline-variant bg-surface-container-low p-3">
                <div class="text-sm uppercase text-on-surface-variant mb-1">Plan Tip</div>
                <div id="plan-ai" class="text-base text-on-surface-variant leading-relaxed"></div>
              </div>
            </div>
          </details>
        </section>
      </div>
      <footer id="plan-sticky" class="fixed bottom-0 left-0 right-0 md:left-64 md:w-[calc(100%-16rem)] bg-surface border-t border-outline-variant z-40">
        <div class="w-full px-5 md:px-8 py-4">
          <div id="save-status" class="mb-2 px-3.5 py-2 rounded-full text-sm inline-flex items-center gap-1 bg-surface-container-high text-on-surface-variant"><span class="material-symbols-outlined text-[16px]">info</span>Checking plan...</div>
          <div id="autosave-status" class="mb-3 text-xs text-on-surface-variant">Draft not saved yet</div>
          <div class="flex justify-between items-center gap-4 flex-wrap">
            <div class="flex gap-10 items-center">
              <div><div class="text-sm text-on-surface-variant">Total</div><div id="plan-total" class="text-xl font-bold text-on-surface tabular-nums">₱ 0.00</div></div>
              <div><div class="text-sm text-on-surface-variant">Remaining</div><div id="plan-remaining" class="text-xl font-bold text-primary tabular-nums">₱ 0.00</div></div>
            </div>
            <div class="flex items-center gap-2">
              <button id="export-csv" class="px-4 py-2.5 rounded-lg border border-outline-variant text-sm inline-flex items-center gap-1"><span class="material-symbols-outlined text-[16px]">download</span>Export CSV</button>
              <button id="export-pdf" class="px-4 py-2.5 rounded-lg border border-outline-variant text-sm inline-flex items-center gap-1"><span class="material-symbols-outlined text-[16px]">picture_as_pdf</span>Export PDF</button>
              <button id="savePlan" class="px-7 py-3 rounded-lg bg-primary text-white font-semibold inline-flex items-center gap-2"><span class="material-symbols-outlined">save</span>Save Plan</button>
            </div>
          </div>
        </div>
      </footer>
      <div id="save-confirm" class="hidden fixed inset-0 z-[90] bg-black/30 items-center justify-center p-4">
        <div class="bg-surface w-full max-w-lg rounded-xl border border-outline-variant p-5">
          <h3 class="text-lg font-semibold mb-2">Confirm Save Plan</h3>
          <div id="confirm-body" class="text-sm text-on-surface-variant mb-4"></div>
          <div class="flex justify-end gap-2">
            <button id="confirm-cancel" class="px-4 py-2 rounded-lg border border-outline-variant">Cancel</button>
            <button id="confirm-save" class="px-4 py-2 rounded-lg bg-primary text-white">Confirm Save</button>
          </div>
        </div>
      </div>
    `;

    const budgetInput = document.getElementById("plan-budget");
    const planNameInput = document.getElementById("plan-name");
    const scenarioEl = document.getElementById("plan-scenario");
    const cardsEl = document.getElementById("plan-cards");
    const showMoreBtn = document.getElementById("show-more-plan");
    const showMoreLabel = document.getElementById("show-more-label");
    const showMoreIcon = document.getElementById("show-more-icon");
    const sortEl = document.getElementById("plan-sort");
    const totalEl = document.getElementById("plan-total");
    const remEl = document.getElementById("plan-remaining");
    const saveStatusEl = document.getElementById("save-status");
    const breakdownEl = document.getElementById("plan-breakdown");
    const aiEl = document.getElementById("plan-ai");
    const saveBtn = document.getElementById("savePlan");
    const confirmModal = document.getElementById("save-confirm");
    const confirmBody = document.getElementById("confirm-body");
    const stickyEl = document.getElementById("plan-sticky");
    const autosaveStatusEl = document.getElementById("autosave-status");
    let autosaveTimer = null;
    sortEl.value = sortMode;

    const getBudget = () => Number(String(budgetInput.value).replace(/,/g, "")) || 0;
    const buildPlanPayload = () => ({
      planName: planNameInput.value.trim() || `Plan ${new Date().toLocaleDateString()}`,
      budget: getBudget(),
      scenario: scenarioEl.value,
      sortMode,
      expanded,
      items: working.map((it) => ({
        id: it.id,
        name: it.name,
        qty: Number(it.qty || 0),
        suggested: Number(it.suggested || 0),
        action: it.action,
        pricePerUnit: Number(it.pricePerUnit || 0),
        unit: it.unit
      }))
    });
    const persistPlan = async (status = "draft") => {
      const payloadSave = buildPlanPayload();
      const body = { name: payloadSave.planName, status, payload: payloadSave };
      let row;
      if (currentPlanId) {
        row = await api(`plans/${currentPlanId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        });
      } else {
        row = await api("plans", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        });
        currentPlanId = row?.id || currentPlanId;
        state.currentPlanId = currentPlanId;
        if (currentPlanId) localStorage.setItem("plan_edit_id", currentPlanId);
      }
      return row;
    };
    const scheduleAutosave = () => {
      autosaveStatusEl.textContent = "Saving draft...";
      if (autosaveTimer) clearTimeout(autosaveTimer);
      autosaveTimer = setTimeout(async () => {
        try {
          await persistPlan("draft");
          autosaveStatusEl.textContent = `Draft auto-saved ${new Date().toLocaleTimeString()}`;
        } catch {
          autosaveStatusEl.textContent = "Draft autosave failed";
        }
      }, 1200);
    };
    const getSorted = () => {
      const list = [...working];
      if (sortMode === "name") return list.sort((a, b) => a.name.localeCompare(b.name));
      if (sortMode === "cost") return list.sort((a, b) => (b.qty * Number(b.pricePerUnit)) - (a.qty * Number(a.pricePerUnit)));
      return list.sort((a, b) => b.priority - a.priority || a.name.localeCompare(b.name));
    };

    function renderCards() {
      const sorted = getSorted();
      const visible = expanded ? sorted : sorted.slice(0, 8);
      const budget = Math.max(1, getBudget());
      cardsEl.innerHTML = visible.map((it) => {
        const chip = actionChip(it.action);
        const cost = it.qty * Number(it.pricePerUnit);
        const recSpend = it.suggested * Number(it.pricePerUnit);
        const share = cost / budget;
        const impact = share >= 0.2 ? { label: "High impact", cls: "bg-error-container text-on-error-container" }
          : share >= 0.1 ? { label: "Medium impact", cls: "bg-tertiary-fixed text-on-tertiary-fixed-variant" }
          : { label: "Low impact", cls: "bg-primary-fixed text-on-primary-fixed" };
        const minQ = Math.max(0, Math.round(it.suggested * 0.5));
        const maxQ = Math.round(it.suggested * 1.5);
        const outOfRange = it.qty < minQ || it.qty > maxQ;
        return `<div class="bg-surface border border-outline-variant rounded-xl p-5" data-card="${it.id}">
          <div class="flex items-center justify-between">
            <div class="inline-flex items-center gap-2"><span class="material-symbols-outlined text-primary">${productIcon(it)}</span><strong>${it.name}</strong></div>
            <div class="inline-flex items-center gap-1"><span class="px-2 py-1 rounded-full text-xs font-semibold ${impact.cls}">${impact.label}</span><span class="px-2 py-1 rounded-full text-xs font-semibold ${chip.cls}">${chip.label}</span></div>
          </div>
          <div class="mt-2 text-sm text-on-surface-variant">₱ ${Number(it.pricePerUnit).toFixed(2)} / ${it.unit}</div>
          <div class="mt-1 text-xs text-on-surface-variant">Recommended spend: ₱ ${recSpend.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <div class="mt-3 flex items-center gap-2">
            <button data-step="${it.id}|-1" class="w-8 h-8 rounded border border-outline-variant text-sm">-</button>
            <input data-qty="${it.id}" type="number" min="0" class="w-28 px-3 py-2 border border-outline rounded" value="${it.qty}">
            <button data-step="${it.id}|1" class="w-8 h-8 rounded border border-outline-variant text-sm">+</button>
            <span class="text-sm text-on-surface-variant">Cost: ₱ <span data-cost="${it.id}">${cost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></span>
          </div>
          <div class="mt-1 text-xs ${outOfRange ? "text-tertiary" : "text-on-surface-variant"}">${outOfRange ? `Suggested range: ${minQ}-${maxQ} ${it.unit}` : `Good range: ${minQ}-${maxQ} ${it.unit}`}</div>
        </div>`;
      }).join("");

      cardsEl.querySelectorAll("[data-qty]").forEach((inp) => inp.addEventListener("input", () => {
        const row = working.find((x) => x.id === inp.dataset.qty);
        if (!row) return;
        row.qty = Number(inp.value || 0);
        recompute();
      }));
      cardsEl.querySelectorAll("[data-step]").forEach((btn) => btn.addEventListener("click", () => {
        const [id, dir] = btn.dataset.step.split("|");
        const row = working.find((x) => x.id === id);
        if (!row) return;
        row.qty = Math.max(0, row.qty + Number(dir || 0));
        renderCards();
        recompute();
      }));
      showMoreLabel.textContent = expanded ? "Show fewer products" : "Show more products";
      showMoreIcon.textContent = expanded ? "keyboard_arrow_up" : "keyboard_arrow_down";
    }

    function recompute() {
      const budget = getBudget();
      localStorage.setItem("plan_budget_php", String(budget));
      const total = working.reduce((s, it) => s + it.qty * Number(it.pricePerUnit), 0);
      const remaining = budget - total;
      totalEl.textContent = `₱ ${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      remEl.textContent = `₱ ${Math.max(0, remaining).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      remEl.className = `text-xl font-bold ${remaining < 0 ? "text-error" : "text-primary"}`;

      const drivers = [...working].map((x) => ({ name: x.name, cost: x.qty * Number(x.pricePerUnit) })).sort((a, b) => b.cost - a.cost).slice(0, 3);
      const buy = working.filter((x) => x.action === "BUY").length;
      const hold = working.filter((x) => x.action === "HOLD").length;
      const delay = working.filter((x) => x.action === "DELAY").length;
      breakdownEl.textContent = `Plan Summary: BUY ${buy}, HOLD ${hold}, DELAY ${delay}. Top cost drivers: ${drivers.map((d) => d.name).join(", ") || "-"}.`;
      aiEl.textContent = remaining < 0
        ? `Plan Tip: Reduce top costly items (${drivers.slice(0, 2).map((d) => d.name).join(", ")}) to get back within budget.`
        : "Plan Tip: You are within budget. Prioritize executing BUY items first.";

      if (remaining < 0) {
        saveStatusEl.className = "px-3 py-1.5 rounded-full text-sm inline-flex items-center gap-1 bg-error-container text-on-error-container";
        saveStatusEl.innerHTML = `<span class="material-symbols-outlined text-[16px]">warning</span>Over budget by ₱ ${Math.abs(remaining).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        saveBtn.disabled = true;
        saveBtn.classList.add("opacity-50", "cursor-not-allowed");
        saveBtn.textContent = "Fix Budget to Save";
      } else {
        saveStatusEl.className = "px-3 py-1.5 rounded-full text-sm inline-flex items-center gap-1 bg-primary-fixed text-on-primary-fixed";
        saveStatusEl.innerHTML = `<span class="material-symbols-outlined text-[16px]">check_circle</span>Within budget`;
        saveBtn.disabled = false;
        saveBtn.classList.remove("opacity-50", "cursor-not-allowed");
        saveBtn.innerHTML = '<span class="material-symbols-outlined">save</span>Save Plan';
      }
      scheduleAutosave();
    }

    function applyScenario() {
      const sc = scenarioEl.value;
      localStorage.setItem("plan_scenario", sc);
      const mul = scenarioMultiplier[sc] || 1;
      working = seedItems.map((x) => ({ ...x, suggested: Math.max(0, Math.round(x.suggested * mul)), qty: Math.max(0, Math.round(x.suggested * mul)) }));
      renderCards();
      recompute();
    }

    function autoAllocate() {
      const budget = getBudget();
      const weighted = working.map((it) => ({ ...it, w: it.action === "BUY" ? 3 : it.action === "HOLD" ? 2 : 1 }));
      const denom = weighted.reduce((s, x) => s + x.w * Number(x.pricePerUnit), 0) || 1;
      weighted.forEach((x) => {
        const target = (budget * x.w * Number(x.pricePerUnit)) / denom;
        const row = working.find((it) => it.id === x.id);
        row.qty = Math.max(0, Math.round(target / Number(x.pricePerUnit)));
      });
      renderCards();
      recompute();
    }

    budgetInput.addEventListener("input", recompute);
    planNameInput.addEventListener("input", scheduleAutosave);
    scenarioEl.addEventListener("change", applyScenario);
    sortEl.addEventListener("change", () => {
      sortMode = sortEl.value;
      renderCards();
    });
    document.getElementById("auto-allocate").addEventListener("click", autoAllocate);
    document.getElementById("open-plans-inline")?.addEventListener("click", () => route("plans"));
    document.getElementById("export-csv")?.addEventListener("click", () => {
      const p = buildPlanPayload();
      const rows = [["Product", "Action", "Qty", "Price", "Cost"], ...p.items.map((it) => [it.name, it.action, it.qty, it.pricePerUnit, (it.qty * it.pricePerUnit).toFixed(2)])];
      const csv = rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `${p.planName.replace(/\s+/g, "_")}.csv`;
      a.click();
      URL.revokeObjectURL(a.href);
    });
    document.getElementById("export-pdf")?.addEventListener("click", () => window.print());
    document.getElementById("reset-plan").addEventListener("click", () => {
      working = seedItems.map((x) => ({ ...x }));
      renderCards();
      recompute();
    });
    showMoreBtn.addEventListener("click", () => {
      expanded = !expanded;
      renderCards();
    });
    saveBtn.addEventListener("click", () => {
      if (saveBtn.disabled) return;
      const total = working.reduce((s, it) => s + it.qty * Number(it.pricePerUnit), 0);
      const drivers = [...working].map((x) => ({ name: x.name, cost: x.qty * Number(x.pricePerUnit) })).sort((a, b) => b.cost - a.cost).slice(0, 3);
      const buy = working.filter((x) => x.action === "BUY").length;
      const hold = working.filter((x) => x.action === "HOLD").length;
      const delay = working.filter((x) => x.action === "DELAY").length;
      confirmBody.innerHTML = `<div>Total: <strong>₱ ${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></div><div>Signals: BUY ${buy}, HOLD ${hold}, DELAY ${delay}</div><div>Top costs: ${drivers.map((d) => d.name).join(", ") || "-"}</div>`;
      confirmModal.classList.remove("hidden");
      confirmModal.classList.add("flex");
    });
    document.getElementById("confirm-cancel").addEventListener("click", () => {
      confirmModal.classList.add("hidden");
      confirmModal.classList.remove("flex");
    });
    document.getElementById("confirm-save").addEventListener("click", async () => {
      confirmModal.classList.add("hidden");
      confirmModal.classList.remove("flex");
      const original = '<span class="material-symbols-outlined">save</span>Save Plan';
      saveBtn.innerHTML = '<span class="material-symbols-outlined animate-spin">sync</span> Saving...';
      saveBtn.disabled = true;
      try {
        await persistPlan("approved");
        autosaveStatusEl.textContent = `Saved as approved ${new Date().toLocaleTimeString()}`;
        saveBtn.innerHTML = '<span class="material-symbols-outlined">check_circle</span> Saved';
        setTimeout(() => {
          saveBtn.innerHTML = original;
          recompute();
        }, 1000);
      } catch {
        saveBtn.innerHTML = '<span class="material-symbols-outlined">error</span> Save failed';
      }
    });

    renderCards();
    recompute();
    window.addEventListener("scroll", () => {
      const compact = window.scrollY > 220;
      if (compact) stickyEl.classList.add("shadow-lg");
      else stickyEl.classList.remove("shadow-lg");
    });
  }
  if (state.page === "prices") {
    const pricePayload = await api("prices");
    let data = [...(pricePayload.rows || [])];
    const watch = new Set(getWatchlist());
    const drill = localStorage.getItem("drill_prices");
    if (drill === "GAINERS") {
      data = data.filter((r) => Number(r.changePct || 0) > 0);
      localStorage.removeItem("drill_prices");
    }
    data.sort((a, b) => {
      const aw = watch.has(a.productId) ? 1 : 0;
      const bw = watch.has(b.productId) ? 1 : 0;
      if (aw !== bw) return bw - aw;
      return a.productName.localeCompare(b.productName);
    });
    const trendLabel = (pct) => {
      const v = Number(pct || 0);
      if (v >= 5) return "Rising fast";
      if (v >= 1) return "Rising";
      if (v <= -5) return "Cooling fast";
      if (v <= -1) return "Cooling";
      return "Stable";
    };

    app.innerHTML = `
      <section class="mb-lg">
        <h1 class="text-headline-lg font-headline-lg text-on-surface mb-1">${t().pricesTitle}</h1>
        <p class="text-body-md text-on-surface-variant">Decision-first price monitoring for vegetable commodities.</p>
      </section>
      <section class="bg-surface border border-outline-variant rounded-xl p-4 mb-lg">
        <div class="flex flex-col md:flex-row justify-between items-center gap-3 mb-3">
          <div class="inline-flex items-center gap-2"><span class="material-symbols-outlined text-secondary">query_stats</span><span class="font-semibold">Selected Commodity Trend</span></div>
          <div class="flex items-center gap-2">
            <select id="price-focus" class="px-3 py-2 rounded-lg border border-outline-variant text-sm bg-surface">${data.map((r, i) => `<option value="${r.productId}" ${i===0?"selected":""}>${r.productName}</option>`).join("")}</select>
            <select id="price-range" class="px-3 py-2 rounded-lg border border-outline-variant text-sm bg-surface"><option value="4">4 weeks</option><option value="8" selected>8 weeks</option><option value="12">12 weeks</option></select>
          </div>
        </div>
        <div id="focus-chart" class="w-full text-on-surface-variant text-sm"></div>
      </section>
      <div class="mb-3" id="decision-filters">
        <div class="inline-flex rounded-xl border border-outline-variant overflow-hidden bg-surface">
          <button data-df="ALL" class="df px-4 py-2 text-sm bg-primary text-white">All</button>
          <button data-df="BUY" class="df px-4 py-2 text-sm text-on-surface-variant">Buy</button>
          <button data-df="HOLD" class="df px-4 py-2 text-sm text-on-surface-variant">Hold</button>
          <button data-df="DELAY" class="df px-4 py-2 text-sm text-on-surface-variant">Delay</button>
        </div>
      </div>
      <div class="flex flex-col md:flex-row justify-between items-center gap-4 mb-lg">
        <div class="relative w-full md:w-96"><span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span><input id="price-search" class="w-full bg-surface border border-outline-variant rounded-lg pl-12 pr-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-body-md" placeholder="Search products..." type="text"/></div>
        <div class="inline-flex items-center px-3 py-1 rounded-full bg-surface-container-high text-on-surface-variant text-sm">Data week: ${pricePayload.dataWeek || "N/A"}</div>
      </div>
      <div class="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden soft-lift mb-xl">
        <div class="overflow-x-auto no-scrollbar max-h-[62vh]">
          <table class="w-full border-collapse">
            <thead class="sticky top-0 z-10 bg-surface-container-low">
              <tr class="border-b border-outline-variant text-left">
                <th class="px-lg py-3 text-label-sm text-on-surface-variant uppercase">Watch</th>
                <th class="px-lg py-3 text-label-sm text-on-surface-variant uppercase">Product</th>
                <th class="px-lg py-3 text-label-sm text-on-surface-variant uppercase text-right tabular-nums">Last</th>
                <th class="px-lg py-3 text-label-sm text-on-surface-variant uppercase text-right tabular-nums">Current</th>
                <th class="px-lg py-3 text-label-sm text-on-surface-variant uppercase">Trend</th>
                <th class="px-lg py-3 text-label-sm text-on-surface-variant uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody id="prices-body">
              ${data.map((r, i) => {
                const current = Number(r.currentPrice || 0);
                const last = Number(r.lastPrice || 0);
                const watched = watch.has(r.productId);
                const vol = Math.abs(Number(r.changePct || 0)) >= 5;
                return `<tr data-row="${r.productId}" class="${i % 2 ? "bg-surface-container-lowest" : "bg-surface"} border-b border-outline-variant hover:bg-surface-container-low">
                  <td class="px-lg py-3"><button data-watch="${r.productId}" class="text-lg">${watched ? "★" : "☆"}</button></td>
                  <td class="px-lg py-3"><div class="inline-flex items-center gap-2"><span class="material-symbols-outlined text-primary">${productIcon({ name: r.productName, commodityGroup: r.productName })}</span><span class="font-medium">${r.productName}</span>${vol ? '<span class="px-2 py-0.5 rounded-full text-xs bg-error-container text-on-error-container">High Volatility</span>' : ""}</div></td>
                  <td class="px-lg py-3 text-right tabular-nums">${last ? last.toFixed(2) : "-"}</td>
                  <td class="px-lg py-3 text-right tabular-nums font-semibold">${current ? current.toFixed(2) : "-"}</td>
                  <td class="px-lg py-3"><button data-explain="${r.productId}" class="px-2 py-1 rounded-full text-xs ${Number(r.changePct || 0) >= 1 ? "bg-primary-fixed text-on-primary-fixed" : Number(r.changePct || 0) <= -1 ? "bg-tertiary-fixed text-on-tertiary-fixed-variant" : "bg-surface-container-high text-on-surface-variant"}">${trendLabel(r.changePct)}</button></td>
                  <td class="px-lg py-3 text-right">
                    <div class="inline-flex gap-1">
                      <button data-pact="${r.productId}|BUY" class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-primary-fixed text-on-primary-fixed"><span class="material-symbols-outlined text-[14px]">shopping_cart</span>Buy</button>
                      <button data-pact="${r.productId}|HOLD" class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-surface-container-high text-on-surface-variant"><span class="material-symbols-outlined text-[14px]">pause_circle</span>Hold</button>
                      <button data-pact="${r.productId}|DELAY" class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-tertiary-fixed text-on-tertiary-fixed-variant"><span class="material-symbols-outlined text-[14px]">schedule</span>Delay</button>
                      <button data-send="${r.productId}" class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs border border-outline-variant"><span class="material-symbols-outlined text-[14px]">send</span>To Plan</button>
                    </div>
                  </td>
                </tr>`;
              }).join("")}
            </tbody>
          </table>
        </div>
      </div>
      <div id="price-explain" class="hidden fixed inset-0 z-[90] bg-black/30 items-center justify-center p-4">
        <div class="bg-surface w-full max-w-xl rounded-xl border border-outline-variant p-5">
          <div class="flex justify-between items-center mb-2"><h3 class="font-semibold">Why this signal</h3><button id="close-explain" class="p-1 rounded hover:bg-surface-container-high"><span class="material-symbols-outlined">close</span></button></div>
          <div id="explain-body" class="text-sm text-on-surface-variant"></div>
        </div>
      </div>
    `;

    const explainModal = document.getElementById("price-explain");
    const explainBody = document.getElementById("explain-body");
    const search = document.getElementById("price-search");
    const rangeEl = document.getElementById("price-range");
    const focusEl = document.getElementById("price-focus");
    let activeFilter = "ALL";
    const updateProduct = async (id, patch) => api(`products/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(patch) });
    const recomputeRows = () => {
      const q = (search.value || "").toLowerCase();
      const rows = [...document.querySelectorAll("#prices-body tr")];
      rows.forEach((row) => {
        const id = row.dataset.row;
        const item = data.find((x) => x.productId === id);
        const txt = row.innerText.toLowerCase();
        const watched = watch.has(id);
        const action = item?.demand === "HIGH DEMAND" ? "BUY" : item?.demand === "LOW DEMAND" ? "DELAY" : "HOLD";
        const filterOk = activeFilter === "ALL" || action === activeFilter;
        row.style.display = txt.includes(q) && filterOk ? "" : "none";
      });
    };
    const renderFocusChart = () => {
      const id = focusEl.value;
      const item = data.find((x) => x.productId === id);
      const n = Number(rangeEl.value || 8);
      const series = (item?.series || []).slice(-n);
      if (!series.length) {
        document.getElementById("focus-chart").innerHTML = "No series data.";
        return;
      }
      const max = Math.max(...series.map((x) => Number(x.price)));
      const min = Math.min(...series.map((x) => Number(x.price)));
      const change = Number(series.at(-1).price) - Number(series[0].price);
      const trend = change > 0 ? "Prices increased over selected window." : change < 0 ? "Prices softened over selected window." : "Prices remained stable over selected window.";
      document.getElementById("focus-chart").innerHTML = `
        <div class="w-full overflow-x-auto">
          <div class="min-w-[640px]">
            <div class="flex gap-2 items-end h-56">
              ${series.map((s) => {
                const h = Math.max(16, Math.round((Number(s.price) / (max || 1)) * 180));
                return `
                <div class="flex-1 min-w-[52px] flex flex-col items-center justify-end h-full">
                  <div class="text-[11px] text-on-surface-variant mb-1">₱${Number(s.price).toFixed(2)}</div>
                  <div title="${s.weekStart}" class="w-full max-w-[48px] bg-primary/75 rounded-t-md border border-primary/20" style="height:${h}px"></div>
                  <div class="text-[10px] text-on-surface-variant mt-1">${s.weekStart.slice(5)}</div>
                </div>`;
              }).join("")}
            </div>
          </div>
        </div>
        <div class="mt-3 flex items-center justify-between text-xs text-on-surface-variant">
          <span>${item.productName} (${n}-week view)</span>
          <span>Range: ₱${min.toFixed(2)} - ₱${max.toFixed(2)}</span>
        </div>
        <div class="mt-1 text-sm ${change > 0 ? "text-error" : change < 0 ? "text-primary" : "text-on-surface-variant"}">${trend}</div>
      `;
    };
    renderFocusChart();
    focusEl.addEventListener("change", renderFocusChart);
    rangeEl.addEventListener("change", renderFocusChart);
    search.addEventListener("input", recomputeRows);
    document.querySelectorAll(".df").forEach((btn) => btn.addEventListener("click", () => {
      activeFilter = btn.dataset.df;
      document.querySelectorAll(".df").forEach((b) => { b.className = `df px-4 py-2 text-sm ${b.dataset.df === activeFilter ? "bg-primary text-white" : "text-on-surface-variant"}`; });
      recomputeRows();
    }));
    document.querySelectorAll("[data-watch]").forEach((btn) => btn.addEventListener("click", () => {
      const id = btn.dataset.watch;
      if (watch.has(id)) watch.delete(id); else watch.add(id);
      setWatchlist([...watch]);
      btn.textContent = watch.has(id) ? "★" : "☆";
      route("prices");
    }));
    document.querySelectorAll("[data-pact]").forEach((btn) => btn.addEventListener("click", async () => {
      const [id, action] = btn.dataset.pact.split("|");
      await updateProduct(id, { manualAction: action });
    }));
    document.querySelectorAll("[data-send]").forEach((btn) => btn.addEventListener("click", () => {
      localStorage.setItem("plan_focus_product", btn.dataset.send);
      route("plan");
    }));
    document.querySelectorAll("[data-explain]").forEach((btn) => btn.addEventListener("click", () => {
      const id = btn.dataset.explain;
      const item = data.find((x) => x.productId === id);
      const treeText = item?.votes?.decisionTree || "UNAVAILABLE";
      const regText = item?.votes?.regression || "UNAVAILABLE";
      const knnText = item?.votes?.knn || "UNAVAILABLE";
      const finalText = item?.demand || "UNAVAILABLE";
      explainBody.innerHTML = `<div><strong>${item?.productName || ""}</strong></div><div class="mt-2">Decision Tree: ${treeText}</div><div>Linear Regression: ${regText}</div><div>kNN: ${knnText}</div><div class="mt-2"><strong>Final:</strong> ${finalText}</div>`;
      explainModal.classList.remove("hidden");
      explainModal.classList.add("flex");
    }));
    document.getElementById("close-explain").addEventListener("click", () => {
      explainModal.classList.add("hidden");
      explainModal.classList.remove("flex");
    });
    explainModal.addEventListener("click", (e) => {
      if (e.target === explainModal) {
        explainModal.classList.add("hidden");
        explainModal.classList.remove("flex");
      }
    });
    recomputeRows();
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
    const previousByProduct = JSON.parse(localStorage.getItem("suggestions_prev") || "{}");
    const confidenceBand = (c) => c >= 85 ? "High" : c >= 70 ? "Medium" : "Low";
    const urgency = (r) => r.action === "BUY" ? "Act today" : r.action === "HOLD" ? "This week" : "Can wait";
    const impactBand = (q) => q >= 1300 ? "High" : q >= 800 ? "Medium" : "Low";
    const verdictTag = (r) => {
      const pct = Number(r.changePct || 0);
      if (pct <= -2) return "Price falling";
      if (pct >= 2) return "Trend up";
      if (Number(r.quantity || 0) >= 1300) return "Low stock";
      return "Stable trend";
    };
    const actionOrder = { BUY: 0, HOLD: 1, DELAY: 2 };
    data.sort((a, b) => (actionOrder[a.action] ?? 9) - (actionOrder[b.action] ?? 9) || (Number(b.confidence || 0) - Number(a.confidence || 0)));

    const urgentRows = data.filter((d) => d.action === "BUY").slice(0, 3);
    const urgentCount = data.filter((d) => d.action === "BUY").length;
    const estimatedSpend = data.filter((d) => d.action === "BUY").reduce((s, d) => s + Number(d.quantity || 0), 0);

    app.innerHTML = `
      <section class="mb-lg">
        <h1 class="text-headline-lg font-headline-lg text-on-surface mb-1">${t().suggestionsTitle}</h1>
        <p class="text-body-md text-on-surface-variant">Action-ready recommendations from DA prices + model voting.</p>
        <div class="mt-2 inline-flex items-center px-3 py-1 rounded-full bg-surface-container-high text-on-surface-variant text-label-sm">Data Week: ${recoPayload.dataWeek || "N/A"}</div>
      </section>
      <section class="mb-xl">
        <div class="flex items-center justify-between mb-3">
          <h2 class="text-headline-sm font-headline-sm inline-flex items-center gap-2"><span class="material-symbols-outlined text-primary">priority_high</span>Urgent Actions</h2>
          <span class="text-sm text-on-surface-variant">${urgentCount} urgent</span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          ${(urgentRows.length ? urgentRows : data.slice(0, 3)).map((r) => {
            const chip = actionChip(r.action);
            return `<article class="bg-surface border border-outline-variant rounded-xl p-4 h-full flex flex-col">
              <div class="text-lg font-semibold leading-tight">${r.productName}</div>
              <div class="mt-2"><span class="px-2 py-1 rounded-full text-xs font-semibold ${chip.cls}">${chip.label}</span></div>
              <div class="mt-2 text-sm text-on-surface-variant">${verdictTag(r)}</div>
              <button data-primary="${r.productId}|${r.action}" class="mt-4 px-3 py-2 rounded-lg border border-outline-variant text-sm inline-flex items-center justify-center gap-1">
                <span class="material-symbols-outlined text-[16px]">send</span>${r.action === "BUY" ? "Send to Buy Plan" : r.action === "HOLD" ? "Apply Hold" : "Apply Delay"}
              </button>
            </article>`;
          }).join("")}
        </div>
      </section>
      <section class="mb-lg">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
          <div id="sugg-segment" class="inline-flex rounded-xl border border-outline-variant overflow-hidden bg-surface">
            <button data-sf="ALL" class="sf px-4 py-2 text-sm bg-primary text-white">All</button>
            <button data-sf="BUY" class="sf px-4 py-2 text-sm text-on-surface-variant">Buy</button>
            <button data-sf="HOLD" class="sf px-4 py-2 text-sm text-on-surface-variant">Hold</button>
            <button data-sf="DELAY" class="sf px-4 py-2 text-sm text-on-surface-variant">Delay</button>
          </div>
          <button id="toggle-more-filters" class="px-3 py-2 rounded-lg border border-outline-variant text-sm inline-flex items-center gap-1">
            <span class="material-symbols-outlined text-[16px]">tune</span>More filters
          </button>
        </div>
        <div id="more-filters" class="hidden mb-4 bg-surface border border-outline-variant rounded-xl p-3">
          <label class="inline-flex items-center gap-2 mr-4 text-sm"><input id="mf-high-conf" type="checkbox">High confidence only</label>
          <label class="inline-flex items-center gap-2 text-sm"><input id="mf-high-impact" type="checkbox">High impact only</label>
        </div>
        <div class="relative w-full md:w-96 mb-4"><span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span><input id="sugg-search" class="w-full bg-surface border border-outline-variant rounded-lg pl-12 pr-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-body-md" placeholder="Search suggestions..." type="text"/></div>
        <div id="sugg-empty" class="hidden mb-4 p-4 rounded-xl bg-surface-container-low text-on-surface-variant text-sm">No matching suggestions.</div>
      <div id="sugg-list" class="grid grid-cols-1 xl:grid-cols-2 gap-3"></div>
        <div class="mt-4 flex justify-center">
          <button id="show-more-sugg" class="hidden px-4 py-2 rounded-lg border border-outline-variant text-sm inline-flex items-center gap-1"><span class="material-symbols-outlined text-[16px]">expand_more</span>Show 10 more</button>
        </div>
      </section>
    `;

    const byProductNow = {};
    data.forEach((d) => { byProductNow[d.productId] = { action: d.action }; });
    localStorage.setItem("suggestions_prev", JSON.stringify(byProductNow));

    let activeFilter = "ALL";
    let pageSize = 10;
    let currentLimit = 10;
    const searchInput = document.getElementById("sugg-search");
    const mfHighConf = document.getElementById("mf-high-conf");
    const mfHighImpact = document.getElementById("mf-high-impact");
    const listEl = document.getElementById("sugg-list");
    const showMoreBtn = document.getElementById("show-more-sugg");
    const updateProduct = async (id, patch) => api(`products/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(patch) });

    function rowHtml(r) {
      const chip = actionChip(r.action);
      const conf = confidenceBand(Number(r.confidence || 0));
      const imp = impactBand(Number(r.quantity || 0));
      const prev = previousByProduct[r.productId];
      const delta = prev ? (prev.action === r.action ? "Unchanged" : `Changed from ${prev.action}`) : "New signal";
      return `<article data-sugg="${r.productId}" class="bg-surface border border-outline-variant rounded-xl p-3.5 h-full">
        <div class="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_auto] gap-2.5 items-center">
          <div class="min-w-0">
            <div class="flex flex-wrap items-center gap-2">
              <div class="text-base font-semibold truncate">${r.productName}</div>
              <span class="px-2 py-1 rounded-full text-xs font-semibold ${chip.cls}">${chip.label}</span>
            </div>
            <div class="mt-1 text-sm text-on-surface-variant">${verdictTag(r)}</div>
            <div class="mt-0.5 text-xs text-on-surface-variant">${delta}</div>
          </div>
          <div class="flex items-center gap-1.5 md:justify-end">
            <button data-primary="${r.productId}|${r.action}" class="px-2.5 py-1.5 rounded-lg border border-outline-variant text-xs inline-flex items-center gap-1 whitespace-nowrap">
              <span class="material-symbols-outlined text-[16px]">${r.action === "BUY" ? "shopping_cart" : r.action === "HOLD" ? "pause_circle" : "schedule"}</span>
              ${r.action === "BUY" ? "Send to Buy Plan" : r.action === "HOLD" ? "Apply Hold" : "Apply Delay"}
            </button>
            <div class="relative">
              <button data-menu="${r.productId}" class="w-8 h-8 rounded-lg border border-outline-variant inline-flex items-center justify-center"><span class="material-symbols-outlined text-[17px]">more_vert</span></button>
              <div id="menu-${r.productId}" class="hidden absolute right-0 mt-1 w-44 bg-surface border border-outline-variant rounded-lg shadow-sm z-20">
                <button data-ra="${r.productId}|BUY" class="w-full text-left px-3 py-2 text-sm hover:bg-surface-container-low">Set BUY</button>
                <button data-ra="${r.productId}|HOLD" class="w-full text-left px-3 py-2 text-sm hover:bg-surface-container-low">Set HOLD</button>
                <button data-ra="${r.productId}|DELAY" class="w-full text-left px-3 py-2 text-sm hover:bg-surface-container-low">Set DELAY</button>
                <button data-expand="${r.productId}" class="w-full text-left px-3 py-2 text-sm hover:bg-surface-container-low">Show details</button>
              </div>
            </div>
          </div>
        </div>
        <div id="detail-${r.productId}" class="hidden mt-3 text-sm text-on-surface-variant bg-surface-container-low rounded-lg p-3">
          <div>Confidence: ${conf}</div>
          <div>Impact: ${imp}</div>
          <div>Urgency: ${urgency(r)}</div>
          <div>Decision Tree: ${r?.demand || "UNAVAILABLE"}</div>
          <div>Regression: ${r?.trend || "UNAVAILABLE"}</div>
          <div>Estimated volume: ${Number(r.quantity || 0).toLocaleString()} kg</div>
        </div>
      </article>`;
    }

    const applyFilter = () => {
      const q = (searchInput.value || "").toLowerCase();
      const filtered = data.filter((row) => {
        const conf = Number(row?.confidence || 0);
        const impHigh = Number(row?.quantity || 0) >= 1300;
        const segmentOk = activeFilter === "ALL" || row?.action === activeFilter;
        const moreOk = (!mfHighConf.checked || conf >= 85) && (!mfHighImpact.checked || impHigh);
        const searchOk = `${row.productName} ${row.reason || ""}`.toLowerCase().includes(q);
        return segmentOk && moreOk && searchOk;
      });
      const visibleRows = filtered.slice(0, currentLimit);
      listEl.innerHTML = visibleRows.map(rowHtml).join("");
      document.getElementById("sugg-empty").classList.toggle("hidden", filtered.length !== 0 || data.length === 0);
      showMoreBtn.classList.toggle("hidden", filtered.length <= currentLimit);
      bindSuggestionActions();
    };

    function bindSuggestionActions() {
      document.querySelectorAll("[data-primary]").forEach((btn) => btn.addEventListener("click", async () => {
        const [id, action] = btn.dataset.primary.split("|");
        await updateProduct(id, { manualAction: action });
        if (action === "BUY") {
          localStorage.setItem("plan_focus_product", id);
          route("plan");
        } else {
          applyFilter();
        }
      }));
      document.querySelectorAll("[data-menu]").forEach((btn) => btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = btn.dataset.menu;
        document.querySelectorAll("[id^='menu-']").forEach((n) => { if (n.id !== `menu-${id}`) n.classList.add("hidden"); });
        document.getElementById(`menu-${id}`)?.classList.toggle("hidden");
      }));
      document.querySelectorAll("[data-ra]").forEach((btn) => btn.addEventListener("click", async () => {
        const [id, action] = btn.dataset.ra.split("|");
        await updateProduct(id, { manualAction: action });
        document.getElementById(`menu-${id}`)?.classList.add("hidden");
        if (action === "BUY") {
          localStorage.setItem("plan_focus_product", id);
          route("plan");
        } else {
          applyFilter();
        }
      }));
      document.querySelectorAll("[data-expand]").forEach((btn) => btn.addEventListener("click", () => {
        const id = btn.dataset.expand;
        const node = document.getElementById(`detail-${id}`);
        if (node) node.classList.toggle("hidden");
        document.getElementById(`menu-${id}`)?.classList.add("hidden");
      }));
    }

    document.querySelectorAll(".sf").forEach((btn) => btn.addEventListener("click", () => {
      activeFilter = btn.dataset.sf;
      currentLimit = pageSize;
      document.querySelectorAll(".sf").forEach((b) => { b.className = `sf px-4 py-2 text-sm ${b.dataset.sf === activeFilter ? "bg-primary text-white" : "text-on-surface-variant"}`; });
      applyFilter();
    }));
    searchInput.addEventListener("input", applyFilter);
    mfHighConf.addEventListener("change", () => { currentLimit = pageSize; applyFilter(); });
    mfHighImpact.addEventListener("change", () => { currentLimit = pageSize; applyFilter(); });
    document.getElementById("toggle-more-filters").addEventListener("click", () => {
      document.getElementById("more-filters").classList.toggle("hidden");
    });
    showMoreBtn.addEventListener("click", () => {
      currentLimit += pageSize;
      applyFilter();
    });
    document.addEventListener("click", () => {
      document.querySelectorAll("[id^='menu-']").forEach((n) => n.classList.add("hidden"));
    });
    if (data.length === 0) document.getElementById("sugg-empty").classList.remove("hidden");
    applyFilter();
  }
  if (state.page === "settings") {
    const s = await api("settings");
    app.innerHTML = `<h1 class="text-2xl font-bold mb-4">Settings</h1><pre class="bg-surface border border-outline-variant rounded-xl p-lg soft-lift text-sm">${JSON.stringify(s, null, 2)}</pre>`;
  }
  document.querySelectorAll('.soft-lift').forEach((card) => {
    card.onmouseenter = () => { card.style.transform = 'translateY(-2px)'; card.style.transition='transform .2s ease-out'; };
    card.onmouseleave = () => { card.style.transform = 'translateY(0)'; };
  });
  localizeAppShell();
}

function route(page) { state.page = page; render(); }
initSidebarCollapse();
render();
window.SUPPLYIT_RENDER = render;
window.addEventListener("supplyit:lang-changed", () => render());
