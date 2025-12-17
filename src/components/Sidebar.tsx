import { 
  LayoutDashboard, 
  LineChart, 
  Wallet, 
  Newspaper, 
  Settings, 
  Menu
} from 'lucide-react';
import { useState } from 'react';
import clsx from 'clsx';

export const Sidebar = () => {
  const [active, setActive] = useState('Dashboard');
  const [isCollapsed, setIsCollapsed] = useState(true);

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Markets', icon: LineChart },
    { name: 'Wallet', icon: Wallet },
    { name: 'News', icon: Newspaper },
    { name: 'Settings', icon: Settings },
  ];

  return (
    <aside 
      className={clsx(
        "fixed left-0 top-0 h-screen bg-[#0b0e11]/90 backdrop-blur-xl border-r border-gray-800 transition-all duration-300 z-50 flex flex-col",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo Area */}
      <div className="h-20 flex items-center justify-center border-b border-gray-800/50">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tighter text-white">
          <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-teal-400 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
            P
          </div>
          {!isCollapsed && <span>ProTrade</span>}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 flex flex-col gap-2 px-3">
        {menuItems.map((item) => (
          <button
            key={item.name}
            onClick={() => setActive(item.name)}
            className={clsx(
              "flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden",
              active === item.name 
                ? "bg-blue-600/10 text-blue-400" 
                : "text-gray-500 hover:bg-gray-800/50 hover:text-gray-200"
            )}
          >
            {active === item.name && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-r-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
            )}
            
            <item.icon className={clsx("w-5 h-5", active === item.name && "animate-pulse")} />
            
            {!isCollapsed && (
              <span className="font-medium text-sm">{item.name}</span>
            )}

            {isCollapsed && (
              <div className="absolute left-full ml-4 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
                {item.name}
              </div>
            )}
          </button>
        ))}
      </nav>

      {/* Collapse Toggle */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="p-4 flex items-center justify-center text-gray-500 hover:text-white transition-colors border-t border-gray-800/50"
      >
        <Menu className="w-5 h-5" />
      </button>
    </aside>
  );
};
