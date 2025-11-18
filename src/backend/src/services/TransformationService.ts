import {
  ArchetectType,
  EnergyStyle,
  FlowMode,
  Season,
  BigFiveTrait,
} from '@archetect/shared/types';
import logger from '../utils/logger';

interface TransformationResult {
  archetectType: ArchetectType;
  energyStyle: EnergyStyle;
  flowMode: FlowMode;
  season: Season;
  strengths: string[];
  challenges: string[];
  workStyle: string;
  communicationStyle: string;
  confidenceScore: number;
}

export class TransformationService {
  /**
   * Transform Big Five trait scores into personality profile
   * This is the primary transformation engine using OCEAN → Archetect Types
   */
  public transformBigFiveData(traits: BigFiveTrait[]): TransformationResult {
    logger.debug('Transforming Big Five data', { traits });

    // Extract trait scores
    const traitMap = new Map(traits.map((t) => [t.trait, t.score]));
    const openness = traitMap.get('openness') || 0.5;
    const conscientiousness = traitMap.get('conscientiousness') || 0.5;
    const extraversion = traitMap.get('extraversion') || 0.5;
    const agreeableness = traitMap.get('agreeableness') || 0.5;
    const neuroticism = traitMap.get('neuroticism') || 0.5;

    // Map to Archetect Type
    const archetectType = this.mapToArchetectType(
      openness,
      conscientiousness,
      extraversion,
      agreeableness,
      neuroticism
    );

    // Determine Energy Style (Spark, Stone, Signal, Current)
    const energyStyle = this.determineEnergyStyle(
      extraversion,
      openness,
      conscientiousness,
      agreeableness,
      neuroticism
    );

    // Determine Flow Mode (Initiator, Keeper, Shifter)
    const flowMode = this.determineFlowMode(
      conscientiousness,
      extraversion,
      openness
    );

    // Determine Season (Build, Explore, Connect, Reset)
    const season = this.determineSeason(openness, extraversion);

    // Generate insights
    const strengths = this.generateStrengths(
      archetectType,
      energyStyle,
      traits
    );
    const challenges = this.generateChallenges(traits);
    const workStyle = this.generateWorkStyle(archetectType, flowMode);
    const communicationStyle = this.generateCommunicationStyle(
      energyStyle,
      agreeableness,
      extraversion
    );

    // Confidence score based on trait clarity
    const confidenceScore = this.calculateConfidence(traits);

    return {
      archetectType,
      energyStyle,
      flowMode,
      season,
      strengths,
      challenges,
      workStyle,
      communicationStyle,
      confidenceScore,
    };
  }

  /**
   * Map Big Five traits to Archetect Type (Trailblazer, Anchor, Bridge, Seer, etc.)
   */
  private mapToArchetectType(
    openness: number,
    conscientiousness: number,
    extraversion: number,
    agreeableness: number,
    neuroticism: number
  ): ArchetectType {
    // Trailblazer - high Openness, high Extraversion
    if (openness > 0.7 && extraversion > 0.7) {
      return 'Maverick';
    }

    // Anchor - high Conscientiousness, low Neuroticism, stable
    if (conscientiousness > 0.7 && neuroticism < 0.4) {
      return 'Architect';
    }

    // Bridge - mid Extraversion, high Agreeableness, connects people
    if (agreeableness > 0.7 && extraversion > 0.4 && extraversion < 0.7 && openness > 0.5) {
      return 'Sage';
    }

    // Seer - high Openness, introverted, reflective
    if (openness > 0.7 && extraversion < 0.5) {
      return 'Sage';
    }

    // Default: determine by dominant trait
    if (openness >= Math.max(conscientiousness, extraversion, agreeableness)) {
      return 'Maverick';
    } else if (conscientiousness >= Math.max(extraversion, agreeableness)) {
      return 'Architect';
    } else {
      return 'Sage';
    }
  }

  /**
   * Determine Energy Style (renamed from astrological elements)
   * - Spark (Fire): High initiative, expressive, risk-tolerant
   * - Stone (Earth): Grounded, structured, dependable
   * - Signal (Air): Idea-driven, analytical, communicative
   * - Current (Water): Emotion-attuned, relational, intuitive
   */
  private determineEnergyStyle(
    extraversion: number,
    openness: number,
    conscientiousness: number,
    agreeableness: number,
    neuroticism: number
  ): EnergyStyle {
    // Spark (Fire-like) - High initiative, expressive
    if (extraversion > 0.6 && openness > 0.6) {
      return 'Energetic';
    }

    // Stone (Earth-like) - Grounded, structured
    if (conscientiousness > 0.6 && neuroticism < 0.5) {
      return 'Focused';
    }

    // Signal (Air-like) - Idea-driven, communicative
    if (openness > 0.6 && extraversion > 0.4 && extraversion < 0.7) {
      return 'Balanced';
    }

    // Current (Water-like) - Emotion-attuned, relational
    if (agreeableness > 0.6 && (neuroticism > 0.5 || extraversion < 0.5)) {
      return 'Balanced';
    }

    return 'Balanced';
  }

  /**
   * Determine Flow Mode (renamed from astrological modalities)
   * - Initiator/Launch (Cardinal): starts things
   * - Keeper/Anchor (Fixed): sustains and maintains
   * - Shifter/Flow (Mutable): adapts and pivots
   */
  private determineFlowMode(
    conscientiousness: number,
    extraversion: number,
    openness: number
  ): FlowMode {
    // Initiator (Cardinal-like) - Starts and organizes
    if (extraversion > 0.6 && conscientiousness > 0.6) {
      return 'Structured';
    }

    // Keeper (Fixed-like) - Sustains and maintains
    if (conscientiousness > 0.6 && openness < 0.6) {
      return 'Deep Work';
    }

    // Shifter (Mutable-like) - Adapts and pivots
    if (openness > 0.6 && conscientiousness > 0.4 && conscientiousness < 0.7) {
      return 'Exploration';
    }

    // Collaborative
    if (extraversion > 0.6) {
      return 'Collaboration';
    }

    return 'Deep Work';
  }

  /**
   * Determine Season (time-bound phases)
   * - Build: structure, execution, career
   * - Explore: ideas, learning, experimentation
   * - Connect: relationships and community
   * - Reset: rest, recovery, reorientation
   */
  private determineSeason(openness: number, extraversion: number): Season {
    // Build Season - structure, execution
    if (extraversion > 0.6 && openness < 0.6) {
      return 'Spring';
    }

    // Explore Season - ideas, learning
    if (openness > 0.7) {
      return 'Summer';
    }

    // Connect Season - relationships
    if (extraversion > 0.7) {
      return 'Autumn';
    }

    // Reset Season - rest, recovery
    return 'Winter';
  }

  private generateStrengths(
    archetectType: ArchetectType,
    energyStyle: EnergyStyle,
    traits: BigFiveTrait[]
  ): string[] {
    const strengths: string[] = [];

    // Type-based strengths
    if (archetectType === 'Architect') {
      strengths.push('Strategic planning', 'System design', 'Reliable execution');
    } else if (archetectType === 'Maverick') {
      strengths.push('Innovation', 'Adaptability', 'Creative problem-solving');
    } else if (archetectType === 'Sage') {
      strengths.push('Knowledge sharing', 'Mentorship', 'Thoughtful analysis');
    }

    // Trait-based strengths
    const traitMap = new Map(traits.map((t) => [t.trait, t.score]));

    if ((traitMap.get('openness') || 0) > 0.7) {
      strengths.push('Open to new ideas', 'Creative thinking');
    }
    if ((traitMap.get('conscientiousness') || 0) > 0.7) {
      strengths.push('Highly organized', 'Dependable');
    }
    if ((traitMap.get('extraversion') || 0) > 0.7) {
      strengths.push('Socially energetic', 'Team collaboration');
    }
    if ((traitMap.get('agreeableness') || 0) > 0.7) {
      strengths.push('Empathetic', 'Cooperative');
    }
    if ((traitMap.get('neuroticism') || 0) < 0.4) {
      strengths.push('Emotionally stable', 'Calm under pressure');
    }

    return strengths.slice(0, 6);
  }

  private generateChallenges(traits: BigFiveTrait[]): string[] {
    const challenges: string[] = [];
    const traitMap = new Map(traits.map((t) => [t.trait, t.score]));

    if ((traitMap.get('conscientiousness') || 0) < 0.4) {
      challenges.push('May struggle with organization and planning');
    }
    if ((traitMap.get('extraversion') || 0) < 0.3) {
      challenges.push('Prefers solitary work, may avoid social situations');
    }
    if ((traitMap.get('agreeableness') || 0) < 0.4) {
      challenges.push('Can be overly skeptical or critical');
    }
    if ((traitMap.get('neuroticism') || 0) > 0.7) {
      challenges.push('Sensitive to stress and criticism');
    }
    if ((traitMap.get('openness') || 0) < 0.3) {
      challenges.push('May resist change and new approaches');
    }

    return challenges.slice(0, 4);
  }

  private generateWorkStyle(archetectType: ArchetectType, flowMode: FlowMode): string {
    if (archetectType === 'Architect') {
      return 'Prefers structured environments with clear goals and strategic challenges. Works best with autonomy and well-defined processes.';
    } else if (archetectType === 'Maverick') {
      return 'Thrives in dynamic, creative environments with room for experimentation. Enjoys exploring new approaches and taking calculated risks.';
    } else if (archetectType === 'Sage') {
      return 'Works best in thoughtful, collaborative settings with opportunities to mentor and share knowledge. Values depth over speed.';
    }

    return 'Adaptable work style that adjusts to team and project needs.';
  }

  private generateCommunicationStyle(
    energyStyle: EnergyStyle,
    agreeableness: number,
    extraversion: number
  ): string {
    if (energyStyle === 'Energetic' && extraversion > 0.7) {
      return 'Enthusiastic and expressive. Prefers face-to-face conversations and brainstorming sessions.';
    } else if (energyStyle === 'Focused') {
      return 'Thoughtful and deliberate. Prefers written communication and time to process information.';
    } else if (agreeableness > 0.7) {
      return 'Warm and empathetic. Focuses on building relationships and understanding others\' perspectives.';
    }

    return 'Balanced communication style that adapts to context and audience.';
  }

  private calculateConfidence(traits: BigFiveTrait[]): number {
    // Higher variance in trait scores = more distinct profile = higher confidence
    const scores = traits.map((t) => t.score);
    const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
    const variance =
      scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) /
      scores.length;

    // Normalize confidence (higher variance = higher confidence, but cap it)
    const confidence = Math.min(0.7 + variance, 0.95);
    return Math.round(confidence * 100) / 100;
  }
}

export const transformationService = new TransformationService();
