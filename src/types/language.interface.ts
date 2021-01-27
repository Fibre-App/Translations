export type Languages<Shortcode extends string> = {
  [key in Shortcode]: Language<Shortcode>;
};

export type Language<Shortcode> = {
  name: string;
  extends: Shortcode;
};
