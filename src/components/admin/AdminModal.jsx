// src/components/admin/AdminModal.jsx
import { useState, useEffect } from 'react';
import { X, Settings, Users, ClipboardList, Palette, Database, LayoutGrid, CalendarDays, Monitor } from 'lucide-react';
import ThemeTab from './ThemeTab';
import FamilyMembersTab from './FamilyMembersTab';
import ChoresTab from './ChoresTab';
import WidgetsTab from './WidgetsTab';
import SystemToolsTab from './SystemToolsTab';
import ScheduleManager from './ScheduleManager';
import DeviceManagerTab from './DeviceManagerTab';
import { useAdminPin } from '../../hooks/useAdminPin';

export default function AdminModal({ isOpen, onClose }) {
  const adminPin = useAdminPin();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [activeTab, setActiveTab] = useState('members');

  useEffect(() => {
    if (isOpen) {
      const targetTab = sessionStorage.getItem('targetAdminTab');
      if (targetTab) {
        setActiveTab(targetTab);
        sessionStorage.removeItem('targetAdminTab');
      }

      if (sessionStorage.getItem('adminBypass') === 'true') {
        setIsAuthenticated(true);
        if (!targetTab) setActiveTab('chores'); 
      }
    }
  }, [isOpen]);

  const handleClose = () => {
    sessionStorage.removeItem('adminBypass');
    sessionStorage.removeItem('draftChore');
    setIsAuthenticated(false); 
    onClose();
  };

  if (!isOpen) return null;

  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (pin === adminPin) {
      setIsAuthenticated(true);
      setPin('');
    } else {
      alert('Incorrect PIN');
      setPin('');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl text-center animate-in zoom-in-95 duration-200">
          <h3 className="text-2xl font-bold text-slate-800 mb-2">🔒 Admin Access</h3>
          <p className="text-slate-500 mb-6 text-sm">Enter PIN to access settings</p>
          <form onSubmit={handlePinSubmit}>
            <input 
              type="password" 
              value={pin} 
              onChange={(e) => setPin(e.target.value)} 
              maxLength={8} 
              autoFocus 
              className="w-full text-center text-3xl tracking-[1em] font-bold p-4 border-2 border-slate-200 rounded-xl mb-4 focus:border-indigo-500 focus:outline-none transition-colors" 
              placeholder="••••" 
            />
            <div className="flex gap-3">
              <button type="button" onClick={handleClose} className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-colors cursor-pointer">Cancel</button>
              <button type="submit" className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-md cursor-pointer">Unlock</button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div id="admin-modal-container" className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity duration-300">
      <div className="bg-white rounded-3xl w-full max-w-5xl h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-white shrink-0">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Settings className="text-indigo-600" /> Admin Panel
          </h2>
          <button onClick={handleClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500 cursor-pointer">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="flex flex-1 overflow-hidden">
          <div className="w-64 bg-slate-50 border-r border-slate-100 p-4 flex flex-col gap-2 shrink-0">
            <TabButton active={activeTab === 'members'} onClick={() => setActiveTab('members')} icon={<Users className="w-5 h-5" />} label="Family Members" />
            <TabButton active={activeTab === 'custody'} onClick={() => setActiveTab('custody')} icon={<CalendarDays className="w-5 h-5" />} label="Custody & Schedule" />
            <TabButton active={activeTab === 'chores'} onClick={() => setActiveTab('chores')} icon={<ClipboardList className="w-5 h-5" />} label="Chores & Points" />
            <TabButton active={activeTab === 'widgets'} onClick={() => setActiveTab('widgets')} icon={<LayoutGrid className="w-5 h-5" />} label="Dashboard Widgets" />
            <TabButton active={activeTab === 'theme'} onClick={() => setActiveTab('theme')} icon={<Palette className="w-5 h-5" />} label="Customization & Media" />
            <TabButton active={activeTab === 'devices'} onClick={() => setActiveTab('devices')} icon={<Monitor className="w-5 h-5" />} label="Display & Devices" />
            <TabButton active={activeTab === 'system'} onClick={() => setActiveTab('system')} icon={<Database className="w-5 h-5" />} label="System Tools" />
          </div>
          <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
            {activeTab === 'members' && <FamilyMembersTab />}
            {activeTab === 'custody' && <ScheduleManager />}
            {activeTab === 'chores' && <ChoresTab />}
            {activeTab === 'widgets' && <WidgetsTab />}
            {activeTab === 'theme' && <ThemeTab />}
            {activeTab === 'devices' && <DeviceManagerTab />}
            {activeTab === 'system' && <SystemToolsTab />}
          </div>
        </div>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }) {
  return (
    <button onClick={onClick} className={`flex items-center gap-3 p-3 rounded-xl font-semibold transition-all w-full text-left cursor-pointer ${active ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-200/50'}`}>
      {icon}{label}
    </button>
  );
}