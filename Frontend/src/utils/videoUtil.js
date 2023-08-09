export const drawMask = function(canvas, context, result) {
  // 배경 제거된 영상을 캔버스에 그리는 함수
  if(!canvas) return;
  context.save();

  // const cx = canvas.width/2;
  // const cy = canvas.height/2;
  // context.translate(cx,cy);
  // context.rotate(Math.PI/3);
  // context.translate(-cx,-cy);
  // context.filter = "contrast(1.4) sepia(1)";
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
  context.restore();
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
  // console.log(d);
  for(let i =0; i< d.length; i+=4){
    d[i+3] = (d[i]<100&&d[i+1]>100&&d[i+2]<100)?0:255;

    // d[i+3] = (d[i]<30&&d[i+1]>100&&d[i+2]<30)?0:255;
  }
  context.putImageData(pixels,0,0);

  context.restore();
};

// 합성 캔버스에 그리는 함수
export const drawCanvas = function(canvas, context, bgImg, layers) {
  context.save();
  context.drawImage(
    bgImg,
    0,
    0,
    canvas.width,
    canvas.height,
  );
  context.globalCompositeOperation = 'source-over';
  layers.forEach(item => {
    context.drawImage(
      item.image,
      canvas.width * item.x,
      canvas.height * item.y,
      canvas.width * item.width,
      canvas.height * item.height,
    );
  });
  context.restore();
};