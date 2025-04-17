function GetFileId(fileUrl){
  return fileUrl.split(/\/file\/d\/([^\/]+)/)[1];
}

function GetFileFromGoogleDrive(fileid){
  return DriveApp.getFileById(fileid).getBlob()
}

function getModelList() {
  var url = "https://generativelanguage.googleapis.com/v1beta/models?key=" + settings.transcribeApiKey;

  var response = UrlFetchApp.fetch(url);
  var data = JSON.parse(response.getContentText());

  var listOfModels = data.models.map(function(model) {
    return model.name.split("/")[1];
  });

  return listOfModels;
}

function getSignedMinutesDifference(date1, date2) {
  const diffMs = date1 - date2;
  const diffMinutes = Math.floor(diffMs / 60000);
  return diffMinutes;
}


// function ParseDateTimeCall(datestr, timeStr) {
//   const [day, month, year] = datestr.split('/');
//   const [hours, minutes, seconds] = timeStr.split(':');
//   return new Date(year, month - 1, day, hours, minutes, seconds);
// }

// function ParseDateTimeFile(datestr){
//   const[date, time] = datestr.split()
//   const[day, month, year] = date.split("/")
//   const [hours, minutes] = time.split(":")
//   return new Date(year, month - 1, day, hours, minutes);
// }

function ParseDateTime(datestr, timeStr) {
  const [day, month, year] = datestr.split('/').map(Number);
  const [hours, minutes, seconds = 0] = timeStr.split(':').map(Number);
  return new Date(year, month - 1, day, hours, minutes, 0);
}




function Log_enter_exit_path(date){
  let file_path = null
  let month = date.getMonth() + 1
  let year = date.getFullYear()
  let log_enter_exit_exisist = null
  while(!log_enter_exit_exisist){
    file_path = `Log/LogFolderEnterExit-${year}-${String(month).padStart(2, '0')}`
    log_enter_exit_exisist = CheckIfFileExists(log.token, `${file_path}.ymgr`)
    console.log(log_enter_exit_exisist)
    month -= 1
    if(month<1){
      month = 12
      year -= 1
    }
    if(year < 2024){
      return
    }
  }
  return file_path
}
