import endpointsJson from '../lib/endpoints.json';
const endpointsJsonString = JSON.stringify(endpointsJson);
export const endpoints = JSON.parse(endpointsJsonString);

export { HolidayElementSchema, type HolidayElement } from './holiday/schema';

