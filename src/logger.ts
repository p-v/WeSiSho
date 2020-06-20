const DEBUG = true;
const log = (msg: string): void => {
  if (DEBUG) {
    console.log(msg);
  }
};

export default { log };
