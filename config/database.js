const mongoose = require("mongoose");
const dbURI = process.env.DB_STRING;

const dbConnect = () => {
  if (mongoose.connections[0].readyState) {
    console.log("Already connected.");
    return;
  }

  mongoose.connect(dbURI, {}, (err) => {
    if (err) throw err;
    console.log("Connected to mongodb.");
  });
};

export default dbConnect;

module.exports = {
  dbConnect,
  dbURI,
};
