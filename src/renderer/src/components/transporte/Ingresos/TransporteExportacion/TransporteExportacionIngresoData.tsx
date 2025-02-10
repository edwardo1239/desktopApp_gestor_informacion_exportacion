/* eslint-disable prettier/prettier */

import useAppContext from "@renderer/hooks/useAppContext"
import { contenedoresType } from "@renderer/types/contenedoresType";
import { useEffect, useState } from "react";

type formStateType = {
    puerto?: string
    naviera?: string
    agencia?: string
    expt?: string
}

export default function TransporteExportacionIngresoData(): JSX.Element {
    const { messageModal } = useAppContext();
    const [contenedores, setContenedores] = useState<contenedoresType[]>();
    const [contSeleccionado, setContSeleccionado] = useState<string>();
    const [formState, setFormState] = useState<formStateType>()

    const obtenerData = async (): Promise<void> => {
        try {
            const request = {
                action: "get_transporte_exportacion_contenedores"
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
                action:"post_transporte_programacion_exportacion",
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
            <h2>Ingreso datos transporte exportación</h2>
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
                <div>
                    <label>Puerto</label>
                    <input
                        type="text"
                        onChange={handleChange}
                        name="puerto"
                        value={formState?.puerto ? formState.puerto : ''} required />
                </div>
                <div>
                    <label>Naviera</label>
                    <input
                        type="text"
                        onChange={handleChange}
                        name="naviera"
                        value={formState?.naviera ? formState.naviera : ''} required />
                </div>
                <div>
                    <label>Agencia</label>
                    <input
                        type="text"
                        onChange={handleChange}
                        name="agencia"
                        value={formState?.agencia ? formState.agencia : ''} required />
                </div>
                <div >
                    <label>EXPT</label>
                    <input
                        type="text"
                        onChange={handleChange}
                        name="expt"
                        value={formState?.expt ? formState.expt : ''} required />
                </div>
                <div className='defaultSelect-button-div'>
                    <button type='submit' onClick={guardar}>Guardar</button>
                </div>
            </form>
        </div>
    )
}