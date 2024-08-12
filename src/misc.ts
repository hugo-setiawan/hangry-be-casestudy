import http from 'http';
import { getReasonPhrase, type StatusCodes } from "http-status-codes";

export const respondWithError = (errorCode: StatusCodes, message: string, req: http.IncomingMessage, res: http.ServerResponse) => {
    res.statusCode = errorCode;

    res.end(JSON.stringify({
        status: getReasonPhrase(errorCode),
        description: message,
    }));
}
