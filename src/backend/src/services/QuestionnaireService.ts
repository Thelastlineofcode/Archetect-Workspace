import { BigFiveTrait } from '@archetect/shared/types';
import logger from '../utils/logger';
import { ValidationError } from '../middleware/errorHandler';

interface QuestionnaireResponse {
  questionId: string;
  response: number; // 1-5 or 1-7 Likert scale
}

interface QuestionnaireItem {
  id: string;
  trait: 'openness' | 'conscientiousness' | 'extraversion' | 'agreeableness' | 'neuroticism';
  text: string;
  reversed: boolean; // Some items are reverse-scored
}

export class QuestionnaireService {
  // Big Five Questionnaire Items (40 items, 8 per trait)
  // Based on IPIP (International Personality Item Pool)
  private items: QuestionnaireItem[] = [
    // Openness (8 items)
    { id: 'O1', trait: 'openness', text: 'I have a vivid imagination', reversed: false },
    { id: 'O2', trait: 'openness', text: 'I am interested in abstract ideas', reversed: false },
    { id: 'O3', trait: 'openness', text: 'I enjoy trying new things', reversed: false },
    { id: 'O4', trait: 'openness', text: 'I am curious about many different things', reversed: false },
    { id: 'O5', trait: 'openness', text: 'I prefer routine over variety', reversed: true },
    { id: 'O6', trait: 'openness', text: 'I dislike changes', reversed: true },
    { id: 'O7', trait: 'openness', text: 'I have excellent ideas', reversed: false },
    { id: 'O8', trait: 'openness', text: 'I am quick to understand things', reversed: false },

    // Conscientiousness (8 items)
    { id: 'C1', trait: 'conscientiousness', text: 'I am always prepared', reversed: false },
    { id: 'C2', trait: 'conscientiousness', text: 'I pay attention to details', reversed: false },
    { id: 'C3', trait: 'conscientiousness', text: 'I get chores done right away', reversed: false },
    { id: 'C4', trait: 'conscientiousness', text: 'I follow a schedule', reversed: false },
    { id: 'C5', trait: 'conscientiousness', text: 'I leave my belongings around', reversed: true },
    { id: 'C6', trait: 'conscientiousness', text: 'I make a mess of things', reversed: true },
    { id: 'C7', trait: 'conscientiousness', text: 'I often forget to put things back in their proper place', reversed: true },
    { id: 'C8', trait: 'conscientiousness', text: 'I shirk my duties', reversed: true },

    // Extraversion (8 items)
    { id: 'E1', trait: 'extraversion', text: 'I am the life of the party', reversed: false },
    { id: 'E2', trait: 'extraversion', text: 'I feel comfortable around people', reversed: false },
    { id: 'E3', trait: 'extraversion', text: 'I start conversations', reversed: false },
    { id: 'E4', trait: 'extraversion', text: 'I talk to a lot of different people at parties', reversed: false },
    { id: 'E5', trait: 'extraversion', text: 'I don\'t talk a lot', reversed: true },
    { id: 'E6', trait: 'extraversion', text: 'I keep in the background', reversed: true },
    { id: 'E7', trait: 'extraversion', text: 'I have little to say', reversed: true },
    { id: 'E8', trait: 'extraversion', text: 'I don\'t like to draw attention to myself', reversed: true },

    // Agreeableness (8 items)
    { id: 'A1', trait: 'agreeableness', text: 'I am interested in people', reversed: false },
    { id: 'A2', trait: 'agreeableness', text: 'I sympathize with others\' feelings', reversed: false },
    { id: 'A3', trait: 'agreeableness', text: 'I have a soft heart', reversed: false },
    { id: 'A4', trait: 'agreeableness', text: 'I take time out for others', reversed: false },
    { id: 'A5', trait: 'agreeableness', text: 'I feel little concern for others', reversed: true },
    { id: 'A6', trait: 'agreeableness', text: 'I insult people', reversed: true },
    { id: 'A7', trait: 'agreeableness', text: 'I am not really interested in others', reversed: true },
    { id: 'A8', trait: 'agreeableness', text: 'I am not interested in other people\'s problems', reversed: true },

    // Neuroticism (8 items)
    { id: 'N1', trait: 'neuroticism', text: 'I get stressed out easily', reversed: false },
    { id: 'N2', trait: 'neuroticism', text: 'I worry about things', reversed: false },
    { id: 'N3', trait: 'neuroticism', text: 'I am easily disturbed', reversed: false },
    { id: 'N4', trait: 'neuroticism', text: 'I get upset easily', reversed: false },
    { id: 'N5', trait: 'neuroticism', text: 'I am relaxed most of the time', reversed: true },
    { id: 'N6', trait: 'neuroticism', text: 'I seldom feel blue', reversed: true },
    { id: 'N7', trait: 'neuroticism', text: 'I am not easily bothered by things', reversed: true },
    { id: 'N8', trait: 'neuroticism', text: 'I remain calm in tense situations', reversed: true },
  ];

  /**
   * Get all questionnaire items
   */
  public getQuestionnaire(): QuestionnaireItem[] {
    return this.items.map(item => ({
      id: item.id,
      trait: item.trait,
      text: item.text,
      reversed: item.reversed,
    }));
  }

  /**
   * Score questionnaire responses and return Big Five trait scores
   */
  public scoreQuestionnaire(responses: QuestionnaireResponse[]): BigFiveTrait[] {
    logger.debug('Scoring questionnaire', { responseCount: responses.length });

    // Validate responses
    if (responses.length !== this.items.length) {
      throw new ValidationError(
        `Expected ${this.items.length} responses, got ${responses.length}`
      );
    }

    // Create response map
    const responseMap = new Map(
      responses.map((r) => [r.questionId, r.response])
    );

    // Validate all questions are answered
    for (const item of this.items) {
      if (!responseMap.has(item.id)) {
        throw new ValidationError(`Missing response for question ${item.id}`);
      }

      const response = responseMap.get(item.id)!;
      if (response < 1 || response > 5) {
        throw new ValidationError(
          `Invalid response for question ${item.id}: ${response}. Must be 1-5.`
        );
      }
    }

    // Calculate trait scores
    const traitScores = new Map<string, number[]>();

    for (const item of this.items) {
      const response = responseMap.get(item.id)!;

      // Reverse score if needed (6 - response for 1-5 scale)
      const score = item.reversed ? 6 - response : response;

      // Group by trait
      if (!traitScores.has(item.trait)) {
        traitScores.set(item.trait, []);
      }
      traitScores.get(item.trait)!.push(score);
    }

    // Calculate mean for each trait and normalize to 0-1
    const bigFiveTraits: BigFiveTrait[] = [];

    for (const [trait, scores] of traitScores.entries()) {
      const mean = scores.reduce((sum, score) => sum + score, 0) / scores.length;

      // Normalize from 1-5 scale to 0-1 scale
      const normalized = (mean - 1) / 4;

      bigFiveTraits.push({
        trait: trait as any,
        score: Math.round(normalized * 100) / 100, // Round to 2 decimals
      });
    }

    logger.debug('Questionnaire scored successfully', { bigFiveTraits });

    return bigFiveTraits;
  }

  /**
   * Get items for a specific trait
   */
  public getItemsByTrait(
    trait: 'openness' | 'conscientiousness' | 'extraversion' | 'agreeableness' | 'neuroticism'
  ): QuestionnaireItem[] {
    return this.items.filter((item) => item.trait === trait);
  }

  /**
   * Validate individual response
   */
  public validateResponse(response: QuestionnaireResponse): boolean {
    const item = this.items.find((i) => i.id === response.questionId);
    if (!item) {
      return false;
    }

    return response.response >= 1 && response.response <= 5;
  }
}

export const questionnaireService = new QuestionnaireService();
