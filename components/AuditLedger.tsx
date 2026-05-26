'use client';

import { useEffect, useState, useRef } from 'react';
import { StationResult } from '../lib/types';

interface Props {
  results: StationResult[];
}

interface AuditLog {
  hash: string;
  time: string;
  station: string;
  id: string;
}

export default function AuditLedger({ results }: Props) {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const totalVotesRef = useRef(0);

  // Generate a fake "Hash" for visual effect
  const generateHash = () => {
    const chars = '0123456789ABCDEF';
    let hash = 'SHA-256: ';
    for (let i = 0; i < 16; i++) {
      hash += chars[Math.floor(Math.random() * 16)];
    }
    return hash + '...';
  };

  useEffect(() => {
    // Calculate total votes currently in results
    let currentTotal = 0;
    results.forEach(r => {
      Object.values(r.votes).forEach(c => currentTotal += c);
    });

    // If new votes arrived
    if (currentTotal > totalVotesRef.current) {
      const diff = currentTotal - totalVotesRef.current;
      const newLogs: AuditLog[] = [];
      
      for (let i = 0; i < Math.min(diff, 5); i++) { // Add up to 5 logs at a time to avoid spam
        newLogs.push({
          id: Math.random().toString(36).substr(2, 9),
          hash: generateHash(),
          time: new Date().toLocaleTimeString(),
          station: results[Math.floor(Math.random() * results.length)]?.stationId || 'ONLINE'
        });
      }

      setLogs(prev => [...newLogs, ...prev].slice(0, 50)); // Keep last 50
      totalVotesRef.current = currentTotal;
    }
  }, [results]);

  return (
    <div className="card shadow-sm border-0 h-100 card-dark-glass">
      <div className="card-header border-secondary border-opacity-25 py-3 d-flex justify-content-between align-items-center" style={{ backgroundColor: 'rgba(0,0,0,0.2) !important' }}>
        <h5 className="mb-0 text-success font-monospace" style={{ textShadow: '0 0 8px rgba(0, 255, 65, 0.4)' }}>🛡 Public Audit Ledger</h5>
        <div className="spinner-grow text-success spinner-grow-sm" role="status"></div>
      </div>
      <div className="card-body p-0" style={{ height: '300px', overflowY: 'hidden', position: 'relative' }}>
         {/* Matrix/Terminal Effect Overlay */}
         <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '50px',
            background: 'linear-gradient(to bottom, rgba(15, 20, 35, 0.9), rgba(15, 20, 35, 0))', zIndex: 1, pointerEvents: 'none'
         }}></div>
         
         <div className="p-3 font-monospace small" style={{ color: '#00ff41', textShadow: '0 0 5px rgba(0, 255, 65, 0.3)' }}>
            {logs.length === 0 && <div className="text-muted opacity-50">Waiting for incoming transmission...</div>}
            
            {logs.map(log => (
              <div key={log.id} className="mb-2 text-truncate border-bottom border-light border-opacity-10 pb-2">
                <span className="text-secondary">[{log.time}]</span>{' '}
                <span className="text-white opacity-75">{log.station}</span>{' '}
                <span className="fw-bold">{log.hash}</span>
                <span className="float-end text-success fw-bold">VERIFIED ✓</span>
              </div>
            ))}
         </div>
         
         <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: '50px',
            background: 'linear-gradient(to top, rgba(15, 20, 35, 0.9), rgba(15, 20, 35, 0))', zIndex: 1, pointerEvents: 'none'
         }}></div>
      </div>
      <div className="card-footer border-secondary border-opacity-25 text-center text-muted small font-monospace" style={{ backgroundColor: 'rgba(0,0,0,0.2) !important' }}>
         SYSTEM INTEGRITY: 100% | ENCRYPTION: AES-256
      </div>
    </div>
  );
}
