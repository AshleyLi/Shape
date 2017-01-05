window.Ashley = {
  responseCallback : function (responseObject){
    // Get shape information
    console.log(responseObject)
    console.log('Shape = ' + responseObject.result.segments[0].candidates[0].label)

    // Print basic shape information
    var shapeName = responseObject.result.segments[0].candidates[0].label;
    $(".js_shapeName").text(shapeName);

    var pointsX = [];
    var pointsY = [];
    for ( i = 0 ; i < 4; i++){
        var pointX = Math.floor(responseObject.result.segments[0].candidates[0].primitives[i].firstPoint.x);
        var pointY = Math.floor(responseObject.result.segments[0].candidates[0].primitives[i].firstPoint.y);
        pointsX[i] = pointX;
        pointsY[i] = pointY;

    }
    console.log("pointsX = [" + pointsX + "] , pointsY = [" + pointsY + "]" );

  },
  requestCallback : function (requestObject){
    console.log(requestObject)
  }
}
