    url='https://d3yowc8vr7.execute-api.us-east-1.amazonaws.com/Predict/93bd96b5-5c24-4d72-9d05-a04f1998ec33'
    messages={"Safe":"Yay!! The drone is safe!!",
              "NotSafe":"Sorry!! The drone crashed!!"}
    predictionCount=0
      
    function drawMain() {
      var canvas = document.getElementById('mainCanvas');
      var img = document.getElementById("parkingImage");
      var ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
    }

    function acceptInput() {
      var canvas = document.getElementById('mainCanvas');
      function getCursorPosition(canvas, event) {
        const rect = canvas.getBoundingClientRect()
        drawSecond(event.clientX - rect.left,event.clientY - rect.top)
      }
      canvas.addEventListener('mousedown', function(e) {
        getCursorPosition(canvas, e)
      })
    }

    function drawSecond(x,y) {
      var canvas2=document.getElementById('secondCanvas')
      var img2 = document.getElementById("parkingImage");
      var ctx2 = canvas2.getContext('2d');
      var img2w=canvas2.width
      var img2h=canvas2.height
      var x1=roundDown(x,canvas2.width)
      var y1=roundDown(y,canvas2.height)
      console.log("DrawSecond picks image section:",x1,y1)
      ctx2.drawImage(img2,x1,y1,img2w,img2h,0,0,img2w,img2h)
      var dataURL = canvas2.toDataURL();
      console.log("New data URL:",dataURL);
      predictImage(dataURL)
    }

    function roundDown(x,y) {
      // We have two different ways to round down
      // 1. Pick the nearest multiple of y
      // 2. Assume selected point is the center; go back y/2
      var a1= x- x%y
      var a2= x - y/2
      if(a2<0) {
        a2=0
      }
      console.log("Rounding down",x," by ",y," to get:",a1," and ",a2)
      return a2
    }

    function predictImage(dataURL) {
      let encoded = dataURL.toString().replace(/^data:(.*,)?/, '');
      if ((encoded.length % 4) > 0) {
        encoded += '='.repeat(4 - (encoded.length % 4));
      }
      console.log("\n\nEncoded:",encoded);
      fetch(url, {
        method: 'POST',
        body: encoded
      })
      .then(function(response) {
        console.log('Got response:',response)
        return response.json();
      }).then(function(data) {
        console.log('Got data:',data);
        processPrediction(data['predicted_label'])
      })
      .catch(() => { /* Error. Inform the user */ })
      console.log("Just sent image to server")
    }

    function processPrediction(predictedValue) {
      console.log("Processing prediction: ",predictedValue)
      predictionCount = predictionCount + 1
      countPrediction.innerHTML="#"+predictionCount+". "
      valuePrediction.innerHTML=messages[predictedValue]
    }