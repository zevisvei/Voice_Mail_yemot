function UploadFile_to_yemot(){
let file_link = SpreadsheetApp.getActiveSheet().getRange('VoiceMail!B6').getValue();
let fileid = file_link.split(/\/file\/d\/([^\/]+)/)[1];
console.log (fileid)
let file = DriveApp.getFileById(fileid);
let blob = file.getBlob();
let headers = {'Content-type': 'multipart/form-data'};
let data_3 = {  'token': token,'path': "ivr2:/0/M1012.wav", 'convertAudio': 1, autoNumbering: false, tts:0,'upload': blob };
let options_3 = { 'method': 'post','headers': headers, 'payload': data_3};
let request_3 = JSON.parse(UrlFetchApp.fetch(`${url_yemot_api}UploadFile`, options_3))
console.log(request_3)
}
function uploadFile(isPrivate, token, path, file) {
  let YemotUrl;
  if (isPrivate) {
    YemotUrl = 'https://private.call2all.co.il/ym/api/';
  } else {
    YemotUrl = 'https://www.call2all.co.il/ym/api/';
  }

  let headers = {
    'Content-type': 'multipart/form-data'
  };

  let formData = new FormData();
  formData.append('upload', file, 'media.wav');
  formData.append('token', token);
  formData.append('path', path + '/' + file.getName());

  let options = {
    'method': 'post',
    'payload': formData,
    'headers': headers
  };

  let url = YemotUrl + 'UploadFile';
  let response = UrlFetchApp.fetch(url, options);
  let status = response.getResponseCode();
  let content = response.getContentText();
  let jsonResponse = JSON.parse(content);
  return jsonResponse;
}


function set_token_2() {
  let ui = SpreadsheetApp.getUi();

  let htmlContent = `
    <div>
      <p>יצירת טוקן ידנית</p>
      <p>אם אתם נתקלים בבעיה במהלך ההגדרה האוטומטית של המערכת תוכלו להשתמש בשירות הבא:</p>
      <p>העתיקו את הלינק המופיע בשורה הבאה אל כרטיסיה חדשה בדפדפן שלכם:</p>
      <p><a href="https://call2all.co.il/ym/api/Login?username=${num}&password=${password}">לחץ כאן</a></p>
      <p>את הטקסט שיופיע בדף שייפתח הכניסו בתיבה שלמטה (שימו 💖 חשוב שתכניסו את הטקסט המלא!!)</p>
    </div>
  `;
  
  let result = ui.showModalDialog(HtmlService.createHtmlOutput(htmlContent), "יצירת טוקן ידנית");
}


function set_token_3() {
  let ui = SpreadsheetApp.getUi();

  let htmlContent = HtmlService.createHtmlOutput(`
    <div dir="rtl">
      <p>יצירת טוקן ידנית</p>
      <p>אם אתם נתקלים בבעיה במהלך ההגדרה האוטומטית של המערכת תוכלו להשתמש בשירות הבא:</p>
      <p>העתיקו את הלינק המופיע בשורה הבאה אל כרטיסיה חדשה בדפדפן שלכם:</p>
      <p><a href="https://call2all.co.il/ym/api/Login?username=${num}&password=${password}">לחץ כאן</a></p>
      <p>את הטקסט שיופיע בדף שייפתח הכניסו בתיבה שלמטה (שימו 💖 חשוב שתכניסו את הטקסט המלא!!)</p>
      <input type="text" id="responseText" style="width: 100%;">
    </div>
  `);

  let result = ui.showModalDialog((htmlContent), "יצירת טוקן ידנית");

  if (result == 'OK') {
    let responseText = document.getElementById('responseText').value;
    Logger.log(responseText);
    try {
      let obj = JSON.parse(responseText)
      if (obj.responseStatus === 'OK') {
        SpreadsheetApp.getActiveSheet().getRange("Mailtalk!B124").setValue(obj.token)
        SpreadsheetApp.getActiveSheet().getRange("Mailtalk!B125").setValue(0)
        Logger.log(obj.token);
        ui.alert(`הגדרה הצליחה!`, `הגדרת הטוקן הושלמה.
הריצו שוב את ההתקנה ע"מ להתקין את היישום.`, ui.ButtonSet.OK);
      } else {
        ui.alert('בעיה', 'תשובת השרת של ימות המשיח אינה תקינה, ייתכן והסיסמה או מספר המערכת אינם נכונים או שהמערכת חסומה.', ui.ButtonSet.OK);
      }
    } catch (e) {
      Logger.log("שגיאה.טקסט לא מתאים=" + responseText);
      Logger.log(e)
      ui.alert('⚠ שגיאה!', 'אירעה שגיאה בקבלת הנתונים, פלט הטקסט שהוזן אינו תקין. ' + e + 'אנא נסו שנית.', ui.ButtonSet.OK);
    }
  }
}



function set_token() {
  let ui = SpreadsheetApp.getUi();
  let response_text = ui.prompt(`יצירת טוקן ידנית`, `אם אתם נתקלים בבעיה במהלך ההגדרה האוטומטית של המערכת תוכלו להשתמש בשירות הבא:
  
    העתיקו את הלינק המופיע בשורה הבאה אל כרטיסיה חדשה בדפדפן שלכם:
  
    <a href=https://call2all.co.il/ym/api/Login?username=${num}&password=${password}>לחץ כאן</a>
  
    את הטקסט שיופיע בדף שייפתח הכניסו בתיבה שלמטה (שימו 💖 חשוב שתכניסו את הטקסט המלא!!)
    
    `, ui.ButtonSet.OK).getResponseText();
  Logger.log(response_text);
  try {
    let obj = JSON.parse(response_text)
  } catch (e) {
    Logger.log("שגיאה.טקסט לא מתאים=" + response_text);
    Logger.log(e)
    ui.alert('⚠ שגיאה!', 'אירעה שגיאה בקבלת הנתונים, פלט הטקסט שהוזן אינו תקין. '
      + e
      + 'אנא נסו שנית.', ui.ButtonSet.OK);
  }
  let obj = JSON.parse(response_text)
  if (obj.responseStatus === 'OK') {
    SpreadsheetApp.getActiveSheet().getRange("Mailtalk!B124").setValue(obj.token)
    SpreadsheetApp.getActiveSheet().getRange("Mailtalk!B125").setValue(0)
    Logger.log(obj.token);
    ui.alert(`הגדרה הצליחה!`, `הגדרת הטוקן הושלמה.
הריצו שוב את ההתקנה ע"מ להתקין את היישום.`, ui.ButtonSet.OK);
  } else {
    ui.alert('בעיה', 'תשובת השרת של ימות המשיח אינה תקינה, ייתכן והסיסמה או מספר המערכת אינם נכונים או שהמערכת חסומה.', ui.ButtonSet.OK);
  }
}

