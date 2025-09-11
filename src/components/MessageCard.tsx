'use client'

import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import dayjs from 'dayjs';
import { X } from 'lucide-react';
import { Message } from '@/models/Users';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from './ui/button';
import { ApiResponse } from '@/types/ApiResponse';
import { toast } from 'sonner';
 type MessageCardProps = {
  message: Message;
  onMessageDelete : (messageId: string) => void;

}

export function MessageCard({message, onMessageDelete}: MessageCardProps){

  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteConfirm = async() => {
    setIsDeleting(true);
    try {
      const messageId = message._id.toString();

      const response = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`);

      toast(response.data.message)
      onMessageDelete(messageId)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast("Error", 
        {
          description: axiosError.response?.data.message ?? 'Failed to delete message'
        }
      )
    }finally {
    setIsDeleting(false);
  }
  }

  return(
    <Card className="card-bordered">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{message.content}</CardTitle>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant='destructive'>
                <X className="w-5 h-5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  this message.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteConfirm} disabled={isDeleting}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
         <div className="text-sm">
          {dayjs(message.createdAt).format('MMM D, YYYY h:mm A')}
        </div>
      </CardHeader>
    </Card>
  )
}