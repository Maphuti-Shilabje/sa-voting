'use client';

import { StationResult, CANDIDATES } from '../lib/types';

interface Props {
  results: StationResult[];
}

// Relative grid positions for SA Provinces (Hex-like layout)
const PROVINCE_LAYOUT = [
  { id: 'Limpopo', code: 'LIM', row: 1, col: 3 },
  { id: 'North West', code: 'NW', row: 2, col: 2 },
  { id: 'Gauteng', code: 'GP', row: 2, col: 3 },
  { id: 'Mpumalanga', code: 'MP', row: 2, col: 4 },
  { id: 'Northern Cape', code: 'NC', row: 3, col: 1 },
  { id: 'Free State', code: 'FS', row: 3, col: 2 },
  { id: 'KwaZulu-Natal', code: 'KZN', row: 3, col: 3 },
  { id: 'Western Cape', code: 'WC', row: 4, col: 1 },
  { id: 'Eastern Cape', code: 'EC', row: 4, col: 2 },
];

export default function ProvinceMap({ results }: Props) {
  
  const getWinnerColor = (provinceName: string) => {
    // 1. Filter results for this province
    const provResults = results.filter(r => r.province === provinceName);
    
    if (provResults.length === 0) return '#e9ecef'; // No data yet (Gray)

    // 2. Sum votes per candidate
    const tally: Record<string, number> = {};
    provResults.forEach(r => {
      Object.entries(r.votes).forEach(([candId, count]) => {
        tally[candId] = (tally[candId] || 0) + count;
      });
    });

    // 3. Find leader
    let leaderId = '';
    let maxVotes = -1;
    Object.entries(tally).forEach(([candId, count]) => {
      if (count > maxVotes) {
        maxVotes = count;
        leaderId = candId;
      }
    });

    if (maxVotes === 0) return '#e9ecef'; // Data but 0 votes

    const candidate = CANDIDATES.find(c => c.id === leaderId);
    return candidate ? candidate.color : '#e9ecef';
  };

  return (
    <div className="card shadow-sm border-0 h-100">
      <div className="card-header py-3">
        <h5 className="mb-0">🗺 Electoral Map (Leading Party)</h5>
      </div>
      <div className="card-body d-flex align-items-center justify-content-center">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 80px)', gridGap: '10px' }}>
          {PROVINCE_LAYOUT.map((p) => {
            const color = getWinnerColor(p.id);
            const isLight = color === '#e9ecef';
            return (
              <div
                key={p.code}
                style={{
                  gridRow: p.row,
                  gridColumn: p.col,
                  backgroundColor: color,
                  height: '80px',
                  width: '80px',
                  clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)', // Hexagon
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isLight ? '#495057' : '#fff',
                  fontWeight: 'bold',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                  transition: 'background-color 0.5s ease',
                  cursor: 'default'
                }}
                title={p.id}
              >
                <div style={{ fontSize: '1.2rem' }}>{p.code}</div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="card-footer small text-muted text-center">
        Colors represent the current leading party in each province.
      </div>
    </div>
  );
}
