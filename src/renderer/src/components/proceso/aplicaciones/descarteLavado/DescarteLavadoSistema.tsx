/* eslint-disable prettier/prettier */
import { useEffect, useState } from "react";
import { formInit, labels, sumarDatos } from "./func/functions";
import { datosPredioType, FormCategory, FormState } from "./types/types";
import useAppContext from "@renderer/hooks/useAppContext";
import './styles/styles.css'

export default function DescarteLavadoSistema(): JSX.Element {
    const { messageModal } = useAppContext();
    const [formState, setFormState] = useState<FormState>(formInit);
    const [reload, setReload] = useState<boolean>(false);
    const [datosPredio, setDatosPredio] = useState<datosPredioType>({
        _id: "",
        enf: "",
        tipoFruta: "",
        nombrePredio: "",
    });
    useEffect(() => {
        obtenerLote()
        window.api.reload(() => {
            setReload(!reload)
        });
        return () => {
            window.api.removeReload()
        }
    }, []);

    const obtenerLote = async (): Promise<void> => {
        try {
            const response = await window.api.server2({ action: "get_proceso_aplicaciones_descarteLavado" })
            if (response.status !== 200) {
                throw new Error(`Code ${response.status}: ${response.message}`)
            }
            setDatosPredio({
                _id: response.data._id,
                enf: response.data.enf,
                tipoFruta: response.data.tipoFruta,
                nombrePredio: response.data.nombrePredio,
            });
        } catch (err) {
            if (err instanceof Error) {
                messageModal("error", err.message)
            }
        }
    };
    const handleChange = (name: keyof FormState, value: string, type: keyof FormCategory): void => {
        setFormState((prevState) => ({
            ...prevState,
            [name]: {
                ...prevState[name],
                [type]: value,
            },
        }));
    };
    const guardarDatos = async (): Promise<void> => {
        try {
            const data = sumarDatos(formState, datosPredio);
            const request = {
                action: "put_proceso_aplicaciones_descarteLavado",
                _id: datosPredio._id,
                data: data,
            };
            console.log(request)
            const response = await window.api.server2(request)
            if (response.status !== 200) {
                throw new Error(`Error guardando los datos ${response.message}`);
            }
            messageModal("success", "Guardado con exito");
        } catch (err) {
            if (err instanceof Error) {
                messageModal("error", `${err.name}: ${err.message}`);
            }
        } finally {
            setFormState(formInit);
        }
    };
    return (
        <div className="componentContainer">
            <div className="navBar"></div>
            <h2>Descarte Lavado</h2>
            <hr />
            <div className="proceso-aplicaciones-descarteLavado-div1">
                <h3>Numero de lote:</h3>
                <p>{datosPredio.nombrePredio}</p>
                <p>{datosPredio.enf}</p>
            </div>
            <div className="form-container">
                {Object.keys(labels).map(item => (
                    <div key={item} className="proceso-aplicaciones-descarteLavado-div-form">
                        <p >{labels[item]}</p>
                        <input
                            onChange={(value): void => handleChange(item as keyof FormState, (value.target.value), "canastillas")}
                            placeholder="N. de canastillas"
                            type="number"
                            value={formState[item].canastillas}
                        />
                        <input
                            onChange={(value): void => handleChange(item as keyof FormState, (value.target.value), "kilos")}
                            placeholder="Kilos"
                            value={formState[item].kilos}
                            type="number"
                        />
                    </div>
                ))}
                <div >
                    <button onClick={guardarDatos}>Guardar</button>
                </div>
            </div>
        </div>
    )
}