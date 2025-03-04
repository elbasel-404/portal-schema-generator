// async function quicktypeJSONSchema(
//   targetLanguage: string,
//   typeName: string,
//   jsonSchemaString: any
// ) {
//   const schemaInput = new JSONSchemaInput(new FetchingJSONSchemaStore());

//   // We could add multiple schemas for multiple types,
//   // but here we're just making one type from JSON schema.
//   await schemaInput.addSource({ name: typeName, schema: jsonSchemaString });

//   const inputData = new InputData();
//   inputData.addInput(schemaInput);

//   return await quicktype({
//     inputData,
//     lang: targetLanguage,
//   });
// }
