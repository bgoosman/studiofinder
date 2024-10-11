import fs from "fs";

export default function logToFile(message: string) {
  if (process.env.LOG_FILE) {
    try {
      fs.appendFileSync(process.env.LOG_FILE, message);
      fs.appendFileSync(process.env.LOG_FILE, "\n");
    } catch (err) {
      console.error(err);
    }
  }
}
