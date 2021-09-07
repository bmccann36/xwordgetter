

export { Handler }

const Handler = async (event) => {
  console.log("I RUN");
  console.log(process.env.PUZZLE_DATE_OVERRIDE);
}