/* HarvestRelay demo — simple English / Hausa strings for the USSD phone
 * simulator. Hausa phrasing is simplified for a basic-phone USSD menu and
 * labeled as such — not a professional translation. */
window.HR = window.HR || {};

HR.I18N = {
  en: {
    langName: "English",
    dialPrompt: "Dial *384*77#",
    callButton: "Call",
    welcome: "Welcome to HarvestRelay",
    selectCluster: "Select your village cluster:",
    selectCrop: "Select your crop:",
    tomatoes: "1. Tomatoes",
    peppers: "2. Peppers",
    enterCrates: "Enter number of crates:",
    cratesPlaceholder: "e.g. 30",
    send: "Send",
    selectWeek: "Select harvest week:",
    selectService: "Choose pooling type:",
    truckOption: "1. Truck pool (share a lorry)",
    coldRoomOption: "2. Cold room pool (share storage)",
    reviewTitle: "Confirm your request:",
    joinButton: "1. Join pool",
    editButton: "Start over",
    joinedTitle: "Request sent",
    joinedMsg: "You have joined the pool for {cluster} — {crop} — {week}.",
    waitingForFill: "Pool status:",
    simulateTime: "Simulate: time passing",
    checkAgain: "Check pool status",
    backHome: "Back to start",
    waitingFullNoQuotes: "Pool is full! Waiting for nearby providers to send a price. Please check again shortly.",
    waitingQuoted: "Offers received from providers. Waiting for your agent to accept the best one. Please check again shortly.",
    smsQuoteHeader: "SMS from HarvestRelay:",
    smsQuoteReady: "Your pool is ready! {provider} will collect on {pickupDay}. Your share for {crates} crates: {total} ({price}/crate).",
    replyConfirm: "1. Reply 1: Confirm",
    confirmedMsg: "Thank you. Your pickup is confirmed for {pickupDay}. We'll SMS you a receipt after pickup.",
    smsReceiptHeader: "SMS receipt from HarvestRelay:",
    smsReceipt: "Receipt #{receiptNo}: {crates} crates of {crop} collected on {pickupDay}. Thank you for farming with HarvestRelay.",
    smsExpiredHeader: "SMS from HarvestRelay:",
    smsExpired: "Sorry, this pool did not fill in time this week. You may join next week's pool or arrange other transport.",
    yourName: "You (Demo Farmer)"
  },
  ha: {
    langName: "Hausa",
    dialPrompt: "Bugi *384*77#",
    callButton: "Kira",
    welcome: "Barka da zuwa HarvestRelay",
    selectCluster: "Zaɓi ƙungiyar ƙauyenku:",
    selectCrop: "Zaɓi amfanin gonarku:",
    tomatoes: "1. Tumatir",
    peppers: "2. Barkono",
    enterCrates: "Shigar da adadin kwanduna:",
    cratesPlaceholder: "misali 30",
    send: "Aika",
    selectWeek: "Zaɓi makon girbi:",
    selectService: "Zaɓi nau'in haɗin kai:",
    truckOption: "1. Rukunin mota (raba lori)",
    coldRoomOption: "2. Rukunin ɗakin sanyi (raba ma'ajiya)",
    reviewTitle: "Tabbatar da bukatarka:",
    joinButton: "1. Shiga rukuni",
    editButton: "Sake farawa",
    joinedTitle: "An aika bukata",
    joinedMsg: "Ka shiga rukunin {cluster} — {crop} — {week}.",
    waitingForFill: "Matsayin rukuni:",
    simulateTime: "Kwaikwayo: lokaci yana wucewa",
    checkAgain: "Duba matsayin rukuni",
    backHome: "Koma farawa",
    waitingFullNoQuotes: "Rukuni ya cika! Muna jiran masu bada sabis su aiko farashi. Da fatan za a sake duba ba da jimawa ba.",
    waitingQuoted: "An samu tayi daga masu bada sabis. Muna jiran wakilinku ya karɓi mafi kyau. Da fatan za a sake duba ba da jimawa ba.",
    smsQuoteHeader: "SMS daga HarvestRelay:",
    smsQuoteReady: "Rukunin ka ya shirya! {provider} zai zo karɓa a {pickupDay}. Rabonka na kwanduna {crates}: {total} ({price}/kwando).",
    replyConfirm: "1. Amsa 1: Tabbatar",
    confirmedMsg: "Na gode. An tabbatar da karɓar kaya a {pickupDay}. Za mu aiko maka rasit bayan an karɓa.",
    smsReceiptHeader: "Rasit na SMS daga HarvestRelay:",
    smsReceipt: "Rasit #{receiptNo}: An karɓi kwanduna {crates} na {crop} a {pickupDay}. Na gode da noma tare da HarvestRelay.",
    smsExpiredHeader: "SMS daga HarvestRelay:",
    smsExpired: "Yi haƙuri, rukunin nan bai cika a kan lokaci ba a wannan makon. Za ka iya shiga rukunin mako mai zuwa ko ka nemi wata hanyar kai kayanka.",
    yourName: "Kai (Manomin Demo)"
  }
};

HR.I18N.t = function (lang, key, vars) {
  var dict = HR.I18N[lang] || HR.I18N.en;
  var str = dict[key] !== undefined ? dict[key] : HR.I18N.en[key] || key;
  if (vars) {
    Object.keys(vars).forEach(function (k) {
      str = str.replace("{" + k + "}", vars[k]);
    });
  }
  return str;
};
