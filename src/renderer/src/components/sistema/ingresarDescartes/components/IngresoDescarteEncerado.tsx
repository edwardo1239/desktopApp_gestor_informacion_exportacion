/* eslint-disable prettier/prettier */
import { predioDescarteType } from "@renderer/types/descartes.d"
import { useState } from "react";
import { initDescarteEncerado } from "../functions/const";
import useAppContext from "@renderer/hooks/useAppContext";

type propsType = {
    predio: predioDescarteType | undefined
}

export default function IngresarDescarteEncerado(props: propsType): JSX.Element {
    const {messageModal} = useAppContext();
    const [formState, setFormState] = useState(initDescarteEncerado)

    const handleChange = (event): void => {
        setFormState({
          ...formState,
          [event.target.name]: event.target.value,
        });
    };
    const handleGuardar = async (event):Promise<void> => {
        event.preventDefault()
        try{
            const request = {
                data:{
                    lote: {
                        _id:props.predio?._id,
                        $inc:{
                            "descarteEncerado.descarteGeneral":Number(formState.descarteGeneral),
                            "descarteEncerado.pareja":Number(formState.pareja),
                            "descarteEncerado.balin":Number(formState.balin),
                            "descarteEncerado.extra":Number(formState.extra),
                            "descarteEncerado.descompuesta":Number(formState.descompuesta),
                            "descarteEncerado.suelo":Number(formState.suelo),
                            "frutaNacional":Number(formState.frutaNacional),
                            "inventarioActual.descarteEncerado.descarteGeneral":Number(formState.descarteGeneral) + Number(formState.suelo),
                            "inventarioActual.descarteEncerado.pareja":Number(formState.pareja),
                            "inventarioActual.descarteEncerado.balin":Number(formState.balin),
                            "inventarioActual.descarteEncerado.extra":Number(formState.extra),
                        }
                    }
                  },
                collection:'lotes',
                action: 'putLotes',
                query: 'proceso',
                record: 'ingreso descarte desde app'
            }
            const response = await window.api.server2(request);
            if(response.status !== 200)
                throw new Error(response.message)
            messageModal("success","Descarte guardado con exito")
        } catch(e){
            if(e instanceof Error)
                messageModal("error", e.message)
        } finally {
            setFormState(initDescarteEncerado)
        }
    };
    return (
        <div className="componentContainer">
            <h2>Descarte Encerado</h2>
            <h2>{props.predio?.nombrePredio}</h2>
            <h2>{props.predio?.enf}</h2>
            <form action="submite"  onSubmit={handleGuardar} className="form-container">
                <div>
                    <label>Descarte general</label>
                    <input
                        value={formState.descarteGeneral}
                        name='descarteGeneral'
                        type="number"
                        onChange={handleChange}
                        
                    />
                </div>
                <div>
                    <label>Pareja</label>
                    <input
                        value={formState.pareja}
                        name='pareja'
                        type="number"
                        onChange={handleChange}
                        
                    />
                </div>
                <div>
                    <label>Balin</label>
                    <input
                        value={formState.balin}
                        name='balin'
                        type="number"
                        onChange={handleChange}
                        
                    />
                </div>
                <div>
                    <label>Extra</label>
                    <input
                        value={formState.extra}
                        name='extra'
                        type="number"
                        onChange={handleChange}
                        
                    />
                </div>
                <div>
                    <label>Fruta caida</label>
                    <input
                        value={formState.suelo}
                        name='suelo'
                        type="number"
                        onChange={handleChange}
                        
                    />
                </div>
                <div>
                    <label>Descompuesta</label>
                    <input
                        value={formState.descompuesta}
                        name='descompuesta'
                        type="number"
                        onChange={handleChange}
                        
                    />
                </div>
                <div>
                    <label>Fruta nacional</label>
                    <input
                        value={formState.frutaNacional}
                        name='frutaNacional'
                        type="number"
                        onChange={handleChange}
                        
                    />
                </div>
                <div>
                    <button type="submit">Guardar</button>
                </div>
            </form>
        </div>
    )
}