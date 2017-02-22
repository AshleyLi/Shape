var mobileCanvasW = 280;
var mobileCanvasH = Math.floor(mobileCanvasW * 2.357);
var MCScreenW = Math.floor(mobileCanvasW * 0.8714);
var MCScreenH = Math.floor(MCScreenW * 1.7704);
var screenH,unitH ;
var segmentsLength;
var shapeQty = 0;
var shapeName;
var pointsX = [], pointsY = []; // all x,y points of any kind of shape
var rectW, rectH ; // w & h of rectangle
var lineW,lineH  = 1  ; // w & h of line
var shift = 0;


var suggestedlist = "none";
var idPadding = 5; // a value of identification labels
var idtagX, idtagY;

var correctness = 0;

var errorQty  = 0 ;
var componentP = [5,4,3,2,1];
var totalScore = 0;
var popSuggestionsX, popSuggestionsY ;
var xkID, currentID;

var popEditor = false;
var popPosX , popPosY ;
var selectedType;

var ASTitle = false;
var xShift, yShift;

var tableiQty = 0;
var tableviewMode = false, repeatCellMode = false;
var tablePos;
var tableX = [], tableY = []; // 形成t字兩線斷的 x and y
var tolerance = 50; // T字判斷 線段偏離容許值
var cellMidline; // cell的中線x位置




// Basic settings ==============================================================
$( document ).ready(function() {
  screenH = MCScreenH;
  unitH = screenH/10;
  $(".ooo-section").css({"height":$(window).height()-50});
  popPosX = Math.floor($(window).width()/2 - MCScreenW/2);
  popPosY = Math.floor($(".ooo-section").height()/2 - MCScreenH/2 -2);
  cellMidline = popPosX + Math.floor(MCScreenW/2);
});


// Get shape ===================================================================
window.Ashley = {
  responseCallback : function (responseObject){

    // Print shape object ===============DON'T TOUCH!!===============
    console.log(responseObject)

    // Get the length of shape segments[]
    var arrayShape = responseObject.result.segments;
    segmentsLength = arrayShape.length;
    shapeQty++;

    // if the shape == Tableview or not
    if(segmentsLength >= 2 ){
      for ( i = 0 ; i < 2; i++){
          var x = Math.floor(responseObject.result.segments[i].candidates[0].primitives[0].firstPoint.x);
          var y = Math.floor(responseObject.result.segments[i].candidates[0].primitives[0].firstPoint.y);
          var xx = Math.floor(responseObject.result.segments[i].candidates[0].primitives[0].lastPoint.x);
          var yy = Math.floor(responseObject.result.segments[i].candidates[0].primitives[0].lastPoint.y);
          if( i >= 1){
            tableX[i+1] = x;
            tableX[i+2] = xx;
            tableY[i+1] = y;
            tableY[i+2] = yy;
          }else{
            tableX[i] = x;
            tableX[i+1] = xx;
            tableY[i] = y;
            tableY[i+1] = yy;
          }
      }
      var basic = (tableY[0]+tableY[1])/2;
      if (
          // 確定 line2.x 位於 line1.x 內
          tableX[0] < tableX[2] && tableX[2] < tableX[1] &&
          tableX[0] < tableX[3] && tableX[3] < tableX[1] &&
          // 確定line2.top 位於 line1.y 的平均值內
          basic - tolerance < tableY[2] &&
          tableY[2] < basic + tolerance
        ) {
          shapeName = "table" ;
        }else{
          clearCanvas();
        }
    }else{
      shapeName = responseObject.result.segments[0].candidates[0].label;
    }


    $(".js_shapeName").text(shapeName);
    $(".js_ShapeQty").text(Math.round(shapeQty));


    // Give a id to the following element
    currentID = Date.now();

    // Clear the myScript canvas.
    function clearCanvas(){
      $("paper-fab[icon='delete']").trigger("click");
    }

    // Get shape information
    function getShapeInfo(){

      if(shapeName == "rectangle" || shapeName == "square"){
        // rectangle:  Get shape posX and posY array
        for ( i = 0 ; i < 4; i++){
            var pointX = Math.floor(responseObject.result.segments[0].candidates[0].primitives[i].firstPoint.x);
            var pointY = Math.floor(responseObject.result.segments[0].candidates[0].primitives[i].firstPoint.y);
            pointsX[i] = pointX;
            pointsY[i] = pointY;
        }
        // remove tha same value from PosX & PosY array
        pointsX = pointsX.filter(function(element, index, arr){
          return arr.indexOf(element)=== index;
        });
        pointsY = pointsY.filter(function(element, index, arr){
          return arr.indexOf(element)=== index;
        });
        // Sort PosX[] & PosY[]
        pointsX.sort(function (a, b) {return a - b});
        pointsY.sort(function (a, b) {return a - b});
        // rectangle: Get shape size for rectangle
        rectW = pointsX[1]-pointsX[0] ;
        rectH = pointsY[1]-pointsY[0] ;
      }else if (shapeName == "line"){
        // Get PosX[] & PosY[]
        pointsX[0] = Math.floor(responseObject.result.segments[0].candidates[0].primitives[0].firstPoint.x);
        pointsY[0] = Math.floor(responseObject.result.segments[0].candidates[0].primitives[0].firstPoint.y);
        pointsX[1] = Math.floor(responseObject.result.segments[0].candidates[0].primitives[0].lastPoint.x);
        pointsY[1] = Math.floor(responseObject.result.segments[0].candidates[0].primitives[0].lastPoint.y);
        // Sort PosX[] & PosY[]
        pointsX.sort(function (a, b) {return a - b});
        pointsY.sort(function (a, b) {return a - b});

        // Get line width
        function getLineWidth(){
          var calX = pointsX[1]-pointsX[0];
          var calY = pointsY[1]-pointsY[0];
          var width = Math.floor( Math.pow((calX *calX + calY * calY), 0.5));
          return width;
        }
        lineW = getLineWidth();
        lineH = 1 ;
        $(".js_shapeW").text(lineW);
        $(".js_shapeH").text(lineH);
      }else {
        removeWrongShape();
      }
      // Show shape information ====================================================================
      $(".js_pointsX").text(pointsX);
      $(".js_pointsY").text(pointsY);

    }
    // Recognizing the shape====================================================
    getShapeInfo();

    if(tableviewMode == true &&
      pointsY[0] > tablePos.top &&
      pointsY[0] < tablePos.top + $("#tableview").height() &&
      pointsX[0] > tablePos.left  &&
      pointsX[0] < tablePos.left + $("#tableview").width()
    ){
      // && tableY[0] < pointsY[0] && pointsY[0] < (tableY[0] + MCScreenH)
      console.log("Drawing on a tableview");
      switch (shapeName) {
        case 'rectangle':
          ACellRectangle();
          break;
        case 'square':
          ACellRectangle();
          break;
        case 'line':
          ACellLine();
          break;
        default:
          removeWrongShape();
      }
    }else if( popEditor == true ){
      var popviewCanvas = $(".popview").position();
      switch (selectedType) {
        case "Custom pop view":
          popCustomPopview();
          break;
        case "Action sheet":
          popActionSheet();
          break;
        case "Alert":
          popAlert();
          break;
        case "Picker":
          popPicker();
          break;
        default:
      }
    }else {
      switch (shapeName) {
        case 'rectangle':
          ARectangle();
          break;
        case 'square':
          ARectangle();
          break;
        case 'line':
          ALine();
          break;
        case 'table':
          ATableview();
          break;
        default:
          removeWrongShape();
      }
    }

    // Remove the wrong shape ==================================================
    function removeWrongShape(){
      clearCanvas();
      shapeQty--;
      $(".js_ShapeQty").text(Math.round(shapeQty));
    }

    // Tableview ===============================================================
    // Create a tableview.
    function ATableview(){
      if(tableiQty != 1){
        $("#tableview").css({
          "display" : "initial",
          "width":MCScreenW+ "px",
          // "height": MCScreenH + 2 +"px",
          "left": popPosX +"px"});

        // 判斷tableview 是否會超出 iphone 螢幕範圍，若超過則放置於邊界處
        if( tableY[0] < popPosY){
          $("#tableview").css("top", popPosY);
        }else if( tableY[0] > popPosY + MCScreenH){
          $("#tableview").css("top", popPosY+MCScreenH- $(".js_tableUl").height() );
        }else{
          $("#tableview").css("top",tableY[0]);
        }
        // set #tableview position
        tablePos = $("#tableview").position();
        // 於tableview加入cell
        for (var i = 0; i < 5; i++) {
          $(".js_tableUl").append("<li class='item-content'><div class='item-inner'><div class='item-title'></div></div></li>");
        }
        tableiQty = 1;
        tableviewMode = true;
      }else{
        console.log("表格已存在。");
      }
    }
    // drawing a rect on a cell.
    function ACellRectangle(){
      if (pointsX[0] < cellMidline) {
        // console.log("列表 左側的矩形");
        if( $(".icon.icon-f7").length == 0 ){
          $(".js_tableUl > .item-content").prepend("<div class='item-media'><i class='icon icon-f7'></i></div>");
        }
        clearCanvas();
      } else {
        // console.log("列表 右側的矩形"); = 加上「 > 」
        $(".item-content").addClass("item-link");
      }
      clearCanvas();
    }
    function ACellLine(){
      if (pointsX[0] < cellMidline) {
        // console.log("列表 左側的線段");
        if( $(".item-title").is(':empty') && $(".subforCell").length == 0 ){
          $(".js_tableUl > .item-content > .item-inner > .item-title").append("Item title");
        }else if( $(".item-title").length > 0 && $(".subforCell").length == 0){
          $(".js_tableUl > .item-content > .item-inner > .item-title").append("<div class='subforCell'>subtitle</div>");
        }else{
          // Nothing 2 happen.
        }

        clearCanvas();
      } else {
        // console.log("列表 右側的線段");
        if( $(".item-after").length == 0 && $(".subforCell").length == 0 ){
          $(".js_tableUl > .item-content > .item-inner").append("<div class='item-after'>Label</div>");
        }else if ( $(".item-after").length == 0 && $(".subforCell").length > 0 ) {
          $(".js_tableUl > .item-content > .item-inner").append("<div class='item-after'>Label</div>");
          $(".cell_left_controller").hide();
        }
        $(".cell").css({
          "display":"block",
          "left": tablePos.left + ,
          "top": pointsY[1]
        });
        clearCanvas();
      }
    }

    // Show rectangle suggestion ===============================================
    function ARectangle() {

      if(rectW >= rectH){
        if(rectH > unitH){
          // add an image & set a current elementID
          $(".identification").append("<img src='https://goo.gl/hSqM8y' xkID='"+ currentID + "' style='width:"+ rectW +"px;height:" + rectH +"px;left:"+pointsX[0]+"px;top:"+pointsY[0] + "px;'>");
          $(".js_wildRectB").css({"display" : "initial"});
        } else {
          // add a button & set a current elementID
          $(".identification").append("<button type='button' xkID='"+ currentID + "' style='width:"+ rectW +"px;height:" + rectH + "px;left:" + pointsX[0] + "px;top:" + pointsY[0] + "px;'>button</button>");
          $('.js_wildRectS').css({"display" : "block"});
        }
      }else {
        if(rectH > unitH){
          // add an image & set a current elementID
          $(".identification").append("<img src='https://goo.gl/hSqM8y' xkID='"+ currentID + "' style='width:"+ rectW +"px;height:" + rectH +"px;left:"+pointsX[0]+"px;top:"+pointsY[0] + "px;'>");
          $('.js_tallRectB').css({"display" : "block"});
        } else {
          // add an image & set a current elementID
          $(".identification").append("<img src='https://goo.gl/hSqM8y' xkID='"+ currentID + "' style='width:"+ rectW +"px;height:" + rectH +"px;left:"+pointsX[0]+"px;top:"+pointsY[0] + "px;'>");
          $('.js_tallRectS').css({"display" : "block"});
        }
      }

      // reture & set suggestions pop positionX,Y
      popSuggestionsX = pointsX[1] + 10
      popSuggestionsY = pointsY[1] - rectH/2 - $(".js_suggestions").height()/2  ;

      $('.js_suggestions').css({
        "display":"initial",
        "left": popSuggestionsX ,
        "top": popSuggestionsY ,
        "height": "auto"
      });

      //show information
      $(".js_shapeW").text(rectW);
      $(".js_shapeH").text(rectH);

      idtagX = pointsX[0];
      idtagY = pointsY[0];
    }

    // Show Line suggestion ====================================================
    function ALine() {

      // Greate the first component
      $(".identification").append("<span xkID='"+ currentID + "' style='width:"+lineW +"px;left:"+pointsX[0]+"px;top:"+pointsY[0] +"px;text-overflow:ellipsis; white-space: nowrap; overflow:hidden; font-size:20px; ;'>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.</span>");

      // add the first suggeted conponent.
      $(".identification").append("<span xkID='"+ currentID + "' style='width:"+lineW +"px;left:"+pointsX[0]+"px;top:"+pointsY[0] +"px;height:23px; text-overflow:ellipsis; white-space: nowrap; overflow:hidden; font-size:20px; ;'>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.</span>");

      // open & set suggestions pop positionX,Y
      $('.js_line').css({"display" : "initial"});
      $(".js_suggestions").css({"display":"initial","left": pointsX[1]+10 + "px","top": pointsY[0] + shift -$(".js_suggestions").height()/2 + "px"});

      // show the shape basic information


    }

    // Draw popview elements  ==================================================
    function popCustomPopview(){
      // var pgggg = $("#pop-customPopView");
      var popCustomPopView = $("#pop-customPopView").position();
      var popviewElement = $(".popview").position();
      xShift = pointsX[0] - popviewElement.left - popCustomPopView.left ;
      yShift = pointsY[0] - popviewElement.top - popCustomPopView.top ;
      console.log("xShift= "+ xShift + ", yShift=" + yShift);
      $(".drawinPopview").remove();
      $("#pop-customPopView").css("display", "block");
      if(shapeName == "rectangle" || shapeName == "square"){
        if(rectW >= rectH){
          if(rectH > unitH){
            // add an image & set a current elementID
            $("#pop-customPopView").append("<img src='https://goo.gl/hSqM8y' xkID='"+ currentID + "' style='width:"+ rectW +"px;height:" + rectH +"px;left:"+ xShift +"px;top:"+ yShift+ "px;position:absolute;'>");
            $(".js_wildRectB").css({"display" : "initial"});
          } else {
            // add a button & set a current elementID
            $("#pop-customPopView").append("<button type='button' xkID='"+ currentID + "' style='width:"+ rectW +"px;height:" + rectH + "px;left:" + xShift + "px;top:" + yShift + "px;position:absolute;'>button</button>");
            $('.js_wildRectS').css({"display" : "block"});
          }
        }else {
          if(rectH > unitH){
            // add an image & set a current elementID
            $("#pop-customPopView").append("<img src='https://goo.gl/hSqM8y' xkID='"+ currentID + "' style='width:"+ rectW +"px;height:" + rectH +"px;left:"+ xShift +"px;top:"+ yShift + "px;position:absolute;'>");
            $('.js_tallRectB').css({"display" : "block"});
          } else {
            // add an image & set a current elementID
            $("#pop-customPopView").append("<img src='https://goo.gl/hSqM8y' xkID='"+ currentID + "' style='width:"+ rectW +"px;height:" + rectH +"px;left:"+ xShift +"px;top:"+ yShift + "px;position:absolute;'>");
            $('.js_tallRectS').css({"display" : "block"});
          }
        }

        // reture & set suggestions pop positionX,Y
        popSuggestionsX = pointsX[1] + 10
        popSuggestionsY = pointsY[1] - rectH/2 - $(".js_suggestions").height()/2  ;

        $('.js_suggestions').css({
          "display":"initial",
          "left": popSuggestionsX ,
          "top": popSuggestionsY ,
          "height": "auto"
        });
        //show information
        $(".js_shapeW").text(rectW);
        $(".js_shapeH").text(rectH);
        idtagX = pointsX[0];
        idtagY = pointsY[0];

      }else if (shapeName == "line") {
        // Greate the first component
        $("#pop-customPopView").append("<span xkID='"+ currentID + "' style='width:"+lineW +"px;left:"+ xShift +"px;top:"+ yShift +"px;position:absolute;text-overflow:ellipsis; white-space: nowrap; overflow:hidden; font-size:20px; ;'>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.</span>");

        // add the first suggeted conponent.
        $("#pop-customPopView").append("<span xkID='"+ currentID + "' style='width:"+lineW +"px;left:"+ xShift +"px;top:"+ yShift  +"px;position:absolute;height:23px; text-overflow:ellipsis; white-space: nowrap; overflow:hidden; font-size:20px; ;'>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.</span>");

        // open & set suggestions pop positionX,Y
        $('.js_line').css({"display" : "initial"});
        $(".js_suggestions").css({"display":"initial","left": pointsX[1]+10 + "px","top": pointsY[0] + shift -$(".js_suggestions").height()/2 + "px"});

      }
      //popCustomPopview
    }
    function popActionSheet(){
      $("div#pop-actionSheet").css("display", "block");
      var popElement = $(".popview").position();
      var modalGroup = $("#pop-actionSheet > .actions-modal").position();

      if ( pointsY[0] > popElement.top && pointsY[0] < popElement.top + modalGroup.top ) {
        // ＝ Outside.
        if(shapeName == "rectangle" || shapeName == "square"){
          //判斷是否存在 action sheet title
          if(ASTitle == true){
            $(".actions-modal-label").after("<div class='actions-modal-button'>Button</div>");
          }else{
            $("#pop-actionSheet .actions-modal-group:first-child .actions-modal-button:first-child").before("<div class='actions-modal-button'>Button</div>");
          }
        }else if (shapeName == "line") {
          //判斷是否存在 action sheet title
          if(ASTitle == false){
            ASTitle = true;
            console.log("no title , add a new title");
            $(".actions-modal-group:first-child").prepend("<div class='actions-modal-label'>Do something</div>");
          }else {
            // title 已存在則只能新增 button
            console.log("Title is exist , add a button");
            $(".actions-modal-label").after("<div class='actions-modal-button'>Button</div>");
          }
        }
      } else if (pointsY[0] > popElement.top + modalGroup.top  && pointsY[0] < popElement.top + $(".popview").height() ) {
        // ＝ Inside.
        if(shapeName == "rectangle" || shapeName == "square" || shapeName == "line"){
          $(".actions-modal-group:first-child").append("<div class='actions-modal-button'>Button</div>");
        }else {
          // Nothing happened.
        }
      } else {
        // Nothing happened.
      }
      clearCanvas();

    }
    function popAlert(){
      var popElement = $("#pop-alert").position();
      var middleLine = $(".modal-buttons").position();
      // 1.Sperate main areas
      if( pointsY[0] >= popviewCanvas.top + popElement.top + middleLine.top){
        // Bottom area ==========================
        var bottomPopElement = popviewCanvas.top + popElement.top + $("#pop-alert").height();

        if (pointsY[0] >= bottomPopElement ){
          // 筆畫在.modal-buttons之下方
          $("#pop-alert").append("<div class='modal-buttons'><span class='modal-button'>Button</span></div>");
        }else {
          // 筆畫在.modal-buttons之中
          var buttonQty = $(".modal-buttons > .modal-button").length;
          if( buttonQty == 1){
            // 只有一個btn則在其旁增加btn
            $(".modal-buttons").append("<span class='modal-button'>Button</span>");
            console.log("在左邊新增");
          }else if (buttonQty == 2) {
            $(".modal-buttons").remove();
            for( i=0 ; i < buttonQty+1 ; i++ ){
              $("#pop-alert").append("<div class='modal-buttons'><span class='modal-button'>Button</span></div>");
            }
          }else {
            $("#pop-alert").append("<div class='modal-buttons'><span class='modal-button'>Button</span></div>");
          }
        }
        // 如果筆畫位置 > middleLine.top + $(".modal-buttons").height()

      }else {
        // Top area ==========================
        if(shapeName == "line"){
          // Opne the modal sub title
          $(".modal-text").css("display","initial");
          console.log(" (Top area && line) = text");
        }else if (shapeName == "rectangle" || shapeName == "square" ){
          // Opne the modal text input
          $(".modal-text-input").css("display","initial");
          console.log("(Top area && rectangle or square) = textInput");
        }else{
          console.log("No shape.");
        }
      }
      // Resize alert after func add a new element.
       $("#pop-alert").css({
        "display":"block",
        "left": $(".popview").width()/2 - $("#pop-alert").width()/2 ,
        "top": $(".popview").height()/2 - $("#pop-alert").height()/2
      });
      clearCanvas();
    }
    function popPicker(){
      $("#pop-picker").css("display", "block");
    }


  },
  requestCallback : function (requestObject){
    console.log(requestObject)
  }
}


// AFTER CONFIRM ===============================================================
$(document).on("click",".js_confirmType",function(){
    // Close suggestions
    $('.popover-content > div').css({"display" : "none"});
    $('.js_suggestions').css({"display":"none"});

    // Clear the canvas.
    $("paper-fab[icon='delete']").trigger("click");

    // Show the counting result
    $(".js_showCount").css("display","initial");

    // Get and show the selected value and show
    var indexP = parseInt($( "input:checked" ).attr("indexP"));
    $(".score").append( "<li>#" + shapeQty + " —— " + indexP + "p</li>" )

    // 若選擇的項目!=推薦的第一項，則重新產生element取代
    if( indexP != 5 && selectedType != "Custom pop view" ){
      // remove the old element
      $("[xkID='"+ currentID +"']").remove();

      // add a new selected element
      var elementType = $( "input:checked" ).val();

      switch (elementType) {
          case 'Image':
            addImage();
            break;
          case 'Button':
            addButton();
            break;
          case 'Shape':
            addShape();
            break;
          case 'TextView':
            addTextView();
            break;
          case 'TextField':
            addTextField();
            break;
          case 'Text':
            addText();
            break;
          case 'Line':
            addLine();
            break;

        default:

      }
      function addImage(){
        $(".identification").append("<img src='https://goo.gl/hSqM8y' xkID='"+ currentID + "' style='width:"+ rectW +"px;height:" + rectH +"px;left:"+pointsX[0]+"px;top:"+pointsY[0] + "px;'>");
      }
      function addButton(){
        if( shapeName == 'rectangle' && rectH >= 23  ){

          $(".identification").append("<button type='button' xkID='"+ currentID + "' style='width:"+ rectW +"px;height:" + rectH + "px;left:" + pointsX[0] + "px;top:" + pointsY[0] + "px;'>button</button>");
        }else if( shapeName == 'rectangle' && rectH < 23){
          $(".identification").append("<button type='button' xkID='"+ currentID + "' style='width:"+ rectW +"px;height: 23px;left:" + pointsX[0] + "px;top:" + pointsY[0] + "px;'>button</button>");
        }else{
          $(".identification").append("<button type='button' xkID='"+ currentID + "' style='width:"+ lineW +"px;left:" + pointsX[0] + "px;top:" + pointsY[0] + "px;'>button</button>");
        }
      }
      function addShape(){
        $(".identification").append("<div xkID='"+ currentID + "' style='width:"+ rectW +"px;height:" + rectH +"px;left:"+pointsX[0]+"px;top:"+pointsY[0] + "px; background-color:#ccc;'>");
      }
      function addTextView(){
        $(".identification").append("<div xkID='"+ currentID + "' style='width:"+ rectW +"px;height:" + rectH +"px;left:"+pointsX[0]+"px;top:"+pointsY[0] +"px; overflow:hidden;'>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.</div>");
      }
      function addTextField(){
        // 判斷高度以區別是否為多行。一行的高度單位為20px
        if(rectH <= 40){
          $(".identification").append("<input type='text' xkID='" + currentID + "' style='width:"+ rectW +"px;height:" + rectH + "px;left:" + pointsX[0]+"px;top:"+pointsY[0] +"px; border:1px solid lightgrey;' placeholder='Type somthing...'>");
        }else {
          var rows = Math.round(rectH/20) ;
          console.log("rows = " + rows);
          $(".identification").append("<textarea type='text' xkID='" + currentID + "' style='width:"+ rectW +"px;height:" + rectH + "px;left:" + pointsX[0]+"px;top:"+pointsY[0] +"px; border:1px solid lightgrey;' placeholder='Type somthing...'></textarea>");
        }
      }
      function addText(){
        $(".identification").append("<span xkID='"+ currentID + "' style='width:"+lineW +"px;left:"+pointsX[0]+"px;top:"+pointsY[0] +"px;text-overflow:ellipsis; white-space: nowrap; overflow:hidden; font-size:20px; ;'>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.</span>");
      }
      function addLine(){
        $(".identification").append("<hr xkID='" + currentID + "' style='width:"+ lineW +"px;height:" + lineH + "px;left:" + pointsX[0]+"px;top:"+pointsY[0] +"px; background-color:lightgrey; margin:0px; padding:0px;'>");

      }

    }else if (indexP != 5 && selectedType == "Custom pop view") {
      // remove the old element
      $("[xkID='"+ currentID +"']").remove();

      // add a new selected element
      var elementType = $( "input:checked" ).val();

      switch (elementType) {
          case 'Image':
            addImage();
            break;
          case 'Button':
            addButton();
            break;
          case 'Shape':
            addShape();
            break;
          case 'TextView':
            addTextView();
            break;
          case 'TextField':
            addTextField();
            break;
          case 'Text':
            addText();
            break;
          case 'Line':
            addLine();
            break;

        default:

      }
      function addImage(){
        $("#pop-customPopView").append("<img src='https://goo.gl/hSqM8y' xkID='"+ currentID + "' style='width:"+ rectW +"px;height:" + rectH +"px;left:"+ xShift +"px;top:"+ yShift + "px; position:absolute; '>");
      }
      function addButton(){
        if( shapeName == 'rectangle' && rectH >= 23  ){
          $("#pop-customPopView").append("<button type='button' xkID='"+ currentID + "' style='width:"+ rectW +"px;height:" + rectH + "px;left:"+ xShift +"px;top:"+ yShift + "px;'>button</button>");
        }else if( shapeName == 'rectangle' && rectH < 23){
          $("#pop-customPopView").append("<button type='button' xkID='"+ currentID + "' style='width:"+ rectW +"px;height: 23px;left:"+ xShift +"px;top:"+ yShift + "px; position:absolute;'>button</button>");
        }else{
          $("#pop-customPopView").append("<button type='button' xkID='"+ currentID + "' style='width:"+ lineW +"px;left:"+ xShift +"px;top:"+ yShift + "px; position:absolute;'>button</button>");
        }
      }
      function addShape(){
        $("#pop-customPopView").append("<div xkID='"+ currentID + "' style='width:"+ rectW +"px;height:" + rectH +"px;left:"+ xShift +"px;top:"+ yShift + "px; position:absolute; background-color:#ccc;'>");
      }
      function addTextView(){
        $("#pop-customPopView").append("<div xkID='"+ currentID + "' style='width:"+ rectW +"px;height:" + rectH +"px;left:"+ xShift +"px;top:"+ yShift + "px; position:absolute;overflow:hidden;'>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.</div>");
      }
      function addTextField(){
        // 判斷高度以區別是否為多行。一行的高度單位為20px
        if(rectH <= 40){
          $("#pop-customPopView").append("<input type='text' xkID='" + currentID + "' style='width:"+ rectW +"px;height:" + rectH + "px;left:"+ xShift +"px;top:"+ yShift + "px; position:absolute; border:1px solid lightgrey;' placeholder='Type somthing...'>");
        }else {
          var rows = Math.round(rectH/20) ;
          console.log("rows = " + rows);
          $("#pop-customPopView").append("<textarea type='text' xkID='" + currentID + "' style='width:"+ rectW +"px;height:" + rectH + "px;left:"+ xShift +"px;top:"+ yShift + "px; position:absolute; border:1px solid lightgrey;' placeholder='Type somthing...'></textarea>");
        }
      }
      function addText(){
        $("#pop-customPopView").append("<span xkID='"+ currentID + "' style='width:"+lineW +"px;left:"+ xShift +"px;top:"+ yShift + "px; position:absolute; text-overflow:ellipsis; white-space: nowrap; overflow:hidden; font-size:20px; ;'>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.</span>");
      }
      function addLine(){
        $("#pop-customPopView").append("<hr xkID='" + currentID + "' style='width:"+ lineW +"px;height:" + lineH + "px;left:"+ xShift +"px;top:"+ yShift + "px; position:absolute; background-color:lightgrey; margin:0px; padding:0px;'>");
      }
    }else {

    }

    //Add a identification label to the shape===================================
    // idtagX = pointsX[0];
    // idtagY = pointsY[0] - idPadding*2 -12;
    // $(".identification").append("<span style='left:" + idtagX + "px;top:"+ idtagY +"px;'>" + $( "input:checked" ).val() + "</span>");
    // idtagX = 0;
    // idtagY = 0;

    // Clear checked attr
    $("input:checked").prop( "checked", false );

    // Count points
    correctness += indexP ;
    $(".js_correctness").text(correctness);
    $(".js_totalScore").text(shapeQty*5);
    var percentage = Math.floor(correctness /(shapeQty*5)*100) ;
    $(".js_percentage").text(percentage + "%");

});


// Popup =======================================================================

$(document).on("click",".js_funcPop",function(){
  // Open popup view Down the true elements layer of basic & up the myScript canvas.
  $("div.popup").css({"display" : "initial"});

  // Down the true elements layer of basic & up the myScript canvas.
  // The z-index of layers: 1.toolbar > 2.myScript camvas > 3.popup view > 4.mask > 5.basic elements

});
