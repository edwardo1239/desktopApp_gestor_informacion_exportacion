/* eslint-disable prettier/prettier */

export const obtener_tipo_fruta = async (): Promise<string[] | Error> => {

    const request = { action: "get_constantes_sistema_tipo_frutas" }
    const response = await window.api.server2(request)
    if (response.status !== 200)
        return new Error(`Code ${response.status}: ${response.message}`)
    return response.data

}