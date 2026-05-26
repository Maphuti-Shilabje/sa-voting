'use client';

import { useState, Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

function VerifyContent() {
  const searchParams = useSearchParams();
  const initialCode = searchParams.get('code') || '';
  
  const [code, setCode] = useState(initialCode);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const checkVote = async () => {
    if (!code) return;
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      });
      const data = await res.json();
      
      if (data.found) {
        setResult(data);
      } else {
        setError('Receipt code not found. Please check and try again.');
      }
    } catch (e) {
      setError('System error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Auto-check if code comes from URL
  useEffect(() => {
    if (initialCode) {
      checkVote();
    }
  }, []);

  return (
    <div className="max-width-600 mx-auto mt-5" style={{ maxWidth: '600px' }}>
      <div className="card shadow-lg border-0 border-top border-5 border-success">
        <div className="card-header py-4 text-center">
           <h2 className="mb-0">🗳 Vote Verification</h2>
           <p className="text-muted">Public Audit Portal</p>
        </div>
        <div className="card-body p-5">
           
           <div className="mb-4">
             <label className="form-label fw-bold">Enter Receipt Code</label>
             <div className="input-group input-group-lg">
                <input 
                  type="text" 
                  className="form-control font-monospace text-uppercase"
                  placeholder="A7B2-99X1"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                />
                <button 
                  className="btn btn-success"
                  onClick={checkVote}
                  disabled={loading}
                >
                  {loading ? 'Checking...' : 'Verify'}
                </button>
             </div>
           </div>

           {error && (
             <div className="alert alert-danger d-flex align-items-center">
               <span className="me-2">❌</span> {error}
             </div>
           )}

           {result && (
             <div className="p-4 rounded border border-success" style={{ backgroundColor: 'rgba(255,255,255,0.4)', backdropFilter: 'blur(5px)' }}>
               <div className="text-center mb-3">
                 <div className="badge bg-success fs-6 mb-2">Verified Record Found</div>
               </div>
               <dl className="row mb-0">
                 <dt className="col-sm-4 text-muted">Time Cast:</dt>
                 <dd className="col-sm-8">{new Date(result.timestamp).toLocaleString()}</dd>

                 <dt className="col-sm-4 text-muted">Vote For:</dt>
                 <dd className="col-sm-8 fw-bold">{result.party} ({result.candidateName})</dd>

                 <dt className="col-sm-4 text-muted">Location:</dt>
                 <dd className="col-sm-8">{result.stationId === 'ONLINE' ? 'Online Voting' : result.stationId}</dd>

                 <dt className="col-sm-4 text-muted">Province:</dt>
                 <dd className="col-sm-8">{result.province}</dd>
               </dl>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyContent />
    </Suspense>
  );
}
