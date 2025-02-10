/* eslint-disable prettier/prettier */
import { useEffect, useState } from "react";
import { formInit } from "../services/form";
import { proveedoresType } from "@renderer/types/proveedoresType";
import useAppContext from "@renderer/hooks/useAppContext";
import { request_guardar_cambios, request_predios } from "../services/request";
import { recordLotesType } from "@renderer/types/recorLotesType";

type propsType = {
    handleModificar: () => void
    loteSeleccionado: recordLotesType | undefined
    showModal: boolean
    obtenerData: () => void
}

export default function ModalModificarLote(props:propsType): JSX.Element {
    const { messageModal } = useAppContext()
    const [formState, setFormState] = useState(formInit);
    const [prediosDatos, setPrediosData] = useState<proveedoresType[]>([])
    useEffect(() => { obtenerProveedores() }, [])
    useEffect(()=>{
        if(props.loteSeleccionado !== undefined){
            const formData = {...formState}
            formData.predio = String(props.loteSeleccionado.documento.predio?._id)
            formData.observaciones = String(props.loteSeleccionado.documento.observaciones)
            formData.placa = String(props.loteSeleccionado.documento.placa)
            formData.tipoFruta = String(props.loteSeleccionado.documento.tipoFruta)
            formData.fecha_estimada_llegada = String(props.loteSeleccionado.documento.fecha_estimada_llegada)
            formData.canastillas = String(props.loteSeleccionado.documento.canastillas)
            formData.kilos = String(props.loteSeleccionado.documento.kilos)
            setFormState(formData)
        }
    },[props.showModal])
    const obtenerProveedores = async (): Promise<void> => {
        try {
            const response = await window.api.server2(request_predios)
            if (response.status !== 200)
                throw new Error(response.message)
            setPrediosData(response.data)
        } catch (e) {
            if (e instanceof Error)
                messageModal("error", e.message)
        }
    }
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
            props.obtenerData()
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
                        <div>
                            <label> Predios</label>
                            <select
                                className='defaultSelect'
                                onChange={handleChange}
                                required
                                value={formState.predio}
                                name='predio'>
                                <option value="">Predios</option>
                                {prediosDatos.map((item, index) => (
                                    <option key={item.PREDIO && item.PREDIO + index} value={item._id}>{item.PREDIO}</option>
                                ))}
                            </select>
                        </div>
                        <div >
                            <label>Canastillas</label>
                            <input type="text" onChange={handleChange} name="canastillas" value={formState.canastillas} required />
                        </div>
                        <div >
                            <label>Kilos</label>
                            <input type="text" onChange={handleChange} name="kilos" value={formState.kilos} required />
                        </div>
                        <div>
                            <label>Tipo fruta</label>
                            <select
                                className='defaultSelect'
                                onChange={handleChange}
                                required
                                value={formState.tipoFruta}
                                name='tipoFruta'>
                                <option value="">Fruta</option>
                                <option value="Limon">Limon</option>
                                <option value="Naranja">Naranja</option>
                            </select>
                        </div>
                        <div >
                            <label>Observaciones</label>
                            <input type="text" onChange={handleChange} name="observaciones" value={formState.observaciones} required />
                        </div>
                        <div >
                            <label>Placa</label>
                            <input type="text" onChange={handleChange} name="placa" value={formState.placa} required />
                        </div>
                        <div >
                            <label>Fecha estimada de llegada</label>
                            <input 
                                type="datetime-local" 
                                onChange={handleChange} 
                                name="fecha_estimada_llegada" 
                                value={formState.fecha_estimada_llegada} required />
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