import { Injectable } from '@nestjs/common';
import _ from 'lodash';
import { Filter } from '../interfaces/query.dto';
import { FindManyOptions } from 'typeorm/find-options/FindManyOptions';

@Injectable()
export class RepoUtil {
  findManyArgs<T extends any>(params: Record<string, any>): FindManyOptions<T> {
    const whereArgs = {};
    const orderByArgs = {};

    const filter = (params['filter'] || {}) as Filter;
    const orderBy = params['orderBy'] || {};

    Object.keys(orderBy).forEach((v) => {
      orderByArgs[v] = orderBy[v];
    });

    Object.keys(filter).forEach((v) => {
      const filterOne = filter[v];
      if (!whereArgs[v]) {
        whereArgs[v] = {};
      }

      if (_.isPlainObject(filterOne)) {
        // 如果是对象，表示关联查询
        Object.keys(filterOne).forEach((v2) => {
          const filterTwo = filterOne[v2];
          if (typeof filterTwo !== 'undefined') {
            whereArgs[v][v2]['contains'] = filterOne[v2];
          }
        });
      } else {
        const value = filterOne[v];
        if (typeof value !== 'undefined') {
          whereArgs[v]['contains'] = filter[v];
        }
      }
    });

    return {
      where: whereArgs,
      order: orderByArgs,
    };
  }

  pagination(params: { page?: number; pageSize?: number }) {
    const { page = 1, pageSize = 10 } = params;
    const skip = (page - 1) * pageSize;
    const take = pageSize;
    return { skip, take };
  }
}
