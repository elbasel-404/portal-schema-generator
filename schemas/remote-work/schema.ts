import * as z from "zod";


export const CreateUidEnumSchema = z.enum([
    "asaedi",
    "mbakr.uat",
]);
export type CreateUidEnum = z.infer<typeof CreateUidEnumSchema>;


export const DepartmentGlobalIdEnumSchema = z.enum([
    "خدمات المنشآت / التقنية والحلول الرقمية",
]);
export type DepartmentGlobalIdEnum = z.infer<typeof DepartmentGlobalIdEnumSchema>;


export const EmployeeIdEnumSchema = z.enum([
    "[1750] محمود  بن ناصر  البكر",
]);
export type EmployeeIdEnum = z.infer<typeof EmployeeIdEnumSchema>;


export const GradeIdEnumSchema = z.enum([
    "قائد فريق",
]);
export type GradeIdEnum = z.infer<typeof GradeIdEnumSchema>;


export const JobIdEnumSchema = z.enum([
    "قائد فريق إدارة الخدمات الرقمية",
]);
export type JobIdEnum = z.infer<typeof JobIdEnumSchema>;


export const ResModelSchema = z.enum([
    "hr.distance.work",
]);
export type ResModel = z.infer<typeof ResModelSchema>;


export const SectorIdEnumSchema = z.enum([
    "خدمات المنشآت",
]);
export type SectorIdEnum = z.infer<typeof SectorIdEnumSchema>;


export const StateSchema = z.enum([
    "done",
    "humain",
]);
export type State = z.infer<typeof StateSchema>;


export const TypeIdEnumSchema = z.enum([
    " الموظفين الرسميين",
]);
export type TypeIdEnum = z.infer<typeof TypeIdEnumSchema>;


export const WriteUidEnumSchema = z.enum([
    "asaedi",
    "nnabulsi.uat",
    "wdowayan.uat",
]);
export type WriteUidEnum = z.infer<typeof WriteUidEnumSchema>;

export const RemoteWorkElementSchema = z.object({
    "id": z.number(),
    "employee_id": z.array(z.union([EmployeeIdEnumSchema, z.number()])),
    "number": z.string(),
    "department_id": z.array(z.union([z.number(), z.string()])),
    "job_id": z.array(z.union([JobIdEnumSchema, z.number()])),
    "grade_id": z.array(z.union([GradeIdEnumSchema, z.number()])),
    "type_id": z.array(z.union([TypeIdEnumSchema, z.number()])),
    "degree_id": z.array(z.union([z.number(), z.string()])),
    "name": z.string(),
    "date_from": z.string(),
    "date_to": z.string(),
    "duration": z.number(),
    "state": StateSchema,
    "reason": z.string(),
    "active": z.boolean(),
    "description": z.string(),
    "is_reviewed_approved": z.boolean(),
    "note": z.string(),
    "is_token_updated": z.boolean(),
    "res_model": ResModelSchema,
    "is_from_mobile": z.boolean(),
    "mobile_approvals_ids": z.array(z.number()),
    "website_message_ids": z.array(z.any()),
    "message_follower_ids": z.array(z.number()),
    "message_ids": z.array(z.number()),
    "message_last_post": z.boolean(),
    "create_uid": z.array(z.union([CreateUidEnumSchema, z.number()])),
    "create_date": z.coerce.date(),
    "write_uid": z.array(z.union([WriteUidEnumSchema, z.number()])),
    "write_date": z.coerce.date(),
    "is_direct_manager": z.boolean(),
    "current_stock": z.number(),
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
export type RemoteWorkElement = z.infer<typeof RemoteWorkElementSchema>;
