/* eslint-disable prettier/prettier */
import { predioDescarteType } from "@renderer/types/descartes.d"
import { useState } from "react";
import { initDescarteLavado } from "../functions/const";
import useAppContext from "@renderer/hooks/useAppContext";

type propsType = {
    predio: predioDescarteType | undefined
}

export default function IngresarDescarteLavado(props: propsType): JSX.Element {
    const {messageModal} = useAppContext();
    const [formState, setFormState] = useState(initDescarteLavado)

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
                            "descarteLavado.descarteGeneral":Number(formState.descarteGeneral),
                            "descarteLavado.pareja":Number(formState.pareja),
                            "descarteLavado.balin":Number(formState.balin),
                            "descarteLavado.descompuesta":Number(formState.descompuesta),
                            "descarteLavado.piel":Number(formState.piel),
                            "descarteLavado.hojas":Number(formState.hojas),
                            "inventarioActual.descarteLavado.descarteGeneral":Number(formState.descarteGeneral),
                            "inventarioActual.descarteLavado.pareja":Number(formState.pareja),
                            "inventarioActual.descarteLavado.balin":Number(formState.balin)
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
            setFormState(initDescarteLavado)
        }
    };
    return (
        <div className="componentContainer">
            <h2>Descarte Lavado</h2>
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
                    <label>Descompuesta</label>
                    <input
                        value={formState.descompuesta}
                        name='descompuesta'
                        type="number"
                        onChange={handleChange}
                        
                    />
                </div>
                <div>
                    <label>Desprendimiento de piel</label>
                    <input
                        value={formState.piel}
                        name='piel'
                        type="number"
                        onChange={handleChange}
                        
                    />
                </div>
                <div>
                    <label>Hojas</label>
                    <input
                        value={formState.hojas}
                        name='hojas'
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