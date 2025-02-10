/* eslint-disable prettier/prettier */
import { useState, useEffect } from 'react'
import logo from '../../assets/CELIFRUT.png'
import "./css/styles.css"
import "../../css/main.css"


export default function Login(): JSX.Element {
  let check = true;
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [errUser, setErrUser] = useState<boolean>(false)
  const [errPass, setErrPass] = useState<boolean>(false)

  const handleSubmit = async (event): Promise<void> => {
    try {
      if (check) {
        event.preventDefault()
        check = false
        const datosLogIn = {
          user: username.trim().toLowerCase(),
          password: password,
        }
        console.log(datosLogIn)
        const response = await window.api.user2(datosLogIn)
        
        if (response.status === 401) {
          setErrUser(true)
          setTimeout(() => {
            setErrUser(false)
          }, 3000)
        } else if (response.status === 402) {
          setErrPass(true)
          setTimeout(() => {
            setErrPass(false)
          }, 3000)
        }
      }
    } catch (e) {
      console.error(e)
    } finally {
      check = true
    }
  }

  useEffect(() => {
    setErrUser(false)
    setErrPass(false)
  }, [username, password])

  return (
    <div className='loginContainer'>
      <form onSubmit={handleSubmit} className={`formLogin`}>
        <div className='loginInput'>
          <label>Usuario</label>
          <input
            className={"defaultSelect"}
            id="username"
            type="text"
            value={username}
            onChange={(e): void => setUsername(e.target.value)}
          />
          <div className="errorContainer">
            <p
              style={{ visibility: errUser ? 'visible' : 'hidden' }}
              className={"errorText"}>
              {errUser ? 'Usuario incorrecto' : '   '}
            </p>
          </div>
        </div>
        <div className='loginInput'>
          <label>Contraseña</label>
          <input
            className={"defaultSelect"}
            id="password"
            type="password"
            value={password}
            onChange={(e): void => setPassword(e.target.value)}
          />
          <div className="errorContainer">
            <p
              style={{ visibility: errPass ? 'visible' : 'hidden' }}
              className={"errorText"}>
              {errPass ? 'Contraseña incorrecta' : '   '}
            </p>
          </div>
        </div>
        <div className="loginbuttonsDiv">
          <button
            className="defaulButtonAgree"
            type="submit"
          >
            Iniciar
          </button>
        </div>
        <div className="loginImgDiv">
          <img
            src={logo}
          />
        </div>
      </form>
    </div>
  )
}
