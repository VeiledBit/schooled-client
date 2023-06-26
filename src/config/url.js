/* eslint-disable operator-linebreak */
const baseUrl =
  process.env.NODE_ENV === "development" ? "http://localhost:3001" : "";

const inviteUrl =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "";

export { baseUrl, inviteUrl };
