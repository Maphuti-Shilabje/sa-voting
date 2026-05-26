import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { StationResult, CANDIDATES, STATIONS } from '../../../lib/types';

const VOTES_FILE = path.join(process.cwd(), 'individual_votes.json');

interface IndividualVote {
  id: string;
  candidateId: string;
  stationId: string;
  province?: string;
  timestamp: string;
}

function getIndividualVotes(): IndividualVote[] {
  try {
    const data = fs.readFileSync(VOTES_FILE, 'utf8');
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
}

export async function GET() {
  const votes = getIndividualVotes();
  
  // Initialize results map
  const stationMap: Record<string, StationResult> = {};

  // Initialize standard stations
  STATIONS.forEach(s => {
    stationMap[s.id] = {
      stationId: s.id,
      stationName: s.name,
      province: s.province,
      votes: {}, // Will fill below
      timestamp: new Date().toISOString(),
      verified: true // In this model, system verification is inherent
    };
    // Init candidate counts to 0
    CANDIDATES.forEach(c => stationMap[s.id].votes[c.id] = 0);
  });

  // Aggregate Votes
  votes.forEach(vote => {
    let targetStationId = vote.stationId;

    // If it's an online vote (or unknown station), we map it to a Virtual Provincial Station
    if (!stationMap[targetStationId]) {
      const province = vote.province || 'National (Digital)';
      const virtualId = `ONLINE-${province.replace(/\s+/g, '-')}`;
      
      if (!stationMap[virtualId]) {
        stationMap[virtualId] = {
          stationId: virtualId,
          stationName: `Online Voting (${province})`,
          province: province,
          votes: {},
          timestamp: new Date().toISOString(),
          verified: true
        };
        CANDIDATES.forEach(c => stationMap[virtualId].votes[c.id] = 0);
      }
      targetStationId = virtualId;
    }
    
    if (stationMap[targetStationId].votes[vote.candidateId] !== undefined) {
      stationMap[targetStationId].votes[vote.candidateId]++;
    }
  });

  const results = Object.values(stationMap);

  return NextResponse.json(results);
}

// We no longer need the POST endpoint for manual station reporting
// But we'll keep a dummy one or remove it. Let's return 405 Method Not Allowed
export async function POST() {
  return NextResponse.json(
    { message: 'Manual station reporting is disabled. Use the Voting Kiosk.' },
    { status: 405 }
  );
}