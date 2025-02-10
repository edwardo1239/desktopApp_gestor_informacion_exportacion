/* eslint-disable prettier/prettier */

type propsType = {
  handleFilter: (data: string) => void
}

export default function NavBarDescartes(props: propsType): JSX.Element {

  const handleText = (data: string): void => {
    props.handleFilter(data)
  }

  return (
    <div className="navBar">
      <select onChange={(e): void => handleText(e.target.value)} >
        <option value="">Tipo de fruta</option>
        <option value="Naranja">Naranja</option>
        <option value="Limon">Limon</option>
      </select>
    </div>
  
  )
}
