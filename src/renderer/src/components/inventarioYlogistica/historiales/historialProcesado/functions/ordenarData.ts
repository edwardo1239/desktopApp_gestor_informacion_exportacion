/* eslint-disable prettier/prettier */
export const ordensarDataImprimir = (data): object[] => {
    const arrOut = data.map(item => ({
        EF1:item.documento.enf,
        "Nombre del Predio": item.documento.predio.PREDIO,
        Canastillas: (item.documento.kilosVaciados / item.documento.promedio),
        Kilos: item.documento.kilosVaciados,
        "Tipo de fruta": item.documento.tipoFruta,
        Fecha: item.fecha,
        User: item.user
    }))

    return arrOut
}
