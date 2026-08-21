/*!
 * Nintex PSF K2 Single File Theme (No Waves Edition)
 * Adapted from lowcodelegend/PSFUX-Square for modern Nintex styling.
 */
(function (window, document) {
  "use strict";

  var CONFIG = {
    logoCellName: "LogoCell",
    kpiViewName: "KPIs",
    requestListViewName: "Requests",
    headerViewName: "Header",
    footerViewName: "Footer",
    searchControlName: "Auto-Complete",
    actionButtons: {
      new: "btnNavNew",
      reports: "btnNavReporting",
      admin: "btnNavAdmin"
    }
  };

  var state = {
    initialized: false,
    mobileHeaderBound: false,
    headerResizeBound: false,
    tabFlowBound: false,
    footerResizeBound: false,
    footerTabBound: false,
    lastWorklistMenuAnchor: null,
    worklistMenuActive: false,
    worklistMenuBound: false,
    worklistObserverBound: false,
    worklistRefreshScheduled: false
  };

  var css = String.raw`
@import url("https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200");

.theme-entry.psf,
body.theme-entry .psf,
.theme-entry.psf .form,
.theme-entry.psf #pgInnerPanel,
.theme-entry.psf .form-tabs > .tab-box-body,
.theme-entry.psf #pgTabContent,
.theme-entry.psf .view .innerpanel > .grid,
.theme-entry.psf .view .innerpanel > .panel,
.theme-entry.psf .view-canvas > .grid,
.theme-entry.psf .view-canvas > .panel {
  --ntx-black: #12232b;
  --ntx-white: #ffffff;
  --ntx-ivory: #f9fbfb;
  --ntx-orange: #E97C2F;
  --ntx-light-orange: #F7B32B;
  --ntx-pale-orange: #FDF1E5;
  --ntx-pink: #2E7D9A;
  --ntx-magenta: #256B85;
  --ntx-navy: #173743;
  --ntx-deep-navy: #0E262F;
  --ntx-blue: #2E7D9A;
  --ntx-purple: #2E7D9A;
  --ntx-deep-purple: #173743;
  --ntx-line: rgba(23, 55, 67, 0.22);
  --ntx-soft-line: rgba(23, 55, 67, 0.1);
  --ntx-sidebar-width: 300px;
  --ntx-sidebar-padding: 30px;
  --ntx-shadow: 0 8px 24px rgba(23, 55, 67, 0.10);

  --main-font-family: "Plus Jakarta Sans", Arial, sans-serif;
  --heading-font-family: "Plus Jakarta Sans", Arial, sans-serif;
  --button-font-family: "Plus Jakarta Sans", Arial, sans-serif;
  --normal-text-color: #22333B;
  --description-text-color: rgba(23, 55, 67, 0.74);
  --paragraph-text-color: rgba(23, 55, 67, 0.84);
  --form-background-color: var(--ntx-white);
  --page-background-color: var(--ntx-white);
  --view-background-color: var(--ntx-white);
  --page-title-text-color: #3A4A52;
  --page-subtitle-text-color: #6B7A80;
  --heading1-text-color: var(--ntx-deep-navy);
  --heading2-text-color: var(--ntx-deep-navy);
  --heading3-text-color: var(--ntx-deep-navy);
  --view-header-text-color: #3A4A52;
  --view-header-background-color: transparent;
  --page-title-text-size: 3.3rem;
  --page-subtitle-text-size: 2.1rem;
  --heading1-text-size: 3.1rem;
  --heading2-text-size: 2.25rem;
  --heading3-text-size: 1.75rem;
  --heading4-text-size: 1.45rem;
  --view-header-text-size: 1.45rem;
  --main-text-size: 1.35rem;
  --input-label-text-size: 1.15rem;
  --input-background-color: var(--ntx-white);
  --input-border-color: rgba(23, 55, 67, 0.34);
  --input-focus-border-color: var(--ntx-magenta);
  --input-text-color: #22333B;
  --input-watermark-text-color: rgba(23, 55, 67, 0.36);
  --input-rounding: 0;
  --button-rounding: 3px;
  --primary-button-background-color: #A8B5BA;
  --primary-button-border-color: #A8B5BA;
  --primary-button-text-color: var(--ntx-black);
  --primary-button-hover-background-color: var(--ntx-magenta);
  --primary-button-hover-border-color: var(--ntx-magenta);
  --primary-button-hover-text-color: var(--ntx-white);
  --button-background-color: #A8B5BA;
  --button-border-color: #A8B5BA;
  --button-text-color: var(--ntx-black);
  --button-hover-background-color: var(--ntx-magenta);
  --button-hover-border-color: var(--ntx-magenta);
  --button-hover-text-color: var(--ntx-white);
  --list-column-header-background-color: #EEF1F2;
  --list-column-header-text-color: var(--ntx-deep-navy);
  --list-item-background-color: var(--ntx-white);
  --list-item-background-color-odd-zebra: var(--ntx-white);
  --list-item-background-color-even-zebra: #F9FBFB;
  --list-item-hover-background-color: var(--ntx-pale-orange);
  --list-item-selected-background-color: #E8F3F7;
  --list-item-selected-text-color: var(--ntx-deep-navy);
  --list-item-selected-border-color: var(--ntx-magenta);
}

html,
body {
  background: var(--ntx-white, #ffffff) !important;
  overscroll-behavior: none;
}

.theme-entry.psf,
.theme-entry.psf * {
  box-sizing: border-box;
}

.theme-entry.psf,
.theme-entry.psf input,
.theme-entry.psf textarea,
.theme-entry.psf select,
.theme-entry.psf button {
  font-family: var(--main-font-family) !important;
}

.theme-entry.psf .runtime-content {
  background: var(--ntx-white) !important;
  color: var(--normal-text-color);
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  overflow: hidden;
  position: relative;
}

.theme-entry.psf .runtime-content > * {
  position: relative;
  z-index: 1;
}

.theme-entry.psf .runtime-content.with-sidebar {
  justify-content: start;
  margin-left: var(--ntx-sidebar-width) !important;
}

.theme-entry.psf .psf-sidebar {
  background:
    linear-gradient(180deg, rgba(23, 55, 67, 0.98) 0%, rgba(23, 55, 67, 0.96) 34%, rgba(23, 55, 67, 0.98) 100%),
    var(--ntx-deep-navy);
  color: var(--ntx-white);
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 140px auto;
  height: 100vh;
  left: 0;
  overflow: visible;
  padding: 28px 30px 40px;
  position: fixed;
  top: 0;
  width: var(--ntx-sidebar-width);
  z-index: 10000;
}

.theme-entry.psf .psf-sidebar-logo {
  align-items: flex-start;
  display: flex;
  grid-row: 1;
  justify-content: center;
}

.theme-entry.psf .psf-sidebar-logo img {
  background: var(--ntx-white);
  border-radius: 8px;
  display: block !important;
  max-height: 108px;
  max-width: 132px;
  padding: 16px;
}

.theme-entry.psf .psf-sidebar-tabs {
  grid-row: 2;
  overflow: visible;
}

.theme-entry.psf .psf-sidebar .tab-box-tabs {
  border: 0 !important;
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 0 !important;
  padding: 0 !important;
}

.theme-entry.psf .psf-sidebar .tab-box-tabs > li {
  display: block !important;
  margin: 0 !important;
  overflow: visible;
  width: 100%;
}

.theme-entry.psf .psf-sidebar .tab-box-tabs > li > a.tab {
  align-items: center;
  background: transparent !important;
  border: 0 !important;
  border-radius: 8px;
  color: var(--ntx-white) !important;
  display: flex;
  font-size: 1.5rem;
  font-weight: 650;
  line-height: 1.15;
  min-height: 58px;
  overflow: visible;
  padding: 0 24px !important;
  position: relative;
  text-decoration: none;
  width: calc(100% + 12px);
}

.theme-entry.psf .psf-sidebar .tab-box-tabs > li > a.tab:hover,
.theme-entry.psf .psf-sidebar .tab-box-tabs > li > a.tab.selected {
  background: var(--ntx-white) !important;
  color: var(--ntx-deep-navy) !important;
  z-index: 2;
}

.theme-entry.psf .psf-sidebar .tab-box-tabs > li > a.tab.selected::after {
  background: linear-gradient(180deg, var(--ntx-orange), var(--ntx-magenta));
  content: "";
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  width: 4px;
  z-index: 2;
}

.theme-entry.psf .psf-sidebar .tab-wrapper {
  align-items: center;
  border: 0 !important;
  display: flex !important;
  gap: 12px;
  min-height: 58px;
  width: 100%;
  z-index: 1;
}

.theme-entry.psf .psf-sidebar .tab-wrapper::before {
  align-self: center;
  border: 2px solid currentColor;
  border-radius: 50%;
  content: "";
  flex: 0 0 auto;
  height: 18px;
  width: 18px;
}

.theme-entry.psf .psf-sidebar .tab-box-tabs > li > a.tab.selected .tab-wrapper::before {
  background: radial-gradient(circle at center, var(--ntx-orange) 0 4px, transparent 4.5px);
  border-color: currentColor;
}

.theme-entry.psf .psf-sidebar-toggle {
  align-items: center;
  background: var(--ntx-white);
  border: 1px solid var(--ntx-soft-line);
  box-shadow: var(--ntx-shadow);
  color: var(--ntx-deep-navy);
  cursor: pointer;
  display: none;
  height: 48px;
  justify-content: center;
  left: 14px;
  position: fixed;
  top: 14px;
  width: 48px;
  z-index: 10002;
}

.theme-entry.psf .psf-sidebar-toggle::before {
  content: "menu";
  font-family: "Material Symbols Outlined";
  font-size: 28px;
}

.theme-entry.psf.psf-sidebar-open .psf-sidebar-toggle::before {
  content: "close";
}

.theme-entry.psf .view.header {
  background: transparent !important;
  height: 148px !important;
  margin-bottom: 4px;
  margin-top: 0;
  max-height: 148px !important;
}

.theme-entry.psf .header span[name="LogoCell"] {
  display: none !important;
}

.theme-entry.psf .header h1 {
  color: #3A4A52;
  font-size: var(--page-title-text-size);
  font-weight: 400;
  margin: 0;
}

.theme-entry.psf .header h2 {
  color: #6B7A80;
  font-size: var(--page-subtitle-text-size);
  font-weight: 400;
  margin: 0;
  transform: translateY(-22px);
}
`;

  // Inject styles
  var styleEl = document.createElement("style");
  styleEl.type = "text/css";
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  // Runtime initialization for K2 form layout
  function initPSF() {
    var themeEntry = document.querySelector(".theme-entry") || document.body;
    themeEntry.classList.add("psf");

    var runtimeContent = document.querySelector(".runtime-content");
    if (runtimeContent && !runtimeContent.classList.contains("with-sidebar")) {
      runtimeContent.classList.add("with-sidebar");
    }

    // Build sidebar if tabs exist and sidebar isn't already created
    var tabBox = document.querySelector(".form-tabs");
    var existingSidebar = document.querySelector(".psf-sidebar");
    if (tabBox && !existingSidebar) {
      var sidebar = document.createElement("div");
      sidebar.className = "psf-sidebar";

      var logoDiv = document.createElement("div");
      logoDiv.className = "psf-sidebar-logo";
      var logoImg = document.createElement("img");
      logoImg.src = "https://maxiezzahi.github.io/k2-modern-style/logo.png"; // Fallback or adjust as needed
      logoImg.alt = "Logo";
      logoDiv.appendChild(logoImg);
      sidebar.appendChild(logoDiv);

      var tabsContainer = document.createElement("div");
      tabsContainer.className = "psf-sidebar-tabs";
      tabsContainer.appendChild(tabBox);
      sidebar.appendChild(tabsContainer);

      runtimeContent.insertBefore(sidebar, runtimeContent.firstChild);
    }
  }

  if (document.readyState === "complete" || document.readyState === "interactive") {
    setTimeout(initPSF, 200);
  } else {
    document.addEventListener("DOMContentLoaded", function () {
      setTimeout(initPSF, 200);
    });
  }

})(window, document);
