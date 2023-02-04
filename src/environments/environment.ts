// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  deckUrl: 'https://deck-staging.sinfo.org',
  cannonUrl: 'http://localhost:8090',
  url_to_id: {
    '27-sinfo': '27-sinfo',
    '26-sinfo': '26-sinfo',
    '25-sinfo': '25-sinfo',
    '24-sinfo': '24-sinfo',
    '23-sinfo': '23-sinfo-conf'
  },
  id_to_url: {
    '27-sinfo': '27-sinfo',
    '26-sinfo': '26-sinfo',
    '25-sinfo': '25-sinfo',
    '24-sinfo': '24-sinfo',
    '23-sinfo-conf': '23-sinfo'
  },
  themes: {
    '27-sinfo': [
      'Software Engineering',
      'Multimedia',
      'Cybersecurity',
      'Games',
      'Web & UX'
    ],
    '26-sinfo': [
      'Software',
      'Multimedia',
      'Security',
      'Games',
      'AI'
    ],
    '25-sinfo': [
      'Software',
      'VR',
      'Security',
      'Games',
      'Web'
    ],
    '24-sinfo': [
      'Software Engineering',
      'Multimedia',
      'Security',
      'Games',
      'Disruptive Technology'
    ],
    '23-sinfo-conf': [
      'Dev Ops',
      'Multimedia',
      'Security',
      'Games',
      'Software Engineering'
    ]
  },
  signaturesCardCapacity: 10,
  signaturesAutoUpdate: 5, //seconds, set to 0 to enable manual update
  facebook: {
    appId: '1993609550676550' // development appId
  },
  google: {
    clientId: '744740842123-4fs8tbutopitaqpfsk3rnhkkdkut7q3d.apps.googleusercontent.com'
  },
  fenix: {
    clientId: '1977390058176863',
    redirectUrl: 'http://localhost:4201'
  },
  linkedin: {
    clientId: '77i6uer5luxghl',
    redirectUrl: 'http://localhost:4201/login/linkedin'
  },
  microsoft: {
    clientId: '',
    redirectUrl: 'http://localhost:4201/login/microsoft',
    authority: 'common'
  }
}
