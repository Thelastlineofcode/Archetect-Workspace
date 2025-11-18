import { BaseRepository } from '../BaseRepository';
import {
  Profile,
  ProfileApproach,
  DISCType,
  ArchetectType,
  EnergyStyle,
  FlowMode,
  Season,
  Zodiac,
  Nakshatra,
  BigFiveTrait,
} from '@archetect/shared/types';

interface CreateProfileParams {
  userId: string;
  approach: ProfileApproach;
  discType: DISCType;
  archetectType: ArchetectType;
  energyStyle: EnergyStyle;
  flowMode: FlowMode;
  season: Season;
  bigFiveTraits?: BigFiveTrait[];
  birthData?: {
    date: string;
    time: string;
    latitude: number;
    longitude: number;
    timezone: string;
  };
  siderealData?: {
    sunSign: Zodiac;
    moonSign: Zodiac;
    ascendant: Zodiac;
    mercury: Zodiac;
    nakshatra: Nakshatra;
  };
  strengths?: string[];
  challenges?: string[];
  workStyle?: string;
  communicationStyle?: string;
  confidenceScore?: number;
}

interface UpdateProfileParams {
  discType?: DISCType;
  archetectType?: ArchetectType;
  energyStyle?: EnergyStyle;
  flowMode?: FlowMode;
  season?: Season;
  bigFiveTraits?: BigFiveTrait[];
  strengths?: string[];
  challenges?: string[];
  workStyle?: string;
  communicationStyle?: string;
  confidenceScore?: number;
}

export class ProfileRepository extends BaseRepository<Profile> {
  constructor() {
    super('profiles');
  }

  public async create(params: CreateProfileParams): Promise<Profile> {
    const {
      userId,
      approach,
      discType,
      archetectType,
      energyStyle,
      flowMode,
      season,
      bigFiveTraits,
      birthData,
      siderealData,
      strengths,
      challenges,
      workStyle,
      communicationStyle,
      confidenceScore,
    } = params;

    const text = `
      INSERT INTO profiles (
        user_id,
        approach,
        disc_type,
        archetect_type,
        energy_style,
        flow_mode,
        season,
        big_five_traits,
        birth_date,
        birth_time,
        birth_latitude,
        birth_longitude,
        birth_timezone,
        sidereal_sun_sign,
        sidereal_moon_sign,
        sidereal_ascendant,
        sidereal_mercury,
        sidereal_nakshatra,
        strengths,
        challenges,
        work_style,
        communication_style,
        confidence_score
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23)
      RETURNING *
    `;

    const values = [
      userId,
      approach,
      discType,
      archetectType,
      energyStyle,
      flowMode,
      season,
      bigFiveTraits ? JSON.stringify(bigFiveTraits) : null,
      birthData?.date,
      birthData?.time,
      birthData?.latitude,
      birthData?.longitude,
      birthData?.timezone,
      siderealData?.sunSign,
      siderealData?.moonSign,
      siderealData?.ascendant,
      siderealData?.mercury,
      siderealData?.nakshatra,
      strengths,
      challenges,
      workStyle,
      communicationStyle,
      confidenceScore,
    ];

    return (await this.queryOne<Profile>(text, values)) as Profile;
  }

  public async findByUserId(userId: string): Promise<Profile | null> {
    const text = `SELECT * FROM ${this.tableName} WHERE user_id = $1`;
    return await this.queryOne<Profile>(text, [userId]);
  }

  public async findByApproach(approach: ProfileApproach): Promise<Profile[]> {
    const text = `SELECT * FROM ${this.tableName} WHERE approach = $1`;
    return await this.queryMany<Profile>(text, [approach]);
  }

  public async findByDISCType(discType: DISCType): Promise<Profile[]> {
    const text = `SELECT * FROM ${this.tableName} WHERE disc_type = $1`;
    return await this.queryMany<Profile>(text, [discType]);
  }

  public async findByArchetectType(
    archetectType: ArchetectType
  ): Promise<Profile[]> {
    const text = `SELECT * FROM ${this.tableName} WHERE archetect_type = $1`;
    return await this.queryMany<Profile>(text, [archetectType]);
  }

  public async update(
    id: string,
    params: UpdateProfileParams
  ): Promise<Profile | null> {
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (params.discType !== undefined) {
      updates.push(`disc_type = $${paramIndex++}`);
      values.push(params.discType);
    }
    if (params.archetectType !== undefined) {
      updates.push(`archetect_type = $${paramIndex++}`);
      values.push(params.archetectType);
    }
    if (params.energyStyle !== undefined) {
      updates.push(`energy_style = $${paramIndex++}`);
      values.push(params.energyStyle);
    }
    if (params.flowMode !== undefined) {
      updates.push(`flow_mode = $${paramIndex++}`);
      values.push(params.flowMode);
    }
    if (params.season !== undefined) {
      updates.push(`season = $${paramIndex++}`);
      values.push(params.season);
    }
    if (params.bigFiveTraits !== undefined) {
      updates.push(`big_five_traits = $${paramIndex++}`);
      values.push(JSON.stringify(params.bigFiveTraits));
    }
    if (params.strengths !== undefined) {
      updates.push(`strengths = $${paramIndex++}`);
      values.push(params.strengths);
    }
    if (params.challenges !== undefined) {
      updates.push(`challenges = $${paramIndex++}`);
      values.push(params.challenges);
    }
    if (params.workStyle !== undefined) {
      updates.push(`work_style = $${paramIndex++}`);
      values.push(params.workStyle);
    }
    if (params.communicationStyle !== undefined) {
      updates.push(`communication_style = $${paramIndex++}`);
      values.push(params.communicationStyle);
    }
    if (params.confidenceScore !== undefined) {
      updates.push(`confidence_score = $${paramIndex++}`);
      values.push(params.confidenceScore);
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

    return await this.queryOne<Profile>(text, values);
  }

  public async deleteByUserId(userId: string): Promise<boolean> {
    const text = `DELETE FROM ${this.tableName} WHERE user_id = $1`;
    const result = await this.query(text, [userId]);
    return (result.rowCount ?? 0) > 0;
  }

  public async countByApproach(approach: ProfileApproach): Promise<number> {
    const text = `
      SELECT COUNT(*) as count FROM ${this.tableName}
      WHERE approach = $1
    `;
    const result = await this.queryOne<{ count: string }>(text, [approach]);
    return result ? parseInt(result.count, 10) : 0;
  }

  public async getProfileWithUser(profileId: string): Promise<any | null> {
    const text = `
      SELECT
        p.*,
        u.email,
        u.full_name,
        u.subscription_tier
      FROM ${this.tableName} p
      INNER JOIN users u ON p.user_id = u.id
      WHERE p.id = $1
    `;
    return await this.queryOne(text, [profileId]);
  }
}

export const profileRepository = new ProfileRepository();
