import React, {useContext, useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import {API} from "aws-amplify";
import {AppContext} from "../components/AppContext";
import ReactModal from "react-modal";
import {useModal} from "react-modal-hook";

export default function Rooms() {

  const [rooms, setRooms] = useState([]);
  const [hasError, setError] = useState(false);
  const [isLoading, setLoading] = useState(true);

  const [newRoomName, setNewRoomName] = useState('');
  const [createdRooms, setCreatedRooms] = useState(0);
  const [modalErrorText, setModalErrorText] = useState('');

  const { idToken, username } = useContext(AppContext);

  useEffect(() => {
    if (idToken !== '') {
      API.get('RavenApi', '/v1/rooms', {
        headers: {Authorization: idToken}
      })
        .then(resp => {
          setLoading(false);
          setRooms(resp);
        })
        .catch(err => setError(true));
    }
  }, [idToken, createdRooms]);

  const createRoom = () => {
    API.post('RavenApi', '/v1/rooms', {
      headers: {Authorization: idToken},
      body: {name: newRoomName}
    }).then(() => {
      setCreatedRooms(createdRooms + 1);
      hideModal();
    })
      .catch(error => {
        setModalErrorText('Unable to create the room.');
      });
  };

  const deleteRoom = (name) => {
    API.del('RavenApi', `/v1/rooms/${name}`, {
      headers: {Authorization: idToken},
    })
      .then(() => setCreatedRooms(createdRooms - 1))
  };


  const [showModal, hideModal] = useModal(() => (
    <ReactModal isOpen className="flex modal" overlayClassName="overlay">
      <div className="flex-row">
        <div className="flex-col flex-center">
          <div className="legacy-box">
            <div className="flex-row title-bar">
            </div>
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
          <Link className="list-item" to={'/rooms/' + room.name}>{room.name}</Link>
          {(username === room.creator) &&
            // eslint-disable-next-line jsx-a11y/anchor-is-valid
            <a className="list-item" onClick={() => deleteRoom(room.name)} href="#">(Delete)</a>}
        </div>
    ));
  };

  return (
    <div className="flex">
      <div className="w-500 legacy-box">
        <div className="list">
          <div className="list-header">
            <span>Chat Rooms</span>
            <span>
            <button className="bar-button" onClick={showModal}>New Chat Room</button>
          </span>
          </div>
          <div id="list-item-target" className="scroll-container">
            {hasError && <div className="error list-placeholder">Unable to load rooms.</div>}
            {isLoading && <div className="list-placeholder">Loading rooms...</div>}
            {(rooms.length === 0 && !isLoading) && <div className="list-placeholder">No rooms.</div>}
            {roomsList()}
          </div>
        </div>
      </div>
    </div>
  );

}



