/* eslint-disable prettier/prettier */

import palletImg from '@renderer/assets/palletIMG.webp'
import { contenedoresType } from '@renderer/types/contenedoresType';
import { IoMdSettings } from "react-icons/io";
import { MdAddBox } from "react-icons/md";
import { FaDeleteLeft } from "react-icons/fa6";
import { FaClipboardCheck } from "react-icons/fa";
import { FaCircleInfo } from "react-icons/fa6";
import { useEffect, useState } from 'react';
import { FcOk } from "react-icons/fc";

type propsType = {
    contenedor: contenedoresType;
    pallet: number
    handlePalletSelect: (data: number) => void
};


export default function TarjetaPallet(props: propsType): JSX.Element {
    const [isFree, setIsFree] = useState<boolean>(false)
    useEffect(()=>{
        const condition = (
            props.contenedor.pallets[props.pallet].listaLiberarPallet.enzunchado &&
            props.contenedor.pallets[props.pallet].listaLiberarPallet.estadoCajas &&
            props.contenedor.pallets[props.pallet].listaLiberarPallet.estiba &&
            props.contenedor.pallets[props.pallet].listaLiberarPallet.paletizado &&
            props.contenedor.pallets[props.pallet].listaLiberarPallet.rotulado
        )
        setIsFree(condition)
    },[props.contenedor])

    const openPalletSettings = (): void => {
        const dialogSetting = document.getElementById("settingsPallet") as HTMLDialogElement;
        if (dialogSetting) {
            dialogSetting.showModal();
            props.handlePalletSelect(props.pallet)
        }
    }
    const openPalletInfo = (): void => {
        const dialogINfo = document.getElementById("infoPallet") as HTMLDialogElement;
        if (dialogINfo) {
            dialogINfo.showModal();
            props.handlePalletSelect(props.pallet)
        }
    }
    const openAddToPallet = (): void => {
        const dialogINfo = document.getElementById("addPallet") as HTMLDialogElement;
        if (dialogINfo) {
            dialogINfo.showModal();
            props.handlePalletSelect(props.pallet)
        }
    }
    const openDeleteItem = (): void => {
        const dialogINfo = document.getElementById("borrarItemPallet") as HTMLDialogElement;
        if (dialogINfo) {
            dialogINfo.showModal();
            props.handlePalletSelect(props.pallet)
        }
    }
    const openLiberarPallet = (): void => {
        const dialogINfo = document.getElementById("liberarPallet") as HTMLDialogElement;
        if (dialogINfo) {
            dialogINfo.showModal();
            props.handlePalletSelect(props.pallet)
        }
    }

    return (
        <div className='proceso-lista-empaque-tajeta-pallet'>
            {isFree && <div className='proceso-lista-empaque-tajeta-pallet-liberado'><FcOk /></div> }
            <div className='proceso-lista-empaque-tajeta-pallet-div1'>
                <img src={palletImg} alt="pallet-image" width={50} height={50} />
                <p>{
                    props.contenedor.pallets[props.pallet].EF1.reduce(
                        (acu, item) => acu += item.cajas ? item.cajas : 0, 0
                    )}</p>
            </div>
            <div>
                <p><span>Pallet:</span> {props.pallet + 1}</p>
                <p><span>Calidad:</span> {props.contenedor.pallets[props.pallet].settings.calidad}</p>
                <p><span>Calibre:</span> {props.contenedor.pallets[props.pallet].settings.calibre}</p>
            </div>
            <div className='proceso-lista-empaque-tajeta-pallet-div2'>
                <button onClick={openPalletInfo} title='Detalles del pallet'>
                    <FaCircleInfo color='black' />
                </button>
                <button onClick={openAddToPallet} title='Agregar cajas'>
                    <MdAddBox color='green' />
                </button>
                <button onClick={openDeleteItem} title='Eliminar items'>
                    <FaDeleteLeft color='red' />
                </button>
                <button onClick={openPalletSettings} title='Configurar pallet'>
                    <IoMdSettings color='blue' />
                </button>
                <button onClick={openLiberarPallet} title='Liberar pallet'>
                    <FaClipboardCheck color='orange' />
                </button>
            </div>



        </div>
    )
}
