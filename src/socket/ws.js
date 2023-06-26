import io from "socket.io-client";
import { baseUrl } from "../config/url";

const ws = io.connect(baseUrl);

export default ws;
