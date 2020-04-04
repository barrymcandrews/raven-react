import React from 'react';
import {Link} from "react-router-dom";

export default class Rooms extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      rooms: [],
    }
  }

  async componentDidMount() {
    // let response = await fetch('https://11yv23p3xd.execute-api.us-east-1.amazonaws.com/prod/v1/rooms');
    // let respData = await response.json();
    // console.log(respData);
    // this.setState({rooms: respData});
  }

  render() {
	  return (
      <div className="fixed-content">
        <div className="list">
          <div className="list-header">
            <span>Chat Rooms</span>
            <span>
						<input id="room-name" type="text" placeholder="Group Name"/>
						<button onClick="createRoom()">New Chat Room</button>
					</span>
          </div>
          <div id="list-item-target" className="scroll-container">
            {this.roomsList()}
          </div>
        </div>
      </div>
    );
  }

  roomsList() {
    if (this.state.rooms.length === 0) {
      return <div className="list-placeholder">Loading rooms...</div>;
    } else {
      const roomsList = [];
      this.state.rooms.forEach((room) => {
        roomsList.push(
          <div className="list-item list-button">
            <Link className="list-item" to={'/rooms/' + room.name}>{room.name}</Link>
            {/*<Link className="list-item" onclick="deleteRoom(${room['id']})" href="#">(Delete)</Link>*/}
          </div>
        );
      });
      return roomsList;
    }
  }
}


