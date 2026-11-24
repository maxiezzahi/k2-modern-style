/*!
 * ModernSP  -  Nintex K2 Single-File Style Profile
 * -----------------------------------------------------------------------------
 * ONE JavaScript file. It injects its own CSS and then rebuilds the SmartForm
 * chrome (left sidebar from the form tabs, compact header, pinned footer,
 * mobile toggle). Reference THIS file from the K2 Style Profile:
 *     Style Profile Designer -> DEVELOPER tab -> Link external file
 *     -> https://raw.githubusercontent.com/<you>/<repo>/main/modernsp-k2-theme.js
 *
 * REQUIREMENTS IN YOUR FORM (rename in CONFIG below if yours differ):
 *   - Build the form as a TABBED form; each tab becomes a sidebar nav item.
 *   - A control/cell named "LogoCell" holding your logo image (cloned into nav).
 *   - A view named "Header" (title/subtitle) and one named "Footer" (optional).
 *   - For stat tiles, drop the .msp-tile helper HTML (below) into Literal data
 *     labels in a view -  no fragile table-span mapping required.
 *
 * STAT TILE SNIPPET (Literal data label: Literal ON, Prevent XSS OFF):
 *   <div class="msp-tile">
 *     <div class="msp-tile__ico msp-ico--amber"><span class="ms">hourglass_top</span></div>
 *     <div class="msp-tile__body">
 *       <div class="msp-tile__value">0</div>
 *       <div class="msp-tile__label">In progress</div>
 *     </div>
 *   </div>
 * Icon colours: msp-ico--amber | --green | --red | --slate | --maroon
 * Material icon names go inside <span class="ms">...</span>.
 * =========================================================================== */
(function (window, document) {
  "use strict";

  /* ---- things you might rename to match your form --------------------------- */
  var CONFIG = {
    rootClass:      "msp",         // added next to .theme-entry on <body>
    logoCellName:   "LogoCell",    // control/cell holding the logo image
    headerViewName: "Header",      // header view name
    footerViewName: "Footer",      // footer view name (optional)
    buildSidebar:   true           // move form tabs into a left nav rail
  };

  var state = {
    initialized: false,
    sidebarBuilt: false,
    mobileBound: false,
    footerBound: false
  };

  /* ---- the stylesheet (injected by this script) ---------------------------- */
  var css = String.raw`
@import url("https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200");

/* ---------- design tokens ---------- */
.theme-entry.msp,
.theme-entry.msp .form,
.theme-entry.msp .runtime-content,
.theme-entry.msp .view .innerpanel > .grid,
.theme-entry.msp .view .innerpanel > .panel {
  --msp-navy:        #12224C;
  --msp-navy-deep:   #0C1838;
  --msp-maroon:      #7A1F2B;
  --msp-maroon-dark: #611821;

  --msp-bg:          #F7F8FB;
  --msp-card:        #FFFFFF;
  --msp-border:      #ECECF2;
  --msp-soft-line:   rgba(18,34,76,0.10);

  --msp-text:        #1F2430;
  --msp-text-soft:   #8A8F9C;

  --msp-amber:       #F39200;
  --msp-green:       #17A866;
  --msp-red:         #E23B3B;
  --msp-slate:       #1E2A4A;

  --msp-radius-card: 16px;
  --msp-radius-ico:  12px;
  --msp-shadow-sm:   0 2px 8px rgba(18,34,76,0.06);
  --msp-shadow-md:   0 8px 24px rgba(18,34,76,0.10);

  --msp-sidebar-w:   288px;
  --msp-font: "Plus Jakarta Sans", "Segoe UI", system-ui, Arial, sans-serif;
}

html, body { background: var(--msp-bg) !important; }

.theme-entry.msp,
.theme-entry.msp * { box-sizing: border-box; }

.theme-entry.msp,
.theme-entry.msp input,
.theme-entry.msp textarea,
.theme-entry.msp select,
.theme-entry.msp button { font-family: var(--msp-font) !important; }

.theme-entry.msp { color: var(--msp-text); }

.theme-entry.msp .runtime-content {
  background: var(--msp-bg) !important;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  position: relative;
}
.theme-entry.msp .runtime-content.with-sidebar {
  margin-left: var(--msp-sidebar-w) !important;
}

.theme-entry.msp .ms {
  font-family: "Material Symbols Outlined";
  font-variation-settings: "FILL" 0, "wght" 500, "GRAD" 0, "opsz" 24;
  line-height: 1;
}

/* ---------- left sidebar (built from form tabs) ---------- */
.theme-entry.msp .msp-sidebar {
  background: linear-gradient(180deg, var(--msp-navy-deep) 0%, var(--msp-navy) 60%, #1b2f63 100%);
  color: #fff;
  position: fixed;
  top: 0; left: 0; bottom: 0;
  width: var(--msp-sidebar-w);
  padding: 26px 22px 34px;
  display: grid;
  grid-template-rows: 128px auto;
  z-index: 10000;
  overflow: visible;
}
.theme-entry.msp .msp-sidebar-logo {
  display: flex; align-items: center; justify-content: center;
}
.theme-entry.msp .msp-sidebar-logo img {
  background: #fff;
  border-radius: 10px;
  padding: 14px;
  max-height: 96px;
  max-width: 150px;
  display: block !important;
}
.theme-entry.msp .msp-sidebar .tab-box-tabs {
  border: 0 !important;
  margin: 0 !important; padding: 0 !important;
  display: flex; flex-direction: column; gap: 8px;
}
.theme-entry.msp .msp-sidebar .tab-box-tabs > li {
  display: block !important; margin: 0 !important; width: 100%;
}
.theme-entry.msp .msp-sidebar .tab-box-tabs > li > a.tab {
  display: flex; align-items: center;
  min-height: 52px;
  padding: 0 18px !important;
  border: 0 !important;
  border-radius: 10px;
  background: transparent !important;
  color: rgba(255,255,255,0.86) !important;
  font-size: 14.5px; font-weight: 600;
  text-decoration: none;
  transition: background 140ms ease, color 140ms ease;
}
.theme-entry.msp .msp-sidebar .tab-box-tabs > li > a.tab:hover {
  background: rgba(255,255,255,0.08) !important;
  color: #fff !important;
}
.theme-entry.msp .msp-sidebar .tab-box-tabs > li > a.tab.selected {
  background: #fff !important;
  color: var(--msp-navy) !important;
  position: relative;
}
.theme-entry.msp .msp-sidebar .tab-box-tabs > li > a.tab.selected::before {
  content: "";
  position: absolute; left: 0; top: 0; bottom: 0;
  width: 4px; border-radius: 4px 0 0 4px;
  background: var(--msp-maroon);
}

/* mobile hamburger */
.theme-entry.msp .msp-toggle {
  display: none;
  position: fixed; top: 14px; left: 14px;
  width: 46px; height: 46px;
  align-items: center; justify-content: center;
  background: #fff; color: var(--msp-navy);
  border: 1px solid var(--msp-soft-line);
  border-radius: 10px;
  box-shadow: var(--msp-shadow-sm);
  cursor: pointer; z-index: 10002;
}
.theme-entry.msp .msp-toggle .ms { font-size: 26px; }

/* ---------- header ---------- */
.theme-entry.msp .view.header,
.theme-entry.msp .view.header * { background: transparent !important; }
.theme-entry.msp .view.header h1 {
  color: var(--msp-navy); font-size: 26px; font-weight: 700; margin: 0;
}
.theme-entry.msp .view.header h2 {
  color: var(--msp-text-soft); font-size: 15px; font-weight: 500; margin: 2px 0 0;
}

/* ---------- strip K2 panel chrome so the page reads clean ---------- */
.theme-entry.msp .view,
.theme-entry.msp .grid,
.theme-entry.msp .panel,
.theme-entry.msp .panel-body-wrapper,
.theme-entry.msp .grid-body {
  border-color: transparent !important;
  box-shadow: none !important;
  background: transparent !important;
}

/* kill the opaque white wrappers (form + tab containers) so the grey
   page background shows through and only styled cards stay white */
.theme-entry.msp #pgInnerPanel,
.theme-entry.msp #pgTabContent,
.theme-entry.msp .runtime-form,
.theme-entry.msp .formpanel,
.theme-entry.msp .formpanel > .form,
.theme-entry.msp .formpanel > .form > .row,
.theme-entry.msp .form-tabs > .tab-box-body,
.theme-entry.msp .form-tabs > .tab-box-body .tab-box-body-m-c,
.theme-entry.msp .form-tabs > .tab-box-body .tab-box-body-wrapper,
.theme-entry.msp .formpanel > .form > .row > .view,
.theme-entry.msp .formpanel > .form > .row > .view > .innerpanel,
.theme-entry.msp .formpanel > .form > .row > .view > .innerpanel > .grid,
.theme-entry.msp .formpanel > .form > .row > .view > .innerpanel > .panel {
  background: transparent !important;
}

/* ---------- buttons ---------- */
.theme-entry.msp a.SFC.SourceCode-Forms-Controls-Web-Button:not(.toolbar-button),
.theme-entry.msp input[type="button"].SourceCode-Forms-Controls-Web-Button,
.theme-entry.msp input[type="submit"].SourceCode-Forms-Controls-Web-Button {
  display: inline-flex !important; align-items: center; justify-content: center;
  min-height: 40px; min-width: 110px;
  padding: 0.7rem 1.3rem !important;
  border: 0 !important; border-radius: 10px !important;
  background: var(--msp-maroon) !important;
  color: #fff !important;
  font-weight: 700 !important; font-size: 14px !important;
  box-shadow: var(--msp-shadow-sm);
  text-decoration: none !important;
  transition: background 150ms ease, transform 150ms ease, box-shadow 150ms ease;
}
.theme-entry.msp a.SFC.SourceCode-Forms-Controls-Web-Button:not(.toolbar-button):hover,
.theme-entry.msp input[type="button"].SourceCode-Forms-Controls-Web-Button:hover,
.theme-entry.msp input[type="submit"].SourceCode-Forms-Controls-Web-Button:hover {
  background: var(--msp-maroon-dark) !important;
  transform: translateY(-1px);
  box-shadow: var(--msp-shadow-md);
}

/* ---------- list / grid ---------- */
.theme-entry.msp .grid-column-headers {
  background: #EEF1F6 !important;
  border-bottom: 1px solid var(--msp-soft-line) !important;
}
.theme-entry.msp .grid-body table.grid-content-table { border-collapse: collapse; }
.theme-entry.msp .grid-body table.grid-content-table > tbody > tr {
  border-bottom: 1px solid var(--msp-soft-line);
}
.theme-entry.msp .grid-body table.grid-content-table > tbody > tr > td {
  padding: 0.85rem 0.75rem;
}

/* ---------- helper: stat tiles ---------- */
.theme-entry.msp .msp-tile {
  display: inline-flex; align-items: center; gap: 14px;
  background: var(--msp-card);
  border: 1px solid var(--msp-border);
  border-radius: var(--msp-radius-card);
  box-shadow: var(--msp-shadow-sm);
  padding: 16px 18px; min-width: 160px; margin: 6px;
}
.theme-entry.msp .msp-tile__ico {
  flex: 0 0 auto; width: 42px; height: 42px;
  border-radius: var(--msp-radius-ico);
  display: flex; align-items: center; justify-content: center;
  color: #fff;
}
.theme-entry.msp .msp-tile__ico .ms { font-size: 22px; }
.theme-entry.msp .msp-tile__value { font-size: 26px; font-weight: 800; line-height: 1; color: var(--msp-navy); }
.theme-entry.msp .msp-tile__label { font-size: 13px; color: var(--msp-text-soft); margin-top: 3px; }
.theme-entry.msp .msp-ico--amber  { background: linear-gradient(135deg,#F7B64C,var(--msp-amber)); }
.theme-entry.msp .msp-ico--green  { background: linear-gradient(135deg,#3FCB8C,var(--msp-green)); }
.theme-entry.msp .msp-ico--red    { background: linear-gradient(135deg,#EF6A6A,var(--msp-red)); }
.theme-entry.msp .msp-ico--slate  { background: linear-gradient(135deg,#2D3E6B,var(--msp-slate)); }
.theme-entry.msp .msp-ico--maroon { background: linear-gradient(135deg,#9A3443,var(--msp-maroon)); }

/* ---------- helper: hero banner ---------- */
.theme-entry.msp .msp-hero {
  position: relative; overflow: hidden;
  border-radius: var(--msp-radius-card);
  padding: 26px 30px; color: #fff;
  background: linear-gradient(120deg, var(--msp-navy-deep) 0%, var(--msp-navy) 55%, #243a7a 100%);
  box-shadow: var(--msp-shadow-md);
}
.theme-entry.msp .msp-hero::after {
  content: ""; position: absolute; top: -40px; right: -10px;
  width: 220px; height: 200%;
  background: rgba(255,255,255,0.06); transform: rotate(18deg);
}
.theme-entry.msp .msp-hero__title { font-size: 22px; font-weight: 800; margin: 0 0 6px; }
.theme-entry.msp .msp-hero__text  { font-size: 13.5px; opacity: 0.85; max-width: 62ch; }

/* ---------- helper: status pills ---------- */
.theme-entry.msp .msp-pill { display: inline-block; padding: 3px 10px; border-radius: 999px; font-size: 12px; font-weight: 700; }
.theme-entry.msp .msp-pill--approved { background: #E4F6EC; color: #157A4C; }
.theme-entry.msp .msp-pill--rejected { background: #FBE7E7; color: #B5302F; }
.theme-entry.msp .msp-pill--progress { background: #FCEFD9; color: #9A6200; }

/* ---------- responsive ---------- */
@media (max-width: 768px) {
  .theme-entry.msp .runtime-content.with-sidebar { margin-left: 0 !important; }
  .theme-entry.msp .msp-toggle { display: flex; }
  .theme-entry.msp .msp-sidebar {
    width: min(86vw, 320px);
    transform: translateX(-105%);
    transition: transform 0.22s ease;
  }
  .theme-entry.msp.msp-sidebar-open .msp-sidebar { transform: translateX(0); }
  .theme-entry.msp.msp-sidebar-open::after {
    content: ""; position: fixed; inset: 0;
    background: rgba(18,34,76,0.45); z-index: 9999;
  }
}
`;

  /* ---- helpers -------------------------------------------------------------- */
  function ready(cb) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", cb, { once: true });
    } else { cb(); }
  }
  function getJQuery() { return window.jQuery || window.$; }

  function injectStyles() {
    var existing = document.getElementById("modernsp-style");
    if (existing) { existing.textContent = css; return; }
    var style = document.createElement("style");
    style.id = "modernsp-style";
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);
  }

  function isMobile() {
    return window.matchMedia("(max-width: 768px)").matches;
  }

  function applyClasses($) {
    $("body").addClass(CONFIG.rootClass);
  }

  function buildSidebar($) {
    if (!CONFIG.buildSidebar || state.sidebarBuilt) { return; }
    var runtime = $(".runtime-content").first();
    var tabs = $("ul.tab-box-tabs").first();
    if (!runtime.length || !tabs.length) { return; }

    var sidebar = $('<nav class="msp-sidebar" aria-label="Navigation"></nav>');

    // clone the logo, if present
    var logoSpan = $('span[name="' + CONFIG.logoCellName + '"]').first();
    var img = logoSpan.find("img").first();
    if (img.length) {
      var clone = img.clone(false).removeAttr("id name tabindex data-options");
      sidebar.append($('<div class="msp-sidebar-logo"></div>').append(clone));
      logoSpan.css("display", "none");
    } else {
      sidebar.append($('<div class="msp-sidebar-logo"></div>'));
    }

    // move the real form tabs into the sidebar (keeps K2 tab behaviour)
    sidebar.append(tabs);
    runtime.prepend(sidebar).addClass("with-sidebar");

    // mobile toggle
    var toggle = $('<button type="button" class="msp-toggle" aria-label="Menu"><span class="ms">menu</span></button>');
    runtime.prepend(toggle);
    toggle.on("click", function () {
      $("body").toggleClass("msp-sidebar-open");
    });
    tabs.on("click", "a.tab", function () {
      $("body").removeClass("msp-sidebar-open");
    });

    state.sidebarBuilt = true;
  }

  function compactHeader($) {
    $('div[name="' + CONFIG.headerViewName + '"]').closest(".view").addClass("header");
  }

  function tagFooter($) {
    $('div[name="' + CONFIG.footerViewName + '"]').closest(".view").addClass("footer");
  }

  function refresh() {
    var $ = getJQuery();
    if (!$) { window.setTimeout(refresh, 100); return; }
    applyClasses($);
    buildSidebar($);
    compactHeader($);
    tagFooter($);
  }

  function init() {
    if (state.initialized) { refresh(); return; }
    state.initialized = true;
    injectStyles();
    refresh();
    // K2 renders async - re-run a few times to catch late DOM
    [150, 500, 1200].forEach(function (d) { window.setTimeout(refresh, d); });
  }

  window.ModernSPTheme = { init: init, refresh: refresh };
  ready(init);
})(window, document);
