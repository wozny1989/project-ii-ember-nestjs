import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import pluralize = require('pluralize');

export interface Response<T> {
  [pluralModelKey: string]: {
    data: T;
  };
}

const getModelName = (
  context: ExecutionContext,
): { modelName: string; pluralModelName: string } => {
  const pluralModelName = context
    .getClass()
    .name.replace('Controller', '')
    .toLowerCase();

  const modelName = pluralize.singular(pluralModelName);
  return { modelName, pluralModelName };
};

const replaceRelationshipKeys = (data: object) => {
  if (Array.isArray(data)) {
    data.map((object, index) => {
      _replace(object, data, index);
    });

    return;
  }

  _replace(data, data);

  function _replace(object: any, data: any, index?: number) {
    Object.keys(object).map((key: any) => {
      const isBelongsToKey = key.endsWith('Id');
      const isHasManyKey = key.endsWith('Ids');
      const isRelationshipKey = isBelongsToKey || isHasManyKey;

      if (isRelationshipKey) {
        const newKeyWithoutSuffix: any = isBelongsToKey
          ? key.slice(0, -2)
          : key.slice(0, -3);

        if (index === undefined) {
          data[newKeyWithoutSuffix] = data[key];
          delete data[key];
          return;
        }

        data[index][newKeyWithoutSuffix] = data[index][key];
        delete data[index][key];
      }
    });
  }
};

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const { pluralModelName, modelName } = getModelName(context);
    const [IncomingMessage] = context.getArgs();
    const payload =
      IncomingMessage.body[pluralModelName] || IncomingMessage.body[modelName];

    IncomingMessage.body = payload;

    return next.handle().pipe(
      map((data) => {
        replaceRelationshipKeys(data);
        if (Array.isArray(data)) {
          return { [pluralModelName]: data };
        }

        return { [modelName]: data };
      }),
    );
  }
}
