import { BaseRepository } from '../BaseRepository';
import { User, SubscriptionTier, OAuthProvider } from '@archetect/shared/types';
import bcrypt from 'bcrypt';

interface CreateUserParams {
  email: string;
  passwordHash?: string;
  fullName: string;
  oauthProvider?: OAuthProvider;
  oauthId?: string;
  subscriptionTier?: SubscriptionTier;
}

interface UpdateUserParams {
  email?: string;
  fullName?: string;
  subscriptionTier?: SubscriptionTier;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
}

export class UserRepository extends BaseRepository<User> {
  constructor() {
    super('users');
  }

  public async create(params: CreateUserParams): Promise<User> {
    const {
      email,
      passwordHash,
      fullName,
      oauthProvider,
      oauthId,
      subscriptionTier = 'free',
    } = params;

    const text = `
      INSERT INTO users (
        email,
        password_hash,
        full_name,
        oauth_provider,
        oauth_id,
        subscription_tier
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;

    const values = [
      email,
      passwordHash,
      fullName,
      oauthProvider,
      oauthId,
      subscriptionTier,
    ];

    return await this.queryOne<User>(text, values) as User;
  }

  public async findByEmail(email: string): Promise<User | null> {
    const text = `SELECT * FROM ${this.tableName} WHERE email = $1`;
    return await this.queryOne<User>(text, [email]);
  }

  public async findByOAuth(
    provider: OAuthProvider,
    oauthId: string
  ): Promise<User | null> {
    const text = `
      SELECT * FROM ${this.tableName}
      WHERE oauth_provider = $1 AND oauth_id = $2
    `;
    return await this.queryOne<User>(text, [provider, oauthId]);
  }

  public async update(id: string, params: UpdateUserParams): Promise<User | null> {
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (params.email !== undefined) {
      updates.push(`email = $${paramIndex++}`);
      values.push(params.email);
    }
    if (params.fullName !== undefined) {
      updates.push(`full_name = $${paramIndex++}`);
      values.push(params.fullName);
    }
    if (params.subscriptionTier !== undefined) {
      updates.push(`subscription_tier = $${paramIndex++}`);
      values.push(params.subscriptionTier);
    }
    if (params.stripeCustomerId !== undefined) {
      updates.push(`stripe_customer_id = $${paramIndex++}`);
      values.push(params.stripeCustomerId);
    }
    if (params.stripeSubscriptionId !== undefined) {
      updates.push(`stripe_subscription_id = $${paramIndex++}`);
      values.push(params.stripeSubscriptionId);
    }

    if (updates.length === 0) {
      return await this.findById(id);
    }

    updates.push(`updated_at = NOW()`);
    values.push(id);

    const text = `
      UPDATE ${this.tableName}
      SET ${updates.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    return await this.queryOne<User>(text, values);
  }

  public async updatePassword(id: string, newPassword: string): Promise<boolean> {
    const passwordHash = await bcrypt.hash(newPassword, 10);
    const text = `
      UPDATE ${this.tableName}
      SET password_hash = $1, updated_at = NOW()
      WHERE id = $2
    `;
    const result = await this.query(text, [passwordHash, id]);
    return (result.rowCount ?? 0) > 0;
  }

  public async verifyPassword(email: string, password: string): Promise<User | null> {
    const user = await this.findByEmail(email);
    if (!user || !user.passwordHash) {
      return null;
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    return isValid ? user : null;
  }

  public async updateLastLogin(id: string): Promise<void> {
    const text = `
      UPDATE ${this.tableName}
      SET last_login_at = NOW(), updated_at = NOW()
      WHERE id = $1
    `;
    await this.query(text, [id]);
  }

  public async countBySubscriptionTier(tier: SubscriptionTier): Promise<number> {
    const text = `
      SELECT COUNT(*) as count FROM ${this.tableName}
      WHERE subscription_tier = $1
    `;
    const result = await this.queryOne<{ count: string }>(text, [tier]);
    return result ? parseInt(result.count, 10) : 0;
  }
}

export const userRepository = new UserRepository();
