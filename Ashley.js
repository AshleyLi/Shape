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
var xkID, currentID = 0;

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

var undoString = ""; // 紀錄undo時要執行的：eventType類型、target目標、action動作、task執行項目

var arrData =[]; // User behavior storage




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
    if(undoString.length != 0){
      $(".js_undo").css("color","#4CB7AD");
    }
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
          arrData.push(timeIndex()+"ErrorStroke:"+"Talbe");
          clearCanvas();
        }
    }else{
      shapeName = responseObject.result.segments[0].candidates[0].label;
    }


    $(".js_shapeName").text(shapeName);
    $(".js_ShapeQty").text(Math.round(shapeQty));




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
        arrData.push(timeIndex()+"ErrorStroke:"+ shapeName);
        removeWrongShape();
      }
      // Show shape information ====================================================================
      $(".js_pointsX").text(pointsX);
      $(".js_pointsY").text(pointsY);

    }
    // Recognizing the shape====================================================
    getShapeInfo();


    // 判斷筆畫是否繪製於 talbeview or popover，皆否則為一般圖形
    if(tableviewMode == true &&
      pointsY[0] > tablePos.top &&
      pointsY[0] < tablePos.top + $("#tableview").height() &&
      pointsX[0] > tablePos.left  &&
      pointsX[0] < tablePos.left + $("#tableview").width()
    ){
      // && tableY[0] < pointsY[0] && pointsY[0] < (tableY[0] + MCScreenH)
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
        arrData.push(timeIndex()+"CreateElement:"+"Talbeview twice." );
      }
      $("#tableview").clone().appendTo(".tableContainer").attr("xkID",currentID ).removeAttr("id");
      arrData.push(timeIndex()+"CreateElement:"+"Talbeview" );
      undoString = "$('[xkID="+ currentID +"]').remove();";
      currentID++;
    }
    // drawing a rect on a cell.
    function ACellRectangle(){
      if (pointsX[0] < cellMidline) {
        // console.log("列表 左側的矩形");
        if( $(".icon.icon-f7").length == 0 ){
          $(".js_tableUl > .item-content").prepend("<div class='item-media'><i class='icon icon-f7'></i></div>");
          undoString = "$('.js_tableUl > .item-content > .item-media').remove();";
          arrData.push(timeIndex()+"CreateElement:"+"img@table-left" );
        }
        arrData.push(timeIndex()+"ErrorStroke:"+ "existed@table-left");
        clearCanvas();
      } else {
        // console.log("列表 右側的矩形"); = 加上「 > 」
        $(".item-content").addClass("item-link");
        arrData.push(timeIndex()+"CreateElement:"+"@table-right(arrow)" );
        undoString = "$('item-content').removeClass('item-link');";

      }
      clearCanvas();
      arrData.push(timeIndex()+"ErrorStroke:"+ shapeName+ "@table" );
    }
    function ACellLine(){
      currentID++;

      // 線段＠列表左側 及 右側
      if (pointsX[0]+(pointsX[1]-pointsX[0])/2 <= cellMidline) {
        // console.log("列表 左側的線段");
        if( $(".item-title").is(':empty') && $(".subforCell").length == 0 ){
          $(".js_tableUl > .item-content > .item-inner > .item-title").append("Item title");
          undoString = "$('.js_tableUl > .item-content > .item-inner > .item-title').empty();"; // (((undo)))
          arrData.push(timeIndex()+"CreateElement:"+"Item title@table-left" );

        }else if( $(".item-title").length > 0 && $(".subforCell").length == 0){
          $(".js_tableUl > .item-content > .item-inner > .item-title").append("<div class='subforCell' xkID='"+currentID+"'>subtitle</div>");
          undoString = "$('[xkID="+ currentID +"]').remove();"; // (((undo)))
          arrData.push(timeIndex()+"CreateElement:"+"subtitle@table-left" );
        }else{
          alert("已存在元件故無法新增。");
          arrData.push(timeIndex()+"ErrorStroke:"+ "existed@table-left");
        }
        clearCanvas();
        arrData.push(timeIndex()+"ErrorStroke:"+shapeName+"@table-left");
      } else {
        // 確認左側尚無元件存在
        if( $(".item-after").is(':empty')){
          // 於表格中增加左側元件
          $(".js_tableUl > .item-content > .item-inner").append("<div class='item-after' xkID='"+currentID+"'>Label</div>");
          undoString = "$('[xkID="+ currentID +"]').remove();"; // (((undo)))
          arrData.push(timeIndex()+"CreateElement:"+"Label@table-right" );
          // 開啟建議元件列表
          $(".cell").css({
            "display":"block",
            "left": tablePos.left + MCScreenW - 5 +"px",
            "top": tablePos.top
          });
          // 依據有無使用 subforCell 關閉建議元件列表中的 控制項類別元件(cell_left_controller)
          if($(".subforCell").is(':empty')){
            $(".cell_left_controller").show();
            undoString = "$('.cell_left_controller').hide();"; // (((undo)))
            arrData.push(timeIndex()+"CreateElement:"+"leftController@table-right" );
          }

        }else {
          alert("已存在元件故無法新增。");
          arrData.push(timeIndex()+"ErrorStroke:"+ "existed@table-right");
        }
        clearCanvas();
        arrData.push(timeIndex()+"ErrorStroke:"+shapeName +"@table");
      }
    }

    // Show regular suggestion =================================================
    // Rect ------<)))))
    function ARectangle() {
      currentID++;
      undoString = "$('[xkID="+ currentID +"]').remove();"; // (((undo)))
      checkedElement(".popover-title");
      if(rectW >= rectH){
        if(rectH > unitH){
          // add an image & set a current elementID
          $(".identification").append("<img src='/img/img_default.jpg' xkID='"+ currentID + "' style='width:"+ rectW +"px;height:" + rectH +"px;left:"+pointsX[0]+"px;top:"+pointsY[0] + "px;'>");
          arrData.push(timeIndex()+"CreateElement:"+"img["+currentID +"]@canvas" );
          $(".js_wildRectB").css({"display" : "initial"});
          checkedElement(".js_wildRectB");
        } else {
          // add a button & set a current elementID
          $(".identification").append("<button type='button' xkID='"+ currentID + "' style='width:"+ rectW +"px;height:" + rectH + "px;left:" + pointsX[0] + "px;top:" + pointsY[0] + "px;'>按鈕</button>");
          arrData.push(timeIndex()+"CreateElement:"+"button["+currentID +"]@canvas" );
          $('.js_wildRectS').css({"display" : "block"});
          checkedElement(".js_wildRectS");
        }
      }else {
        if(rectH > unitH){
          // add an image & set a current elementID
          $(".identification").append("<img src='/img/img_default.jpg' xkID='"+ currentID + "' style='width:"+ rectW +"px;height:" + rectH +"px;left:"+pointsX[0]+"px;top:"+pointsY[0] + "px;'>");
          arrData.push(timeIndex()+"CreateElement:"+"img["+currentID +"]@canvas" );
          $('.js_tallRectB').css({"display" : "block"});
          checkedElement(".js_tallRectB");
        } else {
          // add an image & set a current elementID
          $(".identification").append("<img src='/img/img_default.jpg' xkID='"+ currentID + "' style='width:"+ rectW +"px;height:" + rectH +"px;left:"+pointsX[0]+"px;top:"+pointsY[0] + "px;'>");
          arrData.push(timeIndex()+"CreateElement:"+"img["+currentID +"]@canvas" );
          $('.js_tallRectS').css({"display" : "block"});
          checkedElement(".js_tallRectS");
        }
      }

      // reture & set suggestions pop positionX,Y
      popSuggestionsX = pointsX[1] + 10
      popSuggestionsY = pointsY[1] - rectH/2 - $(".js_suggestions.regular").height()/2  ;

      $('.js_suggestions.regular').css({
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
    // Line ------<)))))
    function ALine() {
      currentID++;
      undoString = "$('[xkID="+ currentID +"]').remove();";// (((undo)))
      // Create the first component & set undo event
      $(".identification").append("<span xkID='"+ currentID+"' style='width:"+lineW +"px;left:"+pointsX[0]+"px;top:"+(pointsY[0]-10) +"px; text-overflow:ellipsis; white-space: nowrap; overflow:hidden; font-size:20px; ;'>今明兩天天氣不穩定，有局部較大雨勢發生的機率；今日鋒面接近，臺灣中部以北地區及澎湖、金門、馬祖有短暫陣雨或雷雨，東半部地區亦有局部短暫陣雨，南部地區為短暫陣雨後多雲；明日鋒面通過及大陸冷氣團南下，各地氣溫下降；臺灣北部、東北部地區及金門、馬祖有陣雨或雷雨，中部、東部、東南部地區及澎湖有短暫陣雨，其他地區亦有局部短暫陣雨。今明兩天金門、馬祖易有局部霧或低雲影響能見度，請注意。</span>");
      arrData.push(timeIndex()+"CreateElement:"+"span["+currentID +"]@canvas" );
      // 若線段長度 < screen/3 則字體設定為12px
      if(pointsX[1]- pointsX[0] < MCScreenW/3){
        $("[xkID='"+currentID+"']").css({
          "font-size":"12px",
          "text-overflow":"",
          "white-space":" nowrap"
        });
      }

      // open & set suggestions pop positionX,Y
      $('.js_line').css({"display" : "initial"});
      checkedElement(".js_line");
      $(".js_suggestions.regular").css({"display":"initial","left": pointsX[1]+10 + "px","top": pointsY[0] + shift -$(".js_suggestions.regular").height()/2 + "px"});
    }

    // Draw popview elements  ==================================================
    // Custom Pop modul ------<)))))
    function popCustomPopview(){
      currentID++;

      var popCustomPopView = $("#pop-customPopView").position(); // pop 視窗的位置
      var popviewElement = $(".popview").position(); // pop mask 的位置

      xShift = pointsX[0] - popviewElement.left - popCustomPopView.left ;
      yShift = pointsY[0] - popviewElement.top - popCustomPopView.top ;
      $("#pop-customPopView").css("display", "block");

      // 辨識筆畫 矩形 or 線段
      if(shapeName == "rectangle" || shapeName == "square"){
        if(rectW >= rectH){
          if(rectH > unitH){
            // add an image & set a current elementID
            $("#pop-customPopView").append("<img src='/img/img_default.jpg' xkID='"+ currentID + "' style='width:"+ rectW +"px;height:" + rectH +"px;left:"+ xShift +"px;top:"+ yShift+ "px;position:absolute;'>");
            arrData.push(timeIndex()+"CreateElement:"+"img["+currentID +"]by "+shapeName+"@CustomPopview" );
            $(".js_wildRectB").css({"display" : "initial"});
          } else {
            // add a button & set a current elementID
            $("#pop-customPopView").append("<button type='button' xkID='"+ currentID + "' style='width:"+ rectW +"px;height:" + rectH + "px;left:" + xShift + "px;top:" + yShift + "px;position:absolute;'>button</button>");
            arrData.push(timeIndex()+"CreateElement:"+"button["+currentID +"]by "+shapeName+"@CustomPopview" );
            $('.js_wildRectS').css({"display" : "block"});
          }
        }else {
          if(rectH > unitH){
            // add an image & set a current elementID
            $("#pop-customPopView").append("<img src='/img/img_default.jpg' xkID='"+ currentID + "' style='width:"+ rectW +"px;height:" + rectH +"px;left:"+ xShift +"px;top:"+ yShift + "px;position:absolute;'>");

            $('.js_tallRectB').css({"display" : "block"});
          } else {
            // add an image & set a current elementID
            $("#pop-customPopView").append("<img src='/img/img_default.jpg' xkID='"+ currentID + "' style='width:"+ rectW +"px;height:" + rectH +"px;left:"+ xShift +"px;top:"+ yShift + "px;position:absolute;'>");
            $('.js_tallRectS').css({"display" : "block"});
          }
          arrData.push(timeIndex()+"CreateElement:"+"img["+currentID +"]by "+shapeName+"@CustomPopview" );
        }

        // reture & set suggestions pop positionX,Y
        popSuggestionsX = pointsX[1] + 10
        popSuggestionsY = pointsY[1] - rectH/2 - $(".js_suggestions.regular").height()/2  ;

        $('.js_suggestions.regular').css({
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
        arrData.push(timeIndex()+"CreateElement:"+"span["+currentID +"]@CustomPopview" );
        // // add the first suggeted conponent.
        // $("#pop-customPopView").append("<span xkID='"+ currentID + "' style='width:"+lineW +"px;left:"+ xShift +"px;top:"+ yShift  +"px;position:absolute;height:23px; text-overflow:ellipsis; white-space: nowrap; overflow:hidden; font-size:20px; ;'>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.</span>");
        // arrData.push(timeIndex()+"CreateElement:"+"span["+currentID +"]@CustomPopview" );
        // open & set suggestions pop positionX,Y
        $('.js_line').css({"display" : "initial"});
        $(".js_suggestions.regular").css({"display":"initial","left": pointsX[1]+10 + "px","top": pointsY[0] + shift -$(".js_suggestions.regular").height()/2 + "px"});

      }
      undoString = "$('[xkID="+ currentID +"]').remove();";// (((undo)))
      // the end of function popCustomPopview
    }
    // Action sheet ----------<)))))
    function popActionSheet(){
      currentID++;
      $("div#pop-actionSheet").css("display", "block");
      var popElement = $(".popview").position();
      var modalGroup = $("#pop-actionSheet > .actions-modal").position();

      if ( pointsY[0] > popElement.top && pointsY[0] < popElement.top + modalGroup.top ) {
        // ＝ Outside. 筆畫落於 ActionSheet 之外
        // 的矩形
        if(shapeName == "rectangle" || shapeName == "square"){
          if(ASTitle == true){
            // 已存在action sheet toolbar 則
            $(".actions-modal-label").after("<div class='actions-modal-button' xkID='"+ currentID + "'>Button</div>");
          }else{
            $("#pop-actionSheet .actions-modal-group:first-child .actions-modal-button:first-child").before("<div class='actions-modal-button' xkID='"+ currentID + "' >Button</div>");
          }
          arrData.push(timeIndex()+"CreateElement:"+"Button["+currentID +"]by "+shapeName+"@ActionSheet-Outside" );
        }else if (shapeName == "line") {
          //筆畫落於 ActionSheet 之外的線段
          if(ASTitle == false){
            ASTitle = true;
            $(".actions-modal-group:first-child").prepend("<div class='actions-modal-label' xkID='"+ currentID + "'>Do something</div>");
            arrData.push(timeIndex()+"CreateElement:"+"title["+currentID +"]by"+shapeName+"@ActionSheet-Outside" );
          }else {
            // title 已存在則只能新增 button
            $(".actions-modal-label").after("<div class='actions-modal-button' xkID='"+ currentID + "'>Button</div>");
            arrData.push(timeIndex()+"CreateElement:"+"Button["+currentID +"]by "+shapeName+"@ActionSheet-Outside" );
          }
        }
      } else if (pointsY[0] > popElement.top + modalGroup.top  && pointsY[0] < popElement.top + $(".popview").height() ) {
        // ＝ Inside.
        if(shapeName == "rectangle" || shapeName == "square" || shapeName == "line"){
          $(".actions-modal-group:first-child").append("<div class='actions-modal-button' xkID='"+ currentID + "'>Button</div>");
          arrData.push(timeIndex()+"CreateElement:"+"Button["+currentID +"]by "+shapeName+"@ActionSheet-Inside" );
        }else {
          // Nothing happened.
          arrData.push(timeIndex()+"ErrorStroke:"+shapeName+"@ActionSheet-Inside" );
        }
      } else {
        // Nothing happened.
        arrData.push(timeIndex()+"ErrorStroke:"+shapeName+"@ActionSheet" );
      }
      undoString = "$('[xkID="+ currentID +"]').remove();";// (((undo)))
      clearCanvas();
      arrData.push(timeIndex()+"ErrorStroke:"+shapeName+"@ActionSheet" );

    }
    // Alert -----------------<)))))
    function popAlert(){
      currentID++;
      var popElement = $("#pop-alert").position();
      var middleLine = $(".modal-buttons").position();
      // 1.Sperate main areas
      if( pointsY[0] >= popviewCanvas.top + popElement.top + middleLine.top){
        // Bottom area ==========================
        var bottomPopElement = popviewCanvas.top + popElement.top + $("#pop-alert").height();

        if (pointsY[0] >= bottomPopElement ){
          // 筆畫在.modal-buttons之下方
          $("#pop-alert").append("<div class='modal-buttons' xkID='"+ currentID + "'><span class='modal-button'>Button</span></div>");
          arrData.push(timeIndex()+"CreateElement:"+"Button["+currentID +"]by "+shapeName+"@Alert-down" );
        }else {
          // 筆畫在.modal-buttons之中
          var buttonQty = $(".modal-buttons > .modal-button").length;
          if( buttonQty == 1){
            // 只有一個btn則在其旁增加btn
            $(".modal-buttons").append("<span class='modal-button' xkID='"+ currentID + "'>Button</span>");
            arrData.push(timeIndex()+"CreateElement:"+"Button==2inRoll["+currentID +"]by "+shapeName+"@Alert-Inside" );
            console.log("在左邊新增");
          }else if (buttonQty == 2) {
            // 大於二則“改為”成垂直排列
            $(".modal-buttons").remove();
            for( i=0 ; i < buttonQty+1 ; i++ ){
              $("#pop-alert").append("<div class='modal-buttons' xkID='"+ currentID + "'><span class='modal-button'>Button</span></div>");
            }
            arrData.push(timeIndex()+"CreateElement:"+"Button==3in3Roll[xkID="+currentID +"]by "+shapeName+"@Alert-Inside" );
          }else {
            // 大於三直接垂直增加
            $("#pop-alert").append("<div class='modal-buttons' xkID='"+ currentID + "'><span class='modal-button'>Button</span></div>");
            arrData.push(timeIndex()+"CreateElement:"+"Button==NinNRoll["+currentID +"]by "+shapeName+"@Alert-Inside" );
          }
        }
        undoString = "$('[xkID="+ currentID +"]').remove();";// (((undo)))
      }else {
        // Top area ==========================
        if(shapeName == "line"){
          // Opne the modal sub title
          $(".modal-text").css("display","initial");
          arrData.push(timeIndex()+"CreateElement:"+"describtion[xkID="+currentID +"]by "+shapeName+"@Alert-top" );
          undoString = "$('.modal-text').hide();";// (((undo)))
        }else if (shapeName == "rectangle" || shapeName == "square" ){
          // Opne the modal text input
          $(".modal-text-input").css("display","initial");
          arrData.push(timeIndex()+"CreateElement:"+"TextField[xkID="+currentID +"]by "+shapeName+"@Alert-top" );
          undoString = "$('.modal-text-input').hide();";// (((undo)))
        }else{
          console.log("No shape.");
          arrData.push(timeIndex()+"ErrorStroke:"+shapeName+"@Alert-top" );
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
    // Picker ----------------<)))))
    function popPicker(){
      currentID++;
      var popviewElement = $(".popview").position(); // pop mask 的位置
      var pickerPos = $(".picker-modal").position();
      var midline = $(".popview").position().top + $(".picker-modal").position().top;
      $("#pop-picker").css("display", "block");

      if(pointsY[0] < midline){
        // console.log("Higher.");
        if(shapeName == "rectangle" || shapeName == "square" || shapeName == "line" && $("picker-modal .toolbar").length == 0){
          $(".picker-modal").prepend("<div class='toolbar' xkID='"+ currentID + "'><div class='toolbar-inner'><div class='left'><a href='# class='link toolbar-randomize-link'>text</a></div><div class='right'><a href='# class='link close-picker'>text</a></div></div></div>");
          undoString = "$('[xkID="+ currentID +"]').remove();";// (((undo)))
          arrData.push(timeIndex()+"CreateElement:"+"toolbar[xkID="+currentID +"]by "+shapeName+"@Picker-top" );
          clearCanvas();
        }else {
          clearCanvas();
          arrData.push(timeIndex()+"ErrorStroke:"+shapeName+"@Picker-top" );
        }
      }else if (pointsY[0] >= midline && pointsY[0] < midline +$(".picker-modal").height() ){
        // console.log("Inside." );
        var mid_v_w = $(".popview").position().left + $(".picker-modal").width()/2; // picker中心點
        var mid_pointsY = pointsX[0]+(pointsX[1]-pointsX[0])/2; //線段中心點
        // 判斷線段的中心點偏左或右
        if( mid_pointsY <= mid_v_w && $(".js_leftPickerCol").length == 0 ){
          // console.log("Inside and left." );
          $(".js_pickerBase").before("<div xkID='"+ currentID + "' class='picker-items-col picker-items-col-absolute js_leftPickerCol' style='width: 44px; '><div class='picker-items-col-wrapper' style='transform: translate3d(0px, 90px, 0px); transition-duration: 0ms;'><div class='picker-item picker-selected' data-picker-value='Mr' style='transition-duration: 0ms; transform: translate3d(0px, 0px, 0px) rotateX(0deg);'>Mr</div><div class='picker-item' data-picker-value='Ms' style='transition-duration: 0ms; transform: translate3d(0px, 0px, 0px) rotateX(-18deg);'>Ms</div></div></div>");
          undoString = "$('[xkID="+ currentID +"]').remove();";// (((undo)))
          arrData.push(timeIndex()+"CreateElement:"+"picker-items[xkID="+currentID +"]by "+shapeName+"@Picker-Inside-Left" );
        }else if( mid_pointsY > mid_v_w && $(".js_rightPickerCol").length == 0){
          // console.log("Inside and right." );
          $(".js_pickerBase").after("<div xkID='"+ currentID + "' class='picker-items-col picker-items-col-absolute js_rightPickerCol' style='width: 82px;'><div class='picker-items-col-wrapper' style='transform: translate3d(0px, -18px, 0px); transition-duration: 0ms;'><div class='picker-item' data-picker-value='Man' style='transform: translate3d(0px, 108px, 0px) rotateX(54deg); transition-duration: 0ms;'>Man</div> <div class='picker-item' data-picker-value='Luthor' style='transform: translate3d(0px, 108px, 0px) rotateX(36deg); transition-duration: 0ms;'>Luthor</div><div class='picker-item' data-picker-value='Woman' style='transform: translate3d(0px, 108px, 0px) rotateX(18deg); transition-duration: 0ms;'>Woman</div><div class='picker-item picker-selected' data-picker-value='Boy' style='transition-duration: 0ms; transform: translate3d(0px, 108px, 0px) rotateX(0deg);'>Boy</div><div class='picker-item' data-picker-value='Girl' style='transform: translate3d(0px, 108px, 0px) rotateX(-18deg); transition-duration: 0ms;'>Girl</div><div class='picker-item' data-picker-value='Person' style='transform: translate3d(0px, 108px, 0px) rotateX(-36deg); transition-duration: 0ms;'>Person</div><div class='picker-item' data-picker-value='Cutie' style='transform: translate3d(0px, 108px, 0px) rotateX(-54deg); transition-duration: 0ms;'>Cutie</div><div class='picker-item' data-picker-value='Babe' style='transform: translate3d(0px, 108px, 0px) rotateX(-72deg); transition-duration: 0ms;'>Babe</div><div class='picker-item' data-picker-value='Raccoon' style='transform: translate3d(0px, 108px, 0px) rotateX(-90deg); transition-duration: 0ms;'>Raccoon</div></div></div>");
          arrData.push(timeIndex()+"CreateElement:"+"picker-items[xkID="+currentID +"]by "+shapeName+"@Picker-Inside-Right" );
          undoString = "$('[xkID="+ currentID +"]').remove();";// (((undo)))
        }
      }else {
        console.log("Lower or nothing happened." );
        arrData.push(timeIndex()+"ErrorStroke:"+shapeName+"@Picker-Down" );
      }
      clearCanvas();
    }
    // end of popview

  },
  requestCallback : function (requestObject){
    console.log(requestObject)
  }
}

// UNDO ========================================================================
$(document).on("click",".js_undo",function(){
  $(".js_undo").css("color","");
  eval(undoString);
  arrData.push(timeIndex()+"Undo:"+undoString);
  undoString = "" ;
});

// AFTER CONFIRM ===============================================================
$(document).on("click",".js_confirmType",function(){
    // Close suggestions pop
    $('.popover-content > div').css({"display" : "none"});
    $('.js_suggestions.regular').css({"display":"none"});
    // Clear the stroke canvas.
    $("paper-fab[icon='delete']").trigger("click");
    // Show the indexP result display
    $(".js_showCount").css("display","initial");

    // Show the indexP result
    var indexP = parseInt($( "input:checked" ).attr("indexP"));
    $(".score").append( "<li>#" + shapeQty + " —— " + indexP + "p</li>" )

    // 若選擇的項目!=推薦的第一項 && 非pop mode下的Custom pop view狀態，則重新產生element取代
    if( indexP != 5 && selectedType != "Custom pop view" ){

      // remove the old element
      $("[xkID='"+ currentID +"']").remove();
      // add a new selected element
      var elementType = $( "input:checked" ).val();
      switch (elementType) {
          case 'Image':
            $(".identification").append("<img src='/img/img_default.jpg' xkID='"+ currentID + "' style='width:"+ rectW +"px;height:" + rectH +"px;left:"+pointsX[0]+"px;top:"+pointsY[0] + "px;'>");
            arrData.push(timeIndex()+"ChangeElement:"+"img[xkID="+currentID +"][indexP="+indexP+"]@canvas" );
            break;
          case 'Button':
            if( shapeName == 'rectangle' && rectH >= 23  ){
              $(".identification").append("<button type='button' xkID='"+ currentID + "' style='width:"+ rectW +"px;height:" + rectH + "px;left:" + pointsX[0] + "px;top:" + pointsY[0] + "px;'>按鈕</button>");
            }else if( shapeName == 'rectangle' && rectH < 23){
              $(".identification").append("<button type='button' xkID='"+ currentID + "' style='width:"+ rectW +"px;height: 23px;left:" + pointsX[0] + "px;top:" + pointsY[0] + "px;'>按鈕</button>");
            }else{
              $(".identification").append("<button type='button' xkID='"+ currentID + "' style='width:"+ lineW +"px;left:" + pointsX[0] + "px;top:" + pointsY[0] + "px;'>按鈕</button>");
            }
            arrData.push(timeIndex()+"ChangeElement:"+"button[xkID="+currentID +"][indexP="+indexP+"]@canvas" );
            break;
          case 'Shape':
            $(".identification").append("<div xkID='"+ currentID + "' style='width:"+ rectW +"px;height:" + rectH +"px;left:"+pointsX[0]+"px;top:"+pointsY[0] + "px; background-color:#eee;'>");
            arrData.push(timeIndex()+"ChangeElement:"+"shape[xkID="+currentID +"][indexP="+indexP+"]@canvas" );
            break;
          case 'TextView':
            $(".identification").append("<div xkID='"+ currentID + "' style='width:"+ rectW +"px;height:" + rectH +"px;left:"+pointsX[0]+"px;top:"+pointsY[0] +"px; overflow:hidden;'>今明兩天天氣不穩定，有局部較大雨勢發生的機率；今日鋒面接近，臺灣中部以北地區及澎湖、金門、馬祖有短暫陣雨或雷雨，東半部地區亦有局部短暫陣雨，南部地區為短暫陣雨後多雲；明日鋒面通過及大陸冷氣團南下，各地氣溫下降；臺灣北部、東北部地區及金門、馬祖有陣雨或雷雨，中部、東部、東南部地區及澎湖有短暫陣雨，其他地區亦有局部短暫陣雨。今明兩天金門、馬祖易有局部霧或低雲影響能見度，請注意。</div>");
            arrData.push(timeIndex()+"ChangeElement:"+"TextView[xkID="+currentID +"][indexP="+indexP+"]@canvas" );
            break;
          case 'TextField':
            // 判斷高度以區別是否為多行。一行的高度單位為20px
            if(rectH <= 40){
              $(".identification").append("<input type='text' xkID='" + currentID + "' style='width:"+ rectW +"px;height:" + rectH + "px;left:" + pointsX[0]+"px;top:"+pointsY[0] +"px; border:1px solid lightgrey;' placeholder='請輸入文字...'>");
              arrData.push(timeIndex()+"ChangeElement:"+"TextField.singleLine[xkID="+currentID +"][indexP="+indexP+"]@canvas" );
            }else {
              var rows = Math.round(rectH/20) ;
              $(".identification").append("<textarea type='text' xkID='" + currentID + "' style='width:"+ rectW +"px;height:" + rectH + "px;left:" + pointsX[0]+"px;top:"+pointsY[0] +"px; border:1px solid lightgrey;' placeholder='請輸入文字...'></textarea>");
              arrData.push(timeIndex()+"ChangeElement:"+"TextField.multLine[xkID="+currentID +"][indexP="+indexP+"]@canvas" );
            }
            break;
          case 'Text':
            $(".identification").append("<span xkID='"+ currentID + "' style='width:"+lineW +"px;left:"+pointsX[0]+"px;top:"+pointsY[0]-10 +"px;text-overflow:ellipsis; white-space: nowrap; overflow:hidden; font-size:20px; ;'>今明兩天天氣不穩定，有局部較大雨勢發生的機率；今日鋒面接近，臺灣中部以北地區及澎湖、金門、馬祖有短暫陣雨或雷雨，東半部地區亦有局部短暫陣雨，南部地區為短暫陣雨後多雲；明日鋒面通過及大陸冷氣團南下，各地氣溫下降；臺灣北部、東北部地區及金門、馬祖有陣雨或雷雨，中部、東部、東南部地區及澎湖有短暫陣雨，其他地區亦有局部短暫陣雨。今明兩天金門、馬祖易有局部霧或低雲影響能見度，請注意。");
            arrData.push(timeIndex()+"ChangeElement:"+"Text[xkID="+currentID +"][indexP="+indexP+"]@canvas" );
            break;
          case 'Line':
            $(".identification").append("<hr xkID='" + currentID + "' style='width:"+ lineW +"px;height:" + lineH + "px;left:" + pointsX[0]+"px;top:"+pointsY[0] +"px; background-color:lightgrey; margin:0px; padding:0px;'>");
            arrData.push(timeIndex()+"ChangeElement:"+"Line[xkID="+currentID +"][indexP="+indexP+"]@canvas" );
            break;

        default:
      }
    // 若選擇的項目!=推薦的第一項 && 且為pop mode的Custom pop view狀態下，則重新產生具備新x,y position element取代
    }else if (indexP != 5 && selectedType == "Custom pop view") {

      // remove the old element
      $("[xkID='"+ currentID +"']").remove();
      // add a new selected element
      var elementType = $( "input:checked" ).val();
      switch (elementType) {
          case 'Image':
          $("#pop-customPopView").append("<img src='/img/img_default.jpg' xkID='"+ currentID + "' style='width:"+ rectW +"px;height:" + rectH +"px;left:"+ xShift +"px;top:"+ yShift + "px; position:absolute; '>");
            arrData.push(timeIndex()+"ChangeElement:"+"Line[xkID="+currentID +"][indexP="+indexP+"]@CustomPopView" );
            break;
          case 'Button':
            if( shapeName == 'rectangle' && rectH >= 23  ){
              $("#pop-customPopView").append("<button type='button' xkID='"+ currentID + "' style='width:"+ rectW +"px;height:" + rectH + "px;left:"+ xShift +"px;top:"+ yShift + "px;'>按鈕</button>");
            }else if( shapeName == 'rectangle' && rectH < 23){
              $("#pop-customPopView").append("<button type='button' xkID='"+ currentID + "' style='width:"+ rectW +"px;height: 23px;left:"+ xShift +"px;top:"+ yShift + "px; position:absolute;'>按鈕</button>");
            }else{
              $("#pop-customPopView").append("<button type='button' xkID='"+ currentID + "' style='width:"+ lineW +"px;left:"+ xShift +"px;top:"+ yShift + "px; position:absolute;'>按鈕</button>");
            }
            arrData.push(timeIndex()+"ChangeElement:"+"button[xkID="+currentID +"][indexP="+indexP+"]@CustomPopView" );
            break;
          case 'Shape':
            $("#pop-customPopView").append("<div xkID='"+ currentID + "' style='width:"+ rectW +"px;height:" + rectH +"px;left:"+ xShift +"px;top:"+ yShift + "px; position:absolute; background-color:#eee;'>");
            arrData.push(timeIndex()+"ChangeElement:"+"button[xkID="+currentID +"][indexP="+indexP+"]@CustomPopView" );
            break;
          case 'TextView':
            $("#pop-customPopView").append("<div xkID='"+ currentID + "' style='width:"+ rectW +"px;height:" + rectH +"px;left:"+ xShift +"px;top:"+ yShift + "px; position:absolute;overflow:hidden;'>今明兩天天氣不穩定，有局部較大雨勢發生的機率；今日鋒面接近，臺灣中部以北地區及澎湖、金門、馬祖有短暫陣雨或雷雨，東半部地區亦有局部短暫陣雨，南部地區為短暫陣雨後多雲；明日鋒面通過及大陸冷氣團南下，各地氣溫下降；臺灣北部、東北部地區及金門、馬祖有陣雨或雷雨，中部、東部、東南部地區及澎湖有短暫陣雨，其他地區亦有局部短暫陣雨。今明兩天金門、馬祖易有局部霧或低雲影響能見度，請注意。</div>");
            arrData.push(timeIndex()+"ChangeElement:"+"textView[xkID="+currentID +"][indexP="+indexP+"]@CustomPopView" );
            break;
          case 'TextField':
            // 判斷高度以區別是否為多行。一行的高度單位為20px
            if(rectH <= 40){
              $("#pop-customPopView").append("<input type='text' xkID='" + currentID + "' style='width:"+ rectW +"px;height:" + rectH + "px;left:"+ xShift +"px;top:"+ yShift + "px; position:absolute; border:1px solid lightgrey;' placeholder='輸入文字...'>");
              arrData.push(timeIndex()+"ChangeElement:"+"textField.singleLine[xkID="+currentID +"][indexP="+indexP+"]@CustomPopView" );
            }else {
              var rows = Math.round(rectH/20) ;
              arrData.push(timeIndex()+"ChangeElement:"+"textField.multLine[xkID="+currentID +"][indexP="+indexP+"]@CustomPopView" );
              $("#pop-customPopView").append("<textarea type='text' xkID='" + currentID + "' style='width:"+ rectW +"px;height:" + rectH + "px;left:"+ xShift +"px;top:"+ yShift + "px; position:absolute; border:1px solid lightgrey;' placeholder='輸入文字...'></textarea>");
            }
            break;
          case 'Text':
            $("#pop-customPopView").append("<span xkID='"+ currentID + "' style='width:"+lineW +"px;left:"+ xShift +"px;top:"+ yShift + "px; position:absolute; text-overflow:ellipsis; white-space: nowrap; overflow:hidden; font-size:20px; ;'>今明（２２日、２３日）兩天天氣不穩定，有局部較大雨勢發生的機率；今日鋒面接近，臺灣中部以北地區及澎湖、金門、馬祖有短暫陣雨或雷雨，東半部地區亦有局部短暫陣雨，南部地區為短暫陣雨後多雲；明日鋒面通過及大陸冷氣團南下，各地氣溫下降；臺灣北部、東北部地區及金門、馬祖有陣雨或雷雨，中部、東部、東南部地區及澎湖有短暫陣雨，其他地區亦有局部短暫陣雨。今明兩天金門、馬祖易有局部霧或低雲影響能見度，請注意。</span>");
            arrData.push(timeIndex()+"ChangeElement:"+"text[xkID="+currentID +"][indexP="+indexP+"]@CustomPopView" );
            break;
          case 'Line':
            $("#pop-customPopView").append("<hr xkID='" + currentID + "' style='width:"+ lineW +"px;height:" + lineH + "px;left:"+ xShift +"px;top:"+ yShift + "px; position:absolute; background-color:lightgrey; margin:0px; padding:0px;'>");
            arrData.push(timeIndex()+"ChangeElement:"+"line[xkID="+currentID +"][indexP="+indexP+"]@CustomPopView" );
            break;

        default:
      }

    }else {

    }
    undoString = "$('[xkID="+ currentID +"]').remove();";// (((undo)))

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
// table cell
$(document).on("click",".js_confirmCell",function(){
  // Close suggestions pop
  $('.popover-content > div').css({"display" : "none"});
  $('.js_suggestions.cell').css({"display":"none"});
  // Clear the stroke canvas.
  $("paper-fab[icon='delete']").trigger("click");

  $(".item-after").empty();
  var elementType = $(".js_cellConponents input:checked ").val();

  switch (elementType) {
      case 'Text':
        $(".item-after").append("<span xkID='"+currentID+"'>Text</span>");
        arrData.push(timeIndex()+"ChangeElement:"+"text[xkID="+currentID +"][indexP="+indexP+"]@table-right" );
        break;
      case 'Text >':
        $(".item-after").append("<span xkID='"+currentID+"'>Text ></span>");
        arrData.push(timeIndex()+"ChangeElement:"+"text>[xkID="+currentID +"][indexP="+indexP+"]@table-right" );
        break;
      case 'Text input':
        $(".item-after").append("<span class='cellInput' xkID='"+currentID+"'>Text input</span>");
        arrData.push(timeIndex()+"ChangeElement:"+"textField[xkID="+currentID +"][indexP="+indexP+"]@table-right" );
        break;
      case 'Check icon':
        $(".item-after").append("<img xkID='"+currentID+"' src='img/icon_checkmark.png' alt='' style='height:12px;'>");
        arrData.push(timeIndex()+"ChangeElement:"+"checkIcon[xkID="+currentID +"][indexP="+indexP+"]@table-right" );
        break;
      case 'Switch':
        $(".item-after").append("<img xkID='"+currentID+"' src='img/icon_switchInactive.png' alt='' style='height:12px;'>");
        arrData.push(timeIndex()+"ChangeElement:"+"switch[xkID="+currentID +"][indexP="+indexP+"]@table-right" );
        break;
    default:

  }
  undoString = "$('[xkID="+ currentID +"]').remove();";// (((undo)))
});

// Reload the page =============================================================
$(document).on("click",".js_clear",function(){
  var txt;
  var r = confirm("是否清除畫布所有元件？");
  if (r == true) {
      // location.reload();
      $("#task" + taskIndex[currentTask]).appendTo(".tasklist");
      $(".identification").empty();
      $("#task" + taskIndex[currentTask]).appendTo(".identification");
  }
});

// Clear the myScript canvas.===================================================
function clearCanvas(){
  $("paper-fab[icon='delete']").trigger("click");
}
// Remove the wrong shape ==================================================
function removeWrongShape(){
  clearCanvas();
  shapeQty--;
  $(".js_ShapeQty").text(Math.round(shapeQty));
}


// Suggestions checked =====================================================
function checkedElement(e){
  var target = e;
  $(target+" .form-check:first-child input").attr("checked");
}
// Attr xkID  ==============================================================
function addXkID(e){
  var targetComponent = e;
  $(targetComponent).attr("xkID",currentID);
  currentID++;
}
// timeIndex for data log ID  ==============================================================
function timeIndex(){
  var d = new Date();
  var time = d.getHours()+":" + d.getMinutes() +":"+ d.getSeconds() +"--";
  return time;
}
// timeIndex for data log ID  ==============================================================
function getAllElementsWithAttribute(attribute)
{
  var matchingElements = [];
  var allElements = document.getElementsByTagName('*');
  for (var i = 0, n = allElements.length; i < n; i++)
  {
    if (allElements[i].getAttribute(attribute) !== null)
    {
      // Element exists with attribute. Add to array.
      matchingElements.push(allElements[i]);
    }
  }
  return matchingElements;
}
