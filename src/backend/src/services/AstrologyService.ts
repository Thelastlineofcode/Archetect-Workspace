import { spawn } from 'child_process';
import * as path from 'path';
import { config } from '../config';
import logger from '../utils/logger';
import {
  Zodiac,
  Nakshatra,
  SiderealData,
  PlanetaryPosition,
} from '@archetect/shared/types';

interface BirthChartInput {
  date: string; // YYYY-MM-DD
  time: string; // HH:MM:SS
  latitude: number;
  longitude: number;
  timezone: string;
}

interface BirthChartOutput {
  sunSign: Zodiac;
  moonSign: Zodiac;
  ascendant: Zodiac;
  mercury: Zodiac;
  nakshatra: Nakshatra;
  nakshatraRuler: string;
  modality: 'Cardinal' | 'Fixed' | 'Mutable';
  element: 'Fire' | 'Earth' | 'Air' | 'Water';
}

export class AstrologyService {
  private pythonPath: string;
  private scriptPath: string;

  constructor() {
    this.pythonPath = config.services.astrology.pythonPath;
    this.scriptPath = path.join(
      config.services.astrology.enginePath,
      'birth_chart.py'
    );
  }

  public async calculateBirthChart(
    input: BirthChartInput
  ): Promise<BirthChartOutput> {
    return new Promise((resolve, reject) => {
      const args = [
        this.scriptPath,
        input.date,
        input.time,
        input.latitude.toString(),
        input.longitude.toString(),
        input.timezone,
      ];

      logger.debug('Calling Python astrology engine', { args });

      const pythonProcess = spawn(this.pythonPath, args);

      let stdoutData = '';
      let stderrData = '';

      pythonProcess.stdout.on('data', (data) => {
        stdoutData += data.toString();
      });

      pythonProcess.stderr.on('data', (data) => {
        stderrData += data.toString();
      });

      pythonProcess.on('close', (code) => {
        if (code !== 0) {
          logger.error('Python astrology engine failed', {
            code,
            stderr: stderrData,
          });
          reject(new Error(`Astrology calculation failed: ${stderrData}`));
          return;
        }

        try {
          // Parse JSON output from Python script
          const result = JSON.parse(stdoutData);

          const birthChart: BirthChartOutput = {
            sunSign: result.sun_sign as Zodiac,
            moonSign: result.moon_sign as Zodiac,
            ascendant: result.ascendant as Zodiac,
            mercury: result.mercury as Zodiac,
            nakshatra: result.nakshatra as Nakshatra,
            nakshatraRuler: result.nakshatra_ruler,
            modality: result.modality,
            element: result.element,
          };

          logger.debug('Birth chart calculated successfully', { birthChart });
          resolve(birthChart);
        } catch (error) {
          logger.error('Failed to parse astrology engine output', {
            error,
            stdout: stdoutData,
          });
          reject(new Error('Failed to parse astrology calculation result'));
        }
      });

      pythonProcess.on('error', (error) => {
        logger.error('Failed to spawn Python process', { error });
        reject(new Error(`Failed to run astrology engine: ${error.message}`));
      });
    });
  }

  public async getSiderealData(
    input: BirthChartInput
  ): Promise<SiderealData> {
    const chart = await this.calculateBirthChart(input);

    const createPosition = (sign: Zodiac): PlanetaryPosition => ({
      sign,
      siderealdegree: 0,
      modality: chart.modality,
      element: chart.element,
    });

    return {
      sunSign: createPosition(chart.sunSign),
      moonSign: createPosition(chart.moonSign),
      ascendant: createPosition(chart.ascendant),
      mercurySign: createPosition(chart.mercury),
      _metadata: {
        ephemerisSource: 'swiss-ephemeris',
        ayanamsha: 'lahiri',
        houseSystem: 'placidus',
        computedAt: new Date(),
      },
    };
  }
}

export const astrologyService = new AstrologyService();
