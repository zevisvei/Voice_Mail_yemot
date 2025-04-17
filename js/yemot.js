function GetIncomingCalls(token) {
  let list = JSON.parse(UrlFetchApp.fetch(`${url_yemot_api}GetIncomingCalls?token=${token}`));
  return list.calls.map(i => {
    let phoneNumber = i.callerIdNum.split(' ')[0];
    return phoneNumber;
  });
}


function CheckIfFileExists(token,path){
  return JSON.parse(UrlFetchApp.fetch(`${url_yemot_api}CheckIfFileExists?token=${token}&path=ivr2:/${path}`)).fileExists
}

function UploadTextFile(token,path,content){
  let data = { 'token': token, 'what': `ivr2:/${path}`, 'contents': content};
  let options = { 'method': 'post', 'payload': data };
  return JSON.parse(UrlFetchApp.fetch(`${url_yemot_api}UploadTextFile`, options)).responseStatus === "OK";
}

function GetIVR2DirStats(token,path){
  return JSON.parse(UrlFetchApp.fetch(`${url_yemot_api}GetIVR2DirStats?token=${token}&path=ivr2:/${path}`)).maxFile;
}

function DownloadFile(token, path){
  return UrlFetchApp.fetch(`${url_yemot_api}DownloadFile?token=${token}&path=ivr2:/${path}`).getBlob().setName("audio.wav");
}

function RenderYMGRFile(token, path){
  let url = `${url_yemot_api}RenderYMGRFile?token=${token}&wath=ivr2:/${path}.ymgr&convertType=json&notLoadLang=1`
  return JSON.parse(UrlFetchApp.fetch(url)).data
}

function UploadFile(token, path, blob){
  const formData = {
    token: token,
    path: `ivr2:/${path}.wav`,
    convertAudio: "1", // ברירת מחדל: המרת אודיו
    autoNumbering: "false", // ברירת מחדל: מספור אוטומטי
    file: blob // צרוף ה-Blob של הקובץ
  };
  const options = {
    method: 'post',
    payload: formData,
  };
  return JSON.parse(UrlFetchApp.fetch(`${url_yemot_api}UploadFile`, options)).responseStatus === "OK";
}

function GetSession(token){
  return JSON.parse(UrlFetchApp.fetch(`${url_yemot_api}GetSession?token=${token}`)).responseStatus === "OK"
}

function Login(){
  return JSON.parse(UrlFetchApp.fetch(`${url_yemot_api}Login?username=${num}&password=${password}`)).token;
}

function CreateTemplate(token, description){
  return JSON.parse(UrlFetchApp.fetch(`${url_yemot_api}CreateTemplate?token=${token}&description=${description}`)).templateId;
}

function UpdateTemplateEntry(token, templateId, phone, name){
  return JSON.parse(UrlFetchApp.fetch(`${url_yemot_api}UpdateTemplateEntry?token=${token}&templateId=${templateId}&phone=${phone}&name=${name}`)).responseStatus === "OK";
}

function GetTemplates(token){
  return JSON.parse(UrlFetchApp.fetch(`${url_yemot_api}GetTemplates?token=${token}`)).templates.length
}

function UpdateExtension(token, path){
  return JSON.parse(UrlFetchApp.fetch(`${url_yemot_api}UpdateExtension?token=${token}&path=ivr2:${path}`)).responseStatus === "OK";
}

function RunTzintuk(token, length_Tzintuk){
  return JSON.parse(UrlFetchApp.fetch(`${url_yemot_api}RunTzintuk?token=${token}&callerId=${settings.num}&TzintukTimeOut=${length_Tzintuk}&phones=tzl:1`)).responseStatus === "OK";
}

