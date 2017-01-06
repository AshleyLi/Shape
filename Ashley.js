window.Ashley = {
  responseCallback : function (responseObject){
    // Get shape information
    console.log(responseObject)

    // Print basic shape information
    var shapeName = responseObject.result.segments[0].candidates[0].label;
    $(".js_shapeName").text(shapeName);

    // 取得 PosX and PosY array
    var pointsX = [];
    var pointsY = [];
    for ( i = 0 ; i < 4; i++){
        var pointX = Math.floor(responseObject.result.segments[0].candidates[0].primitives[i].firstPoint.x);
        var pointY = Math.floor(responseObject.result.segments[0].candidates[0].primitives[i].firstPoint.y);
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

    //show information
    $(".js_pointsX").text(pointsX);
    $(".js_pointsY").text(pointsY);
    $(".js_shapeW").text(pointsX[1]-pointsX[0]);
    $(".js_shapeH").text(pointsY[1]-pointsY[0]);



  },
  requestCallback : function (requestObject){
    console.log(requestObject)
  }
}
