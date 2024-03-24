function installation(){
let newline = "%0A"
let newline_post = "\n"
let ymt_Ext_0 = JSON.parse(UrlFetchApp.fetch(`${url_yemot_api}UploadTextFile?token=${token}&what=ivr2:/0/ext.ini&contents=type=playfile${newline}title=הודעות${newline}go_to_from_tzintuk=yes${newline}check_list_tzintuk=1${newline}go_to_from_tzintuk_found=in_extension${newline}go_to_from_tzintuk_not_found=/3${newline}say_details_message_first=yes${newline}say_details_message=name${newline}say_details_message_skip_menu=yes${newline}save_listening_data=yes${newline}log_folder_enter_exit=no`));
let ymt_Ext_1_1 = `type=record${newline_post}title=הקלטה${newline_post}record_ok=#${newline_post}say_record_number=no${newline_post}say_record_menu=no${newline_post}record_end_goto=/2${newline_post}control_play*=noop${newline_post}control_play#=noop${newline_post}control_play1=noop${newline_post}control_play2=noop${newline_post}control_play3=noop${newline_post}control_play4=noop${newline_post}control_play5=noop${newline_post}control_play6=noop${newline_post}control_play7=noop${newline_post}control_play8=noop${newline_post}control_play9=noop${newline_post}control_play0=noop${newline_post}enter_id=yes${newline_post}enter_id_type=phone${newline_post}login_add_val_name=yes${newline_post}record_name=no${newline_post}hangup_insert_file=yes${newline_post}folder_move=/0${newline_post}record_end_run_tzintuk=yes${newline_post}hangup_send_tzintuk=yes${newline_post}list_tzintuk=1`;
let data = { 'token': token, 'what': "ivr2:/1/ext.ini", 'contents': ymt_Ext_1_1 };
let options = { 'method': 'post', 'payload': data };
let request = JSON.parse(UrlFetchApp.fetch(`${url_yemot_api}UploadTextFile`, options));

let ymt_Ext_2 = JSON.parse(UrlFetchApp.fetch(`${url_yemot_api}UploadTextFile?token=${token}&what=ivr2:/2/ext.ini&contents=title=ניתוק${newline}type=hangup`));
let ymt_Ext_3 = JSON.parse(UrlFetchApp.fetch(`${url_yemot_api}UploadTextFile?token=${token}&what=ivr2:/3/ext.ini&contents=type=tzintuk${newline}title=הרשמה לצינתוקים${newline}list_tzintuk=1${newline}tzintuk_end=/0`));
let ymt_enterid = getContacts();
let ymt_tts = JSON.parse(UrlFetchApp.fetch(`${url_yemot_api}UploadTextFile?token=${token}&what=ivr2:/1/M1012.tts&contents=השיחה מועברת לתא הקולי. הגעתם לתא הקולי של טלפון מספר ${num}. נא להשאיר הודעה אחרי הישמע הצליל`));
let ymt_Create_Template = JSON.parse(UrlFetchApp.fetch(`${url_yemot_api}CreateTemplate?token=${token}&description=מספרים מורשים לכניסה`));
let add_num_to_Template = JSON.parse(UrlFetchApp.fetch(`${url_yemot_api}UpdateTemplateEntry?token=${token}&templateId=${ymt_Create_Template.templateId}&phone=0${get_users_num_from_Spreadsheet}&name=מספר בעל המערכת`));
let template_num = JSON.parse(UrlFetchApp.fetch(`${url_yemot_api}GetTemplates?token=${token}`))
let menu = JSON.parse(UrlFetchApp.fetch(`${url_yemot_api}UploadTextFile?token=${token}&what=ivr2:/ext.ini&contents=type=go_to_folder${newline}go_to_folder=/0${newline}check_template_filter=${template_num.templates.length}${newline}check_template_filter_active_go_to=/0${newline}check_template_filter_blocked_enter=yes${newline}check_template_filter_none_enter=yes${newline}check_template_filter_error_enter=yes${newline}log_folder_enter_exit=no`
));
set_Triggers()
}
///צריך עדיין למצוא דרך להחליף את ההודעת מערכת בשלוחת ההקלטות

function set_Triggers(){
  ScriptApp.getProjectTriggers().forEach(trigger => ScriptApp.deleteTrigger(trigger));
  ScriptApp.newTrigger("main").timeBased().everyMinutes(1).create();
  main()
}


