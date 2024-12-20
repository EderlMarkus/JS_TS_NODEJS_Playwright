import { config } from "../config.local";
import { MOCKS } from "../mocks";
import { createMocks } from "../mocks/createMocks";

export const log = (message?: any, ...optionalParams: any[]) => {
  if (config.logging) console.log(message, ...optionalParams);
};

export const setParamsForToken = async (tokenConfig, page) => {
  const url = `https://sso100.grz.cloud/as/token.oauth2?${new URLSearchParams(
    tokenConfig
  )
    .toString()
    .replaceAll("%2C", "%20")}`;
  await page.route("https://sso100.grz.cloud/as/token.oauth2?*", (route) => {
    route.continue({ url });
  });
};

export const setRoles = async (
  roles: {
    roles_custom: string[];
    roles_feature: string[];
  },
  page
) => {
  const tokenConfig = config.tokenConfig;
  tokenConfig.roles_custom = roles.roles_custom;
  tokenConfig.roles_feature = roles.roles_feature;
  await setParamsForToken(tokenConfig, page);
};

export const createNewContext = async (browser, contextOptions?: Object) => {
  const context = await browser.newContext(contextOptions);
  await context.clearCookies();
  const portal = await context.newPage();
  if (config.useMocks) await createMocks(portal, MOCKS, false);
  return portal;
};

export const setRolesAndCreateNewContext = async (
  roles: { roles_custom: string[]; roles_feature: string[] },
  browser
) => {
  const portal = await createNewContext(browser);
  await setRoles(roles, portal);
  await portal.goto(`${config.baseUrl}`);
  return portal;
};

export const addRolesAndCreateNewContext = async (
  roles: { roles_custom?: string[]; roles_feature?: string[] },
  browser
) => {
  const roles_custom = [
    ...new Set(
      Array.prototype.concat(
        config.tokenConfig.roles_custom,
        roles.roles_custom ?? []
      )
    ),
  ];
  const roles_feature = [
    ...new Set(
      Array.prototype.concat(
        config.tokenConfig.roles_feature,
        roles.roles_feature ?? []
      )
    ),
  ];
  return setRolesAndCreateNewContext({ roles_custom, roles_feature }, browser);
};

export const removeRolesAndCreateNewContext = async (
  roles: { roles_custom?: string[]; roles_feature?: string[] },
  browser
) => {
  const roles_custom = [
    ...new Set(
      config.tokenConfig.roles_custom.filter(
        (defaultRole) => !roles.roles_custom?.includes(defaultRole)
      )
    ),
  ];
  const roles_feature = [
    ...new Set(
      config.tokenConfig.roles_feature.filter(
        (defaultRole) => !roles.roles_feature?.includes(defaultRole)
      )
    ),
  ];
  return setRolesAndCreateNewContext({ roles_custom, roles_feature }, browser);
};

export const convertHexToRGB = (hex) => {
  hex = hex.replace(/^#/, "");

  const red = parseInt(hex.substring(0, 2), 16);
  const green = parseInt(hex.substring(2, 4), 16);
  const blue = parseInt(hex.substring(4, 6), 16);

  return {
    hex,
    rgbCSSString: `rgb(${red}, ${green}, ${blue})`,
    red: red,
    green: green,
    blue: blue,
  };
};
