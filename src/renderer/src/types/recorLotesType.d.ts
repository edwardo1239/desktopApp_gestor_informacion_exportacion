/* eslint-disable prettier/prettier */
import { lotesType } from "./lotesType";

export type recordLotesType = {
  _id: string;
  operacionRealizada: string;
  documento: lotesType & { descartes: descartesType }; // Extender lotesType con descartes
  fecha: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  user: string;
};

type descartesType = {
  "descarteLavado.balin": number;
  "descarteLavado.descarteGeneral": number;
  "descarteLavado.descompuesta": number;
  "descarteLavado.hojas": number;
  "descarteLavado.pareja": number;
  "descarteLavado.piel": number;
  "descarteEncerado.descarteGeneral": number;
  "descarteEncerado.pareja": number;
  "descarteEncerado.balin": number;
  "descarteEncerado.descompuesta": number;
  "descarteEncerado.extra": number;
  "descarteEncerado.suelo": number;
  "descarteEncerado.frutaNacional": number;
};
