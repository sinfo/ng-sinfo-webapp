// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  deckUrl: 'https://deck.sinfo.org',
  cannonUrl: 'https://cannon.sinfo.org',
  currentEvent: '24-sinfo',
  themes: {
    26: 'Software',
    27: 'Multimedia',
    28: 'Security',
    1: 'Games',
    2: 'Web'
  }
}
