'use client';

import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Navigation } from '@/components/Navigation';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useAuthStore } from '@/lib/auth-store';
import { useProfile } from '@/hooks/useProfile';
import { User, Brain, TrendingUp, Target, ArrowRight } from 'lucide-react';
import Link from 'next/link';

function DashboardContent() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { data: profileData, isLoading, error } = useProfile();

  // Redirect to questionnaire if no profile
  if (!isLoading && error && (error as any)?.response?.status === 404) {
    router.push('/questionnaire');
    return null;
  }

  if (isLoading) {
    return <LoadingSpinner fullScreen text="Loading your profile..." />;
  }

  const profile = profileData?.data;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navigation />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Welcome back, {user?.fullName?.split(' ')[0] || 'User'}!
                </h2>
                <p className="text-gray-600">{user?.email}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Member since</div>
              <div className="font-medium text-gray-900">
                {new Date().toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>

        {error && (error as any)?.response?.status !== 404 && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            Failed to load profile. Please try again.
          </div>
        )}

        {profile ? (
          <>
            {/* Archetect Type Card */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white mb-6 shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-16 w-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Brain className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold">Your Archetect Type</h3>
                  <p className="text-blue-100">Unique Personality Profile</p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm border border-white/20">
                  <p className="text-blue-100 text-sm mb-1">Type</p>
                  <p className="text-2xl font-bold">{profile.archetectType}</p>
                </div>
                <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm border border-white/20">
                  <p className="text-blue-100 text-sm mb-1">Energy Style</p>
                  <p className="text-2xl font-bold">{profile.energyStyle}</p>
                </div>
                <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm border border-white/20">
                  <p className="text-blue-100 text-sm mb-1">Flow Mode</p>
                  <p className="text-2xl font-bold">{profile.flowMode}</p>
                </div>
                <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm border border-white/20">
                  <p className="text-blue-100 text-sm mb-1">Season</p>
                  <p className="text-2xl font-bold">{profile.season}</p>
                </div>
              </div>
            </div>

            {/* Strengths & Challenges */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* Strengths */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                  <h3 className="text-xl font-bold text-gray-900">Your Strengths</h3>
                </div>
                <ul className="space-y-3">
                  {profile.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start gap-3 group">
                      <span className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-sm">
                        ✓
                      </span>
                      <span className="text-gray-700 group-hover:text-gray-900 transition-colors">
                        {strength}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Challenges */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Target className="h-6 w-6 text-blue-600" />
                  <h3 className="text-xl font-bold text-gray-900">Growth Areas</h3>
                </div>
                <ul className="space-y-3">
                  {profile.challenges.map((challenge, index) => (
                    <li key={index} className="flex items-start gap-3 group">
                      <span className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                        →
                      </span>
                      <span className="text-gray-700 group-hover:text-gray-900 transition-colors">
                        {challenge}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 gap-6">
              <Link
                href="/team"
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Team Compatibility</h3>
                    <p className="text-gray-600">
                      Analyze team dynamics and get insights
                    </p>
                  </div>
                  <ArrowRight className="h-6 w-6 text-gray-400 group-hover:text-blue-600 transition-colors" />
                </div>
              </Link>

              <Link
                href="/settings"
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Account Settings</h3>
                    <p className="text-gray-600">
                      Manage your profile and preferences
                    </p>
                  </div>
                  <ArrowRight className="h-6 w-6 text-gray-400 group-hover:text-blue-600 transition-colors" />
                </div>
              </Link>
            </div>
          </>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Brain className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Profile Yet</h3>
            <p className="text-gray-600 mb-6">
              Complete the questionnaire to discover your Archetect Type
            </p>
            <button
              onClick={() => router.push('/questionnaire')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Take Questionnaire
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <ErrorBoundary>
        <DashboardContent />
      </ErrorBoundary>
    </ProtectedRoute>
  );
}
