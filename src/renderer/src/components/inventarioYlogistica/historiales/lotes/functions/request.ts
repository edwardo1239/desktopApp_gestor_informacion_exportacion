/* eslint-disable prettier/prettier */

import { filtroCalidadType, filtrotype } from "./filtroProceso";

export const requestProveedor = {
  action: 'get_sys_proveedores',
  data: "all"
};

export const requestLotes = (filtro: filtrotype | filtroCalidadType): object => {
  return {
    ...filtro,
    action: 'get_inventarios_lotes_infoLotes',
  };
}


export type numeroContenedorType = {
  [key: string]: string
}
