function sendEmail(email, last_call_phone_International, title, Transcription = "", options = {}){
  const user = settings.mailAddress;
  let replay = email ? email : user
  let template = HtmlService.createTemplateFromFile('email_template');
  template.phone = last_call_phone_International
  template.Transcription = Transcription ? `<h1>תמלול ההודעה</h1><p>${Transcription}</p>`: ""
  template.replyEmail = email ? `<a class="image" href="mailto:${email}?subject=ראיתי%20שהתקשרת%20אלי&body=במה%20העניין?" target="_blank">
      <img title="שלח הודעת מייל" src="https://github.com/zevisvei/Voice_Mail_yemot/blob/main/gmail.png?raw=true" width="100" height="100" alt="שלח הודעת מייל">
    </a>` : ""
  template.mail_1 = email ? "מייל, ": ""
  template.mail_2 = email ? "ניתן גם לשלוח מייל על ידי השבה להודעה זו." : ""
  let body = template.evaluate().getContent();
  console.log(title)
  Object.assign(options, {name:"תא קולי", htmlBody: body, replyTo:replay});
  GmailApp.sendEmail(user, title, body, options);
}