export const drawMyVid = function(canvas, context, result, bgcanvas = null, bgcontext = null) {
  // 로컬 웹캠에서 누끼딴거 캔버스에 그리는 함수
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
  if (bgcanvas) {
    bgcontext.current.clearRect(
      0,
      0,
      bgcanvas.current.width,
      bgcanvas.current.height,
    );
    bgcontext.current.drawImage(
      result.segmentationMask,
      0,
      0,
      bgcanvas.current.width,
      bgcanvas.current.height,
    );
  }
  // Only overwrite existing pixels.
  context.current.globalCompositeOperation = 'source-out';
  context.current.fillStyle = '#00FF00';
  context.current.fillRect(
    0,
    0,
    canvas.current.width,
    canvas.current.height,
  );
  // Only overwrite missing pixels.
  context.current.globalCompositeOperation = 'source-out';
  context.current.drawImage(
    result.image,
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