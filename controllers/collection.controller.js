import CustomError from "../utils/customError";
import { asyncHandler } from "../services/asyncHandler";
import Collection from "../models/collection.schema";

export const createCollection = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!name) {
    throw new CustomError("Name is mandatory", 400);
  }

  const collection = await Collection.create({
    name,
  });

  res.status(200).json({
    success: true,
    message: "Collection created with a success",
    collection,
  });
});

export const updateCollection = asyncHandler(async (req, res) => {
  // what values to be updated

  const { id: collectionId } = req.params;
  //  what new values are coming

  const { name } = req.body;

  if (!name) {
    throw new CustomError("Name is mandatory", 400);
  }

  let updatedCollection = await Collection.findByIdAndUpdate(
    collectionId,
    { name },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    success: true,
    message: "Collection updated!",
    updatedCollection,
  });
});

export const deleteCollection = asyncHandler(async (req, res) => {
  const { id: collectionId } = req.params;

  const collectionToDelete = await Collection.findByIdAndDelete(collectionId);

  if (!collectionToDelete) {
    throw new CustomError("collection is not deleted", 400);
  }

  //  if we want to free the variable so that  space is saved
  // collectionToDelete.remove()
  //  ya we know that variables are garbage collected but sometimes it better to unset some variables to save space.

  res.status(200).send({
    success: true,
    message: "Collection was deleted",
    collectionToDelete,
  });
});

export const getAllCollections = asyncHandler(async (req, res) => {
  const collections = await Collection.find();

  if (!collections) {
    throw new CustomError("Collections are empty", 400);
  }
  res.status(200).json({
    success: true,
    message: "all collections are here",
    collections,
  });
});
