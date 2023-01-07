export type Photo = {
  url: string;
  alt: string;
};

const of = (alt: string, url: string) => ({
  url,
  alt,
});

export const Photo = { of };
