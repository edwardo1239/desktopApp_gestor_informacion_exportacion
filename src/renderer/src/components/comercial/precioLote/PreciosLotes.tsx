/* eslint-disable prettier/prettier */

import { useState } from "react";
import './styles.css'
import useAppContext from "@renderer/hooks/useAppContext";

type formStateType = {
    tipoFruta?: string
    1?: string
    15?: string
    2?: string
    frutaNacional?: string
    descarte?: string
    enf?:string
    comentario?: string
}

export default function PreciosLotes(): JSX.Element {
    const { messageModal, setLoading } = useAppContext();
    const [formState, setFormState] = useState<formStateType>()

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

    const handleSave = async (): Promise<void> => {
        try{
            setLoading(true)
            const formulario = {...formState}
            formulario.comentario = formulario.enf + " " + formulario.comentario

            const request = {
                action:"put_comercial_precios_precioLotes",
                data: formulario
            }
            const response = await window.api.server2(request)
            if(response.status !== 200){
                throw new Error(`Code ${response.status}: ${response.message}`)
            }
            messageModal("success", "Precio guardado con exito")
            setFormState(undefined)
        } catch(err){
            if(err instanceof Error){
                messageModal("error", err.message)
            }
        } finally {
            setLoading(false)
        }
    }
    return (
        <div>
            <div className="navBar"></div>
            <h2>Precios Lotes</h2>
            <hr />
            <div className="comercial-precios-ingreso-lote">
                <div className="fila">
                    <label htmlFor="enf">Lote - EF</label>
                    <input onChange={handleChange} name='enf' value={formState?.enf ?? ''}
                        type="text" id="enf" placeholder="EF" />
                </div>
                <div className="fila">
                    <label htmlFor="calidad1">Precio Calidad 1</label>
                    <input onChange={handleChange} name='1' value={formState?.[1] ?? ''}
                        type="text" id="calidad1" placeholder="Precio Calidad 1" />
                </div>
                <div className="fila">
                    <label htmlFor="calidad1-5">Precio Calidad 1.5</label>
                    <input onChange={handleChange} name='15' value={formState?.[15] ?? ''}
                        type="text" id="calidad1-5" placeholder="Precio Calidad 1.5" />
                </div>
                <div className="fila">
                    <label htmlFor="calidad2">Precio Calidad Industrial</label>
                    <input onChange={handleChange} name='2' value={formState?.[2] ?? ''}
                        type="text" id="calidad2" placeholder="Precio Calidad 2" />
                </div>
                <div className="fila">
                    <label htmlFor="frutaNac">Fruta Nacional</label>
                    <input onChange={handleChange} name='frutaNacional' value={formState?.frutaNacional ?? ''}
                        type="text" id="frutaNac" placeholder="Fruta Nacional" />
                </div>
                <div className="fila">
                    <label htmlFor="descarte">Descarte</label>
                    <input onChange={handleChange} name='descarte' value={formState?.descarte ?? ''}
                        type="text" id="descarte" placeholder="Descarte" />
                </div>
                <div className="fila">
                    <label htmlFor="comentario">Observaciones</label>
                    <textarea onChange={handleChange} name='comentario' value={formState?.comentario ?? ''}
                        id="comentario" placeholder="Observaciones" />
                </div>
                <button onClick={handleSave}  className="btn-guardar" >
                    Guardar
                </button>
            </div>
        </div>
    )
}