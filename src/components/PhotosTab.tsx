/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Camera, Plus, MapPin, Calendar, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { firebaseService } from '../firebaseService';
import { Site, SitePhoto } from '../types';

export default function PhotosTab() {
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSites();
  }, []);

  const loadSites = async () => {
    const data = await firebaseService.getSites();
    setSites(data);
    setLoading(false);
  };

  const handleAddSite = async () => {
    const name = prompt("Enter Site/Owner Name / ಸೈಟ್ ಅಥವಾ ಮಾಲೀಕರ ಹೆಸರು");
    const loc = prompt("Enter Location / ಸ್ಥಳ", "Local");
    if (name) {
      await firebaseService.addSite({
        name,
        location: loc || '',
        createdAt: new Date().toISOString(),
        status: 'active',
        laborerIds: []
      });
      loadSites();
    }
  };

  return (
    <div className="space-y-6 pb-24">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 uppercase flex items-center gap-3">
            <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
              <Camera size={20} />
            </div>
            Site Gallery
          </h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">ಸೈಟ್ ಫೋಟೋಗಳು</p>
        </div>
        <button 
          onClick={handleAddSite}
          className="bg-orange-500 text-white p-3 rounded-2xl shadow-vibrant hover:bg-orange-600 flex items-center gap-2 uppercase text-xs font-black active:scale-95 transition-all"
        >
          <Plus size={18} /> New Site
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="animate-spin text-blue-600" size={48} />
          </div>
        ) : sites.length === 0 ? (
          <div 
            onClick={handleAddSite}
            className="p-12 bg-white rounded-3xl border-4 border-dashed border-slate-200 flex flex-col items-center gap-4 text-slate-300 font-black uppercase cursor-pointer hover:bg-slate-50 transition-colors"
          >
            <Camera size={64} className="opacity-20" />
            <span className="text-xs tracking-widest">Start Site Photo Log</span>
          </div>
        ) : (
          sites.map((site) => (
            <SiteCard key={site.id} site={site} />
          ))
        )}
      </div>
    </div>
  );
}

interface SiteCardProps {
  site: Site;
}

function SiteCard({ site }: SiteCardProps) {
  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-vibrant group border border-slate-100 hover:border-blue-300 transition-all">
      <div className="aspect-video w-full overflow-hidden bg-slate-200 flex items-center justify-center relative">
        <Camera size={64} className="text-white opacity-40 group-hover:scale-110 transition-transform" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
        <div className="absolute bottom-4 left-4">
           <span className="bg-blue-600 text-white text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest">{site.status}</span>
        </div>
      </div>
      
      <div className="p-5 bg-white relative">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight italic">{site.name}</h3>
          <button className="bg-slate-100 p-2 rounded-xl text-slate-400 border border-slate-200 hover:bg-blue-50 hover:text-blue-600 transition-colors">
            <Camera size={16} />
          </button>
        </div>
        
        <div className="flex gap-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">
          <div className="flex items-center gap-1.5">
            <Calendar size={12} className="text-blue-500" /> {new Date(site.createdAt).toLocaleDateString()}
          </div>
          {site.location && (
            <div className="flex items-center gap-1.5">
              <MapPin size={12} className="text-orange-500" /> {site.location}
            </div>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-slate-50 flex gap-2">
           <button className="flex-1 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all">View History</button>
           <button className="flex-1 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all">Share Progress</button>
        </div>
      </div>
    </div>
  );
}
