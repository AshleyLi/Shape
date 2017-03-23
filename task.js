var currentTask = 0; // 目前任務的順序
var comletedTaskQty = 0; // 目前完成的任務數量
var taskIndex = []; //
//TaskController================================================================
$(document).on("click",".gotoNextTask",function(){
  var r = confirm("是否進入下一任務？");
  if (r == true) {
    $(".identification").empty();
    currentTask++;
    addTaskElements(taskIndex[currentTask]);
    $(".js_taskNum").text(currentTask+1);
  }
  // 確認

});


//TaskController================================================================
$( document ).ready(function() {
  // 取得總長25的數列 ===================
  var arr = [];
  for (var i = 0; i < 25; i++) {
    arr[i] = i;
  }
  // 打亂數列的排序 ===================
  for (var i = 0, len = arr.length; i < len; i++) {
    var j = Math.floor(Math.random() * arr.length);
    taskIndex[i] = arr[j];
    arr.splice(j, 1);
  }
  addTaskElements(taskIndex[currentTask]);
});


//Add task elements==========================================================
function addTaskElements(e) {
  $("#task" + e).appendTo(".identification");
}
