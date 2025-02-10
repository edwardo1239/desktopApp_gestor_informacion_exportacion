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
    obtenerData: () => void

}

export default function ModalModificarHistorialCalidadInterna(props:propsType): JSX.Element {
    const { messageModal } = useAppContext()
    const [formState, setFormState] = useState(formInit);
    useEffect(()=>{
        if(props.loteSeleccionado !== undefined){
            const formData = {...formState}
            formData.acidez = props.loteSeleccionado.calidad?.calidadInterna?.acidez ? 
                props.loteSeleccionado.calidad?.calidadInterna?.acidez : 0 
            formData.brix = props.loteSeleccionado.calidad?.calidadInterna?.brix ? 
                props.loteSeleccionado.calidad?.calidadInterna?.brix : 0 
            formData.ratio = props.loteSeleccionado.calidad?.calidadInterna?.ratio ? 
                props.loteSeleccionado.calidad?.calidadInterna?.ratio : 0 
            formData.zumo = props.loteSeleccionado.calidad?.calidadInterna?.zumo ? 
                props.loteSeleccionado.calidad?.calidadInterna?.zumo : 0 
            setFormState(formData)
        }
    },[props.showModal])
    const handleChange = (event): void => {
        const { name, value } = event.target;
        const uppercaseValue = name === 'placa' ? value.toUpperCase() : value;
        setFormState({
            ...formState,
            [name]: uppercaseValue,
        });
    };
    const handleGuardar = async (e): Promise<void> => {
        e.preventDefault()
        try{
            const request = request_guardar_cambios(props.loteSeleccionado, formState)
            const response = await window.api.server2(request)
            if(response.status !== 200)
                throw new Error(response.message)
            props.handleModificar();
            messageModal("success","Datos modificados con exito")
            props.obtenerData();
        } catch(e){
            if(e instanceof Error)
                messageModal("error",e.message)
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
                        <div >
                            <label>Acidez</label>
                            <input type="number" onChange={handleChange} name="acidez" value={formState.acidez} required />
                        </div>
                        <div >
                            <label>Brix</label>
                            <input type="number" onChange={handleChange} name="brix" value={formState.brix} required />
                        </div>
                        <div >
                            <label>Ratio</label>
                            <input type="number" onChange={handleChange} name="ratio" value={formState.ratio} required />
                        </div>
                        <div >
                            <label>Zumo</label>
                            <input type="number" onChange={handleChange} name="zumo" value={formState.zumo} required />
                        </div>
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