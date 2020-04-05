import React, {useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import {Auth, API} from "aws-amplify";

export default function Rooms() {
  const [username, setUsername] = useState('');
  const [apiToken, setApiToken] = useState('');

  const [rooms, setRooms] = useState([]);
  const [hasError, setError] = useState(false);
  const [isLoading, setLoading] = useState(true);

  const [newRoomName, setNewRoomName] = useState('');
  const [createdRooms, setCreatedRooms] = useState(0);

  useEffect(() => {
    Auth.currentUserInfo()
      .then(user => {
        setUsername(user.username);
      });
  }, []);

  useEffect(() => {
    Auth.currentSession()
      .then(session => {
        console.log(session.getIdToken().getJwtToken());
        setApiToken(session.getIdToken().getJwtToken());
      });
  }, []);

  useEffect(() => {
    if (apiToken !== '') {
      API.get('RavenApi', '/v1/rooms', {
        headers: {Authorization: apiToken}
      })
        .then(resp => {
          setLoading(false);
          setRooms(resp);
        })
        .catch(err => setError(true));
    }
  }, [apiToken, createdRooms]);


  const createRoom = () => {
    API.post('RavenApi', '/v1/rooms', {
      headers: {Authorization: apiToken},
      body: {name: newRoomName}
    })
      .then(() => setCreatedRooms(createdRooms + 1))
  };

  const deleteRoom = (name) => {
    API.del('RavenApi', `/v1/rooms/${name}`, {
      headers: {Authorization: apiToken},
    })
      .then(() => setCreatedRooms(createdRooms - 1))
  };

  const roomsList = () => {
    if (hasError) {
      return <div className="error list-placeholder">Unable to load rooms.</div>;
    } else if (isLoading) {
      return <div className="list-placeholder">Loading rooms...</div>;
    } else if (rooms.length === 0) {
      return <div className="list-placeholder">No rooms.</div>;
    } else {
      const roomsList = [];
      rooms.forEach((room, index) => {
        roomsList.push(
          <div key={`room-${index}`} className="list-item list-button">
            <Link className="list-item" to={'/rooms/' + room.name}>{room.name}</Link>
            {(username === room.creator) &&
              // eslint-disable-next-line
              <a className="list-item" onClick={() => deleteRoom(room.name)} href="#">(Delete)</a>}
          </div>
        );
      });
      return roomsList;
    }
  };

  return (
    <div className="fixed-content">
      <div className="list">
        <div className="list-header">
          <span>Chat Rooms</span>
          <span>
          <input onChange={(e) => setNewRoomName(e.target.value)}
                 id="room-name" type="text" placeholder="Group Name"/>
          <button onClick={() => createRoom()}>New Chat Room</button>
        </span>
        </div>
        <div id="list-item-target" className="scroll-container">
          {roomsList()}
        </div>
      </div>
    </div>
  );

}



