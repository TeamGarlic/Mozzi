export const drawMask = function(canvas, context, result) {
  // 배경 제거된 영상을 캔버스에 그리는 함수
  if(!canvas) return;
  context.save();
  context.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
  );
  context.globalCompositeOperation = 'source-out';
  context.drawImage(
    result.segmentationMask,
    0,
    0,
    canvas.width,
    canvas.height,
  );
  context.globalCompositeOperation = 'source-in';
  context.drawImage(
    result.image,
    0,
    0,
    canvas.width,
    canvas.height
  );
  context.globalCompositeOperation = 'destination-over';
  context.fillStyle = '#00FF00';
  context.fillRect(
    0,
    0,
    canvas.width,
    canvas.height,
  );
  context.restore();
};

export const chromaKey = function(canvas, context, video) {
  // 개인 별 캔버스에 영상 합성하는 함수
  // if(!canvas.current) console.log("error");
  // console.log(canvas);
  // console.log(context);
  // if(!canvas) return;
  if(!context) return;

  context.save();

  context.drawImage(
    video,
    0,
    0,
    canvas.width,
    canvas.height,
  );

  const pixels = context.getImageData(0,0, canvas.width, canvas.height)
  let d = pixels.data;
  console.log(d);
  for(let i =0; i< d.length; i+=4){
    d[i+3] = (d[i]<20&&d[i+1]>240&&d[i+2]<20)?0:255;
  }
  context.putImageData(pixels,0,0);



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