const Driver = require("../models/driverModel");
const userController = require("./userController");
const multer = require("multer");
const path = require("path");

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../uploads");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// Create an upload middleware
const upload = multer({
  storage: storage,
  limits: { fileSize: 10485760 }, // Limit the file size to 10MB (you can adjust this)
}).fields([
  { name: "imageOne", maxCount: 1 }, // "imageOne" is the field name in the form
  { name: "imageTwo", maxCount: 1 }, // "imageTwo" is the field name in the form
]);

// Create Driver
// const createDriver = async (req, res) => {
//   try {
//     // Use the upload middleware to handle image uploads
//     upload(req, res, async function (err) {
//       if (err) {
//         return res.status(400).json({ message: "Error uploading images" });
//       }

//       const { userId, name, role, registeredDriverDate, status } = req.body;
//       const imageOne = req.files.imageOne[0].filename; // Get the filename of the uploaded image
//       const imageTwo = req.files.imageTwo[0].filename;

//       //console.log(imageOne);

//       // Check name or email, name or password is empty
//       if (!userId || !name) {
//         return res
//           .status(400)
//           .json({ message: "userId, name fields must be filled" });
//       }

//       // Check if email already exists
//       const existingUser = await Driver.findOne({ userId: userId });
//       if (existingUser) {
//         return res.status(409).json({ message: "Driver already exists" });
//       }

//       // Create new driver
//       const driver = new Driver({
//         userId,
//         name,
//         role,
//         registeredDriverDate,
//         imageOne,
//         imageTwo,
//         status,
//       });
//       await driver.save();

//       // Send a success response
//       res.status(201).json({ message: "Driver created successfully" });
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

const createDriver = async (req, res) => {
  try {
    upload(req, res, async function (err) {
      if (err) {
        return res.status(400).json({ message: "Error uploading images" });
      }

      const { userId, name, role, registeredDriverDate, status } = req.body;
      //const imageOne = req.files.imageOne[0].filename;
      //const imageTwo = req.files.imageTwo[0].filename;

      if (!userId || !name) {
        return res
          .status(400)
          .json({ message: "userId and name fields must be filled" });
      }

      const existingUser = await Driver.findOne({ userId: userId });
      if (existingUser) {
        return res.status(409).json({ message: "Driver already exists" });
      }

      const driver = new Driver({
        userId,
        name,
        role,
        registeredDriverDate,
        // imageOne,
        // imageTwo,
        status,
      });

      await driver.save();

      res.status(201).json({ message: "Driver created successfully" });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

//Get driver by id
const getDriverById = async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);
    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    } else {
      res.status(200).json(driver);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

//Get all drivers
const getAllDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find();
    if (!drivers) {
      return res.status(404).json({ message: "Drivers not found" });
    } else {
      res.status(200).json(drivers);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

//Update driver by id
const updateDriverById = async (req, res) => {
  try {
    const { name, userId, role, registeredDriverDate, status } = req.body;

    let driver = await Driver.findById(req.params.id);
    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    } else {
      driver.userId = userId || driver.userId;
      driver.name = name || driver.name;
      driver.role = role || driver.role;
      driver.registeredDriverDate =
        registeredDriverDate || driver.registeredDriverDate;
      driver.status = status || driver.status;

      driver = await driver.save();

      res.status(200).json({ message: `${driver.name}: updated successfully` });

      // Call the user controller's update method
      const userUpdateResult = await userController.updateUserRoleById(
        driver.userId,
        {
          // Pass the relevant user data for the update
          newRole: role,
        }
      );

      // if (userUpdateResult.error) {
      //   // Handle errors from the user controller
      //   return res.status(500).json({ message: "User update error" });
      // }

      // res.status(200).json({ message: `${driver.name}: updated successfully` });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

//Delete driver by id
const deleteDriverById = async (req, res) => {
  try {
    const driver = await Driver.findByIdAndDelete(req.params.id);
    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    } else {
      //await driver.remove();
      res.status(200).json({ message: "Driver removed" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getDriverById,
  createDriver,
  getAllDrivers,
  updateDriverById,
  deleteDriverById,
};
