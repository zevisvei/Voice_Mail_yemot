function mailtalk() {
  test_token();
  let status_yemot = yemot_online();
  if (status_yemot === 'OK') {
    check_Actions_busy();
    //if (if_night_Morning === true) {
    import_message()
    if (logger_to_support === true) {
      logger_to_support_team()
    }
    //} else {
    //Logger.log("לילה טוב..")
    //}
  }
}
function yemot_online() {
  let yemot_online = JSON.parse(UrlFetchApp.fetch(`${url_yemot_api}GetSession?token=${token_yemot}`));
  Logger.log("server yemot_online=" + yemot_online.responseStatus);
  return yemot_online.responseStatus;
}


 


function test_token() {
  let sf = SpreadsheetApp.getActiveSheet().getRange("Mailtalk!B125").getValue();
  if (sf < 5) {
    let req = JSON.parse(UrlFetchApp.fetch(`https://call2all.co.il/ym/api/GetSession?token=${token_yemot}`))
    Logger.log("test_token.req=" + req.responseStatus)
    if (req.responseStatus === 'OK') {
      SpreadsheetApp.getActiveSheet().getRange("Mailtalk!B125").setValue(0);
      Logger.log("it's ok");
    } else {
      login_token()
    }
  } else {
    Logger.log(`המערכת זיהתה מספר רב של נסיונות כושלים באימות מול שרתי חברת ימות המשיח, דבר המעיד על שגיאה באמצעי הזיהוי שהזנתם, על מנת למנוע חסימות של היישומים ע"י חברת ימות המשיח, התקנת היישום בחשבונכם בוטלה, ועליכם לתקן את אמצעי הזיהוי ולבצע התקנה מחדש של המערכת`);
    deleteTrigger()
    let recipient = Session.getActiveUser().getEmail();
    let fileName = SpreadsheetApp.getActiveSheet().getParent().getName();
    let fileUrl = SpreadsheetApp.getActiveSheet().getParent().getUrl();
    let owner = SpreadsheetApp.getActiveSheet().getParent().getOwner().getEmail();
    let GmailApp_send = GmailApp.sendEmail(recipient, "היי, יש בעיה בהגדרת הטוקן!", `המערכת זיהתה מספר רב של נסיונות כושלים באימות מול שרתי חברת ימות המשיח ביישום מיילטוק שבקובץ ${fileName}, הנמצא בבעלות המשתמש ${owner}. דבר המעיד על שגיאה באמצעי הזיהוי שהזנתם במערכת, על מנת למנוע חסימות של היישומים ע"י חברת ימות המשיח, התקנת היישום בחשבונכם בוטלה, ועליכם לתקן את אמצעי הזיהוי ולבצע התקנה מחדש של המערכת.
לינק לקובץ ההגדרות של היישום: ${fileUrl}`);
    throw new Error("Script stopped");
  }
}


function login_token() {
  let req;
  let counter = 0;
  while (req === undefined || req.responseStatus !== "OK") {
    req = JSON.parse(UrlFetchApp.fetch(`https://call2all.co.il/ym/api/Login?username=${user}&password=${password}`));
    Logger.log(req.responseStatus);
    counter++;
    if (counter >= 5) {
      break;
    }
  }
  if (counter >= 5) {
    SpreadsheetApp.getActiveSheet().getRange("Mailtalk!B125").setValue(SpreadsheetApp.getActiveSheet().getRange("Mailtalk!B125").getValue() + 1);
    set_token();
    return;
  }
  Logger.log("req.token=" + req.token);
  SpreadsheetApp.getActiveSheet().getRange("Mailtalk!B124").setValue(req.token);
  SpreadsheetApp.getActiveSheet().getRange("Mailtalk!B125").setValue(0)
}

function set_token() {
  let ui = SpreadsheetApp.getUi();
  let response_text = ui.prompt(`יצירת טוקן ידנית`, `אם אתם נתקלים בבעיה במהלך ההגדרה האוטומטית של המערכת תוכלו להשתמש בשירות הבא:
  
    העתיקו את הלינק המופיע בשורה הבאה אל כרטיסיה חדשה בדפדפן שלכם:
  
    https://call2all.co.il/ym/api/Login?username=${user}&password=${password}
  
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
