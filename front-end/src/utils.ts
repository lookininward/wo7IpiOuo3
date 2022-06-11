export const getRandomNumber = (min = 1, max = 3) =>
  Math.floor(Math.random() * (max - min)) + min;