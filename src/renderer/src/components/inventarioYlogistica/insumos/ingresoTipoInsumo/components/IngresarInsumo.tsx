/* eslint-disable prettier/prettier */

import useAppContext from "@renderer/hooks/useAppContext"
import { useState } from "react";
import { formulario } from "../functions/dataFormulario";

type propsType = {
    buttonHandle: () => void
    obtenerData: () => void
}

export default function IngresarInsumo(props: propsType): JSX.Element {
    const { messageModal } = useAppContext();
    const [formState, setFormState] = useState<{ [key: string]: string }>({})

    const handleChange = (key, value): void => {
        setFormState({
            ...formState,
            [key]: value
        })
    }
    const handleGuardar = async (e): Promise<void> => {
        e.preventDefault()
        try {
            const request = {
                action: "post_inventarios_insumos_tipoInsumo",
                data: { ...formState, fecha: new Date() }
            }
            const response = await window.api.server2(request)
            if (response.status !== 200)
                throw new Error(`Code ${response.status}: ${response.message}`)
            messageModal("success", "Guardado con exito")
            setFormState({})
        } catch (err) {
            if (err instanceof Error) {
                messageModal("error", err.message)
            }
        } finally {
            props.buttonHandle();
            props.obtenerData();
        }
    }
    return (
        <div className="componentContainer">
            <form className="form-container" >
                {Object.entries(formulario).map(([key, value]) => (
                    <div key={key}>
                        <label>{value}</label>
                        <input
                            type={"text"}
                            onChange={(e): void => handleChange(key, e.target.value)}
                            value={formState ? formState[key] : ''}
                            required
                        />
                    </div>
                ))}

                <div className="agregar-usuario-guardar-boton-div">
                    <button className="defaulButtonAgree" onClick={handleGuardar}>Guardar</button>
                </div>

            </form>
        </div>
    )
}
