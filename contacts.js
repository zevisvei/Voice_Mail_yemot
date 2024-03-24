function getContacts(){
///getContacts_from_google_Contacts()
let data_2 = { 'token': token, 'what': "ivr2:/1/EnterIDValName.ini", 'contents': getContacts_from_sheet() };
let options_2 = { 'method': 'post', 'payload': data_2 };
let request_2 = JSON.parse(UrlFetchApp.fetch(`${url_yemot_api}UploadTextFile`, options_2));
}

function getContacts_from_sheet() {
  const range = SpreadsheetApp.getActiveSheet().getRange('contacts!A2:B');
  const values = range.getValues();
  let contactsString = "";
  for (const value of values) {
    const name = value[0].toString();
    let phone = value[1].toString();
    if (name === "" || phone === "") {
      continue;
    }
    if (!phone.startsWith("0")) {
      phone = "0" + phone;
    }
    const contact = `${name}=${phone.replace(/-/g, "")}\n`;
    contactsString += contact;
  }
return contactsString
}
///צריך לפתור כמה בעיות קטנות במספרים בין לאומיים וכדומה

function getContacts_from_google_Contacts(){

}

