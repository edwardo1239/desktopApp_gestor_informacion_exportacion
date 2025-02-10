/* eslint-disable prettier/prettier */
import { crear_filtro } from "./crearFiltro";

export const requestData = (page, filtro): object => {
    const resultsPerPage = 50;
    const filtroQuery = crear_filtro(filtro)
    return {
        data: {
            query: {
                ...filtroQuery,
                enf: { $regex: '^E', $options: 'i' }
            },
            select: {
                enf: 1,
                tipoFruta: 1,
                contenedores:1,
                calidad1:1,
                calidad15:1,
                calidad2:1
            },
            populate: {
                path: 'predio',
                select: 'PREDIO ICA'
            },
            sort: { "fechaIngreso": -1 },
            limit: resultsPerPage,
            skip: (page - 1) * resultsPerPage
        },
        collection: 'lotes',
        action: 'getLotes',
        query: 'proceso'
    };
}

export const requestContenedores = (ids):object => {
   return {
    data: {
        query: {_id:{$in:ids} },
        select: {numeroContenedor:1},
        sort: { 'infoContenedor.fechaCreacion': -1 },
        limit: 50,
        populate: {
          path: 'infoContenedor.clienteInfo',
          select: 'CLIENTE'
        }
      },
      collection: 'contenedores',
      action: 'getContenedores',
      query: 'proceso'
   }
  }

export const request_guardar_cambios = (lote, formData, user): object => {
    return {
        query: 'proceso',
        collection: 'lotes',
        action: 'modificar_lote',
        record: 'Modificación',
        user: { user: user.user, cargo: user.cargo },
        data: {
            lote: {
                _id: lote._id,
                descarteLavado:formData,
            }
        }
    }
}