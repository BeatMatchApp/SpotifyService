declare global {
    namespace Express {
        interface Request {
            spotifyUserId?: string;
        }
    }
}
export {}