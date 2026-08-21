/*!
 * Nintex PSF K2 Single File Theme (No Waves Edition)
 * Adapted from lowcodelegend/PSFUX-Square for modern Nintex styling.
 * Reference this one JavaScript file from the K2 style profile/header view.
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

.theme-entry.psf .psf-tab-flow {
  height: 100vh;
  inset: 0;
  overflow: visible;
  pointer-events: none;
  position: fixed;
  width: 100vw;
  z-index: 10001;
}

.theme-entry.psf .psf-tab-flow path {
  fill: var(--ntx-white);
  shape-rendering: geometricPrecision;
  stroke: rgba(255, 255, 255, 0.98);
  stroke-linejoin: round;
  stroke-width: 1.5;
  vector-effect: non-scaling-stroke;
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

.theme-entry.psf .psf-sidebar .tab-box-tabs > li:nth-child(2) > a.tab.selected .tab-wrapper::before {
  background: radial-gradient(circle at center, var(--ntx-purple) 0 4px, transparent 4.5px);
}

.theme-entry.psf .psf-sidebar .tab-box-tabs > li:nth-child(3) > a.tab.selected .tab-wrapper::before {
  background: radial-gradient(circle at center, var(--ntx-blue) 0 4px, transparent 4.5px);
}

.theme-entry.psf .psf-sidebar .tab-text {
  min-width: 0 !important;
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
  font-variation-settings: "FILL" 0, "wght" 600, "GRAD" 0, "opsz" 24;
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
  min-height: 0 !important;
  overflow: visible !important;
}

.theme-entry.psf .header * {
  background-color: transparent !important;
}

.theme-entry.psf .header span[name="LogoCell"],
.theme-entry.psf .header .psf-header-logo-source {
  display: none !important;
}

.theme-entry.psf .header .panel-body-wrapper {
  background: transparent !important;
  box-shadow: none !important;
  color: var(--normal-text-color);
  padding: 8px 10px 6px !important;
}

.theme-entry.psf .header .panel-body-m,
.theme-entry.psf .header .panel-body-wrapper,
.theme-entry.psf .header .innerpanel {
  overflow: visible !important;
}

.theme-entry.psf .header .panel-body-wrapper > div > .root-table {
  grid-template-rows: auto !important;
  -ms-grid-rows: auto !important;
}

.theme-entry.psf .header .panel-body-wrapper > div > .root-table > span[row="2"] {
  display: none !important;
}

.theme-entry.psf .header h1 {
  color: #3A4A52;
  font-size: var(--page-title-text-size);
  font-weight: 400;
  letter-spacing: 0;
  line-height: 1.12;
  margin: 0;
}

.theme-entry.psf .header h2 {
  color: #6B7A80;
  font-size: var(--page-subtitle-text-size);
  font-weight: 400;
  line-height: 1.12;
  margin: 0;
  transform: translateY(-22px);
}

.theme-entry.psf .header .description,
.theme-entry.psf .header p {
  color: var(--ntx-deep-navy) !important;
  font-size: 0.9rem !important;
  font-weight: 500;
}

.theme-entry.psf .header .panel-body-wrapper div[name="tblLargeHeader"] {
  grid-template-columns: 1fr 300px !important;
  overflow: visible !important;
}

.theme-entry.psf .header .panel-body-wrapper div[name="tblLargeHeader"] > span[col="1"][row="1"] > div {
  grid-template-columns: 0 1fr !important;
  overflow: visible !important;
  width: 100%;
}

.theme-entry.psf .header .panel-body-wrapper div[name="tblLargeHeader"] .editor-cell {
  overflow: visible !important;
  padding-left: 0 !important;
  padding-right: 0 !important;
}

.theme-entry.psf .header .panel-body-wrapper div[name="tblLargeHeader"] > span[col="1"][row="1"] > div > span[col="2"][row="1"] > div > span {
  justify-content: left !important;
}

.theme-entry.psf .header .panel-body-wrapper div[name="tblLargeHeader"] > span[col="1"][row="1"] > div > span[col="2"][row="1"] {
  position: relative !important;
  top: -28px;
}

.theme-entry.psf .header .panel-body-wrapper div[name="tblLargeHeader"] > span[col="1"][row="1"] > div > span[col="2"][row="1"] > div {
  align-content: start !important;
  overflow: visible !important;
}

.theme-entry.psf .header .panel-body-wrapper div[name="tblLargeHeader"] > span[col="2"][row="1"] {
  position: relative !important;
  top: -16px;
  transform: translateX(120px);
}

.theme-entry.psf .header .panel-body-wrapper div[name="tblLargeHeader"] > span[col="2"][row="1"] > div {
  align-content: start !important;
  justify-items: start !important;
}

.theme-entry.psf .header .panel-body-wrapper div[name="tblLargeHeader"] > span[col="2"][row="1"] p,
.theme-entry.psf .header .panel-body-wrapper div[name="tblLargeHeader"] > span[col="2"][row="1"] span.SFC {
  color: rgba(23, 55, 67, 0.82) !important;
  font-size: var(--input-label-text-size) !important;
  font-weight: 500 !important;
  line-height: 1.35 !important;
}

.theme-entry.psf .header + .form-tabs {
  margin-top: 0 !important;
}

.theme-entry.psf .formpanel > .form > .row:empty {
  display: none !important;
}

.theme-entry.psf .formpanel > .form > .row:first-child {
  margin: 0 !important;
  min-height: 0 !important;
}

.theme-entry.psf .panel-header-wrapper,
.theme-entry.psf .grid-header-wrapper {
  background: transparent !important;
  border: 0 !important;
}

.theme-entry.psf .panel-header-wrapper > div.panel-header-text,
.theme-entry.psf .grid-header-wrapper > div.grid-header-text {
  color: var(--view-header-text-color);
  font-size: var(--view-header-text-size);
  font-weight: 700;
  height: 100%;
}

.theme-entry.psf .view.footer {
  margin-top: auto !important;
  padding-top: 28px;
}

.theme-entry.psf .view.footer.psf-footer-push {
  margin-top: var(--psf-footer-push, 0px) !important;
}

.theme-entry.psf .view.footer,
.theme-entry.psf .view.footer .panel,
.theme-entry.psf .view.footer .panel-body-wrapper,
.theme-entry.psf .view.footer .panel-body-m-c {
  background: transparent !important;
  border: 0 !important;
  box-shadow: none !important;
}

.theme-entry.psf .view.footer .panel-body-wrapper {
  color: rgba(23, 55, 67, 0.82);
  font-size: 1rem;
  padding: 0 10px 20px !important;
}

.theme-entry.psf .view.footer .SFC.SourceCode-Forms-Controls-Web-Label {
  color: inherit !important;
  font-size: inherit !important;
  font-weight: 500;
  line-height: 1.35;
}

.theme-entry.psf .view,
.theme-entry.psf .grid,
.theme-entry.psf .panel,
.theme-entry.psf .view-canvas > .grid,
.theme-entry.psf .view-canvas > .panel {
  border-color: transparent !important;
  box-shadow: none !important;
}

.theme-entry.psf .panel-body-wrapper,
.theme-entry.psf .grid-body {
  background: var(--ntx-white) !important;
}

.theme-entry.psf .form-tabs > .tab-box-body,
.theme-entry.psf .form-tabs > .tab-box-body .tab-box-body-m-c,
.theme-entry.psf .form-tabs > .tab-box-body .tab-box-body-wrapper,
.theme-entry.psf .formpanel,
.theme-entry.psf .formpanel > .form,
.theme-entry.psf .formpanel > .form > .row,
.theme-entry.psf .formpanel > .form > .row > .view,
.theme-entry.psf .formpanel > .form > .row > .view > .innerpanel {
  background: transparent !important;
}

.theme-entry.psf .formpanel > .form > .row > .view > .innerpanel > .grid,
.theme-entry.psf .formpanel > .form > .row > .view > .innerpanel > .panel {
  background: transparent !important;
}

.theme-entry.psf .formpanel > .form > .row > .view .grid-header,
.theme-entry.psf .formpanel > .form > .row > .view .grid-header-wrapper,
.theme-entry.psf .formpanel > .form > .row > .view .toolbars,
.theme-entry.psf .formpanel > .form > .row > .view .toolbar-wrapper,
.theme-entry.psf .formpanel > .form > .row > .view .panel-header,
.theme-entry.psf .formpanel > .form > .row > .view .panel-header-wrapper,
.theme-entry.psf .formpanel > .form > .row > .view .panel-body-wrapper,
.theme-entry.psf .formpanel > .form > .row > .view .grid-body {
  background: transparent !important;
}

.theme-entry.psf .ControlPack-Worklist,
.theme-entry.psf .SourceCodeFormsControlsWorklist {
  overflow: visible !important;
  position: relative !important;
  z-index: 20 !important;
}

.theme-entry.psf .ControlPack-Worklist:hover,
.theme-entry.psf .ControlPack-Worklist:focus-within,
.theme-entry.psf .SourceCodeFormsControlsWorklist:hover,
.theme-entry.psf .SourceCodeFormsControlsWorklist:focus-within {
  z-index: 21000 !important;
}

.theme-entry.psf .WorklistItemSectionCell,
.theme-entry.psf .WorklistItemSectionDiv,
.theme-entry.psf .WorklistItemGridRow,
.theme-entry.psf .WorkListItemTable,
.theme-entry.psf .WorklistTableSelectGridArrow,
.theme-entry.psf .SelectArrowImageDiv {
  overflow: visible !important;
  position: relative !important;
}

.theme-entry.psf .worklistDisabledOverlay {
  pointer-events: none !important;
  z-index: -1 !important;
}

.theme-entry.psf .WorkListItemTableHeader {
  position: relative !important;
  z-index: 1 !important;
}

.theme-entry.psf .WorkListGridTableBody {
  overflow: visible !important;
  position: relative !important;
  z-index: 2 !important;
}

.theme-entry.psf.psf-worklist-menu-open .ControlPack-Worklist,
.theme-entry.psf.psf-worklist-menu-open .SourceCodeFormsControlsWorklist,
.theme-entry.psf.psf-worklist-menu-open .WorklistItemSectionCell,
.theme-entry.psf.psf-worklist-menu-open .WorkListGridTableBody,
.theme-entry.psf.psf-worklist-menu-open .WorkListItemTable,
.theme-entry.psf.psf-worklist-menu-open .WorklistItemSectionDiv,
.theme-entry.psf.psf-worklist-menu-open .WorklistItemGridRow {
  overflow: visible !important;
  position: relative !important;
  z-index: 2147483646 !important;
}

.theme-entry .popupManager,
.theme-entry .popup,
.theme-entry .dialog,
.theme-entry .drop-menu,
.theme-entry .menu,
.theme-entry .context-menu,
.theme-entry [class*="Worklist"][class*="Menu"],
.theme-entry [class*="Worklist"][class*="menu"],
.theme-entry [class*="Worklist"][class*="Popup"],
.theme-entry [class*="Worklist"][class*="popup"],
.theme-entry [id*="Worklist"][id*="Menu"],
.theme-entry [id*="Worklist"][id*="Popup"] {
  z-index: 30000 !important;
}

.theme-entry .popup,
.theme-entry .drop-menu,
.theme-entry .menu,
.theme-entry .context-menu,
.theme-entry [class*="Worklist"][class*="Menu"],
.theme-entry [class*="Worklist"][class*="menu"],
.theme-entry [class*="Worklist"][class*="Popup"],
.theme-entry [class*="Worklist"][class*="popup"] {
  pointer-events: auto !important;
}

.theme-entry.psf .SFC.SourceCode-Forms-Controls-Web-TextBox.watermark,
.theme-entry.psf .input-control-watermark {
  color: rgba(23, 55, 67, 0.36) !important;
  font-size: var(--main-text-size);
}

.theme-entry.psf label.SFC.SourceCode-Forms-Controls-Web-Label.input-label,
.theme-entry.psf input.SFC.SourceCode-Forms-Controls-Web-TextBox.SFE {
  padding: 0.8rem 1rem !important;
}

.theme-entry.psf .input-control.text-input:not(.control-group-container) .input-control-m-c {
  background: transparent !important;
  border: 0 !important;
  border-bottom: 1px solid var(--input-border-color) !important;
  box-shadow: none !important;
  padding: 0.4rem 0.6rem;
}

.theme-entry.psf div.picker,
.theme-entry.psf div.picker div.input-control-m-c,
.theme-entry.psf div.input-control.lookup-box,
.theme-entry.psf div.input-control.select-box {
  min-height: 40px !important;
}

.theme-entry.psf .input-control.text-input.control-group-container div.input-control-m-c {
  border: 1px solid var(--input-border-color) !important;
  box-shadow: none !important;
}

.theme-entry.psf .calendar-control.datepicker > .styling-outer-wrapper,
.theme-entry.psf .dropdown-box > .styling-outer-wrapper {
  border-bottom: 1px solid var(--input-border-color) !important;
}

.theme-entry.psf .calendar-control.datepicker .input-control-body,
.theme-entry.psf .calendar-control.datepicker .input-control-buttons,
.theme-entry.psf .dropdown-box .input-control-body,
.theme-entry.psf .dropdown-box .input-control-buttons {
  border-bottom: 0 !important;
}

.theme-entry.psf .calendar-control.datepicker .input-control-b,
.theme-entry.psf .calendar-control.datepicker .input-control-b-l,
.theme-entry.psf .calendar-control.datepicker .input-control-b-c,
.theme-entry.psf .calendar-control.datepicker .input-control-b-r,
.theme-entry.psf .dropdown-box .input-control-b,
.theme-entry.psf .dropdown-box .input-control-b-l,
.theme-entry.psf .dropdown-box .input-control-b-c,
.theme-entry.psf .dropdown-box .input-control-b-r {
  border: 0 !important;
  height: 0 !important;
  min-height: 0 !important;
}

.theme-entry.psf .calendar-control.datepicker > .styling-outer-wrapper > .input-control-buttons,
.theme-entry.psf .dropdown-box > .styling-outer-wrapper > .input-control-buttons {
  vertical-align: middle !important;
}

.theme-entry.psf .calendar-control.datepicker .calender-control-button svg,
.theme-entry.psf .calendar-control.datepicker .svg-icon-calendar-date {
  height: 28px !important;
  width: 28px !important;
}

.theme-entry.psf .worklistToolbarIconWrapper {
  align-items: center !important;
  display: inline-flex !important;
  gap: 10px;
}

.theme-entry.psf .worklistToolbarIconWrapper .worklist-btn,
.theme-entry.psf .WorklistThemeIconContainer {
  align-items: center !important;
  display: inline-flex !important;
  height: 32px !important;
  justify-content: center !important;
  min-height: 32px !important;
  min-width: 32px !important;
  width: 32px !important;
}

.theme-entry.psf .worklistToolbarIconWrapper .worklist-btn svg,
.theme-entry.psf .WorklistThemeIconContainer svg {
  display: block !important;
  height: 28px !important;
  min-height: 28px !important;
  min-width: 28px !important;
  width: 28px !important;
}

.theme-entry.psf .WorklistItemIcons svg {
  display: block !important;
  height: 14px !important;
  width: 14px !important;
}

.theme-entry.psf .WorklistItemIcons {
  line-height: 0 !important;
  text-align: center !important;
  vertical-align: middle !important;
}

.theme-entry.psf .WorklistItemIcons .OverdueImageDiv,
.theme-entry.psf .WorklistItemIcons .PriorityImageDiv {
  align-items: center !important;
  display: inline-flex !important;
  height: 16px !important;
  justify-content: center !important;
  position: relative !important;
  top: 1px !important;
  vertical-align: middle !important;
  width: 16px !important;
}

.theme-entry.psf .WorklistTableSelectGridArrow svg,
.theme-entry.psf .SelectArrowImageDiv svg {
  display: block !important;
  height: 22px !important;
  width: 22px !important;
}

.theme-entry.psf .SFC.SourceCode-Forms-Controls-Web-TextBox.readonly,
.theme-entry.psf input[type="text"].input-control.readonly,
.theme-entry.psf input[type="password"].input-control.readonly,
.theme-entry.psf .readonly {
  background-color: transparent !important;
  border: 0 !important;
}

.theme-entry.psf div.search-control .input-control.text-input .input-control-m-c {
  align-items: center;
  display: flex;
}

.theme-entry.psf div.search-control .input-control.text-input .input-control-m-c > .input-control-wrapper {
  width: calc(100% - 42px);
}

.theme-entry.psf div.search-control .input-control.text-input .input-control-m-c::after,
.theme-entry.psf div.kpi div.card .kpi-icon::after,
.theme-entry.psf .toolbar-button .button-icon::after {
  font-family: "Material Symbols Outlined";
  font-variation-settings: "FILL" 0, "wght" 500, "GRAD" 0, "opsz" 24;
  line-height: 1;
}

.theme-entry.psf div.search-control .input-control.text-input .input-control-m-c::after {
  border-left: 1px solid var(--input-border-color);
  color: var(--ntx-magenta);
  content: "search";
  display: grid;
  font-size: 24px;
  height: 28px;
  margin-left: 10px;
  place-items: center;
  width: 32px;
}

.theme-entry.psf .button,
.theme-entry.psf a.SourceCode-Forms-Controls-Web-Button,
.theme-entry.psf input[type="button"],
.theme-entry.psf button {
  border-radius: 3px !important;
  font-size: 1rem !important;
  font-weight: 700 !important;
}

.theme-entry.psf a.SFC.SourceCode-Forms-Controls-Web-Button,
.theme-entry.psf a.SourceCode-Forms-Controls-Web-Button:not(.toolbar-button),
.theme-entry.psf input[type="button"].SourceCode-Forms-Controls-Web-Button,
.theme-entry.psf input[type="submit"].SourceCode-Forms-Controls-Web-Button {
  align-items: center !important;
  background: linear-gradient(90deg, var(--ntx-navy) 0%, #173743 52%, var(--ntx-purple) 100%) !important;
  border: 0 !important;
  border-radius: 8px !important;
  box-shadow: 0 3px 8px rgba(23, 55, 67, 0.13);
  color: var(--ntx-white) !important;
  display: inline-flex !important;
  font-family: var(--button-font-family) !important;
  font-size: 1.12rem !important;
  font-weight: 700 !important;
  justify-content: center !important;
  line-height: 1.1 !important;
  min-height: 40px;
  min-width: 112px;
  padding: 0.75rem 1.35rem !important;
  text-decoration: none !important;
  transition: box-shadow 160ms ease, filter 160ms ease, transform 160ms ease;
}

.theme-entry.psf a.SFC.SourceCode-Forms-Controls-Web-Button:hover,
.theme-entry.psf a.SourceCode-Forms-Controls-Web-Button:not(.toolbar-button):hover,
.theme-entry.psf input[type="button"].SourceCode-Forms-Controls-Web-Button:hover,
.theme-entry.psf input[type="submit"].SourceCode-Forms-Controls-Web-Button:hover {
  box-shadow: 0 5px 10px rgba(23, 55, 67, 0.16);
  filter: brightness(1.05);
  transform: translateY(-1px);
}

.theme-entry.psf a.SFC.SourceCode-Forms-Controls-Web-Button:focus,
.theme-entry.psf a.SourceCode-Forms-Controls-Web-Button:not(.toolbar-button):focus,
.theme-entry.psf input[type="button"].SourceCode-Forms-Controls-Web-Button:focus,
.theme-entry.psf input[type="submit"].SourceCode-Forms-Controls-Web-Button:focus {
  box-shadow: 0 0 0 3px rgba(233, 124, 47, 0.25), 0 8px 18px rgba(23, 55, 67, 0.16);
  outline: 0 !important;
}

.theme-entry.psf a.SFC.SourceCode-Forms-Controls-Web-Button.disabled,
.theme-entry.psf a.SourceCode-Forms-Controls-Web-Button:not(.toolbar-button).disabled,
.theme-entry.psf input[type="button"].SourceCode-Forms-Controls-Web-Button:disabled,
.theme-entry.psf input[type="submit"].SourceCode-Forms-Controls-Web-Button:disabled {
  cursor: default !important;
  filter: grayscale(0.35);
  opacity: 0.55;
}

.theme-entry.psf .toolbar-wrapper {
  padding-bottom: 1.2rem;
  padding-top: 0.8rem;
}

.theme-entry.psf .toolbar-button {
  border-right: 1px solid var(--ntx-line);
  margin-left: 1rem !important;
}

.theme-entry.psf .toolbar-button:last-child {
  border-right: 0 !important;
}
`;

  // Inject styles
  var styleEl = document.createElement("style");
  styleEl.type = "text/css";
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

})(window, document);
