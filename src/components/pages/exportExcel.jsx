import * as XLSX from "xlsx"
import {saveAs} from "file-saver"

export function exportDeals(deals){

const worksheet = XLSX.utils.json_to_sheet(deals)
const workbook = {Sheets:{data:worksheet},SheetNames:["data"]}

const excelBuffer = XLSX.write(workbook,{
bookType:"xlsx",
type:"array"
})

const file = new Blob(
[excelBuffer],
{type:"application/octet-stream"}
)

saveAs(file,"CRM_Deals.xlsx")

}