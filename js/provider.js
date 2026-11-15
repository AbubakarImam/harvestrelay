/* HarvestRelay demo — Provider (truck owner / cold room operator) view. */
window.HR = window.HR || {};

HR.Provider = (function () {
  var U = HR.Util;
  var rootEl;
  var currentProviderId = null;

  function init() {
    rootEl = document.getElementById("provider-root");
    rootEl.addEventListener("click", onClick);
    rootEl.addEventListener("change", onChange);
    rootEl.addEventListener("submit", onSubmit);
    HR.Store.subscribe(render);
    render();
  }

  function currentProvider(data) {
    if (!currentProviderId) return data.providers[0];
    var found = null;
    data.providers.forEach(function (p) {
      if (p.id === currentProviderId) found = p;
    });
    return found || data.providers[0];
  }

  function onChange(e) {
    if (e.target.id === "provider-select") {
      currentProviderId = e.target.value;
      render();
    }
  }

  function onClick(e) {
    var btn = e.target.closest("[data-action]");
    if (!btn) return;
    var action = btn.getAttribute("data-action");
    var poolId = btn.getAttribute("data-pool");
    if (action === "mark-collected") {
      HR.Store.markCollected(poolId);
    }
  }

  function onSubmit(e) {
    var form = e.target;
    if (!form.matches("[data-form='quote']")) return;
    e.preventDefault();
    var data = HR.Store.get();
    var provider = currentProvider(data);
    var poolId = form.getAttribute("data-pool");
    var price = parseInt(form.querySelector("[name='price']").value, 10);
    var day = form.querySelector("[name='pickupDay']").value;
    if (!price || price <= 0) return;
    HR.Store.submitQuote(poolId, {
      providerName: provider.name,
      pricePerCrate: price,
      pickupDay: day
    });
  }

  function quoteFormHtml(pool, data) {
    var days = data.pickupDayOptions[pool.week] || [pool.week];
    var dayOptions = days
      .map(function (d) {
        return "<option value='" + U.escapeHtml(d) + "'>" + U.escapeHtml(d) + "</option>";
      })
      .join("");
    return (
      "<form class='quote-form' data-form='quote' data-pool='" +
      pool.id +
      "'>" +
      "<label>Price per crate (₦)<input type='number' min='1' name='price' placeholder='e.g. 300' required></label>" +
      "<label>Pickup day<select name='pickupDay'>" +
      dayOptions +
      "</select></label>" +
      "<button type='submit' class='btn-small'>Submit quote</button>" +
      "</form>"
    );
  }

  function openPoolCard(pool, data) {
    var icon = U.serviceTypeIcon(pool.serviceType);
    var myQuoteAlready = pool.quotes.some(function (q) {
      return q.providerName === currentProvider(data).name;
    });
    return (
      "<div class='pool-card'>" +
      "<div class='pool-card-head'>" +
      "<span class='pool-icon'>" + icon + "</span>" +
      "<div>" +
      "<div class='pool-title'>" + U.escapeHtml(pool.villageCluster) + "</div>" +
      "<div class='pool-sub'>" +
      U.escapeHtml(pool.crop) + " · " + U.escapeHtml(pool.week) +
      "</div>" +
      "</div>" +
      "</div>" +
      U.renderProgressBar(pool.crates, pool.threshold) +
      (myQuoteAlready
        ? "<p class='muted'>You already submitted a quote for this pool. Waiting on the agent.</p>"
        : quoteFormHtml(pool, data)) +
      "</div>"
    );
  }

  function bookingStatusLabel(pool, quote) {
    if (pool.acceptedQuoteId === quote.id) {
      if (pool.status === "completed") return { label: "Completed", cls: "status-completed" };
      return { label: "Accepted — awaiting pickup", cls: "status-booked" };
    }
    if (pool.acceptedQuoteId && pool.acceptedQuoteId !== quote.id) {
      return { label: "Not selected", cls: "status-expired" };
    }
    return { label: "Pending — awaiting agent", cls: "status-quoted" };
  }

  function bookingRow(pool, quote) {
    var meta = bookingStatusLabel(pool, quote);
    var showCollect = pool.acceptedQuoteId === quote.id && pool.status === "booked";
    return (
      "<div class='booking-row'>" +
      "<div>" +
      "<strong>" + U.escapeHtml(pool.villageCluster) + "</strong> · " +
      U.escapeHtml(pool.crop) + " · " + U.escapeHtml(pool.week) +
      "<br><span class='muted'>" + U.formatNaira(quote.pricePerCrate) + "/crate · pickup " +
      U.escapeHtml(quote.pickupDay) + "</span>" +
      "</div>" +
      "<span class='status-badge " + meta.cls + "'>" + meta.label + "</span>" +
      (showCollect
        ? "<button type='button' class='btn-small' data-action='mark-collected' data-pool='" +
          pool.id +
          "'>Mark crates collected</button>"
        : "") +
      "</div>"
    );
  }

  function render() {
    if (!rootEl) return;
    var data = HR.Store.get();
    if (!data) return;
    var provider = currentProvider(data);

    var providerOptions = data.providers
      .map(function (p) {
        return (
          "<option value='" +
          p.id +
          "'" +
          (p.id === provider.id ? " selected" : "") +
          ">" +
          U.escapeHtml(p.name) +
          " (" +
          U.escapeHtml(U.serviceTypeLabel(p.type)) +
          ")</option>"
        );
      })
      .join("");

    var openPools = data.pools.filter(function (p) {
      return p.serviceType === provider.type && (p.status === "full" || p.status === "quoted");
    });

    var myBookings = [];
    data.pools.forEach(function (pool) {
      pool.quotes.forEach(function (q) {
        if (q.providerName === provider.name) myBookings.push({ pool: pool, quote: q });
      });
    });

    var html =
      "<div class='filter-row'>" +
      "<label for='provider-select'>I am:</label>" +
      "<select id='provider-select'>" +
      providerOptions +
      "</select>" +
      "</div>" +
      "<p class='muted'>" + U.escapeHtml(provider.base) + "</p>" +
      "<h3>Open pools you can serve <span class='inline-badge'>sample data</span></h3>" +
      (openPools.length
        ? "<div class='pool-grid'>" + openPools.map(function (p) { return openPoolCard(p, data); }).join("") + "</div>"
        : "<p class='muted'>No pools are currently ready for a quote. Check back after a pool fills.</p>") +
      "<h3>Your bookings <span class='inline-badge'>sample data</span></h3>" +
      (myBookings.length
        ? "<div class='booking-list'>" +
          myBookings
            .map(function (b) {
              return bookingRow(b.pool, b.quote);
            })
            .join("") +
          "</div>"
        : "<p class='muted'>You haven't submitted any quotes yet.</p>");

    rootEl.innerHTML = html;
  }

  return { init: init, render: render };
})();
