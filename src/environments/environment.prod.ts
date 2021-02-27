export const environment = {
  production: true,
  deckUrl: 'https://deck.sinfo.org',
  cannonUrl: 'https://cannon.sinfo.org',
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
  signaturesCardCapacity: 6,
  signaturesAutoUpdate: 5, //seconds, set to 0 to auto update
  facebook: {
    appId: '708252219264170'
  },
  google: {
    clientId: '744740842123-vqj8fl4sijr329jj5rotvr9a28nn6idg.apps.googleusercontent.com'
  },
  fenix: {
    clientId: '1695915081466129',
    redirectUrl: 'https://app.sinfo.org'
  },
  linkedin: {
    clientId: '78k3k77vq56igl',
    redirectUrl: 'https://app.sinfo.org/login/linkedin'
  }
}
