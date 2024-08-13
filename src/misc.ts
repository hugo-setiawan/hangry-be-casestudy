import { type ServerResponse } from "http";
import { getReasonPhrase, StatusCodes } from "http-status-codes";

/**
 * Sends an error response with the specified error code and message.
 *
 * @param {StatusCodes} errorCode - The HTTP status code for the error.
 * @param {string} message - The error message to be sent in the response.
 * @param {ServerResponse} res - The server response object.
 * @returns {void}
 */
export const respondWithError = (
  errorCode: StatusCodes,
  message: string,
  res: ServerResponse
) => {
  res.statusCode = errorCode;

  res.setHeader("Content-Type", "application/json");

  res.end(
    JSON.stringify({
      status: getReasonPhrase(errorCode),
      description: message,
    })
  );
};

/**
 * Sends a JSON response with the specified data and status code.
 *
 * @param {Object} data - The data to be sent in the response.
 * @param {ServerResponse} res - The server response object.
 * @param {StatusCodes} [statusCode=StatusCodes.OK] - The HTTP status code for the response (default is 200 OK).
 * @returns {void}
 */
export const respondWithJson = (
  data: Object,
  res: ServerResponse,
  statusCode = StatusCodes.OK
) => {
  res.statusCode = statusCode;

  res.setHeader("Content-Type", "application/json");

  res.end(
    JSON.stringify({
      status: getReasonPhrase(statusCode),
      data,
    })
  );
};
