/* eslint-disable prettier/prettier */

export const requestLotes = {
  action: 'get_calidad_ingresos_calidadInterna'
}

export const new_lote = (formulario): object => {
  if(
    Number(formulario.acidez1) === 0 ||
    Number(formulario.acidez2) === 0 ||
    Number(formulario.acidez3) === 0 
  ) throw new Error(" los datos de la acidez no puede ser 0")
    
    if(Number(formulario.pesoInicial) === 0 )
      throw new Error(" los datos del peso no pueden ser 0")
  return {
    "calidad.calidadInterna.zumo": Number(formulario.zumo),
    "calidad.calidadInterna.peso": Number(formulario.pesoInicial),
    "calidad.calidadInterna.brix": (Number(formulario.brix1) + Number(formulario.brix2) + Number(formulario.brix3)) / 3,
    "calidad.calidadInterna.acidez": (Number(formulario.acidez1) + Number(formulario.acidez2) + Number(formulario.acidez3)) / 3,
    "calidad.calidadInterna.semillas": Boolean(formulario.semillas),
    "calidad.calidadInterna.ratio":
      (Number(formulario.brix1) / Number(formulario.acidez1) +
        Number(formulario.brix2) / Number(formulario.acidez2) +
        Number(formulario.brix3) / Number(formulario.acidez3)) / 3,
    "calidad.calidadInterna.fecha": new Date().toUTCString()

  }
}