/* eslint-disable prettier/prettier */

import useAppContext from "@renderer/hooks/useAppContext";
import { contenedoresType } from "@renderer/types/contenedoresType";
import { useEffect, useState } from "react";

type formStateType = {
    transportadora?: string
    nit?: string
    placa?: string,
    trailer?: string,
    conductor?: string,
    cedula?: string,
    celular?: string,
    temperatura?: string,
    precinto?: string,
    datalogger_id?: string,
    flete?: string,
    marca?: string,
    fecha?: string,
}

const formularioData = {
    transportadora: "Transportadora",
    nit: "NIT",
    placa: "Placa",
    trailer: "Trailer",
    conductor: "Conductor",
    cedula: "Cedula",
    celular: "Celular",
    temperatura: "Temperatura",
    precinto: "Precinto",
    marca: "Marca",
    datalogger_id: "Datalogger",
    flete: "Flete",
}

export default function TransporteProgramacionMula(): JSX.Element {
    const { messageModal } = useAppContext();
    const [contenedores, setContenedores] = useState<contenedoresType[]>();
    const [contSeleccionado, setContSeleccionado] = useState<string>();
    const [formState, setFormState] = useState<formStateType>()

    const obtenerData = async (): Promise<void> => {
        try {
            const request = {
                action: "get_transporte_mula_contenedores"
            }
            const response = await window.api.server2(request);
            if (response.status !== 200)
                throw new Error(`Code ${response.status}: ${response.message}`)
            setContenedores(response.data)
            console.log(response)
        } catch (err) {
            if (err instanceof Error) {
                messageModal("error", err.message)
            }
        }
    }
    useEffect(() => {
        obtenerData();
    }, [])
    const handleChange = (event): void => {
        const { name, value } = event.target;
        setFormState((prev) => {
            if (!prev) {
                return { [name]: value }
            } else {
                return { ...prev, [name]: value }
            }
        });
    };
    const guardar = async (e):Promise<void> => {
        e.preventDefault()
        try{
            const request = {
                action:"post_transporte_programacion_mula",
                _id: contSeleccionado,
                data: formState
            }
            const response = await window.api.server2(request);
            if(response.status !== 200)
                throw new Error(`Code ${response.status}: ${response.message}`)
            messageModal("success", "Dato guardado con exito!")
            setFormState(undefined)
        } catch(err){
            if(err instanceof Error){
                messageModal("error", err.message)
            }
        }
    }
    return (
        <div className="componentContainer">
            <div className="navBar"></div>
            <h2>Programacion Mula</h2>
            <hr />
            <form className="form-container">
                <div>
                    <label>Contenedores</label>
                    <select
                        required
                        className='defaultSelect'
                        name="contenedor"
                        onChange={(e): void => setContSeleccionado(e.target.value)} >
                        <option value="">Contenedores</option>
                        {contenedores && contenedores.map(cont => (
                            <option value={cont._id} key={cont._id}>
                                {cont.numeroContenedor} --
                                {typeof cont.infoContenedor.clienteInfo === 'object'
                                    && cont.infoContenedor.clienteInfo.CLIENTE
                                }
                            </option>
                        ))}
                    </select>
                </div>
                {Object.entries(formularioData).map(([key, value]) => (
                    <div key={key}>
                        <label>{value}</label>
                        <input
                            type="text"
                            onChange={handleChange}
                            name={key}
                            value={formState && formState[key] ? formState[key] : ''} required />
                    </div>
                ))}
                <div className='defaultSelect-button-div'>
                    <button type='submit' onClick={guardar} >Guardar</button>
                </div>
            </form>
        </div>
    )
}