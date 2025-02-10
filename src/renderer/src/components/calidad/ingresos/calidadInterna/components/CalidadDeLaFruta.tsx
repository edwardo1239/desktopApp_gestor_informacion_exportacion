/* eslint-disable prettier/prettier */
import { lotesType } from "@renderer/types/lotesType"

type propsType = {
    lote: lotesType
    handleChangeCalidad: (e) => void
}
export default function CalidadDeLaFruta(props: propsType): JSX.Element {
    if (!props.lote || !props.lote.tipoFruta) {
        return (
            <div className="calidad-interna-calidad-div">
                <h2>Seleccione predio...</h2>
            </div>
        )
    }
    return (
        <div className="calidad-interna-calidad-div">
            <h2>Calidad</h2>

            {props.lote.tipoFruta === "Limon" &&
                <div>
                    <label>
                        <input type="radio" name="calidad" value="1 - 1.5" onChange={props.handleChangeCalidad}/>
                        1 - 1.5
                    </label>
                    <label>
                        <input type="radio" name="calidad" value="Combinado" onChange={props.handleChangeCalidad}/>
                        Combinado
                    </label>
                    <label>
                        <input type="radio" name="calidad"  value="2" onChange={props.handleChangeCalidad}/>
                        2
                    </label>
                </div>
            }

            {props.lote.tipoFruta === "Naranja" &&
                <div>
                    <label>
                        <input type="radio" name="calidad" value="1 - 1.5" onChange={props.handleChangeCalidad}/>
                        1 - 1.5
                    </label>
                    <label>
                        <input type="radio" name="calidad" value="Zumo" onChange={props.handleChangeCalidad}/>
                        Zumo
                    </label>
                </div>
            }

        </div>
    )
}