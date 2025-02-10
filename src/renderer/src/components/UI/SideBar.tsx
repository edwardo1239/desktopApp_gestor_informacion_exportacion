/* eslint-disable prettier/prettier */
import useAppContext from '@renderer/hooks/useAppContext';
import { useEffect, useRef, useState, Fragment } from 'react'
import { FcFolder } from "react-icons/fc";
import { FcOpenedFolder } from "react-icons/fc";
import { FcDepartment } from "react-icons/fc";
import { FcCommandLine } from "react-icons/fc";
import './styles/sideBarStyle.css'

type propsType = {
  seleccionWindow: (data: string, name: string) => void
  handleSideBarWidth: () => void
  showSideBar: boolean
  setWidthBar: (e: number) => void
}

export default function SideBar(props: propsType): JSX.Element {
  const { user } = useAppContext();
  const isResizingRef = useRef(false)
  const [width, setWidth] = useState<number>(100)

  const [areaSelect, setAreaSelect] = useState<string[]>([])
  const [elementSelect, setElementSelect] = useState<string[]>([])

  useEffect((): void => {
    console.log(user)
  }, [])

  useEffect(() => {
    if (props.showSideBar) {
      setWidth(250)
      props.setWidthBar(250)
    } else {
      setWidth(0)
      props.setWidthBar(0)

    }
  }, [props.showSideBar])


  const handleMouseMove = (e): void => {
    if (isResizingRef) {
      setWidth(e.clientX);
      props.setWidthBar(e.clientX)

    }
  };

  const handleMouseDown = (e): void => {
    if (e.target === e.currentTarget) {
      e.stopPropagation();
      isResizingRef.current = true;
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
  };

  const handleMouseUp = (): void => {
    isResizingRef.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
  };

  const handleClickArea = (index): void => {
    if (areaSelect.includes(index)) {
      const indexToRemove = areaSelect.findIndex(item => item === index)
      setAreaSelect(prevState => prevState.filter((_, indexArr) => indexArr !== indexToRemove));
    } else {
      setAreaSelect(prevState => [...prevState, index]);
    }
  }

  const handleClickElement = (index): void => {
    if (elementSelect.includes(index)) {
      const indexToRemove = elementSelect.findIndex(item => item === index)
      setElementSelect(prevState => prevState.filter((_, indexArr) => indexArr !== indexToRemove));
    } else {
      setElementSelect(prevState => [...prevState, index]);
    }
  }


if(user === undefined){
  return <div></div>
}


  return (
    <aside
      className={`side-bar-container ${isResizingRef.current ? 'resizing' : 'not-resizing'}`}
      style={{ width: `${width}px`, minWidth: `${width}px` }}
      onMouseDown={handleMouseDown}
    >
      <div className="side-bar-menu" onClick={(): null => null}>
        {props.showSideBar ?
          <ul className="side-bar-menu-lista1">
            {Object.keys(user.permisos).map((item, index) => {
              if (!['_id', 'Cargo', 'createdAt', 'Rol', '__v'].includes(item)) {
                return (
                  <Fragment key={index}>
                    <li>
                      <button onClick={(): void => handleClickArea(item + index)}>
                        <div className=' text-sm'>
                          <FcDepartment />
                        </div>
                        {item}
                      </button>
                    </li>

                    <li>
                      {areaSelect.includes(item + index) ?
                        <ul className="side-bar-menu-lista2">
                          {Object.keys(user.permisos[item]).map((itemElemento, indexElement) => (
                            <Fragment key={indexElement}>
                              <li key={itemElemento[1] + indexElement} >
                                <button onClick={(): void => handleClickElement(itemElemento + indexElement)}>
                                  <div>
                                    {elementSelect.includes(itemElemento) ? <FcOpenedFolder /> : <FcFolder />}
                                  </div>
                                  {itemElemento}
                                </button>
                              </li>
                              <li>
                                {elementSelect.includes(itemElemento + indexElement) ?
                                  <ul className="side-bar-menu-lista3">
                                    {Object.keys(user.permisos[item][itemElemento]).map((permiso, indexPermiso) => (
                                      <Fragment key={indexPermiso + permiso}>
                                        <li>
                                          <button onClick={(): void => props.seleccionWindow(
                                            user.permisos[item][itemElemento][permiso]._id,
                                            permiso
                                          )}>
                                            <div>
                                              <FcCommandLine />
                                            </div>
                                            <p>{permiso}</p>
                                          </button>
                                        </li>
                                      </Fragment>
                                    ))}
                                  </ul>
                                  :
                                  <div></div>}
                              </li>
                            </Fragment>
                          ))}
                        </ul> :
                        null
                      }
                    </li>
                  </Fragment>)
              }
              else { return null }
            })}
          </ul> :
          <div ></div>
        }
      </div>
    </aside>
  )
}


