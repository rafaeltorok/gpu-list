const info = (...params: string[]): void => {
  console.log(...params);
};

const error = (...params: string[]): void => {
  console.error(...params);
};

export default { info, error };
