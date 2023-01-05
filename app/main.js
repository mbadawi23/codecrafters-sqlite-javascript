import { open } from "fs/promises";

const COMMANDS = [".dbinfo", ".tables"];

const databaseFilePath = process.argv[2];
const command = process.argv[3];

if (COMMANDS.includes(command)) {
  const databaseFileHandler = await open(databaseFilePath, "r");

  const { buffer: fileHeaderBuffer } = await databaseFileHandler.read({
    length: 100,
    position: 0,
    buffer: Buffer.alloc(100),
  });

  // You can use print statements as follows for debugging, they'll be visible when running tests.
  console.log("Logs from your program will appear here!");

  // Uncomment this to pass the first stage
  const pageSize = fileHeaderBuffer.readUInt16BE(16); // page size is 2 bytes starting at offset 16

  const { buffer: pageHeaderBuffer } = await databaseFileHandler.read({
    length: pageSize,
    position: 100,
    buffer: Buffer.alloc(pageSize),
  });

  const tables = (
    pageHeaderBuffer.toString().match(/CREATE TABLE\s{1}\w+\(*\w*,?\w*\)*/g) ||
    []
  ).map((element) => element.replace("CREATE TABLE", "").trim());

  if (command === ".dbinfo") {
    console.log(`database page size: ${pageSize}`);
    console.log("number of tables: ", tables.length);
  }
  if (command === ".tables") {
    console.log("tables:", ...tables.reverse());
  }
} else {
  throw `Unknown command ${command}`;
}
