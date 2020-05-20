import React from 'react';
import ReactModal from 'react-modal';
import useFetch from 'use-http/dist';

type DeleteRoomModalProps = {
  onClose: () => void,
  onComplete: () => void,
  deleteStarted: (roomName: string) => void,
  roomToDelete: string,
};
export default function DeleteRoomModal({onClose, onComplete, deleteStarted, roomToDelete}: DeleteRoomModalProps) {

  const { del } = useFetch(`/rooms/${encodeURIComponent(roomToDelete)}`, {retries: 1});

  async function deleteRoom(name: string) {
    onClose();
    deleteStarted(name);
    await del();
    onComplete();
  }

  return (
    <ReactModal isOpen className="flex modal" overlayClassName="overlay">
      <div className="flex-row">
        <div className="flex-col flex-center">
          <div className="legacy-box">
            <div className="flex-row title-bar"/>
            <p>Are you sure you want to delete "{roomToDelete}"?<br/><br/>All messages will be deleted. You cannot undo this action.</p>
            <div className="divider"/>
            <div className="flex-row flex-end">
              <button className="login-btn-sm" onClick={() => deleteRoom(roomToDelete)}>Yes, Delete</button>
              <button className="login-btn-sm" onClick={onClose}>Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </ReactModal>
  );
}
