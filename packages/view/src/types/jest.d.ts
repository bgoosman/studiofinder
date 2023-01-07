declare global {
  namespace jest {
    interface Matchers<R> {
      toBeSorted(): R;
    }
  }
}

export {};
