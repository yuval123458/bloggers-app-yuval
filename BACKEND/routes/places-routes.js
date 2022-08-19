const express = require("express");
const { check } = require("express-validator");
const fileUpload = require("./middleware/file-upload");
const checkAuth = require("./middleware/check-auth");
const router = express.Router();

const placesControllers = require("../controllers/places-controllers");
const { append } = require("express/lib/response");

router.get("/:pId", placesControllers.getPlaceById);

router.get("/user/:uId", placesControllers.getPlacesByUserId);

router.use(checkAuth);

router.post(
  "/",
  fileUpload.single("image"),
  [
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5 }),
    check("address").not().isEmpty(),
  ],
  placesControllers.createPlace
);

router.patch(
  "/:pId",
  [check("title").not().isEmpty(), check("description").isLength({ min: 5 })],
  placesControllers.updatePlaceById
);

router.delete("/:pId", placesControllers.deletePlaceById);

module.exports = router;
