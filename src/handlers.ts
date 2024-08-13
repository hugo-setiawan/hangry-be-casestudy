import { ServerResponse } from "http";

import { respondWithError, respondWithJson } from "./misc";
import { db } from "./db";
import { StatusCodes } from "http-status-codes";

export const postUserHandler = async (
  requestBody: any,
  res: ServerResponse
) => {
  const { name, email, dob } = requestBody;

  if (!name || !email || !dob) {
    return respondWithError(400, "Missing request body attributes!", res);
  }

  // expects js date format: YYYY-MM-DDTHH:mm:ss.sss+HH:mm
  // if Date.parse(dob) is NaN, it means dob can't be parsed as Date
  if (isNaN(Date.parse(dob))) {
    return respondWithError(400, "Invalid date format!", res);
  }

  // handle unique constraint on email
  const existingUser = await db.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    return respondWithError(400, "User with same email already exists", res);
  }

  const newUser = await db.user.create({
    data: {
      name,
      email,
      dateOfBirth: new Date(dob),
    },
  });

  return respondWithJson({ user: newUser }, res, StatusCodes.CREATED);
};

export const getAllUsersHandler = async (res: ServerResponse) => {
  // query db
  const allUsers = await db.user.findMany();
  return respondWithJson({ users: allUsers }, res);
};

export const getSpecificUserHandler = async (
  userReference: string,
  res: ServerResponse
) => {
  // query db
  const userQuery = await db.user.findUnique({
    where: {
      id: userReference,
    },
  });

  if (!userQuery) {
    return respondWithError(
      StatusCodes.NOT_FOUND,
      `User with ID ${userReference} not found!`,
      res
    );
  }

  return respondWithJson({ user: userQuery }, res);
};

export const putSpecificUserHandler = async (
  userReference: string,
  requestBody: any,
  res: ServerResponse
) => {
  const { name: newName, email: newEmail, dob: newDob } = requestBody;

  const userQuery = await db.user.findUnique({
    where: {
      id: userReference,
    },
  });

  if (!userQuery) {
    return respondWithError(
      StatusCodes.NOT_FOUND,
      `User with ID ${userReference} not found!`,
      res
    );
  }

  // validate newDob first (if it exists)
  // if Date.parse(dob) is NaN, it means dob can't be parsed as Date
  if (newDob && isNaN(Date.parse(newDob))) {
    return respondWithError(400, "Invalid date format!", res);
  }

  // handle unique constraint on email
  const existingUser = await db.user.findUnique({
    where: {
      email: newEmail,
    },
  });

  if (existingUser) {
    return respondWithError(400, "User with same email already exists", res);
  }

  // only replace the existing data IF the new data (in this case: when newName, newEmail or newDob) is set
  // else, just use the existing data from userQuery
  const newUserData = {
    ...(newName ? { name: newName } : { name: userQuery.name }),
    ...(newEmail ? { email: newEmail } : { email: userQuery.email }),
    ...(newDob
      ? { dateOfBirth: new Date(newDob) }
      : { dateOfBirth: userQuery.dateOfBirth }),
  };

  // remove existing data in memory db (using indexOf) and splice in the new one
  // userDb.splice(userQueryIndex, 1, newUserData);
  const updatedUser = await db.user.update({
    where: {
      id: userReference,
    },
    data: newUserData,
  });

  return respondWithJson({ user: updatedUser }, res);
};

export const deleteSpecificUserHandler = async (
  userReference: string,
  res: ServerResponse
) => {
  const userQuery = await db.user.findUnique({
    where: {
      id: userReference,
    },
  });

  if (!userQuery) {
    return respondWithError(
      StatusCodes.NOT_FOUND,
      `User with ID ${userReference} not found!`,
      res
    );
  }

  // remove the referenced data from the db
  const removedUser = await db.user.delete({
    where: {
      id: userReference,
    },
  });

  return respondWithJson({ deletedUser: removedUser }, res);
};
