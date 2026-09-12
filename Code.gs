/*******************************************************
 * CAREER TASK & HR TRACKER
 * Google Apps Script + Google Sheets + AppSheet
 *******************************************************/

const TZ = 'Asia/Kolkata';
const TABLES = {
  Tasks: ['Task ID','Date','Day','Month','Year','Task Type','Task Title','Company / Event','Contact Person','Email','Phone','LinkedIn URL','Location','Status','Priority','Deadline','Follow Up Date','Result','Response','Notes','Created At','Updated At'],
  'HR Applications': ['Application ID','Application Date','Company','Job Role','Job Type','Experience','HR Name','HR Email','HR Phone','HR LinkedIn','Application Source','Job URL','Resume Sent','Cover Letter','Mail Sent','Mail Date','HR Response','Response Date','Interview Date','Interview Status','Result','Salary','Location','Follow Up Date','Next Action','Notes','Created At','Updated At'],
  'LinkedIn Jobs': ['Job ID','Date Found','Company','Job Title','Location','Work Mode','Job Type','Experience','Salary','LinkedIn Job URL','Recruiter Name','Recruiter LinkedIn','Recruiter Email','Applied','Application Date','Application Status','HR Response','Interview Date','Result','Follow Up Date','Priority','Notes','Created At','Updated At'],
  'HR Emails': ['Email ID','Date','Company','HR Name','HR Email','Job Role','Subject','Email Type','Email Status','Reply Received','Reply Date','Response','Follow Up Required','Follow Up Date','Next Action','Notes','Created At','Updated At'],
  Events: ['Event ID','Event Date','Day','Month','Event Name','Organizer','Event Type','Role','Invitation','Registration','Acceptance','Attendance','Location','Start Time','End Time','Website','LinkedIn Event','Contact Person','Contact Email','Topic','Result','Follow Up','Follow Up Date','Notes','Created At','Updated At'],
  Contacts: ['Contact ID','Name','Company','Designation','Email','Phone','LinkedIn URL','Contact Type','Last Contact','Next Follow Up','Relationship','Notes','Created At','Updated At']
};

function setupCareerTracker() {
  const ss = SpreadsheetApp.getActive();
  Object.keys(TABLES).forEach(name => createTable_(ss, name, TABLES[name]));
  createSettings_(ss);
  createDashboard_(ss);
  setupValidations_(ss);
  setupFormatting_(ss);
  setupReminderTrigger_();
  SpreadsheetApp.getUi().alert('Career Tracker created successfully. It is ready for AppSheet.');
}

function createTable_(ss, name, headers) {
  let sh = ss.getSheetByName(name) || ss.insertSheet(name);
  sh.clear();
  sh.getRange(1,1,1,headers.length).setValues([headers]);
  sh.setFrozenRows(1);
  sh.getRange(1,1,1,headers.length).setFontWeight('bold');
  sh.getRange(1,1,1,headers.length).createFilter();
  sh.autoResizeColumns(1, headers.length);
}

function createSettings_(ss) {
  const sh = ss.getSheetByName('Settings') || ss.insertSheet('Settings');
  sh.clear();
  const groups = [
    ['TASK TYPES','HR Mail','Follow Up','Interview','Application','Event','Meeting','LinkedIn','Content','Other'],
    ['STATUS','Pending','In Progress','Completed','Accepted','Rejected','Scheduled','Cancelled','Waiting','Shortlisted'],
    ['PRIORITY','High','Medium','Low'],
    ['RESULT','Selected','Rejected','Shortlisted','No Response','Attended','Missed','Completed','Pending'],
    ['HR RESPONSE','Waiting','Received','Interested','Not Interested','Need Follow Up','No Reply','Declined'],
    ['SOURCE','LinkedIn','Company Website','Naukri','Indeed','Referral','Email','Other'],
    ['WORK MODE','Remote','Hybrid','Onsite'],
    ['ATTENDANCE','Going','Not Going','Attended','Missed'],
    ['ACCEPTANCE','Accepted','Rejected','Pending']
  ];
  groups.forEach((row,i) => sh.getRange(i+1,1,1,row.length).setValues([row]));
  sh.setFrozenRows(1);
}

function createDashboard_(ss) {
  const sh = ss.getSheetByName('Dashboard') || ss.insertSheet('Dashboard');
  sh.clear();
  sh.getRange('A1:F1').merge().setValue('CAREER + HR + LINKEDIN DASHBOARD').setFontSize(18).setFontWeight('bold');
  sh.getRange('A3:B16').setValues([
    ['Metric','Value'],
    ['Total Tasks','=COUNTA(Tasks!A2:A)'],
    ['Pending Tasks','=COUNTIF(Tasks!N2:N,"Pending")'],
    ['Completed Tasks','=COUNTIF(Tasks!N2:N,"Completed")'],
    ['HR Applications','=COUNTA(\'HR Applications\'!A2:A)'],
    ['LinkedIn Jobs','=COUNTA(\'LinkedIn Jobs\'!A2:A)'],
    ['LinkedIn Applied','=COUNTIF(\'LinkedIn Jobs\'!N2:N,"Yes")'],
    ['Selected','=COUNTIF(\'HR Applications\'!U2:U,"Selected")'],
    ['Rejected','=COUNTIF(\'HR Applications\'!U2:U,"Rejected")'],
    ['Shortlisted','=COUNTIF(\'HR Applications\'!U2:U,"Shortlisted")'],
    ['Events','=COUNTA(Events!A2:A)'],
    ['Accepted Events','=COUNTIF(Events!K2:K,"Accepted")'],
    ['Today Tasks','=COUNTIF(Tasks!B2:B,TODAY())'],
    ['Today Follow-ups','=COUNTIF(Tasks!Q2:Q,TODAY())']
  ]);
  sh.getRange('D3:E10').setValues([
    ['Today','Value'],['Date','=TODAY()'],['Day','=TEXT(TODAY(),"dddd")'],['Month','=TEXT(TODAY(),"mmmm")'],['Year','=YEAR(TODAY())'],['Overdue','=COUNTIFS(Tasks!P2:P,"<"&TODAY(),Tasks!N2:N,"<>Completed")'],['Due Follow-ups','=COUNTIFS(Tasks!Q2:Q,"<="&TODAY(),Tasks!N2:N,"<>Completed")'],['Waiting HR Replies','=COUNTIF(\'HR Applications\'!Q2:Q,"Waiting")']
  ]);
  sh.autoResizeColumns(1,6);
}

function setupValidations_(ss) {
  const set = ss.getSheetByName('Settings');
  const list = (range) => SpreadsheetApp.newDataValidation().requireValueInRange(range,true).setAllowInvalid(false).build();
  const tasks = ss.getSheetByName('Tasks');
  tasks.getRange('F2:F2000').setDataValidation(list(set.getRange('B1:J1')));
  tasks.getRange('N2:N2000').setDataValidation(list(set.getRange('B2:J2')));
  tasks.getRange('O2:O2000').setDataValidation(list(set.getRange('B3:D3')));
  tasks.getRange('R2:R2000').setDataValidation(list(set.getRange('B4:I4')));
  tasks.getRange('S2:S2000').setDataValidation(list(set.getRange('B5:H5')));

  const hr = ss.getSheetByName('HR Applications');
  hr.getRange('K2:K2000').setDataValidation(list(set.getRange('B6:I6')));
  hr.getRange('Q2:Q2000').setDataValidation(list(set.getRange('B5:H5')));
  hr.getRange('U2:U2000').setDataValidation(list(set.getRange('B4:I4')));

  const li = ss.getSheetByName('LinkedIn Jobs');
  li.getRange('F2:F2000').setDataValidation(list(set.getRange('B7:D7')));
  li.getRange('P2:P2000').setDataValidation(list(set.getRange('B2:J2')));
  li.getRange('U2:U2000').setDataValidation(list(set.getRange('B3:D3')));

  const ev = ss.getSheetByName('Events');
  ev.getRange('K2:K2000').setDataValidation(list(set.getRange('B9:D9')));
  ev.getRange('L2:L2000').setDataValidation(list(set.getRange('B8:E8')));
}

function setupFormatting_(ss) {
  Object.keys(TABLES).forEach(name => {
    const sh = ss.getSheetByName(name);
    const cols = sh.getLastColumn();
    sh.getRange(1,1,1,cols).setFontWeight('bold');
    sh.getRange(1,1,sh.getMaxRows(),cols).setVerticalAlignment('middle');
    sh.autoResizeColumns(1,cols);
  });
  ['Tasks','HR Applications','LinkedIn Jobs','HR Emails','Events','Contacts'].forEach(name => {
    const sh = ss.getSheetByName(name);
    sh.getRange(2,1,Math.max(sh.getMaxRows()-1,1),sh.getLastColumn()).setWrap(true);
  });
}

function onEdit(e) {
  if (!e || e.range.getRow() < 2) return;
  const sh = e.range.getSheet(), row = e.range.getRow(), name = sh.getName();
  if (!TABLES[name]) return;
  const id = sh.getRange(row,1);
  if (!id.getValue()) id.setValue(makeId_(name,row));
  const now = new Date();
  const createdCol = TABLES[name].indexOf('Created At') + 1;
  const updatedCol = TABLES[name].indexOf('Updated At') + 1;
  if (createdCol && !sh.getRange(row,createdCol).getValue()) sh.getRange(row,createdCol).setValue(now);
  if (updatedCol) sh.getRange(row,updatedCol).setValue(now);
  if (name === 'Tasks' && sh.getRange(row,2).getValue()) {
    sh.getRange(row,3).setFormula(`=TEXT(B${row},"dddd")`);
    sh.getRange(row,4).setFormula(`=TEXT(B${row},"mmmm")`);
    sh.getRange(row,5).setFormula(`=YEAR(B${row})`);
  }
  if (name === 'Events' && sh.getRange(row,2).getValue()) {
    sh.getRange(row,3).setFormula(`=TEXT(B${row},"dddd")`);
    sh.getRange(row,4).setFormula(`=TEXT(B${row},"mmmm")`);
  }
}

function makeId_(name,row) {
  const prefix = {Tasks:'TASK', 'HR Applications':'APP', 'LinkedIn Jobs':'LI', 'HR Emails':'MAIL', Events:'EVENT', Contacts:'CONTACT'}[name] || 'ITEM';
  return prefix + '-' + Utilities.formatString('%05d', row-1);
}

function setupReminderTrigger_() {
  ScriptApp.getProjectTriggers().filter(t => t.getHandlerFunction()==='sendDailyReminder').forEach(t => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger('sendDailyReminder').timeBased().everyDays(1).atHour(8).create();
}

function sendDailyReminder() {
  const ss = SpreadsheetApp.getActive();
  const sh = ss.getSheetByName('Tasks');
  if (!sh || sh.getLastRow()<2) return;
  const rows = sh.getRange(2,1,sh.getLastRow()-1,22).getValues();
  const today = new Date();
  const items = [];
  rows.forEach(r => {
    const status=r[13], deadline=r[15], follow=r[16], title=r[6], company=r[7];
    if (status === 'Completed') return;
    if (deadline instanceof Date && sameDay_(deadline,today)) items.push('Deadline today: '+title+(company?' — '+company:''));
    if (follow instanceof Date && sameDay_(follow,today)) items.push('Follow-up today: '+title+(company?' — '+company:''));
  });
  if (!items.length) return;
  MailApp.sendEmail({to:Session.getEffectiveUser().getEmail(),subject:'Career Tracker — Today\'s Tasks',body:'Your reminders:\n\n'+items.join('\n')});
}

function sameDay_(a,b) {
  return Utilities.formatDate(a,TZ,'yyyy-MM-dd') === Utilities.formatDate(b,TZ,'yyyy-MM-dd');
}

function addLinkedInJob(company,title,location,url,recruiterName,recruiterLinkedIn) {
  const sh=SpreadsheetApp.getActive().getSheetByName('LinkedIn Jobs');
  sh.appendRow(['',new Date(),company,title,location,'','Full Time','','',url,recruiterName,recruiterLinkedIn,'','No','','Pending','Waiting','','Pending','', 'High','',new Date(),new Date()]);
}

function addHRApplication(company,role,hrName,hrEmail,jobUrl,source) {
  const sh=SpreadsheetApp.getActive().getSheetByName('HR Applications');
  sh.appendRow(['',new Date(),company,role,'Full Time','',hrName,hrEmail,'','',source||'LinkedIn',jobUrl||'','Yes','No','No','','Waiting','','','','Pending','','','', 'Wait for HR response','',new Date(),new Date()]);
}

function addEvent(eventName,organizer,eventDate,location,website) {
  const sh=SpreadsheetApp.getActive().getSheetByName('Events');
  sh.appendRow(['',eventDate,'','',eventName,organizer,'','','Pending','Pending','Pending','Going',location,'','',website||'','','','','','Pending','No','', '',new Date(),new Date()]);
}

function addTask(title,type,date,priority,deadline,followUp,company) {
  const sh=SpreadsheetApp.getActive().getSheetByName('Tasks');
  sh.appendRow(['',date||new Date(),'','','',type||'Other',title,company||'','','','','','','Pending',priority||'Medium',deadline||'',followUp||'','Pending','Waiting','',new Date(),new Date()]);
}

function onOpen() {
  SpreadsheetApp.getUi().createMenu('🚀 Career Tracker').addItem('Setup / Reset','setupCareerTracker').addItem('Send Reminder Now','sendDailyReminder').addToUi();
}
