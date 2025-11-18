import { Pool, PoolClient, QueryResult } from 'pg';
import db from './connection';

export abstract class BaseRepository<T> {
  protected tableName: string;
  protected db: typeof db;

  constructor(tableName: string) {
    this.tableName = tableName;
    this.db = db;
  }

  protected async query<R = T>(
    text: string,
    params?: any[]
  ): Promise<QueryResult<R>> {
    return await this.db.query<R>(text, params);
  }

  protected async queryOne<R = T>(
    text: string,
    params?: any[]
  ): Promise<R | null> {
    const result = await this.query<R>(text, params);
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  protected async queryMany<R = T>(
    text: string,
    params?: any[]
  ): Promise<R[]> {
    const result = await this.query<R>(text, params);
    return result.rows;
  }

  public async findById(id: string): Promise<T | null> {
    const text = `SELECT * FROM ${this.tableName} WHERE id = $1`;
    return await this.queryOne<T>(text, [id]);
  }

  public async findAll(limit: number = 100, offset: number = 0): Promise<T[]> {
    const text = `SELECT * FROM ${this.tableName} LIMIT $1 OFFSET $2`;
    return await this.queryMany<T>(text, [limit, offset]);
  }

  public async delete(id: string): Promise<boolean> {
    const text = `DELETE FROM ${this.tableName} WHERE id = $1`;
    const result = await this.query(text, [id]);
    return (result.rowCount ?? 0) > 0;
  }

  public async count(): Promise<number> {
    const text = `SELECT COUNT(*) as count FROM ${this.tableName}`;
    const result = await this.queryOne<{ count: string }>(text);
    return result ? parseInt(result.count, 10) : 0;
  }
}
