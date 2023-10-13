import { Type, applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { PageDto } from '../../job-posting/dto';
import { JobPostingWithCompanyEntity } from '../../job-posting/entities';

// https://docs.nestjs.com/openapi/operations#advanced-generic-apiresponse
export const ApiPaginatedResponse = <TModel extends Type<any>>(
  model: TModel,
  description: string,
) => {
  return applyDecorators(
    ApiExtraModels(model),
    ApiOkResponse({
      description,
      schema: {
        allOf: [
          { $ref: getSchemaPath(PageDto) },
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(JobPostingWithCompanyEntity) },
              },
            },
          },
        ],
      },
    }),
  );
};
