import http from "http";
import { respondWithError } from "./misc";
import { StatusCodes } from "http-status-codes";

export const routeRequest = (
  req: http.IncomingMessage,
  res: http.ServerResponse
) => {
  res.setHeader("Content-Type", "application/json");

  if (!req.url) {
    return respondWithError(StatusCodes.INTERNAL_SERVER_ERROR, "no req.url", req, res);
  }

  if (req.url === "/user") {
    console.log("/user");
  }

  if (/^\/user\/[^/]+$/.test(req.url)) {
    const reference = req.url.split("/")[2];
    console.log("/user subpath", reference);
  }

  // catch all handler when incoming URL doesn't match any path
  return respondWithError(
    StatusCodes.NOT_FOUND,
    `No handler for path ${req.url}`,
    req,
    res
  );
};
