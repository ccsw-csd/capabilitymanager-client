import { Capability } from "../../capabilities/model/Capability";
import { Staffing } from "../../staffing/model/staffing.model";

export interface Report {
    "id": number,
    "idVersionCapacidades": Capability,
    "idVersionStaffing": Staffing,
    "screenshot": number,
    "fechaImportacion": Date,
    "descripcion": string,
    "usuario": string,
    "fechaModificacion": Date,
    "comentarios": string
}