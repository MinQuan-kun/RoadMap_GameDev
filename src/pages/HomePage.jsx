import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactFlow, { Background, Handle, Position } from 'reactflow';
import 'reactflow/dist/style.css';
import apiClient from '../services/apiClient';
import {
  ChevronRight,
  Target,
  Rocket,
  Map as MapIcon,
  Code,
  Gamepad2,
  Layers,
  Zap,
  ArrowRight,
  Sparkles,
  Gamepad,
  Search
} from 'lucide-react';
import { getPathways } from '../services/roadmapApi';
import { getSiteSettings } from '../services/adminApi';

const MiniNode = ({ data }) => (
  <div className="bg-slate-900/90 border border-slate-700/60 rounded-xl px-4 py-2 text-[12px] font-bold text-white shadow-xl whitespace-nowrap backdrop-blur-md">
    <Handle type="target" position={Position.Top} className="!w-1.5 !h-1.5 !min-w-0 !min-h-0 !bg-blue-500 !border-none" />
    {data.label}
    <Handle type="source" position={Position.Bottom} className="!w-1.5 !h-1.5 !min-w-0 !min-h-0 !bg-blue-500 !border-none" />
  </div>
);

const nodeTypes = { miniNode: MiniNode };

const MiniGraphPreview = ({ roadmapGraphId, isOfficial }) => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  useEffect(() => {
    if (!roadmapGraphId) return;
    apiClient.get(`/RoadmapGraphs/${roadmapGraphId}`).then(res => {
      const graph = res.data;
      if (!graph) return;
      
      const nd = (graph.nodes || []).map((n, idx) => ({
        id: n.id,
        type: 'miniNode',
        data: { label: n.title },
        position: { x: 0, y: idx * 80 }
      }));
      
      const ed = (graph.edges || []).map((e) => ({
        id: e.id || `e-${e.sourceNodeId}-${e.targetNodeId}`,
        source: e.sourceNodeId,
        target: e.targetNodeId,
        animated: true,
        style: { stroke: isOfficial ? '#3b82f6' : '#a855f7', strokeWidth: 1 }
      }));
      
      setNodes(nd);
      setEdges(ed);
    }).catch(console.error);
  }, [roadmapGraphId, isOfficial]);

  if (nodes.length === 0) {
    return (
      <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${isOfficial ? 'from-blue-600/10 to-indigo-600/10' : 'from-purple-600/10 to-fuchsia-600/10'}`}>
        <MapIcon size={32} className="text-indigo-500/30" />
      </div>
    );
  }

  return (
    <div className={`w-full h-full bg-gradient-to-br ${isOfficial ? 'from-blue-900/20 to-slate-900' : 'from-purple-900/20 to-slate-900'}`}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        panOnDrag={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
        zoomOnDoubleClick={false}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
      >
        <Background gap={10} size={1} color="rgba(255,255,255,0.05)" />
      </ReactFlow>
    </div>
  );
};

const HomePage = ({ onOpenLogin, onOpenRegister, isDarkMode, user, isAuthenticated }) => {
  const navigate = useNavigate();
  const [pathways, setPathways] = useState([]);
  const [loading, setLoading] = useState(true);
  const settings = getSiteSettings();

  useEffect(() => {
    const fetchPathways = async () => {
      try {
        const data = await getPathways();
        setPathways(data || []);
      } catch (err) {
        console.error('Failed to fetch pathways:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPathways();
  }, []);

  // Filter roadmaps (official/community)
  const officialRoadmaps = pathways.filter(p => p.isOfficial);
  const communityRoadmaps = pathways.filter(p => !p.isOfficial);

  const HeroSection = () => (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <img
          src={isDarkMode ? "/Img/dark_bg.png" : "/Img/ligh_bg.png"}
          alt="Hero Background"
          className="w-full h-full object-cover opacity-40 dark:opacity-60"
        />
        <div className="absolute inset-0  from-white/60 via-white to-white dark:from-slate-950/60 dark:via-slate-950 dark:to-slate-950"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-dark-500 text-[10px] font-black tracking-widest mb-6">
            <Sparkles size={14} />
            GAME DEVELOPMENT ROADMAPS
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight text-slate-900 dark:text-white">
            {isAuthenticated
              ? (settings.bannerTitleAuth?.replace('{name}', user?.fullName || user?.userName) || `Chào mừng trở lại, ${user?.fullName || user?.userName}`)
              : (settings.bannerTitle || "Lộ Trình Phát Triển Game Chuyên Nghiệp")}
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 leading-relaxed max-w-2xl mx-auto">
            {isAuthenticated
              ? (settings.bannerDescriptionAuth || "Tiếp tục hành trình chinh phục các kỹ năng mới và khám phá những cơ hội nghề nghiệp phù hợp.")
              : (settings.bannerDescription || "Hệ thống lộ trình chi tiết giúp bạn làm chủ Unity, Unreal Engine và các công nghệ phát triển game hiện đại.")}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('/roadmap/builder')}
              className="px-8 py-4 rounded-2xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 hover:-translate-y-1 flex items-center gap-2 group"
            >
              Tạo Lộ Trình <Rocket size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => navigate('/Jobs')}
              className="px-8 py-4 rounded-2xl bg-white dark:bg-white/5 text-slate-900 dark:text-white font-bold border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10 transition-all flex items-center gap-2"
            >
              Tìm Việc Làm <Target size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );

  const RoadmapGrid = ({ title, items, subtitle }) => (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-12">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">{title}</h2>
          <p className="text-slate-500 dark:text-slate-400">{subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              onClick={() => navigate(`/roadmap/${item.id}`)}
              className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-blue-500/10 transition-all cursor-pointer border-b-4 border-b-transparent hover:border-b-blue-600 flex flex-col"
            >
              {/* Content Section */}
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-start justify-between mb-4">
                   <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors line-clamp-1">
                     {item.title}
                   </h3>
                   <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm ${item.isOfficial ? 'bg-blue-600/10 text-blue-500' : 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400'}`}>
                     {item.isOfficial ? 'Official' : 'Community'}
                   </div>
                </div>
                
                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-6">
                  {item.description || "Khám phá các bước để làm chủ kỹ năng này thông qua lộ trình được thiết kế chi tiết."}
                </p>

                <div className="flex items-center gap-4 pt-4 border-t border-slate-100 dark:border-white/5">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Độ khó</span>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{item.difficulty || 'Expert'}</span>
                  </div>
                  <div className="w-px h-6 bg-slate-100 dark:bg-white/5"></div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Thời gian</span>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{item.estimatedHours || 0}H</span>
                  </div>
                  <div className="ml-auto w-8 h-8 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <ArrowRight size={14} />
                  </div>
                </div>
              </div>

              {/* Graph Preview Section (BOTTOM) */}
              <div className="w-full h-64 bg-slate-900 relative overflow-hidden border-t border-white/5">
                <div className="w-full h-full relative opacity-90 group-hover:opacity-100 transition-opacity">
                   <MiniGraphPreview roadmapGraphId={item.roadmapGraphId} isOfficial={item.isOfficial} />
                </div>
                <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] transition-colors duration-300">
      <HeroSection />

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="admin-loader"></div>
        </div>
      ) : (
        <>
          {officialRoadmaps.length > 0 && (
            <RoadmapGrid
              title="Lộ Trình Chính Thức"
              items={officialRoadmaps}
            />
          )}

          {communityRoadmaps.length > 0 && (
            <div className="bg-slate-50/50 dark:bg-white/[0.02] py-10">
              <RoadmapGrid
                title="Lộ Trình Cộng Đồng"
                subtitle="Những chia sẻ thực tế từ cộng đồng các nhà phát triển game."
                items={communityRoadmaps}
              />
            </div>
          )}
        </>
      )}

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="p-12 rounded-[40px] bg-gradient-to-br from-slate-900 to-black text-white text-center relative overflow-hidden border border-white/5 shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-black mb-6">Bạn có lộ trình riêng?</h2>
              <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto">Chia sẻ kiến thức của bạn và giúp đỡ những nhà phát triển game khác trong cộng đồng.</p>
              <button
                onClick={() => navigate('/roadmap/builder')}
                className="px-10 py-4 rounded-2xl bg-blue-600 text-white font-black hover:bg-blue-700 transition-all hover:scale-105"
              >
                Chia sẻ lộ trình của bạn
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
