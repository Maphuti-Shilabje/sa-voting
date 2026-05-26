'use client';

import { useState } from 'react';
import { STATIONS } from '../../lib/types';
import { useRouter } from 'next/navigation';

export default function StationSetup() {
  const router = useRouter();
  const [stationId, setStationId] = useState('');

  const launchKiosk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stationId) {
      alert('Please select a station');
      return;
    }
    // Redirect to the voting page with stationId param
    router.push(`/vote?stationId=${stationId}&kiosk=true`);
  };

  return (
    <div className="max-width-600 mx-auto mt-5" style={{ maxWidth: '600px' }}>
      <div className="card shadow-lg border-0 border-top border-5 border-warning">
        <div className="card-header py-4 text-center">
          <span className="fs-1">🇿🇦</span>
          <h2 className="mb-0 mt-2">Voting Station Activation</h2>
          <p className="text-muted">Secure Kiosk Setup</p>
        </div>
        <div className="card-body p-5">
          <div className="alert alert-info d-flex align-items-center mb-4">
             <span className="fs-3 me-3">🔒</span>
             <div className="small">
               <strong>Fraud Prevention Mode:</strong> 
               <br/>
               This device will be locked to the selected station. All votes cast here will be digitally recorded individually in the central database. No manual counting required.
             </div>
          </div>

          <form onSubmit={launchKiosk}>
            <div className="mb-4">
              <label className="form-label fw-bold">Select Physical Location</label>
              <select 
                className="form-select form-select-lg" 
                value={stationId} 
                onChange={(e) => setStationId(e.target.value)}
                required
              >
                <option value="">-- Select Station --</option>
                {STATIONS.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.id})</option>
                ))}
              </select>
            </div>

            <div className="d-grid">
              <button 
                type="submit" 
                className="btn btn-dark btn-lg py-3 fw-bold"
              >
                Launch Voting Kiosk 🚀
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}