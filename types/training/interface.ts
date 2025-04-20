// To parse this data:
//
//   import { Convert } from "./file";
//
//   const training = Convert.toTraining(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface Training {
    id:                             number;
    name:                           string;
    number:                         string;
    date:                           Date;
    date_from:                      Date;
    date_to:                        Date;
    number_of_days:                 number;
    place:                          Array<number | string> | boolean;
    number_place:                   number;
    application_ids:                any[];
    state:                          string;
    reason_to_cancel:               boolean;
    training_center:                string;
    training_center_id:             boolean;
    partner_ids:                    number[];
    type:                           string;
    amount:                         number;
    country_id:                     Array<number | string> | boolean;
    programme_training:             string;
    published:                      boolean;
    attachment_ids:                 number[];
    display_button_candidat_course: boolean;
    city:                           boolean | string;
    currency_id:                    boolean;
    public_ids:                     number[];
    refuse_reason:                  boolean;
    active:                         boolean;
    type_training_activity:         boolean;
    create_employee_id:             Array<number | string>;
    website_message_ids:            any[];
    message_follower_ids:           number[];
    message_ids:                    number[];
    message_last_post:              boolean;
    create_uid:                     Array<number | string>;
    create_date:                    Date;
    write_uid:                      Array<number | string>;
    write_date:                     Date;
    number_participant:             number;
    display_button:                 boolean;
    message_is_follower:            boolean;
    message_partner_ids:            number[];
    message_channel_ids:            any[];
    message_unread:                 boolean;
    message_unread_counter:         number;
    message_needaction:             boolean;
    message_needaction_counter:     number;
    display_name:                   string;
    __last_update:                  Date;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toTraining(json: string): Training[] {
        return cast(JSON.parse(json), a(r("Training")));
    }

    public static trainingToJson(value: Training[]): string {
        return JSON.stringify(uncast(value, a(r("Training"))), null, 2);
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
    "Training": o([
        { json: "id", js: "id", typ: 0 },
        { json: "name", js: "name", typ: "" },
        { json: "number", js: "number", typ: "" },
        { json: "date", js: "date", typ: Date },
        { json: "date_from", js: "date_from", typ: Date },
        { json: "date_to", js: "date_to", typ: Date },
        { json: "number_of_days", js: "number_of_days", typ: 0 },
        { json: "place", js: "place", typ: u(a(u(0, "")), true) },
        { json: "number_place", js: "number_place", typ: 0 },
        { json: "application_ids", js: "application_ids", typ: a("any") },
        { json: "state", js: "state", typ: "" },
        { json: "reason_to_cancel", js: "reason_to_cancel", typ: true },
        { json: "training_center", js: "training_center", typ: "" },
        { json: "training_center_id", js: "training_center_id", typ: true },
        { json: "partner_ids", js: "partner_ids", typ: a(0) },
        { json: "type", js: "type", typ: "" },
        { json: "amount", js: "amount", typ: 0 },
        { json: "country_id", js: "country_id", typ: u(a(u(0, "")), true) },
        { json: "programme_training", js: "programme_training", typ: "" },
        { json: "published", js: "published", typ: true },
        { json: "attachment_ids", js: "attachment_ids", typ: a(0) },
        { json: "display_button_candidat_course", js: "display_button_candidat_course", typ: true },
        { json: "city", js: "city", typ: u(true, "") },
        { json: "currency_id", js: "currency_id", typ: true },
        { json: "public_ids", js: "public_ids", typ: a(0) },
        { json: "refuse_reason", js: "refuse_reason", typ: true },
        { json: "active", js: "active", typ: true },
        { json: "type_training_activity", js: "type_training_activity", typ: true },
        { json: "create_employee_id", js: "create_employee_id", typ: a(u(0, "")) },
        { json: "website_message_ids", js: "website_message_ids", typ: a("any") },
        { json: "message_follower_ids", js: "message_follower_ids", typ: a(0) },
        { json: "message_ids", js: "message_ids", typ: a(0) },
        { json: "message_last_post", js: "message_last_post", typ: true },
        { json: "create_uid", js: "create_uid", typ: a(u(0, "")) },
        { json: "create_date", js: "create_date", typ: Date },
        { json: "write_uid", js: "write_uid", typ: a(u(0, "")) },
        { json: "write_date", js: "write_date", typ: Date },
        { json: "number_participant", js: "number_participant", typ: 0 },
        { json: "display_button", js: "display_button", typ: true },
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
