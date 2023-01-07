import * as fs from "fs";
import * as path from "path";
import { Slot } from "../types/Slot";

export const fromJsonFiles = (slotDir: string, subDir: string) => (): Promise<Slot[]> =>
  new Promise((resolve, reject) => {
    const dir = path.join(slotDir, subDir);
    fs.readdir(dir, function (err, files) {
      if (err) {
        resolve([]);
        // reject("There was an error reading the directory: " + err);
        return;
      }

      const slots: Slot[] = [];
      files.forEach(function (file) {
        const json = JSON.parse(fs.readFileSync(path.join(dir, file), "utf8"));
        slots.push(...json);
      });
      resolve(slots);
    });
  });
