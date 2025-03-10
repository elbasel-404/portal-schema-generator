import * as z from "zod";


export const CreateUidEnumSchema = z.enum([
    "asaedi",
    "Khaled Alamri",
]);
export type CreateUidEnum = z.infer<typeof CreateUidEnumSchema>;


export const DepartmentGlobalIdEnumSchema = z.enum([
    "خدمات المنشآت / التقنية والحلول الرقمية",
]);
export type DepartmentGlobalIdEnum = z.infer<typeof DepartmentGlobalIdEnumSchema>;


export const EmployeeIdEnumSchema = z.enum([
    "[1762] عساف  بن رشود الصاعدي",
]);
export type EmployeeIdEnum = z.infer<typeof EmployeeIdEnumSchema>;


export const GradeIdEnumSchema = z.enum([
    "قائد فريق",
]);
export type GradeIdEnum = z.infer<typeof GradeIdEnumSchema>;


export const JobIdEnumSchema = z.enum([
    "قائد فريق أنظمة داخلية",
]);
export type JobIdEnum = z.infer<typeof JobIdEnumSchema>;


export const PolicyIdEnumSchema = z.enum([
    "استئذان عمل ",
    "استئذان عمل 22",
    "رمضان 2024",
    "سياسة 2024",
]);
export type PolicyIdEnum = z.infer<typeof PolicyIdEnumSchema>;


export const ResModelSchema = z.enum([
    "hr.authorization",
]);
export type ResModel = z.infer<typeof ResModelSchema>;


export const SectorIdEnumSchema = z.enum([
    "خدمات المنشآت",
]);
export type SectorIdEnum = z.infer<typeof SectorIdEnumSchema>;


export const StateSchema = z.enum([
    "dm",
    "done",
    "hrm",
    "refuse",
]);
export type State = z.infer<typeof StateSchema>;


export const TypeIdEnumSchema = z.enum([
    "[01] إستئذان شخصي\u202c",
    "[02] إستئذان لعمل\u202c",
    "[10] osama",
]);
export type TypeIdEnum = z.infer<typeof TypeIdEnumSchema>;

export const PermissionElementSchema = z.object({
    "id": z.number(),
    "name": z.string(),
    "employee_id": z.array(z.union([EmployeeIdEnumSchema, z.number()])),
    "number": z.string(),
    "department_id": z.array(z.union([z.number(), z.string()])),
    "job_id": z.array(z.union([JobIdEnumSchema, z.number()])),
    "grade_id": z.array(z.union([GradeIdEnumSchema, z.number()])),
    "type_id": z.array(z.union([TypeIdEnumSchema, z.number()])),
    "description": z.string(),
    "state": StateSchema,
    "date": z.string(),
    "more_one_day": z.boolean(),
    "date_from": z.string(),
    "date_to": z.string(),
    "date_done": z.string(),
    "hour_from": z.number(),
    "hour_to": z.number(),
    "hour_number": z.number(),
    "current_autorization_stock": z.number(),
    "current_nb_autorization": z.number(),
    "all_day": z.boolean(),
    "reason": z.string(),
    "active": z.boolean(),
    "added_2summary": z.boolean(),
    "attachment_ids": z.array(z.number()),
    "policy_id": z.array(z.union([PolicyIdEnumSchema, z.number()])),
    "res_model": ResModelSchema,
    "is_from_mobile": z.boolean(),
    "mobile_approvals_ids": z.array(z.number()),
    "website_message_ids": z.array(z.any()),
    "message_follower_ids": z.array(z.number()),
    "message_ids": z.array(z.number()),
    "message_last_post": z.boolean(),
    "create_uid": z.array(z.union([CreateUidEnumSchema, z.number()])),
    "create_date": z.coerce.date(),
    "write_uid": z.array(z.union([CreateUidEnumSchema, z.number()])),
    "write_date": z.coerce.date(),
    "display_button_cancel": z.boolean(),
    "check_work_permission": z.boolean(),
    "is_direct_manager": z.boolean(),
    "check_attachment": z.boolean(),
    "department_global_id": z.array(z.union([DepartmentGlobalIdEnumSchema, z.number()])),
    "sector_id": z.array(z.union([SectorIdEnumSchema, z.number()])),
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
export type PermissionElement = z.infer<typeof PermissionElementSchema>;
