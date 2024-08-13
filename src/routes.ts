import http from "http";

import { respondWithError } from "./misc";
import { StatusCodes } from "http-status-codes";
import {
  deleteSpecificUserHandler,
  getAllUsersHandler,
  getSpecificUserHandler,
  postUserHandler,
  putSpecificUserHandler,
} from "./handlers";

export const routeRequest = async (
  requestBody: string,
  req: http.IncomingMessage,
  res: http.ServerResponse
) => {
  // truly ensure req.url and req.method is set for strict type-safety
  if (!req.url || !req.method) {
    return respondWithError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Invalid request",
      res
    );
  }

  let parsedBody;
  try {
    parsedBody = JSON.parse(requestBody);
  } catch (e) {
    return respondWithError(
      StatusCodes.BAD_REQUEST,
      "Bad request body: request body must be valid JSON!",
      res
    );
  }

  // "/user" URL handler
  if (req.url === "/user") {
    switch (req.method) {
      case "POST":
        return postUserHandler(parsedBody, res);

      case "GET":
        return getAllUsersHandler(res);

      default:
        break;
    }

    // "/user/:id" URL handler
  } else if (/^\/user\/[^/]+$/.test(req.url)) {
    // this should be safe since we tested the url for the second part using the above regex
    const userReference = req.url.split("/")[2]!;

    switch (req.method) {
      case "GET":
        return getSpecificUserHandler(userReference, res);

      case "PUT":
        return putSpecificUserHandler(userReference, parsedBody, res);

      case "DELETE":
        return deleteSpecificUserHandler(userReference, res);

      default:
        break;
    }
  }

  // catch-all handler when incoming URL doesn't match any path
  return respondWithError(
    StatusCodes.NOT_FOUND,
    `Cannot ${req.method} ${req.url}`,
    res
  );
};
