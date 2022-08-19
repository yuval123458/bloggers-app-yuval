const httpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const getCoordinates = require("../util/location");
const Place = require("../models/place");
const User = require("../models/user");
const mongoose = require("mongoose");
const fs = require("fs");

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pId;
  let place;

  try {
    place = await Place.findById(placeId);
  } catch (err) {
    return next(new httpError("could not find place", 500));
  }

  if (!place) {
    const error = new httpError("place is not found for the provided id", 404);
    return next(error);
  }

  res.json({ place: place.toObject({ getters: true }) });
};

const getPlacesByUserId = async (req, res, next) => {
  console.log("GET request for user/uid");
  let userId = req.params.uId;
  let userPlaces;
  let user;

  try {
    user = await User.findById(userId).populate("places");
  } catch (error) {
    return next(new httpError("Could not find response for users places", 404));
  }
  if (!user || user.places.length === 0) {
    return next(new httpError("Could not find places for given user", 404));
  }

  try {
    userPlaces = user.places.map((place) => place.toObject({ getters: true }));
  } catch (err) {
    return next(new httpError("Could not map for users places", 404));
  }

  res.json({
    places: userPlaces,
  });
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(new httpError("could not find data", 422));
  }
  const { title, description, address } = req.body;
  let coordinates;
  try {
    coordinates = await getCoordinates(address);
  } catch (error) {
    return next(error);
  }
  const createdPlace = new Place({
    title,
    description,
    address,
    creatorId: req.userData.userId,
    location: coordinates,
    image: req.file.path,
  });
  let user;

  try {
    user = await User.findById(req.userData.userId);
  } catch (error) {
    return next(new httpError("could not search creator Id", 500));
  }

  if (!user) {
    return next(
      new httpError("could not find a user that match the creator Id", 404)
    );
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdPlace.save({ session: sess });
    user.places.push(createdPlace);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new httpError("creating place failed!", 404);
    return next(error);
  }

  res.status(201).json({ place: createdPlace });
};

const updatePlaceById = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    next(
      new httpError(
        "update is not valid, please try again with correct data",
        422
      )
    );
  }
  const { title, description } = req.body;
  let placeId = req.params.pId;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (error) {
    return next(new httpError("Could not find and update place!", 500));
  }

  if (place.creatorId.toString() !== req.userData.userId) {
    return next(new httpError("you are not allowed!", 401));
  }

  place.title = title;
  place.description = description;

  try {
    await place.save();
  } catch (err) {
    return next(new httpError("Could not save place!", 500));
  }

  res.status(201).json({ updatedPlace: place.toObject({ getters: true }) });
};

const deletePlaceById = async (req, res, next) => {
  let placeId = req.params.pId;
  let place;

  try {
    place = await Place.findById(placeId).populate("creatorId");
  } catch (error) {
    return next(new httpError("Could not delete or populate place!", 500));
  }
  if (!place) {
    return next(new httpError("Could not find place!", 404));
  }

  const imagePath = place.image;

  if (place.creatorId.id !== req.userData.userId) {
    return next(new httpError("you are not allowed!", 401));
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await place.deleteOne({ session: sess });
    place.creatorId.places.pull(place);
    await place.creatorId.save({ session: sess });
    await sess.commitTransaction();
  } catch (error) {
    return next(new httpError("Could not delete from user places!", 500));
  }

  fs.unlink(imagePath, (err) => {
    console.log(err);
  });

  res.status(201).json({ message: "successfully deleted place!" });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlaceById = updatePlaceById;
exports.deletePlaceById = deletePlaceById;
