import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Users, Building2, Clock } from 'lucide-react';

interface StatItemProps {
  end: number;
  suffix?: string;
  label: string;
  duration?: number;
  icon?: React.ReactNode;
}

const StatItem: React.FC<StatItemProps> = ({ end, label, suffix = '', duration = 2000, icon }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const counterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
        if (!entry.isIntersecting) {
          setCount(0);
        }
      },
      { threshold: 0.1 }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    setCount(0);
    const steps = 60;
    const increment = end / steps;
    const stepDuration = duration / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [end, duration, isVisible]);

  return (
    <div ref={counterRef} className="text-center">
      {icon && <div className="mb-4">{icon}</div>}
      <div className="flex items-center justify-center">
        <span className="text-5xl font-bold text-gray-900 font-sofia">
          {count}
        </span>
        <span className="text-5xl font-bold text-gray-900 font-sofia ml-1">{suffix}</span>
      </div>
      <p className="text-gray-600 mt-2 font-sofia text-lg">{label}</p>
    </div>
  );
};

const Stats = () => {
  return (
    <div className="py-16 bg-white w-full">
      <div className="w-full px-4 sm:px-6 md:px-8">
        <h2 className="text-4xl font-sofia font-bold text-center mb-12">Prima Center en chiffres</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <StatItem 
            end={70} 
            suffix="+" 
            label="Boutiques" 
          />
          <StatItem 
            end={900} 
            suffix="K" 
            label="Visiteurs par an" 
          />
          <StatItem 
            end={45} 
            suffix="k" 
            label="m² de surface" 
          />
          <StatItem 
            end={365} 
            label="Jours d'ouverture" 
          />
        </div>
      </div>
    </div>
  );
};

export default Stats; 