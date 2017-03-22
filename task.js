var currentTask = 1; // 目前任務的順序
var comletedTaskQty = 0; // 目前完成的任務數量  
//TaskController================================================================
$(document).on("click",".gotoNextTask",function(){
  var r = confirm("是否進入下一任務？");
  if (r == true) {
    $(".identification").empty();
    currentTask++;
    addTaskElements(currentTask);
  }
  // 確認

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
  addTaskElements(currentTask);
});


//Add task elements==========================================================
function addTaskElements(e) {
  $("#task" + e).appendTo(".identification");
}
