// To parse this data:
//
//   import { Convert } from "./file";
//
//   const remoteWork = Convert.toRemoteWork(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface RemoteWork {
    id:                         number;
    employee_id:                Array<EmployeeIDEnum | number>;
    number:                     string;
    department_id:              Array<number | string>;
    job_id:                     Array<JobIDEnum | number>;
    grade_id:                   Array<GradeIDEnum | number>;
    type_id:                    Array<TypeIDEnum | number>;
    degree_id:                  Array<number | string>;
    name:                       string;
    date_from:                  Date;
    date_to:                    Date;
    duration:                   number;
    state:                      State;
    reason:                     string;
    active:                     boolean;
    description:                string;
    is_reviewed_approved:       boolean;
    note:                       string;
    is_token_updated:           boolean;
    website_message_ids:        any[];
    message_follower_ids:       number[];
    message_ids:                number[];
    message_last_post:          boolean;
    create_uid:                 Array<CreateUidEnum | number>;
    create_date:                Date;
    write_uid:                  Array<WriteUidEnum | number>;
    write_date:                 Date;
    res_model:                  ResModel;
    is_from_mobile:             boolean;
    mobile_approvals_ids:       number[];
    is_direct_manager:          boolean;
    current_stock:              number;
    message_is_follower:        boolean;
    message_partner_ids:        number[];
    message_channel_ids:        any[];
    message_unread:             boolean;
    message_unread_counter:     number;
    message_needaction:         boolean;
    message_needaction_counter: number;
    display_name:               string;
    __last_update:              Date;
    department_global_id:       Array<DepartmentGlobalIDEnum | number>;
    sector_id:                  Array<SectorIDEnum | number>;
}

export enum CreateUidEnum {
    Asaedi = "asaedi",
    MbakrUAT = "mbakr.uat",
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

export enum JobIDEnum {
    قائدفريقإدارةالخدماتالرقمية = "قائد فريق إدارة الخدمات الرقمية",
}

export enum ResModel {
    HrDistanceWork = "hr.distance.work",
}

export enum SectorIDEnum {
    خدماتالمنشآت = "خدمات المنشآت",
}

export enum State {
    Done = "done",
    Humain = "humain",
}

export enum TypeIDEnum {
    الموظفينالرسميين = " الموظفين الرسميين",
}

export enum WriteUidEnum {
    Asaedi = "asaedi",
    NnabulsiUAT = "nnabulsi.uat",
    WdowayanUAT = "wdowayan.uat",
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toRemoteWork(json: string): RemoteWork[] {
        return cast(JSON.parse(json), a(r("RemoteWork")));
    }

    public static remoteWorkToJson(value: RemoteWork[]): string {
        return JSON.stringify(uncast(value, a(r("RemoteWork"))), null, 2);
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
    "RemoteWork": o([
        { json: "id", js: "id", typ: 0 },
        { json: "employee_id", js: "employee_id", typ: a(u(r("EmployeeIDEnum"), 0)) },
        { json: "number", js: "number", typ: "" },
        { json: "department_id", js: "department_id", typ: a(u(0, "")) },
        { json: "job_id", js: "job_id", typ: a(u(r("JobIDEnum"), 0)) },
        { json: "grade_id", js: "grade_id", typ: a(u(r("GradeIDEnum"), 0)) },
        { json: "type_id", js: "type_id", typ: a(u(r("TypeIDEnum"), 0)) },
        { json: "degree_id", js: "degree_id", typ: a(u(0, "")) },
        { json: "name", js: "name", typ: "" },
        { json: "date_from", js: "date_from", typ: Date },
        { json: "date_to", js: "date_to", typ: Date },
        { json: "duration", js: "duration", typ: 0 },
        { json: "state", js: "state", typ: r("State") },
        { json: "reason", js: "reason", typ: "" },
        { json: "active", js: "active", typ: true },
        { json: "description", js: "description", typ: "" },
        { json: "is_reviewed_approved", js: "is_reviewed_approved", typ: true },
        { json: "note", js: "note", typ: "" },
        { json: "is_token_updated", js: "is_token_updated", typ: true },
        { json: "website_message_ids", js: "website_message_ids", typ: a("any") },
        { json: "message_follower_ids", js: "message_follower_ids", typ: a(0) },
        { json: "message_ids", js: "message_ids", typ: a(0) },
        { json: "message_last_post", js: "message_last_post", typ: true },
        { json: "create_uid", js: "create_uid", typ: a(u(r("CreateUidEnum"), 0)) },
        { json: "create_date", js: "create_date", typ: Date },
        { json: "write_uid", js: "write_uid", typ: a(u(r("WriteUidEnum"), 0)) },
        { json: "write_date", js: "write_date", typ: Date },
        { json: "res_model", js: "res_model", typ: r("ResModel") },
        { json: "is_from_mobile", js: "is_from_mobile", typ: true },
        { json: "mobile_approvals_ids", js: "mobile_approvals_ids", typ: a(0) },
        { json: "is_direct_manager", js: "is_direct_manager", typ: true },
        { json: "current_stock", js: "current_stock", typ: 0 },
        { json: "message_is_follower", js: "message_is_follower", typ: true },
        { json: "message_partner_ids", js: "message_partner_ids", typ: a(0) },
        { json: "message_channel_ids", js: "message_channel_ids", typ: a("any") },
        { json: "message_unread", js: "message_unread", typ: true },
        { json: "message_unread_counter", js: "message_unread_counter", typ: 0 },
        { json: "message_needaction", js: "message_needaction", typ: true },
        { json: "message_needaction_counter", js: "message_needaction_counter", typ: 0 },
        { json: "display_name", js: "display_name", typ: "" },
        { json: "__last_update", js: "__last_update", typ: Date },
        { json: "department_global_id", js: "department_global_id", typ: a(u(r("DepartmentGlobalIDEnum"), 0)) },
        { json: "sector_id", js: "sector_id", typ: a(u(r("SectorIDEnum"), 0)) },
    ], false),
    "CreateUidEnum": [
        "asaedi",
        "mbakr.uat",
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
    "JobIDEnum": [
        "قائد فريق إدارة الخدمات الرقمية",
    ],
    "ResModel": [
        "hr.distance.work",
    ],
    "SectorIDEnum": [
        "خدمات المنشآت",
    ],
    "State": [
        "done",
        "humain",
    ],
    "TypeIDEnum": [
        " الموظفين الرسميين",
    ],
    "WriteUidEnum": [
        "asaedi",
        "nnabulsi.uat",
        "wdowayan.uat",
    ],
};
