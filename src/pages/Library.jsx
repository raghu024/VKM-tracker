import { useState, useEffect } from 'react';
import { Search, Filter, Play, FileText, Link as LinkIcon, Download, Clock, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getResources } from '../lib/admin.js';

export default function Library() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const data = await getResources();
      setResources(data || []);
    } catch (error) {
      console.error('Error fetching resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredResources = resources.filter(res => {
    const matchesSearch = res.title.toLowerCase().includes(search.toLowerCase()) || 
                          res.description?.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = activeFilter === 'all' || res.type === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const getIcon = (type) => {
    switch (type) {
      case 'video': return <Play size={20} className="text-secondary" />;
      case 'template': return <FileText size={20} className="text-gold" />;
      case 'link': return <LinkIcon size={20} className="text-blue-400" />;
      default: return <Download size={20} className="text-text-secondary" />;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-text-primary underline decoration-gold/30 underline-offset-8">Mentorship Library</h1>
          <p className="text-sm text-text-secondary mt-2">Access templates, recordings, and blueprints to scale your business.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
          <input 
            type="text"
            placeholder="Search resources..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-bg-secondary border border-bg-tertiary rounded-xl text-sm focus:outline-none focus:border-gold/50 text-text-primary"
          />
        </div>
        <div className="flex bg-bg-secondary p-1 rounded-xl border border-bg-tertiary">
          {['all', 'video', 'document', 'template', 'link'].map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${activeFilter === filter ? 'bg-gold/10 text-gold border border-gold/20' : 'text-text-secondary hover:text-text-primary'}`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {loading ? (
            Array(6).fill(0).map((_, i) => (
              <div key={i} className="h-64 bg-bg-secondary/50 rounded-2xl animate-pulse border border-bg-tertiary" />
            ))
          ) : filteredResources.length === 0 ? (
            <div className="col-span-full py-20 text-center">
              <Search size={48} className="mx-auto text-text-secondary mb-4 opacity-20" />
              <p className="text-text-secondary font-medium">No resources found matching your search.</p>
            </div>
          ) : (
            filteredResources.map((res) => (
              <motion.div
                key={res.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-card group flex flex-col overflow-hidden rounded-2xl hover:border-gold/30 transition-all duration-300"
              >
                <div className="aspect-video bg-bg-tertiary relative overflow-hidden">
                  {res.thumbnail_url ? (
                    <img src={res.thumbnail_url} alt={res.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-bg-tertiary to-bg-secondary">
                       {getIcon(res.type)}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                     <a 
                      href={res.file_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-3 rounded-full bg-gold text-bg-primary transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                    >
                       <ExternalLink size={20} />
                     </a>
                  </div>
                  <div className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[10px] font-bold uppercase text-white tracking-widest border border-white/10">
                    {res.type}
                  </div>
                </div>
                
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-bold text-text-primary group-hover:text-gold transition-colors">{res.title}</h3>
                  <p className="text-xs text-text-secondary mt-2 line-clamp-2 flex-1">{res.description}</p>
                  
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-bg-tertiary">
                    <div className="flex items-center gap-2 text-[10px] text-text-secondary font-medium">
                      <Clock size={12} />
                      {new Date(res.created_at).toLocaleDateString()}
                    </div>
                    <a 
                      href={res.file_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-gold flex items-center gap-1 hover:underline"
                    >
                      {res.type === 'video' ? 'Watch' : res.type === 'link' ? 'Visit' : 'Download'} 
                      <ChevronRight size={14} />
                    </a>
                  </div>
                </div>
              </motion.div>
            )
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function ChevronRight({ size, className }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
