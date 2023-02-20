export const environment = {
  production: true,
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
  signaturesCardCapacity: 10,
  signaturesAutoUpdate: 5, //seconds, set to 0 to enable manual update
  facebook: {
    appId: '708252219264170'
  },
  google: {
    clientId: '475922911787-mj5hp1pcb00329tarno2bdeclmh7schr.apps.googleusercontent.com'
  },
  fenix: {
    clientId: '1695915081466129',
    redirectUrl: 'https://app.sinfo.org'
  },
  linkedin: {
    clientId: '78k3k77vq56igl',
    redirectUrl: 'https://app.sinfo.org/login/linkedin'
  },
  microsoft: {
    clientId: '',
    redirectUrl: 'http://app.sinfo.org/login/microsoft',
    authority: 'https://login.microsoftonline.com/common'
  }
}
