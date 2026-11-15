/* HarvestRelay demo — in-memory shared state store.
 * No backend, no persistence: everything lives in memory for this page
 * load and resets on reload. This is intentional for a hackathon demo.
 */
window.HR = window.HR || {};

HR.Store = (function () {
  var state = null;
  var listeners = [];
  var rawDataUrl = "data/sample-data.json";

  function load() {
    return fetch(rawDataUrl)
      .then(function (res) {
        if (!res.ok) throw new Error("Failed to load sample data: " + res.status);
        return res.json();
      })
      .then(function (json) {
        state = json;
        state.pools.forEach(function (p) {
          if (!p.quotes) p.quotes = [];
          if (!p.farmers) p.farmers = [];
        });
        return state;
      });
  }

  function get() {
    return state;
  }

  function subscribe(fn) {
    listeners.push(fn);
  }

  function notify() {
    listeners.forEach(function (fn) {
      try {
        fn(state);
      } catch (e) {
        console.error("HR.Store listener error:", e);
      }
    });
  }

  function findPool(cluster, crop, week, serviceType) {
    return state.pools.filter(function (p) {
      return (
        p.villageCluster === cluster &&
        p.crop === crop &&
        p.week === week &&
        p.serviceType === serviceType &&
        (p.status === "open" || p.status === "full")
      );
    })[0];
  }

  function getPool(poolId) {
    return state.pools.filter(function (p) {
      return p.id === poolId;
    })[0];
  }

  /* Farmer joins (or creates) a pool for cluster+crop+week+serviceType.
   * This is the critical link: it immediately updates the shared pool
   * state, so the Agent Dashboard's progress bar reflects it right away. */
  function joinPool(opts) {
    var cluster = opts.cluster,
      crop = opts.crop,
      week = opts.week,
      serviceType = opts.serviceType,
      farmerName = opts.farmerName,
      crates = opts.crates;

    var pool = findPool(cluster, crop, week, serviceType);
    if (!pool) {
      pool = {
        id: HR.Util.uid("P"),
        villageCluster: cluster,
        crop: crop,
        week: week,
        serviceType: serviceType,
        threshold: state.thresholds[serviceType],
        crates: 0,
        farmers: [],
        quotes: [],
        status: "open"
      };
      state.pools.push(pool);
    }
    pool.farmers.push({ name: farmerName, crates: crates, confirmed: false });
    pool.crates += crates;
    if (pool.status === "open" && pool.crates >= pool.threshold) {
      pool.status = "full";
    }
    notify();
    return pool;
  }

  var FILLER_FARMERS = [
    "Sadiq Bala",
    "Comfort Ayuba",
    "Mallam Shuaibu",
    "Rukaiya Idris",
    "Danladi Audu",
    "Blessing Eze",
    "Patience Okon",
    "Suleiman Garba"
  ];

  /* Demo-only: simulate other village farmers filling the rest of an open
   * pool, so the hackathon demo doesn't require waiting for real time to pass. */
  function fillRemaining(poolId) {
    var pool = getPool(poolId);
    if (!pool || pool.status !== "open") return pool;
    var i = 0;
    while (pool.crates < pool.threshold && i < FILLER_FARMERS.length) {
      var remaining = pool.threshold - pool.crates;
      var add = Math.min(remaining, Math.max(5, Math.ceil(pool.threshold / 6)));
      pool.farmers.push({ name: FILLER_FARMERS[i] + " (sample)", crates: add, confirmed: false });
      pool.crates += add;
      i++;
    }
    if (pool.crates >= pool.threshold) {
      pool.status = "full";
    }
    notify();
    return pool;
  }

  function submitQuote(poolId, opts) {
    var pool = getPool(poolId);
    if (!pool) return null;
    var quote = {
      id: HR.Util.uid("Q"),
      providerName: opts.providerName,
      pricePerCrate: opts.pricePerCrate,
      pickupDay: opts.pickupDay
    };
    pool.quotes.push(quote);
    if (pool.status === "full") pool.status = "quoted";
    notify();
    return quote;
  }

  function acceptQuote(poolId, quoteId) {
    var pool = getPool(poolId);
    if (!pool) return;
    pool.acceptedQuoteId = quoteId;
    pool.status = "booked";
    notify();
  }

  function confirmFarmer(poolId, farmerName) {
    var pool = getPool(poolId);
    if (!pool) return;
    var match = null;
    pool.farmers.forEach(function (f) {
      if (f.name === farmerName) match = f;
    });
    if (match) match.confirmed = true;
    notify();
  }

  function markCollected(poolId) {
    var pool = getPool(poolId);
    if (!pool) return;
    pool.status = "completed";
    pool.collectedCrates = pool.crates;
    pool.farmers.forEach(function (f, idx) {
      f.receiptNo = f.receiptNo || "HR-" + pool.id + "-" + String(idx + 1).padStart(3, "0");
    });
    notify();
  }

  function markExpired(poolId) {
    var pool = getPool(poolId);
    if (!pool) return;
    pool.status = "expired";
    notify();
  }

  function reopenPool(poolId) {
    var pool = getPool(poolId);
    if (!pool) return;
    pool.status = "open";
    pool.quotes = [];
    delete pool.acceptedQuoteId;
    delete pool.collectedCrates;
    notify();
  }

  function reset() {
    return load().then(function () {
      notify();
    });
  }

  return {
    load: load,
    get: get,
    subscribe: subscribe,
    notify: notify,
    findPool: findPool,
    getPool: getPool,
    joinPool: joinPool,
    fillRemaining: fillRemaining,
    submitQuote: submitQuote,
    acceptQuote: acceptQuote,
    confirmFarmer: confirmFarmer,
    markCollected: markCollected,
    markExpired: markExpired,
    reopenPool: reopenPool,
    reset: reset
  };
})();
