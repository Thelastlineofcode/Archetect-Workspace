import { Profile, ArchetectType, EnergyStyle, FlowMode } from '@archetect/shared/types';
import { profileRepository } from '../db/repositories';
import { NotFoundError } from '../middleware/errorHandler';
import logger from '../utils/logger';

interface CompatibilityResult {
  profile1Id: string;
  profile2Id: string;
  compatibilityScore: number; // 0-1
  archetypeCompatibility: number;
  energyCompatibility: number;
  flowCompatibility: number;
  complementarity: string;
  workingStyle: string;
  communicationTips: string[];
  potentialChallenges: string[];
  strengths: string[];
}

export class CompatibilityService {
  /**
   * Calculate compatibility between two profiles
   */
  public async calculateCompatibility(
    profile1Id: string,
    profile2Id: string
  ): Promise<CompatibilityResult> {
    logger.debug('Calculating compatibility', { profile1Id, profile2Id });

    // Get both profiles
    const profile1 = await profileRepository.findById(profile1Id);
    const profile2 = await profileRepository.findById(profile2Id);

    if (!profile1) {
      throw new NotFoundError(`Profile ${profile1Id} not found`);
    }
    if (!profile2) {
      throw new NotFoundError(`Profile ${profile2Id} not found`);
    }

    // Calculate compatibility scores
    const archetypeCompatibility = this.calculateArchetypeCompatibility(
      profile1.archetectType!,
      profile2.archetectType!
    );

    const energyCompatibility = this.calculateEnergyCompatibility(
      profile1.energyStyle!,
      profile2.energyStyle!
    );

    const flowCompatibility = this.calculateFlowCompatibility(
      profile1.flowMode!,
      profile2.flowMode!
    );

    // Overall compatibility (weighted average)
    const compatibilityScore =
      archetypeCompatibility * 0.4 +
      energyCompatibility * 0.3 +
      flowCompatibility * 0.3;

    // Generate insights
    const complementarity = this.determineComplementarity(
      profile1.archetectType!,
      profile2.archetectType!
    );

    const workingStyle = this.generateWorkingStyle(
      profile1.archetectType!,
      profile2.archetectType!,
      profile1.flowMode!,
      profile2.flowMode!
    );

    const communicationTips = this.generateCommunicationTips(
      profile1.energyStyle!,
      profile2.energyStyle!,
      profile1.archetectType!,
      profile2.archetectType!
    );

    const potentialChallenges = this.identifyPotentialChallenges(
      profile1,
      profile2
    );

    const strengths = this.identifyTeamStrengths(profile1, profile2);

    return {
      profile1Id,
      profile2Id,
      compatibilityScore: Math.round(compatibilityScore * 100) / 100,
      archetypeCompatibility: Math.round(archetypeCompatibility * 100) / 100,
      energyCompatibility: Math.round(energyCompatibility * 100) / 100,
      flowCompatibility: Math.round(flowCompatibility * 100) / 100,
      complementarity,
      workingStyle,
      communicationTips,
      potentialChallenges,
      strengths,
    };
  }

  /**
   * Calculate team compatibility for multiple members
   */
  public async calculateTeamCompatibility(
    profileIds: string[]
  ): Promise<{
    averageCompatibility: number;
    pairwiseScores: CompatibilityResult[];
    teamDynamics: string;
    recommendations: string[];
  }> {
    if (profileIds.length < 2) {
      throw new Error('At least 2 profiles required for team compatibility');
    }

    // Calculate all pairwise compatibilities
    const pairwiseScores: CompatibilityResult[] = [];

    for (let i = 0; i < profileIds.length; i++) {
      for (let j = i + 1; j < profileIds.length; j++) {
        const compatibility = await this.calculateCompatibility(
          profileIds[i],
          profileIds[j]
        );
        pairwiseScores.push(compatibility);
      }
    }

    // Calculate average compatibility
    const averageCompatibility =
      pairwiseScores.reduce((sum, c) => sum + c.compatibilityScore, 0) /
      pairwiseScores.length;

    // Generate team dynamics summary
    const teamDynamics = this.generateTeamDynamics(pairwiseScores);

    // Generate recommendations
    const recommendations = this.generateTeamRecommendations(pairwiseScores);

    return {
      averageCompatibility: Math.round(averageCompatibility * 100) / 100,
      pairwiseScores,
      teamDynamics,
      recommendations,
    };
  }

  // Private helper methods

  private calculateArchetypeCompatibility(
    type1: ArchetectType,
    type2: ArchetectType
  ): number {
    // Compatibility matrix for Archetect Types
    const compatibilityMatrix: Record<ArchetectType, Record<ArchetectType, number>> = {
      Architect: {
        Architect: 0.7, // Good, but may compete
        Maverick: 0.85, // Great complementarity
        Sage: 0.9, // Excellent balance
      },
      Maverick: {
        Architect: 0.85, // Great complementarity
        Maverick: 0.6, // Good, but may clash on direction
        Sage: 0.75, // Good balance
      },
      Sage: {
        Architect: 0.9, // Excellent balance
        Maverick: 0.75, // Good balance
        Sage: 0.8, // Good collaboration
      },
    };

    return compatibilityMatrix[type1][type2];
  }

  private calculateEnergyCompatibility(
    energy1: EnergyStyle,
    energy2: EnergyStyle
  ): number {
    // Similar energy styles work well together
    if (energy1 === energy2) {
      return 0.85;
    }

    // Energetic + Focused can be challenging
    if (
      (energy1 === 'Energetic' && energy2 === 'Focused') ||
      (energy1 === 'Focused' && energy2 === 'Energetic')
    ) {
      return 0.6;
    }

    // Balanced works well with everyone
    if (energy1 === 'Balanced' || energy2 === 'Balanced') {
      return 0.8;
    }

    return 0.75;
  }

  private calculateFlowCompatibility(flow1: FlowMode, flow2: FlowMode): number {
    // Complementary flow modes work well
    const flowCompatibility: Record<FlowMode, Record<FlowMode, number>> = {
      Structured: {
        Structured: 0.75,
        'Deep Work': 0.8,
        Exploration: 0.7,
        Collaboration: 0.85,
      },
      'Deep Work': {
        Structured: 0.8,
        'Deep Work': 0.7,
        Exploration: 0.75,
        Collaboration: 0.65,
      },
      Exploration: {
        Structured: 0.7,
        'Deep Work': 0.75,
        Exploration: 0.8,
        Collaboration: 0.9,
      },
      Collaboration: {
        Structured: 0.85,
        'Deep Work': 0.65,
        Exploration: 0.9,
        Collaboration: 0.85,
      },
    };

    return flowCompatibility[flow1][flow2];
  }

  private determineComplementarity(
    type1: ArchetectType,
    type2: ArchetectType
  ): string {
    if (type1 === 'Architect' && type2 === 'Maverick') {
      return 'Highly Complementary - Structure meets Innovation';
    } else if (type1 === 'Architect' && type2 === 'Sage') {
      return 'Balanced Partnership - Strategy meets Wisdom';
    } else if (type1 === 'Maverick' && type2 === 'Sage') {
      return 'Dynamic Balance - Innovation meets Reflection';
    } else if (type1 === type2) {
      return 'Similar Approaches - May need external perspective';
    }
    return 'Complementary Strengths';
  }

  private generateWorkingStyle(
    type1: ArchetectType,
    type2: ArchetectType,
    flow1: FlowMode,
    flow2: FlowMode
  ): string {
    if (type1 === 'Architect' && type2 === 'Maverick') {
      return 'Best for projects needing both systematic planning and creative problem-solving. Architect provides structure while Maverick explores innovative approaches.';
    } else if (type1 === 'Sage' || type2 === 'Sage') {
      return 'Thoughtful collaboration with emphasis on knowledge sharing and mentorship. Works well for complex problems requiring deep analysis.';
    } else if (flow1 === 'Collaboration' && flow2 === 'Collaboration') {
      return 'Highly collaborative team that thrives on brainstorming and group problem-solving.';
    }
    return 'Adaptable working style that leverages both team members\' strengths.';
  }

  private generateCommunicationTips(
    energy1: EnergyStyle,
    energy2: EnergyStyle,
    type1: ArchetectType,
    type2: ArchetectType
  ): string[] {
    const tips: string[] = [];

    if (energy1 === 'Energetic' && energy2 === 'Focused') {
      tips.push('Energetic member: Give Focused partner time to process before expecting decisions');
      tips.push('Focused member: Speak up early to avoid feeling steamrolled by faster pace');
    }

    if (type1 === 'Architect' || type2 === 'Architect') {
      tips.push('Present ideas with clear structure and strategic rationale');
    }

    if (type1 === 'Maverick' || type2 === 'Maverick') {
      tips.push('Allow space for creative exploration and unconventional approaches');
    }

    if (type1 === 'Sage' || type2 === 'Sage') {
      tips.push('Value depth over speed in discussions - allow time for thorough analysis');
    }

    if (tips.length === 0) {
      tips.push('Maintain open communication and respect each other\'s working styles');
    }

    return tips;
  }

  private identifyPotentialChallenges(
    profile1: Profile,
    profile2: Profile
  ): string[] {
    const challenges: string[] = [];

    // Energy mismatch
    if (
      (profile1.energyStyle === 'Energetic' && profile2.energyStyle === 'Focused') ||
      (profile1.energyStyle === 'Focused' && profile2.energyStyle === 'Energetic')
    ) {
      challenges.push('Pace difference - one prefers fast action, other prefers deliberation');
    }

    // Same archetype challenges
    if (profile1.archetectType === profile2.archetectType) {
      if (profile1.archetectType === 'Architect') {
        challenges.push('May compete over strategic direction and control');
      } else if (profile1.archetectType === 'Maverick') {
        challenges.push('May lack follow-through - too many ideas, not enough execution');
      }
    }

    // Flow mode conflicts
    if (profile1.flowMode === 'Deep Work' && profile2.flowMode === 'Collaboration') {
      challenges.push('Work style conflict - one prefers solitude, other thrives in groups');
    }

    if (challenges.length === 0) {
      challenges.push('No major compatibility challenges identified');
    }

    return challenges;
  }

  private identifyTeamStrengths(profile1: Profile, profile2: Profile): string[] {
    const strengths: string[] = [];

    // Complementary archetypes
    if (
      (profile1.archetectType === 'Architect' && profile2.archetectType === 'Maverick') ||
      (profile1.archetectType === 'Maverick' && profile2.archetectType === 'Architect')
    ) {
      strengths.push('Balanced innovation and execution');
      strengths.push('Strategic thinking + creative problem-solving');
    }

    if (profile1.archetectType === 'Sage' || profile2.archetectType === 'Sage') {
      strengths.push('Deep analytical capability and wisdom');
      strengths.push('Strong mentorship and knowledge sharing');
    }

    // Energy complementarity
    if (profile1.energyStyle === 'Balanced' || profile2.energyStyle === 'Balanced') {
      strengths.push('Adaptable team dynamics');
    }

    // Flow complementarity
    if (
      (profile1.flowMode === 'Structured' && profile2.flowMode === 'Exploration') ||
      (profile1.flowMode === 'Exploration' && profile2.flowMode === 'Structured')
    ) {
      strengths.push('Balance between planning and adaptability');
    }

    return strengths;
  }

  private generateTeamDynamics(pairwiseScores: CompatibilityResult[]): string {
    const avgScore =
      pairwiseScores.reduce((sum, c) => sum + c.compatibilityScore, 0) /
      pairwiseScores.length;

    if (avgScore > 0.8) {
      return 'Highly cohesive team with strong compatibility across all pairs. Expect smooth collaboration and mutual understanding.';
    } else if (avgScore > 0.7) {
      return 'Well-balanced team with good overall compatibility. Minor adjustments may enhance collaboration.';
    } else if (avgScore > 0.6) {
      return 'Moderate team compatibility. Some pairs may need extra attention to communication and working styles.';
    } else {
      return 'Diverse team with varying compatibility. Will benefit from explicit discussion of working preferences and communication protocols.';
    }
  }

  private generateTeamRecommendations(
    pairwiseScores: CompatibilityResult[]
  ): string[] {
    const recommendations: string[] = [];

    // Find lowest compatibility score
    const lowestScore = Math.min(...pairwiseScores.map((c) => c.compatibilityScore));

    if (lowestScore < 0.7) {
      recommendations.push(
        'Schedule 1-on-1s between lower-compatibility pairs to align on working preferences'
      );
    }

    // Check for energy diversity
    const energyTypes = new Set(
      pairwiseScores.flatMap((c) => [
        c.communicationTips.some((t) => t.includes('Energetic')),
        c.communicationTips.some((t) => t.includes('Focused')),
      ])
    );

    if (energyTypes.size > 1) {
      recommendations.push(
        'Establish clear norms around meeting pace and decision-making timelines'
      );
    }

    // General recommendations
    recommendations.push('Hold regular retrospectives to discuss team dynamics');
    recommendations.push(
      'Celebrate different working styles as team strengths, not obstacles'
    );

    return recommendations;
  }
}

export const compatibilityService = new CompatibilityService();
