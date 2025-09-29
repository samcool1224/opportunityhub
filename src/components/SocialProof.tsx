import { Star } from 'lucide-react';
import { EnhancedCard } from './EnhancedCard';

export const SocialProof = () => {
  const partners = [
    { name: 'Google', logo: '/api/placeholder/120/60' },
    { name: 'Microsoft', logo: '/api/placeholder/120/60' },
    { name: 'Goldman Sachs', logo: '/api/placeholder/120/60' },
    { name: 'MIT', logo: '/api/placeholder/120/60' },
    { name: 'Stanford', logo: '/api/placeholder/120/60' },
    { name: 'American Red Cross', logo: '/api/placeholder/120/60' },
  ];

  const testimonials = [
    {
      quote: "FutureForge helped me land an amazing internship at a tech startup. I never would have found this opportunity otherwise!",
      author: "Jamie L.",
      role: "Undergraduate Student, Computer Science",
      avatar: "/test1.png",
      rating: 5
    },
    {
      quote: "As a nonprofit organization, we've found incredible student volunteers through FutureForge. The platform makes it easy to connect with passionate young talent.",
      author: "Maria G.",
      role: "Program Director, Education Nonprofit",
      avatar: "/test2.png",
      rating: 5
    },
    {
      quote: "I discovered a national business competition through FutureForge that ended up being a turning point in my entrepreneurial journey. The platform is a game-changer for students.",
      author: "David T.",
      role: "High School Senior",
      avatar: "/test3.png",
      rating: 5
    }
  ];

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star 
        key={i} 
        className={`w-5 h-5 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
      />
    ));
  };

  return (
    <section className="py-20 bg-gradient-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Partner Logos */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-semibold text-foreground mb-2">
              Trusted by Students and Organizations
            </h3>
            <p className="text-muted-foreground">
              Opportunities featured from respected companies and institutions
            </p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-80">
            {partners.map((partner, index) => (
              <div key={index} className="h-12 flex items-center">
                <img 
                  src={partner.logo} 
                  alt={partner.name}
                  className="h-8 w-auto max-w-32 object-contain"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
          <div className="text-center mt-6 text-sm text-muted-foreground">
            Every opportunity is reviewed for legitimacy and student suitability.
          </div>
        </div>

        {/* Testimonials */}
        <div className="text-center mb-12">
          <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
            Verified Impact from Our Community
          </h3>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Stories from students and organizations who discovered trusted opportunities on FutureForge
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <EnhancedCard 
              key={index} 
              variant="glass" 
              className="fade-in-up hover:shadow-lg transition-shadow duration-300"
              style={{animationDelay: `${index * 0.2}s`}}
            >
              <div className="flex flex-col h-full">
                <div className="flex mb-4">
                  {renderStars(testimonial.rating)}
                </div>
                <p className="text-foreground mb-6 italic leading-relaxed flex-grow">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center space-x-4 mt-auto">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.author}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="text-left">
                    <div className="font-semibold text-foreground">
                      {testimonial.author}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </div>
            </EnhancedCard>
          ))}
        </div>
      </div>
    </section>
  );
};