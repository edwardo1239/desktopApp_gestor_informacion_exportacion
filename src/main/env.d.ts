/* eslint-disable prettier/prettier */
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly MAIN_VITE_KEY: string
  readonly URL_PRODUCCION_VITE: string,
  readonly MAIN_VITE_SOCKET_PRODUCCION: string
  readonly MAIN_VITE_URL_DESARROLLO: string
  readonly MAIN_VITE_SOCKET_DESARROLLO: string

  // más variables de entorno...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
