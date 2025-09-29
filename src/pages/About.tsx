import { Layout } from '@/components/Layout';
import { EnhancedCard } from '@/components/EnhancedCard';
import { EnhancedButton } from '@/components/EnhancedButton';
import { Link } from 'react-router-dom';
import { 
  Target, 
  Users, 
  Award, 
  Zap, 
  Heart,
  Shield,
  Globe,
  Lightbulb
} from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: <Target className="w-8 h-8" />,
      title: "Mission-Driven",
      description: "Connecting exceptional academic talent with groundbreaking research opportunities."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Trust & Safety",
      description: "Verified institutions and rigorous vetting ensure a safe, professional environment."
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Innovation",
      description: "AI-powered matching and cutting-edge tools to streamline the research discovery process."
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Community",
      description: "Building meaningful relationships that advance both individual careers and scientific progress."
    }
  ];


  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-0 pb-40 hero-glass-bg relative overflow-hidden">
        {/* Enhanced Glass Background for About Page */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Academic-themed Glass Elements */}
          <div className="glass-orb glass-panel-orange w-80 h-80 top-1/6 left-1/8 float-slow" />
          <div className="glass-orb glass-panel-purple w-72 h-72 top-1/3 right-1/6 float-medium" style={{animationDelay: '3s'}} />
          <div className="glass-orb glass-panel-royal w-64 h-64 bottom-1/4 left-1/4 float-fast" style={{animationDelay: '5s'}} />
          
          {/* Curved Glass Wave Forms - Knowledge/Education Theme */}
          <div className="glass-wave glass-panel-purple w-96 h-20 top-1/4 left-1/2 parallax-slow" />
          <div className="glass-wave glass-panel-royal w-80 h-16 bottom-1/3 right-1/4 parallax-medium" style={{animationDelay: '2s'}} />
          
          {/* Geometric Glass Panels - Structured Academic Feel */}
          <div className="glass-geometric glass-panel-orange w-56 h-40 top-1/6 right-1/4 rotate-slow" style={{'--rotation': '12deg'} as any} />
          <div className="glass-geometric glass-panel-coral w-48 h-32 bottom-1/3 left-1/6 rotate-medium" style={{'--rotation': '-8deg'} as any} />
          <div className="glass-geometric glass-panel-emerald w-40 h-28 top-2/3 right-1/8 rotate-slow" style={{'--rotation': '15deg'} as any} />
          
          {/* Additional Floating Elements */}
          <div className="glass-orb glass-panel-magenta w-32 h-32 top-1/2 left-1/2 breathe" style={{animationDelay: '1s'}} />
          <div className="glass-orb glass-panel-golden w-28 h-28 bottom-1/6 right-1/3 breathe" style={{animationDelay: '4s'}} />
        </div>

                  <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
            <div className="text-center max-w-4xl mx-auto pt-32">
            <h1 className="text-6xl sm:text-7xl font-bold mb-12 hero-text-shadow">
              <span className="text-foreground">About</span>{' '}
              <span className="bg-gradient-hero bg-clip-text text-transparent hero-glow">FutureForge</span>
            </h1>
            <p className="text-2xl sm:text-3xl text-muted-foreground leading-relaxed mb-16 hero-text-shadow">
              The centralized, safe hub for high school and undergraduate students to discover curated and exclusive opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <EnhancedButton variant="hero" size="lg" className="hero-glow">
                <Link to="/register/student">Join as Student</Link>
              </EnhancedButton>
              <EnhancedButton variant="outline-hero" size="lg" className="hero-glow">
                <Link to="/register/organization">Join as Organization</Link>
              </EnhancedButton>
            </div>
          </div>
        </div>
      </section>
      {/* Problem + Solution */}
      <section className="pt-24 pb-20 bg-gradient-subtle">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            <span className="text-foreground">Problem</span>
          </h2>
          <div className="text-left space-y-4 text-lg text-muted-foreground leading-relaxed">
            <p>
              Students at the high school and undergraduate level actively seek internships, competitions, workshops, volunteer roles, and networking events to build their academic and career profiles. Today, the process is fragmented and inefficient:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><span className="font-medium text-foreground">LinkedIn & major job boards:</span> Overwhelming and professional-focused, with few opportunities tailored to early‑career students.</li>
              <li><span className="font-medium text-foreground">Scattered online sources:</span> Students spend hours searching for programs, often encountering outdated or scam listings.</li>
              <li><span className="font-medium text-foreground">Limited company outreach:</span> Organizations interested in recruiting younger students lack a direct channel to engage them.</li>
            </ul>
            <p>
              As a result, motivated students miss valuable early experiences, and organizations struggle to reach this audience efficiently.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-20 bg-gradient-section">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <EnhancedCard variant="glass" className="p-8">
              <h3 className="text-2xl font-bold text-foreground mb-4">Solution</h3>
              <p className="text-muted-foreground leading-relaxed">
                FutureForge provides a centralized, free platform for high schoolers and undergraduates to discover both aggregated listings and directly sourced exclusive opportunities from organizations.
              </p>
            </EnhancedCard>

            <EnhancedCard variant="glass" className="p-8">
              <h3 className="text-2xl font-bold text-foreground mb-4">Why Now?</h3>
              <p className="text-muted-foreground leading-relaxed">
                Younger generations are career‑driven earlier, but traditional platforms don’t fully serve students. Organizations want an easy way to reach this audience, yet a dedicated, centralized platform hasn’t existed—until now.
              </p>
            </EnhancedCard>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-20 bg-gradient-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold">
              <span className="text-foreground">Key</span>{' '}
              <span className="bg-gradient-hero bg-clip-text text-transparent">Features</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <EnhancedCard variant="glass" className="p-8">
              <h3 className="text-xl font-semibold text-foreground mb-3">Curated Aggregated Listings (≈60%)</h3>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Pulls verified opportunities from multiple online sources: internships, competitions, programs, and events.</li>
                <li>Filterable by category, location, eligibility, and industry.</li>
              </ul>
            </EnhancedCard>

            <EnhancedCard variant="glass" className="p-8">
              <h3 className="text-xl font-semibold text-foreground mb-3">Exclusive Direct Listings (≈40%)</h3>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Organizations post directly to the platform, offering opportunities not easily found elsewhere.</li>
                <li>Focused on early‑career accessibility; builds a trusted pipeline from companies, nonprofits, and startups.</li>
              </ul>
            </EnhancedCard>

            <EnhancedCard variant="glass" className="p-8">
              <h3 className="text-xl font-semibold text-foreground mb-3">Verification & Safety</h3>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Every opportunity is reviewed to ensure legitimacy and suitability for students.</li>
                <li>Minimizes risk of scams or misleading postings for students and parents.</li>
              </ul>
            </EnhancedCard>

            <EnhancedCard variant="glass" className="p-8">
              <h3 className="text-xl font-semibold text-foreground mb-3">Simple, No‑Frills Design</h3>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Clean interface prioritizing easy browsing over additional features.</li>
                <li>Fast access to both aggregated and exclusive opportunities.</li>
              </ul>
            </EnhancedCard>
          </div>
        </div>
      </section>

      {/* Target Market */}
      <section className="py-20 bg-gradient-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold">
              <span className="text-foreground">Target</span>{' '}
              <span className="bg-gradient-hero bg-clip-text text-transparent">Market</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <EnhancedCard variant="glass" className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-4 text-primary-foreground">
                <GraduationCap className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">High School Students (14–18)</h3>
              <p className="text-muted-foreground">Seeking initial exposure to real‑world opportunities.</p>
            </EnhancedCard>
            <EnhancedCard variant="glass" className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-4 text-primary-foreground">
                <Briefcase className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Undergraduates (18–22)</h3>
              <p className="text-muted-foreground">Looking for internships, competitions, and skill‑building programs.</p>
            </EnhancedCard>
            <EnhancedCard variant="glass" className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-4 text-primary-foreground">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Organizations & Companies</h3>
              <p className="text-muted-foreground">Interested in connecting with motivated early‑career talent through exclusive postings.</p>
            </EnhancedCard>
          </div>
        </div>
      </section>

      {/* Competitive Advantage */}
      <section className="py-20 bg-gradient-subtle">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold">
              <span className="text-foreground">Competitive</span>{' '}
              <span className="bg-gradient-hero bg-clip-text text-transparent">Advantage</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <EnhancedCard variant="glass" className="p-8">
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><span className="font-medium text-foreground">Niche focus:</span> Serves early‑career students exclusively, unlike LinkedIn or Handshake.</li>
                <li><span className="font-medium text-foreground">Verified & curated:</span> Aggregated listings are vetted for quality; exclusive postings come directly from organizations.</li>
                <li><span className="font-medium text-foreground">Access to hidden opportunities:</span> Exclusive listings give students an edge over peers using general job boards.</li>
                <li><span className="font-medium text-foreground">Completely free:</span> Removes barriers for all students globally.</li>
              </ul>
            </EnhancedCard>
            <EnhancedCard variant="glass" className="p-8">
              <div className="text-muted-foreground leading-relaxed">
                FutureForge balances breadth and trust: approximately 60% curated listings for coverage and discovery, and ≈40% exclusive postings to surface opportunities that are otherwise hidden or highly competitive.
              </div>
            </EnhancedCard>
          </div>
        </div>
      </section>

      {/* Go-to-Market Strategy */}
      <section className="py-20 bg-gradient-section">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold">
              <span className="text-foreground">Go‑to‑Market</span>{' '}
              <span className="bg-gradient-hero bg-clip-text text-transparent">Strategy</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <EnhancedCard variant="glass" className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-2">Phase 1: Launch (MVP)</h3>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Website with a mix of curated listings (≈60%) and direct postings (≈40%).</li>
                <li>Promote on LinkedIn, student Discord groups, school clubs, and university networks.</li>
              </ul>
            </EnhancedCard>
            <EnhancedCard variant="glass" className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-2">Phase 2: Growth</h3>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Expand partnerships with organizations to increase exclusive opportunities.</li>
                <li>Increase aggregated listings for breadth while maintaining quality.</li>
                <li>Collaborate with schools and student organizations for visibility.</li>
              </ul>
            </EnhancedCard>
            <EnhancedCard variant="glass" className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-2">Phase 3: Scale</h3>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Mobile app for easy access on the go.</li>
                <li>Expand internationally, building a global hub of verified and exclusive opportunities.</li>
              </ul>
            </EnhancedCard>
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="py-20 bg-gradient-subtle">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-20 h-20 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-8">
            <Lightbulb className="w-10 h-10 text-primary-foreground" />
          </div>
          <h2 className="text-4xl font-bold mb-6">
            <span className="text-foreground">Vision</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
            To become the go‑to hub for early‑career students, connecting high school and undergraduate students with both curated and exclusive opportunities that accelerate their growth and open doors to real‑world experiences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <EnhancedButton variant="hero" size="lg">
              <Link to="/opportunities">Explore Opportunities</Link>
            </EnhancedButton>
            <EnhancedButton variant="outline-hero" size="lg">
              <Link to="/register/student">Get Started</Link>
            </EnhancedButton>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;