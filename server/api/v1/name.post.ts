export default defineEventHandler(async (event) => {
  // get request body
  const body = await readBody(event);
  console.log("body", body);

  return body;
});
