'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CANDIDATES, PROVINCES, TRANSLATIONS } from '../../lib/types';

function VoteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const stationId = searchParams.get('stationId');
  const isKiosk = searchParams.get('kiosk') === 'true';

  const [lang, setLang] = useState<'en' | 'zu' | 'xh' | 'af'>('en');
  const t = TRANSLATIONS[lang];

  // Steps: 1=ID, 2=Scan, 3=Province(if online), 4=Candidate, 5=Success
  const [step, setStep] = useState(1);
  const [idNumber, setIdNumber] = useState('');
  const [province, setProvince] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [receiptCode, setReceiptCode] = useState('');

  const validateId = (id: string) => /^\d{13}$/.test(id);

  const handleNextToScan = () => {
    if (!validateId(idNumber)) {
      setError(t.errorId);
      return;
    }
    setError('');
    setStep(2); // Go to Scan
  };

  // Auto-advance scan
  useEffect(() => {
    if (step === 2) {
      const timer = setTimeout(() => {
         // After scan, where do we go?
         if (isKiosk) {
           setStep(4); // Skip province, go to candidate
         } else {
           setStep(3); // Go to province
         }
      }, 3000); // 3 second scan
      return () => clearTimeout(timer);
    }
  }, [step, isKiosk]);

  const handleNextToCandidate = () => {
    if (!province) {
      setError(t.errorProvince);
      return;
    }
    setError('');
    setStep(4);
  };

  const handleVote = async () => {
    if (!selectedCandidate) {
      setError(t.errorParty);
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          idNumber, 
          candidateId: selectedCandidate,
          stationId,
          province: isKiosk ? undefined : province 
        })
      });

      const data = await res.json();

      if (res.ok) {
        setReceiptCode(data.receiptCode);
        setStep(5); // Success
      } else {
        setError(data.message || 'Submission failed.');
      }
    } catch (e) {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForNextVoter = () => {
    setIdNumber('');
    setSelectedCandidate('');
    setProvince('');
    setReceiptCode('');
    setStep(1);
    setError('');
  };

  return (
    <div className="max-width-600 mx-auto mt-5" style={{ maxWidth: '600px' }}>
      
      <div className="d-flex justify-content-end mb-3">
        <select 
          className="form-select w-auto form-select-sm" 
          value={lang} 
          onChange={(e) => setLang(e.target.value as any)}
        >
          <option value="en">English</option>
          <option value="zu">isiZulu</option>
          <option value="xh">isiXhosa</option>
          <option value="af">Afrikaans</option>
        </select>
      </div>

      {isKiosk && stationId && (
        <div className="text-dark text-center py-2 mb-4 rounded shadow-sm" style={{ backgroundColor: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(10px)' }}>
          <small className="uppercase letter-spacing-1 fw-bold">{t.selectStation}: {stationId}</small>
        </div>
      )}

      {/* Progress Indicator (Simplified) */}
      <div className="progress mb-5" style={{ height: '5px' }}>
        <div 
          className="progress-bar" 
          style={{ width: `${(step/5)*100}%` }}
        ></div>
      </div>

      <div className="card shadow-lg border-0">
        
        {/* STEP 1: ID */}
        {step === 1 && (
          <div className="card-body p-5 text-center">
            <h2 className="mb-4">{t.title}</h2>
            <p className="text-muted mb-4">{t.subtitle}</p>
            
            <input 
              type="text" 
              className="form-control form-control-lg text-center letter-spacing-2 mb-3" 
              placeholder={t.placeholderId}
              value={idNumber}
              onChange={(e) => setIdNumber(e.target.value.replace(/\D/g, '').slice(0, 13))}
            />
            
            {error && <div className="alert alert-danger">{error}</div>}

            <button 
              className="btn btn-primary btn-lg w-100 mt-3"
              onClick={handleNextToScan}
            >
              {t.btnNext} &rarr;
            </button>
          </div>
        )}

        {/* STEP 2: BIO SCAN */}
        {step === 2 && (
          <div className="card-body p-5 text-center">
             <h3 className="mb-4">{t.scanTitle}</h3>
             
             <div className="scan-container mb-4">
                <div className="scan-line"></div>
                <div className="face-icon">☺</div>
             </div>
             
             <p className="lead">{t.scanMsg}</p>
             <div className="spinner-border text-primary mt-3" role="status"></div>
          </div>
        )}

        {/* STEP 3: PROVINCE (Online Only) */}
        {step === 3 && (
          <div className="card-body p-5 text-center">
            <h2 className="mb-4">{t.selectProvince}</h2>
            
            <select 
              className="form-select form-select-lg mb-4"
              value={province}
              onChange={(e) => setProvince(e.target.value)}
            >
              <option value="">-- Choose --</option>
              {PROVINCES.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            
            {error && <div className="alert alert-danger">{error}</div>}

            <div className="d-flex gap-2">
               <button className="btn btn-outline-secondary" onClick={() => setStep(1)}>{t.btnBack}</button>
               <button 
                className="btn btn-primary btn-lg flex-grow-1"
                onClick={handleNextToCandidate}
              >
                {t.btnNext} &rarr;
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: CANDIDATE */}
        {step === 4 && (
          <div className="card-body p-4">
            <h3 className="mb-4 text-center">{t.chooseParty}</h3>
            
            <div className="list-group mb-4">
              {CANDIDATES.map(c => (
                <button
                  key={c.id}
                  type="button"
                  className={`list-group-item list-group-item-action p-3 d-flex align-items-center ${selectedCandidate === c.id ? 'active border-primary' : ''}`}
                  onClick={() => setSelectedCandidate(c.id)}
                  style={{ color: 'inherit', borderColor: selectedCandidate === c.id ? c.color : 'rgba(255,255,255,0.6)' }}
                >
                  <div 
                    className="rounded-circle me-3 border" 
                    style={{ width: '20px', height: '20px', backgroundColor: c.color }}
                  ></div>
                  <div className="flex-grow-1">
                    <h5 className="mb-0 fw-bold">{c.party}</h5>
                    <small className="text-muted">{c.name}</small>
                  </div>
                  {selectedCandidate === c.id && <span className="text-primary fw-bold">✓</span>}
                </button>
              ))}
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            <div className="d-flex gap-2">
              <button className="btn btn-outline-secondary" onClick={() => setStep(isKiosk ? 1 : 3)}>{t.btnBack}</button>
              <button 
                className="btn btn-success btn-lg flex-grow-1 fw-bold"
                onClick={handleVote}
                disabled={submitting}
              >
                {t.btnVote}
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: SUCCESS */}
        {step === 5 && (
          <div className="card-body p-5 text-center">
            <div className="mb-4 text-success display-1">✔</div>
            <h2 className="mb-3">{t.successTitle}</h2>
            <p className="text-muted mb-4">{t.successMsg}</p>
            
            <div className="bg-light p-3 rounded border mb-4">
               <label className="small text-muted uppercase fw-bold mb-1">{t.receiptLabel}</label>
               <div className="display-6 font-monospace">{receiptCode}</div>
               <div className="small text-muted mt-2">Save this code to verify your vote.</div>
            </div>

            <a href={`/verify?code=${receiptCode}`} className="btn btn-link mb-3">{t.checkLink}</a>

            {isKiosk ? (
              <button 
                className="btn btn-warning btn-lg fw-bold w-100"
                onClick={resetForNextVoter}
              >
                Next Voter &rarr;
              </button>
            ) : (
              <button 
                className="btn btn-primary w-100"
                onClick={() => router.push('/')}
              >
                View Live Results Dashboard
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

export default function VotePage() {
  return (
    <Suspense fallback={<div className="text-center mt-5">Loading...</div>}>
      <VoteContent />
    </Suspense>
  );
}