/* eslint-disable prettier/prettier */

export const obtenerDataContenedores = async (setContenedores): Promise<void> => {
    const request = { action: 'get_proceso_aplicaciones_listaEmpaque_contenedores' }
    const response = await window.api.server2(request)
    if (response.status !== 200)
        throw new Error(`Code ${response.status}: ${response.message}`)
    setContenedores(response.data)
}

export const obtenerPredioProcesando = async (setLoteProcesando): Promise<void> => {
    const request = { action: 'get_proceso_aplicaciones_listaEmpaque_lotes' }
    const response = await window.api.server2(request)
    if (response.status !== 200)
        throw new Error(`Code ${response.status}: ${response.message}`)
    console.log(response)
    setLoteProcesando(response.data)
}