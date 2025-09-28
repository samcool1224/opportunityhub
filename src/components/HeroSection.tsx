import { Link } from 'react-router-dom';
import { EnhancedButton } from './EnhancedButton';
import { EnhancedCard } from './EnhancedCard';
import { GraduationCap, Briefcase, Search, Zap } from 'lucide-react';

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen hero-glass-bg overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="glass-orb glass-panel-orange w-96 h-96 top-1/4 left-1/6 float-slow" />
        <div className="glass-orb glass-panel-coral w-80 h-80 top-1/3 right-1/4 float-medium" style={{animationDelay: '2s'}} />
        <div className="glass-orb glass-panel-golden w-72 h-72 bottom-1/4 left-1/3 float-fast" style={{animationDelay: '4s'}} />
        <div className="glass-orb glass-panel-emerald w-64 h-64 top-1/2 right-1/6 float-slow" style={{animationDelay: '6s'}} />
        
        <div className="glass-geometric glass-panel-royal w-64 h-48 top-1/6 right-1/3 rotate-slow" style={{'--rotation': '15deg'} as any} />
        <div className="glass-geometric glass-panel-purple w-56 h-40 bottom-1/3 left-1/4 rotate-medium" style={{'--rotation': '-12deg'} as any} />
      </div>

      {/* Main Hero Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-40 pb-20 z-10">
        <div className="text-center space-y-8">
          {/* Main Headline */}
          <div className="space-y-4 fade-in-up">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold hero-text-shadow">
              <span className="bg-gradient-hero bg-clip-text text-transparent hero-glow">
                Discover
              </span>{' '}
              <span className="text-foreground">
                Your Next
              </span>
              <br />
              <span className="text-foreground">
                Big
              </span>{' '}
              <span className="bg-gradient-hero bg-clip-text text-transparent hero-glow">
                Opportunity
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed hero-text-shadow">
              A safe, centralized hub for high school and undergraduate students to find verified internships,
              competitions, programs, and events — with roughly 60% curated from trusted sources and 40% posted
              directly by organizations.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center fade-in-up" style={{animationDelay: '0.2s'}}>
            <EnhancedButton 
              variant="hero" 
              size="lg"
              className="w-full sm:w-auto hero-glow"
            >
              <Link to="/register/student" className="flex items-center space-x-2">
                <GraduationCap className="w-5 h-5" />
                <span>I'm a Student</span>
              </Link>
            </EnhancedButton>
            
            <EnhancedButton 
              variant="outline-hero" 
              size="lg"
              className="w-full sm:w-auto hero-glow"
            >
              <Link to="/register/organization" className="flex items-center space-x-2">
                <Briefcase className="w-5 h-5" />
                <span>I'm an Organization</span>
              </Link>
            </EnhancedButton>
          </div>

          {/* Value Proposition Cards */}
          <div className="grid md:grid-cols-3 gap-8 mt-20 fade-in-up" style={{animationDelay: '0.4s'}}>
            <EnhancedCard variant="glass" className="text-center backdrop-blur-xl bg-white/20 border-white/30">
              <div className="w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-4 hero-glow">
                <Search className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Curated Opportunities</h3>
              <p className="text-muted-foreground">
                Approximately 60% of listings are aggregated and verified from trusted sources — all in one place.
              </p>
            </EnhancedCard>

            <EnhancedCard variant="glass" className="text-center backdrop-blur-xl bg-white/20 border-white/30">
              <div className="w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-4 hero-glow">
                <Zap className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Exclusive Listings</h3>
              <p className="text-muted-foreground">
                Roughly 40% are posted directly by organizations — exclusive, early-career opportunities
                you won’t find elsewhere.
              </p>
            </EnhancedCard>

            <EnhancedCard variant="glass" className="text-center backdrop-blur-xl bg-white/20 border-white/30">
              <div className="w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-4 hero-glow">
                <Briefcase className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Early Career Focus</h3>
              <p className="text-muted-foreground">
                Opportunities specifically curated for high school and undergraduate 
                students to build their professional profiles.
              </p>
            </EnhancedCard>
          </div>
        </div>
      </div>
    </section>
  );
};