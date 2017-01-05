window.Ashley = {
  responseCallback : function (responseObject){
    // Get shape information
    console.log(responseObject)
    console.log('Shape = ' + responseObject.result.segments[0].candidates[0].label)

    // Print basic shape information
    var shapeName = responseObject.result.segments[0].candidates[0].label;
    $(".js_shapeName").text(shapeName);

    var points = [];
    for ( i = 0 ; i < 4; i++){

        var pointX = Math.floor(responseObject.result.segments[0].candidates[0].primitives[i].firstPoint.x);
        var pointY = Math.floor(responseObject.result.segments[0].candidates[0].primitives[i].firstPoint.y);
        // points[i][0] = pointX;
        // points[i][1] = pointY;
        console.log("(" + pointX + "," + pointY + ")" );

    }


  },
  requestCallback : function (requestObject){
    console.log(requestObject)
  }
}
