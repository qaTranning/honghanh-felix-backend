import colorsConfig from "./client/assets/base/colors";
import screensConfig from "./client/assets/base/screens";

export default {
  theme: {
    extend: {
      colors: {
        ...colorsConfig,
      },
      screens: {
        ...screensConfig,
      },
    },
  },
  corePlugins: {
    preflight: false,
  },
  content: ["./client/**/*.{js,vue,ts}"],
};
