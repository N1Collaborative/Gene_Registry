/******************************************************************
 * N1C Gene Registry - submission forms backend (Google Apps Script)
 * Version 2: N-of-1 projects + assessed variants, single + bulk.
 *
 * WHAT THIS DOES
 *   - Receives submissions from submit.html and submit_variant.html.
 *   - Writes each submission as one row in the tracking Google Sheet
 *     (tab Submissions for projects, Variant_Submissions for variants),
 *     matching fields to columns by header name.
 *   - Saves one Excel file per submission in the Drive Submissions folder
 *     (sub-folders Projects and Variants); bulk uploads also keep the
 *     original file.
 *   - Emails the curators. Emails the submitter only if
 *     SEND_SUBMITTER_EMAIL is true for the active profile.
 *
 * HOW TO INSTALL (full click-by-click steps in NEXT_STEPS.txt)
 *   1. Open the tracking Google Sheet > Extensions > Apps Script.
 *   2. Replace everything in Code.gs with this file. Save (Ctrl+S).
 *   3. Set ACTIVE_PROFILE below: 'TEST' in Aadhithya's account,
 *      'PROD' in the N1C account. Check the ids in PROFILES.
 *   4. Run the function setup() once (choose "setup" in the toolbar,
 *      press Run, approve the permissions). It creates or repairs the
 *      tabs, headers, dropdowns, queue formulas, Read_Me and folders.
 *   5. Deploy > New deployment > Web app > Execute as: Me,
 *      Who has access: Anyone > Deploy. Copy the web app URL into
 *      n1c_forms.js (ENDPOINTS.TEST or ENDPOINTS.PROD).
 ******************************************************************/

/* ===================== 1. SETTINGS ============================ */

var ACTIVE_PROFILE = 'PROD';   // 'TEST' or 'PROD'

var PROFILES = {
  TEST: {
    LABEL: "Aadhithya's test account",
    SHEET_ID: '1cFYFPZ4t3emhgiOAwrZZq27Oa6FmJSvF4xkTCYy_rko',
    FOLDER_ID: 'PASTE_YOUR_TEST_FOLDER_ID_HERE',
    CURATOR_EMAIL: 'aadhithya.r11@gmail.com',
    SEND_SUBMITTER_EMAIL: false
  },
  PROD: {
    LABEL: 'N1C production account',
    SHEET_ID: '1YjUk3LEVohJyb2Q83YFQsknAFx_UdSdtmbTfNd7ppu4',
    FOLDER_ID: '1Y7F1nHCroRlaM-74rCuz7yuBUa0cVeZP',
    CURATOR_EMAIL: 'generegistry@n1collaborative.org',
    SEND_SUBMITTER_EMAIL: false
  }
};

var CONFIG = PROFILES[ACTIVE_PROFILE];
var MAX_BULK_ROWS = 500;
var SITE_URL = 'https://generegistry.n1collaborative.org';
var EMAIL_SENDER_NAME = 'N1C Gene Registry forms';

/* ===================== 2. TABS AND COLUMNS ==================== */

var TABS = {
  project: { data: 'Submissions',         queue: 'Ready_To_Publish',          prefix: 'N1C-P', sub: 'Projects', label: 'N-of-1 project' },
  variant: { data: 'Variant_Submissions', queue: 'Variants_Ready_To_Publish', prefix: 'N1C-V', sub: 'Variants', label: 'variant assessment' }
};

// The six columns that go on the public N-of-1 projects table, in order.
var PROJECT_REGISTRY = ['Gene', 'RefSeq Transcript', 'Coding DNA change (c.)',
  'Predicted protein change (p.)', 'Therapeutic Modality', 'Status'];

// Submissions tab: the 24 columns N1C already has, then the 7 new ones.
var PROJECT_HEADERS = [
  'Submission ID', 'Submitted (UTC)', 'Review status', 'Curator notes', 'Published on',
  'Submitter name', 'Submitter email', 'Follow up contact', 'Display publicly', 'Public contact',
  'Gene', 'RefSeq Transcript', 'Coding DNA change (c.)', 'Predicted protein change (p.)',
  'Therapeutic Modality', 'Status', 'Contributing group', 'Confirmed protein or RNA change',
  'Published or deposited', 'Publication or database link', 'Applicable to other patients',
  'Disease model available', 'Disease model description', 'Additional comments',
  'Source', 'Batch ID', 'Checks', 'Assessed with N1C guidelines?', 'N1C guidelines outcome',
  'ASO design approach', 'Drive file link'
];

// Field name sent by the form  ->  column header in the sheet
var PROJECT_FIELDS = {
  submitterName:    'Submitter name',
  submitterEmail:   'Submitter email',
  followUp:         'Follow up contact',
  displayPublicly:  'Display publicly',
  publicContact:    'Public contact',
  gene:             'Gene',
  transcript:       'RefSeq Transcript',
  codingChange:     'Coding DNA change (c.)',
  proteinChange:    'Predicted protein change (p.)',
  modality:         'Therapeutic Modality',
  status:           'Status',
  affiliation:      'Contributing group',
  confirmedChange:  'Confirmed protein or RNA change',
  published:        'Published or deposited',
  link:             'Publication or database link',
  otherPatients:    'Applicable to other patients',
  diseaseModel:     'Disease model available',
  diseaseModelDesc: 'Disease model description',
  comments:         'Additional comments',
  n1cGuidelines:    'Assessed with N1C guidelines?',
  n1cOutcome:       'N1C guidelines outcome',
  asoApproach:      'ASO design approach'
};

// The 26 columns of assessed_variants.xlsx (without the registry's running ID), in order.
var VARIANT_REGISTRY = [
  'Date assessment', 'Submitter/Assessor', 'Gene Registry?', 'Mondo', 'Disease', 'Gene',
  'Genome Build', 'Chromosome', 'Genomic Position', 'Reference Allele', 'Alternate Allele',
  'Genomic HGVS', 'RefSeq Transcript', 'Coding DNA change (c.)', 'Predicted protein change (p.)',
  'Confirmed protein or RNA change', 'Clinvar', 'Pathomechanism', 'Inheritance', 'Splicing effect?',
  'Variant publication', 'Therapeutic Modality', 'Approach', 'Eligibility', 'Publication', 'Assessment text'
];

var VARIANT_HEADERS = [
  'Submission ID', 'Submitted (UTC)', 'Review status', 'Curator notes', 'Published on',
  'Confidence grade', 'Source', 'Batch ID', 'Checks', 'Submitter name', 'Submitter email', 'Drive file link'
].concat(VARIANT_REGISTRY);

var VARIANT_FIELDS = {
  submitterName:      'Submitter name',
  submitterEmail:     'Submitter email',
  dateAssessment:     'Date assessment',
  submitterGroup:     'Submitter/Assessor',
  displayPublicly:    'Gene Registry?',
  mondo:              'Mondo',
  disease:            'Disease',
  gene:               'Gene',
  genomeBuild:        'Genome Build',
  chromosome:         'Chromosome',
  position:           'Genomic Position',
  refAllele:          'Reference Allele',
  altAllele:          'Alternate Allele',
  genomicHgvs:        'Genomic HGVS',
  transcript:         'RefSeq Transcript',
  codingChange:       'Coding DNA change (c.)',
  proteinChange:      'Predicted protein change (p.)',
  confirmedChange:    'Confirmed protein or RNA change',
  clinvar:            'Clinvar',
  pathomechanism:     'Pathomechanism',
  inheritance:        'Inheritance',
  splicing:           'Splicing effect?',
  variantPublication: 'Variant publication',
  modality:           'Therapeutic Modality',
  approach:           'Approach',
  eligibility:        'Eligibility',
  publication:        'Publication',
  assessmentText:     'Assessment text'
};

var REVIEW_STATUSES = ['New', 'Approved', 'Published', 'Held', 'Rejected'];

function specFor(kind) {
  return kind === 'variant'
    ? { headers: VARIANT_HEADERS, fields: VARIANT_FIELDS, registry: VARIANT_REGISTRY, tab: TABS.variant }
    : { headers: PROJECT_HEADERS, fields: PROJECT_FIELDS, registry: PROJECT_REGISTRY, tab: TABS.project };
}

/* ===================== 3. WEB APP ENTRY POINTS ================ */

function doGet() {
  return ContentService
    .createTextOutput('N1C Gene Registry forms endpoint is running (' + CONFIG.LABEL + ').')
    .setMimeType(ContentService.MimeType.TEXT);
}

function doPost(e) {
  var out;
  try {
    var raw = (e && e.postData && e.postData.contents) ? e.postData.contents : '{}';
    var data = JSON.parse(raw);

    if (data.website) {                      // bot trap: reply ok, do nothing
      return jsonOut({ ok: true, id: 'sent' });
    }

    var kind = data.kind, mode = data.mode;
    if (!kind && data.gene) { kind = 'project'; mode = 'single'; }   // old form, before version 2
    if ((kind !== 'project' && kind !== 'variant') || (mode !== 'single' && mode !== 'bulk')) {
      return jsonOut({ ok: false, error: 'Unknown request type' });
    }
    out = (mode === 'single') ? handleSingle(kind, data) : handleBulk(kind, data);
  } catch (err) {
    out = { ok: false, error: String(err && err.message ? err.message : err) };
  }
  return jsonOut(out);
}

function jsonOut(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

/* ===================== 4. SINGLE SUBMISSION =================== */

function handleSingle(kind, data) {
  var spec = specFor(kind);
  var fields = data.fields || data;
  var ss = SpreadsheetApp.openById(CONFIG.SHEET_ID);
  var id, rowIndex, headers, row;

  var lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    var sheet = ensureTab(ss, kind);
    headers = getHeaders(sheet);
    id = nextReference(sheet, headers, spec.tab.prefix, 0);
    row = buildRow(spec, headers, fields, { id: id, source: 'Form', batch: '', checks: '' });
    rowIndex = sheet.getLastRow() + 1;
    ensureHeight(sheet, rowIndex);
    sheet.getRange(rowIndex, 1, 1, headers.length).setValues([row]);
    SpreadsheetApp.flush();
  } finally {
    lock.releaseLock();
  }

  var file = saveSubmissionFile(kind, id, headers, [row], spec);
  if (file && file.url) setCell(sheet, headers, rowIndex, 'Drive file link', file.url);

  emailCurators(kind, 'single', { id: id, fields: fields, headers: headers, rows: [row], spec: spec,
    file: file, sheetUrl: ss.getUrl() });

  if (CONFIG.SEND_SUBMITTER_EMAIL && fields.submitterEmail) {
    emailSubmitter(kind, fields.submitterEmail, [id]);
  }
  return { ok: true, id: id, profile: ACTIVE_PROFILE };
}

/* ===================== 5. BULK SUBMISSION ===================== */

function handleBulk(kind, data) {
  var spec = specFor(kind);
  var rows = data.rows || [];
  if (!rows.length) return { ok: false, error: 'The file contained no rows' };
  if (rows.length > MAX_BULK_ROWS) return { ok: false, error: 'At most ' + MAX_BULK_ROWS + ' rows per upload' };

  var uploader = data.uploader || {};
  var notes = data.notes || [];                       // [{row: 4, text: '...'}]
  var notesByRow = {};
  notes.forEach(function (n) {
    if (!n || n.row === undefined) return;
    notesByRow[n.row] = (notesByRow[n.row] ? notesByRow[n.row] + '; ' : '') + n.text;
  });

  var ss = SpreadsheetApp.openById(CONFIG.SHEET_ID);
  var batch = makeBatchId();
  var ids = [], values = [], headers, firstRowIndex;

  var lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    var sheet = ensureTab(ss, kind);
    headers = getHeaders(sheet);
    var firstId = nextReference(sheet, headers, spec.tab.prefix, 0);   // read the sheet once, then count up
    rows.forEach(function (r, i) {
      var fields = r || {};
      if (!fields.submitterName && uploader.name) fields.submitterName = uploader.name;
      if (!fields.submitterEmail && uploader.email) fields.submitterEmail = uploader.email;
      var id = referencePlus(firstId, i);
      ids.push(id);
      var rowNo = (fields._row !== undefined) ? fields._row : (i + 2);
      values.push(buildRow(spec, headers, fields,
        { id: id, source: 'Bulk', batch: batch, checks: notesByRow[rowNo] || '' }));
    });
    firstRowIndex = sheet.getLastRow() + 1;
    ensureHeight(sheet, firstRowIndex + values.length - 1);
    sheet.getRange(firstRowIndex, 1, values.length, headers.length).setValues(values);
    SpreadsheetApp.flush();
  } finally {
    lock.releaseLock();
  }

  var original = null;
  if (data.file && data.file.base64) {
    try {
      var blob = Utilities.newBlob(Utilities.base64Decode(data.file.base64),
        data.file.mimeType || 'application/octet-stream', batch + '_' + (data.file.name || 'upload.xlsx'));
      var f = subFolder(spec.tab.sub).createFile(blob);
      original = { url: f.getUrl(), name: f.getName() };
    } catch (err) { original = { error: String(err) }; }
  }

  var file = saveSubmissionFile(kind, batch + '_rows', headers, values, spec);
  if (file && file.url) {
    for (var k = 0; k < values.length; k++) setCell(sheet, headers, firstRowIndex + k, 'Drive file link', file.url);
  }

  emailCurators(kind, 'bulk', { ids: ids, batch: batch, uploader: uploader, notes: notes, headers: headers,
    rows: values, spec: spec, file: file, original: original, sheetUrl: ss.getUrl() });

  if (CONFIG.SEND_SUBMITTER_EMAIL && uploader.email) emailSubmitter(kind, uploader.email, ids);

  return { ok: true, ids: ids, batch: batch, count: ids.length, profile: ACTIVE_PROFILE };
}

/* ===================== 6. SHEET HELPERS ======================= */

function ensureTab(ss, kind) {
  var spec = specFor(kind);
  var sheet = ss.getSheetByName(spec.tab.data);
  if (!sheet) {
    sheet = ss.insertSheet(spec.tab.data);
    ensureWidth(sheet, spec.headers.length);
    sheet.getRange(1, 1, 1, spec.headers.length).setValues([spec.headers]);
    sheet.setFrozenRows(1);
    return sheet;
  }
  var existing = getHeaders(sheet);
  var missing = spec.headers.filter(function (h) { return existing.indexOf(h) === -1; });
  if (missing.length) {
    var start = existing.length + 1;
    ensureWidth(sheet, existing.length + missing.length);
    sheet.getRange(1, start, 1, missing.length).setValues([missing]);
  }
  return sheet;
}

function getHeaders(sheet) {
  var lastCol = sheet.getLastColumn();
  if (lastCol < 1) return [];
  return sheet.getRange(1, 1, 1, lastCol).getValues()[0]
    .map(function (h) { return String(h).trim(); });
}

// Grow the grid when a sheet has fewer columns or rows than we are about to write.
function ensureWidth(sheet, cols) {
  var have = sheet.getMaxColumns();
  if (cols > have) sheet.insertColumnsAfter(have, cols - have);
}
function ensureHeight(sheet, rows) {
  var have = sheet.getMaxRows();
  if (rows > have) sheet.insertRowsAfter(have, rows - have);
}

function buildRow(spec, headers, fields, sys) {
  var byHeader = {};
  Object.keys(spec.fields).forEach(function (key) { byHeader[spec.fields[key]] = key; });
  var now = Utilities.formatDate(new Date(), 'Etc/UTC', 'yyyy-MM-dd HH:mm:ss');
  return headers.map(function (h) {
    if (h === 'Submission ID') return sys.id;
    if (h === 'Submitted (UTC)') return now;
    if (h === 'Review status') return 'New';
    if (h === 'Source') return sys.source;
    if (h === 'Batch ID') return sys.batch;
    if (h === 'Checks') return sys.checks;
    var key = byHeader[h];
    if (!key) return '';
    var v = fields[key];
    if (v === undefined || v === null) return '';
    if (h === 'Gene') return String(v).trim().toUpperCase();
    return String(v).trim();
  });
}

function setCell(sheet, headers, rowIndex, header, value) {
  var col = headers.indexOf(header) + 1;
  if (col > 0) sheet.getRange(rowIndex, col).setValue(value);
}

function nextReference(sheet, headers, prefix, offset) {
  var year = Utilities.formatDate(new Date(), 'Etc/UTC', 'yyyy');
  var col = headers.indexOf('Submission ID') + 1;
  var max = 0;
  var last = sheet.getLastRow();
  if (col > 0 && last > 1) {
    var vals = sheet.getRange(2, col, last - 1, 1).getValues();
    var re = new RegExp('^' + prefix + '-' + year + '-(\\d{4})$');
    vals.forEach(function (r) {
      var m = re.exec(String(r[0]).trim());
      if (m) max = Math.max(max, parseInt(m[1], 10));
    });
  }
  var n = max + 1 + (offset || 0);
  return prefix + '-' + year + '-' + ('0000' + n).slice(-4);
}

// N1C-P-2026-0004 + 2 -> N1C-P-2026-0006
function referencePlus(ref, add) {
  var m = /^(.*-)(\d{4})$/.exec(ref);
  if (!m) return ref;
  return m[1] + ('0000' + (parseInt(m[2], 10) + add)).slice(-4);
}

function makeBatchId() {
  var stamp = Utilities.formatDate(new Date(), 'Etc/UTC', 'yyyyMMdd-HHmm');
  var rnd = Utilities.getUuid().replace(/-/g, '').slice(0, 4).toLowerCase();
  return 'B-' + stamp + '-' + rnd;
}

/* ===================== 7. DRIVE FILES ========================= */

function rootFolder() {
  return DriveApp.getFolderById(CONFIG.FOLDER_ID);
}

function subFolder(name) {
  var root = rootFolder();
  var it = root.getFoldersByName(name);
  return it.hasNext() ? it.next() : root.createFolder(name);
}

// Builds the per-submission Excel file: tab 1 = registry columns in order, tab 2 = the full record(s).
function saveSubmissionFile(kind, name, headers, rows, spec) {
  try {
    var regIdx = spec.registry.map(function (h) { return headers.indexOf(h); });
    var regRows = [spec.registry].concat(rows.map(function (r) {
      return regIdx.map(function (i) { return i >= 0 ? r[i] : ''; });
    }));
    var fullRows = [headers].concat(rows);
    var safeName = String(name).replace(/[^A-Za-z0-9_.-]+/g, '_');
    var geneIdx = headers.indexOf('Gene');
    if (rows.length === 1 && geneIdx >= 0 && rows[0][geneIdx]) safeName += '_' + String(rows[0][geneIdx]).replace(/[^A-Za-z0-9-]+/g, '');

    var blob = buildXlsxBlob(safeName, [
      { title: 'Registry columns', rows: regRows },
      { title: 'Full record', rows: fullRows }
    ]);
    var file = subFolder(spec.tab.sub).createFile(blob);
    return { url: file.getUrl(), name: file.getName(), blob: blob };
  } catch (err) {
    return { error: String(err) };
  }
}

// Fills a temporary Google Sheet, exports it as .xlsx, deletes the temporary sheet.
// If the export is refused, falls back to a .csv of the first tab.
function buildXlsxBlob(name, sheets) {
  var tmp = SpreadsheetApp.create('tmp_' + name);
  try {
    var first = tmp.getSheets()[0];
    sheets.forEach(function (s, i) {
      var sh = (i === 0) ? first.setName(s.title) : tmp.insertSheet(s.title);
      var width = s.rows.reduce(function (m, r) { return Math.max(m, r.length); }, 1);
      var padded = s.rows.map(function (r) { var c = r.slice(); while (c.length < width) c.push(''); return c; });
      ensureWidth(sh, width);
      ensureHeight(sh, padded.length);
      sh.getRange(1, 1, padded.length, width).setValues(padded);
      sh.getRange(1, 1, 1, width).setFontWeight('bold');
    });
    SpreadsheetApp.flush();
    var url = 'https://docs.google.com/spreadsheets/d/' + tmp.getId() + '/export?format=xlsx';
    var resp = UrlFetchApp.fetch(url, {
      headers: { Authorization: 'Bearer ' + ScriptApp.getOAuthToken() },
      muteHttpExceptions: true
    });
    if (resp.getResponseCode() === 200) {
      return resp.getBlob().setName(name + '.xlsx');
    }
    return Utilities.newBlob(toCsv(sheets[0].rows), 'text/csv', name + '.csv');
  } finally {
    try { DriveApp.getFileById(tmp.getId()).setTrashed(true); } catch (e) {}
  }
}

function toCsv(rows) {
  return rows.map(function (r) {
    return r.map(function (c) {
      var s = String(c === undefined || c === null ? '' : c);
      return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
    }).join(',');
  }).join('\n');
}

/* ===================== 8. EMAILS ============================== */

function emailCurators(kind, mode, info) {
  var spec = info.spec, label = TABS[kind].label;
  var subject, html = [];
  var esc = htmlEscape;

  if (mode === 'single') {
    var geneIdx = info.headers.indexOf('Gene');
    var gene = geneIdx >= 0 ? info.rows[0][geneIdx] : '';
    subject = 'N1C ' + label + ' ' + info.id + (gene ? ', ' + gene : '');
    html.push('<p>A new ' + label + ' was submitted through the registry form.</p>');
    html.push('<p><b>Reference:</b> ' + esc(info.id) + '<br><b>Submitted by:</b> ' +
      esc(info.fields.submitterName || '') + ' (' + esc(info.fields.submitterEmail || '') + ')' +
      (info.fields.affiliation ? ', ' + esc(info.fields.affiliation) : '') +
      (info.fields.submitterGroup ? ', ' + esc(info.fields.submitterGroup) : '') +
      '<br><b>Display on the registry:</b> ' + esc(info.fields.displayPublicly || '') + '</p>');
    html.push(registryTable(spec, info.headers, info.rows));
    html.push(fullTable(info.headers, info.rows[0]));
  } else {
    subject = 'N1C bulk ' + label + ' upload, ' + info.ids.length + ' rows, ' + info.batch;
    var withNotes = {};
    (info.notes || []).forEach(function (n) { if (n && n.row !== undefined) withNotes[n.row] = true; });
    html.push('<p>A file with ' + info.ids.length + ' ' + label + ' rows was uploaded through the registry form.</p>');
    html.push('<p><b>Batch:</b> ' + esc(info.batch) + '<br><b>Uploaded by:</b> ' +
      esc(info.uploader.name || '') + ' (' + esc(info.uploader.email || '') + ')' +
      '<br><b>Rows written:</b> ' + info.ids.length + ' (' + esc(info.ids[0]) + ' to ' + esc(info.ids[info.ids.length - 1]) + ')' +
      '<br><b>Rows with notes:</b> ' + Object.keys(withNotes).length + '</p>');
    if (info.notes && info.notes.length) {
      html.push('<p><b>Notes from the format check</b> (nothing was blocked; please look at these first):</p><ul>');
      info.notes.slice(0, 200).forEach(function (n) { html.push('<li>Row ' + esc(n.row) + ': ' + esc(n.text) + '</li>'); });
      html.push('</ul>');
    }
    html.push(registryTable(spec, info.headers, info.rows.slice(0, 50)));
    if (info.rows.length > 50) html.push('<p>Only the first 50 rows are shown here; all rows are in the sheet and the attached file.</p>');
    if (info.original && info.original.url) html.push('<p>Original file: <a href="' + info.original.url + '">' + esc(info.original.name) + '</a></p>');
  }

  html.push('<p>Sheet: <a href="' + info.sheetUrl + '">open the tracking sheet</a>' +
    (info.file && info.file.url ? ' &middot; File: <a href="' + info.file.url + '">' + esc(info.file.name) + '</a>' : '') + '</p>');
  html.push('<p style="color:#777;font-size:12px">Sent automatically by the registry forms (' + esc(CONFIG.LABEL) + ').</p>');

  var msg = { to: CONFIG.CURATOR_EMAIL, subject: subject, htmlBody: html.join('\n'), name: EMAIL_SENDER_NAME };
  if (info.file && info.file.blob) msg.attachments = [info.file.blob];
  MailApp.sendEmail(msg);
}

function emailSubmitter(kind, to, ids) {
  var label = TABS[kind].label;
  var subject = 'We received your ' + label + (ids.length > 1 ? 's' : '') + ' (' + ids[0] + (ids.length > 1 ? ' and ' + (ids.length - 1) + ' more' : '') + ')';
  var html = '<p>Thank you. Your ' + label + (ids.length > 1 ? 's were' : ' was') + ' received by the N1C Gene Registry.</p>' +
    '<p><b>Reference' + (ids.length > 1 ? 's' : '') + ':</b> ' + ids.map(htmlEscape).join(', ') + '</p>' +
    '<p>An N1C curator will review the entry by hand and will contact you if anything is unclear. ' +
    'To update or withdraw a submission, reply to this email quoting the reference.</p>';
  MailApp.sendEmail({ to: to, subject: subject, htmlBody: html, name: EMAIL_SENDER_NAME, replyTo: CONFIG.CURATOR_EMAIL });
}

function registryTable(spec, headers, rows) {
  var idx = spec.registry.map(function (h) { return headers.indexOf(h); });
  var out = ['<p><b>Registry columns</b> (paste-ready, same order as the registry file):</p>',
    '<table border="1" cellpadding="4" cellspacing="0" style="border-collapse:collapse;font-size:12px"><tr>'];
  spec.registry.forEach(function (h) { out.push('<th>' + htmlEscape(h) + '</th>'); });
  out.push('</tr>');
  rows.forEach(function (r) {
    out.push('<tr>');
    idx.forEach(function (i) { out.push('<td>' + htmlEscape(i >= 0 ? r[i] : '') + '</td>'); });
    out.push('</tr>');
  });
  out.push('</table>');
  return out.join('');
}

function fullTable(headers, row) {
  var out = ['<p><b>Full record</b>:</p><table border="1" cellpadding="4" cellspacing="0" style="border-collapse:collapse;font-size:12px">'];
  headers.forEach(function (h, i) {
    if (row[i] === '' || row[i] === undefined) return;
    out.push('<tr><td><b>' + htmlEscape(h) + '</b></td><td>' + htmlEscape(row[i]) + '</td></tr>');
  });
  out.push('</table>');
  return out.join('');
}

function htmlEscape(s) {
  return String(s === undefined || s === null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/* ===================== 9. ONE-TIME SETUP ====================== */

// Run this once from the Apps Script editor after pasting the code (and again any time
// a tab or column goes missing). Safe to re-run: it never deletes data.
function setup() {
  var ss = SpreadsheetApp.openById(CONFIG.SHEET_ID);
  ['project', 'variant'].forEach(function (kind) {
    var spec = specFor(kind);
    var sheet = ensureTab(ss, kind);
    styleHeader(sheet, spec);
    setDropdowns(sheet, spec);
    ensureQueue(ss, kind);
  });
  writeReadMe(ss);
  subFolder('Projects');
  subFolder('Variants');
  Logger.log('Setup complete for ' + CONFIG.LABEL + '. Sheet: ' + ss.getUrl());
}

function styleHeader(sheet, spec) {
  var headers = getHeaders(sheet);
  var n = headers.length;
  var head = sheet.getRange(1, 1, 1, n);
  head.setFontWeight('bold').setWrap(true).setBackground('#0b2a52').setFontColor('#ffffff');
  spec.registry.forEach(function (h) {
    var c = headers.indexOf(h) + 1;
    if (c > 0) sheet.getRange(1, c).setBackground('#c9352f');
  });
  sheet.setFrozenRows(1);
}

function setDropdowns(sheet, spec) {
  var headers = getHeaders(sheet);
  function apply(header, list) {
    var c = headers.indexOf(header) + 1;
    if (c < 1) return;
    var rule = SpreadsheetApp.newDataValidation().requireValueInList(list, true).setAllowInvalid(true).build();
    ensureHeight(sheet, 1000);
    sheet.getRange(2, c, sheet.getMaxRows() - 1, 1).setDataValidation(rule);
  }
  apply('Review status', REVIEW_STATUSES);
  apply('Display publicly', ['Yes', 'No']);
  apply('Gene Registry?', ['Yes', 'No']);
  apply('Source', ['Form', 'Bulk']);
}

function ensureQueue(ss, kind) {
  var spec = specFor(kind);
  var data = ss.getSheetByName(spec.tab.data);
  var headers = getHeaders(data);
  var q = ss.getSheetByName(spec.tab.queue) || ss.insertSheet(spec.tab.queue);
  ensureWidth(q, spec.registry.length);
  q.getRange(1, 1, 1, spec.registry.length).setValues([spec.registry])
    .setFontWeight('bold').setBackground('#c9352f').setFontColor('#ffffff');
  q.setFrozenRows(1);

  var d = "'" + spec.tab.data + "'!";
  var cols = spec.registry.map(function (h) {
    var L = colLetter(headers.indexOf(h) + 1);
    return d + L + '2:' + L;
  });
  var statusCol = colLetter(headers.indexOf('Review status') + 1);
  var conditions = d + statusCol + '2:' + statusCol + '="Approved"';
  if (kind === 'project') {
    var st = colLetter(headers.indexOf('Status') + 1);
    conditions += ', NOT(REGEXMATCH(LOWER(' + d + st + '2:' + st + '&""), "not pursued"))';
  }
  var formula = '=IFERROR(FILTER({' + cols.join(', ') + '}, ' + conditions + '), "Nothing approved yet")';
  q.getRange('A2').setFormula(formula);
  q.getRange('A3').setValue('');
}

function colLetter(n) {
  var s = '';
  while (n > 0) { var m = (n - 1) % 26; s = String.fromCharCode(65 + m) + s; n = Math.floor((n - 1) / 26); }
  return s;
}

function writeReadMe(ss) {
  var sh = ss.getSheetByName('Read_Me') || ss.insertSheet('Read_Me', 0);
  sh.clear();
  var rows = [
    ['N1C Gene Registry', 'Submission tracker (projects and variant assessments)'],
    ['', ''],
    ['What this is', 'Every entry sent through the two registry forms lands here as one row: N-of-1 projects on the Submissions tab, variant assessments on the Variant_Submissions tab. Bulk uploads land the same way, one row per file row.'],
    ['', ''],
    ['How approval works', '1. A row arrives with Review status = New.'],
    ['', '2. A curator reads it and sets Review status to Approved (or Held / Rejected).'],
    ['', '3. The row appears on Ready_To_Publish (projects) or Variants_Ready_To_Publish (variants). Select the block and paste it into the registry file.'],
    ['', '4. Set Review status to Published. The row drops off the queue.'],
    ['', ''],
    ['Why step 4 matters', 'The queue tabs are meant to empty. Rows left as Approved stay on the queue and would be published twice.'],
    ['', ''],
    ['Red columns', 'The red header columns are the ones that go on the public site, in the same order and spelling as the registry file. Keep them together.'],
    ['', ''],
    ['Columns curators fill', 'Review status, Curator notes, Published on, and on Variant_Submissions also Confidence grade. Everything else arrives from the forms.'],
    ['', ''],
    ['Source, Batch ID, Checks', 'Source says whether a row was typed into the form or uploaded in a file. Rows from one file share a Batch ID. Checks holds the format notes the form found for that row; nothing is blocked, so please look at rows with notes first.'],
    ['', ''],
    ['Drive file link', 'Every submission is also saved as an Excel file in the Submissions folder (sub-folders Projects and Variants). Bulk uploads keep the original file too.'],
    ['', ''],
    ['Not public', 'Submitter name, Submitter email, Follow up contact and Additional comments are held by N1C only.'],
    ['', ''],
    ['Statuses (projects)', 'Under Development, Developed and Clinical Application appear on the public site. Currently Not Pursued for Development is kept for internal records and is filtered out of Ready_To_Publish.'],
    ['', ''],
    ['Queue formulas', 'Cell A2 of each queue tab holds a formula that the setup function writes. If a queue tab ever shows nothing while rows are Approved, open Extensions > Apps Script and run setup() again.'],
    ['', ''],
    ['Active profile', CONFIG.LABEL + ' - curator email ' + CONFIG.CURATOR_EMAIL + ' - submitter emails ' + (CONFIG.SEND_SUBMITTER_EMAIL ? 'ON' : 'OFF')]
  ];
  sh.getRange(1, 1, rows.length, 2).setValues(rows);
  sh.getRange(1, 1).setFontWeight('bold').setFontSize(14);
  sh.getRange(1, 1, rows.length, 1).setFontWeight('bold');
  sh.getRange(1, 2, rows.length, 1).setWrap(true);
  sh.setColumnWidth(1, 190);
  sh.setColumnWidth(2, 760);
}

/* ===================== 10. SELF-CHECKS ======================== */

// Run from the editor to confirm the ids in the active profile are right.
function checkConfig() {
  var ss = SpreadsheetApp.openById(CONFIG.SHEET_ID);
  Logger.log('Profile: ' + CONFIG.LABEL);
  Logger.log('Sheet OK: ' + ss.getName());
  Logger.log('Folder OK: ' + rootFolder().getName());
  Logger.log('Curator email: ' + CONFIG.CURATOR_EMAIL);
}

// Sends one harmless test email to the curator address.
function sendTestEmail() {
  MailApp.sendEmail({ to: CONFIG.CURATOR_EMAIL, subject: 'N1C forms test email (' + CONFIG.LABEL + ')',
    htmlBody: '<p>If you can read this, the forms backend can send email from this account.</p>', name: EMAIL_SENDER_NAME });
  Logger.log('Test email sent to ' + CONFIG.CURATOR_EMAIL);
}
