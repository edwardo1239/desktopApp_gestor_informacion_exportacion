/* eslint-disable prettier/prettier */

import useAppContext from "@renderer/hooks/useAppContext"
import { proveedoresType } from "@renderer/types/proveedoresType"
import { useState } from "react"

type propsType = {
    tipoFruta: string[] | undefined
    selectedProveedores: proveedoresType[] | undefined
    setSelectedProveedores: (proveedor) => void
}

type formStateType = {
    tipoFruta?: string
    1?: string
    15?: string
    2?: string
    frutaNacional?: string
    descarte?: string
    week?: string
    comentario?: string
}

export default function PreciosComponent(props: propsType): JSX.Element {
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
        try {
            setLoading(true)
            if (!props.selectedProveedores) throw new Error("No se han seleccionado proveedores")
            if (!formState?.tipoFruta || formState?.tipoFruta === '') throw new Error("Debe seleccionar un tipo de fruta")
            if (!formState?.week || formState?.week === '') throw new Error("Debe seleccionar una semana")
            const predios = props.selectedProveedores.map(proveedor => proveedor._id)
            const request = {
                action: "post_comercial_precios_add_precio",
                data: {
                    ...formState,
                    predios: predios
                }
            }
            const response = await window.api.server2(request)
            if (response.status !== 200) {
                throw new Error(`Code ${response.status}: ${response.message}`)
            }
            setFormState(undefined)
            props.setSelectedProveedores(undefined)
            messageModal("success", "Guardado con exito")
        } catch (err) {
            if (err instanceof Error) {
                messageModal("error", err.message)
            }
        } finally {
            setLoading(false)
        }
    }
    return (
        <>
            <div className="filtro_proveedores-div">
                <div>
                    <label className="tool-select-label" >
                        Tipo de fruta:
                    </label>
                    <select
                        value={formState?.tipoFruta ?? ''}
                        data-testid="conercial-precios-proveedores-select-tipo-fruta2"
                        onChange={handleChange}
                        name="tipoFruta"
                        className="tool-select">
                        <option value=""></option>
                        {props.tipoFruta && props.tipoFruta.map(fruta =>
                            <option value={fruta} key={fruta}>{fruta}</option>
                        )}
                    </select>
                </div>
            </div>

            <div className="comercial-precios-ingreso">
                <div className="fila">
                    <label htmlFor="week">Semana</label>
                    <input onChange={handleChange} name='week' value={formState?.week ?? ''}
                        type="week" id="week" />
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
                    <label htmlFor="calidad2">Precio Industrial</label>
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
                <button onClick={handleSave} className="btn-guardar" >
                    Guardar
                </button>
            </div>
        </>
    )
}
