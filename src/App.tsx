/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Calculator, Users, Camera, Settings, Box, Ruler, CirclePlus, ClipboardList, LogIn } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, ReactNode } from 'react';
import { KANNADA_TRANSLATIONS } from './constants';
import CalculatorTab from './components/CalculatorTab';
import LaborTab from './components/LaborTab';
import PhotosTab from './components/PhotosTab';
import { auth } from './firebase';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, User } from 'firebase/auth';

type Tab = 'calc' | 'labor' | 'photos';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('calc');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-orange-500 flex items-center justify-center">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="bg-white p-8 rounded-3xl shadow-vibrant-lg"
        >
          <Box size={64} className="text-orange-500" />
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto">
        <div className="bg-orange-500 p-10 rounded-[3rem] shadow-vibrant-lg mb-12 transform -rotate-2 border-4 border-white/20">
          <Box size={84} className="text-white mb-6 mx-auto" />
          <h1 className="text-5xl font-black text-white tracking-tighter uppercase leading-none">{KANNADA_TRANSLATIONS.app_name}</h1>
          <p className="text-orange-100 font-bold text-sm tracking-widest mt-2 uppercase">ನಮ್ಮ ಮಿಸ್ತ್ರಿ • Construction Assistant</p>
        </div>
        
        <h2 className="text-3xl font-black text-slate-800 uppercase mb-4">Welcome, Mistri-ji!</h2>
        <p className="text-sm font-bold text-slate-500 mb-12 uppercase tracking-widest">ನಿಮ್ಮ ನಿರ್ಮಾಣ ಸಹಾಯಕ - ಈಗಲೇ ಪ್ರಾರಂಭಿಸಿ</p>
        
        <button 
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white p-6 rounded-3xl shadow-vibrant-lg flex items-center justify-center gap-4 text-xl font-black uppercase hover:bg-blue-700 active:scale-[0.98] transition-all"
        >
          <LogIn size={28} /> Start Application
        </button>

        <div className="mt-12 flex flex-col items-center gap-2 opacity-30">
          <p className="text-[10px] font-black uppercase tracking-widest italic">Built for rural builders of India</p>
          <div className="w-12 h-1 bg-slate-400 rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans flex flex-col max-w-md mx-auto relative shadow-2xl">
      {/* Header */}
      <header className="bg-orange-500 text-white p-6 shadow-vibrant">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="bg-white p-2 rounded-xl">
               <Box size={24} className="text-orange-500" />
             </div>
             <div>
               <h1 className="text-2xl font-black tracking-tight leading-none uppercase">{KANNADA_TRANSLATIONS.app_name}</h1>
               <p className="text-orange-100 text-[10px] font-bold uppercase tracking-widest mt-0.5">Construction Assistant</p>
             </div>
          </div>
          <button className="bg-orange-600 p-2 rounded-full border border-orange-400">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.2 }}
            className="p-4"
          >
            {activeTab === 'calc' && <CalculatorTab />}
            {activeTab === 'labor' && <LaborTab />}
            {activeTab === 'photos' && <PhotosTab />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-white rounded-[2rem] px-4 py-3 flex justify-around items-center z-50 shadow-vibrant-lg border border-slate-200">
        <NavButton 
          active={activeTab === 'calc'} 
          onClick={() => setActiveTab('calc')}
          icon={<Calculator size={24} />}
          label="Calculator"
          kannada={KANNADA_TRANSLATIONS.calculator}
        />
        <NavButton 
          active={activeTab === 'labor'} 
          onClick={() => setActiveTab('labor')}
          icon={<ClipboardList size={24} />}
          label="Team Diary"
          kannada={KANNADA_TRANSLATIONS.team}
        />
        <NavButton 
          active={activeTab === 'photos'} 
          onClick={() => setActiveTab('photos')}
          icon={<Camera size={24} />}
          label="Site Gallery"
          kannada={KANNADA_TRANSLATIONS.photos}
        />
      </nav>
    </div>
  );
}

function NavButton({ active, onClick, icon, label, kannada }: { 
  active: boolean, 
  onClick: () => void, 
  icon: ReactNode,
  label: string,
  kannada: string
}) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center gap-1 p-2 transition-all ${
        active ? 'text-[#FF6B35] scale-110' : 'text-gray-400 opacity-60'
      }`}
    >
      <div className={`p-3 rounded-2xl transition-all ${active ? 'bg-blue-600 text-white shadow-vibrant' : 'bg-slate-100 text-slate-400 opacity-60'}`}>
        {icon}
      </div>
      <span className={`text-[9px] font-black uppercase tracking-tight leading-none mt-1 ${active ? 'text-blue-700' : 'text-slate-400'}`}>{kannada}</span>
      <span className="text-[7px] font-bold uppercase opacity-40">{label}</span>
    </button>
  );
}
