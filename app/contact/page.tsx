'use client';

import { useState, useRef, useEffect } from 'react';
import { Mail, Phone, MapPin, Linkedin, Twitter, Send } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setSubmitSuccess(true);
    setFormData({ name: '', email: '', company: '', subject: '', message: '' });
    
    setTimeout(() => {
      setSubmitSuccess(false);
    }, 3000);
    
    setIsSubmitting(false);
  };

  const contactMethods = [
    {
      icon: Mail,
      title: 'Email',
      content: 'hello@optimus.ai',
      link: 'mailto:hello@optimus.ai',
    },
    {
      icon: Phone,
      title: 'Phone',
      content: '+1 (555) 123-4567',
      link: 'tel:+15551234567',
    },
    {
      icon: MapPin,
      title: 'Office',
      content: 'San Francisco, CA',
      link: '#',
    },
  ];

  const officeLocations = [
    {
      city: 'San Francisco',
      address: '123 Tech Street, Suite 100',
      timezone: 'PST (UTC-8)',
      team: 'Product & Engineering',
    },
    {
      city: 'New York',
      address: '456 Innovation Ave, Floor 20',
      timezone: 'EST (UTC-5)',
      team: 'Sales & Success',
    },
    {
      city: 'London',
      address: '789 Enterprise Rd, Building A',
      timezone: 'GMT (UTC+0)',
      team: 'European Operations',
    },
  ];

  return (
    <div ref={pageRef} className="min-h-screen bg-background">
      {/* Navigation Back */}
      <div className="fixed top-0 left-0 right-0 z-50 border-b border-foreground/10 bg-background/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-foreground transition-colors"
          >
            <span>←</span> Back to home
          </a>
        </div>
      </div>

      {/* Header */}
      <div className="pt-32 pb-20 border-b border-foreground/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div
            className={`transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-6">
              <span className="w-8 h-px bg-foreground/30" />
              Get in touch
            </span>
            <h1 className="text-5xl lg:text-7xl font-display tracking-tight mb-6">
              Let's talk about your AI infrastructure.
            </h1>
            <p className="text-lg text-foreground/60 max-w-2xl leading-relaxed">
              Have questions about Optimus? Want to schedule a demo? Interested in enterprise partnerships? Our team is here to help you build and deploy quantum ML solutions at scale.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-3 gap-12 lg:gap-16">
            {/* Contact Methods */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-display mb-8">Quick Contact</h3>
                <div className="space-y-6">
                  {contactMethods.map((method) => {
                    const Icon = method.icon;
                    return (
                      <a
                        key={method.title}
                        href={method.link}
                        className="group block p-6 border border-foreground/10 rounded-xl hover:border-foreground/30 hover:bg-foreground/5 transition-all duration-300"
                      >
                        <div className="flex items-start gap-4">
                          <Icon className="w-5 h-5 text-foreground/60 group-hover:text-foreground transition-colors mt-1" />
                          <div>
                            <p className="text-sm font-mono text-foreground/50 uppercase tracking-wider">
                              {method.title}
                            </p>
                            <p className="text-foreground mt-1 font-medium">
                              {method.content}
                            </p>
                          </div>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>

              {/* Social Links */}
              <div>
                <h3 className="text-sm font-mono text-foreground/50 uppercase tracking-wider mb-4">
                  Follow us
                </h3>
                <div className="flex items-center gap-4">
                  <a
                    href="#"
                    className="w-10 h-10 rounded-lg border border-foreground/10 hover:border-foreground/30 flex items-center justify-center hover:bg-foreground/5 transition-all duration-300"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 rounded-lg border border-foreground/10 hover:border-foreground/30 flex items-center justify-center hover:bg-foreground/5 transition-all duration-300"
                  >
                    <Twitter className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-mono text-foreground/50 uppercase tracking-wider mb-3">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-background border border-foreground/10 rounded-lg focus:border-foreground/30 focus:outline-none transition-colors text-foreground placeholder-foreground/30"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-mono text-foreground/50 uppercase tracking-wider mb-3">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-background border border-foreground/10 rounded-lg focus:border-foreground/30 focus:outline-none transition-colors text-foreground placeholder-foreground/30"
                      placeholder="john@company.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-mono text-foreground/50 uppercase tracking-wider mb-3">
                    Company
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-background border border-foreground/10 rounded-lg focus:border-foreground/30 focus:outline-none transition-colors text-foreground placeholder-foreground/30"
                    placeholder="Your Company"
                  />
                </div>

                <div>
                  <label className="block text-sm font-mono text-foreground/50 uppercase tracking-wider mb-3">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-background border border-foreground/10 rounded-lg focus:border-foreground/30 focus:outline-none transition-colors text-foreground placeholder-foreground/30"
                    placeholder="How can we help?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-mono text-foreground/50 uppercase tracking-wider mb-3">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 bg-background border border-foreground/10 rounded-lg focus:border-foreground/30 focus:outline-none transition-colors text-foreground placeholder-foreground/30 resize-none"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || submitSuccess}
                  className="w-full py-4 px-6 bg-foreground text-background rounded-lg font-medium hover:bg-foreground/90 disabled:bg-foreground/50 transition-all duration-300 flex items-center justify-center gap-2 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <span className="inline-block animate-spin">◐</span>
                      Sending...
                    </>
                  ) : submitSuccess ? (
                    <>
                      <span>✓</span> Message sent!
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Office Locations */}
      <div className="border-t border-foreground/10 py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="mb-16">
            <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-6">
              <span className="w-8 h-px bg-foreground/30" />
              Our offices
            </span>
            <h2 className="text-4xl lg:text-5xl font-display tracking-tight">
              Visit us around the world.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {officeLocations.map((location) => (
              <div
                key={location.city}
                className="p-8 border border-foreground/10 rounded-xl hover:border-foreground/20 hover:bg-foreground/5 transition-all duration-300"
              >
                <h3 className="text-2xl font-display mb-6">{location.city}</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-mono text-foreground/50 uppercase tracking-wider mb-1">
                      Address
                    </p>
                    <p className="text-foreground">{location.address}</p>
                  </div>
                  <div>
                    <p className="text-sm font-mono text-foreground/50 uppercase tracking-wider mb-1">
                      Timezone
                    </p>
                    <p className="text-foreground">{location.timezone}</p>
                  </div>
                  <div>
                    <p className="text-sm font-mono text-foreground/50 uppercase tracking-wider mb-1">
                      Team
                    </p>
                    <p className="text-foreground">{location.team}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
