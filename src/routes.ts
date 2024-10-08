import http from "http";
import { StatusCodes } from "http-status-codes";

import { respondWithError } from "./misc";
import {
  deleteSpecificUserHandler,
  getAllUsersHandler,
  getSpecificUserHandler,
  postUserHandler,
  updateSpecificUserHandler,
} from "./handlers";

/**
 * Routes the incoming HTTP request to the appropriate handler based on the URL and HTTP request method.
 *
 * @param {string} requestBody - The body of the incoming request.
 * @param {http.IncomingMessage} req - The incoming request object.
 * @param {http.ServerResponse} res - The server response object.
 * @returns {Promise<void>} A promise that resolves when the response has been processed and sent.
 */
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

  let jsonBody;
  if (requestBody) {
    try {
      jsonBody = JSON.parse(requestBody);
    } catch (e) {
      return respondWithError(
        StatusCodes.BAD_REQUEST,
        "Bad request body: request body must be valid JSON!",
        res
      );
    }
  }

  // "/user" URL handler
  if (req.url === "/user") {
    switch (req.method) {
      case "POST":
        return postUserHandler(jsonBody, res);

      case "GET":
        return getAllUsersHandler(res);

      default:
        break;
    }

    // "/user/:id" URL handler
  } else if (/^\/user\/[^/]+$/.test(req.url)) {
    // this should be safe since we tested the url for the second part using the above regex
    const userId = req.url.split("/")[2]!;

    switch (req.method) {
      case "GET":
        return getSpecificUserHandler(userId, res);

      case "PUT":
        return updateSpecificUserHandler(userId, jsonBody, res);

      case "DELETE":
        return deleteSpecificUserHandler(userId, res);

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
