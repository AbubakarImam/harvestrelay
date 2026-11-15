/* HarvestRelay demo — Agent dashboard view. */
window.HR = window.HR || {};

HR.Agent = (function () {
  var U = HR.Util;
  var rootEl;
  var clusterFilter = "all";
  var STATUS_ORDER = ["quoted", "full", "open", "booked", "completed", "expired"];

  function init() {
    rootEl = document.getElementById("agent-root");
    rootEl.addEventListener("click", onClick);
    rootEl.addEventListener("change", onChange);
    HR.Store.subscribe(render);
    render();
  }

  function onChange(e) {
    if (e.target.id === "agent-cluster-filter") {
      clusterFilter = e.target.value;
      render();
    }
  }

  function onClick(e) {
    var btn = e.target.closest("[data-action]");
    if (!btn) return;
    var action = btn.getAttribute("data-action");
    var poolId = btn.getAttribute("data-pool");
    if (action === "accept-quote") {
      HR.Store.acceptQuote(poolId, btn.getAttribute("data-quote"));
    } else if (action === "expire-pool") {
      HR.Store.markExpired(poolId);
    } else if (action === "reopen-pool") {
      HR.Store.reopenPool(poolId);
    }
  }

  function farmersServedCount(data) {
    var names = {};
    data.pools.forEach(function (p) {
      p.farmers.forEach(function (f) {
        names[f.name] = true;
      });
    });
    return Object.keys(names).length;
  }

  function poolCard(pool) {
    var meta = U.statusMeta(pool.status);
    var icon = U.serviceTypeIcon(pool.serviceType);
    var body =
      '<div class="pool-card ' +
      meta.cls +
      '">' +
      '<div class="pool-card-head">' +
      "<span class='pool-icon'>" + icon + "</span>" +
      "<div>" +
      "<div class='pool-title'>" + U.escapeHtml(pool.villageCluster) + "</div>" +
      "<div class='pool-sub'>" +
      U.escapeHtml(pool.crop) +
      " · " +
      U.escapeHtml(pool.week) +
      " · " +
      U.escapeHtml(U.serviceTypeLabel(pool.serviceType)) +
      "</div>" +
      "</div>" +
      "<span class='status-badge " + meta.cls + "'>" + meta.label + "</span>" +
      "</div>" +
      U.renderProgressBar(pool.crates, pool.threshold) +
      "<div class='pool-meta'>" + pool.farmers.length + " farmers in this pool</div>";

    if (pool.status === "full" || pool.status === "quoted") {
      if (pool.quotes.length === 0) {
        body += "<p class='muted'>Awaiting provider quotes&hellip;</p>";
      } else {
        body += "<div class='quote-list'>";
        pool.quotes.forEach(function (q) {
          body +=
            "<div class='quote-row'>" +
            "<div><strong>" + U.escapeHtml(q.providerName) + "</strong><br>" +
            U.formatNaira(q.pricePerCrate) + "/crate · pickup " + U.escapeHtml(q.pickupDay) +
            "</div>" +
            "<button type='button' class='btn-small' data-action='accept-quote' data-pool='" +
            pool.id +
            "' data-quote='" +
            q.id +
            "'>Accept quote</button>" +
            "</div>";
        });
        body += "</div>";
      }
      if (pool.status === "open" || pool.status === "full") {
        body +=
          "<button type='button' class='btn-link' data-action='expire-pool' data-pool='" +
          pool.id +
          "'>Demo: mark pool expired (didn't fill in time)</button>";
      }
    } else if (pool.status === "open") {
      body +=
        "<button type='button' class='btn-link' data-action='expire-pool' data-pool='" +
        pool.id +
        "'>Demo: mark pool expired (didn't fill in time)</button>";
    } else if (pool.status === "booked") {
      var q2 = pool.quotes.filter(function (q) {
        return q.id === pool.acceptedQuoteId;
      })[0];
      body +=
        "<p class='muted'>Accepted: " +
        (q2 ? U.escapeHtml(q2.providerName) + " · pickup " + U.escapeHtml(q2.pickupDay) : "") +
        " &mdash; awaiting pickup.</p>";
    } else if (pool.status === "completed") {
      body +=
        "<p class='muted'>✅ " +
        (pool.collectedCrates || pool.crates) +
        " crates collected. SMS receipts sent to all farmers.</p>";
    } else if (pool.status === "expired") {
      body +=
        "<p class='muted'>⚠️ Did not reach the minimum in time. Farmers were notified early.</p>" +
        "<button type='button' class='btn-link' data-action='reopen-pool' data-pool='" +
        pool.id +
        "'>Demo: reopen pool</button>";
    }

    body += "</div>";
    return body;
  }

  function render() {
    if (!rootEl) return;
    var data = HR.Store.get();
    if (!data) return;

    var pools = data.pools.slice();
    if (clusterFilter !== "all") {
      pools = pools.filter(function (p) {
        return p.villageCluster === clusterFilter;
      });
    }
    pools.sort(function (a, b) {
      return STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status);
    });

    var openCount = data.pools.filter(function (p) {
      return p.status === "open" || p.status === "full" || p.status === "quoted";
    }).length;
    var completedCount = data.pools.filter(function (p) {
      return p.status === "completed";
    }).length;

    var clusterOptions = data.villageClusters
      .map(function (c) {
        return (
          "<option value='" +
          U.escapeHtml(c) +
          "'" +
          (clusterFilter === c ? " selected" : "") +
          ">" +
          U.escapeHtml(c) +
          "</option>"
        );
      })
      .join("");

    var html =
      "<div class='stats-row'>" +
      "<div class='stat-tile'><div class='stat-num'>" +
      farmersServedCount(data) +
      "</div><div class='stat-label'>Farmers served (sample data)</div></div>" +
      "<div class='stat-tile'><div class='stat-num'>" +
      openCount +
      "</div><div class='stat-label'>Active pools</div></div>" +
      "<div class='stat-tile'><div class='stat-num'>" +
      completedCount +
      "</div><div class='stat-label'>Completed bookings</div></div>" +
      "</div>" +
      "<div class='filter-row'>" +
      "<label for='agent-cluster-filter'>Village cluster:</label>" +
      "<select id='agent-cluster-filter'>" +
      "<option value='all'" +
      (clusterFilter === "all" ? " selected" : "") +
      ">All clusters</option>" +
      clusterOptions +
      "</select>" +
      "</div>" +
      "<div class='pool-grid'>" +
      pools.map(poolCard).join("") +
      "</div>" +
      "<div class='agents-list'>" +
      "<h3>Agents in this cooperative <span class='inline-badge'>sample data</span></h3>" +
      "<ul>" +
      data.agents
        .map(function (a) {
          return (
            "<li><strong>" +
            U.escapeHtml(a.name) +
            "</strong> — " +
            U.escapeHtml(a.villageCluster) +
            "</li>"
          );
        })
        .join("") +
      "</ul>" +
      "</div>";

    rootEl.innerHTML = html;
  }

  return { init: init, render: render };
})();
