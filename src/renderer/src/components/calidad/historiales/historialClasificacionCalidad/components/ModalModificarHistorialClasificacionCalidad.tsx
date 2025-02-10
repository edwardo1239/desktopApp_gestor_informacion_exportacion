/* eslint-disable prettier/prettier */

import { lotesType } from "@renderer/types/lotesType"
import { useEffect, useState } from "react"
import { check_data_100, objetoLimon, objetoLimonNaranja, objetoNaranja } from "../functions/reduce"
import useAppContext from "@renderer/hooks/useAppContext"
import { request_guardar_cambios } from "../services/request"

type propsType = {
    handleModificar: () => void
    loteSeleccionado: lotesType | undefined
    showModal: boolean

}
export default function ModalModificarHistorialClasificacionCalidad(props: propsType): JSX.Element {
    const { messageModal } = useAppContext()
    const [formulario, setFormulario] = useState<object>({})
    const [formState, setFormState] = useState(objetoLimonNaranja);

    useEffect(() => {
        if (props.loteSeleccionado?.tipoFruta === "Limon") {
            setFormulario(objetoLimon)
        } else if (props.loteSeleccionado?.tipoFruta === "Naranja") {
            setFormulario(objetoNaranja)
        }
        if (props.loteSeleccionado !== undefined && props.loteSeleccionado.calidad?.clasificacionCalidad) {
            const formData = { ...formState }
            Object.keys(props.loteSeleccionado.calidad?.clasificacionCalidad).forEach(item => {
                if (props.loteSeleccionado !== undefined &&
                    props.loteSeleccionado.calidad !== undefined &&
                    props.loteSeleccionado.calidad.clasificacionCalidad !== undefined &&
                    item !== "fecha"
                ) {
                    formData[item] = (props.loteSeleccionado.calidad?.clasificacionCalidad[item] * 100).toFixed(2)

                }
            })
            setFormState(formData)
        }
    }, [])
    const handleChange = (event): void => {
        const { name, value } = event.target;

        setFormState({
            ...formState,
            [name]: Number(value),
        });
    };
    const handleGuardar = async (e): Promise<void> => {
        e.preventDefault()
        try {
            if (!check_data_100(formState)) {
                throw new Error("Erros la suma de los defectos no da 100%")
            }
            const request = request_guardar_cambios(props.loteSeleccionado, formState)
            const response = await window.api.server2(request)
            if (response.status !== 200)
                throw new Error(response.message)
            props.handleModificar();
            messageModal("success", "Datos modificados con exito")
        } catch (e) {
            if (e instanceof Error)
                messageModal("error", e.message)
        }
    }
    return (
        <div className="fondo-modal">
            <div className="modal-container">
                <div className='modal-header-agree'>
                    <h2>Modificar Lote</h2>
                </div>
                <div className='modal-container-body'>
                    <form className="form-container" onSubmit={handleGuardar}>
                        {Object.keys(formulario).map(item => (
                            <div key={item}>
                                <label>{formulario[item]}</label>
                                <input type="number" onChange={handleChange} name={item} value={formState[item]} required />
                            </div>
                        ))}
                        <div className='defaultSelect-button-div'>
                            <button type='submit'>Guardar</button>
                            <button className="cancel" onClick={props.handleModificar}>Cancelar</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}