function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("PAC Registrations");
  var data = JSON.parse(e.postData.contents);
  sheet.appendRow([data.timestamp, data.name, data.email, data.student, data.grade, data.phone, data.language, data.contact]);
  return ContentService.createTextOutput(JSON.stringify({status: "success"})).setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  return ContentService.createTextOutput("Running").setMimeType(ContentService.MimeType.TEXT);
}
