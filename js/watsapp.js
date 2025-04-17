function sendWatsappMeeseg(meesege, num_watsapp, api_watsapp, filePath = ""){
  if (filePath){
    meesege = meesege + `\nלינק להורדת הקובץ:\nhttps://private.call2all.co.il/ym/api/DownloadFile?token=${num}:${password}&path=ivr2:/1/${filePath}`
  }
    UrlFetchApp.fetch(`https://api.callmebot.com/whatsapp.php?phone=${num_watsapp}&text=${encodeURIComponent(meesege)}&apikey=${api_watsapp}`)
  }

function greenApiMessage(message, transcription = ""){
  let greenUrl = settings.watsAppApiUrl
  let idInstance = settings.watsAppIdInstance
  let apiTokenInstance = settings.watsAppApiTokenInstance
  let phoneNumber = settings.watsAppNum
  if(!greenUrl || !idInstance || !apiTokenInstance || !phoneNumber){
    return
  }
  if(transcription){
    message += `\n*תמלול*\n${transcription}`
  }
  let url = `${greenUrl}/waInstance${idInstance}/sendMessage/${apiTokenInstance}`
  let payload = {
    chatId: `${phoneNumber}@c.us`, 
    message: message,
    linkPreview: false
  }
  let options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
  };

  UrlFetchApp.fetch(url, options)
}

function greenApiFile(fileBlob){
  let mediaUrl = settings.watsAppMediaUrl
  let idInstance = settings.watsAppIdInstance
  let apiTokenInstance = settings.watsAppApiTokenInstance
  let phoneNumber = settings.watsAppNum
  if(!mediaUrl || !idInstance || !apiTokenInstance || !phoneNumber){
    return
  }

  let url = `${mediaUrl}/waInstance${idInstance}/sendFileByUpload/${apiTokenInstance}`
  let formData = {
    chatId: `${phoneNumber}@c.us`,
    file: fileBlob
  };
  let options = {
    method: 'post',
    payload: formData,
  };

  UrlFetchApp.fetch(url, options)
}
