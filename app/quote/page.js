import Navigation from '@/components/Navigation';
import InsuranceQuoteForm from '@/components/InsuranceQuoteForm';

export default function QuotePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <InsuranceQuoteForm />
    </div>
  );
}