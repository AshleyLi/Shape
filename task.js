var currentTask = 0; // 任務順序
var comletedTaskQty = 0; // 目前完成的任務數量
var taskIndex = []; //
var totalTask = 3;
//TaskController================================================================
$(document).on("click",".gotoNextTask",function(){
  // 任務已經全部完成，則開始儲存.csv
  if(currentTask+1 == totalTask){
    alert("儲存測試資料");

    var test_array = [["name1", 2, 3], ["name2", 4, 5], ["name3", 6, 7], ["name4", 8, 9], ["name5", 10, 11]];
  	var fname = "IJGResults";

  	var csvContent = "data:text/csv;charset=utf-8,";
  		arrData.forEach(function(infoArray, index){
  			dataString = infoArray.join(",");
  			csvContent += index < infoArray.length ? dataString+ "\n" : dataString;
  		});
  		var encodedUri = encodeURI(csvContent);
  		window.open(encodedUri);




  }else {
  // 任務尚未結束，前往下一任務
    var r = confirm("是否進入任務"+(currentTask+2)+"？");
    if (r == true ) {
      $(".identification").empty();
      currentTask++;
      addTaskElements(taskIndex[currentTask]);
      $(".js_taskNum").text(currentTask+1);
      arrData.push(timeIndex()+"Index"+currentTask+"/Task"+taskIndex[currentTask]+"." );
    }
  }

});


//TaskController================================================================
$( document ).ready(function() {
  // 取得總長25的數列 ===================
  var arr = [];
  for (var i = 0; i < totalTask; i++) {
    arr[i] = i;
  }
  // 打亂數列的排序 ===================
  for (var i = 0, len = arr.length; i < len; i++) {
    var j = Math.floor(Math.random() * arr.length);
    taskIndex[i] = arr[j];
    arr.splice(j, 1);
  }
  $(".js_totalTask").text(totalTask);
  arrData.push(timeIndex()+"Index="+taskIndex);
  arrData.push(timeIndex()+"Index"+currentTask+"/Task"+taskIndex[currentTask]+"." );
  addTaskElements(taskIndex[currentTask]);
});


//Add task elements==========================================================
function addTaskElements(e) {
  $("#task" + e).appendTo(".identification");
}
