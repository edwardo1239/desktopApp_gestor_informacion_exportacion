/* eslint-disable prettier/prettier */
const ExcelJS = require("exceljs");
const path = require("path");
const fs = require('fs');
const Docxtemplater = require('docxtemplater');
const PizZip = require('pizzip');
const { format, parseISO } = require("date-fns");
const { es } = require('date-fns/locale');
const { toZonedTime } = require('date-fns-tz');

const mode = import.meta.env.MODE

function numeroALetras(num) {
   const unidades = ['cero', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve'];
   const decenas = ['diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve'];
   const decenas2 = ['veinte', 'veintiuno', 'veintidós', 'veintitrés', 'veinticuatro', 'veinticinco', 'veintiséis', 'veintisiete', 'veintiocho', 'veintinueve'];
   const decenas3 = ['treinta', 'treinta y uno'];

   if (num < 10) return unidades[num];
   if (num < 20) return decenas[num - 10];
   if (num < 30) return decenas2[num - 20];
   if (num <= 31) return decenas3[num - 30];
   return 'Número fuera de rango';
}

const formatearFecha = (fechaString, hora = false) => {
   if (!fechaString) {
      return '';
   }

   const zonaHoraria = 'America/Bogota';

   // Analizar la fecha UTC
   const fechaUTC = parseISO(fechaString);

   // Convertir a la zona horaria de Bogotá
   const fechaBogota = toZonedTime(fechaUTC, zonaHoraria);

   // Formatear la fecha
   if (hora) {
      return format(fechaBogota, 'dd/MM/yyyy HH:mm:ss', { locale: es });
   }

   return format(fechaBogota, 'dd/MM/yyyy', { locale: es });
};
const label = {
   Limon: "TAHITI",
   Naranja: "ORANGE"
}
const styleNormalCell = {
   top: { style: 'medium' },
   left: { style: 'medium' },
   bottom: { style: 'medium' },
   right: { style: 'medium' }
};
const mostrarKilose = (item) => {
   const peso = Number(item.tipoCaja.split("-")[1]);

   if (peso >= 17.3) return "40LB";
   if (peso >= 12) return "37LB";
   if (peso > 4 && peso < 5) return ("4,5Kg");



}
const ICAalterno = (id, proveedores) => {
   console.log(id)
   const prov = proveedores.find(pro => pro._id === id)
   console.log(prov)

   if (!prov) return "Predio no encontrado"
   return prov.SISPAP ? prov.ICA.code : 'Sin SISPAP';


}
function aplicar_ggn_code(item, contenendor) {
   if (
      item.lote?.GGN &&
      item.lote.GGN.code &&
      item.lote.GGN.tipo_fruta.includes(item.tipoFruta)
   ) {
      if (typeof contenendor.infoContenedor.clienteInfo === 'object') {
         const cont = contenendor.infoContenedor.clienteInfo.PAIS_DESTINO;
         const lote = item.lote.GGN.paises
         if (lote.some(elemento => cont.includes(elemento))) {
            return item.lote.GGN.code
         }
      }
   }
   return ""
}
function aplicar_ggn_fecha(item, contenendor) {
   if (
      item.lote?.GGN &&
      item.lote.GGN.code &&
      item.lote.GGN.tipo_fruta.includes(item.tipoFruta)
   ) {
      if (typeof contenendor.infoContenedor.clienteInfo === 'object') {
         const cont = contenendor.infoContenedor.clienteInfo.PAIS_DESTINO;
         const lote = item.lote.GGN.paises
         if (lote.some(elemento => cont.includes(elemento))) {
            return item.lote.GGN.fechaVencimiento
         }
      }
   }
   return ""
}
function resumenCalidad(contenedor, calidad) {
   const out = {}
   let total = 0;

   contenedor.pallets.forEach((pallet) => {
      let palletFlag = false
      const calibre = new Set()
      pallet.EF1.forEach(item => {
         total += item.cajas
         if (item.calidad === calidad) {
            if (!Object.prototype.hasOwnProperty.call(out, item.calibre)) {
               out[item.calibre] = {
                  cantidad: 0,
                  pallets: 0,
               }
            }
            out[item.calibre].cantidad += item.cajas
            palletFlag = true
            calibre.add(item.calibre)
         }
      })
      if (palletFlag) {
         const arrCalibre = [...calibre]
         arrCalibre.forEach(cal => {
            out[cal].pallets += 1
         })
      }
   })

   Object.keys(out).forEach(item => {
      out[item].porcentage = (out[item].cantidad * 100) / total
   })
   return out
}

async function crearDocumento(data) {
   const table = await JSON.parse(data.data.data)
   const workbook = new ExcelJS.Workbook();
   let worksheet = workbook.addWorksheet("Table")

   const headers = Object.keys(table[0]);

   worksheet.insertRow(1, headers);

   table.forEach(row => {
      worksheet.addRow(Object.values(row));
   });

   await workbook.xlsx.writeFile(data.data.path);

}


//#region reporte_predios_lista_empaque
async function crear_reporte_predios(data, pathDocument) {
   const cont = data.contenedor
   const tabla = data.tabla
   const predios = tabla[0]
   const totalCajas = tabla[1]
   const totalKilos = tabla[2]

   const workbook = new ExcelJS.Workbook();
   const worksheet = workbook.addWorksheet("Reporte Predios")

   const styleNormalCell = {
      top: { style: 'medium' },
      left: { style: 'medium' },
      bottom: { style: 'medium' },
      right: { style: 'medium' }
   };


   //? logo
   const logo = worksheet.getCell('A1')
   logo.border = styleNormalCell
   logo.alignment = { horizontal: 'center', vertical: 'middle' }

   worksheet.getColumn(1).width = 20
   worksheet.getRow(1).height = 80

   const imagePath = path.resolve(
      __dirname,
      '..',
      'renderer',
      'assets',
      'CELIFRUT-d862746b.png'
   )
   const imageId = workbook.addImage({
      filename: imagePath,
      extension: 'png'
   })

   worksheet.addImage(imageId, {
      tl: { col: 0, row: 0 },
      ext: { width: 100, height: 100 }
   })




   //? titulo
   worksheet.getColumn(2).width = 20
   worksheet.getColumn(4).width = 20
   worksheet.getColumn(5).width = 30

   const titulo = worksheet.getCell('B1')
   titulo.value = "Reporte Predio ICA"
   worksheet.mergeCells('B1:D1');
   titulo.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true }
   titulo.font = { size: 24, bold: true }
   titulo.border = styleNormalCell

   //?codigo version
   const version = worksheet.getCell('E1')
   version.value = `Codigo: PC-CAL-FOR-04
Versión: 03 
Fecha: 17 Oct 2020`
   version.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true }
   version.font = { size: 12 }
   version.border = styleNormalCell

   //?cliente info
   const clienteLabel = worksheet.getCell('A2');
   clienteLabel.value = "CLIENTE:"
   clienteLabel.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true }
   clienteLabel.font = { size: 18, bold: true }
   clienteLabel.border = styleNormalCell

   const nombrCliente = worksheet.getCell('B2')
   worksheet.mergeCells('B2:E2');
   nombrCliente.value = cont.infoContenedor.clienteInfo.CLIENTE
   nombrCliente.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true }
   nombrCliente.font = { size: 18, bold: true }
   nombrCliente.border = styleNormalCell

   const fechaLabel = worksheet.getCell('A3')
   fechaLabel.value = "FECHA:"
   fechaLabel.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true }
   fechaLabel.font = { size: 18, bold: true }
   fechaLabel.border = styleNormalCell

   const fechaCont = worksheet.getCell('B3')
   worksheet.mergeCells('B3:E3');
   fechaCont.value = new Date(cont.infoContenedor.fechaFinalizado).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
   })
   fechaCont.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true }
   fechaCont.font = { size: 18, bold: true }
   fechaCont.border = styleNormalCell

   //? los headers de la tabla
   worksheet.insertRow(4, ['Predio', 'Codigo ICA', 'N° Cajas', 'Peso Neto', 'Peso Bruto'])
   for (let i = 1; i <= 5; i++) {
      const cell = worksheet.getCell(4, i);
      cell.font = { bold: true, size: 12 };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.fill = {
         type: 'pattern',
         pattern: 'solid',
         fgColor: { argb: 'FF5FD991' }
      }
      cell.border = styleNormalCell
   }

   //? los datos de los predios
   Object.values(predios).forEach((value, index) => {
      worksheet.insertRow(5 + index, [
         value.predio,
         value.SISPAP ? value.ICA : 'Sin SISPAP',
         value.cajas,
         value.peso,
         value.peso + (0.85 * value.cajas)
      ])

      for (let i = 1; i <= 5; i++) {
         const cell = worksheet.getCell(5 + index, i);
         cell.font = { size: 12 };
         cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
         cell.border = styleNormalCell
      }
   })

   //? total 
   let ultimaFila = Object.keys(predios).length;
   const totalLabel = worksheet.getCell(ultimaFila + 5, 1);
   worksheet.mergeCells(`A${ultimaFila + 5}:B${ultimaFila + 5}`);
   totalLabel.value = "TOTAL:"
   totalLabel.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true }
   totalLabel.font = { size: 14, bold: true }
   totalLabel.border = styleNormalCell
   totalLabel.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF5FD991' }
   }

   const totalCajascell = worksheet.getCell(ultimaFila + 5, 3);
   totalCajascell.value = totalCajas
   totalCajascell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true }
   totalCajascell.font = { size: 14, bold: true }
   totalCajascell.border = styleNormalCell
   totalCajascell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF5FD991' }
   }

   const totalKilosCell = worksheet.getCell(ultimaFila + 5, 4);
   totalKilosCell.value = totalKilos
   totalKilosCell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true }
   totalKilosCell.font = { size: 14, bold: true }
   totalKilosCell.border = styleNormalCell
   totalKilosCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF5FD991' }
   }

   const totalKilosNetos = worksheet.getCell(ultimaFila + 5, 5);
   totalKilosNetos.value = totalKilos + (totalCajas * 0.85)
   totalKilosNetos.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true }
   totalKilosNetos.font = { size: 14, bold: true }
   totalKilosNetos.border = styleNormalCell
   totalKilosNetos.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF5FD991' }
   }




   await workbook.xlsx.writeFile(pathDocument);

}

const setCellProperties = (cell, value, font = 14, bold = false) => {
   cell.value = value
   cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true }
   cell.font = { size: font, bold: bold }
   cell.border = styleNormalCell

};

const setCellPropertiesDatalogger = (cell, value, font = 14, bold = false) => {
   cell.value = value
   cell.alignment = { horizontal: 'start', vertical: 'middle', wrapText: true }
   cell.font = { size: font, bold: bold }
   cell.border = styleNormalCell

};
async function crear_lista_empaque(data, pathDocument) {
   const cont = data.contenedor
   const proveedores = data.proveedores
   const fuente = 16
   const alto_celda = 50

   let coc_flag = false;
   let row1Cells;
   let row2cells;
   let row3Cells;

   if (cont.infoContenedor.clienteInfo._id === "659dbd9a347a42d89929340e") {
      row1Cells = [
         { cell: 'C1', value: "PACKING LIST REPORT", font: 24, bold: true },
         { cell: 'K1', value: "Codigo: PC-CAL-FOR-05", font: fuente, bold: true },
      ]

      row2cells = [
         { cell: 'A2', value: "CLIENTE", font: fuente, bold: true },
         { cell: 'B2', value: cont.infoContenedor.clienteInfo.CLIENTE, font: fuente, bold: false },
         { cell: 'D2', value: "TEMP. SET POINT:", font: fuente, bold: true },
         { cell: 'E2', value: "44,6F", font: fuente, bold: false },
         { cell: 'F2', value: "FREIGHT:", font: fuente, bold: true },
         { cell: 'G2', value: "", font: fuente, bold: false },
         { cell: 'H2', value: "CONTAINER NUMBER:", font: fuente, bold: true },
         { cell: 'I2', value: cont.numeroContenedor, font: fuente, bold: false },
         { cell: 'J2', value: "REFERENCE N°:", font: fuente, bold: true },
         { cell: 'K2', value: cont.infoContenedor.tipoFruta, font: fuente, bold: false },
      ]

      row3Cells = [
         { cell: 'A3', value: "TEMP RECORDER LOCATION:", font: fuente, bold: true },
         { cell: 'C3', value: "PALLET 10", font: fuente, bold: false },
         { cell: 'D3', value: "TEMP RECORDER ID: ", font: fuente, bold: true },
         { cell: 'F3', value: "SS-0085719", font: fuente, bold: false },
         { cell: 'G3', value: "DATE: ", font: fuente, bold: true },
         {
            cell: 'H3', value: new Date(cont.infoContenedor.fechaFinalizado).toLocaleDateString('es-ES', {
               day: '2-digit',
               month: '2-digit',
               year: 'numeric'
            }), font: fuente, bold: false
         },
         { cell: 'J3', value: "CoC: ", font: fuente, bold: true },
         { cell: 'K3', value: "N/A", font: fuente, bold: false },
      ]
   } else {
      row1Cells = [
         { cell: 'C1', value: "PACKING LIST REPORT", font: 24, bold: true },
         { cell: 'J1', value: "Codigo: PC-CAL-FOR-05", font: fuente, bold: true },
      ]

      row2cells = [
         { cell: 'A2', value: "CLIENTE", font: fuente, bold: true },
         { cell: 'B2', value: cont.infoContenedor.clienteInfo.CLIENTE, font: fuente, bold: false },
         { cell: 'D2', value: "TEMP. SET POINT:", font: fuente, bold: true },
         { cell: 'E2', value: "44,6F", font: fuente, bold: false },
         { cell: 'F2', value: "FREIGHT:", font: fuente, bold: true },
         { cell: 'G2', value: "CONTAINER NUMBER:", font: fuente, bold: true },
         { cell: 'H2', value: cont.numeroContenedor, font: fuente, bold: false },
         { cell: 'I2', value: "REFERENCE N°:", font: fuente, bold: true },
         { cell: 'J2', value: cont.infoContenedor.tipoFruta, font: fuente, bold: false },
      ]

      row3Cells = [
         { cell: 'A3', value: "TEMP RECORDER LOCATION:", font: fuente, bold: true },
         { cell: 'C3', value: "PALLET 10", font: fuente, bold: false },
         { cell: 'D3', value: "TEMP RECORDER ID: ", font: fuente, bold: true },
         { cell: 'F3', value: "SS-0085719", font: fuente, bold: false },
         { cell: 'G3', value: "DATE: ", font: fuente, bold: true },
         {
            cell: 'H3', value: new Date(cont.infoContenedor.fechaFinalizado).toLocaleDateString('es-ES', {
               day: '2-digit',
               month: '2-digit',
               year: 'numeric'
            }), font: fuente, bold: false
         },
         { cell: 'I3', value: "CoC: ", font: fuente, bold: true },
         { cell: 'J3', value: "N/A", font: fuente, bold: false },
      ]
   }



   const workbook = new ExcelJS.Workbook();
   const worksheet = workbook.addWorksheet("Lista empaque")



   worksheet.getRow(1).height = 80
   for (let i = 1; i <= 12; i++) {
      worksheet.getColumn(i).width = 20.33
      worksheet.getColumn(i).height = alto_celda
   }

   worksheet.getRow(2).height = alto_celda
   worksheet.getRow(3).height = alto_celda



   //? logo
   const logo = worksheet.getCell('A1')

   logo.border = styleNormalCell
   logo.alignment = { horizontal: 'center', vertical: 'middle' }


   const imagePath = path.resolve(
      __dirname,
      '..',
      'renderer',
      'assets',
      'CELIFRUT-d862746b.png'
   )
   const imageId = workbook.addImage({
      filename: imagePath,
      extension: 'png'
   })


   worksheet.addImage(imageId, {
      tl: { col: 0, row: 0 },
      ext: { width: 100, height: 100 }
   });

   const cellImage = worksheet.getCell("A1")
   cellImage.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true }


   //? titulo
   row1Cells.forEach(item => {
      const cell = worksheet.getCell(item.cell)
      setCellProperties(cell, item.value, item.font, item.bold)
   })
   row2cells.forEach(item => {
      const cell = worksheet.getCell(item.cell)
      setCellProperties(cell, item.value, item.font, item.bold)
   })
   row3Cells.forEach(item => {
      const cell = worksheet.getCell(item.cell)
      setCellProperties(cell, item.value, item.font, item.bold)
   })

   if (cont.infoContenedor.clienteInfo._id === "659dbd9a347a42d89929340e") {

      worksheet.mergeCells(`A1:B1`);
      worksheet.mergeCells(`C1:J1`);
      worksheet.mergeCells('B2:C2');
      worksheet.mergeCells('A3:B3');
      worksheet.mergeCells('D3:E3');
      worksheet.mergeCells('H3:I3');
   } else {
      worksheet.mergeCells(`A1:B1`);
      worksheet.mergeCells(`C1:I1`);
      worksheet.mergeCells('B2:C2');
      worksheet.mergeCells('A3:B3');
      worksheet.mergeCells('D3:E3');
   }

   //? los headers de la tabla
   const headers = cont.infoContenedor.clienteInfo._id === "659dbd9a347a42d89929340e" ? [
      "PALLET ID",
      "PACKING DATE",
      "VARIETY",
      "PRODUCT",
      "WEIGHT",
      "CATEGORY",
      "SIZE",
      "QTY",
      "FARM CODE",
      "N° GG",
      "EXPIRATION DATE"
   ] : [
      "PALLET ID",
      "PACKING DATE",
      "VARIETY",
      "WEIGHT",
      "CATEGORY",
      "SIZE",
      "QTY",
      "FARM CODE",
      "N° GG",
      "EXPIRATION DATE"
   ]
   const headerRow = worksheet.insertRow(4, headers)
   headerRow.height = alto_celda

   const len = cont.infoContenedor.clienteInfo._id === "659dbd9a347a42d89929340e" ? 11 : 10;
   for (let i = 1; i <= len; i++) {
      const cell = worksheet.getCell(4, i);
      cell.font = { bold: true, size: 15 };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.fill = {
         type: 'pattern',
         pattern: 'solid',
         fgColor: { argb: 'FF5FD991' }
      }
      cell.border = styleNormalCell
   }
   let totalCajas = 0
   let row = 5
   cont.pallets.forEach((_, index) => {
      cont.pallets[index].EF1.forEach((item) => {
         if (cont.infoContenedor.clienteInfo._id === "659dbd9a347a42d89929340e") {
            const newRow = worksheet.insertRow(row, [
               String(index + 1) + String(cont.numeroContenedor),
               formatearFecha(item.fecha, true),
               label[item.tipoFruta],
               "COL-" + mostrarKilose(item) + (item.tipoFruta === 'Limon' ? 'Limes' : 'Oranges') + item.calibre + "ct",
               mostrarKilose(item),
               item.calidad,
               item.calibre,
               item.cajas,
               ICAalterno(item.lote.predioID, proveedores),
               aplicar_ggn_code(item, cont) !== "" ? aplicar_ggn_code(item, cont) : "N/A",
               aplicar_ggn_fecha(item, cont) !== "" ?
                  formatearFecha(aplicar_ggn_fecha(item, cont)) : "N/A"
            ])

            newRow.height = alto_celda;
            newRow.width = 20;
         } else {
            const newRow = worksheet.insertRow(row, [
               String(index + 1) + String(cont.numeroContenedor),
               formatearFecha(item.fecha, true),
               label[item.tipoFruta],
               mostrarKilose(item),
               item.calidad,
               item.calibre,
               item.cajas,
               ICAalterno(item.lote.predioID, proveedores),
               aplicar_ggn_code(item, cont) !== "" ? aplicar_ggn_code(item, cont) : "N/A",
               aplicar_ggn_fecha(item, cont) !== "" ?
                  formatearFecha(aplicar_ggn_fecha(item, cont)) : "N/A"
            ])

            newRow.height = alto_celda;
            newRow.width = 20.33;
         }

         if (!coc_flag && aplicar_ggn_code(item, cont) !== "") {
            coc_flag = true
         }
         totalCajas += item.cajas;
         for (let i = 1; i <= len; i++) {
            const cell = worksheet.getCell(row, i);
            cell.font = { size: fuente };
            cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
            cell.border = styleNormalCell
         }
         row++;
      })
   })

   const totalLabel = worksheet.getCell(row, 1)
   totalLabel.value = "TOTAL"
   worksheet.getRow(row).height = alto_celda

   if (cont.infoContenedor.clienteInfo._id === "659dbd9a347a42d89929340e") {
      worksheet.mergeCells(`A${row}:F${row}`);
      worksheet.mergeCells(`G${row}:K${row}`);

   } else {
      worksheet.mergeCells(`A${row}:E${row}`);
      worksheet.mergeCells(`F${row}:J${row}`);

   }
   totalLabel.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true }
   totalLabel.font = { size: 12 }
   totalLabel.border = styleNormalCell
   totalLabel.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF5FD991' }
   }

   const total = worksheet.getCell(row, 7)
   total.value = totalCajas
   total.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true }
   total.font = { size: 12 }
   total.border = styleNormalCell
   total.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF5FD991' }
   }
   //?las tablas de resumen por calidad

   row += 2;
   worksheet.getRow(row).height = alto_celda

   cont.infoContenedor.calidad.forEach(calidad => {
      //head
      worksheet.insertRow(row, [
         "SUMMARY CATEGORY",
         calidad,
      ])
      for (let i = 1; i <= 4; i++) {
         const cell = worksheet.getCell(row, i);
         cell.font = { bold: true, size: fuente };
         cell.alignment = { horizontal: 'center', vertical: 'middle' };
         cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF5FD991' }
         }
         cell.border = styleNormalCell
      }

      row++;
      worksheet.getRow(row).height = alto_celda

      //columnas
      worksheet.insertRow(row, [
         "SIZE",
         "QTY",
         "N.PALLETS",
         "% PERCENTAGE",
      ])
      for (let i = 1; i <= 4; i++) {
         const cell = worksheet.getCell(row, i);
         cell.font = { bold: true, size: fuente };
         cell.alignment = { horizontal: 'center', vertical: 'middle' };
         cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF5FD991' }
         }
         cell.border = styleNormalCell
      }
      row++;
      worksheet.getRow(row).height = alto_celda

      const resumen = resumenCalidad(cont, calidad)
      //datos
      Object.entries(resumen).forEach(([key, value]) => {
         worksheet.insertRow(row, [
            key,
            value.cantidad,
            value.pallets,
            value.porcentage.toFixed(2) + "%",
         ])
         for (let i = 1; i <= 4; i++) {
            const cell = worksheet.getCell(row, i);
            cell.font = { size: 12 };
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
            cell.border = styleNormalCell
         }

         row++;
         worksheet.getRow(row).height = alto_celda

      })

      worksheet.insertRow(row, [
         "TOTAL",
         Object.keys(resumen).reduce((acu, item) => acu += resumen[item].cantidad, 0),
         Object.keys(resumen).reduce((acu, item) => acu += resumen[item].pallets, 0),
         resumen && Object.keys(resumen).reduce((acu, item) => acu += resumen[item].porcentage, 0).toFixed(2) + "%",
      ])
      for (let i = 1; i <= 4; i++) {
         const cell = worksheet.getCell(row, i);
         cell.font = { bold: true, size: 12 };
         cell.alignment = { horizontal: 'center', vertical: 'middle' };
         cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF5FD991' }
         }
         cell.border = styleNormalCell
      }


      row += 2;
      worksheet.getRow(row).height = alto_celda

      if (coc_flag) {
         if (cont.infoContenedor.clienteInfo._id === "659dbd9a347a42d89929340e") {
            const cell = worksheet.getCell("K3")
            cell.value = "4063061801296"
            cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true }
            cell.font = { size: fuente, bold: false }
            cell.border = styleNormalCell
         } else {
            const cell = worksheet.getCell("J3")
            cell.value = "4063061801296"
            cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true }
            cell.font = { size: fuente, bold: false }
            cell.border = styleNormalCell
         }

      }



   })

   await workbook.xlsx.writeFile(pathDocument);

}

//#region documentos mulas

async function crear_reporte_vehiculo(data, path) {
   const cont = data.contenedor
   const { infoTractoMula, infoExportacion, infoContenedor } = cont
   const workbook = new ExcelJS.Workbook();
   const worksheet = workbook.addWorksheet("Hoja 1")

   worksheet.getColumn(2).width = 40
   worksheet.getColumn(3).width = 60
   //Titulo
   const cell = worksheet.getCell("B2")
   setCellProperties(
      cell,
      "REPORTE DE VEHICULOS",
      24, true)
   worksheet.mergeCells(`B2:C2`);

   //cuerpo
   const body = [
      { cell: 'B3', value: "Fecha despacho", font: 12, bold: false },
      { cell: 'C3', value: new Date().toLocaleDateString(), font: 12, bold: false },
      { cell: 'B4', value: "Transportadora", font: 12, bold: false },
      { cell: 'C4', value: infoTractoMula.transportadora, font: 12, bold: false },
      { cell: 'B5', value: "Placa Vehiculo", font: 12, bold: false },
      { cell: 'C5', value: infoTractoMula.placa, font: 12, bold: false },
      { cell: 'B6', value: "Placa del Trailer", font: 12, bold: false },
      { cell: 'C6', value: infoTractoMula.trailer, font: 12, bold: false },
      { cell: 'B7', value: "Exportador", font: 12, bold: false },
      { cell: 'C7', value: "CELIFRUT SAS", font: 12, bold: false },
      { cell: 'B8', value: "Ruta", font: 12, bold: false },
      { cell: 'C8', value: `ARMENIA-${infoExportacion.puerto}`, font: 12, bold: false },
      { cell: 'B9', value: "Conductor", font: 12, bold: false },
      { cell: 'C9', value: infoTractoMula.conductor, font: 12, bold: false },
      { cell: 'B10', value: "No. Cédula", font: 12, bold: false },
      { cell: 'C10', value: infoTractoMula.cedula, font: 12, bold: false },
      { cell: 'B11', value: "No. Celular", font: 12, bold: false },
      { cell: 'C11', value: infoTractoMula.celular, font: 12, bold: false },
      { cell: 'B12', value: "Lugar Cargue", font: 12, bold: false },
      { cell: 'C12', value: "ARMENIA", font: 12, bold: false },
      { cell: 'B13', value: "Lugar Descargue", font: 12, bold: false },
      { cell: 'C13', value: infoExportacion.puerto, font: 12, bold: false },
      { cell: 'B14', value: "Mercancía", font: 12, bold: false },
      { cell: 'C14', value: infoContenedor.tipoFruta, font: 12, bold: false },
      { cell: 'B15', value: "Temperatura", font: 12, bold: false },
      { cell: 'C15', value: infoTractoMula.temperatura, font: 12, bold: false },
   ]

   body.forEach(item => {
      const cell = worksheet.getCell(item.cell)
      setCellProperties(cell, item.value, item.font, item.bold)
   })

   await workbook.xlsx.writeFile(path);

}

function cajas_kilos_total(pallets) {
   const nPallets = pallets.length
   let total = 0
   let total_kilos = 0

   for (let pallet = 0; pallet <= nPallets; pallet++) {
      if (!pallets[pallet]) continue

      const ef1 = pallets[pallet].EF1
      const nItems = ef1.length

      for (let item = 0; item <= nItems; item++) {
         if (!ef1[item]) continue

         if (ef1[item].cajas && ef1[item].tipoCaja.split('-')[1].replace(",", ".")) {
            const mult = ef1[item].tipoCaja.split('-')[1].replace(",", ".")
            total_kilos += mult * ef1[item].cajas
            total += ef1[item].cajas
         } else {
            total_kilos += 0
            total += 0
         }
      }
   }

   return [total, total_kilos]
}

async function crear_reporte_datalogger(data, pathDocument) {
   console.log("crear_reporte_datalogger")
   const cont = data.contenedor
   const { infoTractoMula, infoContenedor, pallets } = cont
   const workbook = new ExcelJS.Workbook();
   const worksheet = workbook.addWorksheet("Hoja 1")
   const [, total_kilos] = cajas_kilos_total(pallets)
   worksheet.getColumn(2).width = 30
   worksheet.getColumn(3).width = 25
   worksheet.getColumn(4).width = 25
   worksheet.getColumn(5).width = 40
   //Titulo

   const imagePath = path.resolve(
      __dirname,
      '..',
      'renderer',
      'assets',
      'CELIFRUT-d862746b.png'
   )

   const imageId = workbook.addImage({
      filename: imagePath,
      extension: 'png'
   })

   worksheet.addImage(imageId, {
      tl: { col: 3, row: 1 },
      ext: { width: 120, height: 120 }
   })

   const cellLogo = worksheet.getCell("D2")
   cellLogo.border = styleNormalCell

   const cellVacio = worksheet.getCell("E6")
   cellVacio.border = styleNormalCell

   const cell = worksheet.getCell("B2")
   setCellProperties(
      cell,
      "DATA LOGGER",
      24, true)
   worksheet.mergeCells(`B2:C2`);
   worksheet.mergeCells(`D2:E5`);
   worksheet.mergeCells(`B22:D24`);


   //cuerpo
   const body = [
      { cell: 'B3', value: "MARCA", font: 12, bold: true },
      { cell: 'C3', value: infoTractoMula.marca.toUpperCase(), font: 12, bold: false },
      { cell: 'B4', value: "CODIGO DE PRODUCTO", font: 12, bold: true },
      { cell: 'C4', value: "U-2", font: 12, bold: false },
      { cell: 'B5', value: "DATALOGGER ID", font: 12, bold: true },
      { cell: 'C5', value: infoTractoMula.datalogger_id.toUpperCase(), font: 12, bold: false },
      { cell: 'B6', value: "UBICACIÓN  DATA LOGGER:", font: 12, bold: true },
      { cell: 'C6', value: "PALLET No 10", font: 12, bold: false },
      { cell: 'B7', value: "TEMPERATURA:", font: 12, bold: true },
      { cell: 'C7', value: infoTractoMula.temperatura, font: 12, bold: false },
      { cell: 'D7', value: "DESPACHADO POR:", font: 12, bold: true },
      { cell: 'E7', value: "", font: 12, bold: true },
      { cell: 'B8', value: "PRODUCTO:", font: 12, bold: true },
      { cell: 'C8', value: infoContenedor.tipoFruta.toUpperCase(), font: 12, bold: false },
      { cell: 'D8', value: "NOMBRE:", font: 12, bold: true },
      { cell: 'E8', value: "", font: 12, bold: false },
      { cell: 'B9', value: "CANTIDAD:", font: 12, bold: true },
      { cell: 'C9', value: `${pallets.length} PALETS - ${total_kilos}KG APROX`, font: 12, bold: false },
      { cell: 'D9', value: "FIRMA", font: 12, bold: false },
      { cell: 'E9', value: "", font: 12, bold: false },
      { cell: 'B10', value: "EMPAQUE", font: 12, bold: true },
      { cell: 'C10', value: "CAJAS", font: 12, bold: false },
      { cell: 'D10', value: "FECHA DE CARGUE:", font: 12, bold: false },
      { cell: 'E10', value: "", font: 12, bold: false },
      { cell: 'B11', value: "NÚMERO PRECINTO:", font: 12, bold: true },
      { cell: 'C11', value: infoTractoMula.precinto, font: 12, bold: false },
      { cell: 'D11', value: "HORA INICIO:", font: 12, bold: false },
      { cell: 'E11', value: "", font: 12, bold: false },
      { cell: 'B12', value: "FECHA SALIDA:", font: 12, bold: true },
      { cell: 'C12', value: new Date().toLocaleDateString(), font: 12, bold: false },
      { cell: 'D12', value: "HORA FINAL:", font: 12, bold: false },
      { cell: 'E12', value: "", font: 12, bold: false },
      { cell: 'B13', value: "EMPRESA TRANSPORTADORA: ", font: 12, bold: true },
      { cell: 'C13', value: infoTractoMula.transportadora, font: 12, bold: false },
      { cell: 'D13', value: "HORA DESPACHO:", font: 12, bold: false },
      { cell: 'E13', value: "", font: 12, bold: false },
      { cell: 'B14', value: "PLACA:", font: 12, bold: true },
      { cell: 'C14', value: infoTractoMula.placa, font: 12, bold: false },
      { cell: 'D14', value: "REVISADO POR:", font: 12, bold: false },
      { cell: 'E14', value: "", font: 12, bold: false },
      { cell: 'B15', value: "PLACA TRAILER", font: 12, bold: true },
      { cell: 'C15', value: infoTractoMula.trailer, font: 12, bold: false },
      { cell: 'D15', value: "NOMBRE:", font: 12, bold: false },
      { cell: 'E15', value: "", font: 12, bold: false },
      { cell: 'B16', value: "NOMBRE CONDUCTOR:", font: 12, bold: true },
      { cell: 'C16', value: infoTractoMula.conductor, font: 12, bold: false },
      { cell: 'D16', value: "FIRMA:", font: 12, bold: true },
      { cell: 'E16', value: "", font: 12, bold: false },
      { cell: 'B17', value: "CEDULA:", font: 12, bold: true },
      { cell: 'C17', value: infoTractoMula.cedula, font: 12, bold: false },
      { cell: 'D17', value: "", font: 12, bold: true },
      { cell: 'E17', value: "", font: 12, bold: false },
      { cell: 'B18', value: "TELEFONO:", font: 12, bold: true },
      { cell: 'C18', value: infoTractoMula.celular, font: 12, bold: false },
      { cell: 'D18', value: "", font: 12, bold: true },
      { cell: 'E18', value: "", font: 12, bold: false },
      { cell: 'B21', value: "ENTREGADO A:", font: 12, bold: false },
      { cell: 'B25', value: infoTractoMula.conductor, font: 12, bold: false },
      { cell: 'B26', value: infoTractoMula.cedula, font: 12, bold: false },
      { cell: 'B27', value: infoTractoMula.celular, font: 12, bold: false },
   ]

   body.forEach(item => {
      const cell = worksheet.getCell(item.cell)
      setCellPropertiesDatalogger(cell, item.value, item.font, item.bold)
   })

   await workbook.xlsx.writeFile(pathDocument);
}

async function crear_carta_instrucciones(data, pathDocument) {
   const pathRelative = mode === 'development' ? './resources/app.asar.unpacked/Entrega_Instrucciones.docx'
      : path.resolve(
         __dirname,
         '..',
         '..',
         'Entrega_Instrucciones.docx'
      );
   const cont = data.contenedor;
   const { infoTractoMula, infoContenedor, pallets, infoExportacion } = cont;
   const [total_cajas, total_kilos] = cajas_kilos_total(pallets);
   const peso_bruto = (total_cajas * 0.85) + total_kilos;


   // Leer el contenido del archivo de template
   const content = fs.readFileSync(pathRelative, 'binary');
   const zip = new PizZip(content);

   // Crear el documento con docxtemplater
   const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
   });

   const date = new Date()

   // console.log(date.getDate())
   // Renderizar el documento directamente con los datos
   doc.render({
      precinto: infoTractoMula.precinto,
      tipo_fruta: infoContenedor.tipoFruta.toUpperCase(),
      transportadora: infoTractoMula.transportadora,
      placa: infoTractoMula.placa,
      trailer: infoTractoMula.trailer,
      agencia: infoExportacion.agencia,
      total_cajas: total_kilos.toFixed(2),
      total_cajas_net: peso_bruto.toFixed(2),
      temperatura: infoTractoMula.temperatura,
      nit: infoTractoMula.nit,
      fecha_dia_escrito: numeroALetras(date.getDate()),
      fecha_dia: date.getDate(),
      fecha_mes: date.toLocaleDateString('es-ES', { month: 'long' }),
   });

   // Obtener el buffer del documento
   const buffer = doc.getZip().generate({
      type: 'nodebuffer',
      compression: 'DEFLATE'
   });

   // Guardar el documento
   fs.writeFileSync(pathDocument, buffer);
}

async function crear_carta_responsabilidad(data, pathDocument) {

   const pathRelative = mode === 'development' ? './resources/app.asar.unpacked/carta_responsabilidad.docx'
      : path.resolve(
         __dirname,
         '..',
         '..',
         'carta_responsabilidad.docx'
      );
   const cont = data.contenedor;
   const { infoTractoMula, infoContenedor, numeroContenedor, pallets, infoExportacion } = cont;
   const [, total_kilos] = cajas_kilos_total(pallets);


   // Leer el contenido del archivo de template
   const content = fs.readFileSync(pathRelative, 'binary');
   const zip = new PizZip(content);

   // Crear el documento con docxtemplater
   const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
   });

   let opciones = { day: '2-digit', month: '2-digit', year: 'numeric' };
   // Renderizar el documento directamente con los datos
   doc.render({
      fecha: new Date().toLocaleDateString('es-ES', opciones),
      numeroContenedor: numeroContenedor,
      agencia: infoExportacion.agencia,
      naviera: infoExportacion.naviera,
      puerto: infoExportacion.puerto.toUpperCase(),
      expt: infoExportacion.expt.toUpperCase(),
      cliente: infoContenedor.clienteInfo.CLIENTE,
      direccion: infoContenedor.clienteInfo["DIRECCIÓN"] ?? 'N/A',

      placa: infoTractoMula.placa,
      tipoFruta: infoContenedor.tipoFruta.toUpperCase(),
      transportadora: infoTractoMula.transportadora,
      precinto: infoTractoMula.precinto,
      trailer: infoTractoMula.trailer,
      conductor: infoTractoMula.conductor,
      cedula: infoTractoMula.cedula,
      celular: infoTractoMula.celular,

      kilos: total_kilos.toFixed(2),
   });

   // Obtener el buffer del documento
   const buffer = doc.getZip().generate({
      type: 'nodebuffer',
      compression: 'DEFLATE'
   });

   // Guardar el documento
   fs.writeFileSync(pathDocument, buffer);
}

async function crear_check_list_transporte(data, pathDocument) {


   const pathRelative = mode === 'development' ? './resources/app.asar.unpacked/Check_list_tractomula.xlsx'
      : path.resolve(
         __dirname,
         '..',
         '..',
         'Check_list_tractomula.xlsx'
      );
   const cont = data.contenedor;
   const { infoTractoMula, infoExportacion, numeroContenedor } = cont;


   const workbook = new ExcelJS.Workbook();

   // Leer el archivo de template
   await workbook.xlsx.readFile(pathRelative);
   const worksheet = workbook.getWorksheet('Hoja1');

   worksheet.getCell('A8').value = new Date().toDateString();
   worksheet.getCell('C8').value = infoTractoMula.transportadora;
   worksheet.getCell('D8').value = infoTractoMula.conductor;
   worksheet.getCell('G8').value = infoTractoMula.cedula;
   worksheet.getCell('I8').value = infoTractoMula.placa;
   worksheet.getCell('J8').value = infoTractoMula.celular;
   worksheet.getCell('K8').value = infoExportacion.puerto;
   worksheet.getCell('U8').value = infoTractoMula.datalogger_id;
   worksheet.getCell('V8').value = infoTractoMula.precinto;
   worksheet.getCell('W8').value = numeroContenedor;

   await workbook.xlsx.writeFile(pathDocument);
}


//!el entry
process.parentPort.on('message', async (data) => {

   const datos = await JSON.parse(data.data)
   // console.log(datos.action)
   try {
      if (datos.action === 'crear_resporte_predios_lista_empaque') {
         await crear_reporte_predios(datos.data, datos.path);
      } else if (datos.action === 'crear_lista_empaque') {
         await crear_lista_empaque(datos.data, datos.path)
      } else if (datos.action === "crear_documentos_programacon_mula_reporte_vehiculo") {
         await crear_reporte_vehiculo(datos.data, datos.path)
      } else if (datos.action === "crear_documentos_programacon_mula_reporte_data_logger") {
         await crear_reporte_datalogger(datos.data, datos.path)
      } else if (datos.action === "crear_documentos_programacon_mula_reporte_instrucciones_manejo") {
         await crear_carta_instrucciones(datos.data, datos.path)
      } else if (datos.action === "crear_documentos_programacon_mula_carta_responsabilidad") {
         await crear_carta_responsabilidad(datos.data, datos.path)
      } else if (datos.action === "crear_check_list_transporte") {
         await crear_check_list_transporte(datos.data, datos.path)
      } else {
         await crearDocumento(data)
      }
   } catch (error) {
      console.log(error)
   }

})

