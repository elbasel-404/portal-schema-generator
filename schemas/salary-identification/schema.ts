import * as z from "zod";


export const CreateUidEnumSchema = z.enum([
    "aashehri.uat",
    "Abeer F. Albaker",
    "Albaraa A. Abo Aqeel",
    "hqushaymit.uat",
    "Khaled Alamri",
]);
export type CreateUidEnum = z.infer<typeof CreateUidEnumSchema>;


export const DepartmentGlobalIdEnumSchema = z.enum([
    "خدمات المنشآت / خدمات المنشآت",
]);
export type DepartmentGlobalIdEnum = z.infer<typeof DepartmentGlobalIdEnumSchema>;


export const DestinationIdEnumSchema = z.enum([
    "إلى من يهمه الأمر",
    "البنك الأهلي السعودي",
    "مصرف الإنماء",
    "مصرف الراجحي",
]);
export type DestinationIdEnum = z.infer<typeof DestinationIdEnumSchema>;


export const DisplayNameSchema = z.enum([
    "[1401] حمد بن يوسف القشيميط",
]);
export type DisplayName = z.infer<typeof DisplayNameSchema>;


export const EngDestinationSchema = z.enum([
    "Alinma Bank",
    "Alrajhi Bank",
    "",
    "Saudi National Bank",
    "To Whom",
]);
export type EngDestination = z.infer<typeof EngDestinationSchema>;


export const ResModelSchema = z.enum([
    "salary.identification.request",
]);
export type ResModel = z.infer<typeof ResModelSchema>;


export const SectorIdEnumSchema = z.enum([
    "خدمات المنشآت",
]);
export type SectorIdEnum = z.infer<typeof SectorIdEnumSchema>;


export const StateSchema = z.enum([
    "done",
    "draft",
]);
export type State = z.infer<typeof StateSchema>;


export const TemplateSchema = z.enum([
    "",
    "خطاب تعريف بتفاصيل الراتب",
]);
export type Template = z.infer<typeof TemplateSchema>;


export const TypeSchema = z.enum([
    "nosalary_identification",
    "salary_check",
    "salary_detail",
    "salary_identification",
    "salary_payslip",
    "total_salary",
]);
export type Type = z.infer<typeof TypeSchema>;

export const SalaryIdentificationElementSchema = z.object({
    "id": z.number(),
    "number": z.string(),
    "order_date": z.string(),
    "employee_id": z.array(z.union([DisplayNameSchema, z.number()])),
    "destination_id": z.array(z.union([DestinationIdEnumSchema, z.number()])),
    "type": TypeSchema,
    "speech_lang": z.union([z.boolean(), z.string()]),
    "state": StateSchema,
    "partner_id": z.boolean(),
    "template_id": z.array(z.union([TemplateSchema, z.number()])),
    "refuse_reason": z.boolean(),
    "notes": z.union([z.boolean(), z.string()]),
    "active": z.boolean(),
    "account_status": z.string(),
    "bank_id": z.array(z.any()),
    "acc_number": z.string(),
    "download_link": z.string(),
    "open_link": z.string(),
    "res_model": ResModelSchema,
    "is_from_mobile": z.boolean(),
    "website_message_ids": z.array(z.any()),
    "message_follower_ids": z.array(z.number()),
    "message_ids": z.array(z.number()),
    "message_last_post": z.boolean(),
    "create_uid": z.array(z.union([CreateUidEnumSchema, z.number()])),
    "create_date": z.coerce.date(),
    "write_uid": z.array(z.union([CreateUidEnumSchema, z.number()])),
    "write_date": z.coerce.date(),
    "eng_destination": EngDestinationSchema,
    "template_name": TemplateSchema,
    "basic_salary": z.number(),
    "allowance_housing": z.number(),
    "allowance_transportation": z.number(),
    "allowance_mobile": z.number(),
    "designation_mandated_amount": z.number(),
    "department_global_id": z.array(z.union([DepartmentGlobalIdEnumSchema, z.number()])),
    "sector_id": z.array(z.union([SectorIdEnumSchema, z.number()])),
    "message_is_follower": z.boolean(),
    "message_partner_ids": z.array(z.number()),
    "message_channel_ids": z.array(z.any()),
    "message_unread": z.boolean(),
    "message_unread_counter": z.number(),
    "message_needaction": z.boolean(),
    "message_needaction_counter": z.number(),
    "display_name": DisplayNameSchema,
    "__last_update": z.coerce.date(),
});
export type SalaryIdentificationElement = z.infer<typeof SalaryIdentificationElementSchema>;
