function test_token() {
  if (log.falseCounter < 5) {
    if (GetSession(log.token)) {
      logSheet.getRange("B8").setValue(0)
      Logger.log("it's ok");
    } else {
      login_token()
    }
  } else {
    Logger.log(`המערכת זיהתה מספר רב של נסיונות כושלים באימות מול שרתי חברת ימות המשיח, דבר המעיד על שגיאה באמצעי הזיהוי שהזנתם, על מנת למנוע חסימות של היישומים ע"י חברת ימות המשיח, התקנת היישום בחשבונכם בוטלה, ועליכם לתקן את אמצעי הזיהוי ולבצע התקנה מחדש של המערכת`);
    deleteTrigger()
    let recipient = settings.mailAddress;
    let fileName = SpreadsheetApp.getActiveSheet().getParent().getName();
    let fileUrl = SpreadsheetApp.getActiveSheet().getParent().getUrl();
    let owner = SpreadsheetApp.getActiveSheet().getParent().getOwner().getEmail();
    let GmailApp_send = GmailApp.sendEmail(recipient, "היי, יש בעיה בהגדרת הטוקן!", `המערכת זיהתה מספר רב של נסיונות כושלים באימות מול שרתי חברת ימות המשיח ביישום voicemail שבקובץ ${fileName}, הנמצא בבעלות המשתמש ${owner}. דבר המעיד על שגיאה באמצעי הזיהוי שהזנתם במערכת, על מנת למנוע חסימות של היישומים ע"י חברת ימות המשיח, התקנת היישום בחשבונכם בוטלה, ועליכם לתקן את אמצעי הזיהוי ולבצע התקנה מחדש של המערכת.
לינק לקובץ ההגדרות של היישום: ${fileUrl}`);
    throw new Error("Script stopped");
  }
}

function login_token() {
  let req;
  let counter = 0;
  while (req === undefined || req.responseStatus !== "OK") {
    req = JSON.parse(UrlFetchApp.fetch(`https://call2all.co.il/ym/api/Login?username=${settings.num}&password=${settings.password}`));
    Logger.log(req.responseStatus);
    counter++;
    if (counter >= 5) {
      break;
    }
  }
  if (counter >= 5) {
    logSheet.getRange("B8").setValue(log.falseCounter + 1)
    set_token();
    return;
  }
  Logger.log("req.token=" + req.token);
  let token = req.token
  log["token"] = token
  logSheet.getRange("B7").setValue(token)
  logSheet.getRange("B8").setValue(0)
}

function set_token() {
  let ui = SpreadsheetApp.getUi();
  let response_text = ui.prompt(`יצירת טוקן ידנית`, `אם אתם נתקלים בבעיה במהלך ההגדרה האוטומטית של המערכת תוכלו להשתמש בשירות הבא:
  
    העתיקו את הלינק המופיע בשורה הבאה אל כרטיסיה חדשה בדפדפן שלכם:
  
    https://call2all.co.il/ym/api/Login?username=${settings.num}&password=${settings.password}
  
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
    logSheet.getRange("B7").setValue(obj.token)
    log["token"] = obj.token
    logSheet.getRange("B8").setValue(0)
    Logger.log(obj.token);
    ui.alert(`הגדרה הצליחה!`, `הגדרת הטוקן הושלמה.
הריצו שוב את ההתקנה ע"מ להתקין את היישום.`, ui.ButtonSet.OK);
  } else {
    ui.alert('בעיה', 'תשובת השרת של ימות המשיח אינה תקינה, ייתכן והסיסמה או מספר המערכת אינם נכונים או שהמערכת חסומה.', ui.ButtonSet.OK);
  }
}

function deleteTrigger() {
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    ScriptApp.deleteTrigger(triggers[i]);
  }
}

