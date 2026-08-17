const lorem1 =
  "Lorem ipsum dolors it amet consectetur adipiscing elit quisque faucibus ex sapien vitae pellentesque sem placerat in id cursus mi.";

const lorem2 = `
const lorem =
  "Lorem ipsum dolors it amet consectetur adipiscing elit quisque faucibus ex sapien vitae pellentesque sem placerat in id cursus mi.";

const count = (value) => {
  return Math.ceil(value.length / 4);
};

console.log(count(lorem));
`;

const count = (value) => {
  return Math.ceil(value.length / 4);
};

console.log(count(lorem1));
console.log(count(lorem2));
