import { Briefcase, Users, CheckCircle, Building2 } from 'lucide-react';
import { EnhancedCard } from './EnhancedCard';

export const StatsSection = () => {
  const stats = [
    {
      icon: <Briefcase className="w-10 h-10 text-primary-foreground" />,
      number: '≈60%',
      label: 'Curated Listings',
      description: 'Verified from trusted sources across the web'
    },
    {
      icon: <Building2 className="w-10 h-10 text-primary-foreground" />,
      number: '≈40%',
      label: 'Direct Listings',
      description: 'Posted by companies, nonprofits, and startups'
    },
    {
      icon: <CheckCircle className="w-10 h-10 text-primary-foreground" />,
      number: '100%',
      label: 'Listings Reviewed',
      description: 'Every opportunity is vetted for legitimacy'
    },
    {
      icon: <Users className="w-10 h-10 text-primary-foreground" />,
      number: '15,000+',
      label: 'Students Reached',
      description: 'High school and undergraduate community worldwide'
    }
  ];

  return (
    <section className="py-20 bg-gradient-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            <span className="text-foreground">Verified, Early‑Career Opportunities for</span>{' '}
            <span className="bg-gradient-hero bg-clip-text text-transparent">Students</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We vet every listing and surface the best curated and direct opportunities for high schoolers and undergrads.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <EnhancedCard 
              key={index} 
              variant="glass" 
              className="text-center fade-in-up hover:scale-105 transition-transform duration-300"
              style={{animationDelay: `${index * 0.1}s`}}
            >
              <div className="w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-4">
                {stat.icon}
              </div>
              <div className="text-3xl sm:text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent mb-2">
                {stat.number}
              </div>
              <div className="text-lg font-semibold text-foreground mb-2">
                {stat.label}
              </div>
              <div className="text-sm text-muted-foreground">
                {stat.description}
              </div>
            </EnhancedCard>
          ))}
        </div>
      </div>
    </section>
  );
};