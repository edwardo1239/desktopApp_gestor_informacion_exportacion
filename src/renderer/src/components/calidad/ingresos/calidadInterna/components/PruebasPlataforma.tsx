/* eslint-disable prettier/prettier */
import { calidadInternaType } from '../types/calidadInterna'


type propsType = {
  handleChange: (data: React.ChangeEvent<HTMLInputElement>, action: string) => void
  formulario: calidadInternaType
}

export default function PruebasPlataforma(props: propsType):JSX.Element {
  return (
    <div className="calidad-interna-pruebas-div">
      <h2>Pruebas de plataforma</h2>
      <div>
        <p>N° muestra 1</p>
        <input
          className='defaultSelect'
          type="number"
          placeholder="Brix"
          onChange={(e): void => props.handleChange(e, 'brix1')}
          value={props.formulario.brix1}
        />
        <input
          className='defaultSelect'
          type="number"
          placeholder="Acidez"
          onChange={(e): void => props.handleChange(e, 'acidez1')}
          value={props.formulario.acidez1}
        />
      </div>
      <div>
        <p>N° muestra 2</p>
        <input
          className='defaultSelect'
          type="number"
          placeholder="Brix"
          onChange={(e): void => props.handleChange(e, 'brix2')}
          value={props.formulario.brix2}
        />
        <input
          className='defaultSelect'
          type="number"
          placeholder="Acidez"
          onChange={(e): void => props.handleChange(e, 'acidez2')}
          value={props.formulario.acidez2}
        />
      </div>
      <div>
        <p>N° muestra 3</p>
        <input
          className='defaultSelect'
          type="number"
          placeholder="Brix"
          onChange={(e): void => props.handleChange(e, 'brix3')}
          value={props.formulario.brix3}
        />
        <input
          className='defaultSelect'
          type="number"
          placeholder="Acidez"
          onChange={(e): void => props.handleChange(e, 'acidez3')}
          value={props.formulario.acidez3}
        />
      </div>
    </div>
  )
}
