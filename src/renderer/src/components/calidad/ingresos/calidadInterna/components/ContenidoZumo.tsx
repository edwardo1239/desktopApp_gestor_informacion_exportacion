/* eslint-disable prettier/prettier */
import { calidadInternaType } from '../types/calidadInterna'

type propsType = {
  handleChange: (data: React.ChangeEvent<HTMLInputElement>, action: string) => void
  formulario: calidadInternaType
}

export default function ContenidoZumo(props: propsType): JSX.Element {
  const calcularPorcentaje = (): string => {
    const pesoInicial = parseFloat(props.formulario.pesoInicial)
    const pesoZumo = parseFloat(props.formulario.zumo)
    if (isNaN(pesoInicial) || isNaN(pesoZumo) || pesoInicial === 0) {
      return 'N/A'
    }
    const porcentaje = (pesoZumo / pesoInicial) * 100
    return porcentaje.toFixed(2)
  }

  return (
    <div className="calidad-interna-zumo-div">
      <h2>Contenido Zumo</h2>
      <input
        className='defaultSelect'
        type="number"
        placeholder="Peso inicial muestra (gr)"
        onChange={(e): void => props.handleChange(e, 'pesoInicial')}
        value={props.formulario.pesoInicial}
      />
      <input
        className='defaultSelect'
        type="number"
        placeholder="Peso zumo (gr)"
        onChange={(e): void => props.handleChange(e, 'zumo')}
        value={props.formulario.zumo}
      />
      <div className="checkBoxContainer">
        <label>
          Semillas
          <input
          id="semillas"
          type="checkbox"
          onChange={(e): void => props.handleChange(e, 'semillas')}
        />
        </label>
      </div>
      <p>
        Porcentaje de Llenado de Contenido Zumo: {calcularPorcentaje()}%
      </p>
    </div>
  )
}
