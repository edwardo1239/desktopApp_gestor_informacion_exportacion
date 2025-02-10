/* eslint-disable prettier/prettier */
import { lotesType } from "@renderer/types/lotesType"
import { useEffect, useState } from "react"
import { formInitEncerado, formInitLavado } from "../services/forms"
import { llavesVisualizar } from "../function/llaves"
import useAppContext from "@renderer/hooks/useAppContext"
import { request_guardar_cambios } from "../services/request"

type propsType = {
    handleModificar: () => void
    loteSeleccionado: lotesType | undefined
    showModal: boolean

}
export default function ModalModificarInventarioDescarte(props: propsType): JSX.Element {
    const { messageModal, user } = useAppContext()
    const [formStateLavado, setFormStateLavado] = useState(formInitLavado);
    const [formStateEncerado, setFormStateEncerado] = useState(formInitEncerado);
    useEffect(()=>{
        if(props.loteSeleccionado !== undefined &&
            props.loteSeleccionado.descarteEncerado &&
            props.loteSeleccionado.descarteLavado
        ){
            const formDataLavado = props.loteSeleccionado.descarteLavado
            const formDataEncerado = props.loteSeleccionado.descarteEncerado

            setFormStateEncerado({...formDataEncerado})
            setFormStateLavado({...formDataLavado})
        }
    },[])
    const handleChangeLavado = (event): void => {
        const { name, value } = event.target;
        setFormStateLavado({
            ...formStateLavado,
            [name]: Number(value),
        });
    };
    const handleChangeEncerado = (event): void => {
        const { name, value } = event.target;
        setFormStateEncerado({
            ...formStateEncerado,
            [name]: Number(value),
        });
    };
    const handleGuardar = async (e): Promise<void> => {
        e.preventDefault()
        try{
            const request = request_guardar_cambios(props.loteSeleccionado, formStateLavado, formStateEncerado, user)
            const response = await window.api.server2(request)
            if(response.status !== 200)
                throw new Error(response.message)
            props.handleModificar();
            messageModal("success","Datos modificados con exito")
        } catch(e){
            if(e instanceof Error)
                messageModal("error",e.message)
        }
    }
    return (
        <div className="fondo-modal">
            <div className="modal-container">
                <div className='modal-header-agree'>
                    <h2>Modificar Lote {props.loteSeleccionado?.enf}</h2>
                </div>
                <div className='modal-container-body'>
                    <form className="form-container" onSubmit={handleGuardar}>
                        <h4>Descarte lavado</h4>
                        {Object.keys(formInitLavado).map(item => (
                            <div key={item}>
                                <label>{llavesVisualizar[item]}</label>
                                <input type="number" onChange={handleChangeLavado} name={item} value={formStateLavado[item]} />
                            </div>
                        ))}
                        <h4>Descarte encerado</h4>
                        {Object.keys(formInitEncerado).map(item => (
                            <div key={item}>
                                <label>{llavesVisualizar[item]}</label>
                                <input type="number" onChange={handleChangeEncerado} name={item} value={formStateEncerado[item]} />
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