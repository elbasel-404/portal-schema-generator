// To parse this data:
//
//   import { Convert } from "./file";
//
//   const salaryIdentification = Convert.toSalaryIdentification(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface SalaryIdentification {
    id:                          number;
    number:                      string;
    order_date:                  Date;
    employee_id:                 Array<DisplayName | number>;
    destination_id:              Array<DestinationIDEnum | number>;
    type:                        Type;
    speech_lang:                 boolean | string;
    state:                       State;
    partner_id:                  boolean;
    template_id:                 Array<Template | number>;
    refuse_reason:               boolean;
    notes:                       boolean | string;
    active:                      boolean;
    account_status:              string;
    bank_id:                     any[];
    acc_number:                  string;
    download_link:               string;
    open_link:                   string;
    res_model:                   ResModel;
    is_from_mobile:              boolean;
    message_follower_ids:        number[];
    message_ids:                 number[];
    message_last_post:           boolean;
    website_message_ids:         any[];
    create_uid:                  Array<CreateUidEnum | number>;
    create_date:                 Date;
    write_uid:                   Array<CreateUidEnum | number>;
    write_date:                  Date;
    eng_destination:             EngDestination;
    template_name:               Template;
    basic_salary:                number;
    allowance_housing:           number;
    allowance_transportation:    number;
    allowance_mobile:            number;
    designation_mandated_amount: number;
    department_global_id:        Array<DepartmentGlobalIDEnum | number>;
    sector_id:                   Array<SectorIDEnum | number>;
    message_is_follower:         boolean;
    message_partner_ids:         number[];
    message_channel_ids:         any[];
    message_unread:              boolean;
    message_unread_counter:      number;
    message_needaction:          boolean;
    message_needaction_counter:  number;
    display_name:                DisplayName;
    __last_update:               Date;
}

export enum CreateUidEnum {
    AashehriUAT = "aashehri.uat",
    AbeerFAlbaker = "Abeer F. Albaker",
    AlbaraaAAboAqeel = "Albaraa A. Abo Aqeel",
    HqushaymitUAT = "hqushaymit.uat",
    KhaledAlamri = "Khaled Alamri",
}

export enum DepartmentGlobalIDEnum {
    خدماتالمنشآتخدماتالمنشآت = "خدمات المنشآت / خدمات المنشآت",
}

export enum DestinationIDEnum {
    إلىمنيهمهالأمر = "إلى من يهمه الأمر",
    البنكالأهليالسعودي = "البنك الأهلي السعودي",
    مصرفالإنماء = "مصرف الإنماء",
    مصرفالراجحي = "مصرف الراجحي",
}

export enum DisplayName {
    The1401حمدبنيوسفالقشيميط = "[1401] حمد بن يوسف القشيميط",
}

export enum EngDestination {
    AlinmaBank = "Alinma Bank",
    AlrajhiBank = "Alrajhi Bank",
    Empty = "",
    SaudiNationalBank = "Saudi National Bank",
    ToWhom = "To Whom",
}

export enum ResModel {
    SalaryIdentificationRequest = "salary.identification.request",
}

export enum SectorIDEnum {
    خدماتالمنشآت = "خدمات المنشآت",
}

export enum State {
    Done = "done",
    Draft = "draft",
}

export enum Template {
    Empty = "",
    خطابتعريفبتفاصيلالراتب = "خطاب تعريف بتفاصيل الراتب",
}

export enum Type {
    NosalaryIdentification = "nosalary_identification",
    SalaryCheck = "salary_check",
    SalaryDetail = "salary_detail",
    SalaryIdentification = "salary_identification",
    SalaryPayslip = "salary_payslip",
    TotalSalary = "total_salary",
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toSalaryIdentification(json: string): SalaryIdentification[] {
        return cast(JSON.parse(json), a(r("SalaryIdentification")));
    }

    public static salaryIdentificationToJson(value: SalaryIdentification[]): string {
        return JSON.stringify(uncast(value, a(r("SalaryIdentification"))), null, 2);
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
    "SalaryIdentification": o([
        { json: "id", js: "id", typ: 0 },
        { json: "number", js: "number", typ: "" },
        { json: "order_date", js: "order_date", typ: Date },
        { json: "employee_id", js: "employee_id", typ: a(u(r("DisplayName"), 0)) },
        { json: "destination_id", js: "destination_id", typ: a(u(r("DestinationIDEnum"), 0)) },
        { json: "type", js: "type", typ: r("Type") },
        { json: "speech_lang", js: "speech_lang", typ: u(true, "") },
        { json: "state", js: "state", typ: r("State") },
        { json: "partner_id", js: "partner_id", typ: true },
        { json: "template_id", js: "template_id", typ: a(u(r("Template"), 0)) },
        { json: "refuse_reason", js: "refuse_reason", typ: true },
        { json: "notes", js: "notes", typ: u(true, "") },
        { json: "active", js: "active", typ: true },
        { json: "account_status", js: "account_status", typ: "" },
        { json: "bank_id", js: "bank_id", typ: a("any") },
        { json: "acc_number", js: "acc_number", typ: "" },
        { json: "download_link", js: "download_link", typ: "" },
        { json: "open_link", js: "open_link", typ: "" },
        { json: "res_model", js: "res_model", typ: r("ResModel") },
        { json: "is_from_mobile", js: "is_from_mobile", typ: true },
        { json: "message_follower_ids", js: "message_follower_ids", typ: a(0) },
        { json: "message_ids", js: "message_ids", typ: a(0) },
        { json: "message_last_post", js: "message_last_post", typ: true },
        { json: "website_message_ids", js: "website_message_ids", typ: a("any") },
        { json: "create_uid", js: "create_uid", typ: a(u(r("CreateUidEnum"), 0)) },
        { json: "create_date", js: "create_date", typ: Date },
        { json: "write_uid", js: "write_uid", typ: a(u(r("CreateUidEnum"), 0)) },
        { json: "write_date", js: "write_date", typ: Date },
        { json: "eng_destination", js: "eng_destination", typ: r("EngDestination") },
        { json: "template_name", js: "template_name", typ: r("Template") },
        { json: "basic_salary", js: "basic_salary", typ: 0 },
        { json: "allowance_housing", js: "allowance_housing", typ: 0 },
        { json: "allowance_transportation", js: "allowance_transportation", typ: 0 },
        { json: "allowance_mobile", js: "allowance_mobile", typ: 0 },
        { json: "designation_mandated_amount", js: "designation_mandated_amount", typ: 0 },
        { json: "department_global_id", js: "department_global_id", typ: a(u(r("DepartmentGlobalIDEnum"), 0)) },
        { json: "sector_id", js: "sector_id", typ: a(u(r("SectorIDEnum"), 0)) },
        { json: "message_is_follower", js: "message_is_follower", typ: true },
        { json: "message_partner_ids", js: "message_partner_ids", typ: a(0) },
        { json: "message_channel_ids", js: "message_channel_ids", typ: a("any") },
        { json: "message_unread", js: "message_unread", typ: true },
        { json: "message_unread_counter", js: "message_unread_counter", typ: 0 },
        { json: "message_needaction", js: "message_needaction", typ: true },
        { json: "message_needaction_counter", js: "message_needaction_counter", typ: 0 },
        { json: "display_name", js: "display_name", typ: r("DisplayName") },
        { json: "__last_update", js: "__last_update", typ: Date },
    ], false),
    "CreateUidEnum": [
        "aashehri.uat",
        "Abeer F. Albaker",
        "Albaraa A. Abo Aqeel",
        "hqushaymit.uat",
        "Khaled Alamri",
    ],
    "DepartmentGlobalIDEnum": [
        "خدمات المنشآت / خدمات المنشآت",
    ],
    "DestinationIDEnum": [
        "إلى من يهمه الأمر",
        "البنك الأهلي السعودي",
        "مصرف الإنماء",
        "مصرف الراجحي",
    ],
    "DisplayName": [
        "[1401] حمد بن يوسف القشيميط",
    ],
    "EngDestination": [
        "Alinma Bank",
        "Alrajhi Bank",
        "",
        "Saudi National Bank",
        "To Whom",
    ],
    "ResModel": [
        "salary.identification.request",
    ],
    "SectorIDEnum": [
        "خدمات المنشآت",
    ],
    "State": [
        "done",
        "draft",
    ],
    "Template": [
        "",
        "خطاب تعريف بتفاصيل الراتب",
    ],
    "Type": [
        "nosalary_identification",
        "salary_check",
        "salary_detail",
        "salary_identification",
        "salary_payslip",
        "total_salary",
    ],
};
