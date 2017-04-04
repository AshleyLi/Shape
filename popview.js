

$( document ).ready(function() {
  //1-1. Show popview type list
  $( ".js_funcPop" ).mouseover(function() {
    // show a popview type list
    $(".func.js_funcPop").addClass("focus");
    $("#js_popviewType").css({
      "display": "block",
      "width" : 370
      });
  });

  // 1-2. Close popview type list
  $("div#js_popviewType").mouseleave(function(){
    $(".func.js_funcPop").removeClass("focus");
    $("#js_popviewType").css( "display", "none" );
  });

  // 2-1. Get the selected popview type.
  $(".popviewTypeList > li").mousedown(function(){
    $(".popview > div.modal.modal-in").css( "display", "none" );
    $("#js_popviewType").css( "display", "none" );
    selectedType = $(this).children("img").attr("alt");
    // 2-2. Open the popview.
    openPopview(selectedType);
  });

  $(".closePopviewEdior").mousedown(function() {
    $(".popview").css("display","none");
    $(this).css("display","none");
    popEditor = false;
  });


});

//=====（ＯＰＮＥ＿ＰＯＰＶＩＥＷ）=====================================================
function openPopview(e){

  selectedType = e; //for initial task
  popEditor = true ;
  console.log("e = "+ e);
  // （一）顯示pop基礎容器  ===============================================
  $(".write-here").css("display","none");
  $(".popview > div").css("display","none");
  $(".popview").css({
    "display" : "initial",
    "width":MCScreenW+ "px",
    "height": MCScreenH + 2 +"px",
    "left": popPosX +"px",
    "top":  popPosY- 9 +"px"});
    // 上為原始容器，下為因任務新增之容器
  // $(".popContainer").css({
  //   "display" : "initial",
  //   "width":MCScreenW+ "px",
  //   "height": MCScreenH + 2 +"px",
  //   "left": popPosX +"px",
  //   "top":  popPosY+42 +"px"});
  // （二）顯示關閉pop btn  ===============================================
  $(".closePopviewEdior").css("display","initial");

  // （三）Bring the drawing canvas to top layer.  ======================
  $("#shape-input").css("z-index",400);

  // （四）設置所選的 popCanvas position  =================================

  if( e == "Alert"){

    // 執行 Alert 產生後的行為：移動、動作寫入log、設定undo
    $(".pop-alert").clone().appendTo(".popview").attr("id","pop-alert");
    arrData.push(timeIndex()+"CreatePOPView:"+"Alert");
    $("#pop-alert").css({
      "display":"block",
      "left": $(".popview").width()/2 - $("#pop-alert").width()/2,
      "top": $(".popview").height()/2 - $("#pop-alert").height()/2
    });
  }
  else if ( e == "Action sheet") {
    $(".pop-actionSheet").css({
      "display":"block",
      "top":0,
      "width":MCScreenW+ "px",
      "height": MCScreenH+"px",
    });
    // 執行 Action sheet 產生後的行為：移動、動作寫入log、設定undo
    $(".pop-actionSheet").clone().appendTo(".popview").attr("id","pop-actionSheet");
    arrData.push(timeIndex()+"CreatePOPView:"+"ActionSheet");
  }
  else if ( e == "Custom pop view") {
    $(".pop-customPopView").css( "width", $(".popview").width()*0.8);
    $(".pop-customPopView").css({
      "display":"block",
      "left": ($(".popview").width()- $(".pop-customPopView").width() )/2 ,
      "top": $(".popview").height()/2 - $(".pop-customPopView").height()/2
    });
    // 執行 Custom pop view 產生後的行為：移動、動作寫入log、設定undo
    $(".pop-customPopView").clone().appendTo(".popview").attr("id","pop-customPopView");
    arrData.push(timeIndex()+"CreatePOPView:"+"CustomPopview");
  }
  else {
    // Picker

    $(".pop-picker").css({
      "display":"block",
      "height": MCScreenH
    });
    $(".pop-picker").clone().appendTo(".popview").attr("id","pop-picker");
    arrData.push(timeIndex()+"CreatePOPView:"+"Picker");
  }

}
