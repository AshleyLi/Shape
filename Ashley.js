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


var suggestedlist = "none";
var idPadding = 5; // a value of identification labels
var idtagX, idtagY;

var correctness = 0;

var errorQty  = 0 ;
var componentP = [5,4,3,2,1];
var totalScore = 0;
var popSuggestionsX, popSuggestionsY ;
var xkID, currentID;

// Basic settings =============================================================================

$( document ).ready(function() {
  screenH = MCScreenH;
  unitH = screenH/10;
  $(".ooo-section").css({"height":$(window).height()-50});
  // console.log("$( window ).width() = " + $( window ).width());
  // console.log("MCScreenW = " +MCScreenW+ "，MCScreenH＝" + MCScreenH);
});

$(document).on("click",".js_funcPop",function(){
  $(".popview").css({"display" : "initial","width":MCScreenW+ "px","height": MCScreenH + 2 +"px","left": $(window).width()/2 - MCScreenW/2+"px", "top": $(".ooo-section").height()/2 - MCScreenH/2 -2 +"px"});
});

// Get shape =============================================================================
window.Ashley = {
  responseCallback : function (responseObject){

    // Print shape object ===============DON'T TOUCH!!===============
    console.log(responseObject)

    // Get the length of shape segments[]
    segmentsLength = responseObject.result.segments.length;
    shapeQty++;

    // Print basic shape information
    shapeName = responseObject.result.segments[0].candidates[0].label;


    $(".js_shapeName").text(shapeName);
    $(".js_ShapeQty").text(Math.round(shapeQty));

    // Give a id to the following element
    currentID = Date.now();


    // Recognizing the shape====================================================
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
      default:
        removeWrongShape();

    }
    // Remove the wrong shape ==================================================
    function removeWrongShape(){
      $("paper-fab[icon='delete']").trigger("click");
      shapeQty--;
      $(".js_ShapeQty").text(Math.round(shapeQty));
    }
    // Rectangle ===============================================================
    function ARectangle() {
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

      showRectSuggestions();
      function showRectSuggestions(){

        if(rectW >= rectH){
          if(rectH > unitH){
            // add an image & set a current elementID
            $(".identification").append("<img src='https://goo.gl/hSqM8y' xkID='"+ currentID + "' style='width:"+ rectW +"px;height:" + rectH +"px;left:"+pointsX[0]+"px;top:"+pointsY[0] + "px;'>");
            $('.js_wildRectB').css({"display" : "initial"});
          } else {
            // add a button & set a current elementID
            $(".identification").append("<button type='button' xkID='"+ currentID + "' style='width:"+ rectW +"px;height:" + rectH + "px;left:" + pointsX[0] + "px;top:" + pointsY[0] + "px;'>button</button>");
            $('.js_wildRectS').css({"display" : "initial"});
          }
        }else {
          if(rectH > unitH){
            // add an image & set a current elementID
            $(".identification").append("<img src='https://goo.gl/hSqM8y' xkID='"+ currentID + "' style='width:"+ rectW +"px;height:" + rectH +"px;left:"+pointsX[0]+"px;top:"+pointsY[0] + "px;'>");
            $('.js_tallRectB').css({"display" : "initial"});
          } else {
            // add an image & set a current elementID
            $(".identification").append("<img src='https://goo.gl/hSqM8y' xkID='"+ currentID + "' style='width:"+ rectW +"px;height:" + rectH +"px;left:"+pointsX[0]+"px;top:"+pointsY[0] + "px;'>");
            $('.js_tallRectS').css({"display" : "initial"});
          }
        }
      }

      // reture & set suggestions pop positionX,Y
      popSuggestionsX = pointsX[1] + 10
      popSuggestionsY = pointsY[1] - $(".js_suggestions").height()/2 - rectH/2;
      $(".js_suggestions").css({"display":"initial","left": popSuggestionsX + "px","top": popSuggestionsY + "px"});

      //show information
      $(".js_shapeW").text(rectW);
      $(".js_shapeH").text(rectH);

      idtagX = pointsX[0];
      idtagY = pointsY[0];
    }


    // Line ====================================================================
    function ALine() {
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
      console.log("lineW = " + lineW);

      // Greate the first component
      $(".identification").append("<span xkID='"+ currentID + "' style='width:"+lineW +"px;left:"+pointsX[0]+"px;top:"+pointsY[0] +"px;text-overflow:ellipsis; white-space: nowrap; overflow:hidden; font-size:20px; ;'>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.</span>");

      // open & set suggestions pop positionX,Y
      $('.js_line').css({"display" : "initial"});
      $(".js_suggestions").css({"display":"initial","left": pointsX[1]+10 + "px","top": pointsY[0]-$(".js_suggestions").height()/2 + "px"});
      // show the shape basic information
      $(".js_shapeW").text(lineW);
      $(".js_shapeH").text(lineH);

    }

    $(".js_pointsX").text(pointsX);
    $(".js_pointsY").text(pointsY);



  },
  requestCallback : function (requestObject){
    console.log(requestObject)
  }
}


//====================== AFTER CONFIRM =========================================
$(document).on("click",".js_confirmType",function(){
    // Close suggestions
    $('.popover-content > div').css({"display" : "none"});
    $('.js_suggestions').css({"display":"none"});

    // Clear the canvas.
    $("paper-fab[icon='delete']").trigger("click");

    // Show the counting result
    $(".js_showCount").css({"display":"initial"});

    // Get and show the selected value and show
    var indexP = parseInt($( "input:checked" ).attr("indexP"));
    $(".score").append( "<li>#" + shapeQty + " —— " + indexP + "p</li>" )

    // 若選擇的項目!=推薦的第一項，則重新產生element取代
    if( indexP != 5 ){
      // remove the old element
      $("[xkID='"+ currentID +"']").remove();
      // add a new selected element
      var elementType = $( "input:checked" ).val();
      console.log("elementType=" + elementType );
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
