const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

db_conn().catch((e) => {
  console.log("DB not connected" + e);
});

async function db_conn() {
  // console.log("DB connected", process.env.MONGODB_URL);
  await mongoose.connect(process.env.MONGODB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
}
