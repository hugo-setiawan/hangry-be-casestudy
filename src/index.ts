import http from "http";

import "dotenv/config";
import { routeRequest } from "./routes";

/**
 * Logika untuk menangani dan menanggapi request dituliskan pada fungsi ini
 *
 * @param request: objek yang berisikan informasi terkait permintaan
 * @param response: objek yang digunakan untuk menanggapi permintaan
 */
const requestListener = (
  req: http.IncomingMessage,
  res: http.ServerResponse
) => {
  // fetch full request body first before deferring to router
  let body: Buffer[] = [];

  req.on("data", (chunk) => {
    body.push(chunk);
  });

  req.on("end", async () => {
    const parsedBody = Buffer.concat(body).toString();
    await routeRequest(parsedBody, req, res);
  });
};

const port = parseInt(process.env.SERVER_PORT!) || 8000;
const host = process.env.SERVER_HOST ?? "0.0.0.0";

const server = http.createServer(requestListener);
server.listen(port, host, () => {
  console.log(`Server is listening on http://${host}:${port}`);
});
