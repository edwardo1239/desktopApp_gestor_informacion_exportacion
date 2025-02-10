/* eslint-disable prettier/prettier */
import { useState } from 'react'

type propsType = {
  handleFilter: (data: string) => void
}

export default function NavBarDesverdizado(props: propsType): JSX.Element {
  const [search, setSearch] = useState<string>('')

  const handleText = (data: string): void => {
    setSearch(data)
    props.handleFilter(data)
  }


  return (
    <div className="navBar">
      <input
        type="text"
        value={search}
        onChange={(e): void => handleText(e.target.value)}/>
    </div>
  )
}
