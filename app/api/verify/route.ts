import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { CANDIDATES } from '../../../lib/types';

const VOTES_FILE = path.join(process.cwd(), 'individual_votes.json');

interface IndividualVote {
  id: string; 
  candidateId: string;
  stationId: string;
  province?: string;
  receiptCode: string;
  timestamp: string;
}

export async function POST(request: Request) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json({ message: 'Missing code' }, { status: 400 });
    }

    let votes: IndividualVote[] = [];
    try {
      const data = fs.readFileSync(VOTES_FILE, 'utf8');
      votes = JSON.parse(data);
    } catch (e) {
      votes = [];
    }

    const vote = votes.find(v => v.receiptCode === code);

    if (!vote) {
      return NextResponse.json({ found: false });
    }

    const candidate = CANDIDATES.find(c => c.id === vote.candidateId);

    return NextResponse.json({
      found: true,
      timestamp: vote.timestamp,
      party: candidate?.party || 'Unknown',
      candidateName: candidate?.name || 'Unknown',
      stationId: vote.stationId,
      province: vote.province
    });

  } catch (e) {
    return NextResponse.json({ message: 'Error' }, { status: 500 });
  }
}
