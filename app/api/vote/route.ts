import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const VOTES_FILE = path.join(process.cwd(), 'individual_votes.json');
const IDS_FILE = path.join(process.cwd(), 'voted_ids.json');

interface IndividualVote {
  id: string; 
  candidateId: string;
  stationId: string;
  province?: string; // Added province tracking
  receiptCode: string; // Added receipt code
  timestamp: string;
}

function getVotedIds(): string[] {
  try {
    const data = fs.readFileSync(IDS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
}

function saveVotedId(id: string) {
  const ids = getVotedIds();
  ids.push(id);
  fs.writeFileSync(IDS_FILE, JSON.stringify(ids, null, 2));
}

function saveVote(vote: IndividualVote) {
  let votes: IndividualVote[] = [];
  try {
    const data = fs.readFileSync(VOTES_FILE, 'utf8');
    votes = JSON.parse(data);
  } catch (e) {
    votes = [];
  }
  votes.push(vote);
  fs.writeFileSync(VOTES_FILE, JSON.stringify(votes, null, 2));
}

export async function POST(request: Request) {
  try {
    const { idNumber, candidateId, stationId, province } = await request.json();

    if (!idNumber || !/^\d{13}$/.test(idNumber)) {
      return NextResponse.json({ message: 'Invalid ID Number' }, { status: 400 });
    }

    if (!candidateId) {
      return NextResponse.json({ message: 'No candidate selected' }, { status: 400 });
    }

    const votedIds = getVotedIds();
    if (votedIds.includes(idNumber)) {
      return NextResponse.json({ message: 'This ID has already cast a vote.' }, { status: 403 });
    }

    // Generate a short, readable receipt code (e.g., A7B2-99X1)
    const receiptCode = crypto.randomBytes(3).toString('hex').toUpperCase().match(/.{1,2}/g)?.join('') || 'ERROR';

    const newVote: IndividualVote = {
      id: idNumber,
      candidateId,
      stationId: stationId || 'ONLINE', 
      province: province || 'Digital', // Use provided province or default
      receiptCode,
      timestamp: new Date().toISOString()
    };

    saveVotedId(idNumber);
    saveVote(newVote);

    return NextResponse.json({ success: true, receiptCode });
  } catch (e) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
