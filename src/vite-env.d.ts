/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_OTS_BASE: string;
  readonly VITE_ENABLE_CERT_PINNING: string;
  readonly VITE_ENABLE_SENTRY: string;
  readonly VITE_SENTRY_DSN: string;
  readonly VITE_DEV_MODE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
