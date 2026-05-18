/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, ReactNode } from 'react';
import { Users, Plus, IndianRupee, Calendar, Trash2, CheckCircle, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import { firebaseService } from '../firebaseService';
import { Laborer } from '../types';

export default function LaborTab() {
  const [laborers, setLaborers] = useState<Laborer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    firebaseService.getLaborers().then(labs => {
      setLaborers(labs);
      setLoading(false);
    });
  }, []);

  const handleAddLaborer = async () => {
    const name = prompt("Enter Worker Name / ಕೆಲಸಗಾರನ ಹೆಸರು");
    const wage = prompt("Enter Daily Wage / ದಿನಗೂಲಿ", "650");
    if (name && wage) {
      await firebaseService.addLaborer({
        name,
        dailyWage: parseInt(wage),
        active: true
      });
      const updated = await firebaseService.getLaborers();
      setLaborers(updated);
    }
  };

  return (
    <div className="space-y-6 pb-24">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 uppercase flex items-center gap-3">
            <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
              <Users size={20} />
            </div>
            Team Diary
          </h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">ಲೇಬರ್ ಡೈರಿ</p>
        </div>
        <button 
          onClick={handleAddLaborer}
          className="bg-blue-600 text-white p-3 rounded-2xl shadow-vibrant hover:bg-blue-700 flex items-center gap-2 uppercase text-xs font-black active:scale-95 transition-all"
        >
          <Plus size={18} /> Add New
        </button>
      </div>

      <div className="space-y-4">
        {loading ? (
           <div className="p-12 text-center font-black uppercase opacity-20">Loading Team Diary...</div>
        ) : laborers.length === 0 ? (
           <div className="p-12 text-center bg-white rounded-3xl border-4 border-dashed border-slate-200 font-black uppercase text-slate-300">No Workers Added Yet</div>
        ) : (
          laborers.map((laborer) => (
            <LaborCard key={laborer.id} laborer={laborer} />
          ))
        )}
      </div>

      <div className="bg-slate-50 border-4 border-dashed border-slate-200 rounded-[2.5rem] p-12 flex flex-col items-center justify-center text-slate-300">
        <Calendar size={64} className="mb-4 opacity-10" />
        <p className="text-xs font-black uppercase text-center tracking-widest">Attendance & Logs will appear here</p>
      </div>
    </div>
  );
}

interface LaborCardProps {
  laborer: Laborer;
}

function LaborCard({ laborer }: LaborCardProps) {
  return (
    <div className="bg-white rounded-3xl p-5 flex flex-col gap-5 shadow-vibrant border-l-8 border-green-500">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center font-black text-slate-400 border border-slate-200">
              {laborer.name.substring(0, 2).toUpperCase()}
           </div>
           <div>
             <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">{laborer.name}</h3>
             <p className="text-[10px] font-black text-green-600 uppercase tracking-widest">Mason • Present</p>
           </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Daily Wage</p>
          <p className="text-xl font-black text-slate-700 italic">₹{laborer.dailyWage}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Balance Due</p>
          <div className="flex items-baseline gap-1">
             <span className="text-2xl font-black text-slate-800">₹0</span>
             <span className="text-[10px] font-bold text-red-500">Adv: ₹0</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <AttendanceBtn status="present" icon={<CheckCircle size={24} className="text-green-600" />} label="Present" />
          <AttendanceBtn status="half" icon={<Clock size={24} className="text-orange-500" />} label="Half Day" />
        </div>
      </div>

      <button className="w-full bg-slate-800 text-white py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg hover:bg-slate-900 transition-colors">
        Issue Advance Payment / ಮುಂಗಡ ಪಾವತಿ
      </button>
    </div>
  );
}

function AttendanceBtn({ status, icon, label }: { status: 'present' | 'half' | 'absent', icon: ReactNode, label: string }) {
  return (
    <button className="bg-slate-50 rounded-2xl p-2 flex flex-col items-center justify-center border border-slate-100 hover:border-blue-300 hover:bg-white transition-all active:scale-95 group shadow-sm">
      <div className="group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <span className="text-[8px] font-black mt-1 text-slate-400 uppercase">{label}</span>
    </button>
  );
}
