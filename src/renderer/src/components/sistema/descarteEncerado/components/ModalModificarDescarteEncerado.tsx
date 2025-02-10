/* eslint-disable prettier/prettier */
import { useEffect, useState } from "react";
import { formInit } from "../services/form";
import { lotesType } from "@renderer/types/lotesType";
import { request_guardar_cambios } from "../services/request";
import useAppContext from "@renderer/hooks/useAppContext";

type propsType = {
    handleModificar: () => void
    loteSeleccionado: lotesType | undefined
    showModal: boolean

}

export default function ModalModificarDescarteEncerado(props: propsType): JSX.Element {
    const { messageModal, user } = useAppContext()
    const [formState, setFormState] = useState(formInit);
    useEffect(() => {
        if (props.loteSeleccionado !== undefined) {
            const formData = { ...formState }
            formData.descarteGeneral = Number(props.loteSeleccionado.descarteEncerado?.descarteGeneral)
            formData.pareja = Number(props.loteSeleccionado.descarteEncerado?.pareja)
            formData.balin = Number(props.loteSeleccionado.descarteEncerado?.balin)
            formData.descompuesta = Number(props.loteSeleccionado.descarteEncerado?.descompuesta)
            formData.extra = Number(props.loteSeleccionado.descarteEncerado?.extra)
            formData.suelo = Number(props.loteSeleccionado.descarteEncerado?.suelo)
            setFormState(formData)
        }
    }, [props.showModal])
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
            const request = request_guardar_cambios(props.loteSeleccionado, formState, user)
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
                        {Object.keys(formInit).map(item => (
                            <div key={item}>
                                <label>{item}</label>
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