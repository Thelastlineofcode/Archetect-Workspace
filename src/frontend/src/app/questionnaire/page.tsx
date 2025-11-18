'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { profileApi } from '@/lib/api';
import { Brain, Loader2, CheckCircle2 } from 'lucide-react';

interface QuestionnaireItem {
  id: string;
  trait: 'openness' | 'conscientiousness' | 'extraversion' | 'agreeableness' | 'neuroticism';
  text: string;
  reversed: boolean;
}

function QuestionnaireContent() {
  const router = useRouter();
  const [questions, setQuestions] = useState<QuestionnaireItem[]>([]);
  const [responses, setResponses] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadQuestionnaire();
  }, []);

  const loadQuestionnaire = async () => {
    try {
      const response = await profileApi.getQuestionnaire();
      setQuestions(response.data.items);
    } catch (err: any) {
      setError('Failed to load questionnaire');
    } finally {
      setLoading(false);
    }
  };

  const handleResponse = (questionId: string, value: number) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleSubmit = async () => {
    // Validate all questions are answered
    if (Object.keys(responses).length !== questions.length) {
      setError('Please answer all questions before submitting');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const formattedResponses = Object.entries(responses).map(([questionId, response]) => ({
        questionId,
        response,
      }));

      await profileApi.createProfile(formattedResponses);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create profile. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const progress = (Object.keys(responses).length / questions.length) * 100;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading questionnaire...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-16 w-16 bg-blue-100 rounded-full mb-4">
            <Brain className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Personality Questionnaire
          </h1>
          <p className="text-gray-600">
            Answer {questions.length} questions to discover your Archetect Type
          </p>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm font-medium text-blue-600">
              {Object.keys(responses).length} / {questions.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Questions */}
        <div className="space-y-6">
          {questions.map((question, index) => {
            const isAnswered = responses[question.id] !== undefined;

            return (
              <div
                key={question.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    {isAnswered ? (
                      <CheckCircle2 className="h-6 w-6 text-green-600" />
                    ) : (
                      <div className="h-6 w-6 rounded-full border-2 border-gray-300" />
                    )}
                  </div>
                  <div className="flex-grow">
                    <p className="text-sm font-medium text-gray-500 mb-2">
                      Question {index + 1}
                    </p>
                    <p className="text-lg text-gray-900 mb-4">{question.text}</p>

                    {/* Likert Scale */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Strongly Disagree</span>
                        <span>Strongly Agree</span>
                      </div>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((value) => (
                          <button
                            key={value}
                            onClick={() => handleResponse(question.id, value)}
                            className={`flex-1 py-3 rounded-lg border-2 transition-all font-medium ${
                              responses[question.id] === value
                                ? 'border-blue-600 bg-blue-50 text-blue-700'
                                : 'border-gray-300 hover:border-blue-400 text-gray-700'
                            }`}
                          >
                            {value}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Submit Button */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <button
            onClick={handleSubmit}
            disabled={submitting || Object.keys(responses).length !== questions.length}
            className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <Loader2 className="animate-spin mr-2 h-5 w-5" />
                Creating your profile...
              </>
            ) : (
              <>
                Complete Assessment
              </>
            )}
          </button>
          {Object.keys(responses).length !== questions.length && (
            <p className="text-center text-sm text-gray-600 mt-2">
              Please answer all questions to continue
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function QuestionnairePage() {
  return (
    <ProtectedRoute>
      <QuestionnaireContent />
    </ProtectedRoute>
  );
}
