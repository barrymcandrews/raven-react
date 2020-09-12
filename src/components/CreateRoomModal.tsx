import React from 'react';
import ReactModal from 'react-modal';
import useFetch from 'use-http/dist';
import {useFormik} from 'formik';
import * as Yup from 'yup';

type CreateRoomModalProps = {
  onClose: () => void,
  onSuccess: () => void,
};

interface CreateRoomFormValues {
  roomName: string;
}

export default function CreateRoomModal({onClose, onSuccess}: CreateRoomModalProps) {
  const { post, response } = useFetch('/rooms');

  const formik = useFormik<CreateRoomFormValues>({
    initialValues: {
      roomName: ''
    },
    validationSchema: Yup.object({
      roomName: Yup.string()
        .required('Room name cannot be empty.')
        .max(30, 'Room name cannot be more than 30 characters.'),
    }),
    onSubmit: createRoom,
  });

  async function createRoom(values: CreateRoomFormValues) {

    await post({name: values.roomName});
    if (response.ok) {
      onSuccess();
      onClose();
    } else {
      if (response.status === 409) {
        formik.setStatus(`A room named "${values.roomName}" already exists.`);
      } else {
        formik.setStatus('Unable to create room.');
      }
    }
  }

  return (
    <ReactModal isOpen className="flex modal" overlayClassName="overlay">
      <div className="flex-row">
        <div className="flex-col flex-center">
          <form onSubmit={formik.handleSubmit} className="legacy-box">
            <div className="flex-row title-bar"/>
            <p>Enter a name for your new room. The name must be unique.</p>
            {formik.status && <p className="error">{formik.status}</p>}
            {formik.touched.roomName && formik.errors.roomName &&
            <p className="error">{formik.errors.roomName}</p>
            }
            <div className="flex-row">
              <input autoFocus placeholder="my-room-name" {...formik.getFieldProps('roomName')} />
            </div>
            <div className="divider"/>
            <div className="flex-row flex-end">
              <button className="login-btn-sm" type="submit">Create</button>
              <button className="login-btn-sm" onClick={onClose}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </ReactModal>
  );
}
