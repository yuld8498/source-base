import { DeepPartial, FindManyOptions, FindOptionsWhere } from 'typeorm';

export abstract class BaseService<T> {
  abstract create(data: DeepPartial<T>): Promise<T>;
  abstract findAll(options?: FindManyOptions<T>): Promise<T[]>;
  abstract findOneById(id: any): Promise<T>;
  abstract findOneBy(where: FindOptionsWhere<T>): Promise<T | null>;
  abstract update(id: any, data: Partial<T>): Promise<void>;
  abstract delete(id: any): Promise<void>;
}
