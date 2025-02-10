/* eslint-disable prettier/prettier */
export type sendLogInType = {
  data: {
    query:{
      user:string
    }
  password: string
  }
  action: logIn
  query: string
  collection: string
}

export type responseLoginType = {
  status: number
  data: userType
}

interface userType {
  user: string
  permisos: string[]
  cargo:string
  rol: number
}


export type serverResponse<T> = { status: number; data: T }
