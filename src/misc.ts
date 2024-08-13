import http from "http";
import { getReasonPhrase, StatusCodes } from "http-status-codes";

export const respondWithError = (
  errorCode: StatusCodes,
  message: string,
  res: http.ServerResponse
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

export const respondWithJson = (data: Object, res: http.ServerResponse, statusCode = StatusCodes.OK) => {
  res.statusCode = statusCode;

  res.setHeader("Content-Type", "application/json");

  res.end(
    JSON.stringify({
      status: getReasonPhrase(statusCode),
      data,
    })
  );
};
