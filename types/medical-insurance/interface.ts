// To parse this data:
//
//   import { Convert } from "./file";
//
//   const medicalInsurance = Convert.toMedicalInsurance(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface MedicalInsurance {
    id:                            number;
    name:                          string;
    date:                          Date;
    employee_id:                   Array<EmployeeIDEnum | number>;
    request_type:                  RequestType;
    attachment_ids:                number[];
    relative_relation:             string;
    individual_complete_name:      string;
    state:                         State;
    reason:                        boolean | string;
    active:                        boolean;
    individual_english_name:       string;
    medical_insurance_type_id:     Array<MedicalInsuranceTypeIDEnum | number>;
    medical_insurance_category_id: Array<MedicalInsuranceCategoryIDEnum | number>;
    insurance_amount:              number;
    coverage:                      boolean | CoverageEnum;
    date_from:                     boolean | Date;
    date_to:                       boolean | Date;
    message_follower_ids:          number[];
    message_ids:                   number[];
    message_last_post:             boolean;
    website_message_ids:           any[];
    create_uid:                    Array<CreateUidEnum | number>;
    create_date:                   Date;
    write_uid:                     Array<CreateUidEnum | number>;
    write_date:                    Date;
    message_is_follower:           boolean;
    message_partner_ids:           number[];
    message_channel_ids:           any[];
    message_unread:                boolean;
    message_unread_counter:        number;
    message_needaction:            boolean;
    message_needaction_counter:    number;
    display_name:                  string;
    __last_update:                 Date;
}

export enum CoverageEnum {
    Yearly = "yearly",
}

export enum CreateUidEnum {
    Asaedi = "asaedi",
    KhaledAlamri = "Khaled Alamri",
    NnabulsiUAT = "nnabulsi.uat",
}

export enum EmployeeIDEnum {
    The1762عسافبنرشودالصاعدي = "[1762] عساف  بن رشود الصاعدي",
}

export enum MedicalInsuranceCategoryIDEnum {
    Vip = "VIP",
}

export enum MedicalInsuranceTypeIDEnum {
    تأمينبوبا2020 = "تأمين بوبا 2020",
}

export enum RequestType {
    Add = "add",
    Exclude = "exclude",
}

export enum State {
    Done = "done",
    Employee = "employee",
    Humain = "humain",
    Refuse = "refuse",
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toMedicalInsurance(json: string): MedicalInsurance[] {
        return cast(JSON.parse(json), a(r("MedicalInsurance")));
    }

    public static medicalInsuranceToJson(value: MedicalInsurance[]): string {
        return JSON.stringify(uncast(value, a(r("MedicalInsurance"))), null, 2);
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
    "MedicalInsurance": o([
        { json: "id", js: "id", typ: 0 },
        { json: "name", js: "name", typ: "" },
        { json: "date", js: "date", typ: Date },
        { json: "employee_id", js: "employee_id", typ: a(u(r("EmployeeIDEnum"), 0)) },
        { json: "request_type", js: "request_type", typ: r("RequestType") },
        { json: "attachment_ids", js: "attachment_ids", typ: a(0) },
        { json: "relative_relation", js: "relative_relation", typ: "" },
        { json: "individual_complete_name", js: "individual_complete_name", typ: "" },
        { json: "state", js: "state", typ: r("State") },
        { json: "reason", js: "reason", typ: u(true, "") },
        { json: "active", js: "active", typ: true },
        { json: "individual_english_name", js: "individual_english_name", typ: "" },
        { json: "medical_insurance_type_id", js: "medical_insurance_type_id", typ: a(u(r("MedicalInsuranceTypeIDEnum"), 0)) },
        { json: "medical_insurance_category_id", js: "medical_insurance_category_id", typ: a(u(r("MedicalInsuranceCategoryIDEnum"), 0)) },
        { json: "insurance_amount", js: "insurance_amount", typ: 0 },
        { json: "coverage", js: "coverage", typ: u(true, r("CoverageEnum")) },
        { json: "date_from", js: "date_from", typ: u(true, Date) },
        { json: "date_to", js: "date_to", typ: u(true, Date) },
        { json: "message_follower_ids", js: "message_follower_ids", typ: a(0) },
        { json: "message_ids", js: "message_ids", typ: a(0) },
        { json: "message_last_post", js: "message_last_post", typ: true },
        { json: "website_message_ids", js: "website_message_ids", typ: a("any") },
        { json: "create_uid", js: "create_uid", typ: a(u(r("CreateUidEnum"), 0)) },
        { json: "create_date", js: "create_date", typ: Date },
        { json: "write_uid", js: "write_uid", typ: a(u(r("CreateUidEnum"), 0)) },
        { json: "write_date", js: "write_date", typ: Date },
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
    "CoverageEnum": [
        "yearly",
    ],
    "CreateUidEnum": [
        "asaedi",
        "Khaled Alamri",
        "nnabulsi.uat",
    ],
    "EmployeeIDEnum": [
        "[1762] عساف  بن رشود الصاعدي",
    ],
    "MedicalInsuranceCategoryIDEnum": [
        "VIP",
    ],
    "MedicalInsuranceTypeIDEnum": [
        "تأمين بوبا 2020",
    ],
    "RequestType": [
        "add",
        "exclude",
    ],
    "State": [
        "done",
        "employee",
        "humain",
        "refuse",
    ],
};
