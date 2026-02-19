const app = require("./src/app");
const mongooseConnection = require("./config/mongoose-connection");

app.listen(3000, () => {
  console.log("Server is running at port 3000!");
});
