
const Handler = async (event) => {
  console.log(event);
  return { "good": "job" };
}

export { Handler }