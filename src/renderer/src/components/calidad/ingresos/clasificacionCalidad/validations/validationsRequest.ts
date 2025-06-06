/* eslint-disable prettier/prettier */

import { getErrorMessages } from "@renderer/utils/error"
import { z } from "zod"


export const validateRequest = (data: object): boolean => {
    const schema = z.object({
        _id: z.string().refine((val) => /^[0-9a-fA-F]{24}$/.test(val), "El _id debe ser un ObjectId válido de MongoDB"),
        data: z.object({})
            .catchall(z.number().gt(0, "Debe ser un número mayor a 0").lte(1, "Debe ser un número menor o igual a 1"))
            .superRefine((obj, ctx) => {
                const invalidKeys = Object.keys(obj).filter(key => !key.startsWith('calidad.clasificacionCalidad.'));
                if (invalidKeys.length > 0) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: `Las siguientes llaves son inválidas: ${invalidKeys.join(", ")}`,
                        path: [],
                    });
                }

                const suma = Object.values(obj).reduce((acc, val) => acc + val, 0);
                if (Math.abs(suma - 1) > 0.001) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: `La suma de los valores es ${suma}, debe ser igual a 1.`,
                        path: [],
                    });
                }
            })
    })
    const result = schema.safeParse(data)
    if (!result.success) {
        const errorMap = getErrorMessages(result.error)
        throw new Error(JSON.stringify(errorMap))
    }
    return true
}