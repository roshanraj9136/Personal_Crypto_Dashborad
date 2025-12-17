import { Sidebar } from './Sidebar';

interface Props {
  children: React.ReactNode;
}

export const Layout = ({ children }: Props) => {
  return (
    <div className="min-h-screen bg-[#0b0e11] text-white selection:bg-blue-500/30">
      {/* Background Gradients (The "Glow" Effect) */}
      <div className="fixed top-0 left-0 w-full h-96 bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-full h-96 bg-teal-500/5 blur-[120px] rounded-full pointer-events-none" />

      <Sidebar />
      
      {/* Main Content Area */}
      <main className="pl-20 transition-all duration-300">
        <div className="max-w-7xl mx-auto p-6 md:p-8 space-y-8">
          {children}
        </div>
      </main>
    </div>
  );
};
