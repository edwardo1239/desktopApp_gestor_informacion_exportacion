/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
const { ipcRenderer } = require('electron')

// Custom APIs for renderer
const api = {

  //#region request renderer to main
  obtenerTheme: async (): Promise<'Dark' | 'Light'> => {
    const response = await ipcRenderer.invoke('obtenerTheme')
    return response
  },
  obtenerCuenta: async (): Promise<unknown> => {
    const response = await ipcRenderer.invoke('obtenerCuenta')
    return response
  },
  cerrarSesion: async (): Promise<unknown> => {
    const response = await ipcRenderer.invoke("cerrarSesion")
    return response
  },
  version: async (): Promise<'Dark' | 'Light'> => {
    const response = await ipcRenderer.invoke('version')
    return response
  },
  crearDocumento: async (datos) => {
    const response = await ipcRenderer.invoke('crearDocumento', datos)
    return response
  },
  updateProgress: (channel, callback) => {
    ipcRenderer.on(channel, (event, ...args) => {
      event.preventDefault
      return callback(...args)
    })
  },
  reload: (callback) => {
    ipcRenderer.on("reload", (_event, value) => { callback(value) })
  },
  Descargar: (callback) => {
    ipcRenderer.on("Descargar", (_event, value) => { callback(value) })
  },
  obtenerFruta: async (): Promise<unknown> => {
    const response = await ipcRenderer.invoke('obtenerFruta')
    return response
  },

  //#region request al servidor
  user2: async (datos): Promise<unknown> => {
    const response = await ipcRenderer.invoke('user2', datos)
    return response
  },
  server2: async (datos) => {
    const response = await ipcRenderer.invoke('server2', datos)
    return response
  },


  //#region eventos del servidor
  status_proceso: (channel, callback) => {
    ipcRenderer.on(channel, (event, ...args) => {
      event.preventDefault
      return callback(...args)
    })
  },
  server_event: (channel, callback) => {
    ipcRenderer.on(channel, (event, ...args) => {
      event.preventDefault
      return callback(...args)
    })
  },


  //enlaces externos
  reporteFallo: async () => {
    const response = await ipcRenderer.invoke("reporteFallo")
    return response
  },
  sugerenciaMejora: async () => {
    const response = await ipcRenderer.invoke("sugerenciaMejora")
    return response
  },
  openExternalLink: async (url) => {
    const response = await ipcRenderer.invoke("openExternalLink", url)
    return response
  },

  //#region remove events

  removeReload: () => {
    ipcRenderer.removeAllListeners('reload')
    ipcRenderer.removeAllListeners('Descargar')
  },
  removeStatus_proceso: (channel, callback) => {
    ipcRenderer.removeListener(channel, callback)
  },

}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
