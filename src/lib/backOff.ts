const calculateBackOffDelayMs = (backoffTime: number) => 1000 * (backoffTime + Math.random())

class BackOff {
  public delay = async (callback: Function, s: number):Promise<void> => {
    setTimeout(() => {
      callback()
    }, calculateBackOffDelayMs(s))
  }
}

export const backOff = new BackOff()
