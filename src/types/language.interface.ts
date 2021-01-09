export type Languages<Shortcode extends string> = {
  [key in Shortcode]: {
    name: string;
    extends: Shortcode;
  };
};
