import { type IncomingMessage, ServerResponse } from "http";

import { respondWithError, respondWithJson } from "./misc";
import { userDb } from "./db";
import { type User } from "./types";
import { StatusCodes } from "http-status-codes";

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
    id: crypto.randomUUID(),
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

export const getSpecificUserHandler = (
  userReference: string,
  req: IncomingMessage,
  res: ServerResponse
) => {
  // query db
  const userQuery = userDb.find((user) => {
    return user.id === userReference;
  });

  if (!userQuery) {
    return respondWithError(
      StatusCodes.NOT_FOUND,
      `User with ID ${userReference} not found!`,
      req,
      res
    );
  }

  return respondWithJson({ user: userQuery }, req, res);
};

export const putSpecificUserHandler = (
  userReference: string,
  requestBody: any,
  req: IncomingMessage,
  res: ServerResponse
) => {
  const { name: newName, email: newEmail, dob: newDob } = requestBody;

  // query db
  const userQuery = userDb.find((user) => {
    return user.id === userReference;
  });

  const userQueryIndex = userDb.findIndex((user) => {
    return user.id === userReference;
  });

  if (!userQuery) {
    return respondWithError(
      StatusCodes.NOT_FOUND,
      `User with ID ${userReference} not found!`,
      req,
      res
    );
  }

  // validate newDob first
  // if Date.parse(dob) is NaN, it means dob can't be parsed as Date
  if (isNaN(Date.parse(newDob))) {
    return respondWithError(400, "Invalid date format!", req, res);
  }

  // only replace the existing data IF the new data (in this case: when newName, newEmail or newDob) is set
  // else, just use the existing data from userQuery
  const newUserData = {
    id: userQuery.id,
    ...(newName ? { name: newName } : { name: userQuery.name }),
    ...(newEmail ? { email: newEmail } : { email: userQuery.email }),
    ...(newDob
      ? { dateOfBirth: new Date(newDob) }
      : { dateOfBirth: userQuery.dateOfBirth }),
  };

  // remove existing data in memory db (using indexOf) and splice in the new one
  userDb.splice(userQueryIndex, 1, newUserData);

  return respondWithJson({ user: newUserData }, req, res);
};

export const deleteSpecificUserHandler = (
  userReference: string,
  req: IncomingMessage,
  res: ServerResponse
) => {
  // query db
  const userQueryIndex = userDb.findIndex((user) => {
    return user.id === userReference;
  });

  if (userQueryIndex === -1) {
    return respondWithError(
      StatusCodes.NOT_FOUND,
      `User with ID ${userReference} not found!`,
      req,
      res
    );
  }

  // remove the referenced data from the db
  userDb.splice(userQueryIndex, 1);

  return respondWithJson(
    {
      message: `Successfuly deleted user with ID ${userReference}`,
    },
    req,
    res
  );
};
