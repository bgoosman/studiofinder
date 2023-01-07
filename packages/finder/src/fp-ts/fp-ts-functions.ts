import * as TE from "fp-ts/TaskEither";

export const wrapUnknownInError = (err: unknown): Error => {
  if (err instanceof Error) {
    return err;
  }
  return new Error(String(err));
};

export const safeJson = (response: Response) =>
  TE.tryCatch((): Promise<unknown> => response.json(), wrapUnknownInError);

export const safeText = (response: Response) =>
  TE.tryCatch((): Promise<string> => response.text(), wrapUnknownInError);

export const safeFetch = (url: string, options?: RequestInit) =>
  TE.tryCatch((): Promise<Response> => fetch(url, options), wrapUnknownInError);

import { parseString } from "xml2js";
export const xmlToJson = (xml: string): TE.TaskEither<Error, unknown> => {
  return TE.tryCatch(
    () =>
      new Promise((resolve, reject) => {
        parseString(xml, (err: unknown, result: unknown) => {
          if (err) {
            reject("Error parsing XML string");
          } else {
            resolve(result);
          }
        });
      }),
    wrapUnknownInError
  );
};
