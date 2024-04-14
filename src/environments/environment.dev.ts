export const environment = {
  production: true,
  //cannonUrl: 'https://cannon-staging.sinfo.org',
  cannonUrl: 'http://localhost:8090',
  url_to_id: {
    '28-sinfo': '28-sinfo',
    '27-sinfo': '27-sinfo',
    '26-sinfo': '26-sinfo',
    '25-sinfo': '25-sinfo',
    '24-sinfo': '24-sinfo',
    '23-sinfo': '23-sinfo-conf'
  },
  id_to_url: {
    '28-sinfo': '28-sinfo',
    '27-sinfo': '27-sinfo',
    '26-sinfo': '26-sinfo',
    '25-sinfo': '25-sinfo',
    '24-sinfo': '24-sinfo',
    '23-sinfo-conf': '23-sinfo'
  },
  themes: {
    '31': [
      'Software Engineering',
      'Multimedia',
      'AI',
      'Games',
      'Tech Insights'
    ],
    '30-sinfo': [
      'Software Engineering',
      'Multimedia',
      'AI & ML',
      'Game Dev',
      'Tech Trends'
    ],
    '28-sinfo': [
      'Software Engineering',
      'Multimedia',
      'Cybersecurity',
      'Games',
      'Web & AI'
    ],
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
    clientId: '475922911787-2eunqihjt791ul7kfi1ji185o7mlehq2.apps.googleusercontent.com'
  },
  fenix: {
    clientId: '1132965128044878',
    redirectUrl: 'https://app-staging.sinfo.org/login'
  },
  linkedin: {
    clientId: '77i6uer5luxghl',
    redirectUrl: 'https://app-staging.sinfo.org/login/linkedin'
  },
  microsoft: {
    clientId: 'c572d99a-8c82-47aa-89b4-01dc934858fc',
    redirectUrl: 'https://app-staging.sinfo.org/login/microsoft',
    authority: 'https://login.microsoftonline.com/common'
  }
}
