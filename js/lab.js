/* PrimeLab Diagnostics — test catalogue, home-collection booking, report tracker.
   Pure helpers are exposed as window.PrimeLab so they can be unit-tested in Node. */
(function () {
  'use strict';
  var WA = '923001234567';
  var TESTS = [
    { id: 'cbc', name: 'Complete Blood Count (CBC)', cat: 'Blood Tests', price: 800, sample: 'Blood (EDTA)', report: '6 hours' },
    { id: 'esr', name: 'ESR (Westergren)', cat: 'Blood Tests', price: 400, sample: 'Blood (EDTA)', report: '6 hours' },
    { id: 'blood-group', name: 'Blood Group (ABO / Rh)', cat: 'Blood Tests', price: 500, sample: 'Blood (EDTA)', report: '2 hours' },
    { id: 'lipid-profile', name: 'Lipid Profile (Fasting)', cat: 'Blood Tests', price: 1700, sample: 'Blood (Serum)', report: '12 hours' },
    { id: 'crp', name: 'CRP (C-Reactive Protein)', cat: 'Blood Tests', price: 1100, sample: 'Blood (Serum)', report: '12 hours' },
    { id: 'fasting-sugar', name: 'Blood Sugar — Fasting', cat: 'Diabetes Care', price: 300, sample: 'Blood (Fluoride)', report: '2 hours' },
    { id: 'random-sugar', name: 'Blood Sugar — Random', cat: 'Diabetes Care', price: 300, sample: 'Blood (Fluoride)', report: '2 hours' },
    { id: 'hba1c', name: 'HbA1c (3-Month Sugar Average)', cat: 'Diabetes Care', price: 1800, sample: 'Blood (EDTA)', report: '24 hours' },
    { id: 'ogtt', name: 'Glucose Tolerance Test (GTT)', cat: 'Diabetes Care', price: 1500, sample: 'Blood (Series)', report: '6 hours' },
    { id: 'lft', name: 'Liver Function Tests (LFT)', cat: 'Liver & Kidney', price: 1600, sample: 'Blood (Serum)', report: '12 hours' },
    { id: 'rft', name: 'Renal Function Tests (RFT)', cat: 'Liver & Kidney', price: 1600, sample: 'Blood (Serum)', report: '12 hours' },
    { id: 'electrolytes', name: 'Serum Electrolytes (Na, K, Cl)', cat: 'Liver & Kidney', price: 1200, sample: 'Blood (Serum)', report: '6 hours' },
    { id: 'calcium', name: 'Serum Calcium', cat: 'Liver & Kidney', price: 700, sample: 'Blood (Serum)', report: '6 hours' },
    { id: 'tsh', name: 'TSH (Thyroid)', cat: 'Hormones & Vitamins', price: 1500, sample: 'Blood (Serum)', report: '24 hours' },
    { id: 'free-t3-t4', name: 'Free T3 + Free T4', cat: 'Hormones & Vitamins', price: 2800, sample: 'Blood (Serum)', report: '24 hours' },
    { id: 'vitamin-d', name: 'Vitamin D (25-OH)', cat: 'Hormones & Vitamins', price: 3500, sample: 'Blood (Serum)', report: '48 hours' },
    { id: 'testosterone', name: 'Testosterone (Total)', cat: 'Hormones & Vitamins', price: 2200, sample: 'Blood (Serum)', report: '48 hours' },
    { id: 'beta-hcg', name: 'Beta hCG (Pregnancy Test)', cat: 'Hormones & Vitamins', price: 1800, sample: 'Blood (Serum)', report: '12 hours' },
    { id: 'dengue-ns1', name: 'Dengue NS1 Antigen', cat: 'Infectious Disease', price: 2500, sample: 'Blood (Serum)', report: '12 hours' },
    { id: 'malaria', name: 'Malaria Parasite / ICT', cat: 'Infectious Disease', price: 800, sample: 'Blood (EDTA)', report: '6 hours' },
    { id: 'hbsag', name: 'HBsAg (Hepatitis B Screening)', cat: 'Infectious Disease', price: 1200, sample: 'Blood (Serum)', report: '24 hours' },
    { id: 'anti-hcv', name: 'Anti-HCV (Hepatitis C Screening)', cat: 'Infectious Disease', price: 1200, sample: 'Blood (Serum)', report: '24 hours' },
    { id: 'typhidot', name: 'Typhidot (Typhoid Screening)', cat: 'Infectious Disease', price: 1000, sample: 'Blood (Serum)', report: '12 hours' },
    { id: 'anti-hiv', name: 'Anti-HIV Screening', cat: 'Infectious Disease', price: 1400, sample: 'Blood (Serum)', report: '24 hours' },
    { id: 'urine-re', name: 'Urine Complete Examination', cat: 'Urine Tests', price: 600, sample: 'Urine', report: '6 hours' },
    { id: 'urine-culture', name: 'Urine Culture & Sensitivity', cat: 'Urine Tests', price: 1800, sample: 'Urine (Sterile container)', report: '72 hours' }
  ];
  var CATEGORIES = [];
  TESTS.forEach(function (t) { if (CATEGORIES.indexOf(t.cat) < 0) CATEGORIES.push(t.cat); });
  var SLOTS = ['7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM'];
  var AREAS = ['DHA Lahore', 'Gulberg', 'Johar Town', 'Model Town', 'Bahria Town', 'Township', 'Cantt', 'Valencia Town', 'Wapda Town', 'Askari', 'Other Lahore area'];
  var STAGES = ['Booked', 'Sample Collected', 'Testing in Progress', 'Report Ready'];
  var COLLECTION_FEE = 300, FREE_ABOVE = 3000;

  function findTest(id) { for (var i = 0; i < TESTS.length; i++) if (TESTS[i].id === id) return TESTS[i]; return null; }
  function filterTests(query, cat) {
    var q = (query || '').trim().toLowerCase();
    return TESTS.filter(function (t) {
      if (cat && t.cat !== cat) return false;
      if (!q) return true;
      return (t.name + ' ' + t.cat + ' ' + t.sample).toLowerCase().indexOf(q) >= 0;
    });
  }
  function fmt(n) { return 'Rs. ' + n.toLocaleString('en-PK'); }
  function makeRef() { return 'PL-' + Math.floor(100000 + Math.random() * 900000); }
  function validRef(ref) { return /^PL-\d{6}$/.test((ref || '').trim().toUpperCase()); }
  function validatePhone(p) { var d = (p || '').replace(/\D/g, ''); return d.length >= 10 && d.length <= 13; }
  function todayStr() { var d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  function isPastDate(s) { return !!s && s < todayStr(); }
  function isSunday(s) { return !!s && new Date(s + 'T12:00:00').getDay() === 0; }
  function slotsForDate(s) { return isSunday(s) ? SLOTS.slice(0, 6) : SLOTS.slice(); }
  function collectionFee(subtotal) { return subtotal >= FREE_ABOVE ? 0 : COLLECTION_FEE; }
  function saveBooking(bk) {
    try { var all = JSON.parse(localStorage.getItem('primelabBookings') || '{}'); all[bk.ref] = bk; localStorage.setItem('primelabBookings', JSON.stringify(all)); } catch (e) {}
  }
  function getBooking(ref) {
    try { var all = JSON.parse(localStorage.getItem('primelabBookings') || '{}'); return all[(ref || '').trim().toUpperCase()] || null; } catch (e) { return null; }
  }
  /* Deterministic demo status: saved bookings start at stage 1 (Sample Collected path),
     any other well-formed PL ref maps to a stable stage from its digits. */
  function reportStatus(ref) {
    ref = (ref || '').trim().toUpperCase();
    if (!validRef(ref)) return null;
    var bk = (typeof localStorage !== 'undefined') ? getBooking(ref) : null;
    var stage;
    if (bk) stage = 1;
    else { var sum = 0; for (var i = 0; i < ref.length; i++) sum += ref.charCodeAt(i); stage = sum % STAGES.length; }
    return { ref: ref, stage: stage, label: STAGES[stage], booking: bk, stages: STAGES.slice() };
  }
  function buildWhatsAppUrl(bk) {
    var lines = ['Assalam-o-Alaikum! PrimeLab home collection booking ' + bk.ref,
      'Tests: ' + bk.testNames.join(', '),
      'Date: ' + bk.date + ' at ' + bk.slot,
      'Name: ' + bk.name, 'Phone: ' + bk.phone,
      'Area: ' + bk.area, 'Address: ' + bk.address,
      'Total (incl. collection): ' + fmt(bk.total)];
    return 'https://wa.me/' + WA + '?text=' + encodeURIComponent(lines.join('\n'));
  }
  var API = { TESTS: TESTS, CATEGORIES: CATEGORIES, SLOTS: SLOTS, AREAS: AREAS, STAGES: STAGES,
    findTest: findTest, filterTests: filterTests, fmt: fmt, makeRef: makeRef, validRef: validRef,
    validatePhone: validatePhone, todayStr: todayStr, isPastDate: isPastDate, isSunday: isSunday,
    slotsForDate: slotsForDate, collectionFee: collectionFee, saveBooking: saveBooking,
    getBooking: getBooking, reportStatus: reportStatus, buildWhatsAppUrl: buildWhatsAppUrl };
  if (typeof window !== 'undefined') window.PrimeLab = API;
  if (typeof global !== 'undefined') global.PrimeLab = API;
  if (typeof document === 'undefined' || !document.getElementById) return;

  function el(id) { return document.getElementById(id); }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }

  /* ---------- Popular tests (home) ---------- */
  var pop = el('popularTests');
  if (pop) {
    var picks = ['cbc', 'hba1c', 'lipid-profile', 'vitamin-d', 'lft', 'dengue-ns1', 'tsh', 'urine-re'];
    pop.innerHTML = picks.map(function (id) { var t = findTest(id); return '' +
      '<article class="card reveal"><div class="card-body"><span class="pill">' + esc(t.cat.toUpperCase()) + '</span>' +
      '<h3>' + esc(t.name) + '</h3><p>Sample: ' + esc(t.sample) + '<br>Report: ' + esc(t.report) + '</p>' +
      '<span class="price">' + fmt(t.price) + '</span><br><a href="home-collection.html" class="btn">Book at Home</a></div></article>'; }).join('');
  }

  /* ---------- Tests page: search / filter / catalogue ---------- */
  var catSel = el('catFilter'), catalogue = el('testCatalogue');
  if (catSel && catalogue) {
    CATEGORIES.forEach(function (c) { var o = document.createElement('option'); o.value = c; o.textContent = c; catSel.appendChild(o); });
    function render() {
      var list = filterTests(el('testSearch').value, catSel.value);
      el('testCount').textContent = list.length + ' test' + (list.length === 1 ? '' : 's') + ' found';
      var html = '', lastCat = null;
      list.forEach(function (t) {
        if (t.cat !== lastCat) { lastCat = t.cat; html += '<h2 class="cat-head">' + esc(t.cat) + '</h2><div class="test-grid">'; }
        html += '<article class="test-card"><h3>' + esc(t.name) + '</h3><p class="meta">Sample: ' + esc(t.sample) + ' &middot; Report: ' + esc(t.report) + '</p>' +
          '<div class="row"><span class="price">' + fmt(t.price) + '</span><a href="home-collection.html" class="btn">Book</a></div></article>';
        var next = list[list.indexOf(t) + 1]; if (!next || next.cat !== t.cat) html += '</div>';
      });
      catalogue.innerHTML = html || '<p>No test matches that search — try a shorter word, or message us on WhatsApp.</p>';
    }
    el('testSearch').addEventListener('input', render);
    catSel.addEventListener('change', render);
    render();
  }

  /* ---------- Report lookup (reports page + home widget) ---------- */
  function statusHtml(st) {
    var steps = st.stages.map(function (s, i) { return '<li class="' + (i <= st.stage ? 'done' : '') + '">' + (i + 1) + '. ' + esc(s) + '</li>'; }).join('');
    var who = st.booking ? ('<p><b>' + esc(st.booking.name) + '</b> — ' + esc(st.booking.testNames.join(', ')) + '<br>Booked for ' + esc(st.booking.date) + ' at ' + esc(st.booking.slot) + '</p>') : '';
    var ready = st.stage === 3 ? '<p class="ok">Your report is ready — it has been sent to your WhatsApp. Need a printed copy? Visit the Gulberg lab with this reference.</p>' : '<p>Current stage: <b>' + esc(st.label) + '</b>. Reports are delivered on WhatsApp as soon as they are ready.</p>';
    return who + '<ul class="status-steps">' + steps + '</ul>' + ready;
  }
  function wireLookup(inputId, btnId, errId, outId) {
    var btn = el(btnId); if (!btn) return;
    btn.addEventListener('click', function () {
      var ref = el(inputId).value, err = el(errId), out = el(outId);
      var st = reportStatus(ref);
      if (!st) { err.textContent = 'Please enter a valid reference in the format PL-123456.'; err.style.display = 'block'; out.innerHTML = ''; return; }
      err.style.display = 'none'; out.innerHTML = statusHtml(st);
    });
  }
  wireLookup('repRef', 'repBtn', 'repErr', 'repResult');
  wireLookup('homeRef', 'homeLookupBtn', 'homeLookupErr', 'homeLookupResult');

  /* ---------- Booking wizard (home-collection page) ---------- */
  var bkTests = el('bkTests');
  if (bkTests) {
    bkTests.innerHTML = TESTS.map(function (t) {
      return '<label class="check-item"><input type="checkbox" value="' + t.id + '"><span style="flex:1"><b>' + esc(t.name) + '</b>' + esc(t.cat) + ' &middot; report ' + esc(t.report) + '</span><span>' + fmt(t.price) + '</span></label>';
    }).join('');
    var areaSel = el('bkArea');
    AREAS.forEach(function (a) { var o = document.createElement('option'); o.value = a; o.textContent = a; areaSel.appendChild(o); });
    var dateIn = el('bkDate'); dateIn.min = todayStr(); dateIn.value = todayStr();
    var state = { step: 1, tests: [], date: todayStr(), slot: '', name: '', phone: '', area: AREAS[0], address: '', notes: '' };
    var steps = document.querySelectorAll('.bk-step'), prog = document.querySelectorAll('#bkProgress li');
    function show(n) {
      state.step = n;
      steps.forEach(function (s) { s.classList.toggle('on', parseInt(s.getAttribute('data-step'), 10) === n); });
      prog.forEach(function (li, i) { li.className = i + 1 < n ? 'done' : (i + 1 === n ? 'current' : ''); });
      if (n === 2) renderSlots();
      if (n === 4) renderReview();
    }
    function chosen() { return Array.prototype.slice.call(bkTests.querySelectorAll('input:checked')).map(function (c) { return findTest(c.value); }); }
    function totals() { var sub = chosen().reduce(function (s, t) { return s + t.price; }, 0); var fee = sub ? collectionFee(sub) : 0; return { sub: sub, fee: fee, total: sub + fee }; }
    function updTotal() { var t = totals(); el('bkTotal').textContent = t.sub ? ('Selected total: ' + fmt(t.sub) + (t.fee ? ' + ' + fmt(t.fee) + ' collection = ' + fmt(t.total) : ' — collection FREE (over ' + fmt(FREE_ABOVE) + ')')) : 'No tests selected yet.'; }
    bkTests.addEventListener('change', updTotal); updTotal();
    function renderSlots() {
      state.date = dateIn.value || todayStr();
      var wrap = el('bkSlots');
      wrap.innerHTML = slotsForDate(state.date).map(function (s) { return '<button type="button" class="bk-slot' + (s === state.slot ? ' selected' : '') + '" data-slot="' + s + '">' + s + '</button>'; }).join('');
      wrap.querySelectorAll('.bk-slot').forEach(function (b) { b.addEventListener('click', function () { state.slot = b.getAttribute('data-slot'); renderSlots(); }); });
    }
    dateIn.addEventListener('change', function () { state.slot = ''; renderSlots(); });
    function err(id, msg) { var e = el(id); e.textContent = msg || ''; e.style.display = msg ? 'block' : 'none'; return !msg; }
    document.querySelectorAll('[data-next]').forEach(function (b) { b.addEventListener('click', function () {
      if (state.step === 1) { if (!err('bkErr1', chosen().length ? '' : 'Please select at least one test.')) return; }
      if (state.step === 2) {
        if (!err('bkErr2', !dateIn.value ? 'Please pick a collection date.' : (isPastDate(dateIn.value) ? 'That date has passed — please pick a future date.' : (!state.slot ? 'Please choose a time slot.' : '')))) return;
        state.date = dateIn.value;
      }
      if (state.step === 3) {
        state.name = el('bkName').value.trim(); state.phone = el('bkPhone').value.trim();
        state.area = areaSel.value; state.address = el('bkAddress').value.trim(); state.notes = el('bkNotes').value.trim();
        if (!err('bkErr3', !state.name ? 'Please add your full name.' : (!validatePhone(state.phone) ? 'Please add a valid mobile number (at least 10 digits).' : (state.address.length < 8 ? 'Please add your complete address so our team can find you.' : '')))) return;
      }
      show(state.step + 1);
    }); });
    document.querySelectorAll('[data-back]').forEach(function (b) { b.addEventListener('click', function () { show(state.step - 1); }); });
    function renderReview() {
      var t = totals(), list = chosen();
      el('bkReview').innerHTML =
        '<div><span>Tests</span><b>' + list.map(function (x) { return esc(x.name); }).join(', ') + '</b></div>' +
        '<div><span>Date &amp; slot</span><b>' + esc(state.date) + ' at ' + esc(state.slot) + '</b></div>' +
        '<div><span>Name</span><b>' + esc(state.name) + '</b></div>' +
        '<div><span>Phone</span><b>' + esc(state.phone) + '</b></div>' +
        '<div><span>Area</span><b>' + esc(state.area) + '</b></div>' +
        '<div><span>Address</span><b>' + esc(state.address) + '</b></div>' +
        '<div><span>Tests total</span><b>' + fmt(t.sub) + '</b></div>' +
        '<div><span>Home collection</span><b>' + (t.fee ? fmt(t.fee) : 'FREE') + '</b></div>' +
        '<div><span>Total to pay at your door</span><b>' + fmt(t.total) + '</b></div>';
    }
    el('bkConfirm').addEventListener('click', function () {
      var t = totals(), list = chosen();
      var bk = { ref: makeRef(), testIds: list.map(function (x) { return x.id; }), testNames: list.map(function (x) { return x.name; }),
        date: state.date, slot: state.slot, name: state.name, phone: state.phone, area: state.area, address: state.address, notes: state.notes, total: t.total };
      saveBooking(bk);
      el('bkRef').textContent = bk.ref;
      el('bkConfirmText').innerHTML = 'Thank you, ' + esc(bk.name) + '. Our phlebotomist will visit <b>' + esc(bk.area) + '</b> on <b>' + esc(bk.date) + '</b> at <b>' + esc(bk.slot) + '</b>.<br>Total to pay at your door: <b>' + fmt(bk.total) + '</b>. Keep your reference to track your report.';
      el('bkWa').href = buildWhatsAppUrl(bk);
      show(5);
    });
    show(1);
  }
})();
