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
              <span className="bg-gradient-hero bg-clip-text text-transparent hero-glow">Syntipy</span>
            </h1>
            <p className="text-2xl sm:text-3xl text-muted-foreground leading-relaxed mb-16 hero-text-shadow">
              We're revolutionizing how students and professors connect for research opportunities, 
              creating a more efficient and accessible academic ecosystem.
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

      {/* Story Section */}
      <section className="pt-24 pb-20 bg-gradient-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">
                <span className="text-foreground">Our</span>{' '}
                <span className="bg-gradient-hero bg-clip-text text-transparent">Story</span>
              </h2>
              <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                <p>
                  Syntipy was born from a simple observation: exceptional students and innovative professors 
                  often struggled to find each other. Traditional academic networks were fragmented, 
                  inefficient, and often excluded promising talent.
                </p>
                <p>
                  Our founders, having experienced both sides of academic research, recognized the need 
                  for a platform that could intelligently match students with research opportunities 
                  based on skills, interests, and potential for impact.
                </p>
                <p>
                  Today, we've created a thriving ecosystem where merit and passion drive connections, 
                  enabling breakthrough research and launching successful academic careers.
                </p>
              </div>
            </div>
            <EnhancedCard variant="glass" className="p-8">
              <div className="space-y-8">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center">
                    <Globe className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">20+</div>
                    <div className="text-muted-foreground">Partner Universities</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center">
                    <Users className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">1,000+</div>
                    <div className="text-muted-foreground">Active Users</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center">
                    <Award className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">85%</div>
                    <div className="text-muted-foreground">Success Rate</div>
                  </div>
                </div>
              </div>
            </EnhancedCard>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gradient-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">
              <span className="text-foreground">Our</span>{' '}
              <span className="bg-gradient-hero bg-clip-text text-transparent">Values</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              The principles that guide everything we do at Syntipy.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <EnhancedCard 
                key={index} 
                variant="glass" 
                className="text-center fade-in-up"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-4 text-primary-foreground">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {value.title}
                </h3>
                <p className="text-muted-foreground">
                  {value.description}
                </p>
              </EnhancedCard>
            ))}
          </div>
        </div>
      </section>



      {/* CTA Section */}
      <section className="py-20 bg-gradient-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-20 h-20 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-8">
            <Lightbulb className="w-10 h-10 text-primary-foreground" />
          </div>
          <h2 className="text-4xl font-bold mb-6">
            <span className="text-foreground">Ready to</span>{' '}
            <span className="bg-gradient-hero bg-clip-text text-transparent">Transform</span>{' '}
            <span className="text-foreground">Academic Research?</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
            Join our mission to make academic research more accessible, efficient, and impactful. 
            Together, we can accelerate scientific discovery and launch the next generation of researchers.
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