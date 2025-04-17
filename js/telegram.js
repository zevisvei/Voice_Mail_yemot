function escapeMarkdownV2(text) {
  return text.replace(/([_*\[\]()~`>#+\-=|{}.!])/g, '\\$1');
}


function sendTelegramVoiceMail(message, last_call_phone_International, name, audioFile, transcription){
  let telegram_bot_api = settings.telegramBotApi
  let telegram_user_id = settings.telegramUserId
  if(!telegram_bot_api || !telegram_user_id){
    return
  }
  message = escapeMarkdownV2(message)
  message += `\n[שלח הודעת וואטסאפ](https://wa.me/${last_call_phone_International}?text=ראיתי%20שהתקשרת%20אלי%20במה%20העניין?)\n[שלח הודעת טלגרם](https://t.me/${last_call_phone_International})`;
  if(transcription){
    transcription = escapeMarkdownV2(transcription);
    message += `\n*תמלול*\n${transcription}`
  }
  let payload = {
    method: "post",
    payload: {
      chat_id: telegram_user_id,
      audio: audioFile,
      title: "הודעת תא קולי",
      caption: message,
      parse_mode:"MarkdownV2"
    },
    muteHttpExceptions: true
  };
  payload.payload["performer"] = name ? name : last_call_phone_International
  UrlFetchApp.fetch(`https://api.telegram.org/bot${telegram_bot_api}/sendAudio`, payload);
}

function sendTelegramMissedCalls(message, last_call_phone_International){
  let telegram_bot_api = settings.telegramBotApi
  let telegram_user_id = settings.telegramUserId
  if(!telegram_bot_api || !telegram_user_id){
    return
  }
  message = escapeMarkdownV2(message)
  message += `\n[שלח הודעת וואטסאפ](https://wa.me/${last_call_phone_International}?text=ראיתי%20שהתקשרת%20אלי%20במה%20העניין?)\n[שלח הודעת טלגרם](https://t.me/${last_call_phone_International})`;
  let payload = {
    method: "post",
    payload: {
      chat_id: telegram_user_id,
      text: message,
      parse_mode:"MarkdownV2",
      link_preview_options: JSON.stringify({
      is_disabled: true
    })
    },
    muteHttpExceptions: true
  }
  UrlFetchApp.fetch(`https://api.telegram.org/bot${telegram_bot_api}/sendMessage`,payload)
}


