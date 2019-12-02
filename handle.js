const fs = require("fs");
const { resolve } = require("path");
const glob = require("glob");
const axios = require("axios");
const { type, equals } = require("ramda");
const configure = require("../../wiloke.test.api.json");

const { axiosDefaults } = configure;
const testPath = resolve(__dirname, "../../");
const path = process.argv[2];
const files = glob.sync(`${testPath}/${path}/**/*.test.api.*`);
let count = 0;

function log(str, color = 36) {
  return console.log(`\x1b[${color}m${str}\x1b[0m`);
}

function getAPI(content) {
  const contentMatch = content.match(/getData\(.*\)/g);
  if (!contentMatch) {
    return "";
  }
  return content
    .match(/getData\(.*\)/g)[0]
    .replace(/getData\(("|')|("|')\)/g, "");
}

function getJs(content) {
  return content
    .match(/<@received>.*([\s\S]*?)<\/@received>/g)[0]
    .replace(/<(\/|)@received>/g, "");
}

function handleArr(value) {
  return value.map(item => {
    if (type(item) === "Object") {
      return handleReplaceValueToTypeof(item);
    }
    if (type(item) === "Array") {
      return handleArr(item);
    }
    return typeof item;
  });
}

function handleReplaceValueToTypeof(data) {
  if (type(data) === "Array") {
    return handleArr(data);
  }
  if (type(data) === "Object") {
    return Object.keys(data).reduce((acc, key) => {
      const value = data[key];
      if (type(value) === "Array") {
        return {
          ...acc,
          [key]: handleArr(value)
        };
      }
      if (type(value) === "Object") {
        return {
          ...acc,
          [key]: handleReplaceValueToTypeof(value)
        };
      }
      return {
        ...acc,
        [key]: typeof value
      };
    }, {});
  }
  return typeof data;
}

function getData(content) {
  const data = JSON.parse(
    content
      .match(/<@expected>.*([\s\S]*?)<\/@expected>/g)[0]
      .replace(/<(\/|)@expected>/g, "")
  );
  return handleReplaceValueToTypeof(data);
}

async function handleFetchAPI(api, js, expected, file) {
  const apiLog = api.includes("http") ? api : `${axiosDefaults.baseURL}${api}`;
  const divider = `____________________________________________________________________________________`;
  try {
    const { data } = await axios.get(api);
    const getReceived = new Function(
      "input",
      `const getData = () => input;${js}`
    );
    const received = handleReplaceValueToTypeof(getReceived(data));
    const isEqual = equals(expected, received);
    log(
      `${!count ? `${divider}\n\n` : ""} ${isEqual ? "✔" : "✘"}  ${file.replace(
        /.*(\/|\\)/g,
        ""
      )} ${
        isEqual ? "[success]" : "[wrong data structure]"
      }: ${apiLog}\n${divider}\n`,
      isEqual ? 32 : 31
    );
    // if (!isEqual) {
    //   console.log(expected);
    //   console.log(received);
    // }
  } catch (err) {
    log(
      `${!count ? `${divider}\n\n` : ""} ✘  ${file.replace(
        /.*(\/|\\)/g,
        ""
      )} [api error]: ${apiLog}\n\n ${err}\n${divider}\n`,
      31
    );
  } finally {
    count++;
    if (count === files.length) {
      process.exit();
    }
  }
}

function initial() {
  console.log("\n 🚀  Testing...\n");
  files.forEach((file, index) => {
    fs.readFile(file, "utf8", (err, content) => {
      if (err) throw err;
      const api = getAPI(content);
      const js = getJs(content);
      const expected = getData(content);
      handleFetchAPI(api, js, expected, file);
    });
  });
}

module.exports = initial;
