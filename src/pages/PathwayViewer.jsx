import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, CheckCircle2, CircleDashed, Loader2, PlayCircle, FileText, ArrowRight, XCircle } from 'lucide-react';
import apiClient from '../services/apiClient';
import { getUserProfile } from '../services/adminApi';
import { updateUserProgress } from '../services/userApi';
import AuthContext from '../context/AuthContext';
import toast from 'react-hot-toast';

const PathwayViewer = () => {
  const { roadmapId, nodeId } = useParams();
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);

  const [roadmap, setRoadmap] = useState(null);
  const [nodesList, setNodesList] = useState([]);
  const [modulesList, setModulesList] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState({ completed: [], skipped: [] });
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // 1. Fetch Roadmap
        const rmRes = await apiClient.get(`/roadmaps/${roadmapId}`);
        const rmData = rmRes.data;
        setRoadmap(rmData);

        // Build flat list of nodes using basic DFS
        const nodes = rmData.nodes || [];
        const edges = rmData.edges || [];
        const childrenOf = {};
        edges.forEach(e => {
          if (!childrenOf[e.source]) childrenOf[e.source] = [];
          childrenOf[e.source].push(e.target);
        });
        const targetIds = new Set(edges.map(e => e.target));
        const roots = nodes.filter(n => !targetIds.has(n.id));

        const flatList = [];
        const visited = new Set();
        
        const modules = [];

        roots.forEach(root => {
          const mLessons = [];
          const getDescendants = (cId) => {
             const children = childrenOf[cId] || [];
             children.forEach(childId => {
               if (!visited.has(childId)) {
                 visited.add(childId);
                 const cNode = nodes.find(n => n.id === childId);
                 if (cNode) {
                   mLessons.push(cNode);
                   flatList.push(cNode);
                 }
                 getDescendants(childId);
               }
             });
          };
          
          if (!visited.has(root.id)) {
            visited.add(root.id);
            flatList.push(root);
            getDescendants(root.id);
            modules.push({
               rootNode: root,
               lessons: [root, ...mLessons]
            });
          }
        });

        if (roots.length === 0) {
           // Fallback if no roots found
           nodes.forEach(n => flatList.push(n));
           modules.push({ rootNode: { data: { label: 'Roadmap' } }, lessons: flatList });
        }

        setNodesList(flatList);
        setModulesList(modules);

        // 2. Fetch User Progress
        if (user) {
          const profileRes = await getUserProfile();
          setProgress({
            completed: profileRes.completedNodes || [],
            skipped: profileRes.skippedNodes || []
          });
        }

        // 3. Set Selected Node
        if (nodeId) {
          const current = flatList.find(n => n.id === nodeId);
          if (current) setSelectedNode(current);
          else if (flatList.length > 0) {
            setSelectedNode(flatList[0]);
            navigate(`/roadmap/${roadmapId}/node/${flatList[0].id}`, { replace: true });
          }
        } else if (flatList.length > 0) {
          setSelectedNode(flatList[0]);
          navigate(`/roadmap/${roadmapId}/node/${flatList[0].id}`, { replace: true });
        }

      } catch (error) {
        console.error("Error fetching pathway data:", error);
        toast.error("Không thể tải lộ trình học.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [roadmapId, user]);

  // Update URL and state when selecting a node
  const handleSelectNode = (node) => {
    setSelectedNode(node);
    navigate(`/roadmap/${roadmapId}/node/${node.id}`);
  };

  const handleUpdateProgress = async (status) => {
    if (!user || !selectedNode) return;
    try {
      setUpdating(true);
      const res = await updateUserProgress(selectedNode.id, status);
      setProgress(res.data);
      if (status === 'completed') toast.success('Đã đánh dấu hoàn thành bài học!');
      else if (status === 'skipped') toast('Đã bỏ qua bài học.', { icon: '⚠️' });
    } catch (error) {
      console.error(error);
      toast.error('Lỗi khi cập nhật tiến trình.');
    } finally {
      setUpdating(false);
    }
  };

  const navigateToNext = () => {
    const idx = nodesList.findIndex(n => n.id === selectedNode?.id);
    if (idx >= 0 && idx < nodesList.length - 1) {
      handleSelectNode(nodesList[idx + 1]);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-500" size={48} />
      </div>
    );
  }

  if (!roadmap || nodesList.length === 0) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-white">
        <p className="mb-4">Không tìm thấy nội dung lộ trình này.</p>
        <button onClick={() => navigate(-1)} className="px-4 py-2 bg-blue-600 rounded">Quay lại</button>
      </div>
    );
  }

  const getNodeStatus = (nId) => {
    if (progress.completed.includes(nId)) return 'completed';
    if (progress.skipped.includes(nId)) return 'skipped';
    return 'not_started';
  };

  const selectedNodeStatus = selectedNode ? getNodeStatus(selectedNode.id) : 'not_started';

  // Format node data
  const nodeData = selectedNode?.data || selectedNode || {};
  const contentBlocks = nodeData.contentBlocks || nodeData.ContentBlocks || [];
  const videoUrl = nodeData.videoUrl || nodeData.VideoUrl;
  const description = nodeData.description || nodeData.Description;
  const label = nodeData.label || nodeData.Label || 'Untitled Lesson';

  return (
    <div className="flex h-screen bg-white dark:bg-[#050505] text-slate-900 dark:text-white font-sans overflow-hidden">
      {/* SIDEBAR */}
      <div className="w-80 flex flex-col border-r border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0a0a0f] flex-shrink-0">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <button 
            onClick={() => navigate(`/roadmap/${roadmapId}`)}
            className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <div className="text-xs font-bold text-slate-500 tracking-wider uppercase mb-1">PATHWAY</div>
            <h2 className="font-bold text-sm line-clamp-1">{roadmap.title}</h2>
          </div>
        </div>

        {/* Contents List */}
        <div className="p-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
          Contents
        </div>
        <div className="flex-1 overflow-y-auto pb-4 space-y-4">
          {modulesList.map((module, mIdx) => {
            const mLabel = module.rootNode.data?.category || module.rootNode.data?.label || module.rootNode.data?.Label || `Module ${mIdx + 1}`;
            
            return (
              <div key={module.rootNode.id || mIdx} className="mb-2">
                <div className="px-4 py-2 text-[11px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800/50 uppercase tracking-wider mb-1">
                  MODULE: {mLabel}
                </div>
                <div className="space-y-1 px-2">
                  {module.lessons.map((node, idx) => {
                    const status = getNodeStatus(node.id);
                    const isSelected = selectedNode?.id === node.id;
                    const nLabel = node.data?.label || node.data?.Label || 'Untitled';
                    
                    return (
                      <button
                        key={node.id}
                        onClick={() => handleSelectNode(node)}
                        className={`w-full flex items-start gap-3 p-3 rounded-xl transition-all text-left ${
                          isSelected 
                            ? 'bg-blue-50 dark:bg-blue-900/20 shadow-sm border border-blue-100 dark:border-blue-800/50' 
                            : 'hover:bg-slate-100 dark:hover:bg-slate-800/50 border border-transparent'
                        }`}
                      >
                        <div className="mt-0.5">
                          {status === 'completed' && <CheckCircle2 size={18} className="text-green-500" />}
                          {status === 'skipped' && <XCircle size={18} className="text-yellow-500" />}
                          {status === 'not_started' && <CircleDashed size={18} className="text-slate-300 dark:text-slate-600" />}
                        </div>
                        <div>
                          <div className={`text-sm font-medium leading-snug ${isSelected ? 'text-blue-700 dark:text-blue-400' : ''}`}>
                            {idx + 1}. {nLabel}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 overflow-y-auto relative bg-white dark:bg-[#050505]">
        {/* Status indicator absolute top right */}
        <div className="absolute top-6 right-6 z-10 flex gap-2">
           {selectedNodeStatus === 'completed' && (
             <div className="flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full font-bold text-sm">
               <CheckCircle2 size={18} /> Đã Hoàn Thành
             </div>
           )}
           {selectedNodeStatus === 'skipped' && (
             <div className="flex items-center gap-2 px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-full font-bold text-sm">
               <XCircle size={18} /> Đã Bỏ Qua
             </div>
           )}
        </div>

        <div className="max-w-4xl mx-auto px-8 py-12 pb-32">
          {/* Header */}
          <h1 className="text-3xl font-bold mb-6 pr-40">{label}</h1>
          {description && (
            <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
              {description}
            </p>
          )}

          {/* Video Player */}
          {videoUrl && (
            <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-xl mb-12 flex items-center justify-center relative">
              {/* If it's a real URL you would use an iframe or video tag. For now we placeholder if invalid or render iframe */}
              {videoUrl.includes('youtube') || videoUrl.includes('vimeo') ? (
                 <iframe 
                   src={videoUrl} 
                   className="w-full h-full"
                   allowFullScreen
                   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                 />
              ) : (
                <div className="text-center text-slate-500">
                  <PlayCircle size={64} className="mx-auto mb-4 opacity-50" />
                  <p>Video không được hỗ trợ định dạng nhúng trực tiếp.</p>
                  <a href={videoUrl} target="_blank" rel="noreferrer" className="text-blue-500 mt-2 block hover:underline">Mở Video URL</a>
                </div>
              )}
            </div>
          )}

          {/* Content Blocks */}
          {contentBlocks && contentBlocks.length > 0 ? (
            <div className="space-y-8">
              {contentBlocks.map((block, idx) => (
                <div key={idx} className="prose dark:prose-invert max-w-none">
                  {block.type === 'text' && (
                    <div dangerouslySetInnerHTML={{ __html: block.content }} className="text-slate-700 dark:text-slate-300 leading-relaxed text-lg" />
                  )}
                  {block.type === 'code' && (
                    <div className="bg-slate-900 text-slate-50 p-6 rounded-xl overflow-x-auto relative mt-4 shadow-lg">
                      <div className="absolute top-0 right-0 px-3 py-1 bg-slate-800 text-xs font-mono rounded-bl-lg text-slate-400">
                        {block.language || 'code'}
                      </div>
                      <pre className="font-mono text-sm"><code>{block.content}</code></pre>
                    </div>
                  )}
                  {block.type === 'image' && (
                    <div className="my-8">
                      <img src={block.content} alt={block.title || 'Lesson Image'} className="rounded-xl shadow-md w-full max-w-2xl mx-auto" />
                      {block.title && <p className="text-center text-sm text-slate-500 mt-2">{block.title}</p>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
             <div className="py-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
               <FileText size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
               <p className="text-slate-500">Bài học này chưa có nội dung chi tiết.</p>
             </div>
          )}

          {/* Action Footer */}
          <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex gap-4">
              <button
                onClick={() => handleUpdateProgress('completed')}
                disabled={updating || selectedNodeStatus === 'completed'}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-full transition-colors disabled:opacity-50"
              >
                {updating ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle2 size={20} />}
                Đánh dấu Hoàn thành
              </button>
              
              <button
                onClick={() => handleUpdateProgress('skipped')}
                disabled={updating || selectedNodeStatus === 'skipped'}
                className="flex items-center gap-2 px-6 py-3 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-full transition-colors disabled:opacity-50"
              >
                <XCircle size={20} />
                Bỏ qua bài này
              </button>
            </div>

            <button
              onClick={navigateToNext}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full transition-colors"
            >
              Bài tiếp theo <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PathwayViewer;
