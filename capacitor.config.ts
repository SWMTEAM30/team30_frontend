import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.thefirsttake.app',
  appName: 'thefirsttake_frontend',
  server: {
    hostname: 'the-first-take-frontend.vercel.app',
    androidScheme: 'https',
  },
};

export default config;
