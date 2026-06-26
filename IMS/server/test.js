const bcrypt = require("bcrypt");

const password = "admin1234";

bcrypt.hash(password, 10, (err, hash) => {
  if (err) console.log(err);
  console.log(hash);
});