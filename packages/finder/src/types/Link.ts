export enum LinkType {
  Email = "email",
  Url = "url",
}

export type Link = {
  label: string;
  url: string;
  type?: LinkType;
};

export const Link = {
  of: (label: string, url: string, type: LinkType = LinkType.Url): Link => ({
    label,
    url,
    type,
  }),
};
