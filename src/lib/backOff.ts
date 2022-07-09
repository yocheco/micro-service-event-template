class BackOff {
  public delay = async (callback: Function, s: number):Promise<void> => {
    setTimeout(() => {
      callback()
    }, this.calculateBackOffDelayMs(s))
  }

  public calculateBackOffDelayMs = (backoffTime: number) => 1000 * (backoffTime + Math.random())
}

export const backOff = new BackOff()
