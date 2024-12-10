import { neon } from '@neondatabase/serverless';

// initialize database connection
const sql = neon(process.env.DATABASE_URL!);

// type for leaderboard entries
export interface LeaderboardEntry {
    id: number;
    player_name: string;
    time_seconds: number;
    created_at: Date;
}

// function to initialize database
export async function initDatabase() {
    try {
        await sql`
            CREATE TABLE IF NOT EXISTS leaderboard_easy (
                id SERIAL PRIMARY KEY,
                player_name VARCHAR(255) NOT NULL,
                time_seconds INTEGER NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;

        await sql`
            CREATE TABLE IF NOT EXISTS leaderboard_medium (
                id SERIAL PRIMARY KEY,
                player_name VARCHAR(255) NOT NULL,
                time_seconds INTEGER NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;

        await sql`
            CREATE TABLE IF NOT EXISTS leaderboard_hard (
                id SERIAL PRIMARY KEY,
                player_name VARCHAR(255) NOT NULL,
                time_seconds INTEGER NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;

        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Error initializing database:', error);
        throw error;
    }
}

// function to get leaderboard by difficulty
export async function getLeaderboard(difficulty: 'easy' | 'medium' | 'hard') {
    try {
        let result;
        
        switch(difficulty) {
            case 'easy':
                result = await sql`
                    SELECT * FROM leaderboard_easy
                    ORDER BY time_seconds ASC
                    LIMIT 5
                `;
                break;
            case 'medium':
                result = await sql`
                    SELECT * FROM leaderboard_medium
                    ORDER BY time_seconds ASC
                    LIMIT 5
                `;
                break;
            case 'hard':
                result = await sql`
                    SELECT * FROM leaderboard_hard
                    ORDER BY time_seconds ASC
                    LIMIT 5
                `;
                break;
        }
        
        return result as LeaderboardEntry[];
    } catch (error) {
        console.error(`Error fetching ${difficulty} leaderboard:`, error);
        throw error;
    }
}

// function to add a new leaderboard entry
export async function addLeaderboardEntry(
    difficulty: 'easy' | 'medium' | 'hard',
    playerName: string,
    timeSeconds: number
) {
    try {
        let result;
        
        switch(difficulty) {
            case 'easy':
                result = await sql`
                    INSERT INTO leaderboard_easy (player_name, time_seconds)
                    VALUES (${playerName}, ${timeSeconds})
                    RETURNING *
                `;
                await sql`
                    DELETE FROM leaderboard_easy
                    WHERE id IN (
                        SELECT id FROM leaderboard_easy
                        ORDER BY time_seconds ASC
                        OFFSET 5
                    )
                `;
                break;
            case 'medium':
                result = await sql`
                    INSERT INTO leaderboard_medium (player_name, time_seconds)
                    VALUES (${playerName}, ${timeSeconds})
                    RETURNING *
                `;
                await sql`
                    DELETE FROM leaderboard_medium
                    WHERE id IN (
                        SELECT id FROM leaderboard_medium
                        ORDER BY time_seconds ASC
                        OFFSET 5
                    )
                `;
                break;
            case 'hard':
                result = await sql`
                    INSERT INTO leaderboard_hard (player_name, time_seconds)
                    VALUES (${playerName}, ${timeSeconds})
                    RETURNING *
                `;
                await sql`
                    DELETE FROM leaderboard_hard
                    WHERE id IN (
                        SELECT id FROM leaderboard_hard
                        ORDER BY time_seconds ASC
                        OFFSET 5
                    )
                `;
                break;
        }

        return result[0] as LeaderboardEntry;
    } catch (error) {
        console.error('Error adding leaderboard entry:', error);
        throw error;
    }
}

export { sql };
