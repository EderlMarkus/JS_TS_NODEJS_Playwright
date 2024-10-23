import { convertHexToRGB } from "./functions";

export const COLORS = {
  ueberweisung: convertHexToRGB("#1c6b65"),
  azv: convertHexToRGB("#0F81B6"),
  finanz: convertHexToRGB("#00a2a5"),
  intzv: convertHexToRGB("#1E88E9"),
  lastschrift: convertHexToRGB("#915b9f"),
  textHighlight: convertHexToRGB("#1c6b65"),
};

export const Viewport = {
  MOBILE: { width: 767, height: 720 },
  TABLET: { width: 1279, height: 720 },
  DESKTOP: { width: 1280, height: 720 },
};
