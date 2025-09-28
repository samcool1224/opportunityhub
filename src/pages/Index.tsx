import { Layout } from '@/components/Layout';
import { HeroSection } from '@/components/HeroSection';
import { StatsSection } from '@/components/StatsSection';
import { SocialProof } from '@/components/SocialProof';
import { FinalCTA } from '@/components/FinalCTA';

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <StatsSection />
      <SocialProof />
      <FinalCTA />
    </Layout>
  );
};

export default Index;
