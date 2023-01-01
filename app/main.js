import { open } from "fs/promises";

const databaseFilePath = process.argv[2];
const command = process.argv[3];

if (command === ".dbinfo") {
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
  console.log(`database page size: ${pageSize}`);

  const { buffer: pageHeaderBuffer } = await databaseFileHandler.read({
    length: pageSize,
    position: 100,
    buffer: Buffer.alloc(pageSize),
  });

  // console.log("pageHeaderBuffer", pageHeaderBuffer.toString());

  const tableCount = (pageHeaderBuffer.toString().match(/CREATE TABLE/g) || [])
    .length;
  console.log("number of tables: ", tableCount);
} else {
  throw `Unknown command ${command}`;
}
