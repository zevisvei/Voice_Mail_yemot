function UploadFile_to_yemot(){
let file_link = SpreadsheetApp.getActiveSheet().getRange('VoiceMail!B6').getValue();
let fileid = file_link.split(/\/file\/d\/([^\/]+)/)[1];
console.log (fileid)
let file = DriveApp.getFileById(fileid);
let blob = file.getBlob();
let headers = {'Content-type': 'multipart/form-data'};
let data_3 = {  'path': "ivr2:/0/M1012.wav", 'convertAudio': 1, autoNumbering: false, tts:0,'upload': blob };
let options_3 = { 'method': 'post', 'payload': data_3 ,'headers': headers, 'token': token};
let request_3 = JSON.parse(UrlFetchApp.fetch(`${url_yemot_api}UploadFile`, options_3))
console.log(request_3)
}

