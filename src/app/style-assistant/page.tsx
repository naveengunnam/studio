import StyleAssistantForm from '@/components/StyleAssistantForm';

export const metadata = {
  title: 'AI Style Assistant - ShopWave',
  description: 'Find similar products using our AI-powered style assistant.',
};

export default function StyleAssistantPage() {
  return (
    <div className="py-8">
      <StyleAssistantForm />
    </div>
  );
}
