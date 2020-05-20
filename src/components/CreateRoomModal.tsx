import React, {useState} from 'react';
import ReactModal from 'react-modal';
import useFetch from 'use-http/dist';

type CreateRoomModalProps = {
  onClose: () => void,
  onSuccess: () => void,
};
export default function CreateRoomModal({onClose, onSuccess}: CreateRoomModalProps) {
  const [modalErrorText, setModalErrorText] = useState('');
  const [newRoomName, setNewRoomName] = useState('');
  const { post, response } = useFetch('/rooms');

  async function createRoom() {
    if (newRoomName === '') {
      setModalErrorText('Room name cannot be empty');
      return;
    }

    await post({name: newRoomName});
    if (response.ok) {
      onSuccess();
      onClose();
      setModalErrorText('');
    } else {
      setModalErrorText('Unable to create the room.');
    }
  }

  return (
    <ReactModal isOpen className="flex modal" overlayClassName="overlay">
      <div className="flex-row">
        <div className="flex-col flex-center">
          <div className="legacy-box">
            <div className="flex-row title-bar"/>
            <p>Enter a name for your new room. The name must be unique.</p>
            {modalErrorText !== '' && <p className="error">{modalErrorText}</p>}
            <div className="flex-row">
              <input placeholder="my-room-name" onChange={e => setNewRoomName(e.target.value)}/>
            </div>
            <div className="divider"/>
            <div className="flex-row flex-end">
              <button className="login-btn-sm" onClick={() => createRoom()}>Create</button>
              <button className="login-btn-sm" onClick={() => onClose()}>Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </ReactModal>
  );
}
