'use client';

import { useState, useRef, useEffect } from 'react';

export default function VehicleChatbot() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: '🚗 Welcome to VEHICLE! Your intelligent vehicle insurance assistant. I can help you with:\n\n• Coverage options and policies\n• Claims process guidance\n• Premium calculations\n• Insurance regulations\n• Accident procedures\n• Policy comparisons\n\nHow can I assist you today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const vehicleInsuranceKnowledge = {
    coverage: {
      comprehensive: 'Comprehensive coverage protects against damage to your vehicle from non-collision events like theft, vandalism, natural disasters, and falling objects.',
      collision: 'Collision coverage pays for damage to your vehicle from accidents with other vehicles or objects, regardless of who is at fault.',
      liability: 'Liability coverage pays for damage you cause to others and is typically required by law. Includes bodily injury and property damage liability.',
      uninsured: 'Uninsured/underinsured motorist coverage protects you if you\'re in an accident with someone who doesn\'t have adequate insurance.'
    },
    claims: {
      process: 'The claims process typically involves: 1) Document the incident, 2) File claim promptly, 3) Meet with adjuster, 4) Get repair estimates, 5) Receive payment or repairs.',
      documentation: 'Essential documentation includes: photos of damage, police report, witness information, medical records (if applicable), and repair receipts.',
      timeline: 'Most claims are processed within 7-14 days, but complex cases may take longer. Always file as soon as possible after an incident.'
    },
    premiums: {
      factors: 'Premium factors include: driving record, vehicle type, age/location, coverage limits, deductibles, credit score, and annual mileage.',
      discounts: 'Common discounts: multi-policy, good driver, safety features, anti-theft devices, low mileage, good student, and defensive driving courses.',
      calculation: 'Premiums are calculated by multiplying your base rate by risk factors. Higher deductibles typically lower premiums.'
    },
    regulations: {
      minimum: 'Most states require minimum liability coverage, typically 25/50/25 ($25k bodily injury per person, $50k per accident, $25k property damage).',
      requirements: 'Requirements vary by state. Check your local DMV or insurance commissioner for specific minimum coverage requirements.',
      penalties: 'Driving without insurance can result in fines, license suspension, vehicle impoundment, and higher future premiums.'
    },
    accidents: {
      immediate: 'After an accident: 1) Check for injuries, 2) Move to safety, 3) Call police, 4) Exchange information, 5) Document everything, 6) Notify insurance.',
      documentation: 'Take photos of all vehicles, damage, and surroundings. Get names, contact info, license numbers, and insurance details from all parties.',
      prevention: 'Practice defensive driving, maintain vehicle properly, avoid distractions, follow traffic laws, and consider advanced safety features.'
    }
  };

  const generateBotResponse = (userInput) => {
    const input = userInput.toLowerCase();
    
    if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
      return 'Hello! I\'m here to help with your vehicle insurance questions. What would you like to know about?';
    }
    
    if (input.includes('comprehensive')) {
      return vehicleInsuranceKnowledge.coverage.comprehensive;
    }
    
    if (input.includes('collision')) {
      return vehicleInsuranceKnowledge.coverage.collision;
    }
    
    if (input.includes('liability')) {
      return vehicleInsuranceKnowledge.coverage.liability;
    }
    
    if (input.includes('uninsured') || input.includes('underinsured')) {
      return vehicleInsuranceKnowledge.coverage.uninsured;
    }
    
    if (input.includes('claim') || input.includes('claims')) {
      if (input.includes('process')) {
        return vehicleInsuranceKnowledge.claims.process;
      }
      if (input.includes('document')) {
        return vehicleInsuranceKnowledge.claims.documentation;
      }
      if (input.includes('timeline') || input.includes('long')) {
        return vehicleInsuranceKnowledge.claims.timeline;
      }
      return vehicleInsuranceKnowledge.claims.process;
    }
    
    if (input.includes('premium') || input.includes('cost') || input.includes('price')) {
      if (input.includes('factor')) {
        return vehicleInsuranceKnowledge.premiums.factors;
      }
      if (input.includes('discount')) {
        return vehicleInsuranceKnowledge.premiums.discounts;
      }
      if (input.includes('calculate')) {
        return vehicleInsuranceKnowledge.premiums.calculation;
      }
      return vehicleInsuranceKnowledge.premiums.factors;
    }
    
    if (input.includes('regulation') || input.includes('law') || input.includes('legal')) {
      if (input.includes('minimum')) {
        return vehicleInsuranceKnowledge.regulations.minimum;
      }
      if (input.includes('require')) {
        return vehicleInsuranceKnowledge.regulations.requirements;
      }
      if (input.includes('penalty')) {
        return vehicleInsuranceKnowledge.regulations.penalties;
      }
      return vehicleInsuranceKnowledge.regulations.minimum;
    }
    
    if (input.includes('accident')) {
      if (input.includes('immediate') || input.includes('after')) {
        return vehicleInsuranceKnowledge.accidents.immediate;
      }
      if (input.includes('document')) {
        return vehicleInsuranceKnowledge.accidents.documentation;
      }
      if (input.includes('prevent')) {
        return vehicleInsuranceKnowledge.accidents.prevention;
      }
      return vehicleInsuranceKnowledge.accidents.immediate;
    }
    
    return 'I\'m here to help with vehicle insurance questions. You can ask me about:\n\n• Coverage types (comprehensive, collision, liability)\n• Claims process and documentation\n• Premium factors and discounts\n• Insurance regulations by state\n• Accident procedures\n\nWhat specific aspect would you like to know more about?';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: input
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        type: 'bot',
        text: generateBotResponse(input)
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-lg shadow-xl border border-gray-200">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-lg">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <span className="text-xl">🚗</span>
          </div>
          <div>
            <h2 className="font-bold text-lg">VEHICLE</h2>
            <p className="text-xs text-blue-100">Insurance Assistant</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                message.type === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-800'
              }`}
            >
              <p className="text-sm whitespace-pre-line">{message.text}</p>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 text-gray-800 max-w-xs lg:max-w-md px-4 py-3 rounded-2xl">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 bg-white rounded-b-lg">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about insurance coverage, claims, premiums..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isTyping}
          />
          <button
            type="submit"
            disabled={isTyping || !input.trim()}
            className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}