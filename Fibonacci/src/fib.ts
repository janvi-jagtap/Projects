/**
 * Returns the n-th Fibonacci number
 * @param n a non-negative integer, indicating which Fibonacci number to return
 * @returns 0 if n = 0, 1 if n = 1, and the sum of the previous two Fibonacci
 *    numbers otherwise
 */
export const fib = (n: number): number => {
  if (n < 0) {
    throw new Error('n must be non-negative');
  } 
  else if (n === 0) {
    return 0;
  }
  else {
    return fastFib(n).curFib;
  }
};


/** Type that stores not just one Fibonacci number but the previous one also. */
export type FibPair = {curFib: number, prevFib: number};

/**
 * Returns the n-th Fibonacci number
 * @param n a positive integer, indicating which Fibonacci number to return
 * @returns a FibPair containing fib(n) (and also fib(n-1))
 */
export const fastFib = (n: number): FibPair => {
  if (n < 1) {
    throw new Error('n must be greater than 0');
  }
  else if (n === 1) {
    const num: FibPair = {curFib: 1, prevFib: 0};
    return num;
  }
  else {
    const previousNum: FibPair = fastFib(n - 1);
    const finalNum: number = previousNum.curFib + previousNum.prevFib;
    const result: FibPair = {curFib: finalNum, prevFib: previousNum.curFib};
    return result;
  }

};


/** Type for storing (fib(n-1), fib(n)) for some n. */
export type FibPair2 = [number, number];

/**
 * Returns the n-th Fibonacci number
 * @param n a positive integer, indicating which Fibonacci number to return
 * @returns the pair containing fib(n)
 */
export const fastFib2 = (n: number): FibPair2 => {
  // TODO: implement this in problem 3
  if (n < 1) {
    throw new Error('n must be greater than 0');
  }
  else if (n === 1) {
    const num: FibPair2 = [0, 1];
    return num;
  }
  else {
    const previousNum: FibPair2 = fastFib2(n - 1);
    const [previous, current] = previousNum;
    const result: FibPair2 = [current, previous + current];
    return result;
  }
  
};


/**
 * Returns the smallest Fibonacci number that is greater than or equal to m.
 * @param m a non-negative integer
 * @returns the smallest Fibonacci number greater than or equal to m
 */
export const nextFib = (m: number): number => {
  if (m < 0) {
    throw new Error('m must be non-negative');
  } else if (m === 0) {
    return 0;
  } else {
    return nextFibHelper(0, 1, m);
  }
};

/**
 * Returns the smallest Fibonacci number that is greater than or equal to m.
 * @param prevFib the Fibonacci number before curFib
 * @param curFib the current Fibonacci number (working up to m)
 * @param m the lower bound on the Fibonacci number
 * @returns the smallest Fibonacci number greater than or equal to m
 */
const nextFibHelper = (prevFib: number, curFib: number, m: number): number => {
  // TODO: implement this in problem 4
  if (curFib >= m) {
    return curFib;
  }
  else {
    return nextFibHelper(curFib, prevFib + curFib, m);
  } 
};

