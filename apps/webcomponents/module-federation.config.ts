import { ModuleFederationConfig } from '@nx/module-federation';

const config: ModuleFederationConfig = {
  name: 'webcomponents',
  exposes: {
    './Routes': 'apps/webcomponents/src/app/remote-entry/entry.routes.ts',
    './Button': 'apps/webcomponents/src/app/button/button.ts',
    './Footer': 'apps/webcomponents/src/app/layouts/footer/footer.ts',
    './Header': 'apps/webcomponents/src/app/layouts/header/header.ts',
    './SettingsDrawer': 'apps/webcomponents/src/app/layouts/settings-drawer/settings-drawer.ts',
    './Sidenav': 'apps/webcomponents/src/app/layouts/sidenav/sidenav.ts',
  },
};

/**
 * Nx requires a default export of the config to allow correct resolution of the module federation graph.
 **/
export default config;
