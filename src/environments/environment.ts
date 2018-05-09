// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  deckUrl: 'https://deck.sinfo.org',
  // cannonUrl: 'http://localhost:8090',
  cannonUrl: 'https://cannon.sinfo.org',
  currentEvent: '26-sinfo',
  themes: [
    'Software',
    'Multimedia',
    'Security',
    'Games',
    'Web'
  ],
  // begin: new Date(2018, 4, 10), // watch out: months begin in 0
  // end: new Date(2018, 4, 14, 23, 59, 59),
  begin: null,
  end: null,
  signaturesCardCapacity: 10,
  facebook: {
    appId: '708252219264170'
  },
  google: {
    clientId: '744740842123-vqj8fl4sijr329jj5rotvr9a28nn6idg.apps.googleusercontent.com'
  },
  fenix: {
    clientId: '1132965128044545',
    redirectUrl: 'https://sinfo.org/login'
  },
  linkedIn: {
    clientId: '78k3k77vq56igl',
    redirectUrl: 'http://localhost:4200/login/linkedIn'
  }
}
