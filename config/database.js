const mongoose = require("mongoose");
// require("dotenv").config();

const dbURI = process.env.DB_STRING;
// const dbOptions = {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// };

// async function dbConnect() {
//   if (mongoose.connections[0].readyState) {
//     console.log("Already connected.");
//     return;
//   }

//   mongoose
//     .connect(dbURI, dbOptions)
//     .then(() => {
//       console.log("Connected to DB");
//     })
//     .catch((err) => {
//       console.log("Oh no:");
//       console.log(err);
//     });

//   console.log("waa");
// }

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
