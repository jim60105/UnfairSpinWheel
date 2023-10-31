let inThrottle: boolean, lastFn: ReturnType<typeof setTimeout>, lastTime: number;

/**
 * @description: Throttle function
 * @param {Function} fn - The function to be throttled.
 * @param {number} wait - The number of milliseconds to wait before the next function call can be made.
 * @return {Function} - Returns a new function that, when invoked, throttles calls to the original function.
 * @example: throttle(() => console.log('throttle'), 1000)
 * @see {@link https://decipher.dev/30-seconds-of-typescript/docs/throttle/}
 */
export const throttle = (fn: Function, wait: number = 300): Function => {
  return function (this: unknown, ...args: any[]) {
    const context = this;
    if (!inThrottle) {
      fn.apply(context, args);
      lastTime = Date.now();
      inThrottle = true;
    } else {
      clearTimeout(lastFn);
      lastFn = setTimeout(
        () => {
          if (Date.now() - lastTime >= wait) {
            fn.apply(context, args);
            lastTime = Date.now();
          }
        },
        Math.max(wait - (Date.now() - lastTime), 0)
      );
    }
  };
};
