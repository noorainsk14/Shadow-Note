import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/Users";
import { getServerSession } from "next-auth";
import { User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import mongoose from 'mongoose';
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";



export async function DELETE(
  request: NextRequest,
  context: { params: { messageid: string } }
) {
  const messageId = context.params.messageid;;
  await dbConnect();

  const session = await getServerSession(authOptions);
  const _user: User = session?.user as User;

  if (!session || !_user) {
    return NextResponse.json(
      {
        success: false,
        message: "Not authenticated",
      },
      { status: 401 }
    );
  }

  try {
//const messageObjectId = new mongoose.Types.ObjectId(messageId);

    const updatedResult = await UserModel.updateOne(
      { _id: _user._id },
      { $pull: { messages: { _id: messageId  } } }
    );

    if (updatedResult.modifiedCount === 0) {
      return NextResponse.json(
        { mesage: "Message not found or already deleted", success: false },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Message deleted", success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting message", error);
    return NextResponse.json(
      {
        message: "Error in deleting Message",
        success: false,
      },
      { status: 500 }
    );
  }
}
