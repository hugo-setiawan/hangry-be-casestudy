import { type IncomingMessage, ServerResponse } from "http";
import { respondWithError, respondWithJson } from "./misc";
import { userDb } from "./db";
import { type User } from "./types";

export const postUserHandler = (
  requestBody: any,
  req: IncomingMessage,
  res: ServerResponse
) => {
  const { name, email, dob } = requestBody;

  if (!name || !email || !dob) {
    return respondWithError(400, "Missing request body attributes!", req, res);
  }

  // expects js date format: YYYY-MM-DDTHH:mm:ss.sss+HH:mm
  // if Date.parse(dob) is NaN, it means dob can't be parsed as Date
  if (isNaN(Date.parse(dob))) {
    return respondWithError(400, "Invalid date format!", req, res);
  }

  const parsedDob = new Date(dob);

  const newUser: User = {
    id: "123",
    name,
    email,
    dateOfBirth: parsedDob,
  };

  userDb.push(newUser);

  return respondWithJson({ user: newUser }, req, res);
};

export const getAllUsersHandler = (
  req: IncomingMessage,
  res: ServerResponse
) => {
  // query db
  const allUsers = userDb;
  return respondWithJson({ users: allUsers }, req, res);
};
