import Link from 'next/link';
import { ArrowRight, Brain, Users, Zap } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Discover Your{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Archetect Type
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Unlock deeper self-awareness and build stronger teams with our personality intelligence platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/auth/login"
              className="inline-flex items-center justify-center px-8 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-lg font-semibold"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <FeatureCard
            icon={<Brain className="h-8 w-8 text-blue-600" />}
            title="Science-Based"
            description="Built on the Big Five personality framework with advanced transformation algorithms"
          />
          <FeatureCard
            icon={<Users className="h-8 w-8 text-purple-600" />}
            title="Team Insights"
            description="Understand team dynamics and get actionable recommendations for better collaboration"
          />
          <FeatureCard
            icon={<Zap className="h-8 w-8 text-green-600" />}
            title="Instant Results"
            description="Complete the questionnaire in minutes and get your personalized Archetect Type"
          />
        </div>

        {/* Archetect Types Preview */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            The Three Archetect Types
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <TypeCard
              name="Architect"
              color="bg-blue-600"
              description="Strategic planners and system designers. Thrive on structure and clear goals."
              traits={['Strategic', 'Organized', 'Reliable']}
            />
            <TypeCard
              name="Maverick"
              color="bg-purple-600"
              description="Innovators and creative problem-solvers. Excel in dynamic, evolving environments."
              traits={['Innovative', 'Adaptable', 'Creative']}
            />
            <TypeCard
              name="Sage"
              color="bg-green-600"
              description="Mentors and thoughtful analysts. Value depth, wisdom, and knowledge sharing."
              traits={['Wise', 'Empathetic', 'Insightful']}
            />
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to discover your type?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Take the 40-question assessment and unlock your personality insights
          </p>
          <Link
            href="/auth/signup"
            className="inline-flex items-center justify-center px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors text-lg font-semibold"
          >
            Start Your Journey
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function TypeCard({
  name,
  color,
  description,
  traits,
}: {
  name: string;
  color: string;
  description: string;
  traits: string[];
}) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className={`${color} h-2`} />
      <div className="p-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-3">{name}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        <div className="flex flex-wrap gap-2">
          {traits.map((trait) => (
            <span
              key={trait}
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
            >
              {trait}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
