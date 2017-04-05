var currentTask = 0; // 當前任務順序(內容編號)
var comletedTaskQty = 0; // 目前完成的任務數量
var taskIndex = []; // totalTask個的測試的順序（非內容編號）
var totalTask = 45; // 任務總數量

// totalTask數量以亂數排出六種順序。 數字＝圖片檔名。
var taskIndex1 = [44, 0, 39, 5, 41, 1, 18, 28, 6, 7, 36, 3, 20, 22, 31, 26, 4, 12, 32, 11, 19, 15, 13, 35, 24, 29, 8, 17, 16, 38, 2, 21, 25, 10, 34, 42, 27, 40, 43, 30, 37, 23, 9, 33, 14];
var taskIndex2 = [30, 35, 36, 13, 28, 20, 18, 24, 44, 21, 10, 19, 23, 43, 33, 37, 7, 4, 5, 22, 14, 6, 1, 17, 29, 16, 3, 39, 11, 34, 26, 9, 25, 42, 41, 27, 32, 15, 2, 31, 40, 12, 38, 8, 0];
var taskIndex3 = [43, 23, 39, 41, 13, 6, 26, 0, 9, 27, 15, 7, 35, 11, 17, 12, 10, 14, 33, 36, 32, 38, 22, 30, 42, 5, 21, 8, 19, 1, 3, 16, 20, 24, 28, 4, 40, 34, 31, 18, 2, 25, 44, 29, 37];
var taskIndex4 = [43, 28, 3, 31, 16, 42, 0, 6, 30, 25, 27, 8, 37, 34, 40, 38, 5, 39, 29, 18, 15, 44, 17, 33, 32, 12, 20, 21, 36, 35, 9, 7, 19, 14, 22, 4, 11, 23, 10, 26, 41, 24, 13, 2, 1];
var taskIndex5 = [8, 30, 12, 0, 11, 3, 35, 22, 1, 39, 27, 13, 32, 9, 4, 17, 14, 42, 15, 41, 21, 43, 10, 20, 7, 2, 19, 37, 6, 26, 33, 24, 16, 23, 29, 44, 25, 38, 28, 5, 18, 31, 36, 34, 40];
var taskIndex6 = [29, 36, 37, 2, 22, 34, 1, 35, 19, 14, 18, 42, 32, 6, 13, 10, 16, 21, 44, 3, 17, 8, 5, 11, 26, 15, 0, 7, 27, 25, 30, 9, 43, 39, 41, 23, 40, 28, 4, 33, 38, 20, 24, 31, 12];
var testTask = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44];
var testTaskPart = [41, 42, 43, 44, 39];

var studyTask = []; // 目前執行哪一個亂數順序


//TaskController================================================================
$(document).ready(function() {
  // // 取得總長25的數列 ===================
  // var arr = [];
  // for (var i = 0; i < totalTask; i++) {
  //   arr[i] = i;
  // }
  // // 打亂數列的排序 ===================
  // for (var i = 0, len = arr.length; i < len; i++) {
  //   var j = Math.floor(Math.random() * arr.length);
  //   taskIndex[i] = arr[j];
  //   arr.splice(j, 1);
  // }
  // (一)設定任務
  studyTask = testTaskPart; //****************************************(ＴＡＳＫ ＳＥＴＴＩＮＧ)****************************************
  $(".js_totalTask").text(totalTask);
  // (二)寫入ＬＯＧ
  arrData.push(timeIndex()+"Index="+studyTask);
  arrData.push(timeIndex()+"No."+currentTask+", Task"+studyTask[currentTask]+"." );
  // (三)設定ＴＡＳＫ
  addTaskElements(studyTask[currentTask]);
  $(".js_taskimg").attr("src", "img/tasks/taskimg"+studyTask[currentTask]+".jpeg");
  // (四)確認是否為單頁動畫任務
  checkTask();



});


//Add task elements==========================================================
function addTaskElements(e) {
  var idddd = getCurrentID() ;
  $("#task" + e).clone().appendTo(".identification");
  currentID++;
}
//TaskController================================================================
$(document).on("click",".gotoNextTask",function(){

  // （一）判斷任務是否全部完成，若已完成則開始儲存.csv
  if(currentTask+1 == totalTask){
    alert("儲存測試資料");

  	var csvContent = "data:text/csv;charset=utf-8,";
		arrData.forEach(function(infoArray, index){
			csvContent += infoArray+ "\n";
		});
		var encodedUri = encodeURI(csvContent);
		window.open(encodedUri);

  }else {
  // 任務尚未結束，前往下一任務
    var r = confirm("是否進入任務"+(currentTask+2)+"？");
    if (r == true ) {


      initialforTaskSetting();  // Clean task modules & user create modules.
      currentTask++;  // Update task index.
      checkTask(); // Confirm if specific tasks.
      addTaskElements(studyTask[currentTask]); // Update the new task layout.
      // 變更任務指示圖片及文字
      $(".js_taskNum").text(currentTask+1);
      $(".js_taskimg").css("display","flex").attr("src", "img/tasks/taskimg"+studyTask[currentTask]+".jpeg");
      showTaskImg();
      // 寫入紀錄
      arrData.push(timeIndex()+"Index"+currentTask+"/Task"+studyTask[currentTask]+"." );
    }
  }


});
// 關閉任務圖片
$(document).on("click",".taskImg",function(){
  $(this).css("display","none");
});
// 開任務圖片
function showTaskImg(){
  $(".taskImg").css("display","flex");
}

//=====（ＳＰＥＣＩＦＩＣ＿ＴＡＳＫＳ）=====================================================
function checkTask(){
  //（四）初始化特定任務所需環境
  if( studyTask[currentTask] >= 30){

    switch (studyTask[currentTask]) {
      // Action Sheet =========================================（ Action Sheet ）
      case 30:
        console.log("Task 30.");
        openPopview("Action sheet");
        break;
      case 31:
        console.log("Task 31.");
        openPopview("Action sheet");
        break;
      case 32:
        console.log("Task 32.");
        openPopview("Action sheet");
        break;
      // Alert =======================================================（ Alert ）
      case 33:
        console.log("Task 33 = Alert");
        openPopview("Alert");
        break;
      case 34:
        console.log("Task 34.");
        openPopview("Alert");
        break;
      case 35:
        console.log("Task 35.");
        openPopview("Alert");
        break;
      case 36:
        console.log("Task 36.");
        openPopview("Alert");
        break;
      // Custom Popview =====================================（ Custom Popview ）
      case 37:
        console.log("Task 37.");
        openPopview("Custom pop view");
        $("#pop-customPopView").css("height", 320);
        $("#pop-customPopView").append("<img src='/img/img_default.jpg' style='width:170px;height:170px;left:11px;top:15px;position:absolute;'>");
        resizeCustomPopView();
        break;
      case 38:
        console.log("Task 38.");
        openPopview("Custom pop view");
        $("#pop-customPopView").css("height", 120);
        $("#pop-customPopView").append("<button type='button'  style='width:113px;height: 30px;left: 40px;top: 70px;position: absolute;'>按鈕</button>");
        resizeCustomPopView();
        break;
      case 39:
        console.log("Task 39.");
        openPopview("Custom pop view");
        $("#pop-customPopView").css("height", 320);
        $("#pop-customPopView").append("<span  style='width: 40px;left:68.703125px;top:28px;position:absolute;text-overflow:ellipsis;white-space: nowrap; overflow:hidden;font-size:20px;'>清單</span><button type=‘button' style='width:144px;left: 26px;top: 286px;position:absolute;'>確認</button>");
        resizeCustomPopView();
        break;
      case 40:
        console.log("Task 40.");
        openPopview("Custom pop view");
        $("#pop-customPopView").css("height", 320);
        $("#pop-customPopView").append("<button type=‘button' style='width:144px;left: 26px;top: 286px;position:absolute;'>確認</button>");
        resizeCustomPopView();
        break;
      // Picker =======================================================（Picker）
      case 41:
        console.log("Task 41.");
        openPopview("Picker");
        break;
      case 42:
        console.log("Task 42.");
        openPopview("Picker");
        break;
      case 43:
        console.log("Task 43.");
        openPopview("Picker");
        break;
      case 44:
        console.log("Task 44.");
        openPopview("Picker");
        break;
      default:

    }

  }
}
