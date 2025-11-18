import { BaseRepository } from '../BaseRepository';

interface RefreshToken {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
}

export class RefreshTokenRepository extends BaseRepository<RefreshToken> {
  constructor() {
    super('refresh_tokens');
  }

  public async create(userId: string, token: string, expiresAt: Date): Promise<RefreshToken> {
    const text = `
      INSERT INTO ${this.tableName} (user_id, token, expires_at)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    return (await this.queryOne<RefreshToken>(text, [userId, token, expiresAt])) as RefreshToken;
  }

  public async findByToken(token: string): Promise<RefreshToken | null> {
    const text = `
      SELECT * FROM ${this.tableName}
      WHERE token = $1 AND expires_at > NOW()
    `;
    return await this.queryOne<RefreshToken>(text, [token]);
  }

  public async findByUserId(userId: string): Promise<RefreshToken[]> {
    const text = `
      SELECT * FROM ${this.tableName}
      WHERE user_id = $1 AND expires_at > NOW()
      ORDER BY created_at DESC
    `;
    return await this.queryMany<RefreshToken>(text, [userId]);
  }

  public async deleteByToken(token: string): Promise<boolean> {
    const text = `DELETE FROM ${this.tableName} WHERE token = $1`;
    const result = await this.query(text, [token]);
    return (result.rowCount ?? 0) > 0;
  }

  public async deleteByUserId(userId: string): Promise<boolean> {
    const text = `DELETE FROM ${this.tableName} WHERE user_id = $1`;
    const result = await this.query(text, [userId]);
    return (result.rowCount ?? 0) > 0;
  }

  public async deleteExpired(): Promise<number> {
    const text = `DELETE FROM ${this.tableName} WHERE expires_at <= NOW()`;
    const result = await this.query(text);
    return result.rowCount ?? 0;
  }
}

export const refreshTokenRepository = new RefreshTokenRepository();
