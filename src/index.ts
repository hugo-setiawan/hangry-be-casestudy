import http from "http";
import "dotenv/config";

import { routeRequest } from "./routes";

/**
 * Serves incoming HTTP requests by collecting the request body and then
 * passing it to the router function for processing.
 *
 * @param {http.IncomingMessage} req - The incoming request object.
 * @param {http.ServerResponse} res - The server response object.
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
