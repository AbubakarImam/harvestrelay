/* HarvestRelay demo — Phone simulator (USSD/SMS) view. */
window.HR = window.HR || {};

HR.Phone = (function () {
  var U = HR.Util;
  var lang = "en";
  var step = "DIAL";
  var sel = {}; // selections collected while walking through the USSD menu
  var screenEl, langBtn;

  function t(key, vars) {
    return HR.I18N.t(lang, key, vars);
  }

  function resetFlow() {
    step = "DIAL";
    sel = {};
    render();
  }

  function init() {
    screenEl = document.getElementById("phone-screen");
    langBtn = document.getElementById("lang-toggle");
    langBtn.addEventListener("click", function () {
      lang = lang === "en" ? "ha" : "en";
      langBtn.textContent = lang === "en" ? "EN / HA" : "HA / EN";
      render();
    });
    screenEl.addEventListener("click", onScreenClick);
    screenEl.addEventListener("submit", onScreenSubmit);
    render();
  }

  function onScreenSubmit(e) {
    var form = e.target;
    if (form.matches("[data-form='crates']")) {
      e.preventDefault();
      var input = form.querySelector("input[name='crates']");
      var val = parseInt(input.value, 10);
      if (!val || val <= 0) {
        input.focus();
        return;
      }
      sel.crates = val;
      step = "WEEK";
      render();
    }
  }

  function onScreenClick(e) {
    var btn = e.target.closest("[data-action]");
    if (!btn) return;
    var action = btn.getAttribute("data-action");

    if (action === "call") {
      step = "CLUSTER";
      render();
    } else if (action === "pick-cluster") {
      sel.cluster = btn.getAttribute("data-value");
      step = "CROP";
      render();
    } else if (action === "pick-crop") {
      sel.crop = btn.getAttribute("data-value");
      step = "CRATES";
      render();
    } else if (action === "pick-week") {
      sel.week = btn.getAttribute("data-value");
      step = "SERVICE";
      render();
    } else if (action === "pick-service") {
      sel.serviceType = btn.getAttribute("data-value");
      step = "REVIEW";
      render();
    } else if (action === "join-pool") {
      var pool = HR.Store.joinPool({
        cluster: sel.cluster,
        crop: sel.crop,
        week: sel.week,
        serviceType: sel.serviceType,
        farmerName: t("yourName"),
        crates: sel.crates
      });
      sel.poolId = pool.id;
      step = "JOINED";
      render();
    } else if (action === "simulate-time" || action === "check-again") {
      advancePoolView();
    } else if (action === "reply-confirm") {
      HR.Store.confirmFarmer(sel.poolId, t("yourName"));
      step = "CONFIRMED";
      render();
    } else if (action === "back-home") {
      resetFlow();
    }
  }

  /* Re-reads the shared pool state and decides which screen to show next.
   * This is what lets actions taken on the Agent / Provider tabs (accepting
   * a quote, marking pickup) become visible back on the phone. */
  function advancePoolView() {
    var pool = HR.Store.getPool(sel.poolId);
    if (!pool) {
      step = "JOINED";
      render();
      return;
    }
    if (pool.status === "open") {
      HR.Store.fillRemaining(pool.id);
      pool = HR.Store.getPool(sel.poolId);
    }
    if (pool.status === "open" || pool.status === "full" || pool.status === "quoted") {
      step = "WAITING_QUOTE";
    } else if (pool.status === "booked") {
      var me = findMe(pool);
      step = me && me.confirmed ? "CONFIRMED" : "SMS_QUOTE";
    } else if (pool.status === "completed") {
      step = "RECEIPT";
    } else if (pool.status === "expired") {
      step = "EXPIRED";
    }
    render();
  }

  function findMe(pool) {
    var found = null;
    pool.farmers.forEach(function (f) {
      if (f.name === t("yourName")) found = f;
    });
    return found;
  }

  function acceptedQuote(pool) {
    if (!pool || !pool.acceptedQuoteId) return null;
    var found = null;
    pool.quotes.forEach(function (q) {
      if (q.id === pool.acceptedQuoteId) found = q;
    });
    return found;
  }

  function screenWrap(inner, footer) {
    return (
      '<div class="ussd-badge">Demo - sample data</div>' +
      '<div class="ussd-body">' +
      inner +
      "</div>" +
      (footer ? '<div class="ussd-footer">' + footer + "</div>" : "")
    );
  }

  function btnHtml(label, action, value) {
    return (
      '<button type="button" class="ussd-btn" data-action="' +
      action +
      '"' +
      (value !== undefined ? ' data-value="' + U.escapeHtml(value) + '"' : "") +
      ">" +
      U.escapeHtml(label) +
      "</button>"
    );
  }

  function render() {
    if (!screenEl) return;
    var html = "";
    var data = HR.Store.get();

    if (step === "DIAL") {
      html = screenWrap(
        '<p class="ussd-dial">' + U.escapeHtml(t("dialPrompt")) + "</p>" +
          "<p>" + U.escapeHtml(t("welcome")) + "</p>",
        btnHtml(t("callButton"), "call")
      );
    } else if (step === "CLUSTER") {
      var clusterBtns = data.villageClusters
        .map(function (c) {
          return btnHtml(c, "pick-cluster", c);
        })
        .join("");
      html = screenWrap('<p>' + U.escapeHtml(t("selectCluster")) + "</p>" + clusterBtns);
    } else if (step === "CROP") {
      html = screenWrap(
        "<p>" + U.escapeHtml(t("selectCrop")) + "</p>" +
          btnHtml(t("tomatoes"), "pick-crop", "Tomatoes") +
          btnHtml(t("peppers"), "pick-crop", "Peppers")
      );
    } else if (step === "CRATES") {
      html = screenWrap(
        '<p>' + U.escapeHtml(t("enterCrates")) + "</p>" +
          '<form data-form="crates" class="ussd-form">' +
          '<input type="number" min="1" name="crates" placeholder="' +
          U.escapeHtml(t("cratesPlaceholder")) +
          '" autofocus>' +
          '<button type="submit" class="ussd-btn">' + U.escapeHtml(t("send")) + "</button>" +
          "</form>"
      );
    } else if (step === "WEEK") {
      var weekBtns = data.weeks
        .map(function (w) {
          return btnHtml(w, "pick-week", w);
        })
        .join("");
      html = screenWrap("<p>" + U.escapeHtml(t("selectWeek")) + "</p>" + weekBtns);
    } else if (step === "SERVICE") {
      html = screenWrap(
        "<p>" + U.escapeHtml(t("selectService")) + "</p>" +
          btnHtml(t("truckOption"), "pick-service", "truck") +
          btnHtml(t("coldRoomOption"), "pick-service", "cold_room")
      );
    } else if (step === "REVIEW") {
      html = screenWrap(
        "<p>" + U.escapeHtml(t("reviewTitle")) + "</p>" +
          '<ul class="ussd-summary">' +
          "<li>" + U.escapeHtml(sel.cluster) + "</li>" +
          "<li>" + U.escapeHtml(sel.crop) + "</li>" +
          "<li>" + sel.crates + " crates</li>" +
          "<li>" + U.escapeHtml(sel.week) + "</li>" +
          "<li>" + U.escapeHtml(U.serviceTypeLabel(sel.serviceType)) + "</li>" +
          "</ul>" +
          btnHtml(t("joinButton"), "join-pool") +
          btnHtml(t("editButton"), "back-home")
      );
    } else if (step === "JOINED") {
      var pool = HR.Store.getPool(sel.poolId);
      html = screenWrap(
        "<p><strong>" + U.escapeHtml(t("joinedTitle")) + "</strong></p>" +
          "<p>" +
          U.escapeHtml(
            t("joinedMsg", { cluster: sel.cluster, crop: sel.crop, week: sel.week })
          ) +
          "</p>" +
          "<p>" + U.escapeHtml(t("waitingForFill")) + "</p>" +
          U.renderProgressBar(pool.crates, pool.threshold),
        btnHtml(t("simulateTime"), "simulate-time") + btnHtml(t("backHome"), "back-home")
      );
    } else if (step === "WAITING_QUOTE") {
      var pool2 = HR.Store.getPool(sel.poolId);
      var msg = pool2.quotes.length > 0 ? t("waitingQuoted") : t("waitingFullNoQuotes");
      html = screenWrap(
        "<p>" + U.escapeHtml(msg) + "</p>" + U.renderProgressBar(pool2.crates, pool2.threshold),
        btnHtml(t("checkAgain"), "check-again") + btnHtml(t("backHome"), "back-home")
      );
    } else if (step === "SMS_QUOTE") {
      var pool3 = HR.Store.getPool(sel.poolId);
      var q = acceptedQuote(pool3);
      var total = q ? q.pricePerCrate * sel.crates : 0;
      html = screenWrap(
        '<p class="sms-header">' + U.escapeHtml(t("smsQuoteHeader")) + "</p>" +
          '<p class="sms-bubble">' +
          U.escapeHtml(
            t("smsQuoteReady", {
              provider: q ? q.providerName : "",
              pickupDay: q ? q.pickupDay : "",
              crates: sel.crates,
              total: U.formatNaira(total),
              price: U.formatNaira(q ? q.pricePerCrate : 0)
            })
          ) +
          "</p>",
        btnHtml(t("replyConfirm"), "reply-confirm") + btnHtml(t("backHome"), "back-home")
      );
    } else if (step === "CONFIRMED") {
      var pool4 = HR.Store.getPool(sel.poolId);
      var q4 = acceptedQuote(pool4);
      html = screenWrap(
        '<p class="sms-bubble">' +
          U.escapeHtml(t("confirmedMsg", { pickupDay: q4 ? q4.pickupDay : "" })) +
          "</p>",
        btnHtml(t("checkAgain"), "check-again") + btnHtml(t("backHome"), "back-home")
      );
    } else if (step === "RECEIPT") {
      var pool5 = HR.Store.getPool(sel.poolId);
      var me = findMe(pool5);
      var q5 = acceptedQuote(pool5);
      html = screenWrap(
        '<p class="sms-header">' + U.escapeHtml(t("smsReceiptHeader")) + "</p>" +
          '<p class="sms-bubble">' +
          U.escapeHtml(
            t("smsReceipt", {
              receiptNo: me ? me.receiptNo : "HR-" + pool5.id + "-DEMO",
              crates: sel.crates,
              crop: sel.crop,
              pickupDay: q5 ? q5.pickupDay : ""
            })
          ) +
          "</p>",
        btnHtml(t("backHome"), "back-home")
      );
    } else if (step === "EXPIRED") {
      html = screenWrap(
        '<p class="sms-header">' + U.escapeHtml(t("smsExpiredHeader")) + "</p>" +
          '<p class="sms-bubble">' + U.escapeHtml(t("smsExpired")) + "</p>",
        btnHtml(t("backHome"), "back-home")
      );
    }

    screenEl.innerHTML = html;
  }

  return { init: init, render: render };
})();
