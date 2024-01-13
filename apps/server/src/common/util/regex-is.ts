export const regexIs = {
  isUsername: (v: string) => /^[\w-]{4,16}$/.test(v),
};
