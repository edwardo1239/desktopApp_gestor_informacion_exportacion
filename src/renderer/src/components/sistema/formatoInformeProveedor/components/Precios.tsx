/* eslint-disable prettier/prettier */

import { formType } from "../SistemaFormulariosCrearInformeProveedor"

type propsType = {
    handleChange: (event) => void
    formState: formType | undefined
}

export default function Precios(props: propsType): JSX.Element {
    return (
        <div className="info-general">
            <label>
                <p>Precio Exportacion tipo 1</p>
                <input 
                    value={props.formState ? props.formState.precioCalidad1 : ''}
                    type="text" 
                    name="precioCalidad1"
                    onChange={props.handleChange}/>
            </label>
            <label>
                <p>Precio Exportacion tipo 1.5</p>
                <input 
                    value={props.formState ? props.formState.precioCalidad15 : ''}
                    type="text" 
                    name="precioCalidad15" 
                    onChange={props.handleChange}/>
            </label>
            <label>
                <p>Precio Exportacion tipo 2</p>
                <input 
                    value={props.formState ? props.formState.precioCalidad2 : ''}
                    type="text" 
                    name="precioCalidad2" 
                    onChange={props.handleChange}/>
            </label>
            <label>
                <p>Precio Fruta nacional</p>
                <input 
                    value={props.formState ? props.formState.precioFrutaNacional : ''}
                    type="text" 
                    name="precioFrutaNacional" 
                    onChange={props.handleChange}/>
            </label>
            <label>
                <p>Precio Descarte</p>
                <input 
                    value={props.formState ? props.formState.precioDescarte : ''}
                    type="text" 
                    name="precioDescarte" 
                    onChange={props.handleChange}/>
            </label>
            <label>
                <p>Precio Combinado</p>
                <input 
                    value={props.formState ? props.formState.precioCombinado : ''}
                    type="text" 
                    name="precioCombinado" 
                    onChange={props.handleChange}/>
            </label>
        </div>
    )
}