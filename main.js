let url_yemot_api = `https://www.call2all.co.il/ym/api/`;
let num = SpreadsheetApp.getActiveSheet().getRange('VoiceMail!B2').getValue();
let password = SpreadsheetApp.getActiveSheet().getRange('VoiceMail!B3').getValue();
let token = SpreadsheetApp.getActiveSheet().getRange('VoiceMail!B4').getValue();
let get_users_num_from_Spreadsheet = SpreadsheetApp.getActiveSheet().getRange('VoiceMail!B5').getValue();
let get_token = `https://call2all.co.il/ym/api/Login?username=${num}&password=${password}`
let date = new Date()
let gap_mail_voice_mail = SpreadsheetApp.getActiveSheet().getRange('VoiceMail!B8').getValue();
let gap_Tzintuk_voice_mail = SpreadsheetApp.getActiveSheet().getRange('VoiceMail!B9').getValue();
let gap_mail_missed_call = SpreadsheetApp.getActiveSheet().getRange('VoiceMail!B11').getValue();
let gap_Tzintuk_missed_call = SpreadsheetApp.getActiveSheet().getRange('VoiceMail!B12').getValue();
let insert_file_missed_call = SpreadsheetApp.getActiveSheet().getRange('VoiceMail!B13').getValue();
let gap_Tzintuk_2_missed_call = SpreadsheetApp.getActiveSheet().getRange('VoiceMail!B14').getValue();
function main(){
  let get_lest_meesege_let = get_lest_meesege()
  let CheckIfFilewasplayed_let = CheckIfFilewasplayed(get_lest_meesege_let)
  let missed_calls_let = missed_calls()
  let date_last_meesege = get_lest_meesege_let[2].split(" ")
  let date = date_last_meesege[0].split("/")
  let time = date_last_meesege[1].split(":")
  let gap_mail_last_meesege = Get_the_gap(parseInt(date[0], 10), parseInt(time[0], 10), parseInt(time[1], 10), gap_mail_voice_mail)
  let gap_Tzintuk_last_meesege = Get_the_gap(parseInt(date[0], 10), parseInt(time[0], 10), parseInt(time[1], 10), gap_Tzintuk_voice_mail)
  let date_missed_call = missed_calls_let[1].split("/")
  let time_missed_call = missed_calls_let[2].split(":")
  let gap_mail_laste_missed_call = Get_the_gap(parseInt(date_missed_call[0], 10), parseInt(time[0], 10), parseInt(time[1], 10),gap_mail_missed_call)
  let gap_Tzintuk_2_laste_missed_call = Get_the_gap(parseInt(date_missed_call[0], 10), parseInt(time[0], 10), parseInt(time[1], 10), gap_Tzintuk_2_missed_call)
  let gap_Tzintuk_laste_missed_call = Get_the_gap(parseInt(date_missed_call[0], 10), parseInt(time[0], 10), parseInt(time[1], 10), gap_Tzintuk_missed_call)

  if ((gap_mail_last_meesege=== "run" && CheckIfFilewasplayed_let === "run") && get_lest_meesege_let[1] === missed_calls_let[0] && missed_calls_let[2]!== SpreadsheetApp.getActiveSheet().getRange('Log!A2').getValue() && parseInt(get_lest_meesege_let[0],10) !== SpreadsheetApp.getActiveSheet().getRange('Log!A3').getValue()){
    send_email("שיחה שלא נענתה והודעה חדשה",get_lest_meesege_let)
    let message_num_v = SpreadsheetApp.getActiveSheet().getRange('Log!A2').setValue(missed_calls_let[2])
  }else if (gap_mail_laste_missed_call === "run" && missed_calls_let[2]!== SpreadsheetApp.getActiveSheet().getRange('Log!A2').getValue()){
    send_email("שיחה שלא נענתה", [" ",missed_calls_let[0],missed_calls_let[1]+" " + missed_calls_let[2]])
     let message_num_v = SpreadsheetApp.getActiveSheet().getRange('Log!A2').setValue(missed_calls_let[2]);
     if (insert_file_missed_call === "כן"){
      insert_file_missed_calls(get_lest_meesege_let,missed_calls_let)
      SpreadsheetApp.getActiveSheet().getRange('Log!A3').setValue(parseInt(get_lest_meesege_let[0],10)+1);
     }
  }
  if ((gap_Tzintuk_last_meesege === "run" && CheckIfFilewasplayed_let === "run" && parseInt(get_lest_meesege_let[0],10) !== SpreadsheetApp.getActiveSheet().getRange('Log!A3').getValue())||(gap_Tzintuk_2_laste_missed_call === "run" && get_lest_meesege_let[1]!== missed_calls_let[0]) && (insert_file_missed_calls !== "כן" || CheckIfFilewasplayed_let === "run")){
  RunTzintuk()
  let message_num_c = SpreadsheetApp.getActiveSheet().getRange('Log!B2').setValue(missed_calls_let[2]);
  }
  if (gap_Tzintuk_laste_missed_call === "run" && missed_calls_let[2]!== SpreadsheetApp.getActiveSheet().getRange('Log!A4').getValue()){
    RunTzintuk()
    SpreadsheetApp.getActiveSheet().getRange('Log!A4').setValue(missed_calls_let[2])
  }
}

function RunTzintuk(){
  const url = `${url_yemot_api}RunTzintuk?token=${token}&callerId=${num}&TzintukTimeOut=16&phones=tzl:1`
  const res = UrlFetchApp.fetch(url)
}

function CheckIfFilewasplayed(get_lest_meesege_let){
  const lastfile = JSON.parse(UrlFetchApp.fetch(`${url_yemot_api}CheckIfFileExists?token=${token}&path=ivr2:/Log/Listening/0/${get_lest_meesege_let[0]}.ini`))
  if (lastfile.fileExists === false){
    return "run"
  }
}


function get_lest_meesege() {
  let json_file_ivr_tree = JSON.parse(UrlFetchApp.fetch(`${url_yemot_api}GetIVR2DirStats?token=${token}&path=ivr2:/0`));
  if (json_file_ivr_tree.responseStatus === 'OK') {
    let last_meesege_num = removeAfterLastDot(json_file_ivr_tree.maxFile.name);
    let last_meesege_date = json_file_ivr_tree.maxFile.mtime 
    let last_meesege_creator = json_file_ivr_tree.maxFile.phone ///אם קיים-לשאוב מאנשי הקשר את שמו לצורך שליחת מייל, אם לא בהכרח שזה קובץ tts שנשלח על ידי המערכת
    return [last_meesege_num ,last_meesege_creator, last_meesege_date];
  } 
  return "";
}


function removeAfterLastDot(inputString) {
  var lastDotIndex = inputString.lastIndexOf('.');

  if (lastDotIndex !== -1) {
    return inputString.slice(0, lastDotIndex);
  } else {
    return inputString;
  }
}

function Get_the_gap(messeg_day, message_houers,messeg_min, gap){
  if (gap === "מייד"){
    return "run"
  }else if (gap === "לעולם לא"){
    return "dont run"
  }else{
  let day = (date.getDate()-1) * 24 * 60
  let hour = date.getHours() * 60
  let adds_up_to = day + hour + date.getMinutes()
  let messeg_day_in_min = (messeg_day-1) * 24 * 60
  let messeg_houers_in_min = message_houers * 60
  let adds_up_to_2 = messeg_day_in_min + messeg_houers_in_min + messeg_min
  if ((adds_up_to - adds_up_to_2)%gap === 0 && adds_up_to !== adds_up_to_2){
    return "run"
  }else{
    return "dont run"
  }}
}

function send_email(title_to_send, get_lest_meesege_let){
let title;
let body;
let replay;
let options;
const user = Session.getActiveUser().getEmail();
if (get_name(get_lest_meesege_let[1])[0] !== ""){
title = `${title_to_send} מאת ${get_name(get_lest_meesege_let[1])[0]} מטלפון מספר ${get_lest_meesege_let[1]} בתאריך ${get_lest_meesege_let[2]}`
}else{
title = `${title_to_send} מאת ${get_lest_meesege_let[1]} בתאריך ${get_lest_meesege_let[2]}`
}
if (get_name(get_lest_meesege_let[1])[1] !== ""){
body = `<a href="tel:${get_lest_meesege_let[1]}"><img src="https://github.com/zevisvei/Voice_Mail_yemot/blob/main/phone.gif?raw=true" width="100" height="100"></a><a href="mailto:${get_name(get_lest_meesege_let[1])[1]}?subject=ראיתי%20שהתקשרת%20אלי&body=במה%20העניין?"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Gmail_icon_%282020%29.svg/200px-Gmail_icon_%282020%29.svg.png" alt="Send Email" width="100" height="75"></a><a href="https://wa.me/+972${get_lest_meesege_let[1]}?text=ראיתי%20שהתקשרת%20אלי%20במה%20העניין?"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/220px-WhatsApp.svg.png" alt="Send watsapp" width="100" height="100"></a><a href="t.me/+972${get_lest_meesege_let[1]}"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Telegram_2019_Logo.svg/70px-Telegram_2019_Logo.svg.png" alt="Send telegram" width="100" height="100"></a>
`
replay = get_name(get_lest_meesege_let[1])[1]
}else{
body = `<a href="tel:${get_lest_meesege_let[1]}">call me back</a>`
replay = user
}
if (title_to_send === "שיחה שלא נענתה והודעה חדשה"){
  let file_to_send = UrlFetchApp.fetch(`${url_yemot_api}DownloadFile?token=${token}&path=ivr2:/0/${get_lest_meesege_let[0]}.wav`).getBlob();
  options = {name:"VoiceMail", htmlBody: body, replyTo:replay, attachments: [{
      fileName: "הודעת תא קולי.wav",
      content: file_to_send.getBytes(),
      mimeType: file_to_send.getContentType()
    }]} 
}
else {
  options = {name:"VoiceMail", htmlBody: body, replyTo:replay} 
}
GmailApp.sendEmail(user, title, body, options);
/*
`<a href="mailto:${contacts_email}&subject=${subject}&body=${body}">Send Email</a>`
<a href="sms:${get_lest_meesege_let[1]}&body=במה%20העניין?"><img src="https://github.com/zevisvei/Voice_Mail_yemot/blob/main/chat.gif?raw=true" alt="send sms" width="100" height="100"></a>
<a href="https://www.w3schools.com">
<img src="w3html.gif" alt="W3Schools.com" width="100" height="132">
</a>
`<a href="https://wa.me/${contacts_number_International}?text=${subject}">Send Watsapp</a>`
`<a href="t.me/+${contacts_number_International}">Send Telegram</a>` ///לבדוק את העניין אם ניתן להכניס טקסט מוגדר מראש
`<a href="tel:${contacts_number}">call</a>` ///לבדוק אם צריך פורמט בינלאומי וכן האם זה עוזר לsip
*/
}


function missed_calls(){
let missed_call= JSON.parse(UrlFetchApp.fetch(`${url_yemot_api}RenderYMGRFile?token=${token}&wath=ivr2:/Log/LogFolderEnterExit-${date.getFullYear()}-${two_digits()}.ymgr&convertType=json`))
let last_missed_call = missed_call.data[missed_call.data.length-1]
let last_missed_call_num = last_missed_call.טלפון
let last_missed_call_date = last_missed_call.תאריך
let last_missed_call_time = last_missed_call["התחלה שעה"]
return [last_missed_call_num, last_missed_call_date, last_missed_call_time]
}


function detect_spam(){

}

function caller_name_api(){

}

function two_digits(){
  let month = date.getMonth()+1
  if (month < 10){
  let month_2 = "0" + month.toString()
  return month_2
  }else{
    return month
  }
}

function get_name(fone_number) {
   let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('contacts');
   let dataRange = sheet.getRange('B2:B');
   let values = dataRange.getValues();
   
   for (let i = 0; i < values.length; i++) {
       if (values[i][0] == fone_number) {
           let row = i + 2; // Adjusting for 0-based indexing and header row
           let name_for_mail = sheet.getRange(`A${row}`).getValue();
           let mail_for_mail = sheet.getRange(`C${row}`).getValue();
           return [name_for_mail, mail_for_mail];
       }
   }
   
   return ["", ""]; // If the number is not found, return empty values
}


function insert_file_missed_calls(get_lest_meesege_let,missed_calls_let){
  tts_missed_calls = JSON.parse(UrlFetchApp.fetch(`${url_yemot_api}UploadTextFile?token=${token}&what=ivr2:/0/${parseInt(get_lest_meesege_let[0],10)+1}.tts&contents=שיחה שלא נענתה מאת ${missed_calls_let[0]} בשעה ${missed_calls_let[2]}`));
}
///לשנות את הצינתוק בשיחה שלא נענתה לכל זמן שהמשתמש לא התקשר אולי לשנות גם את הזיהוי האם המשתמש האזין להודעה לפי זה
///הוספה לאקסל של צינתוקים בשביל השיחות שלא נענו
///לסדר את הפורמט של המייל וקישור מיילטו
///לסדר את האייקון של הטלפון




