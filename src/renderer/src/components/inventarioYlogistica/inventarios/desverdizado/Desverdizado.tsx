/* eslint-disable prettier/prettier */
import InventarioDesverdizado from "./components/InventarioDesverdizado"
import NavBarDesverdizado from "./utils/NavBarDesverdizado"
import { memo, useState } from 'react'

const MemoizedNavBar = memo(NavBarDesverdizado);

export default function Desverdizado(): JSX.Element {
  const [filtro, setFiltro] = useState<string>('')

  const handleFilter = (data: string): void => {
    setFiltro(data)
  }

  return (
    <div className='componentContainer'>
      <MemoizedNavBar handleFilter={handleFilter} />
      <h2>Fruta desverdizando</h2>
        <InventarioDesverdizado filtro={filtro} />
    </div>
  )
}

