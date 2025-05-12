// To parse this data:
//
//   import { Convert } from "./file";
//
//   const holiday = Convert.toHoliday(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface Holiday {
    id:                           number;
    payslip_status:               boolean;
    report_note:                  boolean;
    user_id:                      Array<CreateUidEnum | number>;
    manager_id:                   Array<ManagerIDEnum | number>;
    notes:                        string;
    number_of_days_temp:          number;
    number_of_days:               number;
    meeting_id:                   boolean;
    type:                         Type;
    linked_request_ids:           any[];
    category_id:                  boolean;
    holiday_type:                 HolidayType;
    first_approver_id:            boolean;
    second_approver_id:           boolean;
    name:                         string;
    date:                         Date;
    employee_id:                  Array<EmployeeIDEnum | number>;
    substitute_employee_id:       Array<ManagerIDEnum | number>;
    department_id:                Array<number | string>;
    job_id:                       Array<JobIDEnum | number>;
    grade_id:                     Array<GradeIDEnum | number>;
    degree_id:                    Array<number | string>;
    raison:                       boolean | string;
    date_from:                    Date;
    date_to:                      Date;
    duration:                     number;
    holiday_status_id:            Array<HolidayStatusIDEnum | number>;
    with_advanced_salary:         boolean;
    salary_number:                number;
    state:                        State;
    holiday_cancellation:         boolean;
    is_extension:                 boolean;
    extended_holiday_id:          boolean;
    parent_id:                    boolean;
    extension_holidays_ids:       any[];
    extension_duration:           number;
    childbirth_date:              boolean | Date;
    sold_overtime:                number;
    sold_attendance:              number;
    death_person:                 boolean | string;
    compensation_type:            boolean;
    accompaniment_type:           boolean;
    accompanied_child_age:        number;
    study_subject:                boolean;
    city:                         boolean;
    country_ids:                  Array<CountryIDEnum | number> | boolean;
    current_holiday_stock:        number;
    sport_participation_topic:    boolean;
    birth_child_filename:         boolean;
    hide_with_advanced_salary:    boolean;
    token_compensation_stock:     number;
    payed_salary_advance:         boolean;
    done_date:                    Date;
    attachment_ids:               number[];
    date_holidays_to:             boolean;
    refuse_reason:                string;
    active:                       boolean;
    cancel_reason:                boolean;
    res_model:                    ResModel;
    is_from_mobile:               boolean;
    mobile_approvals_ids:         number[];
    message_follower_ids:         number[];
    message_ids:                  number[];
    message_last_post:            boolean;
    website_message_ids:          any[];
    create_uid:                   Array<CreateUidEnum | number>;
    create_date:                  Date;
    write_uid:                    Array<WriteUidEnum | number>;
    write_date:                   Date;
    x_sla_labels:                 string;
    double_validation:            boolean;
    can_reset:                    boolean;
    is_annual:                    boolean;
    spend_advanced_salary:        boolean;
    advanced_salary_period:       number;
    is_current_user:              boolean;
    is_direct_manager:            boolean;
    is_cut:                       boolean;
    is_cancelled:                 boolean;
    is_started:                   boolean;
    is_finished:                  boolean;
    is_extended:                  boolean;
    can_be_cut:                   boolean;
    can_be_cancelled:             boolean;
    display_button_cancel:        boolean;
    display_button_cut:           boolean;
    display_button_extend:        boolean;
    attachment_required:          boolean;
    display_button_send:          boolean;
    substitute_employee_required: boolean;
    department_global_id:         Array<DepartmentGlobalIDEnum | number>;
    sector_id:                    Array<SectorIDEnum | number>;
    message_is_follower:          boolean;
    message_partner_ids:          number[];
    message_channel_ids:          any[];
    message_unread:               boolean;
    message_unread_counter:       number;
    message_needaction:           boolean;
    message_needaction_counter:   number;
    display_name:                 string;
    __last_update:                Date;
}

export enum CountryIDEnum {
    BonaireSintEustatiusAndSaba = "Bonaire, Sint Eustatius and Saba",
}

export enum CreateUidEnum {
    MahmoudNAlbakr = "Mahmoud N. Albakr",
}

export enum DepartmentGlobalIDEnum {
    خدماتالمنشآتالتقنيةوالحلولالرقمية = "خدمات المنشآت / التقنية والحلول الرقمية",
}

export enum EmployeeIDEnum {
    The1750محمودبنناصرالبكر = "[1750] محمود  بن ناصر  البكر",
}

export enum GradeIDEnum {
    قائدفريق = "قائد فريق",
}

export enum HolidayStatusIDEnum {
    إجازةالمولود = "إجازة المولود",
    إجازةزواج = "إجازة زواج",
    إجازةسنوية = "إجازة سنوية",
    إجازةمرضيّة = "إجازة مرضيّة",
}

export enum HolidayType {
    Employee = "employee",
}

export enum JobIDEnum {
    قائدفريقإدارةالخدماتالرقمية = "قائد فريق إدارة الخدمات الرقمية",
}

export enum ManagerIDEnum {
    The1417رائدبنحمدرشيد = "[1417] رائد بن حمد رشيد",
    The1688ايمنبنمعتوقالسفياني = "[1688] ايمن بن معتوق السفياني",
}

export enum ResModel {
    HrHolidays = "hr.holidays",
}

export enum SectorIDEnum {
    خدماتالمنشآت = "خدمات المنشآت",
}

export enum State {
    Done = "done",
}

export enum Type {
    Remove = "remove",
}

export enum WriteUidEnum {
    AnfalNHamdi = "Anfal N. Hamdi",
    MubarakHAlajmi = "Mubarak H. Alajmi",
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toHoliday(json: string): Holiday[] {
        return cast(JSON.parse(json), a(r("Holiday")));
    }

    public static holidayToJson(value: Holiday[]): string {
        return JSON.stringify(uncast(value, a(r("Holiday"))), null, 2);
    }
}

function invalidValue(typ: any, val: any, key: any, parent: any = ''): never {
    const prettyTyp = prettyTypeName(typ);
    const parentText = parent ? ` on ${parent}` : '';
    const keyText = key ? ` for key "${key}"` : '';
    throw Error(`Invalid value${keyText}${parentText}. Expected ${prettyTyp} but got ${JSON.stringify(val)}`);
}

function prettyTypeName(typ: any): string {
    if (Array.isArray(typ)) {
        if (typ.length === 2 && typ[0] === undefined) {
            return `an optional ${prettyTypeName(typ[1])}`;
        } else {
            return `one of [${typ.map(a => { return prettyTypeName(a); }).join(", ")}]`;
        }
    } else if (typeof typ === "object" && typ.literal !== undefined) {
        return typ.literal;
    } else {
        return typeof typ;
    }
}

function jsonToJSProps(typ: any): any {
    if (typ.jsonToJS === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.json] = { key: p.js, typ: p.typ });
        typ.jsonToJS = map;
    }
    return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
    if (typ.jsToJSON === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.js] = { key: p.json, typ: p.typ });
        typ.jsToJSON = map;
    }
    return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any, key: any = '', parent: any = ''): any {
    function transformPrimitive(typ: string, val: any): any {
        if (typeof typ === typeof val) return val;
        return invalidValue(typ, val, key, parent);
    }

    function transformUnion(typs: any[], val: any): any {
        // val must validate against one typ in typs
        const l = typs.length;
        for (let i = 0; i < l; i++) {
            const typ = typs[i];
            try {
                return transform(val, typ, getProps);
            } catch (_) {}
        }
        return invalidValue(typs, val, key, parent);
    }

    function transformEnum(cases: string[], val: any): any {
        if (cases.indexOf(val) !== -1) return val;
        return invalidValue(cases.map(a => { return l(a); }), val, key, parent);
    }

    function transformArray(typ: any, val: any): any {
        // val must be an array with no invalid elements
        if (!Array.isArray(val)) return invalidValue(l("array"), val, key, parent);
        return val.map(el => transform(el, typ, getProps));
    }

    function transformDate(val: any): any {
        if (val === null) {
            return null;
        }
        const d = new Date(val);
        if (isNaN(d.valueOf())) {
            return invalidValue(l("Date"), val, key, parent);
        }
        return d;
    }

    function transformObject(props: { [k: string]: any }, additional: any, val: any): any {
        if (val === null || typeof val !== "object" || Array.isArray(val)) {
            return invalidValue(l(ref || "object"), val, key, parent);
        }
        const result: any = {};
        Object.getOwnPropertyNames(props).forEach(key => {
            const prop = props[key];
            const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
            result[prop.key] = transform(v, prop.typ, getProps, key, ref);
        });
        Object.getOwnPropertyNames(val).forEach(key => {
            if (!Object.prototype.hasOwnProperty.call(props, key)) {
                result[key] = transform(val[key], additional, getProps, key, ref);
            }
        });
        return result;
    }

    if (typ === "any") return val;
    if (typ === null) {
        if (val === null) return val;
        return invalidValue(typ, val, key, parent);
    }
    if (typ === false) return invalidValue(typ, val, key, parent);
    let ref: any = undefined;
    while (typeof typ === "object" && typ.ref !== undefined) {
        ref = typ.ref;
        typ = typeMap[typ.ref];
    }
    if (Array.isArray(typ)) return transformEnum(typ, val);
    if (typeof typ === "object") {
        return typ.hasOwnProperty("unionMembers") ? transformUnion(typ.unionMembers, val)
            : typ.hasOwnProperty("arrayItems")    ? transformArray(typ.arrayItems, val)
            : typ.hasOwnProperty("props")         ? transformObject(getProps(typ), typ.additional, val)
            : invalidValue(typ, val, key, parent);
    }
    // Numbers can be parsed by Date but shouldn't be.
    if (typ === Date && typeof val !== "number") return transformDate(val);
    return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
    return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
    return transform(val, typ, jsToJSONProps);
}

function l(typ: any) {
    return { literal: typ };
}

function a(typ: any) {
    return { arrayItems: typ };
}

function u(...typs: any[]) {
    return { unionMembers: typs };
}

function o(props: any[], additional: any) {
    return { props, additional };
}

function m(additional: any) {
    return { props: [], additional };
}

function r(name: string) {
    return { ref: name };
}

const typeMap: any = {
    "Holiday": o([
        { json: "id", js: "id", typ: 0 },
        { json: "payslip_status", js: "payslip_status", typ: true },
        { json: "report_note", js: "report_note", typ: true },
        { json: "user_id", js: "user_id", typ: a(u(r("CreateUidEnum"), 0)) },
        { json: "manager_id", js: "manager_id", typ: a(u(r("ManagerIDEnum"), 0)) },
        { json: "notes", js: "notes", typ: "" },
        { json: "number_of_days_temp", js: "number_of_days_temp", typ: 0 },
        { json: "number_of_days", js: "number_of_days", typ: 0 },
        { json: "meeting_id", js: "meeting_id", typ: true },
        { json: "type", js: "type", typ: r("Type") },
        { json: "linked_request_ids", js: "linked_request_ids", typ: a("any") },
        { json: "category_id", js: "category_id", typ: true },
        { json: "holiday_type", js: "holiday_type", typ: r("HolidayType") },
        { json: "first_approver_id", js: "first_approver_id", typ: true },
        { json: "second_approver_id", js: "second_approver_id", typ: true },
        { json: "name", js: "name", typ: "" },
        { json: "date", js: "date", typ: Date },
        { json: "employee_id", js: "employee_id", typ: a(u(r("EmployeeIDEnum"), 0)) },
        { json: "substitute_employee_id", js: "substitute_employee_id", typ: a(u(r("ManagerIDEnum"), 0)) },
        { json: "department_id", js: "department_id", typ: a(u(0, "")) },
        { json: "job_id", js: "job_id", typ: a(u(r("JobIDEnum"), 0)) },
        { json: "grade_id", js: "grade_id", typ: a(u(r("GradeIDEnum"), 0)) },
        { json: "degree_id", js: "degree_id", typ: a(u(0, "")) },
        { json: "raison", js: "raison", typ: u(true, "") },
        { json: "date_from", js: "date_from", typ: Date },
        { json: "date_to", js: "date_to", typ: Date },
        { json: "duration", js: "duration", typ: 0 },
        { json: "holiday_status_id", js: "holiday_status_id", typ: a(u(r("HolidayStatusIDEnum"), 0)) },
        { json: "with_advanced_salary", js: "with_advanced_salary", typ: true },
        { json: "salary_number", js: "salary_number", typ: 0 },
        { json: "state", js: "state", typ: r("State") },
        { json: "holiday_cancellation", js: "holiday_cancellation", typ: true },
        { json: "is_extension", js: "is_extension", typ: true },
        { json: "extended_holiday_id", js: "extended_holiday_id", typ: true },
        { json: "parent_id", js: "parent_id", typ: true },
        { json: "extension_holidays_ids", js: "extension_holidays_ids", typ: a("any") },
        { json: "extension_duration", js: "extension_duration", typ: 0 },
        { json: "childbirth_date", js: "childbirth_date", typ: u(true, Date) },
        { json: "sold_overtime", js: "sold_overtime", typ: 0 },
        { json: "sold_attendance", js: "sold_attendance", typ: 0 },
        { json: "death_person", js: "death_person", typ: u(true, "") },
        { json: "compensation_type", js: "compensation_type", typ: true },
        { json: "accompaniment_type", js: "accompaniment_type", typ: true },
        { json: "accompanied_child_age", js: "accompanied_child_age", typ: 0 },
        { json: "study_subject", js: "study_subject", typ: true },
        { json: "city", js: "city", typ: true },
        { json: "country_ids", js: "country_ids", typ: u(a(u(r("CountryIDEnum"), 0)), true) },
        { json: "current_holiday_stock", js: "current_holiday_stock", typ: 3.14 },
        { json: "sport_participation_topic", js: "sport_participation_topic", typ: true },
        { json: "birth_child_filename", js: "birth_child_filename", typ: true },
        { json: "hide_with_advanced_salary", js: "hide_with_advanced_salary", typ: true },
        { json: "token_compensation_stock", js: "token_compensation_stock", typ: 0 },
        { json: "payed_salary_advance", js: "payed_salary_advance", typ: true },
        { json: "done_date", js: "done_date", typ: Date },
        { json: "attachment_ids", js: "attachment_ids", typ: a(0) },
        { json: "date_holidays_to", js: "date_holidays_to", typ: true },
        { json: "refuse_reason", js: "refuse_reason", typ: "" },
        { json: "active", js: "active", typ: true },
        { json: "cancel_reason", js: "cancel_reason", typ: true },
        { json: "res_model", js: "res_model", typ: r("ResModel") },
        { json: "is_from_mobile", js: "is_from_mobile", typ: true },
        { json: "mobile_approvals_ids", js: "mobile_approvals_ids", typ: a(0) },
        { json: "message_follower_ids", js: "message_follower_ids", typ: a(0) },
        { json: "message_ids", js: "message_ids", typ: a(0) },
        { json: "message_last_post", js: "message_last_post", typ: true },
        { json: "website_message_ids", js: "website_message_ids", typ: a("any") },
        { json: "create_uid", js: "create_uid", typ: a(u(r("CreateUidEnum"), 0)) },
        { json: "create_date", js: "create_date", typ: Date },
        { json: "write_uid", js: "write_uid", typ: a(u(r("WriteUidEnum"), 0)) },
        { json: "write_date", js: "write_date", typ: Date },
        { json: "x_sla_labels", js: "x_sla_labels", typ: "" },
        { json: "double_validation", js: "double_validation", typ: true },
        { json: "can_reset", js: "can_reset", typ: true },
        { json: "is_annual", js: "is_annual", typ: true },
        { json: "spend_advanced_salary", js: "spend_advanced_salary", typ: true },
        { json: "advanced_salary_period", js: "advanced_salary_period", typ: 0 },
        { json: "is_current_user", js: "is_current_user", typ: true },
        { json: "is_direct_manager", js: "is_direct_manager", typ: true },
        { json: "is_cut", js: "is_cut", typ: true },
        { json: "is_cancelled", js: "is_cancelled", typ: true },
        { json: "is_started", js: "is_started", typ: true },
        { json: "is_finished", js: "is_finished", typ: true },
        { json: "is_extended", js: "is_extended", typ: true },
        { json: "can_be_cut", js: "can_be_cut", typ: true },
        { json: "can_be_cancelled", js: "can_be_cancelled", typ: true },
        { json: "display_button_cancel", js: "display_button_cancel", typ: true },
        { json: "display_button_cut", js: "display_button_cut", typ: true },
        { json: "display_button_extend", js: "display_button_extend", typ: true },
        { json: "attachment_required", js: "attachment_required", typ: true },
        { json: "display_button_send", js: "display_button_send", typ: true },
        { json: "substitute_employee_required", js: "substitute_employee_required", typ: true },
        { json: "department_global_id", js: "department_global_id", typ: a(u(r("DepartmentGlobalIDEnum"), 0)) },
        { json: "sector_id", js: "sector_id", typ: a(u(r("SectorIDEnum"), 0)) },
        { json: "message_is_follower", js: "message_is_follower", typ: true },
        { json: "message_partner_ids", js: "message_partner_ids", typ: a(0) },
        { json: "message_channel_ids", js: "message_channel_ids", typ: a("any") },
        { json: "message_unread", js: "message_unread", typ: true },
        { json: "message_unread_counter", js: "message_unread_counter", typ: 0 },
        { json: "message_needaction", js: "message_needaction", typ: true },
        { json: "message_needaction_counter", js: "message_needaction_counter", typ: 0 },
        { json: "display_name", js: "display_name", typ: "" },
        { json: "__last_update", js: "__last_update", typ: Date },
    ], false),
    "CountryIDEnum": [
        "Bonaire, Sint Eustatius and Saba",
    ],
    "CreateUidEnum": [
        "Mahmoud N. Albakr",
    ],
    "DepartmentGlobalIDEnum": [
        "خدمات المنشآت / التقنية والحلول الرقمية",
    ],
    "EmployeeIDEnum": [
        "[1750] محمود  بن ناصر  البكر",
    ],
    "GradeIDEnum": [
        "قائد فريق",
    ],
    "HolidayStatusIDEnum": [
        "إجازة المولود",
        "إجازة زواج",
        "إجازة سنوية",
        "إجازة مرضيّة",
    ],
    "HolidayType": [
        "employee",
    ],
    "JobIDEnum": [
        "قائد فريق إدارة الخدمات الرقمية",
    ],
    "ManagerIDEnum": [
        "[1417] رائد بن حمد رشيد",
        "[1688] ايمن بن معتوق السفياني",
    ],
    "ResModel": [
        "hr.holidays",
    ],
    "SectorIDEnum": [
        "خدمات المنشآت",
    ],
    "State": [
        "done",
    ],
    "Type": [
        "remove",
    ],
    "WriteUidEnum": [
        "Anfal N. Hamdi",
        "Mubarak H. Alajmi",
    ],
};
