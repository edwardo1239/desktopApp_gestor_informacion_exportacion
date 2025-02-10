/* eslint-disable prettier/prettier */
export type descarteType = {
    descarteLavado:descarteLavadoType
    descarteEncerado:descarteEncerado
    enf:string
    fecha:string
    predio: predioType
    tipoFruta: string
    _id: string
}

type descarteLavadoType = {
    descarteGeneral:string
    pareja:string
    balin:string
}

type descarteEncerado ={
    descarteGeneral:string
    pareja:string
    balin:string
    extra:string
    suelo:string
}

type predioType = {
    ICA:string
    PREDIO:string
    _id:string
}



export type inventarioDescarteType = {
    descarteLavado: descarteLavadoType
    descarteEncerado: descarteEncerado
}