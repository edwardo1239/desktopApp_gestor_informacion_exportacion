/* eslint-disable prettier/prettier */

type LimpiezaItem = {
    key: string;
    label: string;
};

type LimpiezaArea = LimpiezaItem[];

export type LimpiezaObjectType = {
    [key: string]: LimpiezaArea;
};

type itemType = {
    status:boolean
    observaciones:string
}

export type formType = {
    [key:string] : itemType
}
