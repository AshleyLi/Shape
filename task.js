var currentTask = 0; // 當前任務順序(內容編號)
var comletedTaskQty = 0; // 目前完成的任務數量
var taskIndex = []; // totalTask個的測試的順序（非內容編號）
var totalTask = 35; // 任務總數量

// totalTask數量以亂數排出六種順序。 數字＝圖片檔名。
// 0~15 = 基礎元件，16~35 = 複合元件。
var taskIndex1 = [ 1,13,3,8,9,15,10,2,5,12,11,4,7,14,6,0,  34,31,32,19,29,22,28,27,18,25,21,17,26,16,20,33,23,30,24];
var taskIndex2 = [3,6,14,10,12,4,13,1,0,8,11,2,9,7,5,15,  31,17,33,28,22,29,18,27,34,26,20,32,21,23,24,30,25,19,16];
var taskIndex3 = [2,13,0,9,10,6,1,8,5,4,11,15,12,3,14,7,  24,16,34,28,26,31,22,23,20,27,33,17,21,29,25,32,18,30,19];
var taskIndex4 = [8,12,4,5,0,14,1,15,7,3,2,11,10,13,6,9,  18,19,31,26,34,30,27,29,32,23,28,33,22,25,17,24,20,16,21];
var taskIndex5 = [9,2,11,6,0,15,12,8,4,5,10,14,13,7,3,1,  20,31,16,25,24,26,23,17,21,33,22,30,32,29,19,27,34,18,28];
var taskIndex6 = [7,4,11,1,5,8,9,6,15,10,14,2,0,3,12,13,  27,23,19,22,26,32,17,30,25,29,18,31,34,21,28,33,20,24,16];
var taskIndex7 = [1,13,7,0,6,8,10,12,2,5,9,11,14,3,4,15,  20,16,22,28,33,24,30,32,19,18,23,29,31,17,27,25,21,34,26];
var testTask = [99, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,         16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34 ];
var testTaskPart = [23, 24, 25];

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

  if(studyTask[currentTask] == 99 ){
    $(".taskImg").css("display","none");
    $(".js_taskimg").css("display","none");
  }
  console.log("=========== Task "+ studyTask[currentTask] + " ===========");


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
    var r = confirm("是否進入任務"+(currentTask+1)+"？");
    if (r == true ) {
      resetUndo();

      // reset popview
      selectedType = "";
      closePopviewEdior();

      initialforTaskSetting();  // Clean task modules & user create modules.
      currentTask++;  // Update task index.
      checkTask(); // Confirm if specific tasks.
      addTaskElements(studyTask[currentTask]); // Update the new task layout.
      // 變更任務指示圖片及文字
      $(".js_taskNum").text(currentTask);
      $(".js_taskimg").css("display","flex").attr("src", "img/tasks/taskimg"+studyTask[currentTask]+".jpeg");
      showTaskImg();
      // 寫入紀錄
      arrData.push(timeIndex()+"Index"+currentTask+"/Task"+studyTask[currentTask]+"." );
      console.log("=========== Task "+ studyTask[currentTask] + " ===========");
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
  if( studyTask[currentTask] >= 20){

    switch (studyTask[currentTask]) {
      // Action Sheet =========================================（ Action Sheet ）
      case 20:
        openPopview("Action sheet");
        break;
      case 21:
        openPopview("Action sheet");
        break;
      case 22:
        openPopview("Action sheet");
        break;
      // Alert =======================================================（ Alert ）
      case 23:
        openPopview("Alert");
        break;
      case 24:
        openPopview("Alert");
        break;
      case 25:
        openPopview("Alert");
        break;
      case 26:
        openPopview("Alert");
        break;
      // Custom Popview =====================================（ Custom Popview ）
      case 27:
        openPopview("Custom pop view");
        $("#pop-customPopView").css("height", 320);
        $("#pop-customPopView").append("<img src='/img/img_default.jpg' style='width:170px;height:170px;left:11px;top:15px;position:absolute;'>");
        resizeCustomPopView();
        break;
      case 28:
        openPopview("Custom pop view");
        $("#pop-customPopView").css("height", 120);
        $("#pop-customPopView").append("<button type='button'  style='width:113px;height: 30px;left: 40px;top: 70px;position: absolute;'>按鈕</button>");
        resizeCustomPopView();
        break;
      case 29:
        openPopview("Custom pop view");
        $("#pop-customPopView").css("height", 320);
        $("#pop-customPopView").append("<div class='tableview' id='tableview' style='position: absolute; display: initial; width: 100%;left: 0px; top: 49px;'><div class='page-content'><!-- <div class='content-block-title'>Title</div> --><div class='list-block'><ul class='js_tableUl'><li class='item-content'><div class='item-media'><i class='icon icon-f7'></i></div><div class='item-inner'><div class='item-title'>Item title</div><div  class='item-after'>Text ＞</div></div></li><li class='item-content'><div class='item-media'><i class='icon icon-f7'></i></div><div class='item-inner'><div class='item-title'>Item title</div><div  class='item-after'>Text ＞</div></div></li><li class='item-content'><div class='item-media'><i class='icon icon-f7'></i></div><div class='item-inner'><div class='item-title'>Item title</div><div  class='item-after'>Text ＞</div></div></li><li class='item-content'><div class='item-media'><i class='icon icon-f7'></i></div><div class='item-inner'><div class='item-title'>Item title</div><div  class='item-after'>Text ＞</div></div></li><li class='item-content'><div class='item-media'><i class='icon icon-f7'></i></div><div class='item-inner'><div class='item-title'>Item title</div><div  class='item-after'>Text ＞</div></div></li></ul></div></div></div>");
        $("#tableview .item-media").css("display","none"); //對我偷懶我不想改QQ
        resizeCustomPopView();
        break;
      case 30:
        openPopview("Custom pop view");
        $("#pop-customPopView").css("height", 320);
        $("#pop-customPopView").append("<button type=‘button' style='width:144px;left: 26px;top: 286px;position:absolute;'>確認</button>");
        resizeCustomPopView();
        break;
      // Picker =======================================================（Picker）
      case 31:
        openPopview("Picker");
        break;
      case 32:
        openPopview("Picker");
        break;
      case 33:
        openPopview("Picker");
        break;
      case 34:
        openPopview("Picker");
        break;
      default:

    }

  }
}
