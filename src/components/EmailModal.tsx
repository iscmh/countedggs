import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { offers } from '../data/offers';

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  offerId: string;
}

export default function EmailModal({ isOpen, onClose, offerId }: EmailModalProps) {
  const [discordUsername, setDiscordUsername] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const offer = offers.find(o => o.id === offerId);
  
  // Check verification status on mount
  useEffect(() => {
    if (isOpen) {
      const verifiedOffers = JSON.parse(localStorage.getItem('verifiedOffers') || '{}');
      if (verifiedOffers[offerId]) {
        navigate(`/offer/${offerId}`, { replace: true });
        onClose();
      }
    }
  }, [isOpen, offerId, navigate, onClose]);

  if (!isOpen || !offer) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await fetch('https://discord.com/api/webhooks/1301773131962384394/6bo5kQ49xoFyGaucKmsbifnMqau830oF6s22IUBCi5BHfoPSdzqgkeBYO6D-G5QU3fLs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: `New offer signup:\nDiscord Username: ${discordUsername}\nOffer ID: ${offerId}\nTimestamp: ${new Date().toISOString()}`,
        }),
      });

      // Store verification status
      const verifiedOffers = JSON.parse(localStorage.getItem('verifiedOffers') || '{}');
      verifiedOffers[offerId] = {
        discordUsername,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('verifiedOffers', JSON.stringify(verifiedOffers));

      // Navigate and close modal
      navigate(`/offer/${offerId}`, { replace: true });
      onClose();
    } catch (error) {
      console.error('Error submitting discord username:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onClose();
    // Navigate back if we're on the offer details page
    if (window.location.pathname.includes('/offer/')) {
      navigate(-1);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-xl w-full mx-4 relative animate-fadeIn shadow-xl">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors duration-200"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="space-y-6">
          <h3 className="text-2xl font-semibold text-gray-900">
            Enter your Discord username to continue
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              value={discordUsername}
              onChange={(e) => setDiscordUsername(e.target.value)}
              placeholder="Discord username"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              required
            />
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <span>Get Tracking Link</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
