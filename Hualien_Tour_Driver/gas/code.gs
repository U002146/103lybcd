// v1.0 GAS 後端 API 唯讀設定

function doGet(e) {
  // 1. 指定你的試算表 ID 與工作表名稱
  // 若此腳本綁定在試算表上，可直接使用 SpreadsheetApp.getActiveSpreadsheet()
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("景點資料"); 
  
  if (!sheet) {
    return ContentService.createTextOutput(JSON.stringify({error: "找不到『景點資料』工作表"}))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // 2. 獲取所有資料
  var data = sheet.getDataRange().getValues();
  
  // 3. 將二維陣列轉為 JSON 物件陣列 (假設第一行為標題欄位)
  var headers = data[0];
  var result = [];
  
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var obj = {};
    for (var j = 0; j < headers.length; j++) {
      obj[headers[j]] = row[j];
    }
    // 過濾空資料 (以 ID 為準)
    if (obj['ID']) {
      result.push(obj);
    }
  }
  
  // 4. 輸出 JSON 並支援 CORS
  var jsonOutput = JSON.stringify(result);
  return ContentService.createTextOutput(jsonOutput)
    .setMimeType(ContentService.MimeType.JSON);
}
