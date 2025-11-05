function rollOnce(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function rollTheDice(rolls: number, min: number, max: number) {
  const result: number[] = [];
  for (let i = 0; i < rolls; i++) {
    result.push(rollOnce(min, max));
  }
  return result;
}
