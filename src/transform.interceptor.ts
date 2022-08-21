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
        if (Array.isArray(data)) {
          return { [pluralModelName]: data };
        }

        return { [modelName]: data };
      }),
    );
  }
}
