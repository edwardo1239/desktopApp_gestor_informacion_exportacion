/* eslint-disable prettier/prettier */

import { useState } from "react";
import { formInit, labelForm } from "./function/reduce";
import useAppContext from "@renderer/hooks/useAppContext";

export default function PrecioNaranja(): JSX.Element {
    const { messageModal } = useAppContext();
    const [formState, setFormState] = useState(formInit);

    const handleChange = (event): void => {
        const { name, value } = event.target;
        
        setFormState({
          ...formState,
          [name]: Number(value),
        });
      };
    const handleGuardar = async (event): Promise<void> => {
        event.preventDefault();
        try {
            const request = {
                action: "ingresar_precio_fruta",
                data: { precio: formState, tipoFruta: 'Naranja' },
            }
            const response = await window.api.server2(request);
            if (response.status !== 200) {
                throw response;
            }
            messageModal("success", "Precios guardados con exito");
        } catch (err) {
            let errorMessage = "Unknown error occurred";
            if (typeof err === 'object' && err !== null && 'status' in err && 'message' in err) {
                errorMessage = `Code ${(err as { status: number, message: string }).status}: ${(err as { status: number, message: string }).message}`;
            }
            messageModal('error', errorMessage);
        }
    };

    return (
        <div className="componentContainer">
            <div className="navBar"></div>
            <h2>Precio Naranja</h2>
            <form className="form-container" onSubmit={handleGuardar}>
                {Object.keys(labelForm).map(key => (
                    <div key={key}>
                        <label>{labelForm[key as keyof typeof labelForm]}</label>
                        <input
                            placeholder="$"
                            type="number"
                            name={key}
                            onChange={handleChange}

                        />
                    </div>
                ))}
                <div className='defaultSelect-button-div'>
                    <button type='submit'>Guardar</button>
                </div>
            </form>
        </div>
    )
}
