/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly MAIN_VITE_OPENAI_API_KEY: string;
  readonly MAIN_VITE_OPENAI_ORG_ID: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
