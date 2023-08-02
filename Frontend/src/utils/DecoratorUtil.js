export const checkHost = function(originFunc, isHost){
  return function(...args){
    if (isHost == 1) {
      // console.log(isHost)
      return originFunc.apply(this, args)
    }
    // console.log(isHost)
  }
}