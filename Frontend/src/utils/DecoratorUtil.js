export const checkHost = function(originFunc, isHost){
  return function(...args){
    if (isHost == 1) {
      return originFunc.apply(this, args)
    }
  }
}