export const environment = {
  production: true,
  deckUrl: 'https://deck.sinfo.org',
  cannonUrl: 'http://localhost:8090',
  currentEvent: '25-sinfo',
  themes: [
    'Software',
    'Multimedia',
    'Security',
    'Games',
    'Web'
  ],
  begin: new Date(2018, 1, 26),
  end: new Date(2018, 2, 4, 23, 59, 59),
  eventOcurring: new Date() >= this.begin && new Date() <= this.end,
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
  }
}
