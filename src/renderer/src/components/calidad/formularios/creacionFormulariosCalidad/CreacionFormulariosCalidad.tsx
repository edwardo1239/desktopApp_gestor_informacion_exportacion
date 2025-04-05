/* eslint-disable prettier/prettier */
import './styles.css'
import useAppContext from "@renderer/hooks/useAppContext"
import { useEffect, useState } from "react"

export default function CreacionFormulariosCalidad(): JSX.Element {
    const { messageModal } = useAppContext();
    const [tipoFormularios, setTipoFormularios] = useState()
    const [fechaInicio, setFechaInicio] = useState<string>();
    const [fechaFin, setFechaFin] = useState<string>();
    const [tipoSeleccionado, setTipoSeleccionado] = useState<string>()

    useEffect(() => {
        obtener_tipo_formularios()
    }, [])
    const obtener_tipo_formularios = async (): Promise<void> => {
        try {
            const request = { action: "get_calidad_ingresos_tiposFormularios" }
            const response = await window.api.server2(request)
            if (response.status !== 200)
                throw new Error(`Code ${response.status}: ${response.message}`)
            setTipoFormularios(response.data)
        } catch (err) {
            if (err instanceof Error) {
                messageModal("error", err.message)
            }
        }
    }
    const crear_formulario = async (): Promise<void> => {
        try{
            const request = {
                action: "post_calidad_ingresos_crearFormulario",
                data:{
                    tipoSeleccionado,
                    fechaInicio,
                    fechaFin,
                }
            }
            const response = await window.api.server2(request);
            if(response.status !== 200)
                throw new Error(`Code ${response.status}: ${response.message}`)
            messageModal("success","Formulario creado con exito")
            setFechaFin('')
            setFechaInicio('')
            setTipoSeleccionado('')
        } catch(err){
            if(err instanceof Error){
                messageModal("error", err.message)
            }
        }
    }
    if (tipoFormularios === undefined) {
        return (
            <div>Cargando datos...</div>
        )
    }
    return (
        <div className="componentContainer">
            <div className="navBar"></div>
            <h2>Crear formularios calidad</h2>
            <hr />
            <div className='creacionformularioscalidad-container'>
                <div className='creacionformulariocalidad-selection-container'>
                    <h3>Tipo de formulario</h3>
                    <select
                        value={tipoSeleccionado}
                        className="defaultSelect"
                        onChange={(e): void => setTipoSeleccionado(e.target.value)}>
                        <option value=""></option>
                        {Object.entries(tipoFormularios).map(([key, value]) => (
                            <option value={key} key={key}>{value as string}</option>
                        ))}
                    </select>
                </div>
                <div className='creacionformularioscalidad-container-fechas'>
                    <label>
                        Fecha Inicio
                        <input
                            value={fechaInicio}
                            className="defaultSelect"
                            type="date"
                            onChange={(e): void => setFechaInicio(e.target.value)}
                        />
                    </label>
                    <label>
                        Fecha Fin
                        <input
                            value={fechaFin}
                            className="defaultSelect"
                            onChange={(e): void => setFechaFin(e.target.value)}
                            type="date"
                        />
                    </label>
                </div>
                <div className='creacionformularioscalidad-container-boton'>
                    <button
                        onClick={crear_formulario} 
                        className='defaulButtonAgree'>
                            Crear
                    </button>
                </div>
            </div>
        </div>
    )
}