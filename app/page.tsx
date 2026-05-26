'use client';

import { useEffect, useState } from 'react';
import { CANDIDATES, STATIONS, StationResult, TOTAL_ELIGIBLE_VOTERS, PROVINCES } from '../lib/types';
import ProvinceMap from '../components/ProvinceMap';
import AuditLedger from '../components/AuditLedger';

export default function Dashboard() {
  const [results, setResults] = useState<StationResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterProvince, setFilterProvince] = useState('All');

  const fetchData = async () => {
    try {
      const res = await fetch('/api/results');
      const data = await res.json();
      setResults(data);
    } catch (e) {
      console.error('Failed to fetch results');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); // Auto-refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  // Filter Logic
  const filteredResults = filterProvince === 'All' 
    ? results 
    : results.filter(r => r.province === filterProvince);

  const candidateTotals = CANDIDATES.reduce((acc, candidate) => {
    acc[candidate.id] = filteredResults.reduce((sum, res) => sum + (res.votes[candidate.id] || 0), 0);
    return acc;
  }, {} as Record<string, number>);

  const totalVotes = Object.values(candidateTotals).reduce((a, b) => a + b, 0);
  
  // Turnout Logic
  const showTurnout = filterProvince === 'All';
  const turnoutPercentage = (totalVotes / TOTAL_ELIGIBLE_VOTERS) * 100;

  const sortedCandidates = [...CANDIDATES].sort((a, b) => 
    (candidateTotals[b.id] || 0) - (candidateTotals[a.id] || 0)
  );

  return (
    <main>
      {/* HEADER SECTION */}
      <div className="row mb-5 align-items-end">
        <div className="col-lg-7">
          <h1 className="display-4 mb-0">National Results Dashboard</h1>
          <p className="lead text-muted">Real-time election tally 2026</p>
        </div>
        <div className="col-lg-5 text-lg-end">
          <div className="d-inline-flex align-items-center gap-3">
             <select 
               className="form-select form-select-lg" 
               style={{ minWidth: '200px' }}
               value={filterProvince}
               onChange={(e) => setFilterProvince(e.target.value)}
             >
               <option value="All">All Provinces (National)</option>
               {PROVINCES.map(p => (
                 <option key={p} value={p}>{p}</option>
               ))}
             </select>
             <div className="badge bg-success p-2 pulse">LIVE</div>
          </div>
        </div>
      </div>

      {/* SECTION 1: HEADLINE METRICS (Primary Focus) */}
      <div className="row g-4 mb-5">
        <div className={showTurnout ? "col-md-6" : "col-12"}>
          <div className="card h-100 border-start border-4 border-warning shadow-sm">
            <div className="card-body">
              <h6 className="card-subtitle mb-2 text-muted uppercase small font-monospace">
                {filterProvince === 'All' ? 'TOTAL VALID VOTES' : `VALID VOTES (${filterProvince.toUpperCase()})`}
              </h6>
              <h2 className="card-title display-4">{totalVotes.toLocaleString()}</h2>
              <p className="card-text text-muted small mt-2">
                Processed from {filteredResults.length} active reporting nodes.
              </p>
            </div>
          </div>
        </div>
        
        {showTurnout && (
          <div className="col-md-6">
            <div className="card h-100 border-start border-4 border-info shadow-sm">
              <div className="card-body">
                <h6 className="card-subtitle mb-2 text-muted uppercase small font-monospace">VOTER TURNOUT</h6>
                <div className="d-flex align-items-baseline gap-3">
                  <h2 className="card-title display-4 mb-0">{turnoutPercentage.toFixed(1)}%</h2>
                  <span className="text-muted small">of eligible population</span>
                </div>
                <div className="progress mt-3" style={{ height: '8px' }}>
                  <div 
                    className="progress-bar bg-info" 
                    role="progressbar" 
                    style={{ width: `${turnoutPercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 2: NATIONAL ASSEMBLY SEATS (Key Outcome) */}
      {filterProvince === 'All' && totalVotes > 0 && (
        <div className="row mb-5">
          <div className="col-12">
            <div className="card shadow-sm border-0">
              <div className="card-header py-3 d-flex justify-content-between align-items-center">
                <h5 className="mb-0">🏛 National Assembly Projection (400 Seats)</h5>
                <span className="badge bg-secondary">Proportional Representation</span>
              </div>
              <div className="card-body">
                {/* Visual Parliament Stack */}
                <div className="progress mb-4" style={{ height: '40px' }}>
                  {sortedCandidates.map(c => {
                    const votes = candidateTotals[c.id] || 0;
                    const seats = Math.round((votes / totalVotes) * 400);
                    if (seats === 0) return null;
                    return (
                      <div 
                        key={c.id}
                        className="progress-bar" 
                        style={{ width: `${(seats/400)*100}%`, backgroundColor: c.color }}
                        title={`${c.party}: ${seats} Seats`}
                      >
                        {seats >= 10 && <span className="fw-bold">{seats}</span>}
                      </div>
                    );
                  })}
                </div>
                
                <div className="row row-cols-2 row-cols-md-3 row-cols-lg-6 g-3 justify-content-center">
                  {sortedCandidates.map(c => {
                    const votes = candidateTotals[c.id] || 0;
                    const seats = Math.round((votes / totalVotes) * 400);
                    if (seats === 0) return null;
                    return (
                      <div className="col" key={c.id}>
                        <div className="p-2 border rounded text-center h-100">
                          <div className="fw-bold fs-3">{seats}</div>
                          <div className="small text-muted fw-bold" style={{ color: c.color }}>{c.party}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: DETAILED BREAKDOWN (Map + Tables) */}
      <div className="row g-4 mb-5">
        {/* Left Col: Detailed Table */}
        <div className="col-lg-8">
          <div className="card shadow-sm h-100">
            <div className="card-header py-3">
              <h5 className="mb-0">Candidate Standings</h5>
            </div>
            <div className="card-body p-0">
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-warning" role="status"></div>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th className="ps-4">Candidate / Party</th>
                        <th style={{ width: '30%' }}>Vote Share</th>
                        <th className="text-end">Total Votes</th>
                        <th className="text-end pe-4">%</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedCandidates.map(c => {
                        const votes = candidateTotals[c.id] || 0;
                        const pct = totalVotes > 0 ? (votes / totalVotes) * 100 : 0;
                        return (
                          <tr key={c.id}>
                            <td className="ps-4">
                              <div className="d-flex align-items-center">
                                <div 
                                  className="rounded-circle me-3 border" 
                                  style={{ width: '15px', height: '15px', backgroundColor: c.color }}
                                ></div>
                                <div>
                                  <div className="fw-bold">{c.name}</div>
                                  <div className="small text-muted">{c.party}</div>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="progress" style={{ height: '6px' }}>
                                <div 
                                  className="progress-bar" 
                                  style={{ width: `${pct}%`, backgroundColor: c.color }}
                                ></div>
                              </div>
                            </td>
                            <td className="text-end font-monospace">{votes.toLocaleString()}</td>
                            <td className="text-end fw-bold pe-4">{pct.toFixed(2)}%</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Col: Geographic Visual */}
        <div className="col-lg-4">
           <ProvinceMap results={filteredResults} />
        </div>
      </div>

      {/* SECTION 4: SYSTEM INTEGRITY (Footer) */}
      <div className="row mb-5">
        <div className="col-12">
           <AuditLedger results={results} />
        </div>
      </div>

      <div className="alert alert-light border shadow-sm d-flex align-items-center justify-content-center text-muted">
        <span className="me-2">ℹ️</span>
        <small>
          <strong>Official IEX Disclaimer:</strong> These results are preliminary and verified via SHA-256 secure digital transmission. Final physical ballot audits are pending.
        </small>
      </div>
    </main>
  );
}
