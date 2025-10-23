export function doSomeHeavyTask() {
  const time = Math.floor(Math.random() * 200);
  return new Promise((resolve, reject) => {
    if (time % 2 && time >= 150) {
      setTimeout(() => {
        reject(new Error());
      }, time);
    } else {
      setTimeout(() => {
        resolve(time);
      }, time);
    }
  });
}
