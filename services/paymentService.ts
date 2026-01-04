import { UserProfile } from '../types';

export const paymentService = {
  async startCheckout(user: UserProfile) {
    try {
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          customerEmail: user.email,
          userId: user.id
        })
      });

      if (!response.ok) {
        throw new Error('Failed to initiate checkout');
      }

      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      throw error;
    }
  }
};