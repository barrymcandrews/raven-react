import React, {useState} from 'react';
import {Link} from "react-router-dom";
import ReactModal from "react-modal";
import {useModal} from "react-modal-hook";
import {useFetch} from "use-http";

interface Room {
  name: string;
  creator: string;
  canDelete: boolean;
  status?: 'ready'|'deleting'|'not_ready';
}

export default function Rooms() {

  const [newRoomName, setNewRoomName] = useState('');
  const [modalErrorText, setModalErrorText] = useState('');
  const [rooms, setRooms] = useState<Room[]>([]);

  const { get, cache, loading, error } = useFetch('/rooms', {
    onNewData: (c, n) => setRooms(n),
    retries: 1,
  }, []);
  const { post, del, response } = useFetch('/rooms');

  async function createRoom() {
    await post({name: newRoomName});
    if (response.ok) {
      cache.clear();
      get();
      hideModal();
    } else {
      setModalErrorText('Unable to create the room.');
    }
  }

  const [roomToDelete, setRoomToDelete] = useState<string>('');
   const [showDeleteModal, hideDeleteModal] = useModal(() => (
    <ReactModal isOpen className="flex modal" overlayClassName="overlay">
      <div className="flex-row">
        <div className="flex-col flex-center">
          <div className="legacy-box">
            <div className="flex-row title-bar"/>
            <p>Are you sure you want to delete "{roomToDelete}"?<br/><br/>All messages will be deleted. You cannot undo this action.</p>
            <div className="divider"/>
            <div className="flex-row flex-end">
              <button className="login-btn-sm" onClick={() => {deleteRoom(roomToDelete); hideDeleteModal()}}>Yes, Delete</button>
              <button className="login-btn-sm" onClick={hideDeleteModal}>Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </ReactModal>
  ), [roomToDelete]);

  async function deleteRoom(name: string) {
    setRooms(rooms => {
      return rooms.map(room => {
        return {
          ...room,
          status: room.name === name ? 'deleting' : room.status,
        }
      })
    })
    await del(name);
    if (response.ok) {
      cache.clear();
      get();
    }
  }

  const [showModal, hideModal] = useModal(() => (
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
              <button className="login-btn-sm" onClick={hideModal}>Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </ReactModal>
  ), [modalErrorText, newRoomName]);

  const roomsList = () => {
    return rooms.map((room, index) => (
        <div key={`room-${index}`} className="list-item list-button">
          {room.status === 'ready' &&
            <Link className="list-item" to={'/rooms/' + room.name}>{room.name}</Link>
          }
          {room.status !== 'ready' &&
          <u className="list-item disabled">{room.name}</u>
          }

          {room.status === 'deleting' &&
            <u className="list-item disabled">(Deleting...)</u>
          }
          {room.canDelete && room.status === 'ready' &&
            // eslint-disable-next-line jsx-a11y/anchor-is-valid
            <a className="list-item" onClick={() => {setRoomToDelete(room.name); showDeleteModal()}} href="#">(Delete)</a>
          }
        </div>
    ));
  };

  return (
    <div className="flex">
      <div className="p-b-10 w-500 legacy-box">
        <div className="list">
          <div className="list-header">
            <span>Chat Rooms</span>
            <span>
            <button className="bar-button" onClick={showModal}>New Chat Room</button>
          </span>
          </div>
          <div id="list-item-target" className="scroll-container">
            {error && <div className="error list-placeholder">Unable to load rooms.</div>}
            {loading && rooms.length === 0 && <div className="list-placeholder">Loading rooms...</div>}
            {rooms.length === 0 && !loading && !error && <div className="list-placeholder">No rooms.</div>}
            {roomsList()}
          </div>
        </div>
      </div>
    </div>
  );
}
