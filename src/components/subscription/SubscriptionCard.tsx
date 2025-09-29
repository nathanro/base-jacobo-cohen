import { useState } from 'react';
import { Check } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from '@/integrations/supabase/client';
import { showError, showSuccess } from '@/utils/toast';
import { useAuth } from '@/contexts/AuthContext';

// In a real app, this would connect to a payment processor like Stripe
// For this demo, we'll simulate the subscription process

export function SubscriptionCard() {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(false);

  const isPremium = profile?.subscription_status === 'premium';

  const handleSubscribe = async () => {
    if (!user) {
      showError('You must be logged in to subscribe');
      return;
    }

    setLoading(true);

    try {
      // In a real app, this would redirect to a payment page
      // For this demo, we'll just update the user's subscription status

      const oneYearFromNow = new Date();
      oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

      const { error } = await supabase.
      from('profiles').
      update({
        subscription_status: 'premium',
        subscription_end_date: oneYearFromNow.toISOString()
      }).
      eq('id', user.id);

      if (error) throw error;

      showSuccess('Successfully subscribed to premium plan!');

      // Refresh the page to update the auth context
      window.location.reload();
    } catch (error: any) {
      showError(error.message || 'Failed to process subscription');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!user) return;

    setLoading(true);

    try {
      const { error } = await supabase.
      from('profiles').
      update({
        subscription_status: 'free',
        subscription_end_date: null
      }).
      eq('id', user.id);

      if (error) throw error;

      showSuccess('Your subscription has been canceled');

      // Refresh the page to update the auth context
      window.location.reload();
    } catch (error: any) {
      showError(error.message || 'Failed to cancel subscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Premium Subscription</CardTitle>
        <CardDescription>
          Get access to all premium financial datasets
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <span className="text-4xl font-bold">$9.99</span>
          <span className="text-muted-foreground">/month</span>
        </div>
        
        <ul className="space-y-2">
          <li className="flex items-center">
            <Check className="h-4 w-4 mr-2 text-green-500" />
            <span>Access to all premium datasets</span>
          </li>
          <li className="flex items-center">
            <Check className="h-4 w-4 mr-2 text-green-500" />
            <span>Advanced filtering and sorting</span>
          </li>
          <li className="flex items-center">
            <Check className="h-4 w-4 mr-2 text-green-500" />
            <span>Data export functionality</span>
          </li>
          <li className="flex items-center">
            <Check className="h-4 w-4 mr-2 text-green-500" />
            <span>Priority customer support</span>
          </li>
        </ul>
      </CardContent>
      <CardFooter>
        {isPremium ?
        <Button
          variant="outline"
          className="w-full"
          onClick={handleCancelSubscription}
          disabled={loading}>

            {loading ? 'Processing...' : 'Cancel Subscription'}
          </Button> :

        <Button
          className="w-full"
          onClick={handleSubscribe}
          disabled={loading}>

            {loading ? 'Processing...' : 'Subscribe Now'}
          </Button>
        }
      </CardFooter>
    </Card>);

}