/* eslint-disable prettier/prettier */

import { formType } from "../SistemaFormulariosCrearInformeProveedor"

type propsType = {
    handleChange: (event) => void
    formState: formType | undefined
}

export default function InfoExportacion(props: propsType): JSX.Element {
    return (
        <div className="info-general">
            <label>
                <p>Exportacion tipo 1</p>
                <input 
                    value={props.formState ? props.formState.calidad1 : ''}
                    type="text" 
                    name="calidad1"
                    onChange={props.handleChange}/>
            </label>
            <label>
                <p>Exportacion tipo 1.5</p>
                <input 
                    value={props.formState ? props.formState.calidad15 : ''}
                    type="text" 
                    name="calidad15" 
                    onChange={props.handleChange}/>
            </label>
            <label>
                <p>Exportacion tipo 2</p>
                <input 
                    value={props.formState ? props.formState.calidad2 : ''}
                    type="text" 
                    name="calidad2" 
                    onChange={props.handleChange}/>
            </label>
        </div>
    )
}