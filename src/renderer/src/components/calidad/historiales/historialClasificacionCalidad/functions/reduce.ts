/* eslint-disable prettier/prettier */

export const objetoLimon = {
  oleocelosis: 'Oleocelosis',
  frutaVerde: 'Fruta Verde',
  herbicida: 'Daños Herbicida',
  frutaMadura: 'Fruta Sobre Madura',
  dannosMecanicos: 'Daños Mecanicos',
  escama: 'Escama y Piojo Blanco',
  acaro: 'Daños Acaro',
  grillo: 'Mgrillo',
  alsinoe: 'Elsinoe-Roña',
  melanosis: 'Melanosis',
  trips: 'Trips',
  division: 'Division Celular',
  piel: 'Piel Nodular',
  fumagina: 'Fumagina',
  wood: 'Wood Pocket',
  sombra: 'Sombra',
  mancha: 'Mancha Fantasma',
  deshidratada: 'Deshidratada',
  verdeManzana: 'Verde Manzana',
  otrasPlagas: 'Otras plagas'
};

export const objetoNaranja = {
  oleocelosis: 'Oleocelosis',
  frutaVerde: 'Fruta Verde',
  herbicida: 'Daños Herbicida',
  frutaMadura: 'Fruta Sobre Madura',
  dannosMecanicos: 'Daños Mecanicos',
  escama: 'Escama y Piojo Blanco',
  acaro: 'Daños Acaro',
  grillo: 'Mgrillo',
  alsinoe: 'Elsinoe-Roña',
  melanosis: 'Melanosis',
  trips: 'Trips',
  division: 'Division Celular',
  piel: 'Piel Nodular',
  fumagina: 'Fumagina',
  antracnosis: 'Antracnosis',
  frutaRajada: 'Fruta Rajada',
  ombligona: 'Ombligona',
  nutrientes: 'Nutrientes',
  despezonada: 'Despezonada',
  variegacion: 'Variegación',
  otrasPlagas: 'Otras plagas'
};


export const objetoLimonNaranja = {
  oleocelosis: 0,
  frutaVerde: 0,
  herbicida: 0,
  frutaMadura: 0,
  dannosMecanicos: 0,
  escama: 0,
  acaro: 0,
  grillo: 0,
  alsinoe: 0,
  melanosis: 0,
  trips: 0,
  division: 0,
  piel: 0,
  fumagina: 0,
  wood: 0,
  sombra: 0,
  mancha: 0,
  deshidratada: 0,
  verdeManzana: 0,
  otrasPlagas: 0,
  antracnosis: 0,
  frutaRajada: 0,
  ombligona: 0,
  nutrientes: 0,
  despezonada: 0,
  variegacion: 0
};


export const check_data_100 = (formState: {[key: string]: number}): boolean => {
  const sum = Object.values(formState).reduce((acu: number, item: number) => acu += item, 0)
  if(sum === 100) return true
  else return false
}
