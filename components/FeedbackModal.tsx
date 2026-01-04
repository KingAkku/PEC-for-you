import React, { useState } from 'react';
import { X, MessageSquare, Star, Send } from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setTimeout(() => {
        onClose();
        setIsSubmitted(false);
        setRating(0);
      }, 2000);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/30 backdrop-blur-md transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white/90 backdrop-blur-xl border border-white/50 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="p-8">
          {isSubmitted ? (
            <div className="text-center py-8 animate-in fade-in zoom-in duration-300">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send size={28} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Thank You!</h2>
              <p className="text-slate-500">Your feedback helps us improve the platform.</p>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <div className="w-12 h-12 bg-slate-100 text-slate-900 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <MessageSquare size={24} />
                </div>
                <h2 className="text-2xl font-display text-slate-900 mb-2">
                  Send Feedback
                </h2>
                <p className="text-slate-500 text-sm">
                  Found a bug or have a feature request? Let us know!
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Category</label>
                  <select className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all text-slate-700">
                    <option>General Feedback</option>
                    <option>Report a Bug</option>
                    <option>Feature Request</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Rating</label>
                  <div className="flex gap-2 justify-center py-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className={`p-1 transition-all hover:scale-110 ${rating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300'}`}
                      >
                        <Star size={28} fill={rating >= star ? "currentColor" : "none"} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Message</label>
                  <textarea 
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all min-h-[100px]"
                    placeholder="Tell us what you think..."
                    required
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 flex items-center justify-center space-x-2 mt-4"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <span>Submit Feedback</span>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;