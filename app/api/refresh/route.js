import {NextResponse} from 'next/server';
import jwt from 'jsonwebtoken';

export async function POST(request) {

    const {refreshToken} = await request.json();


    if (!refreshToken) {
        return new NextResponse('No refresh token provided', {status: 401});
    }
    try {

        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const accessToken = jwt.sign({username: decoded.username}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRATION});

        return NextResponse.json({accessToken});

    } catch (error) {
        // 6. Renvoyer une erreur spécifiant que le "refreshToken" n'est pas valide.
        return new NextResponse('Invalid refresh token', {status: 403});
    }
}
