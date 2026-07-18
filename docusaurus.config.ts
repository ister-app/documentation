import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import type * as PluginContentDocs from '@docusaurus/plugin-content-docs';

// Content in docs-* and i18n/*/docusaurus-plugin-content-docs-* is synced
// from the release doc zips of ister-app/{player,server,chart} by
// scripts/sync-docs.sh — run `npm run sync:local` before start/build.

function docsPlugin(id: string): [string, PluginContentDocs.Options] {
  return [
    '@docusaurus/plugin-content-docs',
    {
      id,
      path: `docs-${id}`,
      routeBasePath: id,
      sidebarPath: `./sidebars/${id}.ts`,
    },
  ];
}

const config: Config = {
  title: 'Ister',
  tagline: 'Your personal media server',
  favicon: 'img/favicon.png',

  future: {
    v4: true,
  },

  url: 'https://ister.app',
  baseUrl: '/',

  organizationName: 'ister-app',
  projectName: 'documentation',
  trailingSlash: false,

  onBrokenLinks: 'throw',
  onBrokenAnchors: 'warn',
  markdown: {
    // .md parses as CommonMark: the synced architecture docs contain raw
    // generics like <String,Object> that are invalid MDX.
    format: 'detect',
    mermaid: true,
    hooks: {
      onBrokenMarkdownLinks: 'throw',
    },
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'nl'],
    localeConfigs: {
      en: {label: 'English'},
      nl: {label: 'Nederlands'},
    },
  },

  themes: ['@docusaurus/theme-mermaid'],

  plugins: [
    docsPlugin('player'),
    docsPlugin('server'),
    docsPlugin('development'),
  ],

  presets: [
    [
      'classic',
      {
        docs: false,
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/social-card.png',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Ister',
      logo: {
        alt: 'Ister logo',
        src: 'img/logo.svg',
      },
      items: [
        {type: 'docSidebar', sidebarId: 'player', docsPluginId: 'player', position: 'left', label: 'Player'},
        {type: 'docSidebar', sidebarId: 'server', docsPluginId: 'server', position: 'left', label: 'Server'},
        {type: 'docSidebar', sidebarId: 'development', docsPluginId: 'development', position: 'left', label: 'Development'},
        {type: 'localeDropdown', position: 'right'},
        {
          href: 'https://github.com/ister-app',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentation',
          items: [
            {label: 'Player guide', to: '/player'},
            {label: 'Server administration', to: '/server'},
            {label: 'Helm installation', to: '/server/installation-helm'},
            {label: 'Development', to: '/development'},
          ],
        },
        {
          title: 'Source code',
          items: [
            {label: 'Player', href: 'https://github.com/ister-app/player'},
            {label: 'Server', href: 'https://github.com/ister-app/server'},
            {label: 'Helm chart', href: 'https://github.com/ister-app/chart'},
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Ister. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'yaml', 'java', 'dart', 'graphql'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
