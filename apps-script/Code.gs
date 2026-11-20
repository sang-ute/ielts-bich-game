/**
 * IELTS Practice Quest: score receiver for the class Google Sheet.
 *
 * Setup (once):
 *   1. Open the score sheet, then Extensions > Apps Script.
 *   2. Replace the editor's contents with this file and save.
 *   3. Deploy > New deployment > Select type: Web app.
 *      Execute as: Me.  Who has access: Anyone.  Deploy, then allow access.
 *   4. Copy the Web app URL (ends in /exec) into site/config.js as scoresUrl.
 *
 * Every finished activity on the public site sends one JSON row here.
 */
var SHEET_NAME = 'Scores';
var HEADERS = ['Time', 'Student', 'Lesson', 'Activity', 'Type', 'Score', 'Total', 'Percent', 'Details', 'Device ID'];

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    var data = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    var name = clean_(data.name, 60);
    if (!name) return json_({ ok: false, error: 'missing name' });
    var score = num_(data.score);
    var total = num_(data.total);
    sheet_().appendRow([
      new Date(),
      name,
      clean_(data.lesson, 80),
      clean_(data.activity, 120),
      clean_(data.type, 20),
      score,
      total,
      total > 0 ? score / total : '',
      clean_(data.details, 300),
      clean_(data.pid, 16)
    ]);
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    try { lock.releaseLock(); } catch (ignored) {}
  }
}

function doGet() {
  return ContentService.createTextOutput('IELTS Practice Quest score receiver is running.');
}

function sheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  if (sh.getLastRow() === 0) {
    sh.appendRow(HEADERS);
    sh.setFrozenRows(1);
  }
  return sh;
}

// Text from students: strip control characters, cap the length, and stop
// anything that starts like a formula from being run by the sheet.
function clean_(value, max) {
  var s = String(value == null ? '' : value).replace(/[\u0000-\u001f]/g, ' ').trim().slice(0, max);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function num_(value) {
  var n = Number(value);
  return isFinite(n) && n >= 0 && n <= 10000 ? n : 0;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
