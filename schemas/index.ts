import endpointsJson from '../lib/endpoints.json';
const endpointsJsonString = JSON.stringify(endpointsJson);
export const endpoints = JSON.parse(endpointsJsonString);
export { ResponseSchema } from './responseSchema';
export { ResultSchema } from './resultSchema';

export { HolidayElementSchema, type HolidayElement } from './holiday/schema';

export {
    MedicalInsuranceElementSchema,
    type MedicalInsuranceElement
} from './medical-insurance/schema';
export {
    PermissionElementSchema,
    type PermissionElement
} from './permission/schema';
export {
    RemoteWorkElementSchema,
    type RemoteWorkElement
} from './remote-work/schema';
export {
    RequestDetailsWorkflowElementSchema,
    type RequestDetailsWorkflowElement
} from './request-details-workflow/schema';
export {
    SalaryIdentificationElementSchema,
    type SalaryIdentificationElement
} from './salary-identification/schema';

