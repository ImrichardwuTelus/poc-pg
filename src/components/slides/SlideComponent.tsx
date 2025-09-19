'use client';

import React from 'react';
import { Slide, SlideOption } from '@/types/slide';

interface SlideComponentProps {
  slide: Slide;
  onOptionSelect: (option: SlideOption) => void;
}

export default function SlideComponent({ slide, onOptionSelect }: SlideComponentProps) {
  return (
    <div className="max-w-2xl mx-auto p-10 bg-white backdrop-blur-xl border border-gray-200 rounded-3xl shadow-2xl shadow-gray-900/10">
      <h1 className="text-4xl font-light text-gray-900 mb-8 tracking-tight">{slide.title}</h1>

      <div className="mb-10">
        <p className="text-xl text-gray-600 leading-relaxed font-light">{slide.prompt}</p>
      </div>

      <div className="space-y-3">
        {slide.options.map((option, index) => (
          <button
            key={index}
            onClick={() => onOptionSelect(option)}
            className="w-full p-6 text-left bg-gray-50 hover:bg-gray-100 backdrop-blur-sm border border-gray-200 hover:border-gray-300 rounded-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:ring-offset-2 hover:scale-[1.02] hover:shadow-lg shadow-gray-900/5"
          >
            <span className="text-gray-900 font-medium text-lg">{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
