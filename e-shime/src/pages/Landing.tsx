import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Heart, Music, Palette, MessageCircle, TrendingUp, Shield, Users } from 'lucide-react';
import { Button } from '../components/ui/button';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

interface LandingProps {
  darkMode: boolean;
}

export function Landing({ darkMode }: LandingProps) {
  const features = [
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Mood Tracking",
      description: "Track your emotional journey and identify patterns over time."
    },
    {
      icon: <MessageCircle className="h-8 w-8" />,
      title: "Anonymous Support",
      description: "Chat with trained counselors and peers in a safe, judgment-free space."
    },
    {
      icon: <Palette className="h-8 w-8" />,
      title: "Creative Expression",
      description: "Explore healing through art, music, dance, poetry, and theatre."
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Peer Stories",
      description: "Share your story and find strength in the experiences of others."
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Professional Care",
      description: "Book sessions with licensed therapists who understand your culture."
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Privacy First",
      description: "Your identity and data are protected with complete anonymity."
    }
  ];

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-[#F5F5DC]'} transition-colors duration-300`}>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <Heart className={`h-12 w-12 ${darkMode ? 'text-beige' : 'text-black'} fill-current`} />
                <div>
                  <h1 className={`${darkMode ? 'text-white' : 'text-black'}`}>E-SHIME</h1>
                  <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Healing through Expression</p>
                </div>
              </div>
              
              <h2 className={`${darkMode ? 'text-white' : 'text-black'} mb-6`}>
                Promoting mental wellbeing through arts, culture, and digital connection.
              </h2>
              
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-8`}>
                A safe, culturally-grounded digital space for African youth to explore mental health support, 
                creative expression, and peer connection. Because healing happens in community.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link to="/register">
                  <Button size="lg" className={darkMode ? 'bg-beige text-black hover:bg-beige/90' : 'bg-black text-white hover:bg-black/90'}>
                    Get Started
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="outline">
                    Login
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1736722679797-6d6c70a87826?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIweW91dGglMjBhcnQlMjB0aGVyYXB5fGVufDF8fHx8MTc2MjMzNzAwOHww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="African youth engaging in art therapy"
                  className="w-full h-auto"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className={`py-16 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className={`${darkMode ? 'text-white' : 'text-black'} mb-4`}>
              Our Mission
            </h2>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} max-w-3xl mx-auto`}>
              E-SHIME exists to break the silence around mental health in African communities. 
              We combine traditional healing wisdom with modern therapeutic approaches, creating 
              a space where young people can express themselves, find support, and heal together.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`text-center ${darkMode ? 'text-white' : 'text-black'} mb-12`}
          >
            How E-SHIME Supports You
          </motion.h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow`}
              >
                <div className={`${darkMode ? 'text-beige' : 'text-black'} mb-4`}>
                  {feature.icon}
                </div>
                <h3 className={`${darkMode ? 'text-white' : 'text-black'} mb-3`}>
                  {feature.title}
                </h3>
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`py-20 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className={`${darkMode ? 'text-white' : 'text-black'} mb-4`}>
              Ready to Start Your Healing Journey?
            </h2>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-8`}>
              Join thousands of African youth who are taking control of their mental wellbeing.
            </p>
            <Link to="/register">
              <Button size="lg" className={darkMode ? 'bg-beige text-black hover:bg-beige/90' : 'bg-black text-white hover:bg-black/90'}>
                Join E-SHIME Today
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-8 ${darkMode ? 'bg-gray-900 border-t border-gray-800' : 'bg-[#F5F5DC] border-t border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            © 2025 E-SHIME. All rights reserved. | Promoting mental wellbeing in African communities.
          </p>
        </div>
      </footer>
    </div>
  );
}
