'use client';

import { useMemo } from 'react';

interface Profile {
  id: string;
  userId: string;
  archetectType: string;
  energyStyle: string;
}

interface PairScore {
  profile1Id: string;
  profile2Id: string;
  compatibilityScore: number;
  complementarity: string;
  communicationTips: string[];
}

interface CompatibilityMatrixProps {
  profiles: Profile[];
  pairScores: PairScore[];
}

export function CompatibilityMatrix({ profiles, pairScores }: CompatibilityMatrixProps) {
  const scoreMap = useMemo(() => {
    const map = new Map<string, PairScore>();
    pairScores.forEach(score => {
      map.set(`${score.profile1Id}-${score.profile2Id}`, score);
      map.set(`${score.profile2Id}-${score.profile1Id}`, score);
    });
    return map;
  }, [pairScores]);

  const getScore = (id1: string, id2: string): number | null => {
    if (id1 === id2) return null;
    return scoreMap.get(`${id1}-${id2}`)?.compatibilityScore ?? null;
  };

  const getScoreColor = (score: number | null): string => {
    if (score === null) return 'bg-gray-100';
    if (score >= 0.8) return 'bg-green-500';
    if (score >= 0.6) return 'bg-green-400';
    if (score >= 0.4) return 'bg-yellow-400';
    if (score >= 0.2) return 'bg-orange-400';
    return 'bg-red-400';
  };

  const getScoreText = (score: number | null): string => {
    if (score === null) return '-';
    return `${Math.round(score * 100)}%`;
  };

  return (
    <div className="overflow-x-auto">
      <div className="inline-block min-w-full">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-3 text-left border-b border-r border-gray-200 bg-gray-50 sticky left-0 z-10">
                <span className="text-sm font-medium text-gray-600">Team Member</span>
              </th>
              {profiles.map((profile, index) => (
                <th
                  key={profile.id}
                  className="p-3 border-b border-gray-200 bg-gray-50 min-w-[100px]"
                >
                  <div className="text-center">
                    <div className="text-xs font-medium text-gray-900">
                      Member {index + 1}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {profile.archetectType}
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {profiles.map((rowProfile, rowIndex) => (
              <tr key={rowProfile.id}>
                <td className="p-3 border-r border-b border-gray-200 bg-gray-50 sticky left-0 z-10">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      Member {rowIndex + 1}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {rowProfile.archetectType}
                    </div>
                    <div className="text-xs text-gray-400">
                      {rowProfile.energyStyle}
                    </div>
                  </div>
                </td>
                {profiles.map((colProfile) => {
                  const score = getScore(rowProfile.id, colProfile.id);
                  const isHovered = false; // Can add hover state if needed

                  return (
                    <td
                      key={colProfile.id}
                      className="p-2 border-b border-gray-200 text-center transition-all hover:shadow-inner cursor-pointer group relative"
                    >
                      <div
                        className={`
                          ${getScoreColor(score)}
                          ${score !== null ? 'text-white' : 'text-gray-400'}
                          rounded-lg p-3 font-semibold text-sm
                          transition-transform group-hover:scale-105
                        `}
                      >
                        {getScoreText(score)}
                      </div>
                      {score !== null && (
                        <div className="hidden group-hover:block absolute z-20 top-full left-1/2 transform -translate-x-1/2 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 p-3 text-left">
                          <div className="text-xs text-gray-600 mb-1">Compatibility</div>
                          <div className="text-lg font-bold text-gray-900 mb-2">
                            {getScoreText(score)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {scoreMap.get(`${rowProfile.id}-${colProfile.id}`)?.complementarity}
                          </div>
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="mt-6 flex items-center gap-4 flex-wrap">
        <span className="text-sm font-medium text-gray-700">Compatibility:</span>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-green-500" />
          <span className="text-xs text-gray-600">Excellent (80%+)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-green-400" />
          <span className="text-xs text-gray-600">Good (60-79%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-yellow-400" />
          <span className="text-xs text-gray-600">Moderate (40-59%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-orange-400" />
          <span className="text-xs text-gray-600">Fair (20-39%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-red-400" />
          <span className="text-xs text-gray-600">Low (<20%)</span>
        </div>
      </div>
    </div>
  );
}
