/* eslint-disable prettier/prettier */

import { contenedoresType } from "@renderer/types/contenedoresType"

type PredioDatosType = {
    [key: string]: {
        enf: string;
        predio: string;
        cont: contType,
        tipoFruta: string,
    }
};

type contType = {
    [key: string]: {
        numero: number,
        cajas: number,
        kilos: number
    }
}

export const obtenerResumenPredios = (cont: contenedoresType[], soloHoy: boolean): PredioDatosType => {
    const predios = {}
    cont.forEach(contenedor => {
        contenedor.pallets.forEach(pallet => {
            pallet.EF1.forEach(item => {
                // console.log("por predio", item)
                //se crea el elemento en el objeto
                if (item.lote?._id) {
                    if (soloHoy) {
                        const hoy = new Date().getDate();
                        const fechaItem = new Date(item.fecha).getDate();
                        if (hoy === fechaItem) {
                            if (!Object.prototype.hasOwnProperty.call(predios, item.lote._id)) {
                                predios[item.lote._id] = {
                                    enf: item.lote.enf,
                                    predio: item.lote.predio,
                                    tipoFruta: item.tipoFruta
                                }
                                predios[item.lote._id].cont = {}
                            }
                            if (!Object.prototype.hasOwnProperty.call(predios[item.lote._id].cont, contenedor._id as string)) {
                                predios[item.lote._id].cont[contenedor._id] = {
                                    numero: contenedor.numeroContenedor,
                                    kilos: 0,
                                    cajas: 0
                                }
                            }
                            if (item.tipoCaja !== null || item.cajas !== null) {
                                predios[item.lote._id].cont[contenedor._id].cajas += item.cajas
                                const mult = item.tipoCaja.split('-')[1].replace(",", ".")
                                const kilos = item.cajas * Number(mult)
                                predios[item.lote._id].cont[contenedor._id].kilos += kilos
                            }

                        }

                    } else {
                        if (!Object.prototype.hasOwnProperty.call(predios, item.lote._id)) {
                            predios[item.lote._id] = {
                                enf: item.lote.enf,
                                predio: item.lote.predio,
                                tipoFruta: item.tipoFruta
                            }
                            predios[item.lote._id].cont = {}
                        }
                        if (!Object.prototype.hasOwnProperty.call(predios[item.lote._id].cont, contenedor._id as string)) {
                            predios[item.lote._id].cont[contenedor._id] = {
                                numero: contenedor.numeroContenedor,
                                kilos: 0,
                                cajas: 0
                            }
                        }
                        if (item.tipoCaja !== null) {
                            predios[item.lote._id].cont[contenedor._id].cajas += item.cajas
                            const mult = item.tipoCaja.split('-')[1].replace(",", ".")
                            const kilos = item.cajas * Number(mult)
                            predios[item.lote._id].cont[contenedor._id].kilos += kilos
                        }
                    }

                }
            })
        })
    })
    return predios
}

export type resultadoObtenerresumenContenedores = {
    [key: string]: resumenPorfruta
}

type resumenPorfruta = {
    calibre: datosType,
    calidad: datosType,
    totalCajas: number,
    totalKilos: number
}

type datosType = {
    [key: string]: {
        cajas: number,
        cajasP: number,
        kilos: number,
        kilosP: number,
        pallet: number
    }

}

export const obtenerResumen = (cont: contenedoresType[], soloHoy = '')
    : resultadoObtenerresumenContenedores | null => {

    if (cont === undefined) return null

    const resumen = {}

    cont.forEach(contenedor => {

        contenedor.pallets.forEach(pallet => {
            const calibreSet = new Set()
            const calidadSet = new Set()
            const tipoFrutaSet = new Set()
            pallet.EF1.forEach(item => {
                const { tipoFruta, calibre, calidad, tipoCaja, cajas } = item
                //se crea el elemento en el objeto
                if (!Object.prototype.hasOwnProperty.call(resumen, tipoFruta)) {
                    resumen[tipoFruta] = {
                        calibre: {},
                        calidad: {},
                        totalCajas: 0,
                        totalKilos: 0
                    }
                }
                if (!Object.prototype.hasOwnProperty.call(resumen[tipoFruta].calibre, calibre)) {
                    resumen[tipoFruta].calibre[calibre] = {
                        cajas: 0,
                        cajasP: 0,
                        kilos: 0,
                        kilosP: 0,
                        pallet: 0
                    }
                }
                if (!Object.prototype.hasOwnProperty.call(resumen[tipoFruta].calidad, calidad)) {
                    resumen[tipoFruta].calidad[calidad] = {
                        cajas: 0,
                        cajasP: 0,
                        kilos: 0,
                        kilosP: 0,
                        pallet: 0
                    }
                }
                //se obtiene el peso de la caja
                let kilosToMult

                if (tipoCaja) {
                    const partes = tipoCaja.split('-');
                    if (partes.length > 1) { // Verifica que hay al menos dos partes
                        const kilosStr = partes[1]; // Toma la segunda parte
                        kilosToMult = Number(kilosStr.replace(",", ".")); // Realiza el replace
                    } else {
                        // Manejar el caso donde no hay suficientes partes
                        console.warn('tipoCaja no contiene el formato esperado.');
                        kilosToMult = 0; // O asigna el valor que necesites
                    }
                }
                //si si hay peso
                if (kilosToMult) {

                    if (soloHoy) {
                        console.log(soloHoy);

                        const [year, month, day] = soloHoy.split('-');
                        const diaItem = new Date(item.fecha).getDate();
                        const mesItem = new Date(item.fecha).getMonth();
                        const annoItem = new Date(item.fecha).getFullYear();
                        if (Number(day) === diaItem &&
                            Number(month) === mesItem + 1 &&
                            Number(year) === annoItem) {
                            //lo kilos total
                            const kilos = item.cajas * kilosToMult;
                            //if si mira si solo se requieren los datos de hoy
                            resumen[tipoFruta].calibre[calibre].kilos += kilos
                            resumen[tipoFruta].calibre[calibre].cajas += cajas

                            resumen[tipoFruta].calidad[calidad].kilos += kilos
                            resumen[tipoFruta].calidad[calidad].cajas += cajas

                            resumen[tipoFruta].totalCajas += cajas
                            resumen[tipoFruta].totalKilos += kilos
                        }

                    } else {
                        //lo kilos total
                        const kilos = item.cajas * kilosToMult;
                        //if si mira si solo se requieren los datos de hoy
                        resumen[tipoFruta].calibre[calibre].kilos += kilos
                        resumen[tipoFruta].calibre[calibre].cajas += cajas

                        resumen[tipoFruta].calidad[calidad].kilos += kilos
                        resumen[tipoFruta].calidad[calidad].cajas += cajas

                        resumen[tipoFruta].totalCajas += cajas
                        resumen[tipoFruta].totalKilos += kilos

                    }

                } else {
                    resumen[tipoFruta].calibre[calibre].kilos += 0
                    resumen[tipoFruta].calibre[calibre].cajas += 0

                    resumen[tipoFruta].calidad[calidad].kilos += 0
                    resumen[tipoFruta].calidad[calidad].cajas += 0

                    resumen[tipoFruta].totalCajas += 0
                    resumen[tipoFruta].totalKilos += 0

                }
                calibreSet.add(calibre)
                calidadSet.add(calidad)
                tipoFrutaSet.add(tipoFruta)
            })
            const arrTipoFruta = [...tipoFrutaSet]

            arrTipoFruta.forEach(fruta => {


                const arrCalibre = [...calibreSet]
                arrCalibre.forEach(cal => {
                    if (resumen[fruta as string].calibre[cal as string]) {
                        resumen[fruta as string].calibre[cal as string].pallet += 1

                    }
                })
                const arrCalidad = [...calidadSet]
                arrCalidad.forEach(cal => {
                    if (resumen[fruta as string].calidad[cal as string]) {
                        resumen[fruta as string].calidad[cal as string].pallet += 1

                    }
                })

            })
        })
    })

    Object.keys(resumen).forEach(tipoFruta => {
        const itemFruta = resumen[tipoFruta]
        const kilosTotal = itemFruta.totalKilos
        const cajasTotal = itemFruta.totalCajas
        Object.keys(itemFruta).forEach(tipo => {
            const ca = itemFruta[tipo]
            Object.keys(ca).forEach(key => {
                const item = ca[key]

                item.cajasP = (item.cajas * 100) / cajasTotal
                item.kilosP = (item.kilos * 100) / kilosTotal
            })
        })
    })

    console.log(resumen)
    return resumen
}