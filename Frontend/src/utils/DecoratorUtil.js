export const checkHost = function(originFunc, isHost, alertFunc){
  return function(...args){
    if (isHost === 1) {
      return originFunc.apply(this, args)
    }
    return alertFunc(true)
  }
}