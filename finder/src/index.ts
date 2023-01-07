import jsonMinify from "node-json-minify";
import { universe } from "./places/universe";
import { resolvePlace } from "./resolve";
import { ResolvedPlace } from "./types/Place";

const DEBUG = process.env.DEBUG === "true";
if (!DEBUG) {
  console.debug = () => {};
}

resolvePlace(universe, []).then((json: ResolvedPlace) => {
  json.createdAt = new Date().toISOString();
  console.log(jsonMinify(JSON.stringify(json, null, 2)));
});
