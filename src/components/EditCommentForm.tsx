import React from 'react'
import { useForm } from 'react-hook-form';
import LoadingSpinner from './LoadingSpinner';

type Props = {
  disableInput: boolean;
  isLoggedIn: boolean;
  text: string;
  onClick: (value: string) => any,
}

const EditCommentForm = (props: Props) => {
  const { register, handleSubmit, getValues, formState: { errors } } = useForm({
    defaultValues: {
      comment: props.text,
    }
  });

  return (
    <>
       <form onSubmit={handleSubmit(() => {props.onClick(getValues('comment'))})} className="relative mt-1 p-8 text-black w-full mx-auto bg-white" noValidate>
          {!props.isLoggedIn && <div className="absolute align-middle w-full h-full text-white comment-deny text-sm md:text-lg">You must be logged in to edit.</div>}
          <div className="mb-6">
            <input {...register("comment", {
              required: 'Comment is required',
              minLength: { value: 6, message: 'Comment is too short!' },
              maxLength: { value: 255, message: 'Comment is too long!' }
            })} autoComplete="off" type="text" id="editcm" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Edit a comment..." />
          </div>
          <button type="submit" className="w-full my-2 text-gray-700 focus:ring-4 focus:outline-none focus:ring-primary-300 border border-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center hover:bg-gray-300 transition-colors ease-in-out">
            {!props.disableInput ? 'Edit Comment' : <LoadingSpinner />}
          </button>
          <div className="mt-1"><p className="text-red-700 h-5 text-xs">{errors.comment?.message}</p></div>
        </form>
    </>
  )
}

export default EditCommentForm