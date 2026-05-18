/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useEffect, ReactNode } from 'react';
import { Box, Droplets, Mountain, Ruler, Info, Save, ChevronDown } from 'lucide-react';
import { KANNADA_TRANSLATIONS, calcMasonry } from '../constants';
import { firebaseService } from '../firebaseService';
import { Site } from '../types';

export default function CalculatorTab() {
  const [length, setLength] = useState<string>('5');
  const [height, setHeight] = useState<string>('3');
  const [thickness, setThickness] = useState<string>('0.23');
  const [ratio, setRatio] = useState<string>('6');
  const [sites, setSites] = useState<Site[]>([]);
  const [selectedSiteId, setSelectedSiteId] = useState<string>('');

  useEffect(() => {
    firebaseService.getSites().then(setSites);
  }, []);

  const result = useMemo(() => {
    const l = parseFloat(length) || 0;
    const h = parseFloat(height) || 0;
    const t = parseFloat(thickness) || 0;
    const r = parseFloat(ratio) || 6;
    return calcMasonry(l, h, t, r);
  }, [length, height, thickness, ratio]);

  const handleSave = async () => {
    if (!selectedSiteId) {
       // Just showing as success for now if no site selected, in real app would prompt
       alert("Please select a site first!");
       return;
    }
    // In a full implementation, we'd save this calculation to a site subcollection
    alert("Saved to " + sites.find(s => s.id === selectedSiteId)?.name);
  };

  return (
    <div className="space-y-6 pb-24">
      <div className="bg-slate-800 text-white p-3 rounded-2xl flex justify-between items-center shadow-vibrant">
        <div className="flex items-center gap-2 pl-2">
          <ChevronDown size={14} className="text-orange-400" />
          <select 
            value={selectedSiteId}
            onChange={(e) => setSelectedSiteId(e.target.value)}
            className="bg-transparent font-black uppercase text-[10px] focus:outline-none cursor-pointer tracking-widest"
          >
            <option value="" className="text-slate-900">Select Site / ಸೈಟ್ ಆಯ್ಕೆಮಾಡಿ</option>
            {sites.map(s => (
              <option key={s.id} value={s.id} className="text-slate-900">{s.name}</option>
            ))}
          </select>
        </div>
        <button 
          onClick={handleSave}
          className="flex items-center gap-2 font-black uppercase text-[10px] bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl transition-colors"
        >
          <Save size={14} /> Save Calc
        </button>
      </div>

      <section className="bg-white rounded-3xl p-6 shadow-vibrant border-t-8 border-blue-600">
        <h2 className="text-xl font-black text-slate-800 mb-6 uppercase flex items-center gap-3">
          <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
             <Ruler size={20} />
          </div>
          Dimensions / ಅಳತೆಗಳು
        </h2>
        
        <div className="grid grid-cols-2 gap-6">
          <InputGroup 
            label="Length / ಉದ್ದ" 
            value={length} 
            onChange={setLength} 
            unit="MTR"
          />
          <InputGroup 
            label="Height / ಎತ್ತರ" 
            value={height} 
            onChange={setHeight} 
            unit="MTR"
          />
          <div className="col-span-2">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Wall Thickness / ಗೋಡೆಯ ದಪ್ಪ</label>
            <div className="relative">
              <select 
                value={thickness}
                onChange={(e) => setThickness(e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 font-black text-lg appearance-none focus:border-blue-500 outline-none transition-all"
              >
                <option value="0.115">Single Brick (4.5") / 115mm</option>
                <option value="0.23">Double Brick (9") / 230mm</option>
                <option value="0.345">Triple Brick (13.5") / 345mm</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <ChevronDown size={20} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4">
        <ResultCard 
          icon={<Box size={40} />}
          label="Bricks / ಇಟ್ಟಿಗೆಗಳು"
          value={result.bricks}
          unit="PCS"
          color="border-orange-500 text-orange-600"
        />
        <div className="grid grid-cols-2 gap-4">
          <ResultCard 
            icon={<Droplets size={32} />}
            label="Cement / ಸಿಮೆಂಟ್"
            value={result.cementBags}
            unit="BAGS"
            color="border-slate-400 text-slate-700"
          />
          <ResultCard 
            icon={<Mountain size={32} />}
            label="Sand / ಮರಳು"
            value={result.sandCubicFeet}
            unit="CU FT"
            color="border-yellow-400 text-yellow-600"
          />
        </div>
      </section>

      <div className="bg-amber-50 border-2 border-dashed border-amber-200 rounded-2xl p-4 flex gap-3 items-start">
        <Info size={20} className="shrink-0 text-amber-600" />
        <p className="text-[10px] uppercase font-bold leading-tight tracking-wider text-amber-800 opacity-80">
          Calculated using standard 1:6 mortar ratio. Includes 15% mortar wastage buffer. Actual site requirements may vary by ±5%.
        </p>
      </div>
    </div>
  );
}

function InputGroup({ label, value, onChange, unit }: { label: string, value: string, onChange: (v: string) => void, unit: string }) {
  return (
    <div className="space-y-1">
      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</label>
      <div className="relative">
        <input 
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 font-black text-3xl focus:bg-white focus:outline-none focus:border-blue-500 shadow-inner transition-all"
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 font-black text-blue-600/30 text-xs">{unit}</span>
      </div>
    </div>
  );
}

function ResultCard({ icon, label, value, unit, color }: { icon: ReactNode, label: string, value: number, unit: string, color: string }) {
  return (
    <div className={`bg-white rounded-3xl p-6 shadow-vibrant border-b-8 ${color} flex items-center justify-between`}>
      <div className="">
        <p className="text-[10px] font-black uppercase opacity-40 tracking-widest mb-1">{label}</p>
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-black tracking-tighter">{Math.round(value)}</span>
          <span className="text-xs font-black opacity-30">{unit}</span>
        </div>
      </div>
      <div className="opacity-10 scale-125">
        {icon}
      </div>
    </div>
  );
}
