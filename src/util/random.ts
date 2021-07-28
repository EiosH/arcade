const getRandom = () =>
  Math.random() * 10000 + "" + Date.now() + "" + Math.random() * 10000;

export default getRandom;
