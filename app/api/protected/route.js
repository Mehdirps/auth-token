import {NextResponse} from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(request) {

    const authHeader = request.headers.get('authorization');

    const token = authHeader && authHeader.split(' ')[1];


    if (!token) {
        return new NextResponse('No token provided', {status: 401});
    }
    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);


        return NextResponse.json(decoded);
    } catch (error) {

        return new NextResponse('Invalid token', {status: 403});
    }
}
