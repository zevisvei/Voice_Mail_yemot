const url_yemot_api = `https://www.call2all.co.il/ym/api/`;

const ss = SpreadsheetApp.getActiveSpreadsheet()
const settingsSheet = ss.getSheetByName("VoiceMail")
const settingsValues = settingsSheet.getRange("B2:B35").getValues().flat();
const settings = {
  num: settingsValues[0],
  password: settingsValues[1],
  lengthTzintuk: settingsValues[2],
  usersNum: settingsValues[3],
  mailAddress: settingsValues[5],
  hebrewDate: settingsValues[6],
  repiteTzintuk: settingsValues[7],
  repiteTzintukGap: settingsValues[8],

  voiceMailEmail: settingsValues[10],
  voiceMailTzintuk: settingsValues[11],

  missedCallsEmail: settingsValues[13],
  missedCallsTzintuk: settingsValues[14],

  transcribe: settingsValues[16],
  transcribeApiKey: settingsValues[17],
  transcribeModel: settingsValues[18],
  transcribePrompt: settingsValues[19],
  transcribeMinLen: settingsValues[20],

  watsAppApiUrl: settingsValues[22],
  watsAppMediaUrl: settingsValues[23],
  watsAppIdInstance: settingsValues[24],
  watsAppApiTokenInstance: settingsValues[25],
  watsAppVoiceMail: settingsValues[26],
  watsAppMissedCalls: settingsValues[27],
  watsAppNum: settingsValues[28],

  telegramBotApi: settingsValues[30],
  telegramUserId: settingsValues[31],
  telegramVoiceMail: settingsValues[32],
  telegramMissedCalls: settingsValues[33],
};

const logSheet = ss.getSheetByName("Log")
const logValues = logSheet.getRange("B1:B8").getValues().flat();
const log = {
  voiceMails: logValues[0],
  missedCalls: logValues[1],
  lastCallInBlackList: logValues[2],
  lastCallDate: logValues[3],
  lastCallId: logValues[4],
  blackListId: logValues[5],
  token: logValues[6],
  falseCounter: logValues[7]
}


function main(){
  test_token();
  if(!GetSession(log.token)){
    return
  }
  const date = new Date()
  let file_path = Log_enter_exit_path(date)
  if(!file_path){
    return
  }
  let missed_call= RenderYMGRFile(log.token, file_path)
  let last_call_let = missed_call[missed_call.length-1]
  let last_call_id = last_call_let.CallId
  let last_call_phone = last_call_let.Phone
  if(log.lastCallId === last_call_id && !log.lastCallInBlackList){
    if(settings.repiteTzintuk && last_call_phone !== settings.usersNum){
      let lastCallDate = log.lastCallDate
      if(settings.repiteTzintukGap && lastCallDate){
        let timeDif = getSignedMinutesDifference(date, lastCallDate)
        if(timeDif !== 0 && timeDif % settings.repiteTzintukGap === 0){
          RunTzintuk(log.token, settings.lengthTzintuk)
          logSheet.getRange("B4").setValue(date)
        }
      }
    }
    return
  }
  if(last_call_phone === settings.num){
    return
  }
  if (GetIncomingCalls(log.token).includes(last_call_phone)) {
    return;
  }

  logSheet.getRange("B5").setValue(last_call_id)
  logSheet.getRange("B4").setValue(date)
  
  if(last_call_phone === settings.usersNum){
    UploadTextFile(log.token, "M0000.tts", "אין לך הודעות חדשות")
    logSheet.getRange(1, 2, 2, 1).setValues([[0], [0]]);
    return;
  }
  let last_call_phone_International = last_call_phone
  if(last_call_phone_International.startsWith("0")){
    last_call_phone_International = `972${last_call_phone_International.slice(1)}`
  }
  last_call_phone_International = `+${last_call_phone_International}`
  let contactlist = getcontactsList()
  let email
  let name
  let last_call_contact = contactlist[last_call_phone_International]
  if(last_call_contact){
    if(last_call_contact.blacklist){
      logSheet.getRange("B3").setValue(true)
      return
    }
    name = last_call_contact.name
    email = last_call_contact.email
  }
  logSheet.getRange("B3").setValue(false)
  let maxfile = GetIVR2DirStats(log.token, 1)
  let VoiceMailFile = false
  let last_call_time = ParseDateTime(last_call_let["EnterDate"],last_call_let["EnterTime"])
  if(maxfile){
    let last_file_time_split = maxfile["mtime"].split(" ")
    let last_file_time = ParseDateTime(last_file_time_split[0], last_file_time_split[1])
    if(last_call_time <= last_file_time && last_call_phone === maxfile.phone){
      VoiceMailFile = true
    }
  }

  let PrevVoiceMail = log.voiceMails
  let PrevMissedCalls = log.missedCalls

  if (VoiceMailFile) {
    PrevVoiceMail += 1;
    logSheet.getRange("B1").setValue(PrevVoiceMail)
  } else {
    PrevMissedCalls += 1;
    logSheet.getRange("B2").setValue(PrevMissedCalls)
  }

  let message = "יש לך "
  if(PrevVoiceMail){
    message += `${PrevVoiceMail} הודעות חדשות`
  }if(PrevMissedCalls && PrevVoiceMail){
    message += " ו "
  }if(PrevMissedCalls){
    message += `${PrevMissedCalls} שיחות שלא נענו`
  }
  UploadTextFile(log.token, "M0000.tts", message)
  let HebDate = last_call_let.EnterHebrewDate
  let title_str = `${VoiceMailFile? "הודעת תא קולי ": "שיחה שלא נענתה "}${name ? `מאת ${name}` : ""} מטלפון מספר ${last_call_phone} בתאריך ${settings.hebrewDate ? HebDate : last_call_let["EnterDate"]} בשעה ${last_call_let["EnterTime"]}`;
  let date_tts = `default=t-${VoiceMailFile? "הודעת תא קולי ": "שיחה שלא נענתה "}${name ? `מאת ${name}` : ""} מטלפון מספר .d-${last_call_phone}  .t- בשעה .n-${last_call_time.getHours()}.t- וה .n-${last_call_time.getMinutes()}.t-דקות, בתאריך.date${settings.hebrewDate ? "H": ""}-${last_call_let["EnterDate"]}`
  UploadTextFile(log.token, "3/IdListMessage.ini", date_tts)
  if(VoiceMailFile){
    SendVoiceMailFile(email, maxfile.name, title_str, last_call_phone_International, name, maxfile.duration)
  }else{
    SendMissedCalls(email, title_str, last_call_phone_International)
  }
}

function SendMissedCalls(email, title_str, last_call_phone_International){
  let TopFile = GetIVR2DirStats(log.token, 2)
  let FileName = TopFile ? String(parseInt(TopFile.name.split(".")[0], 10) + 1).padStart(3, '0') : "000"
  UploadTextFile(log.token, `2/${FileName}.tts`, title_str)
  if(settings.missedCallsEmail){
    sendEmail(email, last_call_phone_International, title_str)
  }
  if(settings.telegramMissedCalls){
    sendTelegramMissedCalls(title_str, last_call_phone_International)
  }
  if(settings.watsAppMissedCalls){ 
    greenApiMessage(title_str)
  }

  if(settings.missedCallsTzintuk){
    RunTzintuk(log.token, settings.lengthTzintuk)
  }
}

function SendVoiceMailFile(email, FilePath, title_str, last_call_phone_International, name, duration){
  let audioFile = DownloadFile(log.token, `1/${FilePath}`)
  let file_name = FilePath.split(".")[0]
  UploadTextFile(log.token,`1/${file_name}-Title.tts`, title_str)
  let Transcription = ""
  if(settings.transcribe && duration > settings.transcribeMinLen){
    Transcription = transcribeGemini(audioFile)
  }
  if(settings.voiceMailEmail){
    let options = {attachments: [audioFile]}
    sendEmail(email, last_call_phone_International, title_str, Transcription, options)
  }
  if(settings.telegramVoiceMail){
    sendTelegramVoiceMail(title_str, last_call_phone_International, name, audioFile, Transcription)
  }
  if(settings.watsAppVoiceMail){
      greenApiMessage(title_str, Transcription)
      greenApiFile(audioFile)
  
  }
  if(settings.voiceMailTzintuk){
    RunTzintuk(log.token, settings.lengthTzintuk)
  }
}

