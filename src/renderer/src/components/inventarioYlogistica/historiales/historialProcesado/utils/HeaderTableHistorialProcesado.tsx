/* eslint-disable prettier/prettier */
export default function HeaderTableHistorialProcesado(): JSX.Element {
  const headers = ["","EF1","Nombre del predio","Canastillas","Kilos","Tipo de fruta","Fecha", "User"];
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
