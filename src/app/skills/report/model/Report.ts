import { Capability } from "../../capabilities/model/Capability";
import { Staffing } from "../../staffing/model/staffing.model";
import { Certifications } from '../../certifications/Model/certifications.model';

export interface Report {
    "id": number,
    "idVersionCapacidades": Capability,
    "idVersionStaffing": Staffing,
    "idVersionCertificaciones": Certifications,
    "screenshot": number,
    "fechaImportacion": Date,
    "descripcion": string,
    "usuario": string,
    "fechaModificacion": Date,
    "comentarios": string
}