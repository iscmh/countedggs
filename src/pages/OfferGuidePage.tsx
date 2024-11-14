import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { offers } from '../data/offers';
import { guidesByOffer } from '../data/guides';

export default function OfferGuidePage() {
  const { offerId } = useParams();
  const offer = offers.find(o => o.id === offerId);
  const guides = offerId ? guidesByOffer[offerId] : null;

  if (!offer || !guides) {
    return <Navigate to="/guides" replace />;
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-8 mb-8">
        <h1 className="text-3xl font-bold">{offer.name} Guides</h1>
        <p className="mt-2 text-lg text-blue-100">
          Follow these step-by-step guides to maximize your success with {offer.name}
        </p>
      </div>

      {guides.map((section, index) => {
        const Icon = section.icon;
        return (
          <section key={index} className="space-y-6">
            <div className="flex items-center space-x-3 bg-white p-4 rounded-xl border border-gray-200">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Icon className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                {section.title}
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {section.guides.map((guide, guideIndex) => (
                <div
                  key={guideIndex}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200"
                >
                  <div className="p-6">
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {guide.title}
                      </h3>
                      <p className="mt-1 text-gray-600">
                        {guide.description}
                      </p>
                    </div>

                    <div className="space-y-6">
                      {guide.steps.map((step, stepIndex) => (
                        <div key={stepIndex} className="relative pl-8 pb-6 last:pb-0">
                          <div className="absolute left-0 top-0 bottom-0 w-px bg-blue-100"></div>
                          <div className="absolute left-[-4px] top-2 w-2 h-2 rounded-full bg-blue-500"></div>
                          
                          <div className="space-y-2">
                            <h4 className="font-medium text-gray-900">
                              {step.title}
                            </h4>
                            <div className="text-sm text-gray-600 prose prose-blue max-w-none">
                              {step.content.split('\n').map((paragraph, i) => (
                                <p key={i} className="mb-2">{paragraph}</p>
                              ))}
                            </div>
                            {step.tip && (
                              <div className="mt-3 flex items-start space-x-2 bg-blue-50 p-3 rounded-lg">
                                <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-blue-700">
                                  Pro Tip: {step.tip}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}