// const QRCode = require("../models/QRCode");
// const HistoricalContent = require("../models/HistoricalContent");
// const path = require("path");

// const createQRCode = async (req, res) => {
//   try {
//     const { text } = req.body;
//     let contentType = "text";
//     let contentUrl = null;

//     if (req.file) {
//       contentUrl = path.join("/uploads", req.file.filename);
//       contentType = "file";
//     }

//     const qrCodeData = {
//       text: text || contentUrl,
//       contentType,
//       contentUrl,
//     };

//     const qrCode = new QRCode(qrCodeData);
//     await qrCode.save();

//     const historicalContent = new HistoricalContent({
//       qrCode: qrCode._id,
//       contentType,
//       contentUrl,
//     });

//     await historicalContent.save();

//     res.status(201).send({ qrCodeData: qrCode });
//   } catch (error) {
//     res.status(500).send({ message: error.message });
//   }
// };

// const createQRCode = async (req, res) => {
//   try {
//     const { text } = req.body;
//     let contentType = "text"; // Default to text

//     let contentUrl = null;
//     if (req.file) {
//       // Assuming you want to differentiate content type based on file extension or MIME type
//       const fileExtension = req.file.originalname
//         .split(".")
//         .pop()
//         .toLowerCase(); // Get file extension
//       if (fileExtension === "mp3" || fileExtension === "wav") {
//         contentType = "audio";
//       } else if (fileExtension === "mp4" || fileExtension === "avi") {
//         contentType = "video";
//       } else {
//         contentType = "file"; // Default to file if no specific match
//       }

//       contentUrl = `/uploads/${req.file.filename}`; // Construct the URL
//     }

//     const qrCodeData = {
//       text,
//       contentType,
//       contentUrl: `http://192.168.100.14:5000${contentUrl}`, // Full URL including hostname
//     };

//     const qrCode = new QRCode(qrCodeData);
//     await qrCode.save();

//     const historicalContent = new HistoricalContent({
//       qrCode: qrCode._id,
//       contentType,
//       contentUrl: `http://192.168.100.14:5000${contentUrl}`, // Full URL including hostname
//     });

//     await historicalContent.save();

//     res.status(201).send({ qrCodeData: qrCode });
//   } catch (error) {
//     res.status(500).send({ message: error.message });
//   }
// };

// const getQRCode = async (req, res) => {
//   try {
//     const qrCode = await QRCode.findById(req.params.id);
//     if (!qrCode) {
//       return res.status(404).send({ message: "QR Code not found" });
//     }

//     const historicalContents = await HistoricalContent.find({
//       qrCode: qrCode._id,
//     });

//     res.status(200).send({ qrCode, historicalContents });
//   } catch (error) {
//     res.status(500).send({ message: error.message });
//   }
// };

// module.exports = {
//   createQRCode,
//   getQRCode,
// };

const QRCodeModel = require("../models/QRCode");
const fs = require("fs");
const path = require("path");
const QRCode = require("qrcode");
const { v4: uuidv4 } = require("uuid");

// Ensure the uploads directory exists
const ensureDirectoryExists = (directory) => {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
};
ensureDirectoryExists(path.join(__dirname, "../uploads"));

const createQRCode = async (req, res) => {
  try {
    const text = req.body.text;
    const userId = req.user.id;
    const id = uuidv4();

    const filePath = path.join(__dirname, "../uploads", `${id}.png`);
    // Generate the QR code and save it as a file1
    await QRCode.toFile(filePath, text);

    // Save QR code metadata to the database
    const qrCode = new QRCodeModel({
      text: text,
      filePath: filePath,
      url: `http://192.168.43.85:5000/uploads/${id}.png`,
      user: userId,
      currentContent: null,
    });
    await qrCode.save();
    console.log("QR code created", qrCode);
    res.status(201).send({ qrCodeURL: qrCode.url, text: qrCode.text });
  } catch (error) {
    console.error("Error generating QR code", error);
    res.status(500).send({ message: error.message });
  }
};

const getQRCode = async (req, res) => {
  try {
    const qrCode = await QRCode.findById(req.params.id);
    if (!qrCode) {
      return res.status(404).send({ message: "QR Code not found" });
    }
    res.status(200).send(qrCode);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const getUserQR = async (req, res) => {
  try {
    console.log("finding user qr where user is", req.user.userName);
    const findQr = await QRCodeModel.findOne({ user: req.user.id });

    if (!findQr) {
      console.log("No QR code found");
      return res.status(400).send({ message: "No QR code found" });
    }
    console.log("QR code found is", findQr);
    return res.status(200).send(findQr);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

module.exports = {
  createQRCode,
  getQRCode,
  getUserQR,
};
