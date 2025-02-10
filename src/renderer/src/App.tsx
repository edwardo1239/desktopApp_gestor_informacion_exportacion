/* eslint-disable prettier/prettier */
import { createContext, useEffect, useState } from 'react'
import "./css/main.css"
import NavBar from './components/UI/NavBar'
import { themeType } from './env'
import SideBar from './components/UI/SideBar'
// import Login from './components/Login/Login'
import { userType } from './types/login'
import MessagesComponent from './messages/MessagesComponent'
import Ventana from './components/UI/Ventana'
import Pestañas from './components/UI/Pestañas'


type OpenModalFunction = (messageType: string, message: string) => void;

type MyContextDataType = {
  dataComponentes: string
  setDataComponentes: React.Dispatch<React.SetStateAction<string>>;
};

type confirmationDataType = {
  confirmation: boolean
  setConfirmation: React.Dispatch<React.SetStateAction<boolean>>;
};

type seleccionWindowType = (data: string, name: string) => void


export const dataContext = createContext<MyContextDataType | undefined>(undefined)
export const messageContext = createContext<OpenModalFunction | undefined>(undefined);
export const confirmacionContext = createContext<confirmationDataType | undefined>(undefined);
export const seleccionWindowContext = createContext<seleccionWindowType | undefined>(undefined);
export const statusProcesoContext = createContext<string>('off')

//eventos
export const eventoServidorContext = createContext<string>('')
export const triggerEventContext = createContext<boolean>(false)

export const userContext = createContext<userType | undefined>(undefined)

export interface eventoServidorType {
  data: object
  action: string
}


function App(): JSX.Element {
  // const [isLogin, setIsLogin] = useState<boolean>(false)
  const [versionState, setVersionState] = useState<string>('')
  const [theme, setTheme] = useState<themeType>('Ligth')
  const [user, setUser] = useState<userType>()
  const [section, setSection] = useState<string[][]>()
  const [pestañaActiva, setPestañaActiva] = useState<string>()
  const [showSideBar, setShowSideBar] = useState<boolean>(true);
  const [dataComponentes, setDataComponentes] = useState<string>('')
  const [messageType, setMessageType] = useState<string>('')
  const [message, setMessage] = useState<string>('')
  const [widthBar, setWidthBar] = useState<number>(100)
  const [isProcesoStart, setIsprocesoStart] = useState<string>('off')

  const [eventoServidor, setEventoservidor] = useState<string>('')
  const [trigger, setTrigger] = useState(false);


  const openMessage = (messageType: string, message: string): void => {
    setMessageType(messageType);
    setMessage(message);
    setTimeout(() => {
      setMessageType('');
      setMessage('');
    }, 5000);
  };


  useEffect(() => {
    funcionAuxiliar()
    window.api.status_proceso("status_proceso", (data) => {
      console.log("status proceso", data)
      setIsprocesoStart(data.status)
    });
    return () => {
      window.api.removeStatus_proceso('status_proceso', () => console.log("removido"))
    }
  }, [])

  useEffect(() => {
    window.api.server_event("server_event", (data) => {
      setTrigger(prev => !prev);
      setEventoservidor(data.action);
    });
  }, []);
  const funcionAuxiliar = async (): Promise<void> => {
    try {
      const response = await window.api.obtenerTheme()
      const version = await window.api.version();
      const cuenta = await window.api.obtenerCuenta();
      const responseIsProcesoStart = await window.api.server2({
        action: 'obtener_status_proceso'
      })
      setIsprocesoStart(responseIsProcesoStart.data)
      setUser(cuenta)
      setVersionState(version)
      document.title = "Celifrut App " + version;
      if (response === "Dark") {
        setTheme('Dark')
        document.body.classList.add('dark-theme');
      }
      else {
        setTheme('Ligth')
        document.body.classList.remove('dark-theme');
      }

    } catch (e: unknown) {
      alert(`${e}`)
    }
  }
  const changeTheme = (choose: boolean): void => {
    if (choose === true) {
      setTheme('Dark')
      document.body.classList.add('dark-theme');
    }
    else {
      setTheme('Ligth')
      document.body.classList.remove('dark-theme');

    }
  }
  const seleccionWindow = (data: string, name: string): void => {
    setSection(prev => {
      if (prev === undefined) {
        setPestañaActiva(data)
        return [[data, name]]
      } else {
        const existingItem = prev.find(item => item[0] === data);
        if (!existingItem) {
          setPestañaActiva(data);
          return [...prev, [data, name]];
        } else {
          // Si el item ya existe, simplemente activamos esa pestaña
          setPestañaActiva(data);
          return prev; // Retornamos el array sin cambios
        }
      }
    })
  }

  const selccionPestaña = (pestaña: string): void => {
    setPestañaActiva(pestaña)
  }
  const handleSideBarWidth = (): void => {
    setShowSideBar(!showSideBar);
  }
  const closePestaña = (id: string): void => {
    setSection(prev => {
      if (prev !== undefined) {
        const newSection = prev.filter(item => item[0] !== id);

        // Lógica para manejar pestañaActiva
        if (pestañaActiva === id) {
          if (newSection.length > 0) {
            setPestañaActiva(newSection[0][0]);
          } else {
            setPestañaActiva(undefined);
          }
        }

        return newSection;
      }
      return prev;
    });
  }
  return (

    <dataContext.Provider value={{ dataComponentes, setDataComponentes, }}>
      <statusProcesoContext.Provider value={isProcesoStart} >
        <userContext.Provider value={user}>
          <messageContext.Provider value={openMessage}>
            <seleccionWindowContext.Provider value={seleccionWindow}>
              <eventoServidorContext.Provider value={eventoServidor}>
                <triggerEventContext.Provider value={trigger}>
                  <main>


                      <div className={`UI-container-navBar`}>
                        <NavBar theme={theme} changeTheme={changeTheme} showSideBar={showSideBar} setShowSideBar={setShowSideBar} />
                      </div>

                      <div className='UI-container-side-ventana'>
                        <SideBar
                          setWidthBar={setWidthBar}
                          seleccionWindow={seleccionWindow}
                          handleSideBarWidth={handleSideBarWidth}
                          showSideBar={showSideBar} />
                        <div className='UI-ventana'>
                          <Pestañas
                            closePestaña={closePestaña}
                            pestañaActiva={pestañaActiva}
                            section={section}
                            selccionPestaña={selccionPestaña}
                          />
                          <Ventana version={versionState} section={section} pestañaActiva={pestañaActiva} widthBar={widthBar} />
                        </div>
                      </div>
                      {/* )} */}
                    {message !== '' && <MessagesComponent messageType={messageType} message={message} />}
                  </main>

                </triggerEventContext.Provider>
              </eventoServidorContext.Provider>
            </seleccionWindowContext.Provider>
          </messageContext.Provider>
        </userContext.Provider>
      </statusProcesoContext.Provider>
    </dataContext.Provider>
  )
}

export default App
