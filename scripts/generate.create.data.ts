// import { writeStringToFile } from "@utils/io";
// import { $ } from "bun";

// export const generateCreateRaw = async ({
//   endpointName,
//   fetchUrl,
//   method,
//   headers,
//   formData,
// }: {
//   endpointName: string;
//   fetchUrl: string;
//   method: string;
//   headers: Headers;
//   formData: FormData;
// }) => {
//   const response = await fetch(fetchUrl, {
//     method,
//     headers,
//     body: formData,
//   });
//   const responseJson = await response.json();
//   const filePath = `./json/${endpointName}/raw.create.json`;
//   const data = JSON.stringify(responseJson, null, 2);

//   await writeStringToFile({ filePath, data });
//   logger.info(filePath);
//   await $`$EDITOR ${filePath}`;
// };

// // Example usage:
// // await generateCreateRaw({
// //   endpointName: ENDPONT_NAME,
// //   fetchUrl: FETCH_URL,
// //   method: METHOD,
// //   headers: HEADERS,
// //   formData: FORM_DATA,
// // });
