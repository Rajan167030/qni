'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Mail, Phone, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function JoinPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    expertise: '',
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
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsSubmitted(true);
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        company: '',
        position: '',
        expertise: '',
        message: '',
      });
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 3000);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      {/* Navigation Header */}
      <header className="fixed z-40 top-0 left-0 right-0 px-6 lg:px-8 py-6">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-display text-2xl">QNI</span>
            <span className="text-muted-foreground font-mono text-xs mt-1">Quantum</span>
          </Link>
          <Link 
            href="/" 
            className="text-sm text-foreground/70 hover:text-foreground transition-colors"
          >
            Back to home
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative pt-24 pb-16">
        {/* Background Elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-foreground/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-foreground/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="max-w-6xl mx-auto px-6 lg:px-8" ref={sectionRef}>
          {/* Header Section */}
          <div className={`mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h1 className="text-5xl md:text-6xl font-display mb-6 leading-tight">
              Join Our <span className="text-foreground/70">Mission</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed mb-8">
              Become part of Quantum Nexus India and help shape the future of quantum computing. Whether you're a researcher, engineer, or innovator, we'd love to have you on board.
            </p>
            
            {/* Quick Contact Info */}
            <div className="flex flex-col sm:flex-row gap-8 mb-12">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-foreground/60" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <a href="mailto:join@qni.com" className="text-foreground hover:text-foreground/70 transition-colors">join@qni.com</a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-foreground/60" />
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <a href="tel:+919876543210" className="text-foreground hover:text-foreground/70 transition-colors">+91 98765 43210</a>
                </div>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className={`grid lg:grid-cols-3 gap-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
               style={{ transitionDelay: '100ms' }}>
            {/* Form */}
            <div className="lg:col-span-2">
              <div className="bg-foreground/5 border border-foreground/10 rounded-2xl p-8 backdrop-blur-sm">
                {isSubmitted ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="mb-4 p-3 rounded-full bg-foreground/10">
                      <CheckCircle2 className="w-8 h-8 text-foreground" />
                    </div>
                    <h3 className="text-2xl font-display mb-2">Thank you!</h3>
                    <p className="text-muted-foreground mb-6">
                      We've received your application. Our team will review it and get back to you soon.
                    </p>
                    <Link 
                      href="/" 
                      className="text-sm text-foreground hover:text-foreground/70 transition-colors flex items-center gap-2"
                    >
                      Back to home <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="fullName" className="block text-sm font-medium mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          id="fullName"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          required
                          placeholder="John Doe"
                          className="w-full px-4 py-3 rounded-lg bg-background border border-foreground/20 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground/50 transition-colors"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          placeholder="john@example.com"
                          className="w-full px-4 py-3 rounded-lg bg-background border border-foreground/20 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground/50 transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+91 98765 43210"
                          className="w-full px-4 py-3 rounded-lg bg-background border border-foreground/20 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground/50 transition-colors"
                        />
                      </div>
                      <div>
                        <label htmlFor="company" className="block text-sm font-medium mb-2">
                          Company/Organization
                        </label>
                        <input
                          type="text"
                          id="company"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          placeholder="Tech Company"
                          className="w-full px-4 py-3 rounded-lg bg-background border border-foreground/20 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground/50 transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="position" className="block text-sm font-medium mb-2">
                          Position/Role *
                        </label>
                        <input
                          type="text"
                          id="position"
                          name="position"
                          value={formData.position}
                          onChange={handleChange}
                          required
                          placeholder="e.g., Quantum Engineer"
                          className="w-full px-4 py-3 rounded-lg bg-background border border-foreground/20 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground/50 transition-colors"
                        />
                      </div>
                      <div>
                        <label htmlFor="expertise" className="block text-sm font-medium mb-2">
                          Area of Expertise *
                        </label>
                        <select
                          id="expertise"
                          name="expertise"
                          value={formData.expertise}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 rounded-lg bg-background border border-foreground/20 text-foreground focus:outline-none focus:border-foreground/50 transition-colors"
                        >
                          <option value="">Select an option</option>
                          <option value="quantum-algorithms">Quantum Algorithms</option>
                          <option value="quantum-hardware">Quantum Hardware</option>
                          <option value="ml-engineering">ML Engineering</option>
                          <option value="product-design">Product Design</option>
                          <option value="devops-infrastructure">DevOps & Infrastructure</option>
                          <option value="research">Research</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium mb-2">
                        Tell us about yourself
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Share your background, experience, and why you'd like to join QNI..."
                        rows={5}
                        className="w-full px-4 py-3 rounded-lg bg-background border border-foreground/20 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground/50 transition-colors resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 px-6 bg-foreground text-background rounded-lg font-medium hover:bg-foreground/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isLoading ? 'Submitting...' : 'Submit Application'}
                      {!isLoading && <ArrowRight className="w-4 h-4" />}
                    </button>

                    <p className="text-xs text-muted-foreground text-center">
                      By submitting this form, you agree to our privacy policy and terms of service.
                    </p>
                  </form>
                )}
              </div>
            </div>

            {/* Info Section */}
            <div className="lg:col-span-1">
              <div className={`space-y-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                   style={{ transitionDelay: '200ms' }}>
                {/* What We're Looking For */}
                <div>
                  <h3 className="text-lg font-display mb-4">What We're Looking For</h3>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex gap-3">
                      <span className="text-foreground font-semibold">•</span>
                      <span>Passion for quantum computing</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-foreground font-semibold">•</span>
                      <span>Strong technical background</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-foreground font-semibold">•</span>
                      <span>Problem-solving mindset</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-foreground font-semibold">•</span>
                      <span>Collaborative team player</span>
                    </li>
                  </ul>
                </div>

                {/* Benefits */}
                <div>
                  <h3 className="text-lg font-display mb-4">Why Join QNI?</h3>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex gap-3">
                      <span className="text-foreground font-semibold">✓</span>
                      <span>Work on cutting-edge quantum tech</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-foreground font-semibold">✓</span>
                      <span>Collaborate with world-class team</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-foreground font-semibold">✓</span>
                      <span>Competitive compensation</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-foreground font-semibold">✓</span>
                      <span>Remote & flexible work options</span>
                    </li>
                  </ul>
                </div>

                {/* FAQ */}
                <div className="bg-foreground/5 border border-foreground/10 rounded-lg p-4">
                  <p className="text-sm font-medium mb-2">Have questions?</p>
                  <p className="text-xs text-muted-foreground mb-3">
                    Check out our FAQ or contact us directly.
                  </p>
                  <Link 
                    href="/contact" 
                    className="text-xs text-foreground hover:text-foreground/70 transition-colors"
                  >
                    Contact us →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
