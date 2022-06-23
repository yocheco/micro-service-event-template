const increaseBackOffTime = (currentBackoffTime:number) => currentBackoffTime * 2
const calculateBackOffDelayMs = (backoffTime:number) => 1000 * (backoffTime + Math.random())

export const backOff = (minTime:number) => (maxTime:number) => (fn:Promise<void>, onErrorEnd:Function, onSuccess:Function, onError:Function) => {
  const _run = (currentTime:number) => (...args:any) => {
    setTimeout(async () => {
      try {
        await fn(...args)
        const result = 'ok'

        if (onSuccess) {
          onSuccess(result)
        }
      } catch (error) {
        if (currentTime >= maxTime) {
          if (onErrorEnd) {
            onErrorEnd(error, ...args)
          }
          return
        }

        if (onError) {
          onError(error)
        }

        _run(increaseBackOffTime(currentTime))(...args)
      }
    }, calculateBackOffDelayMs(currentTime))
  }

  return _run(minTime)
}
