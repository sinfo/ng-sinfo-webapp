// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  deckUrl: 'http://localhost:8080',
  cannonUrl: 'http://localhost:8090',
  currentEvent: '26-sinfo',
  previousEvent: '25-sinfo',
  url_to_id: {'26-sinfo': '26-sinfo',
    '25-sinfo':'25-sinfo',
    '24-sinfo':'24-sinfo',
    '23-sinfo':'23-sinfo-conf'
  },
  id_to_url: {'26-sinfo': '26-sinfo',
    '25-sinfo':'25-sinfo',
    '24-sinfo':'24-sinfo',
    '23-sinfo-conf':'23-sinfo'
  },
  themes: {'26-sinfo': [
      'Software',
      'Multimedia',
      'Security',
      'Games',
      'Web'
    ],
    '25-sinfo': [
      'Software',
      'Multimedia',
      'Security',
      'Games',
      'Web'
    ],
    '24-sinfo': [
      'Software',
      'Multimedia',
      'Security',
      'Games',
      'Web'
    ],
    '23-sinfo-conf': [
      'Software',
      'Multimedia',
      'Security',
      'Games',
      'Web'
    ]
  },
  // begin: new Date(2018, 4, 10), // watch out: months begin in 0
  // end: new Date(2018, 4, 14, 23, 59, 59),
  begin: new Date('Jan 28, 2019'),
  end: new Date('Feb 1, 2019'),
  signaturesCardCapacity: 10,
  facebook: {
    appId: '1993609550676550' // development appId
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
