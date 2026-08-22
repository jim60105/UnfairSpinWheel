/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GA_TRACKING_ID: string;
  readonly VITE_CLARITY_TRACKING_ID: string;
  readonly VITE_CLOUDFLARE_RUM_TOKEN: string;
  readonly VITE_PRIMEUI_LICENSE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
