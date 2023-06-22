require("dotenv").config();
const app = require("./src/app");

const port = process.env.PORT || "3005";

app.listen(port, () => console.log(`listening on port ${port}`));
