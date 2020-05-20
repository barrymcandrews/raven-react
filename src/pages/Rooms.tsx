import React, {useState} from 'react';
import {Link} from "react-router-dom";
import {useModal} from "react-modal-hook";
import {useFetch} from "use-http";
import CreateRoomModal from '../components/CreateRoomModal';
import DeleteRoomModal from '../components/DeleteRoomModal';

interface Room {
  name: string;
  creator: string;
  canDelete: boolean;
  status?: 'ready'|'deleting'|'not_ready';
}

export default function Rooms() {
  const [rooms, setRooms] = useState<Room[]>([]);

  const { get, cache, loading, error } = useFetch('/rooms', {
    onNewData: (c, n) => setRooms(n),
    retries: 1,
  }, []);

  async function reloadRooms() {
    cache.clear();
    get();
  }

  async function markRoomAsDeleting(roomName: string) {
    setRooms(rooms => rooms.map(room => ({
        ...room,
        status: room.name === roomName ? 'deleting' : room.status,
      })
    ));
  }

  const [roomToDelete, setRoomToDelete] = useState<string>('');
  const [showDeleteModal, hideDeleteModal] = useModal(() => (
    <DeleteRoomModal onClose={hideDeleteModal} onComplete={reloadRooms} deleteStarted={markRoomAsDeleting} roomToDelete={roomToDelete}/>
  ), [roomToDelete]);


  const [showCreateRoomModal, hideCreateRoomModal] = useModal(() => (
    <CreateRoomModal onClose={hideCreateRoomModal} onSuccess={reloadRooms} />
  ));

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
            <button className="link list-item" onClick={() => {setRoomToDelete(room.name); showDeleteModal()}}>(Delete)</button>
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
              <button className="bar-button" onClick={showCreateRoomModal}>New Chat Room</button>
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
