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
var popviewCanvas; // for popview position

var popEditor = false;
var popPosX , popPosY ;
var selectedType = "none";

var ASTitle = false;
var xShift, yShift;

var tableiQty = 0;
var tableviewMode = false, repeatCellMode = false;
var tablePos; //表格的位置
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

    // if the shape == Tableview or not ======================================================talbeview
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
          cleanCanvas();
        }
    }else{
      shapeName = responseObject.result.segments[0].candidates[0].label;
    }


    $(".js_shapeName").text(shapeName);
    $(".js_ShapeQty").text(Math.round(shapeQty));



//====================================================================================================
// ==================================（ＧＥＴ＿ＳＨＡＰＥ＿ＩＮＦＯＲＭＡＴＩＯＮ）===========================
//====================================================================================================
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
      // Show shape information ===============
      $(".js_pointsX").text(pointsX);
      $(".js_pointsY").text(pointsY);

    }
    getShapeInfo();

//====================================================================================================
// ==================================（ＲＥＣＯＧＮＩＺＩＮＧ＿ＳＨＡＰＥ）==================================
//====================================================================================================

    // （一）筆畫於 talbeview 內 ==================
    if(tableviewMode == true && popEditor == false &&
      pointsY[0] > tablePos.top &&
      pointsY[0] < tablePos.top + $("#tableview").height() &&
      pointsX[0] > tablePos.left  &&
      pointsX[0] < tablePos.left + $("#tableview").width()
    ){
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
    // （二）筆畫於  popover ==================
    }else if( popEditor == true ){
      popviewCanvas = $(".popview").position();
      switch ( selectedType ) {
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
    // （三）筆畫為一般圖形 ==================
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

//======================================================================================================
//==================================（ＳＨＡＰＥ＿ＥＶＥＮＴ）==============================================
//======================================================================================================


    // （一）ＴＡＢＬＥ ==========================================================================ＴＡＢＬＥ
    // 1. Create a tableview.
    function ATableview(){
      // 畫布中沒有表格
      if( $("#tableview").length == 0){
        // 1. Clone to the specific container.
        $(".tableview").clone().appendTo(".tableContainer").attr({
          id:"tableview",
          xkID: getCurrentID()
        });
        // 2. 初始化表格
        $("#tableview").css({
          "position": "absolute",
          "display" : "initial",
          "width":MCScreenW+ "px",
          // "height": MCScreenH + 2 +"px",
          "left": popPosX +"px"});
        // 2-1. 於表格中加入cell
        for (var i = 0; i < 5; i++) {
          $("#tableview .js_tableUl").append("<li class='item-content'><div class='item-inner'><div class='item-title'></div></div></li>");
        }
        // 3. 判斷 表格 是否會超出 iphone 螢幕範圍，若超過則放置於邊界處
        // 3-1.
        if( tableY[0] < popPosY){
          $("#tableview").css("top", popPosY - 10);
          console.log("高於");

        // 3-2.
        }else if( tableY[0] + $(".js_tableUl").height() > popPosY + MCScreenH){
          $("#tableview").css("top", popPosY + MCScreenH - $(".js_tableUl").height() - 10 );
          console.log("低於");
        // 3-3.
        }else{
          $("#tableview").css("top",tableY[0]);
          console.log("範圍內");
        }

        // 4. set #tableview position
        tablePos = $("#tableview").position();

        tableiQty = 1;
        tableviewMode = true;
      }else{
        arrData.push(timeIndex()+"CreateElement:"+"Talbeview twice." );
      }
      // 執行表格產生後的行為：動作寫入log、設定undo、更新id
      arrData.push(timeIndex()+"CreateElement:"+"Talbeview" );
      undoString = "$('[xkID="+ currentID +"]').remove(); tableviewMode = false;";

    }
    // 2. A rectangle @ tableview.
    function ACellRectangle(){
      var strokeCP = pointsX[0]+(pointsX[1]-pointsX[0])/2; //筆畫@表格 的中心點
      // 判斷筆畫中心點、cell中心點、表格左右範圍之關係
      if (strokeCP <= cellMidline && strokeCP > tablePos.left  ) {
        // 矩形＠表格左側
        if( $(".icon.icon-f7").length == 0 ){
          $(".js_tableUl > .item-content").prepend("<div class='item-media'><i class='icon icon-f7'></i></div>");
          undoString = "$('.js_tableUl > .item-content > .item-media').remove();";
          arrData.push(timeIndex()+"CreateElement:"+"img@table-left" );
        }
        arrData.push(timeIndex()+"ErrorStroke:"+ "existed@table-left");
        cleanCanvas();
      } else if( strokeCP > cellMidline && strokeCP < tablePos.left + $("#tableview").width() ) {
        // 矩形＠表格左側、加上「 > 」
        console.log("沒事沒事兒。");
        // $(".item-content").addClass("item-link");
        // arrData.push(timeIndex()+"CreateElement:"+"@table-right(arrow)" );
        // undoString = "$('item-content').removeClass('item-link');";

      }else {
        console.log("不左不右");
        arrData.push(timeIndex()+"ErrorStroke:"+ shapeName+ "@table");
      }
      console.log("清除");
      cleanCanvas();
    }
    // 3. A rectangle @ tableview.
    function ACellLine(){
      currentID++;
      var strokeCP = pointsX[0]+(pointsX[1]-pointsX[0])/2; //筆畫@表格 的中心點
      // 判斷筆畫中心點、cell中心點、表格左右範圍之關係

      if ( strokeCP <= cellMidline && strokeCP > tablePos.left ) {
        // ================================（線段＠左側）==========================================
        console.log("線段＠左");

        if( $("#tableview .item-title").is(':empty') && $("#tableview .subforCell").length == 0 ){
          // case 1: title & subtitle 都不存在 > 增加 title
          $("#tableview .js_tableUl > .item-content > .item-inner > .item-title").append("Item title");
          undoString = "$('#tableview .js_tableUl > .item-content > .item-inner > .item-title').empty();"; // (((undo)))
          arrData.push(timeIndex()+"CreateElement:"+"Item title@table-left" );

        }else if( $("#tableview .item-title").length > 0 && $(".subforCell").length == 0){
          // case 2: 有 title ，無 subtitle > 增加 subtitle
          $("#tableview .js_tableUl > .item-content > .item-inner > .item-title").append("<div class='subforCell' xkID='"+currentID+"'>subtitle</div>");
          undoString = "$('[xkID="+ currentID +"]').remove();"; // (((undo)))
          arrData.push(timeIndex()+"CreateElement:"+"subTitle@table-left" );
        }else{
          // case 3: 兩者皆有
          alert("已存在元件故無法新增。");
          arrData.push(timeIndex()+"ErrorStroke:"+ "existed@table-left");
        }
        cleanCanvas();



      } else if( strokeCP > cellMidline && strokeCP < tablePos.left + $("#tableview").width() ){
        // ======================================（線段＠右側）====================================
        if( $("#tableview .item-after").length == 0){

          // 1. 左側無元件 > 增加預設元件、寫入undo & log
          $("#tableview .js_tableUl > .item-content > .item-inner").append("<div xkID='"+ currentID +"' class='item-after'>Text</div>");
          undoString = "$('[xkID='"+ currentID +"']').remove(); "; // (((undo)))
          arrData.push(timeIndex()+"CreateElement:"+"Label@table-right" );


          // 2-1. 開啟建議元件列表
          $(".js_suggestions.cell").css({
            "display":"block",
            "left": tablePos.left + MCScreenW - 5 +"px",
            "top": tablePos.top
          });
          $(".js_cellConponents input[value='Text']").prop("checked", true);
          $(".js_cellConponents").css("display","block");

          // 2-2. 依據有無使用 subforCell 關閉建議元件列表中的 控制項類別元件(cell_left_controller)
          if($("#tableview .subforCell").length == 0 ){
            $(".cell_left_controller").css("display","block");
          }

        }else {
          // 1. 左側有元件 > NOOOOO!!!
          alert("已存在元件故無法新增。");
          arrData.push(timeIndex()+"ErrorStroke:"+ "existed@table-right");
        }
        cleanCanvas();
        arrData.push(timeIndex()+"ErrorStroke:"+shapeName +"@table");
      }
    }

    // （二）ＢＡＳＩＣ ========================================================================= ＢＡＳＩＣ
    // 1. Rect ------<)))))
    function ARectangle() {
      undoString = "$('[xkID="+ getCurrentID() +"]').remove();"; // (((undo)))
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
    // 2. Line ------<)))))
    function ALine() {

      undoString = "$('[xkID="+ getCurrentID() +"]').remove();";// (((undo)))
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

    // （三）ＰＯＰＶＩＥＷＳ =============================================================== ＰＯＰＶＩＥＷＳ

    // 1. Custom Popview ------<)))))
    function popCustomPopview(){

      var popCustomPopView = $("#pop-customPopView").position(); // pop 視窗的位置
      var popviewElement = $(".popview").position(); // pop mask 的位置

      xShift = pointsX[0] - popviewElement.left - popCustomPopView.left ;
      yShift = pointsY[0] - popviewElement.top - popCustomPopView.top  ;
      $("#pop-customPopView").css("display", "block");

      // 矩形 or 線段
      if(shapeName == "rectangle" || shapeName == "square"){
        // （一）辨識筆畫 ＝ 矩形  ===========================================（矩形）
        if(rectW >= rectH){
          // 1-1. 寬矩形
          if(rectH > unitH){
            // 1-1-1. 寬矩形 && 高度 > 一單位
            // add an image & set a current elementID
            $("#pop-customPopView").append("<img src='/img/img_default.jpg' xkID='"+ getCurrentID() + "' style='width:"+ rectW +"px;height:" + rectH +"px;left:"+ xShift +"px;top:"+ yShift+ "px;position:absolute;'>");
            $(".js_wildRectB").css({"display" : "initial"});
          } else {
            // 1-1-2. 寬矩形 && 高度 <= 一單位
            // add a button & set a current elementID
            $("#pop-customPopView").append("<button type='button' xkID='"+ getCurrentID() + "' style='width:"+ rectW +"px;height:" + rectH + "px;left:" + xShift + "px;top:" + yShift + "px;position:absolute;'>button</button>");
            $('.js_wildRectS').css({"display" : "block"});
          }
        }else {
          // 1-2. 高矩形
          if(rectH > unitH){
            // 1-2-1. 高矩形 && 高度 ＞ 一單位
            // add an image & set a current elementID
            $("#pop-customPopView").append("<img src='/img/img_default.jpg' xkID='"+ getCurrentID() + "' style='width:"+ rectW +"px;height:" + rectH +"px;left:"+ xShift +"px;top:"+ yShift + "px;position:absolute;'>");
            $('.js_tallRectB').css({"display" : "block"});
          } else {
            // 1-2-2. 高矩形 && 高度 ＜ 一單位
            // add an image & set a current elementID
            $("#pop-customPopView").append("<img src='/img/img_default.jpg' xkID='"+ getCurrentID() + "' style='width:"+ rectW +"px;height:" + rectH +"px;left:"+ xShift +"px;top:"+ yShift + "px;position:absolute;'>");
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
        // （二）辨識筆畫 ＝ 線段 ===========================================（線段）
        // 2-1. Create the first component
        $("#pop-customPopView").append("<span xkID='"+ getCurrentID() + "' style='width:"+lineW +"px;left:"+ xShift +"px;top:"+ (yShift-10) +"px;position:absolute;text-overflow:ellipsis; white-space: nowrap; overflow:hidden; font-size:20px; ;'>今明兩天天氣不穩定，有局部較大雨勢發生的機率；今日鋒面接近，臺灣中部以北地區及澎湖、金門、馬祖有短暫陣雨或雷雨，東半部地區亦有局部短暫陣雨，南部地區為短暫陣雨後多雲；明日鋒面通過及大陸冷氣團南下，各地氣溫下降；臺灣北部、東北部地區及金門、馬祖有陣雨或雷雨，中部、東部、東南部地區及澎湖有短暫陣雨，其他地區亦有局部短暫陣雨。今明兩天金門、馬祖易有局部霧或低雲影響能見度，請注意。</span>");
        arrData.push(timeIndex()+"CreateElement:"+"span["+currentID +"]@CustomPopview" );

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
        $(".js_suggestions.regular").css({"display":"initial","left": pointsX[1]+10 + "px","top": pointsY[0] + shift -$(".js_suggestions.regular").height()/2 + "px"});

      }
      undoString = "$('[xkID="+ currentID +"]').remove();";// (((undo)))
      // the end of function popCustomPopview
    }
    // 2. Action sheet --------<)))))
    function popActionSheet(){
      currentID++;
      $("div#pop-actionSheet").css("display", "block");
      var popElement = $(".popview").position();
      var modalGroup = $("#pop-actionSheet > .actions-modal").position();
      // （一）＝ Outside. 筆畫落於 ActionSheet 之上
      if ( pointsY[0] > popElement.top && pointsY[0] < popElement.top + modalGroup.top ) {
        // 1. 矩形
        if(shapeName == "rectangle" || shapeName == "square"){
          if(ASTitle == true){
            // 已存在action sheet toolbar 則
            $(".actions-modal-label").after("<div class='actions-modal-button' xkID='"+ currentID + "'>Button</div>");
          }else{
            $("#pop-actionSheet .actions-modal-group:first-child .actions-modal-button:first-child").before("<div class='actions-modal-button' xkID='"+ currentID + "' >Button</div>");
          }
          arrData.push(timeIndex()+"CreateElement:"+"Button["+currentID +"]by "+shapeName+"@ActionSheet-Outside" );
        }else if (shapeName == "line") {
          // 2.筆畫落於 ActionSheet 之外的線段
          if( $(".actions-modal-label").length == 0 ){
            // Title isn't exist then create a title.
            $(".actions-modal-group:first-child").prepend("<div class='actions-modal-label' xkID='"+ currentID + "'>說明文字</div>");
            arrData.push(timeIndex()+"CreateElement:"+"title["+currentID +"]by"+shapeName+"@ActionSheet-Outside" );
          }else {
            // Title is exist then create a button.
            $(".actions-modal-label").after("<div class='actions-modal-button' xkID='"+ currentID + "'>Button</div>");
            arrData.push(timeIndex()+"CreateElement:"+"Button["+currentID +"]by "+shapeName+"@ActionSheet-Outside" );
          }
        }
      } else if (pointsY[0] > popElement.top + modalGroup.top  && pointsY[0] < popElement.top + $(".popview").height() ) {
      // （二） Inside.
      // 1. All the line, rectangle and square
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
      cleanCanvas();
      arrData.push(timeIndex()+"ErrorStroke:"+shapeName+"@ActionSheet" );

    }
    // 3. Alert ---------------<)))))
    function popAlert(){

      var strokeCentralY = pointsY[1] - (pointsY[1]- pointsY[0])/2; // 筆劃的y軸中心
      var strokeCentralX = pointsX[1] - (pointsX[1]- pointsX[0])/2; // 筆劃的y軸中心
      var popviewCanvas = $(".popview").position() ; // pop容器的位置
      var popElement = $("#pop-alert").position();  // pop容器裏 alert的位置
      var centralLineX = $(".popview").position().left+ $("#pop-alert").position().left + $("#pop-alert").width()/2;
      var centralLineY = $(".popview").position().top+ $("#pop-alert").position().top+ $("#pop-alert > .modal-buttons").position().top ; //區隔 alert 的上下中線
      //（一）centralLineY中線以下
      if( strokeCentralY >= centralLineY ){

        // 1. Stroke is under the centralLine ==========================
        var alertBoundaryBottomY =  popviewCanvas.top + popElement.top + $("#pop-alert").height() ; // the bottom margin of div#pop-alert.



        if ( strokeCentralY >= alertBoundaryBottomY ){
        // 1-1. Stroke is out of .modal-buttons

          if( $("#pop-alert .modal-buttons:nth-child(2) .modal-button").length != 2){
            // There isn't 2 .modal-button.
            if (shapeName == "rectangle" || shapeName == "square" || shapeName == "line" ){
              $("#pop-alert").append("<div class='modal-buttons' xkID='"+ getCurrentID() + "'><span class='modal-button'>Button</span></div>");
              arrData.push(timeIndex()+"CreateElement:"+"Button["+currentID +"]by "+shapeName+"@Alert-down" );
              undoString = "$('[xkID="+ currentID +"]').remove(); resizeAlert();";// (((undo)))
            }else {
              arrData.push(timeIndex()+"ErrorStroke:"+shapeName+"@Alert-down" );
            }
          }else {
            // remove .modal-button:last-child of row:first-child.
            $("#pop-alert .modal-button:last-child").remove();
            // add a modal-buttons with only one button.
            for (var i = 0; i < 2; i++) {
              $("#pop-alert").append("<div class='modal-buttons' xkID='"+ getCurrentID() + "'><span class='modal-button'>Button</span></div>");
            }
            arrData.push(timeIndex()+"CreateElement:"+"Buttons["+currentID +"]by "+shapeName+"@Alert-down" );
            undoString = "$('[xkID="+ currentID +"]').remove(); resizeAlert();";// (((undo)))
          }
        }else {
        // 1-2. Stroke is in .modal-buttons

          // 1-2 case 1 : 只有一個btn則在其旁增加btn =======================( case 1 )
          if( $("#pop-alert .modal-button").length == 1){
            console.log("只有一個.modal-button，依據 lineW 決定要新增短or長按鈕");

            if (lineW > $("#pop-alert").width() / 2) {
                // 線段 > 60%  $("#pop-alert").width()
                $("#pop-alert").append("<div class='modal-buttons' xkID='" + currentID + "'><span class='modal-button'>Button</span></div>");
                arrData.push(timeIndex() + "CreateElement:" + "Button==NinNRoll[" + currentID + "]by " + shapeName + "@Alert-Inside");
                undoString = "$('[xkID=" + currentID + "]').remove();"; // (((undo)))
            } else {
                // 線段 < 60%  $("#pop-alert").width()
                if (strokeCentralX < centralLineX) {
                    //strokeCentralX 偏左 則 prepend ＠.modal-buttons
                    $("#pop-alert .modal-buttons").prepend("<span class='modal-button' xkID='" + getCurrentID() + "'>Button</span>");
                } else {
                    //strokeCentralX 偏右 則 append ＠.modal-buttons
                    $("#pop-alert .modal-buttons").append("<span class='modal-button' xkID='" + getCurrentID() + "'>Button</span>");
                }
                arrData.push(timeIndex() + "CreateElement:" + "Button==2inRoll[" + currentID + "]by " + shapeName + "@Alert-Inside");
                undoString = "$('[xkID=" + currentID + "]').remove();"; // (((undo)))
            }
          // 1-2 case 2 :大於二則“改為”成垂直排列 ==========================( case 2 )
          }else if ( $("#pop-alert > .modal-buttons").length == 1 && $("#pop-alert .modal-buttons:nth-child(2) .modal-button").length == 2) {
            console.log("岔岔岔岔岔岔岔岔岔岔岔岔岔岔岔岔岔岔岔岔岔岔岔岔岔岔岔岔岔岔岔岔岔岔岔岔");
            // a. Remove the latter .modal-button in the same row.
            $("#pop-alert .modal-buttons [xkID='"+currentID+"']").remove();
            // b. Add 2 rows .modal-buttons which has one modal-button.
            var iddddd= getCurrentID();
            for( i=0 ; i < 2 ; i++ ){
              $("#pop-alert").append("<div class='modal-buttons' xkID='"+ iddddd + "'><span class='modal-button'>Button</span></div>");
            }
            arrData.push(timeIndex()+"CreateElement:"+"Button==3in3Roll[xkID="+currentID +"]by "+shapeName+"@Alert-Inside" );
            undoString = "$('[xkID="+ currentID +"]').remove(); resizeAlert(); ";// (((undo)))
          // 1-2 case 3 :大於三直接垂直增加 ===============================( case 3 )
          }else {
            console.log("下下下下下下下下下下下下下下下下下下下下下下下下下下");
            $("#pop-alert").append("<div class='modal-buttons' xkID='"+ getCurrentID() + "'><span class='modal-button'>Button</span></div>");
            arrData.push(timeIndex()+"CreateElement:"+"Button==NinNRoll["+currentID +"]by "+shapeName+"@Alert-Inside" );
            undoString = "$('[xkID="+ currentID +"]').remove(); resizeAlert();";// (((undo)))
          }


        }

      }else {
      // （二）中線以上 ==========================
        if(shapeName == "line" && pointsY[0] >= popviewCanvas.top + popElement.top){
          // Opne the modal sub title
          $("#pop-alert .modal-text").css("display","initial").attr("xkID", getCurrentID() );
          arrData.push(timeIndex()+"CreateElement:"+"showDescribtion[xkID="+currentID +"]by "+shapeName+"@Alert-top" );
          undoString = "$('#pop-alert .modal-text').hide(); resizeAlert();";// (((undo)))
        }else if (shapeName == "rectangle" || shapeName == "square"  && pointsY[0] >= popElement.top){
          // Opne the modal text input
          $("#pop-alert .modal-text-input").css("display","initial").attr("xkID", getCurrentID() );
          arrData.push(timeIndex()+"CreateElement:"+"showTextField[xkID="+currentID +"]by "+shapeName+"@Alert-top" );
          undoString = "$('#pop-alert .modal-text-input').css('display','none'); resizeAlert(); ";// (((undo)))
        }else{
          console.log("Shape's wrong or out of the container.");
          arrData.push(timeIndex()+"ErrorStroke:"+shapeName+"!= @Alert-top" );
        }
      }
      resizeAlert();
      cleanCanvas();
    }
    // 4. Picker --------------<)))))
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
          cleanCanvas();
        }else {
          cleanCanvas();
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
          $(".js_pickerBase").after("<div xkID='"+ currentID + "' class='picker-items-col picker-items-col-absolute js_rightPickerCol' style='width: 82px;'><div class='picker-items-col-wrapper' style='transform: translate3d(0px, -18px, 0px); transition-duration: 0ms;'><div class='picker-item' data-picker-value='Man' style='transform: translate3d(0px, 108px, 0px) rotateX(54deg); transition-duration: 0ms;'>Man</div> <div class='picker-item' data-picker-value='Luthor' style='transform: translate3d(0px, 108px, 0px) rotateX(36deg); transition-duration: 0ms;'>Luthor</div><div class='picker-item' data-picker-value='Woman' style='transform: translate3d(0px, 108px, 0px) rotateX(18deg); transition-duration: 0ms;'>Woman</div><div class='picker-item picker-selected' data-picker-value='Boy' style='transition-duration: 0ms; transform: translate3d(0px, 108px, 0px) rotateX(0deg);'>Boy</div><div class='picker-item' data-picker-value='Girl' style='transform: translate3d(0px,108px, 0px) rotateX(-18deg); transition-duration: 0ms;'>Girl</div><div class='picker-item' data-picker-value='Person' style='transform: translate3d(0px, 108px, 0px) rotateX(-36deg); transition-duration: 0ms;'>Person</div><div class='picker-item' data-picker-value='Cutie' style='transform: translate3d(0px, 108px, 0px) rotateX(-54deg); transition-duration: 0ms;'>Cutie</div><div class='picker-item' data-picker-value='Babe' style='transform: translate3d(0px, 108px, 0px) rotateX(-72deg); transition-duration: 0ms;'>Babe</div><div class='picker-item' data-picker-value='Raccoon' style='transform: translate3d(0px, 108px, 0px) rotateX(-90deg); transition-duration: 0ms;'>Raccoon</div></div></div>");
          arrData.push(timeIndex()+"CreateElement:"+"picker-items[xkID="+currentID +"]by "+shapeName+"@Picker-Inside-Right" );
          undoString = "$('[xkID="+ currentID +"]').remove();";// (((undo)))
        }
      }else {
        console.log("Lower or nothing happened." );
        arrData.push(timeIndex()+"ErrorStroke:"+shapeName+"@Picker-Down" );
      }
      cleanCanvas();
    }

    // end of popview

  },
  requestCallback : function (requestObject){
    console.log(requestObject)
  }
}

//======================================================================================================
//==================================（ＣＯＭＦＩＲＭ）=====================================================
//======================================================================================================
$(document).on("click",".js_confirmType",function(){
    // Close suggestions pop
    $('.popover-content > div').css({"display" : "none"});
    $('.js_suggestions.regular').css({"display":"none"});

    // Clear the stroke canvas.
    cleanCanvas();

    // Show the indexP result display
    // $(".js_showCount").css("display","initial");

    // Show the indexP result
    var indexP = parseInt($( "input:checked" ).attr("indexP"));
    $(".score").append( "<li>#" + shapeQty + " —— " + indexP + "p</li>" )

    // 若選擇的項目!=推薦的第一項 && 非pop mode下的Custom pop view狀態，則重新產生element取代
    if( indexP != 5 && selectedType != "Custom pop view" ){
      console.log("indexP="+indexP+",selectedType="+selectedType);
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
              $("#pop-customPopView").append("<button type='button' xkID='"+ currentID + "' style='width:"+ rectW +"px;height:" + rectH + "px;left:"+ xShift +"px;top:"+ (yShift- rectH/2)+ "px;  position:absolute;'>按鈕</button>");
            }else if( shapeName == 'rectangle' && rectH < 23){
              $("#pop-customPopView").append("<button type='button' xkID='"+ currentID + "' style='width:"+ rectW +"px;height: 23px;left:"+ xShift +"px;top:"+ yShift + "px; position:absolute;'>按鈕</button>");
            }else{
              $("#pop-customPopView").append("<button type='button' xkID='"+ currentID + "' style='width:"+ lineW +"px;left:"+ xShift +"px;top:"+ (yShift- 15) + "px; position:absolute;'>按鈕</button>");
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
              $("#pop-customPopView").append("<input type='text' xkID='" + currentID + "' style='width:"+ rectW +"px;height:" + rectH + "px;left:"+ xShift +"px;top:"+ (yShift- rectH/2) + "px; position:absolute; border:1px solid lightgrey;' placeholder='輸入文字...'>");
              arrData.push(timeIndex()+"ChangeElement:"+"textField.singleLine[xkID="+currentID +"][indexP="+indexP+"]@CustomPopView" );
            }else {
              var rows = Math.round(rectH/20) ;
              arrData.push(timeIndex()+"ChangeElement:"+"textField.multLine[xkID="+currentID +"][indexP="+indexP+"]@CustomPopView" );
              $("#pop-customPopView").append("<textarea type='text' xkID='" + currentID + "' style='width:"+ rectW +"px;height:" + rectH + "px;left:"+ xShift +"px;top:"+ (yShift- 10)+ "px; position:absolute; border:1px solid lightgrey;' placeholder='輸入文字...'></textarea>");
            }
            break;
          case 'Text':
            $("#pop-customPopView").append("<span xkID='"+ currentID + "' style='width:"+lineW +"px;left:"+ xShift +"px;top:"+ yShift-10 + "px; position:absolute; text-overflow:ellipsis; white-space: nowrap; overflow:hidden; font-size:20px; ;'>今明（２２日、２３日）兩天天氣不穩定，有局部較大雨勢發生的機率；今日鋒面接近，臺灣中部以北地區及澎湖、金門、馬祖有短暫陣雨或雷雨，東半部地區亦有局部短暫陣雨，南部地區為短暫陣雨後多雲；明日鋒面通過及大陸冷氣團南下，各地氣溫下降；臺灣北部、東北部地區及金門、馬祖有陣雨或雷雨，中部、東部、東南部地區及澎湖有短暫陣雨，其他地區亦有局部短暫陣雨。今明兩天金門、馬祖易有局部霧或低雲影響能見度，請注意。</span>");
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

  $("#tableview [xkID='" + currentID + "']").remove();
  var elementType = $(".js_cellConponents input:checked ").val();

  switch (elementType) {
      case 'Text':
        $("#tableview .item-inner").append("<div xkID='"+ currentID +"' class='item-after'>Text</div>");
        arrData.push(timeIndex()+"ChangeElement:"+"text[xkID="+currentID +"][indexP="+indexP+"]@table-right" );
        break;
      case 'Text >':
        $("#tableview .item-inner").append("<div xkID='"+ currentID +"' class='item-after'>Text ＞</div>");
        arrData.push(timeIndex()+"ChangeElement:"+"text>[xkID="+currentID +"]@table-right" );
        break;
      case 'Text input':
        $("#tableview .item-inner").append("<div xkID='"+ currentID +"' class='item-after'><span class='cellInput'>Text input</span></div>");
        arrData.push(timeIndex()+"ChangeElement:"+"textField[xkID="+currentID +"]@table-right" );
        break;
      case 'Check icon':
        $("#tableview .item-inner").append("<div xkID='"+ currentID +"' class='item-after'><img src='img/icon_checkmark.png' style='height:12px;'></div>");
        arrData.push(timeIndex()+"ChangeElement:"+"checkIcon[xkID="+currentID +"]@table-right" );
        break;
      case 'Switch':
        $("#tableview .item-inner").append("<div xkID='"+ currentID +"' class='item-after'><img src='img/icon_switchInactive.png' style='height:12px;'></div>");
        arrData.push(timeIndex()+"ChangeElement:"+"switch[xkID="+currentID +"]@table-right" );
        break;
    default:

  }
  undoString = "$('[xkID="+ currentID +"]').remove();";// (((undo)))
});


//======================================================================================================
//==================================（ＴＯＯＬＳ）=====================================================
//======================================================================================================


// Clean the canvas ============================================================
$(document).on("click",".js_clean",function(){
  var txt;
  var r = confirm("是否清除畫布所有元件及筆畫？");
  if (r == true) {
      // reset undo
      undoString ="";
      $(".js_undo").css("color","#9B9B9B");
      resetPage();
      // $("#task" + studyTask[currentTask]).appendTo(".tasklist");
      $(".identification").empty();
      $(".tableContainer").empty();
      $(".popview").empty();
      $("#task" + studyTask[currentTask]).clone().appendTo(".identification");
      checkTask(); // Check if the current task is a specific task.
  }
});
//
function resetPage(){
  cleanCanvas(); // remove wrong strokes.
  $("[xkID]").remove(); // remove all user created modules.
}
//
function initialforTaskSetting(){
  $("[xkID]").remove(); // Tester created modules.
  // Clean the container of modules.
  $(".identification").empty();
  $(".tableContainer").empty();
  $(".popview").empty();

}
//
function cleanCanvas(){
  $("paper-fab[icon='delete']").trigger("click");
}
//
function removeWrongShape(){
  cleanCanvas();
  shapeQty--;
  $(".js_ShapeQty").text(Math.round(shapeQty));
}
// Suggestions checked =========================================================
function checkedElement(e){
  var target = e;
  $(target+" .form-check:first-child input").prop("checked", true);
}
// Attr xkID  ==================================================================
function addxkID(e){
  var targetComponent = e;
  $(targetComponent).attr("xkID",currentID);
  currentID++;
}
function getCurrentID() {
  currentID++;
  return currentID;
}
// timeIndex for data log ID  ==============================================================
function timeIndex(){
  var d = new Date();
  var time = d.getHours()+":" + d.getMinutes() +":"+ d.getSeconds() +"--";
  return time;
}
// UNDO ========================================================================
$(document).on("click",".js_undo",function(){
  if(undoString.length != 0){
    eval(undoString);
    arrData.push(timeIndex()+"Undo:"+undoString);
    resetUndo();
  }else {
    alert("無可返回的操作。");
  }

});
function resetUndo(){
  $(".js_undo").css("color","#9B9B9D");
  undoString = "" ; // reset
}
function resizeAlert() {
  $("#pop-alert").css({
   "display":"block",
   "left": $(".popview").width()/2 - $("#pop-alert").width()/2 -2,
   "top": $(".popview").height()/2 - $("#pop-alert").height()/2 -2
   });
}
