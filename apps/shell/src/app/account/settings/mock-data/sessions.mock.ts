export interface WebBrowserSessionItem {
  browser: {
    name: string;
    type: 'chrome' | 'firefox' | 'opera' | string;
  };
  location: string;
  recentActivity: {
    name: string;
    signedIn: Date;
    ipAddress: string;
  };
}

export interface DeviceSessionItem {
  device: {
    name: string;
    type: 'iphone' | 'ipad' | 'android' | string;
  };
  location: string;
  recentActivity: {
    name: string;
    signedIn: Date;
    ipAddress: string;
  };
}

export const WEB_BROWSERS_TABLE_DATA: WebBrowserSessionItem[] = [
  {
    browser: { name: 'Chrome on Mac OS X', type: 'chrome' },
    location: 'United Kingdom, London',
    recentActivity: { name: 'Current session', signedIn: new Date(), ipAddress: '192.168.0.1' },
  },
  {
    browser: { name: 'Chrome on Linux', type: 'chrome' },
    location: 'United Kingdom, London',
    recentActivity: { name: '15 Apr 2023', signedIn: new Date(), ipAddress: '192.168.0.1' },
  },
  {
    browser: { name: 'Firefox on Linux', type: 'firefox' },
    location: 'USA, New York',
    recentActivity: { name: '20 Jan 2023', signedIn: new Date(), ipAddress: '192.168.0.1' },
  },
  {
    browser: { name: 'Opera on Windows', type: 'opera' },
    location: 'USA, New York',
    recentActivity: { name: '20 Jan 2023', signedIn: new Date(), ipAddress: '192.168.0.1' },
  },
];

export const DEVICES_TABLE_DATA: DeviceSessionItem[] = [
  {
    device: { name: 'Iphone 12 Pro', type: 'iphone' },
    location: 'United Kingdom, London',
    recentActivity: { name: 'Current session', signedIn: new Date(), ipAddress: '192.168.0.1' },
  },
  {
    device: { name: 'Ipad Pro', type: 'ipad' },
    location: 'United Kingdom, London',
    recentActivity: { name: 'about 2 years ago', signedIn: new Date(), ipAddress: '192.168.0.1' },
  },
  {
    device: { name: 'Android', type: 'android' },
    location: 'United Kingdom, London',
    recentActivity: { name: 'about 4 years ago', signedIn: new Date(), ipAddress: '192.168.0.1' },
  },
];
