import { NextResponse } from 'next/server';
import { getLeaderboard } from '@/lib/db';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const difficulty = searchParams.get('difficulty') as 'easy' | 'medium' | 'hard';

        if (!['easy', 'medium', 'hard'].includes(difficulty)) {
            return NextResponse.json({ error: 'Invalid difficulty level' }, { status: 400 });
        }

        // Add check for DATABASE_URL
        if (!process.env.DATABASE_URL) {
            console.error('DATABASE_URL is not set');
            return NextResponse.json({ error: 'Database configuration error' }, { status: 500 });
        }

        const leaderboard = await getLeaderboard(difficulty);
        return NextResponse.json(leaderboard);
    } catch (error) {
        console.error('Error in GET /api/leaderboard:', error);
        return NextResponse.json({ 
            error: 'Database connection error',
            details: process.env.NODE_ENV === 'development' ? error : undefined
        }, { status: 500 });
    }
}
