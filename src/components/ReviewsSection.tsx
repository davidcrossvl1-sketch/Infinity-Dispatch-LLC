import React, { useState } from 'react';
import { storage } from '../services/storage';
import { Review, EquipmentType } from '../types';
import {
  Star,
  Quote,
  ShieldCheck,
  CheckCircle2,
  Plus,
  Send,
  Truck,
  MessageSquare,
} from 'lucide-react';

export const ReviewsSection: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>(storage.getReviews());
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [newReview, setNewReview] = useState({
    carrierName: '',
    companyName: '',
    mcNumber: '',
    equipment: 'Dry Van' as EquipmentType,
    rating: 5,
    comment: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.carrierName || !newReview.companyName || !newReview.comment) return;

    const created = storage.submitReview({
      carrierName: newReview.carrierName,
      companyName: newReview.companyName,
      mcNumber: newReview.mcNumber.startsWith('MC') ? newReview.mcNumber : `MC-${newReview.mcNumber}`,
      equipment: newReview.equipment,
      rating: newReview.rating,
      comment: newReview.comment,
      verified: true,
    });

    setReviews([created, ...reviews]);
    setSubmitted(true);
    setTimeout(() => {
      setIsFormOpen(false);
      setSubmitted(false);
      setNewReview({
        carrierName: '',
        companyName: '',
        mcNumber: '',
        equipment: 'Dry Van',
        rating: 5,
        comment: '',
      });
    }, 2000);
  };

  return (
    <section id="reviews" className="py-20 bg-[#070B16] border-t border-blue-900/40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-400 mb-3">
              <span className="w-5 h-px bg-sky-400" />
              <span>Verified Carrier Feedback</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-white tracking-tight">
              Trusted by Owner-Operators Across America
            </h2>
            <p className="mt-3 text-base text-slate-300">
              Read direct feedback from independent drivers and fleet managers who dispatch daily with David Cross & Alvin.
            </p>
          </div>

          <button
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="px-5 py-3 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Leave Carrier Review</span>
          </button>
        </div>

        {/* Submit Review Dropdown Modal/Card */}
        {isFormOpen && (
          <div className="mb-10 p-6 sm:p-8 rounded-3xl bg-[#0B1428] border border-blue-500/40 shadow-2xl">
            {submitted ? (
              <div className="text-center py-6 space-y-2 text-emerald-400 font-mono">
                <CheckCircle2 className="w-10 h-10 mx-auto" />
                <h4 className="text-lg font-bold text-white">Thank You for Your Feedback!</h4>
                <p className="text-xs text-slate-300">Your review has been verified and posted.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-blue-900/40">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-sky-400" />
                    <span>Submit Verified Carrier Review</span>
                  </h3>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setNewReview({ ...newReview, rating: star })}
                        className="p-1 cursor-pointer"
                      >
                        <Star
                          className={`w-4 h-4 ${
                            star <= newReview.rating
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-slate-600'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <input
                    type="text"
                    required
                    placeholder="Your Name (e.g. Derrick C.)"
                    value={newReview.carrierName}
                    onChange={(e) => setNewReview({ ...newReview, carrierName: e.target.value })}
                    className="px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Company Name"
                    value={newReview.companyName}
                    onChange={(e) => setNewReview({ ...newReview, companyName: e.target.value })}
                    className="px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs"
                  />
                  <input
                    type="text"
                    placeholder="MC Number (e.g. MC-1290384)"
                    value={newReview.mcNumber}
                    onChange={(e) => setNewReview({ ...newReview, mcNumber: e.target.value })}
                    className="px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono"
                  />
                </div>

                <textarea
                  rows={3}
                  required
                  placeholder="Share your experience with Infinity Dispatch LLC (rates, communication, factoring, detention support)..."
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500"
                />

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-4 py-2 text-xs text-slate-400 hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl cursor-pointer shadow-md"
                  >
                    Post Review
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews
            .filter((r) => r.isApproved)
            .map((rev) => (
              <div
                key={rev.id}
                className="p-6 rounded-2xl bg-[#0B1326] border border-blue-900/40 hover:border-blue-500/40 transition-all flex flex-col justify-between space-y-4 shadow-xl group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Verified Carrier</span>
                    </span>
                  </div>

                  <p className="text-xs text-slate-200 leading-relaxed italic">
                    "{rev.comment}"
                  </p>
                </div>

                <div className="pt-3 border-t border-blue-900/30 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-white block">{rev.carrierName}</span>
                    <span className="text-[11px] text-slate-400 block truncate max-w-[150px]">
                      {rev.companyName}
                    </span>
                  </div>
                  <div className="text-right font-mono text-[10px] text-slate-400">
                    <span className="text-sky-400 block font-bold">{rev.equipment}</span>
                    <span>{rev.date}</span>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
};
