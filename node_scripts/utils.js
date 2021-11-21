const fs = require("fs");
const root = process.env.PWD;
const modelsPath = `${root}/models`;

const readFile = async (path) => {
  let data;
  const route = `${modelsPath}/${path}`;
  console.log("ROUTE: ", route);
  try {
    if (fs.existsSync(route)) {
      data = fs.readFileSync(route, "utf-8", (err, dataFile) => {
        if (err) {
          console.log("err: ", err);
          return null;
        }
        console.log("dataFile: ", dataFile);
        return dataFile;
      });

      if (data === "") {
        return null;
      }
      console.log("DATA: ", data);
      return JSON.parse(data);
    } else {
      console.log("no existe...");
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
        console.log("err: ", err);
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
