// To parse this data:
//
//   import { Convert } from "./file";
//
//   const custody = Convert.toCustody(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface Custody {
    id:                          number;
    name:                        string;
    custody_amount:              number;
    custody_type:                string;
    refuse_reason:               boolean | string;
    cancel_reason:               boolean;
    custody_reason_id:           Array<number | string>;
    custody_reason:              string;
    employee_id:                 Array<number | string>;
    is_have_close_custody:       boolean;
    is_have_replace_custody:     boolean;
    state:                       string;
    hide_payment_order:          boolean;
    payment_order_id:            boolean;
    order_date:                  Date;
    company_id:                  Array<number | string>;
    account_id:                  Array<number | string>;
    journal_id:                  boolean;
    payment_state:               boolean;
    readonly_by_pass:            boolean;
    payment_move_line_ids:       any[];
    check_custody_remain_amount: boolean;
    active:                      boolean;
    res_model:                   string;
    is_from_mobile:              boolean;
    mobile_approvals_ids:        any[];
    website_message_ids:         any[];
    message_follower_ids:        number[];
    message_ids:                 number[];
    message_last_post:           boolean;
    create_uid:                  Array<number | string>;
    create_date:                 Date;
    write_uid:                   Array<number | string>;
    write_date:                  Date;
    number:                      string;
    sector_id:                   Array<number | string>;
    administration_id:           Array<number | string>;
    job_id:                      Array<number | string>;
    degree_id:                   Array<number | string>;
    check_authority_owner:       boolean;
    custody_paid_amount:         number;
    custody_remain_amount:       number;
    bank_id:                     Array<number | string>;
    acc_number:                  string;
    is_dm:                       boolean;
    payments_widget:             string;
    is_action_send:              boolean;
    account_move_number:         string;
    account_move_id:             boolean;
    department_global_id:        Array<number | string>;
    message_is_follower:         boolean;
    message_partner_ids:         number[];
    message_channel_ids:         any[];
    message_unread:              boolean;
    message_unread_counter:      number;
    message_needaction:          boolean;
    message_needaction_counter:  number;
    display_name:                string;
    __last_update:               Date;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toCustody(json: string): Custody[] {
        return cast(JSON.parse(json), a(r("Custody")));
    }

    public static custodyToJson(value: Custody[]): string {
        return JSON.stringify(uncast(value, a(r("Custody"))), null, 2);
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
    "Custody": o([
        { json: "id", js: "id", typ: 0 },
        { json: "name", js: "name", typ: "" },
        { json: "custody_amount", js: "custody_amount", typ: 0 },
        { json: "custody_type", js: "custody_type", typ: "" },
        { json: "refuse_reason", js: "refuse_reason", typ: u(true, "") },
        { json: "cancel_reason", js: "cancel_reason", typ: true },
        { json: "custody_reason_id", js: "custody_reason_id", typ: a(u(0, "")) },
        { json: "custody_reason", js: "custody_reason", typ: "" },
        { json: "employee_id", js: "employee_id", typ: a(u(0, "")) },
        { json: "is_have_close_custody", js: "is_have_close_custody", typ: true },
        { json: "is_have_replace_custody", js: "is_have_replace_custody", typ: true },
        { json: "state", js: "state", typ: "" },
        { json: "hide_payment_order", js: "hide_payment_order", typ: true },
        { json: "payment_order_id", js: "payment_order_id", typ: true },
        { json: "order_date", js: "order_date", typ: Date },
        { json: "company_id", js: "company_id", typ: a(u(0, "")) },
        { json: "account_id", js: "account_id", typ: a(u(0, "")) },
        { json: "journal_id", js: "journal_id", typ: true },
        { json: "payment_state", js: "payment_state", typ: true },
        { json: "readonly_by_pass", js: "readonly_by_pass", typ: true },
        { json: "payment_move_line_ids", js: "payment_move_line_ids", typ: a("any") },
        { json: "check_custody_remain_amount", js: "check_custody_remain_amount", typ: true },
        { json: "active", js: "active", typ: true },
        { json: "res_model", js: "res_model", typ: "" },
        { json: "is_from_mobile", js: "is_from_mobile", typ: true },
        { json: "mobile_approvals_ids", js: "mobile_approvals_ids", typ: a("any") },
        { json: "website_message_ids", js: "website_message_ids", typ: a("any") },
        { json: "message_follower_ids", js: "message_follower_ids", typ: a(0) },
        { json: "message_ids", js: "message_ids", typ: a(0) },
        { json: "message_last_post", js: "message_last_post", typ: true },
        { json: "create_uid", js: "create_uid", typ: a(u(0, "")) },
        { json: "create_date", js: "create_date", typ: Date },
        { json: "write_uid", js: "write_uid", typ: a(u(0, "")) },
        { json: "write_date", js: "write_date", typ: Date },
        { json: "number", js: "number", typ: "" },
        { json: "sector_id", js: "sector_id", typ: a(u(0, "")) },
        { json: "administration_id", js: "administration_id", typ: a(u(0, "")) },
        { json: "job_id", js: "job_id", typ: a(u(0, "")) },
        { json: "degree_id", js: "degree_id", typ: a(u(0, "")) },
        { json: "check_authority_owner", js: "check_authority_owner", typ: true },
        { json: "custody_paid_amount", js: "custody_paid_amount", typ: 0 },
        { json: "custody_remain_amount", js: "custody_remain_amount", typ: 0 },
        { json: "bank_id", js: "bank_id", typ: a(u(0, "")) },
        { json: "acc_number", js: "acc_number", typ: "" },
        { json: "is_dm", js: "is_dm", typ: true },
        { json: "payments_widget", js: "payments_widget", typ: "" },
        { json: "is_action_send", js: "is_action_send", typ: true },
        { json: "account_move_number", js: "account_move_number", typ: "" },
        { json: "account_move_id", js: "account_move_id", typ: true },
        { json: "department_global_id", js: "department_global_id", typ: a(u(0, "")) },
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
};
