/* eslint-disable prettier/prettier */
import { registrosType, serverResponse } from "../type/type"

export function isServerResponse(obj): obj is serverResponse<registrosType[]> {
  console.log(obj)
  return obj && typeof obj === 'object' && 'status' in obj && 'data' in obj && Array.isArray(obj.data)
}
