function transcribeGroq(audioBlob) {
  let groq_token = settings.transcribeApiKey
  if(!groq_token){
    return ""
  }
  const GROQ_API_URL = "https://api.groq.com/openai/v1/audio/transcriptions";
  
  const formData = {
    "file": audioBlob,
    "model": "whisper-large-v3",
    "language": "he"
  };

  const groqOptions = {
    method: "post",
    headers: {
      "Authorization": "Bearer " + groq_token
    },
    payload: formData,
    muteHttpExceptions: true
  };

  const groqResponse = UrlFetchApp.fetch(GROQ_API_URL, groqOptions);
  if (groqResponse.getResponseCode() !== 200) {
    console.log("Groq API request failed: " + groqResponse.getContentText());
    return ""
  }
  const responseJson = JSON.parse(groqResponse);
  let transcription = responseJson.text
  if(transcription){
    console.log(groqResponse.getContentText())
    return transcription.trim()
  }
  return "";
}

function transcribeGemini(file){
  const geminiProVisionEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/${settings.transcribeModel}:generateContent?key=${settings.transcribeApiKey}`;
  const audioData = Utilities.base64Encode(file.getBytes());
  const payload = {
    "contents": [
      {
        "parts": [
        {
          "text": settings.transcribePrompt
        },
        {
          "inlineData": {
          "mimeType": `audio/wav`,
          "data": audioData
        }
        }
        ]
      }
    ],
    "generationConfig": {
      "temperature": 0,
    },
  };
  const payloadString = JSON.stringify(payload);
  if (payloadString.length > 20971520) {
    return
  }
  const options = {
    'method': 'post',
    'contentType': 'application/json',
    'payload': payloadString,
    'muteHttpExceptions': true
  };
  try {
    let response = JSON.parse(UrlFetchApp.fetch(geminiProVisionEndpoint, options));
    return response["candidates"][0]["content"]["parts"][0]["text"];
  }catch (f){
    Logger.log(f)
  }
}
