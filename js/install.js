function installation(){
  let validSettins = settingsValidation()
  if(!validSettins){
    return
  }
  test_token();
  if(!GetSession(log.token)){
    return
  }
  if(settings.transcribe){
    const dropdownValues = getModelList()
    var rule = SpreadsheetApp.newDataValidation()
    .requireValueInList(dropdownValues)
    .setAllowInvalid(true)
    .build();
    settingsSheet.getRange("B20").setDataValidation(rule);
  }
  
  let templateId = CreateTemplate(log.token, "מספרים מורשים לכניסה")
  UpdateTemplateEntry(log.token, templateId, settings.usersNum, "מספר בעל המערכת")
  
let menu = `type=menu
check_template_filter=${GetTemplates(log.token)}
check_template_filter_blocked_enter=yes
check_template_filter_none_go_to=/record
check_template_filter_error_phone_go_to=/record
say_menu_voice=yes
menu_voice=להודעות תא קולי הקש 1. לשיחות שלא נענו הקש 2. לשמיעת פרטי ההודעה האחרונה הקש 3. להרשמה או הסרה מרשימת הצינתוקים הקש 4.` 
  UploadTextFile(log.token, "ext.ini", menu)

let folder_1 = `type=playfile
title=הודעות תא קולי
say_details_message_skip_menu=yes
save_listening_data=yes
log_folder_enter_exit=no`
  UploadTextFile(log.token,"1/ext.ini", folder_1)

let folder_2 = `type=playfile
title=שיחות שלא נענו
log_folder_enter_exit=no
voice=Elik_2100`
  UploadTextFile(log.token,"2/ext.ini", folder_2)

let folder_3 = `type=id_list_message
title=הודעת תא קולי
say_name=no
record_name=no`
  UploadTextFile(log.token, "3/ext.ini", folder_3)

let folder_4 = `type=tzintuk
title=הרשמה לצינתוקים
list_tzintuk=1`
  UploadTextFile(log.token, "4/ext.ini", folder_4)

  UpdateExtension(log.token, "record")

let record = `type=record
title=הקלטה
record_ok=#
say_record_number=no
say_record_menu=no
record_end_goto=hangup
control_play*=noop
control_play#=noop
control_play1=noop
control_play2=noop
control_play3=noop
control_play4=noop
control_play5=noop
control_play6=noop
control_play7=noop
control_play8=noop
control_play9=noop
control_play0=noop
enter_id=yes
enter_id_type=phone
login_add_val_name=yes
record_name=no
hangup_insert_file=yes
folder_move=/1`;

  UploadTextFile(log.token, "record/ext.ini", record)

  UploadTextFile(log.token, "M0000.tts", "אין לך הודעות עדיין")

  CreateBlackListGroup()

  Set_Triggers()
  ContactsToYemot()
  let googledrivefile = settingsSheet.getRange("B6").getValue()
  if(googledrivefile){
    let fileid = GetFileId(googledrivefile)
    let fileblob = GetFileFromGoogleDrive(fileid)
    UploadFile(log.token, "record/M1012", fileblob)
  }
}

function ContactsToYemot(){
  let dict_all = getcontactsList();
  let str_all = "";
  for (let key in dict_all) {
      let value = dict_all[key];
      if (key.startsWith("+972")) {
          key = "0" + key.slice(4);
      }else{
        key = key.slice(1)
      }
      let name = value.name;
      if (key && name) {
          str_all += `${key}=${name}\n`;
      }
  }
  return UploadTextFile(log.token, "record/EnterIDValName.ini", str_all)
}

function Set_Triggers(){
  ScriptApp.getProjectTriggers().forEach(trigger => ScriptApp.deleteTrigger(trigger));
  ScriptApp.newTrigger("main").timeBased().everyMinutes(1).create();
}

function alertUser(message){
  let ui = SpreadsheetApp.getUi()
  ui.alert("חסרים נתונים", message + "\n\nההתקנה בוטלה, הזן את הנתונים החסרים והרץ את ההתקנה מחדש.", ui.ButtonSet.OK);
}

function isValidIsraeliPhoneNumber(phone) {
  if (!phone) return false;
  if (!/^\d+$/.test(phone)) return false;
  const regex = /^(?:05\d{8}|0[23489]\d{7,8})$/;
  return regex.test(phone);
}

function isValidInternationalPhoneNumberWithPrefix(phone) {
  if (!phone) return false;
  if (!/^\d+$/.test(phone)) return false;
  if (phone.length < 8 || phone.length > 15) return false;
  if (phone.charAt(0) === "0") return false;
  return true;
}


function settingsValidation(){
  let ui = SpreadsheetApp.getUi()
  if(!isValidIsraeliPhoneNumber(settings.usersNum)){
    alertUser("לא הוזן מספר תקין, יש להזין את המספר ללא תווים נוספים.")
    return
  }
  if(!settings.mailAddress && (settings.missedCallsEmail || settings.voiceMailEmail)){
    let response = ui.alert("לא הגדרת כתובת מייל, האם להגדיר את הכתובת לכתובת המייל של החשבון הנוכחי?", ui.ButtonSet.YES_NO)
    if(response === ui.Button.YES){
      settingsSheet.getRange(7, 2).setValue(Session.getActiveUser().getEmail())
    }
    else{
      alertUser("לא נבחרה כתובת מייל.")
      return
    }
  }
  if(!settings.num){
    alertUser("לא הזנת את מספר המערכת.")
    return
  }
  if(!settings.password){
    alertUser("לא הזנת את סיסמת המערכת.")
    return
  }
  if(settings.transcribe){
    if(!settings.transcribeApiKey){
      alertUser("לא הזנת את מפתח הapi לתמלול.")
      return
    }
    if(!settings.transcribeModel){
      alertUser("לא בחרת מודל לתמלול.")
      return
    }
  }
  if(settings.telegramVoiceMail || settings.telegramMissedCalls){
    if(!settings.telegramBotApi){
      alertUser("לא הזנת את מפתח הapi לבוט בטלגרם.")
      return
    }
    if(!settings.telegramUserId){
      alertUser("לא הזנת את הid של משתמש הטלגרם.")
      return
    }
  }
  if(settings.watsAppMissedCalls || settings.watsAppVoiceMail){
    if(!settings.watsAppApiUrl){
      alertUser("לא הזנת את הapiUrl")
      return
    }
    if(!settings.watsAppMediaUrl){
      alertUser("לא הזנת את הmediaUrl")
      return
    }
    if(!settings.watsAppIdInstance){
      alertUser("לא הזנת את הidInstance")
      return
    }
    if(!settings.watsAppApiTokenInstance){
      alertUser("לא הזנת את הapiTokenInstance")
      return
    }
    if(settings.watsAppNum && !isValidInternationalPhoneNumberWithPrefix(settings.watsAppNum)){
      alertUser("לא הוזן מספר ווטסאפ תקין, יש להזין את המספר בפורמט בינלאומי ללא תווים נוספים וללא התו + בהתחלה")
      return
    }else if(!settings.watsAppNum){
      let response = ui.alert("לא הזנת את מספר הווטסאפ, ההאם ברצונך להגדיר את המספר למספר המפנה למערכת?", ui.ButtonSet.YES_NO)
      if(response === ui.Button.YES){
        settingsSheet.getRange(30, 2).setValue(`972${settings.usersNum.slice(1)}`)
      }else{
        alertUser("לא נבחר מספר לשליחת ההודעות.")
        return
      }
    }
  }
  return true
}

