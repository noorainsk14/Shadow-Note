import dbConnect from '@/lib/dbConnect';
import UserModel from '@/models/Users';
import mongoose from 'mongoose';
import { User } from 'next-auth';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/options';

export async function GET(request:Request) {
  await dbConnect();
    const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !user) {
    return Response.json(
      { success: false, message: 'Not authenticated' },
      { status: 401 }
    );
  }
  const userId = new mongoose.Types.ObjectId(user._id);

  try {
    const user = await UserModel.aggregate(
      [
        {
          $match: { _id: userId}
        },
        {
          $unwind: '$messages'
        },
        {
          $sort: { 'messages.createdAt ': -1}
        },
        {
          $group: { _id: '$id', messages: { $push: '$messages'}}
        }
      ]
    )


     if (!user || user.length === 0) {
      return Response.json(
        { message: 'User not found', success: false },
        { status: 404 }
      );
    }

    return Response.json(
      { messages: user[0].messages },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error('An unexpected error occurred:', error);
    return Response.json(
      { message: 'Internal server error', success: false },
      { status: 500 }
    );
  }
}