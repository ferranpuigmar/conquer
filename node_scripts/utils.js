const fs = require("fs");
const root = process.platform === "win32" ? process.cwd() : process.env.PWD;
console.log(process.platform)

const readFile = async (path) => {
  let data;
  const route = `${modelsPath}/${path}`;
  try {
    if (fs.existsSync(route)) {
      data = fs.readFileSync(route, "utf-8", (err, dataFile) => {
        if (err) {
          console.log("err: ", err);
          return null;
        }
        return dataFile;
      });

      if (data === "") {
        return null;
      }
      return JSON.parse(data);
    } else {
      return null;
    }
  } catch (err) {
    console.log("ERROR: ", err);
    return;
  }
};

const writeFile = (path, data, callback) => {
  const route = `${modelsPath}/${path}`;
  const dataToJSON = JSON.stringify(data, null, 4);
  try {
    return fs.writeFile(route, dataToJSON, { flag: "w" }, (err) => {
      if (err) {
        return false;
      } else {
        callback();
      }
    });
  } catch (err) {
    console.log("err: ", err);
    return false;
  }
};

module.exports = {
  readFile,
  writeFile,
};
