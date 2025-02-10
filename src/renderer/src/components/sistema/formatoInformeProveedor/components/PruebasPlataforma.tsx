/* eslint-disable prettier/prettier */

import { formType } from "../SistemaFormulariosCrearInformeProveedor"

type propsType = {
    handleChange: (event) => void
    formState: formType | undefined
}
export default function PruebasPlataforma(props: propsType): JSX.Element {
    return (
        <div className="info-general">
            <label>
                <p>Brix</p>
                <input
                    value={props.formState ? props.formState.brix : ''}
                    type="text"
                    onChange={props.handleChange}
                    required name="brix" />
            </label>
            <label>
                <p>Acidez</p>
                <input
                    value={props.formState ? props.formState.acidez : ''}
                    type="text"
                    onChange={props.handleChange}
                    required name="acidez" />
            </label>
            <label>
                <p>Ratio</p>
                <input
                    value={props.formState ? props.formState.ratio : ''}
                    type="text"
                    onChange={props.handleChange}
                    required name="ratio" />
            </label>
            <label>
                <p>Zumo</p>
                <input
                    value={props.formState ? props.formState.zumo : ''}
                    type="text" 
                    onChange={props.handleChange} 
                    required name="zumo" />
            </label>
        </div>
    )
}