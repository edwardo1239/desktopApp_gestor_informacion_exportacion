/* eslint-disable prettier/prettier */
export const request_data = (fechaInicio, fechaFin, tipoFruta): object => {
    const fechaMinima = new Date(0); // Fecha mínima (1 de enero de 1970)
    const fechaActual = new Date(); // Fecha actual
    let fruta = tipoFruta;
    // Si fechaInicio es "" o null, usar fecha mínima
    if (!fechaInicio) {
      fechaInicio = fechaMinima;
    } else {
      fechaInicio = new Date(fechaInicio);
    }
  
    // Si fechaFin es "" o null, usar fecha actual
    if (!fechaFin) {
      fechaFin = fechaActual;
    } else {
      fechaFin = new Date(fechaFin);
    }
  
    // Si fechaFin es menor que fechaInicio, usar fecha actual
    if (fechaFin < fechaInicio) {
      fechaFin = fechaActual;
    }
    if(tipoFruta === ''){
      fruta = { $in: ['Limon', 'Naranja'] }
    }
  
    // const  fecha = {fechaIngreso:{ $gte: fechaInicio, $lt: fechaFin }, tipoFruta:tipoFruta}
    return {
        data:{
          fecha:{fechaInicio:fechaInicio, fechaFin:fechaFin},
          query:{ enf: { $regex: '^E', $options: 'i' }, tipoFruta:fruta},
          select : {enf:1,fechaIngreso:1,kilosVaciados:1,calidad1:1,calidad15:1,calidad2:1, rendimiento:1},
          populate:{
            path: 'predio',
            select: 'PREDIO ICA'
          },
          sort:{fechaIngreso: -1},
          limit: 10000000,
        },
        action: 'getInfoIndicadoresProceso',
      };
}