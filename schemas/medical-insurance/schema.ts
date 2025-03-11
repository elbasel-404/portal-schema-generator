import * as z from "zod";


export const CoverageEnumSchema = z.enum([
    "yearly",
]);
export type CoverageEnum = z.infer<typeof CoverageEnumSchema>;


export const CreateUidEnumSchema = z.enum([
    "asaedi",
    "Khaled Alamri",
    "nnabulsi.uat",
]);
export type CreateUidEnum = z.infer<typeof CreateUidEnumSchema>;


export const EmployeeIdEnumSchema = z.enum([
    "[1762] عساف  بن رشود الصاعدي",
]);
export type EmployeeIdEnum = z.infer<typeof EmployeeIdEnumSchema>;


export const MedicalInsuranceCategoryIdEnumSchema = z.enum([
    "VIP",
]);
export type MedicalInsuranceCategoryIdEnum = z.infer<typeof MedicalInsuranceCategoryIdEnumSchema>;


export const MedicalInsuranceTypeIdEnumSchema = z.enum([
    "تأمين بوبا 2020",
]);
export type MedicalInsuranceTypeIdEnum = z.infer<typeof MedicalInsuranceTypeIdEnumSchema>;


export const RequestTypeSchema = z.enum([
    "add",
    "exclude",
]);
export type RequestType = z.infer<typeof RequestTypeSchema>;


export const StateSchema = z.enum([
    "done",
    "employee",
    "humain",
    "refuse",
]);
export type State = z.infer<typeof StateSchema>;

export const MedicalInsuranceElementSchema = z.object({
    "id": z.number(),
    "name": z.string(),
    "date": z.string(),
    "employee_id": z.array(z.union([EmployeeIdEnumSchema, z.number()])),
    "request_type": RequestTypeSchema,
    "attachment_ids": z.array(z.number()),
    "relative_relation": z.string(),
    "individual_complete_name": z.string(),
    "state": StateSchema,
    "reason": z.union([z.boolean(), z.string()]),
    "active": z.boolean(),
    "individual_english_name": z.string(),
    "medical_insurance_type_id": z.array(z.union([MedicalInsuranceTypeIdEnumSchema, z.number()])),
    "medical_insurance_category_id": z.array(z.union([MedicalInsuranceCategoryIdEnumSchema, z.number()])),
    "insurance_amount": z.number(),
    "coverage": z.union([z.boolean(), CoverageEnumSchema]),
    "date_from": z.union([z.boolean(), z.string()]),
    "date_to": z.union([z.boolean(), z.string()]),
    "website_message_ids": z.array(z.any()),
    "message_follower_ids": z.array(z.number()),
    "message_ids": z.array(z.number()),
    "message_last_post": z.boolean(),
    "create_uid": z.array(z.union([CreateUidEnumSchema, z.number()])),
    "create_date": z.coerce.date(),
    "write_uid": z.array(z.union([CreateUidEnumSchema, z.number()])),
    "write_date": z.coerce.date(),
    "message_is_follower": z.boolean(),
    "message_partner_ids": z.array(z.number()),
    "message_channel_ids": z.array(z.any()),
    "message_unread": z.boolean(),
    "message_unread_counter": z.number(),
    "message_needaction": z.boolean(),
    "message_needaction_counter": z.number(),
    "display_name": z.string(),
    "__last_update": z.coerce.date(),
});
export type MedicalInsuranceElement = z.infer<typeof MedicalInsuranceElementSchema>;
