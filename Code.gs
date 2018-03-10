/**
   @desc script to notify user with a toasty and provide a side dialog box for late submission info
   @Author Shawn Hodgson shawnjhodgson.com
   @Date 3/9/2018
   @Site: http://shawnjhodgson.com/2018/03/google-spreadsheet-script-missed-tasks
/
*/
// menu added on open
function onOpen() {
   SpreadsheetApp.getUi() // Or DocumentApp or FormApp.
      .createMenu('Task Options')    
      .addItem('Late Submission', 'openDialog')     
      .addToUi();
}


function onEdit(e) {
  var chosenSheetName1 = "Daily & Weekly Tasks";
  var chosenSheetName2 = "Monthly Tasks"
 //var chosenColumn = 1;
  var ss = e.source.getSheetName();
 // var cellColumn = e.range.getColumn();
  var cellValue = e.value;
  Logger.log("Started");
  if ((ss == chosenSheetName1 || ss == chosenSheetName2) && cellValue == "No")
  {     
      SpreadsheetApp.getActiveSpreadsheet().toast('Please fill out late form', 'Missed', 3);
  }
 
}



//Opens side dialog box with html form
function openDialog(e) {
  try
  {
      var html = HtmlService.createHtmlOutputFromFile('Index');
      SpreadsheetApp.getUi()
                    .showSidebar(html); // Or DocumentApp or FormApp.       .showSidebar(html, 'Dialog title');
  }
  catch(e)
  {
       Logger.log(e.message); 
   }
}

//Process submitted form
function processForm(myform){ 
  Logger.log("In Process Form");
  var array = [];
  try 
  {     
     for(var props in myform){
       //push form objects to array
       array.push(myform[props])       
    }
    //save array with objects to spreadsheet
    saveToSpreadSheet(array);   
  }
  catch(e)
  {
    Logger.log(e.message); 
  }  
}

//Takes processed array from form and saves it as a new now in the spreadsheet
function saveToSpreadSheet(array){  
  var sheetName = "Reason For Missing Deadline";  
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);  
  // Get a public lock on this script, because we're about to modify a shared resource.
  var lock = LockService.getPublicLock();
  // Wait for up to 30 seconds for other processes to finish.
  lock.waitLock(30000);
  sheet.appendRow(array);
  lock.releaseLock();
}





/