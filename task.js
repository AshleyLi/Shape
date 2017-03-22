var currentTask = 1; // 目前任務的順序
var task1 = "<img src='/img/img_default.jpg' xkid='default' style='width:171px;height:91px;left:553px;top:142px;'>";
var task2 = "<img src='/img/img_default.jpg' xkid='default' style='width:171px;height:91px;left:553px;top:242px;'>";
var task3 = "<img src='/img/img_default.jpg' xkid='default' style='width:171px;height:91px;left:553px;top:342px;'>";
//TaskController================================================================
$(document).on("click",".gotoNextTask",function(){
  var r = confirm("是否進入下一任務？");
  if (r == true) {
      $(".identification").trigger("click");
  }
  // 確認
  currentTask++;
  addTaskElements("task"+currentTask);
});


//TaskController================================================================
$( document ).ready(function() {
  // 取得總長25的數列 ===================
  var arr = [];
  var res = [];
  for (var i = 0; i < 25; i++) {
    arr[i] = i;
  }
  // 打亂數列的排序 ===================
  for (var i = 0, len = arr.length; i < len; i++) {
    var j = Math.floor(Math.random() * arr.length);
    res[i] = arr[j];
    arr.splice(j, 1);
  }
  var t = "task" + currentTask;
  addTaskElements(t);
});


//Add task elements==========================================================
function addTaskElements(e) {
  console.log(e);
  $(".identification").append(e);
}
