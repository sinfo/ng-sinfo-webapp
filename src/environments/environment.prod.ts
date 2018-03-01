export const environment = {
  production: true,
  deckUrl: 'https://deck.sinfo.org',
  cannonUrl: 'https://cannon.sinfo.org',
  currentEvent: '25-sinfo',
  themes: [
    'Software',
    'Multimedia',
    'Security',
    'Games',
    'Web'
  ],
  eventOcurring: new Date() >= new Date(2018, 1, 26) && new Date() <= new Date(2018, 2, 4, 23, 59, 59),
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
