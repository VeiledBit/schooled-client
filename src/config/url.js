/* eslint-disable operator-linebreak */
const baseUrl =
  process.env.NODE_ENV === "development" ? "http://localhost:3001" : process.env.REACT_APP_BASE_URL;

const inviteUrl =
  process.env.NODE_ENV === "development" ? `${window.location.hostname}:3000` : window.location.hostname;

export { baseUrl, inviteUrl };
