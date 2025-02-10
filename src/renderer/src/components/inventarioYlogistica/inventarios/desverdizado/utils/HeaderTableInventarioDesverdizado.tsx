/* eslint-disable prettier/prettier */

export default function HeaderTableDesverdizado(): JSX.Element {

  const headers = ["","EF1", "Nombre del predio", "Canastillas", "Kilos", "Cuarto Desverdizado", "Fecha Ingreso" ]
  return (
    <thead>
      <tr >
      {headers.map(item => (
          <th key={item}>{item}</th>
      ))}
      </tr>
    </thead>
  )
}
