const debounce = (fn, wait) => {
  let timer
  let startTimeStamp = 0
  let context
  let args

  const run = (timerInterval) => {
    timer = setTimeout(() => {
      const now = (new Date()).getTime()
      const interval = now - startTimeStamp
      if (interval < timerInterval) {
        startTimeStamp = now
        run(wait - interval)
      } else {
        fn.apply(context, args)
        clearTimeout(timer)
        timer = null
      }
    }, timerInterval)
  }

  return function () {
    context = this
    args = arguments
    const now = (new Date()).getTime()
    startTimeStamp = now

    if (!timer) {
      run(wait)
    }
  }
}
module.exports = {
  debounce,
}
