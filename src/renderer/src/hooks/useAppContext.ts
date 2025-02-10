/* eslint-disable prettier/prettier */

import {
  dataContext,
  eventoServidorContext,
  messageContext,
  seleccionWindowContext,
  statusProcesoContext,
  triggerEventContext,
  userContext
} from "@renderer/App";
import { userType } from "@renderer/types/login";
import { useContext } from "react";



// type seleccionWindowType = (data: string, name: string) => void

type OpenModalFunction = (messageType: string, message: string) => void;

type seleccionWindowType = (data: string, name: string) => void


type AppContextType = {
  user: userType | undefined
  messageModal: OpenModalFunction
  seleccionWindow: seleccionWindowType,
  statusProceso: string
  eventoServidor: string
  triggerServer: boolean
};


export default function useAppContext(): AppContextType {
  const dataGlobal = useContext(dataContext);
  const user = useContext(userContext)
  const statusProceso = useContext(statusProcesoContext)
  const messageModal = useContext(messageContext)
  const seleccionWindow = useContext(seleccionWindowContext)

  //eventos
  const eventoServidor = useContext(eventoServidorContext)
  const triggerServer = useContext(triggerEventContext)


  if (!dataGlobal) {
    throw new Error("Error informes context data global")
  }
  if (!messageModal) {
    throw new Error("Error informes context data messageModal")
  }
  if (!seleccionWindow) {
    throw new Error("Error informes context data seleccionWindow")
  }

  return {
    user,
    messageModal,
    seleccionWindow,
    statusProceso,
    eventoServidor,
    triggerServer
  };
}
