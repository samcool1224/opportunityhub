import { Link } from 'react-router-dom';
import { EnhancedButton } from './EnhancedButton';
import { EnhancedCard } from './EnhancedCard';
import { ArrowRight, Briefcase, GraduationCap } from 'lucide-react';

export const FinalCTA = () => {
  return (
    <section className="py-20 bg-gradient-section relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-primary-light/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            <span className="text-foreground">Unlock Early‑Career</span><br />
            <span className="bg-gradient-hero bg-clip-text text-transparent">Opportunities</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12">
            A centralized hub for high school and undergraduate students — mixing curated listings
            and direct postings. Every opportunity is reviewed for legitimacy and student suitability.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Student CTA */}
          <EnhancedCard variant="premium" className="text-center group">
            <div className="w-20 h-20 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <GraduationCap className="w-10 h-10 text-primary-foreground" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-4">For Students</h3>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Discover verified internships, competitions, programs, and events tailored to early‑career students.
              Browse curated listings and exclusive direct postings—all in one safe place.
            </p>
            <EnhancedButton variant="hero" size="lg" className="w-full group">
              <Link to="/register/student" className="flex items-center justify-center space-x-2">
                <span>Find Opportunities</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </EnhancedButton>
            <div className="mt-4 text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:text-primary-light transition-colors">
                Sign in
              </Link>
            </div>
          </EnhancedCard>

          {/* Organization CTA */}
          <EnhancedCard variant="premium" className="text-center group">
            <div className="w-20 h-20 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <Briefcase className="w-10 h-10 text-primary-foreground" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-4">For Organizations</h3>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Reach motivated high school and undergraduate talent with student‑friendly, verified postings.
              Build your early‑career pipeline with exclusive opportunities designed for accessibility.
            </p>
            <EnhancedButton variant="outline-hero" size="lg" className="w-full group">
              <Link to="/register/organization" className="flex items-center justify-center space-x-2">
                <span>Post Opportunities</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </EnhancedButton>
            <div className="mt-4 text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:text-primary-light transition-colors">
                Sign in
              </Link>
            </div>
          </EnhancedCard>
        </div>

        {/* Additional Benefits */}
        <div className="mt-16 grid sm:grid-cols-3 gap-6 text-center">
          <div className="fade-in-up" style={{animationDelay: '0.1s'}}>
            <div className="text-2xl font-bold text-primary mb-2">100% Free</div>
            <div className="text-muted-foreground">No cost for students to access opportunities</div>
          </div>
          <div className="fade-in-up" style={{animationDelay: '0.2s'}}>
            <div className="text-2xl font-bold text-primary mb-2">Verified Listings</div>
            <div className="text-muted-foreground">Every opportunity is vetted for quality</div>
          </div>
          <div className="fade-in-up" style={{animationDelay: '0.3s'}}>
            <div className="text-2xl font-bold text-primary mb-2">Global Reach</div>
            <div className="text-muted-foreground">Opportunities from around the world</div>
          </div>
        </div>
      </div>
    </section>
  );
};