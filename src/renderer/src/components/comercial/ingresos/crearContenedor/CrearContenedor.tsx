/* eslint-disable prettier/prettier */
import { useCallback, useEffect, useState } from 'react'
import { FormStateType, crearObjetoContenedor, formInit, requestClientes } from './functions'
import { clienteType } from '@renderer/types/clientesType'
import { serverResponse } from '@renderer/env'
import useAppContext from '@renderer/hooks/useAppContext'
import * as strings from './json/string_ES.json'
import "@renderer/css/components.css"
import "@renderer/css/form.css"

export default function CrearContenedor(): JSX.Element {
  const { messageModal } = useAppContext();
  const [formState, setFormState] = useState<FormStateType>(formInit);
  const [clientesDatos, setClientesDatos] = useState<clienteType[]>([])
  const [inputCalibre, setInputCalibre] = useState<string>('');
  const [inputTipoCaja, setInputTipoCaja] = useState<string>('');
  const [inputPesoCaja, setInputPesoCaja] = useState<string>('');

  const handleChange = (event): void => {
    setFormState({
      ...formState,
      [event.target.name]: event.target.value,
    });
  };
  const obtenerDatos = useCallback(async (): Promise<void> => {
    try {
      const response: serverResponse<clienteType[]> = await window.api.server2(requestClientes)
      if (response.status !== 200) throw new Error(`Code ${response.status}: ${response.message}`)
      setClientesDatos(response.data)
    } catch (e: unknown) {
      messageModal("error", `Crear contenedor ${e}`)
    }
  }, [])
  useEffect(() => {
    obtenerDatos();
  }, [])

  const guardarDatos: React.FormEventHandler<HTMLFormElement> = async (event) => {
    try {
      event.preventDefault()
      console.log(formState)
      if (formState.tipoFruta === '') throw new Error("No ha seleccionado tipo de fruta")
      const request = crearObjetoContenedor(formState)
      const response = await window.api.server2(request)
      if (response.status === 200) {
        messageModal("success", 'Contenedor creado con exito!');
      } else {
        messageModal("error", `Error ${response.status}: ${response.message}`)
      }
      reiniciarCampos()
    } catch (e: unknown) {
      messageModal("error", ` ${e}`);
    }
  }
  const reiniciarCampos = (): void => {
    setFormState(formInit);
  }
  const handleCalidadChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const selectedOption = event.target.value;
    setFormState(prevState => {
      const nuevaCalidad = prevState.calidad.includes(selectedOption)
        ? prevState.calidad.filter(option => option !== selectedOption)
        : [...prevState.calidad, selectedOption];
      return {
        ...prevState,
        calidad: nuevaCalidad
      };
    });
  }
  const handleDesverdizado = (): void => {
    if (formState.desverdizado) {
      setFormState({
        ...formState,
        desverdizado: false,
      });
    } else {
      setFormState({
        ...formState,
        desverdizado: true,
      });
    }
  }
  const handleINputCalibre = (): void => {
    const nuevoCalibre = formState.calibres
    nuevoCalibre.push(inputCalibre)
    setFormState(prevState => {
      return { ...prevState, calibres: nuevoCalibre }
    });
    setInputCalibre('');
  }
  const handleInputTipoCaja = (): void => {
    const nuevaCaja = formState.tipoCaja
    nuevaCaja.push(`${inputTipoCaja}-${inputPesoCaja}`)
    setFormState(prevState => {
      return { ...prevState, tipoCaja: nuevaCaja }
    });
    setInputTipoCaja('');
  }
  const handleEliminarCalibre = (cal): void => {
    setFormState(prevState => {
      const nuevoCal = prevState.calibres.includes(cal)
        ? prevState.calibres.filter(option => option !== cal)
        : [...prevState.calibres, cal];
      return {
        ...prevState,
        calibres: nuevoCal
      };
    });
  }
  const handleEliminarTipoCaja = (caja): void => {
    setFormState(prevState => {
      const nuevoCaja = prevState.tipoCaja.includes(caja)
        ? prevState.tipoCaja.filter(option => option !== caja)
        : [...prevState.tipoCaja, caja];
      return {
        ...prevState,
        tipoCaja: nuevoCaja
      };
    });
  }
  return (
    <div className='componentContainer'>
      <div className='navBar'></div>
      <h2 >
        {strings.title}
      </h2>
      <form className="form-container" onSubmit={guardarDatos}>
        <div>
          <label>{strings.clientes}</label>
          <select
            onChange={handleChange}
            name='cliente'
            required
            value={formState.cliente}
            className='defaultSelect'
          >
            <option>{strings.clientes}</option>
            {clientesDatos.map((item) => (
              <option key={item._id} value={item._id}>
                {item.CLIENTE}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>{strings.numero_contenedor}</label>
          <input
            value={formState.numeroContenedor}
            name='numeroContenedor'
            type="text"
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>{strings.tipoFruta.title}</label>
          <div className='form-checkbox-container'>
            <label className='form-label-container'>
              <span className="ml-2">{strings.tipoFruta.naranja}</span>
              <input
                type="radio"
                checked={formState.tipoFruta === 'Naranja'}
                className="form-radio text-orange-600"
                name="tipoFruta"
                value="Naranja"
                onChange={handleChange}
              />
            </label>
            <label className='form-label-container'>
              <span className="ml-2">{strings.tipoFruta.limon}</span>
              <input
                type="radio"
                className="form-radio text-green-600"
                name="tipoFruta"
                value="Limon"
                checked={formState.tipoFruta === 'Limon'}
                onChange={handleChange}
              />
            </label>
            <label className='form-label-container'>
              <span className="ml-2">{strings.tipoFruta.mixto}</span>
              <input
                type="radio"
                className="form-radio text-orange-600"
                name="tipoFruta"
                value="Mixto"
                onChange={handleChange}
              />
            </label>
          </div>
        </div>
        {/*  desverdizado */}

        <div>
          <label>{strings.desverdizado}</label>
          <button
            type="button"
            name='desverdizado'
            onClick={handleDesverdizado}
            className={`${formState.desverdizado ? 'desverdizado-off-button-contenedor' : 'desverdizado-on-button-contenedor'} `}
          >
            {strings.desverdizado}
          </button>
        </div>
        {/*  Fechas */}

        <div>
          <label>{strings.fecha_inicio_proceso}</label>
          <input
            value={formState.fechaInicioProceso ? formState.fechaInicioProceso.toString().split('T')[0] : ''}
            type="date"
            onChange={handleChange}
            name='fechaInicioProceso'
            required
          />
        </div>
        <div>
          <label>{strings.fecha_estimada_cargue}</label>
          <input
            value={formState.fechaEstimadaCargue ? formState.fechaEstimadaCargue.toString().split('T')[0] : ''}
            type="date"
            name='fechaEstimadaCargue'
            onChange={handleChange}
            required
          />
        </div>
        {/*  calidad */}

        <div>
          <label>{strings.calidad.title}</label>
          <div className='form-checkbox-container'>
            <label className='form-label-container'>
              <span>{strings.calidad[1]}.</span>
              <input
                type="checkbox"
                className="form-checkbox"
                value="1"
                onChange={handleCalidadChange}
                checked={formState.calidad.includes('1')}
              />
            </label>
            <label className='form-label-container'>
              <span className="ml-2">{strings.calidad['1.5']}</span>
              <input
                type="checkbox"
                value="1.5"
                onChange={handleCalidadChange}
                checked={formState.calidad.includes('1.5')}
              />
            </label>
            <label className='form-label-container'>
              <span className="ml-2">{strings.calidad[2]}</span>
              <input
                type="checkbox"
                value="2"
                onChange={handleCalidadChange}
                checked={formState.calidad.includes('2')}
              />
            </label>

            <label className='form-label-container'>
              <span className="ml-2">{strings.calidad.zumo}</span>
              <input
                type="checkbox"
                value="Zumo"
                onChange={handleCalidadChange}
                checked={formState.calidad.includes('Zumo')}
              />
            </label>

            <label className='form-label-container'>
              <span className="ml-2">{strings.calidad.combinado}</span>
              <input
                type="checkbox"
                value="Combinado"
                onChange={handleCalidadChange}
                checked={formState.calidad.includes('Combinado')}
              />
            </label>

          </div>
        </div>

        {/*  tipo caja */}
        <div>
          <div>
            <select className='defaultSelect' value={inputTipoCaja} onChange={(e): void => setInputTipoCaja(e.target.value)}>
              <option value="">Tipo caja</option>
              <option value="B">B</option>
              <option value="G">G</option>
              <option value="K">K</option>
              <option value="Bulto">Bulto</option>
            </select>
            <label>-</label>
            <input
              value={inputPesoCaja}
              name='tipoCajasa'
              type="text"
              onChange={(e): void => setInputPesoCaja(e.target.value)}
            />
            <button type='button' onClick={handleInputTipoCaja}>+</button>
          </div>
          <div>
            {formState.tipoCaja.map((caja, index) => (
              <button type='button' key={caja + index} onClick={(): void => handleEliminarTipoCaja(caja)}>{caja}</button>
            ))}
          </div>
        </div>

        <div>
          <label>{strings.sombra}</label>
          <input
            value={formState.sombra}
            name='sombra'
            type="text"
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>{strings.defecto}</label>
          <input
            value={formState.defecto}
            name='defecto'
            type="text"
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>{strings.mancha}</label>
          <input
            value={formState.mancha}
            name='mancha'
            type="text"
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>{strings.verdeMzn}</label>
          <input
            value={formState.verdeMzn}
            name='verdeMzn'
            type="text"
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <div>
            <label>{strings.calibres}</label>
            <input
              value={inputCalibre}
              name='calibres'
              type="text"
              onChange={(e): void => setInputCalibre(e.target.value)}
            />
            <button type='button' onClick={handleINputCalibre}>+</button>
          </div>
          <div>
            {formState.calibres.map((calibre, index) => (
              <button type='button' key={calibre + index} onClick={(): void => handleEliminarCalibre(calibre)}>{calibre}</button>
            ))}
          </div>
        </div>
        <div >
          <label>{strings.numero_pallets}</label>
          <input
            value={formState.pallets}
            type="number"
            onChange={handleChange}
            name='pallets'
            min={0}
            step={1}
            required
          />
        </div>
        <div >
          <label>{strings.cajas}</label>
          <input
            value={formState.cajas}
            type="number"
            onChange={handleChange}
            name='cajas'
            min={0}
            step={1}
            required
          />
        </div>
        <div >
          <label>{strings.rtoEsrimado}</label>
          <input
            value={formState.rtoEsrimado}
            type="text"
            onChange={handleChange}
            name='rtoEsrimado'
            required
          />
        </div>
        <div>
          <label>
            {strings.observaciones}
          </label>
          <textarea
            onChange={handleChange}
            name='observaciones'
            required
            value={formState.observaciones}
          />
        </div>
        <div >
          <button type="submit">
            {strings.guardar}
          </button>
        </div>
      </form>
    </div>
  )
}
