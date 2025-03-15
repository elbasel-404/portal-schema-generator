// import { writeStringToFile } from "@utils/io";
// import { $ } from "bun";

// const JSON_DIR = "./json";

// const ENDPONT_NAME = "holiday";
// const FETCH_URL = "http://10.60.55.21/api/po/hr/holidays/request/create";
// const METHOD = "POST";
// const HEADERS = new Headers();
// HEADERS.append("Authorization", "Bearer gVSMSlFBnAZHw2YSS5rSK4l2KHyQqN");
// HEADERS.append("x-api-key", "85ced9c9-b64b-4d76-85a5-ae3b869b044d");
// HEADERS.append("Cookie", "session_id=74ed658d9138c7acacf52dfe637bf46dbd928a53");
// // ! Do not include Content-Type header when using FormData
// // HEADERS.append("Content-Type", "multipart/form-data");

// const FORM_DATA = new FormData();
// FORM_DATA.append("employee_id", "21");
// FORM_DATA.append("holiday_status_id", "5");
// FORM_DATA.append("date_from", "2025-05-01");
// FORM_DATA.append("date_to", "2025-05-01");
// FORM_DATA.append("substitute_employee_id", "10");
// FORM_DATA.append("notes", "test from api");

// const FETCH_CONFIG = {
//   method: METHOD,
//   headers: HEADERS,
//   body: FORM_DATA,
// };

// const response = await fetch(FETCH_URL, FETCH_CONFIG);
// const responseJson = await response.json();
// const filePath = `${JSON_DIR}/${ENDPONT_NAME}/raw.create.json`;
// const data = JSON.stringify(responseJson, null, 2);
// await writeStringToFile({
//   filePath,
//   data,
// });
// logger.info(filePath);
// await $`$EDITOR ${filePath}`;
