import jwt from 'jsonwebtoken';
import {Request, Response} from 'express';

const SECRET_KEY = 'your-secret-key'; // You can configure this to use any string combinations you prefer.
const REFRESH_SECRET_KEY = 'your-refresh-secret-key'; // You can configure this to use any string combinations you prefer.

export function generateAccessToken(payload: object): string {
    return jwt.sign(payload, SECRET_KEY, {expiresIn: '15m'});
}

export function generateRefreshToken(payload: object): string {
    return jwt.sign(payload, REFRESH_SECRET_KEY, {expiresIn: '7d'});
}

export function isAuthenticated(authHeader: string): boolean {

    if (!authHeader) return false;

    const token = authHeader.split(' ')[1];

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return false;
    });
}

export function refreshToken(req: Request, res: Response) {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) return res.sendStatus(401);

    jwt.verify(refreshToken, REFRESH_SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);

        const accessToken = generateAccessToken({username: user.username});
        res.json({accessToken});
    });
}

