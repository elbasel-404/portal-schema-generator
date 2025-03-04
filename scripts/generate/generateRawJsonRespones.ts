import { getFetchHeaders, getFetchUrl, writeResponseToFile } from "../../utils/http";
import endpoints from "../../lib/endpoints.json" with { type: "json" }

interface GenerateJsonResponesArgs {
    rootGenerationPath: string;
}

export const generateRawJsonResponses = async ({rootGenerationPath}: GenerateJsonResponesArgs) => {
    const rawFilesPaths : string[] = [];
    const { headers } = getFetchHeaders();
    endpoints.forEach(async (endpnt) => {
        const { name, method, url, description, detailsRequestBody, listRequestBody } = endpnt;
        // console.log({ description, detailsRequestBody })
        const requestMethod = method as "GET" | "POST";
        const requestUrl = getFetchUrl(url);
        const filePath = `${rootGenerationPath}/${name}/json/raw.json`;
        rawFilesPaths.push(filePath);
        await writeResponseToFile({
            headers,
            url: requestUrl,
            requestBody: listRequestBody,
            method: requestMethod,
            filePath
        })
    })
    return rawFilesPaths;
}


