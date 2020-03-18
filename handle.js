const fs = require("fs");
const { resolve } = require("path");
const glob = require("glob");
const axios = require("axios");
const { type, equals } = require("ramda");

const testPath = resolve(__dirname, "../../");
const path = process.argv[2];
const file =
  (process.argv[3] === "--file" && process.argv[4].includes("test.api.")
    ? process.argv[4]
    : "*.test.api.*") ||
  (process.argv[5] === "--file" && process.argv[6].includes("test.api.")
    ? process.argv[4]
    : "*.test.api.*");
const baseURL =
  (process.argv[3] === "--baseURL" && process.argv[4].includes("http")
    ? process.argv[4]
    : "") ||
  (process.argv[5] === "--baseURL" && process.argv[6].includes("http")
    ? process.argv[4]
    : "");
const files = glob.sync(`${testPath}/${path}/**/${file}`);
let count = 0;

axios.defaults.baseURL = baseURL;

function log(str, color = 36) {
  return console.log(`\x1b[${color}m${str}\x1b[0m`);
}

function getJsReceived(content) {
  return content
    .match(/<@received>.*([\s\S]*?)<\/@received>/g)[0]
    .replace(/<(\/|)@received>/g, "");
}

function handleArr(value) {
  return [value[0]].map(item => {
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

async function handleFetchAPI(jsReceived, expected, file) {
  const url = jsReceived
    .match(/axios\.get\(.*("|')/g)[0]
    .replace(/axios\.get\(|"|'/g, "");
  const divider = `____________________________________________________________________________________`;
  try {
    const getReceived = new Function(
      "axios",
      `
      const result = async () => {
        ${jsReceived}
      };
      return result();
    `
    );
    const response = await getReceived(axios);
    const received = handleReplaceValueToTypeof(response);
    const isEqual = equals(expected, received);
    log(
      `${!count ? `${divider}\n\n` : ""} ${isEqual ? "✔" : "✘"}  ${file.replace(
        /.*(\/|\\)/g,
        ""
      )} ${
        isEqual ? "[success]" : "[wrong data structure]"
      }: ${url}\n${divider}\n`,
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
      )} [api error]: ${err.request.responseURL ||
        url}\n\n ${err}\n${divider}\n`,
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
      const jsReceived = getJsReceived(content);
      const expected = getData(content);
      handleFetchAPI(jsReceived, expected, file);
    });
  });
}

module.exports = initial;
