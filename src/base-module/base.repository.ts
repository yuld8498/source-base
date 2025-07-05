import {
  Repository,
  DeepPartial,
  FindOptionsWhere,
  FindManyOptions,
} from 'typeorm';
import { Injectable } from '@nestjs/common';
import { DataSource, EntityTarget } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

@Injectable()
export class BaseRepository<T> {
  private repository: Repository<T>;

  constructor(
    private dataSource: DataSource,
    entity: EntityTarget<T>
  ) {
    this.repository = this.dataSource.getRepository(entity);
  }

  async create(data: DeepPartial<T>): Promise<T> {
    const entity = this.repository.create(data);
    return await this.repository.save(entity);
  }

  async findAll(options?: FindManyOptions<T>): Promise<T[]> {
    return await this.repository.find(options);
  }

  async findById(id: any): Promise<T | null> {
    return await this.repository.findOneById(id);
  }

  async findOneBy(where: FindOptionsWhere<T>): Promise<T | null> {
    return await this.repository.findOneBy(where);
  }

  async update(id: any, data: QueryDeepPartialEntity<T>): Promise<void> {
    await this.repository.update(id, data);
  }

  async delete(id: any): Promise<void> {
    await this.repository.delete(id);
  }

  getRepository(): Repository<T> {
    return this.repository;
  }
}
