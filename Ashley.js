var idtagX;
var idtagY;
window.Ashley = {
  responseCallback : function (responseObject){
    // Get shape information
    console.log(responseObject)

    // Get the length of segments[]
    var segmentsLength = responseObject.result.segments.length - 1 ;
    console.log('segmentsLength =' + segmentsLength)
    // Print basic shape information
    var shapeName = responseObject.result.segments[segmentsLength].candidates[0].label;
    var screenH = 600;
    var unitH = screenH/10;
    var pointsX = [];
    var pointsY = [];

    $(".js_shapeName").text(shapeName);
    // 取得 PosX and PosY array
    for ( i = 0 ; i < 4; i++){
        var pointX = Math.floor(responseObject.result.segments[segmentsLength].candidates[0].primitives[i].firstPoint.x);
        var pointY = Math.floor(responseObject.result.segments[segmentsLength].candidates[0].primitives[i].firstPoint.y);
        pointsX[i] = pointX;
        pointsY[i] = pointY;
        pointsX.sort();
        pointsY.sort();
    }
    // remove tha same value from PosX & PosY array and update array
    pointsX = pointsX.filter(function(element, index, arr){
      return arr.indexOf(element)=== index;
    });
    pointsY = pointsY.filter(function(element, index, arr){
      return arr.indexOf(element)=== index;
    });


    // show suggestions
    var rectW = pointsX[1]-pointsX[0] ;
    var rectH = pointsY[1]-pointsY[0] ;
    var popSuggestionsX = pointsX[1] + 10;
    var popSuggestionsY ;


    // Recognizing the shape
    recognizing();
    function recognizing(){

      if(rectW > rectH && rectH > unitH){
        $('.js_wildRectB').css({"display" : "initial"});
      }else if (rectW > rectH && rectH < unitH) {
        $('.js_wildRectS').css({"display" : "initial"});
      }else if (rectW < rectH && rectH > unitH) {
        $('.js_tallRectB').css({"display" : "initial"});
      }else if (rectW < rectH && rectH < unitH)  {
        $('.js_tallRectS').css({"display" : "initial"});
      }else{
        alert('A square.');
      }
    }
    // reture and set pop posY
    popSuggestionsY = pointsY[1] - $(".js_suggestions").height()/2 - rectH/2;
    $(".js_suggestions").css({"display":"initial","left": popSuggestionsX + "px","top": popSuggestionsY + "px"});

    //show information
    $(".js_pointsX").text(pointsX);
    $(".js_pointsY").text(pointsY);
    $(".js_shapeW").text(rectW);
    $(".js_shapeH").text(rectH);
    idtagX = pointsX[0];
    idtagY = pointsY[0];
    // console.log('$(".js_suggestions").height()/2 = ' + $(".js_suggestions").height()/2 )

  },
  requestCallback : function (requestObject){
    console.log(requestObject)
  }
}


//====================== leave a label ==========================
$(document).on("click",".js_confirmType",function(){
    // close suggestions
    $('.popover-content > div').css({"display" : "none"});
    $('.js_suggestions').css({"display":"none"});
    idtagX += 10;
    idtagY += 10;
    // add identification
    $(".identification").append("<span style='left:" + idtagX + "px;top:"+ idtagY +"px;'>" + "Default" + "</span>");
    console.log('idtagX = ' + idtagX + ',' + 'idtagY = ' + idtagY);
    idtagX = 0;
    idtagY = 0;

});
