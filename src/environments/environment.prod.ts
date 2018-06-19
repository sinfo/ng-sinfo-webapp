export const environment = {
  production: true,
  deckUrl: 'https://deck.sinfo.org',
  cannonUrl: 'https://cannon.sinfo.org',
  currentEvent: '26-sinfo',
  previousEvent: '25-sinfo',
  themes: [
    'Software',
    'Multimedia',
    'Security',
    'Games',
    'Web'
  ],
  // begin: new Date(2018, 4, 10), // watch out: months begin in 0
  // end: new Date(2018, 4, 14, 23, 59, 59),
  begin: new Date('Feb 18, 2019'),
  end: new Date('Feb 22, 2019'),
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
    redirectUrl: 'https://sinfo.org/login/linkedIn'
  }
}
