import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Users, Building2, Clock } from 'lucide-react';

interface StatItemProps {
  end: number;
  start?: number;
  suffix?: string;
  prefix?: string;
  label: string;
  duration?: number;
  icon?: React.ReactNode;
  /** Formater la valeur affichée (ex: 100000 → "100k", 1000000 → "1M") */
  formatDisplay?: (value: number) => string;
}

const StatItem: React.FC<StatItemProps> = ({ end, start, label, suffix = '', prefix = '', duration = 2000, icon, formatDisplay }) => {
  const initial = start ?? 0;
  const [count, setCount] = useState(initial);
  const [isVisible, setIsVisible] = useState(false);
  const counterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
        if (!entry.isIntersecting) {
          setCount(initial);
        }
      },
      { threshold: 0.1 }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => observer.disconnect();
  }, [initial]);

  useEffect(() => {
    if (!isVisible) return;

    setCount(initial);
    const stepSize = start !== undefined ? (end - start) / 9 : end / 60;
    const steps = start !== undefined ? 9 : 60;
    const stepDuration = duration / steps;
    let current = initial;

    const timer = setInterval(() => {
      current += stepSize;
      if (current >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [end, start, duration, isVisible, initial]);

  const displayValue = formatDisplay ? formatDisplay(count) : `${prefix}${count}${suffix}`;

  return (
    <div ref={counterRef} className="text-center overflow-visible">
      {icon && <div className="mb-4">{icon}</div>}
      <div className="flex items-center justify-center overflow-visible py-1">
        <span className="text-5xl font-bold text-gray-900 font-ogg block leading-[1.35]">
          {formatDisplay ? prefix + displayValue : displayValue}
        </span>
      </div>
      <p className="text-gray-600 mt-2 font-ogg text-lg">{label}</p>
    </div>
  );
};

const Stats = () => {
  return (
    <div className="py-16 bg-white w-full">
      <div className="content-wrap">
        <h2 className="text-4xl font-ogg font-bold text-center mb-12 text-gray-900">PRIMA CENTER en chiffres</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <StatItem 
            prefix="+"
            end={70} 
            suffix="" 
            label="Enseignes" 
          />
          <StatItem 
            prefix="+"
            start={100000}
            end={1000000}
            label="Visiteurs par an"
            formatDisplay={(v) => v >= 1000000 ? '1M' : `${Math.round(v / 1000)}k`}
          />
          <StatItem 
            end={15} 
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