/* eslint-disable prettier/prettier */
import { EF1Type, palletType } from "@renderer/types/contenedoresType";

// type requestGuardarType = {
//   data: contenedoresType
//   collection:string
//   action: string
//   query: string
//   record :string
// }

export const crearObjetoContenedor = (formState: FormStateType):object => {
    const subDocumentos = [] as palletType[]
    const data = {
      cliente: formState.cliente,
      numeroContenedor: Number(formState.numeroContenedor),
      pallets: Number(formState.pallets),
      tipoFruta: formState.tipoFruta,
      desverdizado: formState.desverdizado,
      observaciones: formState.observaciones,
      fechaInicioProceso: formState.fechaInicioProceso,
      fechaEstimadaCargue: formState.fechaEstimadaCargue,
      calidad: formState.calidad,
      tipoCaja: formState.tipoCaja,
      calibres: formState.calibres,
      sombra: formState.sombra,
      defecto: formState.defecto,
      mamcha: formState.mancha,
      verdeManzana: formState.verdeMzn,
      cajasTotal: formState.cajas,
      rtoEstimado: formState.rtoEsrimado
    }

    for (let i = 1; i<=data.pallets; i++){
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const subDocumento: any = {
            EF1: [] as EF1Type[],
            listaLiberarPallet: {
              rotulado: false,
              paletizado: false,
              enzunchado: false,
              estadoCajas: false,
              estiba: false,
            },
            settings: {
              tipoCaja: "",
              calidad: 0,
              calibre: 0,
            },
          };
  
          subDocumentos.push(subDocumento);
    }

    const new_contenedor = {

        numeroContenedor: data.numeroContenedor,
        infoContenedor:{
            clienteInfo: data.cliente as string,
            tipoFruta: data.tipoFruta,
            fechaCreacion: new Date().toUTCString(),
            fechaEstimadaCargue: data.fechaEstimadaCargue,
            fechaFinalizado: '',
            fechaSalida:'',
            fechaInicio: data.fechaInicioProceso,
            desverdizado: data.desverdizado,
            observaciones: data.observaciones,
            cerrado: false,
            tipoCaja: data.tipoCaja,
            calidad: data.calidad,
            calibres: data.calibres,
            sombra:data.sombra,
            defecto:data.defecto,
            mancha:data.mamcha,
            verdeManzana:data.verdeManzana,
            cajasTotal:data.cajasTotal,
            rtoEstimado:data.rtoEstimado,
            ultimaModificacion: new Date().toString(),
        },
        pallets: subDocumentos,

    }

    const request = {
      data: new_contenedor,
      action: 'post_comercial_contenedor',
    }
    return request;
}


export const formInit:FormStateType  = {
  cliente: '',
  numeroContenedor: '',
  tipoFruta: '',
  desverdizado: false,
  fechaInicioProceso: '',
  fechaEstimadaCargue: '',
  calidad:[],
  tipoCaja:[],
  sombra:'',
  defecto:'',
  mancha:'',
  verdeMzn:'',
  calibres: [],
  pallets: '',
  cajas:'',
  totalFruta:'',
  rtoEsrimado:'',
  observaciones: '',
}

export const requestClientes = {
  action: 'get_data_clientes',
}


export interface FormStateType {
  cliente: string;
  numeroContenedor: string;
  tipoFruta: string;
  desverdizado: boolean;
  fechaInicioProceso: string;
  fechaEstimadaCargue: string;
  calidad: string[];  // Ajusta el tipo según tu necesidad
  tipoCaja: string[];  // Ajusta el tipo según tu necesidad
  sombra: string;
  defecto: string;
  mancha: string;
  verdeMzn: string;
  calibres: string[];
  pallets: string;
  cajas: string;
  totalFruta: string;
  rtoEsrimado: string;
  observaciones: string;
}