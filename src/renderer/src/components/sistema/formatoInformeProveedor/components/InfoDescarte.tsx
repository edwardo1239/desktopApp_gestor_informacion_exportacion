/* eslint-disable prettier/prettier */
import { formType } from "../SistemaFormulariosCrearInformeProveedor"

type propsType = {
    handleChange: (event) => void
    formState: formType | undefined

}

export default function InfoDescarte(props: propsType): JSX.Element {
    return (
        <div className="info-general">
            <label>
                <p>Descarte general</p>
                <input 
                    value={props.formState ? props.formState.descarteGeneral : ''}
                    type="text" 
                    onChange={props.handleChange} 
                    name="descarteGeneral" required/>
            </label>
            <label>
                <p>Pareja</p>
                <input 
                    value={props.formState ? props.formState.pareja : ''}
                    type="text"
                    onChange={props.handleChange} 
                    name="pareja" required/>
            </label>
            <label>
                <p>Balin</p>
                <input 
                    value={props.formState ? props.formState.balin : ''}
                    type="text" 
                    onChange={props.handleChange} 
                    name="balin" required/>
            </label>
            <label>
                <p>Extra</p>
                <input 
                    value={props.formState ? props.formState.extra : ''}
                    type="text" 
                    onChange={props.handleChange}
                    name="extra" required/>
            </label>
            <label>
                <p>Descompuesta</p>
                <input 
                    value={props.formState ? props.formState.descompuesta : ''}
                    type="text" 
                    onChange={props.handleChange} 
                    name="descompuesta" required/>
            </label>
            <label>
                <p>Hojas</p>
                <input 
                    value={props.formState ? props.formState.hojas : ''}
                    type="text" 
                    onChange={props.handleChange} 
                    name="hojas" required/>
            </label>
            <label>
                <p>Desprendimiento de piel</p>
                <input 
                    value={props.formState ? props.formState.piel : ''}
                    type="text" 
                    onChange={props.handleChange} 
                    name="piel" required/>
            </label>
            <label>
                <p>Fruta nacional</p>
                <input 
                    value={props.formState ? props.formState.frutaNacional : ''}
                    type="text" 
                    onChange={props.handleChange} 
                    name="frutaNacional" required/>
            </label>
        </div>
    )
}