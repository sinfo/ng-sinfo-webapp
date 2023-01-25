export const environment = {
  production: true,
  deckUrl: 'https://deck.sinfo.org',
  cannonUrl: 'https://cannon-staging.sinfo.org',
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
    clientId: '744740842123-vqj8fl4sijr329jj5rotvr9a28nn6idg.apps.googleusercontent.com'
  },
  fenix: {
    clientId: '1132965128044878',
    redirectUrl: 'https://app-staging.sinfo.org/login'
  },
  linkedin: {
    clientId: '77i6uer5luxghl',
    redirectUrl: 'https://app-staging.sinfo.org/login/linkedin'
  }
}
