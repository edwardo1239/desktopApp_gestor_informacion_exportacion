/* eslint-disable prettier/prettier */

import useAppContext from "@renderer/hooks/useAppContext";
import { userType } from "@renderer/types/cuentas";
import { useEffect, useState } from "react";
import './styles/styles.css'
import formato from "./formularios/formularioCalidad0.0.1.json"
import { formatoInit, FormatoType } from "./formularios/formulario";

export default function IngresoHigienePersonal(): JSX.Element {
    const { messageModal } = useAppContext();
    const [operarios, setOperarios] = useState<userType[]>()
    const [operario, setOperario] = useState<string>()
    const [formState, setFormState] = useState<FormatoType>(formatoInit)


    useEffect(() => {
        obtenerOperarios();
    }, []);

    const obtenerOperarios = async (): Promise<void> => {
        try {
            const request = { action: "obtener_operarios_higiene" }
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
        try{
            const request = {
                action: "add_higiene_personal",
                data:{
                    ...formState,
                    operario: operario
                } 
            }
            const response = await window.api.server2(request)
            if(response.status !== 200)
                throw new Error(`Code: ${response.status}: ${response.message}`)
            messageModal('success', 'Datos guardado con exito!')
        } catch(err){
            if(err instanceof Error){
                messageModal('error', err.message);
            }
        } finally {
            setFormState(formatoInit);
            setOperario('');
        }
    }
    const handleChange = (event): void => {
        const { name, checked } = event.target;
        
        setFormState({
          ...formState,
          [name]: checked,
        });
      };
    return (
        <div className="componentContainer">
            <div className="navBar"></div>
            <h2>Ingreso Higiene Personal</h2>
            <hr />

            <form className="form-container" onSubmit={handleGuardar}>
                <div>
                    <label>{formato.responsable}</label>
                    <select value={operario} className="defaultSelect" onChange={
                        (e): void => {
                            setOperario(e.target.value)
                        }
                    } required>
                        <option></option>
                        {operarios && operarios?.map(operario => (
                            <option value={operario._id} key={operario._id}>
                                {operario.nombre + " " + operario.apellido}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="formularios-container">
                    {Object.entries(formato).map(([key, value]) => {
                        if (key !== "version" && key !== 'responsable') {
                            return (
                                <div key={key} className="formularios-checkbox">
                                    <label>
                                        <p>{value}</p>
                                        <input 
                                            checked={formState[key]}
                                            name={key}
                                            type="checkbox"  
                                            onChange={handleChange}/>
                                    </label>
                                </div>
                            )
                        } else return null
                    })}
                </div>
                <div className='defaultSelect-button-div'>
                    <button type='submit'>Guardar</button>
                </div>
            </form>

        </div>
    )
}
