'use client';

import { useState } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Navigation } from '@/components/Navigation';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { CompatibilityMatrix } from '@/components/CompatibilityMatrix';
import { useTeamCompatibility } from '@/hooks/useCompatibility';
import { useProfile } from '@/hooks/useProfile';
import { Users, Plus, X, TrendingUp, MessageSquare, AlertTriangle, CheckCircle2 } from 'lucide-react';

function TeamContent() {
  const { data: myProfile, isLoading: profileLoading } = useProfile();
  const [teamProfileIds, setTeamProfileIds] = useState<string[]>([]);
  const [newProfileId, setNewProfileId] = useState('');

  // Add current user's profile to team by default
  const allProfileIds = myProfile?.data?.id
    ? [myProfile.data.id, ...teamProfileIds]
    : teamProfileIds;

  const {
    data: teamData,
    isLoading: compatibilityLoading,
    error,
  } = useTeamCompatibility(allProfileIds.length >= 2 ? allProfileIds : undefined);

  const handleAddProfile = () => {
    if (newProfileId.trim() && !teamProfileIds.includes(newProfileId.trim())) {
      setTeamProfileIds([...teamProfileIds, newProfileId.trim()]);
      setNewProfileId('');
    }
  };

  const handleRemoveProfile = (id: string) => {
    setTeamProfileIds(teamProfileIds.filter(pid => pid !== id));
  };

  if (profileLoading) {
    return <LoadingSpinner fullScreen text="Loading your profile..." />;
  }

  const hasTeam = allProfileIds.length >= 2;
  const canCalculate = allProfileIds.length >= 2;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navigation />

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Team Compatibility</h1>
              <p className="text-gray-600">Analyze team dynamics and get actionable insights</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Add Team Members */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Your Team</h2>

          {/* Current User */}
          {myProfile?.data && (
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg mb-4 border border-blue-200">
              <div>
                <div className="font-medium text-gray-900">You</div>
                <div className="text-sm text-gray-600">
                  {myProfile.data.archetectType} • {myProfile.data.energyStyle}
                </div>
              </div>
              <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-xs font-medium">
                Team Lead
              </span>
            </div>
          )}

          {/* Team Members */}
          {teamProfileIds.map((id, index) => (
            <div
              key={id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-2"
            >
              <div>
                <div className="font-medium text-gray-900">Team Member {index + 1}</div>
                <div className="text-sm text-gray-500 font-mono">{id}</div>
              </div>
              <button
                onClick={() => handleRemoveProfile(id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          ))}

          {/* Add Member Input */}
          <div className="flex gap-2 mt-4">
            <input
              type="text"
              value={newProfileId}
              onChange={(e) => setNewProfileId(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddProfile()}
              placeholder="Enter profile ID to add team member"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
            />
            <button
              onClick={handleAddProfile}
              disabled={!newProfileId.trim()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Add
            </button>
          </div>

          {!canCalculate && (
            <p className="text-sm text-gray-500 mt-3">
              Add at least one team member to calculate compatibility
            </p>
          )}
        </div>

        {/* Compatibility Results */}
        {hasTeam && (
          <ErrorBoundary>
            {compatibilityLoading ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
                <LoadingSpinner size="lg" text="Calculating team compatibility..." />
              </div>
            ) : error ? (
              <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6">
                <div className="flex items-center gap-3 text-red-600 mb-2">
                  <AlertTriangle className="h-5 w-5" />
                  <h3 className="font-semibold">Error Loading Compatibility</h3>
                </div>
                <p className="text-gray-600">
                  {(error as any)?.response?.data?.message || 'Failed to calculate team compatibility. Please check that all profile IDs are valid.'}
                </p>
              </div>
            ) : teamData?.data ? (
              <>
                {/* Summary Card */}
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-6 text-white mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold mb-2">Team Compatibility Score</h3>
                      <p className="text-purple-100">
                        Overall team dynamics analysis
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="text-5xl font-bold">
                        {Math.round(teamData.data.averageCompatibility * 100)}%
                      </div>
                      <div className="text-purple-100 text-sm mt-1">Average</div>
                    </div>
                  </div>
                </div>

                {/* Compatibility Matrix */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Compatibility Matrix
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Hover over cells to see detailed compatibility insights
                  </p>
                  <CompatibilityMatrix
                    profiles={teamData.data.pairwiseScores.map((score: any) => ({
                      id: score.profile1Id,
                      userId: score.profile1Id,
                      archetectType: 'Member',
                      energyStyle: 'Mixed'
                    }))}
                    pairScores={teamData.data.pairwiseScores}
                  />
                </div>

                {/* Team Dynamics */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <TrendingUp className="h-6 w-6 text-green-600" />
                      <h3 className="text-xl font-bold text-gray-900">Team Dynamics</h3>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      {teamData.data.teamDynamics}
                    </p>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <MessageSquare className="h-6 w-6 text-blue-600" />
                      <h3 className="text-xl font-bold text-gray-900">Recommendations</h3>
                    </div>
                    <ul className="space-y-2">
                      {teamData.data.recommendations.map((rec: string, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </>
            ) : null}
          </ErrorBoundary>
        )}

        {/* Empty State */}
        {!hasTeam && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Build Your Team</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Add team members by entering their profile IDs to see compatibility analysis,
              communication tips, and team dynamics insights.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TeamPage() {
  return (
    <ProtectedRoute>
      <ErrorBoundary>
        <TeamContent />
      </ErrorBoundary>
    </ProtectedRoute>
  );
}
