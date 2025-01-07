import {NextResponse} from 'next/server';
import jwt from 'jsonwebtoken';

export async function POST(request) {
    const {username, password} = await request.json();
    console.log(process.env.JWT_EXPIRATION);

    const mockUser = {
        username: 'johndoe',
        password: 'password123',
    };


    if (username === mockUser.username && password === mockUser.password) {

        const accessToken = jwt.sign({username: mockUser.username}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRATION});

        const refreshToken = jwt.sign({username: mockUser.username}, process.env.JWT_REFRESH_SECRET, {expiresIn: process.env.JWT_REFRESH_EXPIRATION});

        return NextResponse.json({accessToken, refreshToken});
    } else {
        return new NextResponse('Invalid credentials', {status: 401});
    }
}
