/* eslint-disable prettier/prettier */
import { useEffect, useState } from 'react';
import { themeType } from '@renderer/env';
import { RiSideBarFill } from 'react-icons/ri';
import { RiSideBarLine } from 'react-icons/ri';
import { IoSunnySharp } from 'react-icons/io5';
import { GiEvilMoon } from 'react-icons/gi';
import logo from '../../assets/1.webp';
import { IoIosLogOut } from "react-icons/io";
import './styles/navBar.css'
import useAppContext from '@renderer/hooks/useAppContext';
import ConfirmacionModal from '@renderer/messages/ConfirmacionModal';
import { FaUserAlt } from "react-icons/fa";
import { BsFillBugFill } from "react-icons/bs";
import { FaLightbulb } from "react-icons/fa";
type propsType = {
  theme: themeType;
  changeTheme: (choose: boolean) => void;
  showSideBar: boolean;
  setShowSideBar: (e) => void;
};

export default function NavBar(props: propsType): JSX.Element {
  const { messageModal, seleccionWindow } = useAppContext();
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [showInicio, setShowInicio] = useState<boolean>(false); // Nuevo estado para controlar si se muestra el componente Inicio.tsx
  const [showConfirmacion, setShowConfirmacion] = useState<boolean>(false)
  const [confirm, setConfirm] = useState<boolean>(false)
  const [message, setMessage] = useState<string>('')

  const handleClick = (): void => {
    setShowInicio(!showInicio); // Cambia el estado para mostrar u ocultar el componente Inicio.tsx
  };

  useEffect(() => {
    if (confirm) {
      cerrarSesion()
      setConfirm(false)
    }
  }, [confirm]);

  const cerrarSesion = async (): Promise<void> => {
    try {
      await window.api.cerrarSesion();
    } catch (err) {
      if (err instanceof Error) {
        messageModal("error", err.message)
      }
    }
  }

  const handleEliminar = (): void => {
    setShowConfirmacion(true)
    setMessage("¿Desea cerrar sesion?")
  }

  const handleVentana = (): void => {
    seleccionWindow("MiCuenta", "MiCuenta")
  }

  const handleReporteFallo = async (): Promise<void> => {
    try {
      await window.api.reporteFallo()
    } catch (err) {
      if (err instanceof Error) {
        messageModal("error", `Error ${err.name}: ${err.message}`)
      }
    }
  }
  const handleSugerenciaMejora = async (): Promise<void> => {
    try {
      await window.api.sugerenciaMejora()
    } catch (err) {
      if (err instanceof Error) {
        messageModal("error", `Error ${err.name}: ${err.message}`)
      }
    }
  }

  return (
    <>
      <nav>
        <div className="ui-nav-bar">

          <div
            data-testid='UI-navbar-logo'
            className="ui-nav-bar-logo"
            onClick={handleClick} // Llama a la función handleClick cuando se hace clic en la imagen o en el cuadro
          >
            <img src={logo} width={40} />
          </div>
          <div className="ui-nav-bar-elementos">
            <button
              data-testid='UI-navbar-fallos'
              onClick={handleReporteFallo}
              title='Reporte de fallo'
              className="ui-nav-bar-esconder-side-bar">
              <BsFillBugFill />
            </button>
            <button
              data-testid='UI-navbar-sugerencia'
              onClick={handleSugerenciaMejora}
              title='Sugerencia'
              className="ui-nav-bar-esconder-side-bar">
              <FaLightbulb />
            </button>
            <button
              data-testid='UI-navbar-cuenta'
              onClick={handleVentana}
              title='Cuenta'
              className="ui-nav-bar-esconder-side-bar">
              <FaUserAlt />
            </button>
            <div
              data-testid='UI-navbar-sidebar'
              onClick={(): void => props.setShowSideBar(!props.showSideBar)}
              className="ui-nav-bar-esconder-side-bar"
            >
              {props.showSideBar ? <RiSideBarFill /> : <RiSideBarLine />}
            </div>
            <button
              data-testid='UI-navbar-tema'
              title='Tema'
              className="ui-nav-bar-esconder-side-bar"
              onClick={(): void => {
                setDarkMode(!darkMode);
                props.changeTheme(darkMode);
              }}
            >
              {props.theme === 'Dark' ? <IoSunnySharp /> : <GiEvilMoon />}
            </button>
            <button
              data-testid='UI-navbar-cerrar-sesión'
              onClick={handleEliminar}
              title='Cerrar sesión'
              className='ui-nav-bar-esconder-side-bar'>
              <IoIosLogOut />
            </button>

          </div>
        </div>
      </nav>
      {showConfirmacion &&
        <ConfirmacionModal
          message={message}
          setConfirmation={setConfirm}
          setShowConfirmationModal={setShowConfirmacion} />}
      {showInicio && <div></div>} {/* Muestra el componente Inicio.tsx si showInicio es true */}
    </>
  );
}

