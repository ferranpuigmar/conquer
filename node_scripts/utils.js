const fs = require("fs");
const root = process.platform === "win32" ? process.cwd() : process.env.PWD;
console.log(process.platform)

const readUsersFile = (path) => {
  let users;
  const absolutePath = `${root}/${path}`;
  try {
    if (fs.existsSync(absolutePath)) {
      users = fs.readFileSync(absolutePath, "utf-8", (err, data) => {
        if (err) {
          return null;
        }

        return data;
      });
      return JSON.parse(users);
    } else {
      fs.writeFileSync(absolutePath, "");

      return null;
    }
  } catch (err) {
    console.log("ERROR: ", err);

    return;
  }
};

const writeUserFiles = (path, data, socket, io) => {
  const absolutePath = `${root}/${path}`;

  fs.writeFile(absolutePath, data, { flag: "w" }, (err) => {
    if (err) {
      throw err;
    } else {
      io.to(socket.id).emit("register_success");
    }
  });
};

module.exports = {
  readUsersFile,
  writeUserFiles,
};
