'use client';

import { useState, useEffect, useRef } from 'react';
import { CANDIDATES, STATIONS } from '../../lib/types';

export default function AdminPage() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  
  // Live Feed State
  const [isLive, setIsLive] = useState(false);
  const [liveStats, setLiveStats] = useState(0);
  const liveIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const seedData = async () => {
    setLoading(true);
    setStatus('Generating mock individual votes...');

    try {
      let totalVotesAdded = 0;

      for (const station of STATIONS) {
        const voteCount = Math.floor(Math.random() * 50) + 50;
        
        for (let i = 0; i < voteCount; i++) {
          await submitRandomVote(station.id);
        }
        totalVotesAdded += voteCount;
      }
      setStatus(`Success! Added ${totalVotesAdded} individual votes across all stations.`);
    } catch (e) {
      setStatus('Error seeding data.');
    } finally {
      setLoading(false);
    }
  };

  const submitRandomVote = async (stationId?: string) => {
    // Weighted random candidate selection
    const rand = Math.random();
    let candidateId = CANDIDATES[0].id; // Default EFF
    
    if (rand > 0.5) candidateId = CANDIDATES[1].id; // DA
    else if (rand > 0.5) candidateId = CANDIDATES[2].id; // ANC
    else if (rand > 0.9) candidateId = CANDIDATES[3].id; // MK
    
    // Generate a fake ID
    const fakeId = Math.floor(1000000000000 + Math.random() * 9000000000000).toString();

    // Use a random station if not provided (simulating online or random station activity)
    const targetStation = stationId || STATIONS[Math.floor(Math.random() * STATIONS.length)].id;

    await fetch('/api/vote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        idNumber: fakeId,
        candidateId,
        stationId: targetStation,
        province: 'Gauteng' // Simplification for mock
      })
    });
  };

  const toggleLiveFeed = () => {
    if (isLive) {
      // Stop
      if (liveIntervalRef.current) clearInterval(liveIntervalRef.current);
      setIsLive(false);
    } else {
      // Start
      setIsLive(true);
      liveIntervalRef.current = setInterval(async () => {
        await submitRandomVote();
        setLiveStats(prev => prev + 1);
      }, 200); // 5 votes per second
    }
  };

  useEffect(() => {
    return () => {
      if (liveIntervalRef.current) clearInterval(liveIntervalRef.current);
    };
  }, []);

  return (
    <div className="card shadow-sm border-0">
      <div className="card-body p-5">
        <h2 className="mb-4">System Administration</h2>
        <p className="text-muted mb-5">Tools for managing the mocked MVP environment.</p>

        <div className="row g-4">
          <div className="col-md-4">
            <div className="p-4 border rounded h-100">
              <h4>Bulk Seeding</h4>
              <p className="small text-muted">Generate hundreds of static votes instantly to populate the dashboard.</p>
              <button 
                className="btn btn-primary w-100" 
                onClick={seedData}
                disabled={loading || isLive}
              >
                {loading ? 'Seeding...' : 'Seed Mock Votes'}
              </button>
              {status && <div className="mt-3 alert alert-info py-2 small">{status}</div>}
            </div>
          </div>

          <div className="col-md-4">
            <div className={`p-4 border rounded h-100 ${isLive ? 'bg-success text-white' : 'bg-light'}`}>
              <h4>🔴 Live Simulation</h4>
              <p className={`small ${isLive ? 'text-white-50' : 'text-muted'}`}>
                Simulate election day traffic. Votes are dripped in every 200ms.
              </p>
              <div className="display-4 fw-bold mb-3">{liveStats}</div>
              <button 
                className={`btn w-100 fw-bold ${isLive ? 'btn-light text-success' : 'btn-success'}`}
                onClick={toggleLiveFeed}
              >
                {isLive ? 'Stop Live Feed' : 'Start Live Feed'}
              </button>
            </div>
          </div>

          <div className="col-md-4">
            <div className="p-4 border rounded h-100">
              <h4>Database Status</h4>
              <p className="small text-muted">Using local JSON storage.</p>
              <ul className="list-unstyled small mb-0">
                <li>✅ Individual Vote Tracking</li>
                <li>✅ Fraud Prevention Active</li>
                <li>✅ Biometric Mock Active</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
