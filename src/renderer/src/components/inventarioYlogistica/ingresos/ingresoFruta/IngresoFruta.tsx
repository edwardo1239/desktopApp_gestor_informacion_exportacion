/* eslint-disable prettier/prettier */
import { useEffect, useState } from 'react'
import { proveedoresType } from '@renderer/types/proveedoresType';
import * as strings from './json/strings_ES.json';
import { crear_request_guardar, formType } from './functions/functions';
import useAppContext from '@renderer/hooks/useAppContext';
import "@renderer/css/components.css"
import "@renderer/css/form.css"
import { obtener_proveedores } from '@renderer/functions/SystemRequest';


//recordar despues cambiar para que inventario quede en un item aparte, pues canastilla en inventario va a caqmbiar a un solo json
export default function IngresoFruta(): JSX.Element {
  const { messageModal, setLoading } = useAppContext();
  const [prediosDatos, setPrediosData] = useState<proveedoresType[]>([])
  const [formState, setFormState] = useState<formType>();

  const [enf, setEnf] = useState<string>()
  const [enf8, setEnf8] = useState<string>()
  const [tiposFrutas, setTiposFrutas] = useState<string[]>()

  const obtenerPredios = async (): Promise<void> => {
    try {
      const response = await obtener_proveedores("activos")
      if (response instanceof Error) {
        throw response
      }
      const data = response.sort((a: proveedoresType, b: proveedoresType) => a.PREDIO.localeCompare(b.PREDIO));

      setPrediosData(data)
    } catch (err) {
      if (err instanceof Error) {
        messageModal("error", err.message)
      }
    }
  }
  const obtener_ef1 = async (): Promise<void> => {
    try {
      const request = { action: "get_inventarios_ingresos_ef1" }
      const response = await window.api.server2(request)
      if (response.status !== 200)
        throw new Error(`Code ${response.status}: ${response.message}`)
      setEnf(response.data)
    } catch (err) {
      if (err instanceof Error) {
        messageModal("error", err.message)
      }
    }
  }
  const obtener_ef8 = async (): Promise<void> => {
    try {
      const request = { action: "get_inventarios_ingresos_ef8" }
      const response = await window.api.server2(request)
      if (response.status !== 200)
        throw new Error(`Code ${response.status}: ${response.message}`)
      setEnf8(response.data)
    } catch (err) {
      if (err instanceof Error) {
        messageModal("error", err.message)
      }
    }
  }
  const obtenerTipoFruta = async (): Promise<void> => {
    try {
        const response = await window.api.obtenerFruta()
        setTiposFrutas(response)
    } catch (err) {
        if (err instanceof Error)
            messageModal("error", `Error obteniendo fruta ${err.message}`)
    }
}
  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        setLoading(true);
        await obtenerPredios();
        await obtener_ef1();
        await obtener_ef8();
        await obtenerTipoFruta();
      } catch (err) {
        messageModal("error", 'Recepcion' + err)

      } finally {
        setLoading(false);

      }
    };

    fetchData();
  }, []);

  const handleChange = (event): void => {
    const { name, value } = event.target;

    const uppercaseValue = name === 'placa' ? value.toUpperCase() : value;

    setFormState((prev) => {
      if (!prev) {
        return { [name]: uppercaseValue }
      } else {
        return { ...prev, [name]: uppercaseValue }
      }
    });
  };
  const guardarLote: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    try {
      setLoading(true)
      const canastilla = 
        Number(formState?.canastillasPropias ?? 0) + 
        Number(formState?.canastillasVaciasPropias ?? 0) + 
        Number(formState?.canastillasPrestadas ?? 0) + 
        Number(formState?.canastillasVaciasPrestadas ?? 0)

      if (!formState?.kilos || canastilla === 0) throw new Error("Faltan datos")

      const datos = crear_request_guardar(formState);
      if (!datos.tipoFruta) {
        messageModal("error", 'Seleccione el tipo de fruta del lote')
        return
      }
      const data = { ...datos }
      const request = {
        dataLote: data,
        dataCanastillas: {
          canastillasPropias: Number(formState.canastillasPropias ?? 0) + Number(formState.canastillasVaciasPropias ?? 0),
          canastillasPrestadas: Number(formState.canastillasPrestadas ?? 0) + Number(formState.canastillasVaciasPrestadas ?? 0),
        },
        action: 'post_inventarios_ingreso_lote',
      };
      const response = await window.api.server2(request)
      if (response.status !== 200)
        throw new Error(`Error ${response.status}: ${response.message}`)

      reiniciarCampos();
      obtener_ef1();
      obtener_ef8();
      messageModal("success", "¡lote guardado con exito!")

    } catch (err) {
      if (err instanceof Error) {
        messageModal("error", err.message)
      }
    } finally {
      setLoading(false)
    }
  }
  const reiniciarCampos = (): void => {
    setFormState(undefined);
  }

  return (
    <div>
      <div className='navBar'></div>
      <div>
        <h2>
          {strings.title}
        </h2>
        <hr />

      </div>
      <form className="form-container" onSubmit={guardarLote}>
        <div>

          <label> EF- </label>
          <select
            className='ef'
            onChange={handleChange}
            value={formState?.ef ? formState.ef : ''}
            required
            name='ef'>
            <option value=""></option>
            <option value='EF1'>{enf}</option>
            <option value='EF8'>{enf8}</option>
          </select>
        </div>
        <div>

          <label> Predios</label>
          <select
            className='defaultSelect'
            onChange={handleChange}
            value={formState?.nombrePredio ? formState.nombrePredio : ''}
            required
            name='nombrePredio'>
            <option>{strings.input_predios}</option>
            {prediosDatos.map((item, index) => (
              <option key={item.PREDIO && item.PREDIO + index} value={item._id}>{item.PREDIO}</option>
            ))}
          </select>
        </div>
        <div>
          <label> Tipo fruta</label>
          <select
            className='defaultSelect'
            onChange={handleChange}
            required
            value={formState?.tipoFruta ? formState.tipoFruta : ''}
            name='tipoFruta'>
            <option value=""></option>
            {tiposFrutas && tiposFrutas.map(fruta => (
              <option value={fruta} key={fruta}>{fruta}</option>
            ))}
          </select>
        </div>
        <div >
          <label>{strings.numeroCanastillasPropias}</label>
          <input
            type="text"
            onChange={handleChange}
            name="canastillasPropias"
            value={formState?.canastillasPropias ? formState.canastillasPropias : ''}  />
        </div>
        <div >
          <label>{strings.numeroCanastillasPrestadas}</label>
          <input
            type="text"
            onChange={handleChange}
            name="canastillasPrestadas"
            value={formState?.canastillasPrestadas ? formState.canastillasPrestadas : ''}  />
        </div>
        <div >
          <label>{strings.numeroCanastillasVaciasPropias}</label>
          <input
            type="text"
            onChange={handleChange}
            name="canastillasVaciasPropias"
            value={formState?.canastillasVaciasPropias ? formState.canastillasVaciasPropias : ''}  />
        </div>
        <div >
          <label>{strings.numeroCanastillasVaciasPrestadas}</label>
          <input
            type="text"
            onChange={handleChange}
            name="canastillasVaciasPrestadas"
            value={formState?.canastillasVaciasPrestadas ? formState.canastillasVaciasPrestadas : ''}  />
        </div>
        <div >
          <label>{strings.kilos}</label>
          <input
            type="text"
            onChange={handleChange}
            name="kilos"
            value={formState?.kilos ? formState.kilos : ''} required />
        </div>
        <div >
          <label>{strings.placa}</label>
          <input
            type="text"
            onChange={handleChange}
            name="placa"
            value={formState?.placa ? formState.placa : ''} required />
        </div>
        <div >
          <label>{strings.fecha_estimada_llegada}</label>
          <input
            type="datetime-local"
            onChange={handleChange}
            name="fecha_estimada_llegada"
            value={formState ? formState.fecha_estimada_llegada : ''}
            required />
        </div>
        <div >
          <label>N°. Precintos</label>
          <input
            type='text'
            onChange={handleChange}
            name="numeroPrecintos"
            value={formState?.numeroPrecintos ? formState.numeroPrecintos : ''} required />
        </div>
        <div >
          <label>{strings.observaciones}</label>
          <textarea
            onChange={handleChange}
            name="observaciones"
            value={formState?.observaciones ? formState.observaciones : ''} required />
        </div>
        <div className='defaultSelect-button-div'>
          <button type='submit'>Guardar</button>
        </div>
      </form>
    </div>
  )
}
