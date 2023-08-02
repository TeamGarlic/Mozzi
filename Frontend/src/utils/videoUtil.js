export const drawMask = function(canvas, context, result) {
  // 마스크를 캔버스에 그리는 함수
  // if(!canvas.current) console.log("error");
  if(!canvas.current) return;
  context.current.save();
  context.current.clearRect(
    0,
    0,
    canvas.current.width,
    canvas.current.height,
  );
  context.current.drawImage(
    result.segmentationMask,
    0,
    0,
    canvas.current.width,
    canvas.current.height,
  );
  context.current.restore();
};

// 합성 캔버스에 그리는 함수
export const drawCanvas = function(canvas, context, bgImg, layers) {
  context.current.save();
  // TODO : 배경사진 변경 기능 추가
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