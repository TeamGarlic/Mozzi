export const drawMask = function(canvas, context, result) {
  // 마스크를 캔버스에 그리는 함수
  // if(!canvas.current) console.log("error");
  if(!canvas) return;
  context.save();
  context.clearRect(
    0,
    0,
    canvas.width,
    canvas.height,
  );
  context.drawImage(
    result.segmentationMask,
    0,
    0,
    canvas.width,
    canvas.height,
  );
  context.restore();
};

export const drawSubscriber = function(canvas, context, video, mask) {
  // 개인 별 캔버스에 영상 합성하는 함수
  // if(!canvas.current) console.log("error");
  // console.log(canvas);
  // console.log(context);
  // if(!canvas) return;
  if(!context) return;

  context.save();

  context.clearRect(
    0,
    0,
    canvas.width,
    canvas.height,
  );
  context.globalCompositeOperation = 'destination-over';


  context.drawImage(
    mask,
    0,
    0,
    canvas.width,
    canvas.height,
  );

  const pixels = context.getImageData(0,0, canvas.width, canvas.height)
  var d = pixels.data;
  for(var i =0; i< d.length; i+=4){
    d[i+3] = d[i]>127?255:0;
  }
  context.putImageData(pixels,0,0);
  context.globalCompositeOperation = 'source-in';
  //

  context.translate(canvas.width, 0);
  context.scale(-1, 1);

  context.drawImage(
    video,
    0,
    0,
    canvas.width,
    canvas.height,
  );

  context.translate(canvas.width, 0);
  context.scale(-1, 1);
  context.restore();
};


// 합성 캔버스에 그리는 함수
export const drawCanvas = function(canvas, context, bgImg, layers) {
  context.current.save();
  context.current.drawImage(
    bgImg,
    0,
    0,
    canvas.current.width,
    canvas.current.height,
  );
  context.current.globalCompositeOperation = 'source-over';
  layers.forEach(item => {
    context.current.drawImage(
      item.image.current,
      canvas.current.width * item.x,
      canvas.current.height * item.y,
      canvas.current.width * item.width,
      canvas.current.height * item.height,
    );
  });
  context.current.restore();
};