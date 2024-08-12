import http from 'http';
import { getReasonPhrase, StatusCodes } from "http-status-codes";

export const respondWithError = (errorCode: StatusCodes, message: string, req: http.IncomingMessage, res: http.ServerResponse) => {
    res.statusCode = errorCode;

    res.setHeader("Content-Type", "application/json");

    res.end(JSON.stringify({
        status: getReasonPhrase(errorCode),
        description: message,
    }));
}

export const respondWithJson = (data: Object, req: http.IncomingMessage, res: http.ServerResponse) => {
    res.statusCode = StatusCodes.OK;

    res.setHeader("Content-Type", "application/json");

    res.end(JSON.stringify({
        status: "OK",
        data
    }));
}
