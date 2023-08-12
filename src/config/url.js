/* eslint-disable operator-linebreak */
const baseUrl =
  process.env.NODE_ENV === "development" ? "http://localhost:3001" : process.env.BASE_URL;

const inviteUrl =
  process.env.NODE_ENV === "development" ? "http://localhost:3000" : process.env.INVITE_URL;

export { baseUrl, inviteUrl };
