import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/Users";
import { getServerSession } from "next-auth";
import { User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import mongoose from 'mongoose';



export async function DELETE(
  request: Request,
  { params }: { params: { messageid: string } }
) {
  const messageId = params.messageid;
  await dbConnect();

  const session = await getServerSession(authOptions);
  const _user: User = session?.user as User;

  if (!session || !_user) {
    return Response.json(
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
      return Response.json(
        { mesage: "Message not found or already deleted", success: false },
        { status: 404 }
      );
    }

    return Response.json(
      { message: "Message deleted", success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting message", error);
    return Response.json(
      {
        message: "Error in deleting Message",
        success: false,
      },
      { status: 500 }
    );
  }
}
