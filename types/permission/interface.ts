// To parse this data:
//
//   import { Convert } from "./file";
//
//   const permission = Convert.toPermission(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface Permission {
    id:                         number;
    name:                       string;
    employee_id:                Array<EmployeeIDEnum | number>;
    number:                     string;
    department_id:              Array<number | string>;
    job_id:                     Array<JobIDEnum | number>;
    grade_id:                   Array<GradeIDEnum | number>;
    type_id:                    Array<TypeIDEnum | number>;
    description:                string;
    state:                      State;
    date:                       Date;
    more_one_day:               boolean;
    date_from:                  Date;
    date_to:                    Date;
    date_done:                  string;
    hour_from:                  number;
    hour_to:                    number;
    hour_number:                number;
    current_autorization_stock: number;
    current_nb_autorization:    number;
    all_day:                    boolean;
    reason:                     string;
    active:                     boolean;
    added_2summary:             boolean;
    attachment_ids:             number[];
    policy_id:                  Array<PolicyIDEnum | number>;
    res_model:                  ResModel;
    is_from_mobile:             boolean;
    mobile_approvals_ids:       number[];
    website_message_ids:        any[];
    message_follower_ids:       number[];
    message_ids:                number[];
    message_last_post:          boolean;
    create_uid:                 Array<CreateUidEnum | number>;
    create_date:                Date;
    write_uid:                  Array<CreateUidEnum | number>;
    write_date:                 Date;
    display_button_cancel:      boolean;
    check_work_permission:      boolean;
    is_direct_manager:          boolean;
    check_attachment:           boolean;
    department_global_id:       Array<DepartmentGlobalIDEnum | number>;
    sector_id:                  Array<SectorIDEnum | number>;
    message_is_follower:        boolean;
    message_partner_ids:        number[];
    message_channel_ids:        any[];
    message_unread:             boolean;
    message_unread_counter:     number;
    message_needaction:         boolean;
    message_needaction_counter: number;
    display_name:               string;
    __last_update:              Date;
}

export enum CreateUidEnum {
    Asaedi = "asaedi",
    KhaledAlamri = "Khaled Alamri",
}

export enum DepartmentGlobalIDEnum {
    خدماتالمنشآتالتقنيةوالحلولالرقمية = "خدمات المنشآت / التقنية والحلول الرقمية",
}

export enum EmployeeIDEnum {
    The1762عسافبنرشودالصاعدي = "[1762] عساف  بن رشود الصاعدي",
}

export enum GradeIDEnum {
    قائدفريق = "قائد فريق",
}

export enum JobIDEnum {
    قائدفريقأنظمةداخلية = "قائد فريق أنظمة داخلية",
}

export enum PolicyIDEnum {
    استئذانعمل = "استئذان عمل ",
    استئذانعمل22 = "استئذان عمل 22",
    رمضان2024 = "رمضان 2024",
    سياسة2024 = "سياسة 2024",
}

export enum ResModel {
    HrAuthorization = "hr.authorization",
}

export enum SectorIDEnum {
    خدماتالمنشآت = "خدمات المنشآت",
}

export enum State {
    Dm = "dm",
    Done = "done",
    Hrm = "hrm",
    Refuse = "refuse",
}

export enum TypeIDEnum {
    The01إستئذانشخصي = "[01] إستئذان شخصي\u202c",
    The02إستئذانلعمل = "[02] إستئذان لعمل\u202c",
    The10Osama = "[10] osama",
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toPermission(json: string): Permission[] {
        return cast(JSON.parse(json), a(r("Permission")));
    }

    public static permissionToJson(value: Permission[]): string {
        return JSON.stringify(uncast(value, a(r("Permission"))), null, 2);
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
    "Permission": o([
        { json: "id", js: "id", typ: 0 },
        { json: "name", js: "name", typ: "" },
        { json: "employee_id", js: "employee_id", typ: a(u(r("EmployeeIDEnum"), 0)) },
        { json: "number", js: "number", typ: "" },
        { json: "department_id", js: "department_id", typ: a(u(0, "")) },
        { json: "job_id", js: "job_id", typ: a(u(r("JobIDEnum"), 0)) },
        { json: "grade_id", js: "grade_id", typ: a(u(r("GradeIDEnum"), 0)) },
        { json: "type_id", js: "type_id", typ: a(u(r("TypeIDEnum"), 0)) },
        { json: "description", js: "description", typ: "" },
        { json: "state", js: "state", typ: r("State") },
        { json: "date", js: "date", typ: Date },
        { json: "more_one_day", js: "more_one_day", typ: true },
        { json: "date_from", js: "date_from", typ: Date },
        { json: "date_to", js: "date_to", typ: Date },
        { json: "date_done", js: "date_done", typ: "" },
        { json: "hour_from", js: "hour_from", typ: 3.14 },
        { json: "hour_to", js: "hour_to", typ: 3.14 },
        { json: "hour_number", js: "hour_number", typ: 3.14 },
        { json: "current_autorization_stock", js: "current_autorization_stock", typ: 3.14 },
        { json: "current_nb_autorization", js: "current_nb_autorization", typ: 0 },
        { json: "all_day", js: "all_day", typ: true },
        { json: "reason", js: "reason", typ: "" },
        { json: "active", js: "active", typ: true },
        { json: "added_2summary", js: "added_2summary", typ: true },
        { json: "attachment_ids", js: "attachment_ids", typ: a(0) },
        { json: "policy_id", js: "policy_id", typ: a(u(r("PolicyIDEnum"), 0)) },
        { json: "res_model", js: "res_model", typ: r("ResModel") },
        { json: "is_from_mobile", js: "is_from_mobile", typ: true },
        { json: "mobile_approvals_ids", js: "mobile_approvals_ids", typ: a(0) },
        { json: "website_message_ids", js: "website_message_ids", typ: a("any") },
        { json: "message_follower_ids", js: "message_follower_ids", typ: a(0) },
        { json: "message_ids", js: "message_ids", typ: a(0) },
        { json: "message_last_post", js: "message_last_post", typ: true },
        { json: "create_uid", js: "create_uid", typ: a(u(r("CreateUidEnum"), 0)) },
        { json: "create_date", js: "create_date", typ: Date },
        { json: "write_uid", js: "write_uid", typ: a(u(r("CreateUidEnum"), 0)) },
        { json: "write_date", js: "write_date", typ: Date },
        { json: "display_button_cancel", js: "display_button_cancel", typ: true },
        { json: "check_work_permission", js: "check_work_permission", typ: true },
        { json: "is_direct_manager", js: "is_direct_manager", typ: true },
        { json: "check_attachment", js: "check_attachment", typ: true },
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
    "CreateUidEnum": [
        "asaedi",
        "Khaled Alamri",
    ],
    "DepartmentGlobalIDEnum": [
        "خدمات المنشآت / التقنية والحلول الرقمية",
    ],
    "EmployeeIDEnum": [
        "[1762] عساف  بن رشود الصاعدي",
    ],
    "GradeIDEnum": [
        "قائد فريق",
    ],
    "JobIDEnum": [
        "قائد فريق أنظمة داخلية",
    ],
    "PolicyIDEnum": [
        "استئذان عمل ",
        "استئذان عمل 22",
        "رمضان 2024",
        "سياسة 2024",
    ],
    "ResModel": [
        "hr.authorization",
    ],
    "SectorIDEnum": [
        "خدمات المنشآت",
    ],
    "State": [
        "dm",
        "done",
        "hrm",
        "refuse",
    ],
    "TypeIDEnum": [
        "[01] إستئذان شخصي\u202c",
        "[02] إستئذان لعمل\u202c",
        "[10] osama",
    ],
};
