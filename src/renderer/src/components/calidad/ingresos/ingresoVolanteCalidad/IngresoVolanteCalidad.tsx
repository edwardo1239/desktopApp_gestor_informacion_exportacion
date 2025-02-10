/* eslint-disable prettier/prettier */
import { useEffect, useState } from "react"
import formato from "./formularios/volanteCalidad0.0.1.json"
import { userType } from "@renderer/types/cuentas"
import useAppContext from "@renderer/hooks/useAppContext"
export default function IngresoVolanteCalidad(): JSX.Element {
    const { messageModal } = useAppContext();
    const [operarios, setOperarios] = useState<userType[]>()
    const [operario, setOperario] = useState<string>()
    const [tipoFruta, setTipoFruta] = useState<string>()
    const [unidades, setUnidades] = useState<string>()
    const [defectos, setDefectos] = useState<string>()

    useEffect(() => {
        obtenerOperarios();
    }, []);

    const obtenerOperarios = async (): Promise<void> => {
        try {
            const request = { action: "obtener_operarios_seleccionadoras" }
            const response = await window.api.server2(request);
            if (response.status !== 200)
                throw new Error(`Code ${response.status}: ${response.message}`);
            setOperarios(response.data);
        } catch (err) {
            if (err instanceof Error) {
                messageModal("error", err.message)
            }
        }
    }
    const handleGuardar = async (e): Promise<void> => {
        e.preventDefault()

        try {
            const request = {
                action: "add_volante_calidad",
                data: {
                    tipoFruta: tipoFruta,
                    unidades: Number(unidades),
                    defectos: Number(defectos),
                    operario: operario
                }
            }
            console.log(request)
            const response = await window.api.server2(request)
            if(response.status !== 200)
                throw new Error(`Code ${response.status}: ${response.message}`)
            messageModal("success", "Guardado con exito!")
        } catch (err) {
            if (err instanceof Error) {
                messageModal("error", err.message)
            }
        } finally {
            setOperario('')
            setTipoFruta('')
            setUnidades('')
            setDefectos('')
        }
    }
    return (
        <div className="componentContainer">
            <div className="navBar"></div>
            <h2>Ingreso volante calidad</h2>
            <hr />

            <form className="form-container" onSubmit={handleGuardar}>
                <div>
                    <label>{formato.operario}</label>
                    <select value={operario} className="defaultSelect" onChange={
                        (e): void => { 
                            setOperario(e.target.value) 
                        }
                    } required>
                        <option></option>
                        {operarios && operarios?.map(operario => (
                            <option value={operario._id}  key={operario._id}>
                                {operario.nombre + " " + operario.apellido}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>{formato.tipoFruta}</label>
                    <select className="defaultSelect" value={tipoFruta} onChange={(e): void => setTipoFruta(e.target.value)} required>
                        <option></option>
                        <option value="Limon">Limon</option>
                        <option value="Naranja">Naranja</option>
                    </select>
                </div>
                <div>
                    <label>{formato.unidades}</label>
                    <input type="text" value={unidades} onChange={(e): void => setUnidades(e.target.value)} required />
                </div>
                <div>
                    <label>{formato.defectos}</label>
                    <input type="text" value={defectos} onChange={(e): void => setDefectos(e.target.value)} required />
                </div>
                <div className='defaultSelect-button-div'>
                    <button type='submit'>Guardar</button>
                </div>
            </form>

        </div>
    )
}
