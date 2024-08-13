import { ServerResponse } from "http";

import { respondWithError, respondWithJson } from "./misc";
import { db } from "./db";
import { StatusCodes } from "http-status-codes";

/**
 * Handles the creation of a new user.
 *
 * @param {Object} requestBody - The request body containing user information.
 * @param {string} requestBody.name - The name of the user.
 * @param {string} requestBody.email - The email of the user.
 * @param {string} requestBody.dateOfBirth - The date of birth of the user in YYYY-MM-DDTHH:mm:ss.sss+HH:mm format.
 * @param {ServerResponse} res - The server response object.
 * @returns {Promise<void>} A promise that resolves when the response has been processed and sent.
 */
export const postUserHandler = async (
  requestBody: any,
  res: ServerResponse
) => {
  const { name, email, dateOfBirth } = requestBody;

  if (!name || !email || !dateOfBirth) {
    return respondWithError(400, "Missing request body attributes!", res);
  }

  // expects js date format: YYYY-MM-DDTHH:mm:ss.sss+HH:mm
  // if Date.parse(dateOfBirth) is NaN, it means dob can't be parsed as Date
  if (isNaN(Date.parse(dateOfBirth))) {
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
      dateOfBirth: new Date(dateOfBirth),
    },
  });

  return respondWithJson({ user: newUser }, res, StatusCodes.CREATED);
};

/**
 * Retrieves all users from the database.
 *
 * @param {ServerResponse} res - The server response object.
 * @returns {Promise<void>} A promise that resolves when the response has been processed and sent.
 */
export const getAllUsersHandler = async (res: ServerResponse) => {
  const allUsers = await db.user.findMany();
  return respondWithJson({ users: allUsers }, res);
};

/**
 * Retrieves a specific user by their ID.
 *
 * @param {string} userId - The ID of the user to retrieve.
 * @param {ServerResponse} res - The server response object.
 * @returns {Promise<void>} A promise that resolves when the response has been processed and sent.
 */
export const getSpecificUserHandler = async (
  userId: string,
  res: ServerResponse
) => {
  const userQuery = await db.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!userQuery) {
    return respondWithError(
      StatusCodes.NOT_FOUND,
      `User with ID ${userId} not found!`,
      res
    );
  }

  return respondWithJson({ user: userQuery }, res);
};

/**
 * Updates a specific user's information.
 *
 * @param {string} userReference - The ID of the user to update.
 * @param {Object} requestBody - The request body containing updated user information.
 * @param {string} [requestBody.name] - The new name of the user (optional).
 * @param {string} [requestBody.email] - The new email of the user (optional).
 * @param {string} [requestBody.dateOfBirth] - The new date of birth of the user in YYYY-MM-DDTHH:mm:ss.sss+HH:mm format (optional).
 * @param {ServerResponse} res - The server response object.
 * @returns {Promise<void>} A promise that resolves when the response has been processed and sent.
 */
export const putSpecificUserHandler = async (
  userId: string,
  requestBody: any,
  res: ServerResponse
) => {
  const { name: newName, email: newEmail, dateOfBirth: newDob } = requestBody;

  const userQuery = await db.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!userQuery) {
    return respondWithError(
      StatusCodes.NOT_FOUND,
      `User with ID ${userId} not found!`,
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

  const updatedUser = await db.user.update({
    where: {
      id: userId,
    },
    data: newUserData,
  });

  return respondWithJson({ user: updatedUser }, res);
};

/**
 * Deletes a specific user from the database.
 *
 * @param {string} userId - The ID of the user to delete.
 * @param {ServerResponse} res - The server response object.
 * @returns {Promise<void>} A promise that resolves when the response has been processed and sent.
 */
export const deleteSpecificUserHandler = async (
  userId: string,
  res: ServerResponse
) => {
  const userQuery = await db.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!userQuery) {
    return respondWithError(
      StatusCodes.NOT_FOUND,
      `User with ID ${userId} not found!`,
      res
    );
  }

  // remove the referenced data from the db
  const removedUser = await db.user.delete({
    where: {
      id: userId,
    },
  });

  return respondWithJson({ deletedUser: removedUser }, res);
};
