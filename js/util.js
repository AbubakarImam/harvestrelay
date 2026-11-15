/* HarvestRelay demo — shared helpers. Plain JS, no dependencies. */
window.HR = window.HR || {};

HR.Util = (function () {
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function formatNaira(n) {
    return "₦" + Number(n).toLocaleString("en-NG");
  }

  function serviceTypeLabel(type) {
    return type === "truck" ? "Truck pool" : "Cold room pool";
  }

  function serviceTypeIcon(type) {
    return type === "truck" ? "\u{1F69A}" : "❄️";
  }

  var STATUS_META = {
    open: { label: "Open — filling up", cls: "status-open" },
    full: { label: "Full — awaiting quotes", cls: "status-full" },
    quoted: { label: "Quoted — awaiting agent", cls: "status-quoted" },
    booked: { label: "Booked — awaiting pickup", cls: "status-booked" },
    completed: { label: "Completed", cls: "status-completed" },
    expired: { label: "Expired — did not fill in time", cls: "status-expired" }
  };

  function statusMeta(status) {
    return STATUS_META[status] || { label: status, cls: "" };
  }

  function renderProgressBar(crates, threshold) {
    var pct = Math.min(100, Math.round((crates / threshold) * 100));
    return (
      '<div class="progress-track" role="progressbar" aria-valuenow="' +
      pct +
      '" aria-valuemin="0" aria-valuemax="100">' +
      '<div class="progress-fill" style="width:' +
      pct +
      '%"></div>' +
      "</div>" +
      '<div class="progress-label">' +
      crates +
      " / " +
      threshold +
      " crates (" +
      pct +
      "%)</div>"
    );
  }

  function uid(prefix) {
    return prefix + Math.random().toString(36).slice(2, 8);
  }

  return {
    escapeHtml: escapeHtml,
    formatNaira: formatNaira,
    serviceTypeLabel: serviceTypeLabel,
    serviceTypeIcon: serviceTypeIcon,
    statusMeta: statusMeta,
    renderProgressBar: renderProgressBar,
    uid: uid
  };
})();
