'use client'
import { useState, useEffect, useCallback } from 'react';

// 初始对象数据
const initialNodesData = [
  { id: 'R1', color: 'white', refs: ['A'], isRoot: true, x: 50, y: 200, name: '根对象 R1' },
  { id: 'A', color: 'white', refs: ['B', 'D'], x: 200, y: 100, name: '对象 A' },
  { id: 'B', color: 'white', refs: ['E'], x: 350, y: 50, name: '对象 B' },
  { id: 'C', color: 'white', refs: [], x: 350, y: 350, name: '对象 C (初始不可达)' },
  { id: 'D', color: 'white', refs: [], x: 200, y: 300, name: '对象 D' },
  { id: 'E', color: 'white', refs: [], x: 500, y: 50, name: '对象 E' },
  { id: 'F', color: 'white', refs: [], x: 500, y: 200, name: '对象 F (初始不可达)'},
];

const NODE_RADIUS = 25;
const SVG_WIDTH = 700;
const SVG_HEIGHT = 450;

// 颜色定义 (更新了灰色和黑色，增加了丢失对象颜色)
const COLORS = {
  white: '#FFFFFF',
  gray: '#B0BEC5',  // Material Blue Grey 200 (更清晰的灰色)
  black: '#37474F',  // Material Blue Grey 800 (更深的黑色)
  border: '#455A64', // Material Blue Grey 700 for border
  text: '#FFFFFF',    // White text for better contrast on darker nodes
  nodeIdText: '#263238', // Dark text for ID on white/gray nodes
  rootBorder: '#1B5E20', // Darker Green
  arrow: '#455A64',
  garbageText: '#D32F2F', // Red 700 for "可回收"
  lostHighlightBorder: '#E53935', // Red 600 for lost object border
  lostHighlightText: '#C62828',   // Red 800 for lost object text
};

// 主应用组件
function App() {
  const [nodes, setNodes] = useState(() => JSON.parse(JSON.stringify(initialNodesData)));
  const [log, setLog] = useState([]);
  const [phase, setPhase] = useState('IDLE');
  const [grayQueue, setGrayQueue] = useState([]);
  const [writeBarrierEnabled, setWriteBarrierEnabled] = useState(true);
  const [activeHints, setActiveHints] = useState([]);
  const [lostObjectIds, setLostObjectIds] = useState([]);
  // 用于追踪在写屏障禁用时，哪些对象因黑指向白而处于风险中
  const [atRiskDueToDisabledBarrier, setAtRiskDueToDisabledBarrier] = useState(new Set());


  const addLog = useCallback((message) => {
    setLog(prevLog => [`[${new Date().toLocaleTimeString()}] ${message}`, ...prevLog].slice(0, 25));
  }, []);

  const getNodeById = useCallback((id) => nodes.find(n => n.id === id), [nodes]);

  const resetState = useCallback(() => {
    setNodes(JSON.parse(JSON.stringify(initialNodesData)));
    setGrayQueue([]);
    setPhase('IDLE');
    setLog([]);
    setActiveHints([]);
    setLostObjectIds([]);
    setAtRiskDueToDisabledBarrier(new Set());
    addLog('状态已重置，对象恢复初始状态。');
  }, [addLog]);

  useEffect(() => {
    resetState();
  }, [resetState]);

  // 更新交互式提示
  useEffect(() => {
    const newHints = [];
    const nodeA = getNodeById('A');
    const nodeC = getNodeById('C');
    const nodeD = getNodeById('D');
    const nodeF = getNodeById('F');

    if (nodeD && nodeC && nodeD.color === 'black' && nodeC.color === 'white' && !nodeD.refs.includes('C')) {
      newHints.push(`提示: D (${nodeD.name}) 已染黑, C (${nodeC.name}) 仍白。尝试 D → C 突变，观察${writeBarrierEnabled ? "写屏障介入！" : "无写屏障的后果！"}`);
    }
    if (nodeA && nodeF && nodeA.color === 'black' && nodeF.color === 'white' && !nodeA.refs.includes('F')) {
      newHints.push(`提示: A (${nodeA.name}) 已染黑, F (${nodeF.name}) 仍白。尝试 A → F 突变，观察${writeBarrierEnabled ? "写屏障介入！" : "无写屏障的后果！"}`);
    }

    if (phase === 'MARKED' && !writeBarrierEnabled && lostObjectIds.length > 0) {
        newHints.push(`警告: 写屏障已禁用且GC完成。图中红色标记的对象 (${lostObjectIds.join(', ')}) 可能已被错误回收！`);
    } else if (phase === 'MARKED' && lostObjectIds.length === 0 && atRiskDueToDisabledBarrier.size > 0 && !writeBarrierEnabled) {
        // This case means items were at risk, but somehow got marked (e.g. another path) or were not white at end.
        // Or, more likely, the atRisk set wasn't fully processed into lostObjectIds yet if it's complex.
        // For now, the main "lost" message is handled above.
    }


    setActiveHints(newHints);
  }, [nodes, phase, writeBarrierEnabled, getNodeById, lostObjectIds, atRiskDueToDisabledBarrier]);


  const startGC = () => {
    if (phase === 'MARKING' && grayQueue.length > 0) {
      addLog('标记阶段已在进行中。请先完成当前标记或重置。');
      return;
    }
    addLog('开始GC标记阶段...');
    setLostObjectIds([]); // 清除上一轮的丢失对象标记
    if (!writeBarrierEnabled) { // 如果在开始GC时写屏障是关闭的，也清空风险列表
        setAtRiskDueToDisabledBarrier(new Set());
    }

    const newGrayQueue = [];
    const updatedNodes = nodes.map(n => {
      const newColor = n.isRoot ? 'gray' : 'white';
      if (n.isRoot) {
        newGrayQueue.push(n.id);
        addLog(`根对象 ${n.name} (${n.id}) 标记为灰色。`);
      }
      return { ...n, color: newColor };
    });
    setNodes(updatedNodes);
    setGrayQueue(newGrayQueue);
    setPhase('MARKING');
    if (newGrayQueue.length === 0) {
      addLog('没有根对象，标记结束。');
      setPhase('MARKED');
    }
  };

  const stepMark = () => {
    if (phase !== 'MARKING' || grayQueue.length === 0) {
      addLog('没有灰色对象可处理，或未开始标记。');
      if (grayQueue.length === 0 && phase === 'MARKING') {
        setPhase('MARKED');
        addLog('标记完成。所有可达对象已标记为黑色。');
        // 检查是否有因写屏障禁用而丢失的对象
        if (!writeBarrierEnabled && atRiskDueToDisabledBarrier.size > 0) {
            const newlyLost = [];
            nodes.forEach(n => { // Check current nodes state
                if (n.color === 'white' && atRiskDueToDisabledBarrier.has(n.id)) {
                    newlyLost.push(n.id);
                }
            });
            if (newlyLost.length > 0) {
                setLostObjectIds(newlyLost);
                addLog(`错误回收警告: 由于写屏障被禁用，以下对象被错误地标记为可回收: ${newlyLost.join(', ')}`);
            }
        }
      }
      return;
    }

    const currentGrayNodeId = grayQueue[0];
    const newGrayQueue = grayQueue.slice(1);
    
    const updatedNodes = nodes.map(n => {
      if (n.id === currentGrayNodeId) {
        addLog(`处理灰色对象 ${n.name} (${n.id})：标记为黑色。`);
        return { ...n, color: 'black' };
      }
      return n;
    });

    const finalNodes = updatedNodes.map(n => {
        const parentNode = updatedNodes.find(pn => pn.id === currentGrayNodeId);
        if (parentNode && parentNode.refs.includes(n.id) && n.color === 'white') {
            addLog(`  子对象 ${n.name} (${n.id}) 标记为灰色，并加入灰色队列。`);
            if (!newGrayQueue.includes(n.id)) {
                newGrayQueue.push(n.id);
            }
            return { ...n, color: 'gray' };
        }
        return n;
    });

    setNodes(finalNodes);
    setGrayQueue(newGrayQueue);

    if (newGrayQueue.length === 0) {
      setPhase('MARKED');
      addLog('标记完成。所有可达对象已标记为黑色。');
      // 标记完成后，检查是否有因写屏障禁用而丢失的对象
      if (!writeBarrierEnabled && atRiskDueToDisabledBarrier.size > 0) {
          const newlyLost = [];
          finalNodes.forEach(n => { // Check finalNodes state
              if (n.color === 'white' && atRiskDueToDisabledBarrier.has(n.id)) {
                  newlyLost.push(n.id);
              }
          });
          if (newlyLost.length > 0) {
              setLostObjectIds(newlyLost);
              addLog(`错误回收警告: 由于写屏障被禁用，以下对象被错误地标记为可回收: ${newlyLost.join(', ')}`);
          } else {
             // If atRiskDueToDisabledBarrier had items, but none are white now, they were reached by other means.
             // Or they were not white to begin with.
             addLog('风险对象均通过其他路径被标记或并非初始白色，未发生错误回收。');
          }
      }
    } else {
      addLog(`灰色队列: [${newGrayQueue.join(', ')}]`);
    }
  };
  
  const handleToggleWriteBarrier = () => {
    const newState = !writeBarrierEnabled;
    setWriteBarrierEnabled(newState);
    addLog(`写屏障已 ${newState ? '启用' : '禁用'}。`);
    if (newState) { // 如果重新启用了写屏障，清除风险列表
        setAtRiskDueToDisabledBarrier(new Set());
        setLostObjectIds([]); // 也清除已标记的丢失对象，因为条件改变了
    }
  };

  const mutate = (fromNodeId, toNodeId, create = true) => {
    const fromNodeInitial = getNodeById(fromNodeId);
    const toNodeInitial = getNodeById(toNodeId);

    if (!fromNodeInitial || !toNodeInitial) {
        addLog(`错误：无法找到对象 ${fromNodeId} 或 ${toNodeId} 进行突变。`);
        return;
    }
    
    addLog(`突变：对象 ${fromNodeInitial.name} (${fromNodeId}) ${create ? '开始引用' : '停止引用'} 对象 ${toNodeInitial.name} (${toNodeId})。`);
    
    const fromNodeColorBeforeMutation = fromNodeInitial.color;
    const toNodeColorBeforeMutation = toNodeInitial.color;

    const updatedNodes = nodes.map(n => {
      if (n.id === fromNodeId) {
        const newRefs = create 
          ? [...new Set([...n.refs, toNodeId])] 
          : n.refs.filter(ref => ref !== toNodeId);
        return { ...n, refs: newRefs };
      }
      return n;
    });

    // 写屏障逻辑 或 记录风险
    let finalNodesAfterMutation = updatedNodes;
    const mutatedFromNode = finalNodesAfterMutation.find(n => n.id === fromNodeId); // Node state after ref change

    if (create) { //只在创建引用时考虑写屏障和风险
        const mutatedToNode = finalNodesAfterMutation.find(n => n.id === toNodeId);
        if (writeBarrierEnabled) {
            if (mutatedFromNode && mutatedFromNode.color === 'black' && mutatedToNode && mutatedToNode.color === 'white') {
                addLog(`写屏障触发 (在 ${mutatedFromNode.name} 指向 ${mutatedToNode.name} 时)：对象 ${mutatedToNode.name} (${toNodeId}) 从白色变为灰色。`);
                finalNodesAfterMutation = finalNodesAfterMutation.map(n => {
                    if (n.id === toNodeId) {
                        if (!grayQueue.includes(n.id) && n.color !== 'black') {
                             setGrayQueue(prevQ => [...new Set([...prevQ, n.id])]);
                        }
                        // 如果标记已完成，写屏障的触发意味着需要重新进入标记阶段 (或至少将此对象加入灰色队列)
                        if (phase === 'MARKED' && n.color !== 'gray') {
                            setPhase('MARKING'); // Re-enter marking if it was complete
                            addLog('由于写屏障，重新进入标记阶段。');
                        }
                        return { ...n, color: 'gray' };
                    }
                    return n;
                });
            }
        } else { // 写屏障禁用
            if (mutatedFromNode && mutatedFromNode.color === 'black' && mutatedToNode && mutatedToNode.color === 'white') {
                setAtRiskDueToDisabledBarrier(prev => new Set(prev).add(toNodeId));
                addLog(`风险提示: 写屏障禁用，黑色对象 ${mutatedFromNode.name} (${fromNodeId}) 指向白色对象 ${mutatedToNode.name} (${toNodeId})。若无其他路径或屏障介入, ${toNodeId} 可能在标记结束后被错误回收。`);
            }
        }
    }
    
    setNodes(finalNodesAfterMutation);

    // Log for user if barrier was off and a potentially problematic mutation happened
    if (create && !writeBarrierEnabled && fromNodeColorBeforeMutation === 'black' && toNodeColorBeforeMutation === 'white') {
        // This log is slightly redundant with the "风险提示" but confirms the condition was met.
        // addLog(`警告：写屏障已禁用。黑色对象 ${fromNodeInitial.name} 指向了白色对象 ${toNodeInitial.name}。`);
    }
  };

  return (
    <div className="font-sans p-2 sm:p-4 min-h-screen flex flex-col items-center">
      <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-4 sm:gap-6">
        <div className="lg:w-2/3 bg-white shadow-xl rounded-lg p-3 sm:p-4 border border-gray-300">
          <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-gray-700">对象引用图</h2>
          <div className="overflow-x-auto">
            <svg 
              viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`} 
              className="border border-gray-300 rounded w-full h-auto min-w-[${SVG_WIDTH}px] sm:min-w-full max-h-[380px] sm:max-h-[480px]"
              style={{ display: 'block' }}
            >
              <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto" markerUnits="strokeWidth">
                  <polygon points="0 0, 10 3.5, 0 7" fill={COLORS.arrow} />
                </marker>
              </defs>
              {nodes.flatMap(node =>
                node.refs.map(refId => {
                  const targetNode = getNodeById(refId);
                  if (!targetNode) return null;
                  const angle = Math.atan2(targetNode.y - node.y, targetNode.x - node.x);
                  const sourceX = node.x + NODE_RADIUS * Math.cos(angle);
                  const sourceY = node.y + NODE_RADIUS * Math.sin(angle);
                  const targetX = targetNode.x - NODE_RADIUS * Math.cos(angle);
                  const targetY = targetNode.y - NODE_RADIUS * Math.sin(angle);
                  return (
                    <line
                      key={`${node.id}-${refId}`}
                      x1={sourceX}
                      y1={sourceY}
                      x2={targetX}
                      y2={targetY}
                      stroke={COLORS.arrow}
                      strokeWidth="2"
                      markerEnd="url(#arrowhead)"
                    />
                  );
                })
              )}
              {nodes.map(node => {
                const isLost = lostObjectIds.includes(node.id);
                return (
                  <g key={node.id} transform={`translate(${node.x},${node.y})`}>
                    <circle
                      cx="0"
                      cy="0"
                      r={NODE_RADIUS}
                      fill={COLORS[node.color] || '#CCCCCC'}
                      stroke={isLost ? COLORS.lostHighlightBorder : (node.isRoot ? COLORS.rootBorder : COLORS.border)}
                      strokeWidth={isLost ? "4" : "3"}
                    />
                    <text
                      x="0"
                      y="0"
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize="12"
                      fontWeight="bold"
                      fill={node.color === 'white' || node.color === 'gray' ? COLORS.nodeIdText : COLORS.text}
                    >
                      {node.id}
                    </text>
                    {node.isRoot && (
                      <text x="0" y={NODE_RADIUS + 12} textAnchor="middle" fontSize="10" fill={COLORS.rootBorder} fontWeight="bold">
                        (根)
                      </text>
                    )}
                    {phase === 'MARKED' && node.color === 'white' && !isLost && (
                        <text x="0" y={-NODE_RADIUS - 8} textAnchor="middle" fontSize="10" fill={COLORS.garbageText} fontWeight="bold">
                            可回收
                        </text>
                    )}
                    {isLost && (
                        <text x="0" y={NODE_RADIUS + 15} textAnchor="middle" fontSize="10" fill={COLORS.lostHighlightText} fontWeight="bold">
                            错误回收!
                        </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
           <div className="mt-3 sm:mt-4">
            <h3 className="text-sm sm:text-md font-semibold mb-1 text-gray-600">图例:</h3>
            <div className="flex flex-wrap gap-x-3 sm:gap-x-4 gap-y-1 sm:gap-y-2 text-xs sm:text-sm">
              <div className="flex items-center"><div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full mr-1 sm:mr-2 border-2" style={{backgroundColor: COLORS.white, borderColor: COLORS.border}}></div> 未访问</div>
              <div className="flex items-center"><div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full mr-1 sm:mr-2 border-2" style={{backgroundColor: COLORS.gray, borderColor: COLORS.border}}></div> 灰色队列</div>
              <div className="flex items-center"><div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full mr-1 sm:mr-2 border-2" style={{backgroundColor: COLORS.black, borderColor: COLORS.border}}></div> 已处理</div>
              <div className="flex items-center"><div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full mr-1 sm:mr-2 border-2" style={{borderColor: COLORS.rootBorder, borderWidth: '3px'}}></div> 根对象</div>
              {phase === 'MARKED' && <div className="flex items-center"><span className="font-bold" style={{color: COLORS.garbageText}}>可回收</span>: 标记后白色</div>}
              <div className="flex items-center"><div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full mr-1 sm:mr-2 border-2" style={{borderColor: COLORS.lostHighlightBorder, borderWidth: '3px'}}></div> <span style={{color: COLORS.lostHighlightText, fontWeight:'bold'}}>错误回收</span></div>
            </div>
          </div>
        </div>

        <div className="lg:w-1/3 flex flex-col gap-4 sm:gap-6">
          <div className="bg-white shadow-xl rounded-lg p-3 sm:p-4 border border-gray-300">
            <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-gray-700">控制面板</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              <button onClick={resetState} className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-3 rounded-lg transition duration-150 text-sm sm:text-base">重置</button>
              <button onClick={startGC} disabled={phase === 'MARKING' && grayQueue.length > 0} className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-3 rounded-lg transition duration-150 disabled:opacity-50 text-sm sm:text-base">{ (phase === 'MARKING' && grayQueue.length > 0) ? '标记中...' : (phase === 'IDLE' ? '开始 GC' : '重启 GC')}</button>
              <button onClick={stepMark} disabled={phase !== 'MARKING' || grayQueue.length === 0} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-3 rounded-lg transition duration-150 disabled:opacity-50 text-sm sm:text-base">下一步</button>
              <button onClick={handleToggleWriteBarrier} className={`${writeBarrierEnabled ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-gray-500 hover:bg-gray-600'} text-white font-semibold py-2 px-3 rounded-lg transition duration-150 text-sm sm:text-base`}>写屏障: {writeBarrierEnabled ? '启用' : '禁用'}</button>
            </div>
            
            {activeHints.length > 0 && (
              <div className="mt-3 sm:mt-4 space-y-2">
                {activeHints.map((hint, index) => (
                  <div key={index} className="text-xs sm:text-sm text-blue-800 bg-blue-100 p-2 rounded-md border border-blue-300">
                    <p>✨ {hint}</p>
                  </div>
                ))}
              </div>
            )}

            <h3 className="text-md sm:text-lg font-semibold mt-3 sm:mt-4 mb-1 text-gray-700">模拟突变:</h3>
            <div className="grid grid-cols-1 gap-2 sm:gap-3">
               <button onClick={() => mutate('D', 'C')} className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-3 rounded-lg transition duration-150 text-sm sm:text-base">D → C (连接)</button>
               <button onClick={() => mutate('A', 'F')} className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-3 rounded-lg transition duration-150 text-sm sm:text-base">A → F (连接)</button>
               <button onClick={() => mutate('A', 'D', false)} className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-3 rounded-lg transition duration-150 text-sm sm:text-base">A → D (断开)</button>
            </div>
             <div className="mt-2 sm:mt-3 text-xs sm:text-sm text-gray-600">
                <p>当前阶段: <span className="font-semibold">{phase}</span></p>
                <p>灰色队列: <span className="font-semibold break-all">[{grayQueue.join(', ')}]</span></p>
                {lostObjectIds.length > 0 && <p className="font-semibold" style={{color: COLORS.lostHighlightText}}>错误回收对象: [{lostObjectIds.join(', ')}]</p>}
             </div>
          </div>

          <div className="bg-gray-800 text-gray-200 shadow-xl rounded-lg p-3 sm:p-4 border border-gray-700 flex-grow max-h-80 sm:max-h-96 overflow-y-auto font-mono text-xs">
            <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-gray-100 sticky top-0 bg-gray-800 pb-2 z-10">操作日志</h2>
            <ul className="space-y-1">
              {log.map((entry, index) => (
                <li key={index} className="border-b border-gray-700 pb-1 break-words opacity-90 hover:opacity-100">
                  {entry}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App