'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, ArrowRight, CheckCircle2, Globe2, Award, Sparkles, ShieldCheck, Cpu, ArrowLeft, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { saveJoin } from '@/lib/submissions-store';

export default function JoinPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    expertise: 'just-exploring',
    experience: 'Beginner',
    country: 'India',
    message: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));

      // Save to Admin Store
      saveJoin({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone || 'N/A',
        company: formData.company,
        position: formData.position,
        expertise: formData.expertise,
        experience: formData.experience,
        country: formData.country,
        message: formData.message,
      });

      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Top Header */}
      <header className="fixed z-50 top-0 left-0 right-0 px-6 lg:px-12 py-4 border-b border-foreground/10 bg-background/90 backdrop-blur-md">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center group">
            <Image src="/logo-mark.png" alt="QNexus" width={789} height={302} className="h-12 w-auto" />
          </Link>
          <Link 
            href="/" 
            className="flex items-center gap-2 text-sm text-foreground/60 hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>
        </div>
      </header>

      {/* Main Content Container */}
      <div className="relative pt-28 pb-24">
        {/* Ambient background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[450px] bg-foreground/5 blur-[160px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 lg:px-12" ref={sectionRef}>
          {/* Header Banner */}
          <div className={`mb-16 text-center max-w-3xl mx-auto transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-foreground/15 bg-foreground/5 text-xs font-mono tracking-wider uppercase mb-6 text-foreground">
              <Globe2 className="w-4 h-4 text-sky-500" />
              <span>A Student-First Quantum Community</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-display tracking-tight text-foreground mb-6 leading-[1.05]">
              Join the Community
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed">
              Connect with researchers, industry leaders, and peers through free talks, mentorship, and workshops — regardless of your background or resources.
            </p>

            {/* Quick Metrics Bar */}
            <div className="flex flex-wrap items-center justify-center gap-8 mt-10 pt-8 border-t border-foreground/10 text-xs font-mono text-muted-foreground">
              <span className="flex items-center gap-2 text-foreground font-medium">
                <Users className="w-4 h-4 text-emerald-500" /> Free, Always
              </span>
              <span className="flex items-center gap-2 text-foreground font-medium">
                <Award className="w-4 h-4 text-amber-500" /> Student-First
              </span>
              <span className="flex items-center gap-2 text-foreground font-medium">
                <Cpu className="w-4 h-4 text-sky-500" /> Open Worldwide
              </span>
            </div>
          </div>

          {/* Form & Sidebar Grid */}
          <div className={`grid lg:grid-cols-12 gap-12 items-start transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            
            {/* Form Column */}
            <div className="lg:col-span-8">
              <div className="rounded-3xl border border-foreground/15 bg-background/80 backdrop-blur-xl p-8 md:p-12 shadow-2xl relative">
                {isSubmitted ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-500 flex items-center justify-center mb-6">
                      <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                    </div>
                    <h3 className="text-3xl font-display text-foreground mb-3">You're In!</h3>
                    <p className="text-muted-foreground max-w-md mb-8 leading-relaxed">
                      Thank you for joining QNexus. We'll be in touch soon with details on upcoming talks, workshops, and how to get involved.
                    </p>
                    <Button
                      onClick={() => setIsSubmitted(false)}
                      variant="outline"
                      className="rounded-full px-8"
                    >
                      Submit Another Application
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div>
                      <h3 className="text-2xl font-display text-foreground mb-1">Community Application</h3>
                      <p className="text-xs font-mono text-muted-foreground">Tell us a bit about yourself so we can get you involved.</p>
                    </div>

                    {/* Personal Info Grid */}
                    <div className="space-y-6">
                      <div className="grid sm:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="fullName" className="block text-xs font-mono text-foreground/70 uppercase tracking-wider mb-2">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                            placeholder="Dr. Eleanor Vance"
                            className="w-full px-4 py-3.5 rounded-2xl bg-foreground/5 border border-foreground/15 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground/50 transition-colors text-sm"
                          />
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-xs font-mono text-foreground/70 uppercase tracking-wider mb-2">
                            Email *
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="you@example.com"
                            className="w-full px-4 py-3.5 rounded-2xl bg-foreground/5 border border-foreground/15 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground/50 transition-colors text-sm"
                          />
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="phone" className="block text-xs font-mono text-foreground/70 uppercase tracking-wider mb-2">
                            Phone / WhatsApp (Optional)
                          </label>
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+91 8860573577"
                            className="w-full px-4 py-3.5 rounded-2xl bg-foreground/5 border border-foreground/15 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground/50 transition-colors text-sm"
                          />
                        </div>
                        <div>
                          <label htmlFor="company" className="block text-xs font-mono text-foreground/70 uppercase tracking-wider mb-2">
                            College / University (Optional)
                          </label>
                          <input
                            type="text"
                            id="company"
                            name="company"
                            value={formData.company}
                            onChange={handleChange}
                            placeholder="Your college or university"
                            className="w-full px-4 py-3.5 rounded-2xl bg-foreground/5 border border-foreground/15 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground/50 transition-colors text-sm"
                          />
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="position" className="block text-xs font-mono text-foreground/70 uppercase tracking-wider mb-2">
                            Current Role *
                          </label>
                          <input
                            type="text"
                            id="position"
                            name="position"
                            value={formData.position}
                            onChange={handleChange}
                            required
                            placeholder="Student / Researcher / Engineer"
                            className="w-full px-4 py-3.5 rounded-2xl bg-foreground/5 border border-foreground/15 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground/50 transition-colors text-sm"
                          />
                        </div>
                        <div>
                          <label htmlFor="country" className="block text-xs font-mono text-foreground/70 uppercase tracking-wider mb-2">
                            Country / Region *
                          </label>
                          <input
                            type="text"
                            id="country"
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            required
                            placeholder="India, USA, Germany..."
                            className="w-full px-4 py-3.5 rounded-2xl bg-foreground/5 border border-foreground/15 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground/50 transition-colors text-sm"
                          />
                        </div>
                      </div>

                      {/* Primary Quantum Focus */}
                      <div>
                        <label htmlFor="expertise" className="block text-xs font-mono text-foreground/70 uppercase tracking-wider mb-2">
                          Primary Area of Interest *
                        </label>
                        <select
                          id="expertise"
                          name="expertise"
                          value={formData.expertise}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3.5 rounded-2xl bg-foreground/5 border border-foreground/15 text-foreground focus:outline-none focus:border-foreground/50 transition-colors text-sm"
                        >
                          <option value="just-exploring">Just Exploring / New to Quantum</option>
                          <option value="quantum-algorithms">Quantum Algorithms & Computing</option>
                          <option value="quantum-ml">Quantum Machine Learning</option>
                          <option value="quantum-hardware">Quantum Hardware & Devices</option>
                          <option value="research-mentorship">Research & Mentorship</option>
                          <option value="career-guidance">Careers & Internships in Quantum</option>
                          <option value="community-building">Community Building & Events</option>
                        </select>
                      </div>

                      {/* Experience Level */}
                      <div>
                        <label className="block text-xs font-mono text-foreground/70 uppercase tracking-wider mb-2">
                          Quantum Computing Experience Level
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                          {['Beginner', 'Intermediate', 'Advanced / Fellow'].map((lvl) => (
                            <button
                              key={lvl}
                              type="button"
                              onClick={() => setFormData({ ...formData, experience: lvl })}
                              className={`py-3 rounded-xl text-xs font-mono font-semibold border transition-all ${
                                formData.experience === lvl
                                  ? 'bg-foreground text-background border-foreground shadow-md'
                                  : 'border-foreground/15 bg-foreground/5 text-foreground/70 hover:border-foreground/30'
                              }`}
                            >
                              {lvl}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Statement */}
                      <div>
                        <label htmlFor="message" className="block text-xs font-mono text-foreground/70 uppercase tracking-wider mb-2">
                          What draws you to quantum? (Optional)
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          placeholder="Tell us a bit about your background and what you're hoping to get out of the community..."
                          rows={4}
                          className="w-full px-4 py-3.5 rounded-2xl bg-foreground/5 border border-foreground/15 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground/50 transition-colors text-sm resize-none"
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      size="lg"
                      className="w-full h-14 rounded-full bg-foreground hover:bg-foreground/90 text-background text-base font-semibold shadow-xl group"
                    >
                      {isLoading ? (
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                          Submitting...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          Join the Community
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                      )}
                    </Button>

                    <p className="text-[11px] font-mono text-muted-foreground text-center flex items-center justify-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                      Your data is kept private and never shared without your consent.
                    </p>
                  </form>
                )}
              </div>
            </div>

            {/* Sidebar Benefits Column */}
            <div className="lg:col-span-4 space-y-8">
              {/* Member Privileges Card */}
              <div className="p-8 rounded-3xl border border-foreground/15 bg-foreground/5 backdrop-blur-md space-y-6">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  <h3 className="font-display text-xl text-foreground font-bold">Why Join?</h3>
                </div>

                <div className="space-y-4 text-sm">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-foreground">Free Talks & Workshops</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Learn directly from researchers and industry professionals — always free.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-foreground">Mentorship & Guidance</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Get matched with mentors for career guidance and research opportunities.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-foreground">Hackathons & Projects</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Build real things through hackathons, research collaborations, and student-led projects.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-foreground">A Real Community</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Connect with peers, researchers, and industry leaders — not just one-way lectures.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Direct Support Box */}
              <div className="p-6 rounded-3xl border border-foreground/10 bg-background/60 backdrop-blur-md space-y-4">
                <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Need Direct Support?</p>
                <div className="space-y-3 text-sm">
                  <a href="mailto:rajan.quantumnexusgobal@gmail.com" className="flex items-center gap-3 text-foreground hover:text-emerald-500 transition-colors">
                    <Mail className="w-4 h-4 text-foreground/60" />
                    <span>rajan.quantumnexusgobal@gmail.com</span>
                  </a>
                  <a href="tel:+918860573577" className="flex items-center gap-3 text-foreground hover:text-emerald-500 transition-colors">
                    <Phone className="w-4 h-4 text-foreground/60" />
                    <span>+91 8860573577</span>
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
