'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuthStore } from '@/lib/auth-store';
import { profileApi } from '@/lib/api';
import { User, Brain, LogOut, Loader2 } from 'lucide-react';

interface Profile {
  id: string;
  userId: string;
  archetectType: string;
  energyStyle: string;
  flowMode: string;
  season: string;
  strengths: string[];
  challenges: string[];
  createdAt: string;
}

function DashboardContent() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await profileApi.getMyProfile();
      setProfile(response.data);
    } catch (err: any) {
      if (err.response?.status === 404) {
        // No profile yet, redirect to questionnaire
        router.push('/questionnaire');
      } else {
        setError('Failed to load profile');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Archetect Dashboard</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{user?.fullName}</h2>
              <p className="text-gray-600">{user?.email}</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {profile ? (
          <>
            {/* Archetect Type Card */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white mb-6">
              <div className="flex items-center gap-4 mb-4">
                <Brain className="h-12 w-12" />
                <div>
                  <h3 className="text-2xl font-bold">Your Archetect Type</h3>
                  <p className="text-blue-100">Personality Profile</p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                  <p className="text-blue-100 text-sm mb-1">Type</p>
                  <p className="text-2xl font-bold">{profile.archetectType}</p>
                </div>
                <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                  <p className="text-blue-100 text-sm mb-1">Energy Style</p>
                  <p className="text-2xl font-bold">{profile.energyStyle}</p>
                </div>
                <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                  <p className="text-blue-100 text-sm mb-1">Flow Mode</p>
                  <p className="text-2xl font-bold">{profile.flowMode}</p>
                </div>
                <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                  <p className="text-blue-100 text-sm mb-1">Season</p>
                  <p className="text-2xl font-bold">{profile.season}</p>
                </div>
              </div>
            </div>

            {/* Strengths & Challenges */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Strengths */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Your Strengths</h3>
                <ul className="space-y-2">
                  {profile.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">✓</span>
                      <span className="text-gray-700">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Challenges */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Growth Areas</h3>
                <ul className="space-y-2">
                  {profile.challenges.map((challenge, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">→</span>
                      <span className="text-gray-700">{challenge}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <Brain className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Profile Yet</h3>
            <p className="text-gray-600 mb-6">
              Complete the questionnaire to discover your Archetect Type
            </p>
            <button
              onClick={() => router.push('/questionnaire')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Take Questionnaire
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
      <DashboardContent />
    </ProtectedRoute>
  );
}
