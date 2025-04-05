/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { ElectronAPI } from '@electron-toolkit/preload'
import { descarteType } from '@renderer/components/inventarioDescarte/types/descartes'
import { serverResponse } from '@renderer/types/login'

export interface Api {

  //request al sistema
  obtenerTheme: () => Promise<'Dark' | 'Ligth'>
  version: () => Promise<any>
  obtenerCuenta: () => Promise<any>
  reload: (callback) => any
  crearDocumento: (datos) => void
  Descargar: (callback) => any
  cerrarSesion: () => Promise<any>
  updateProgress: (data, callback) => any
  obtenerFruta: () => Promise<any>

  //request al servidor
  user2: (datos) => Promise<serverResponse>
  server2: (datos) => Promise<serverResponse>

  //links externos
  reporteFallo: () => Promise<void>
  sugerenciaMejora: () => Promise<void>
  openExternalLink: (url) => Promise<void>


  //data del servidor
  status_proceso: (channel, callback) => void

  //seria el unico
  server_event: (channel, callback) => void


  //remove
  removeReload: () => any
  removeStatus_proceso: (channel, callback) => void

}

declare global {
  interface Window {
    electron: ElectronAPI
    api: Api
  }
}

export interface DescartesCallback {
  (data: descarteType[]): void
}
