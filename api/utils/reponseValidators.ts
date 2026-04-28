import { z } from "zod";
import { ZodSafeParseResult } from "zod";

const CountrySchema = z.object({
  id: z.number(),
  code: z.string(),
  name: z.string(),
});

const sensorParameterSchema = z.object({
  id: z.number(),
  name: z.string(),
  units: z.string(),
  displayName: z.string(),
});
const Sensorchema = z.object({
          id: z.number(),
          name: z.string(),
          parameter: sensorParameterSchema.optional(),

});
const dataTimeSchema = z.object({
  utc: z.string(),
  local: z.string(),
})

const LocationSchema = z.object({
    id: z.number(),
    name: z.string(),
    city: z.string().optional(),
    country: CountrySchema,
    coordinates: z.object({
        latitude: z.number(),
        longitude: z.number(),
    }).nullable(),
    sensors: z.array(Sensorchema).optional(),
    dataTimeFirst: dataTimeSchema.optional(),
    dataTimeLast: dataTimeSchema.optional(),
});


export type Location = z.infer<typeof LocationSchema>;

const LocationsResponseSchema = z.object({
  results: z.array(LocationSchema),
});

export type LocationsResponse = z.infer<typeof LocationsResponseSchema>;

const ErrorResponseSchema = z.object({
  detail: z.array(
    z.object({ msg: z.string() })
  ),
});
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;

function assertSchema<T>(result: ZodSafeParseResult<T>): T {
  if (!result.success) {
    console.error(result.error.issues);
    throw new Error('Schema validation failed');
  }

  return result.data;
}

export function validateErrorResponse(body: unknown) {
  const result = ErrorResponseSchema.safeParse(body);
return assertSchema(result);
}


export function validateLocationsResponse(body: unknown) {
  const result = LocationsResponseSchema.safeParse(body);
return assertSchema(result);
}
