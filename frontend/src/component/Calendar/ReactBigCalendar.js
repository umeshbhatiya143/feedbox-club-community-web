import React, { useState } from "react";
import { Calendar, momentLocalizer} from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { faLocationDot, faClock, faCirclePlus, faCalendarAlt, faXmark, faPodcast, faFlag, faUniversity, } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLocation } from "react-router-dom";
import "./ReactBigCalendar.css";
import BigCalendar from "react-big-calendar";


moment.locale("en-GB");
const localizer = momentLocalizer(moment);

export default function ReactBigCalendar() {
  const location = useLocation();
  const eveId = location.state && location.state.eventId;
  
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  const [event, setEvent] = useState([]);
  const [title, setTitle] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [venue, setVenue] = useState("");
  const [desc, setDesc] = useState("");
  const [scope, setScope] = useState();
  const [speaker, setSpeaker] = useState("");
  const [myEvent, setMyEvent] = useState();
  const [loading, setLoading] = useState(false);
  const [deletebtn, setDeleteBtn] = useState(false);
  const [clgSelected, setClgSelected] = useState();
  const [allClgs, setAllClgs] = useState([]);
  const [eventPre, setEventPre] = useState("Calendar-view-events-hide");
  const [user, setUser] = useState();
  const [eventClicked, setEventClicked] = useState(false);
  // state for Add Event pop up
  const [addEventModel, setAddEventModel] = useState(false);
  // State for preview Event
  const [preEventModel, setPreEventModel] = useState(false);
  // Show and hide interested button
  const [interestedBtn, setInterestedBtn] = useState(true);
  const [role, setRole] = useState("");
  const [selectedEvent, setSelectedEvent] = useState();
  const [id, setId] = useState();
  const [eventData, setEventData] = useState([]);
  const [dupliEvents, setDupliEvents] = useState([]);
  const [handleClgSel, setHandleClgSel] = useState(false);
  const [infinite, setInfinite] = useState(true);
  const [MAVisibility, setMAVisibility] = useState(false);

  // Mindate for diasble previous dates in calender
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1;
  var yyyy = today.getFullYear();
  if (dd < 10) {
    dd = "0" + dd;
  }
  if (mm < 10) {
    mm = "0" + mm;
  }
  const mindate = [yyyy, mm, dd].join("-");

  const handleDeleteShow =()=>{
    setDeleteBtn(true);
    setPreEventModel(false)
  }

  // get user
  const getUser = async () => {
    let result = await fetch(`http://localhost:8000/user`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    });
    result = await result.json();
    // id = result._id;
    setId(result._id);
    setUser(result);
    setRole(result.role);
  };

  const compareDate = (date, time) => {
    let today = new Date();
    let eveDate = new Date(date + " " + time);
    console.log(today > eveDate);
    setMAVisibility(today > eveDate);
  }

  // show particular event
  const setCalenderEvent = (value) => {
    setInterestedBtn(true);
    let myEvent;
    event.map(function (val, index) {
      if (val._id === value) {
        setMyEvent(val);
        compareDate(val.eventDate, val.eventTime)
        setEventPre("Calendar-view-events");
        setPreEventModel(true);
        myEvent = val;
      }
    });
    myEvent && myEvent.attendance.map((data) => {
      if (data._id === id) {
        setInterestedBtn(false);
      }
    });
  }

  // Get all Colleges
  const getColleges = async () => {
    const data = await fetch(`http://localhost:8000/colleges/get`);
    const res = await data.json();
    let val = [];
    res.map((data) => {
      val.push(data.name);
    });
    setAllClgs(val);
  };

  // Get All Events
  const showEvent = async () => {
    setInfinite(false)
    console.log("kjtnru");
    let result = await fetch("http://localhost:8000/getAllEvent");
    result = await result.json();
    setEvent(result);
    console.log(result, "o");
    result.map((data, i) => {
      data.start = new Date(data.eventDate);
      data.end = new Date(data.eventDate);
      data.id = i;
    });
    setEventData(result);
    setDupliEvents(result);
  };

  useEffect(() => {
    if (eventClicked && selectedEvent) {
      setEventClicked(false)
      setMAVisibility(false)
      setCalenderEvent(selectedEvent._id);
    } else {
      if (eveId) {
        setCalenderEvent(eveId);
      }
    }
    if (clgSelected) {
      if (clgSelected === "All") {
        setEventData(dupliEvents);
      } else {
        let array = [];
        dupliEvents.length > 0 &&
          dupliEvents.map((eve, i) => {
            if (eve.postedBy.collegeName === clgSelected) {
              array.push(eve);
            }
          });
        setEventData(array);
      }
    } else {
      if (infinite) {
        showEvent();
      }
    }
    getUser();
    getColleges();
    setLoading(false);
  }, [loading, event, eventClicked, selectedEvent, clgSelected]);

  // Mark Interested 
  const attendanceUpdate = async (eveid) => {
    console.log(eveid);
    let result = await fetch(`http://localhost:8000/updateEvent/${eveid}`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    });
    result = await result.json();
    console.log(result);

    // console.log(myEvent,id);
    let data = await fetch(`http://localhost:8000/update/interested/events/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({ event: myEvent })
    });
    const res = await data.json();
    console.log(res);
  };

  // create event
  const addEvent = async (e) => {
    e.preventDefault();
    let result = await fetch("http://localhost:8000/createEvent", {
      method: "post",
      body: JSON.stringify({
        title,
        eventDate,
        eventTime,
        venue,
        desc,
        speaker,
        scope,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    });
    // result = await result.json();
    // console.log(result);
    setTitle("");
    setScope("");
    setEventDate("");
    setEventTime("");
    setVenue("");
    setDesc("");
    setSpeaker("");
    setClgSelected();
    setAddEventModel(false);
    setLoading(true);

    //  notification
    await fetch("http://localhost:8000/addNotifications", {
      method: "post",
      body: JSON.stringify({
        message: title,
        messageScope: scope,
        date: eventDate,
        userId:id,
        venue:venue,
        time:eventTime,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    }).then((res) => {
      // alert(res.json)
    });

    // notification = await notification.json();
    // console.log(notification)
  };

  // handle event on select from react big calender
  const handleEvent = (val) => {
    setEventClicked(true);
    setSelectedEvent(val);
  };
  const handleSelect=()=>{

  }

  // Delete Event
  const cancelEvent = async (id) => {
    let result = await fetch(`http://localhost:8000/deleteEvent/${id}`, {
      method: "delete",
    });
    result = await result.json();
    console.log(result);
    setDeleteBtn(false);
    setPreEventModel(false);
    setLoading(true);
  };

  // Handle selection of clg
  const handleCollege = (e) => {
    setPreEventModel(false);
    setSelectedEvent("");
    setClgSelected(e.target.value);
  };
  const eventPropGetter = (event, start, end, isSelected) => {
    let style = {};
  
    // Check if the event is an all-day event
    if (event.allDay) {
      style.backgroundColor = "#e6e6e6";
      style.border = "none";
    }
  
    return {
      style: style
    };
  };


  

  return (
    <>
      <div className="Calendar-container">
        <div className="Calendar-left">
          {/* ----------------college dropdown for super admin--------------- */}
          {role && role == 'Super_Admin' ?
            <div className=" my-4 mx-1 ">
              <select className="p-2 border-2 font-semibold text-[#3174AD] border-[#3174AD] rounded-3xl sm:w-[40%] lg:w-[100%]" value={clgSelected} onChange={(e) => { handleCollege(e); setHandleClgSel(true); }}>
                <option className=" " value="College" hidden selected disabled>College</option>
                <option value="All">All</option>
                {
                  allClgs.length > 0 &&
                  allClgs.map((clg, i) => (
                    <option key={i} value={clg}>{clg}</option>
                  ))
                }
              </select>
            </div> : ''}

          {/* -----------Button to add event in calendar------------------*/}
          { role && role !== 'Club_Member' ?
            <div
            className="Calendar-add"
            onClick={() => {
              setAddEventModel(true); setPreEventModel(false)
            }}
          >
            <div>
              Create Event
              <FontAwesomeIcon
                style={{ margin: "0px 0px 0px 10px" }}
                icon={faCirclePlus}
              />
            </div>
          </div>: ''}

          {/* ------------Already created------------------------*/}
          <div className="Calendar-view">
            {preEventModel ? (
              <div
                className="Calendar-view-title"
                style={{ borderRadius: "20px 20px 0px 0px" }}
              >
                Events Preview
              </div>
            ) : (
              <div
                className="Calendar-view-title"
                style={{ borderRadius: "20px" }}
              >
                Events Preview
              </div>
            )}
          </div>

          {/* ------------Model to show already created event-------------------- */}
          {preEventModel ? (
            <div className="Calendar-view-events-container">
              <div className={eventPre}>
                <div className="event-pre-handle">
                  <div className="event-title">{myEvent && myEvent.title}</div>
                  <div
                    className="cancel-view-event"
                    onClick={() => {
                      setPreEventModel(false);
                    }}
                  >
                    <FontAwesomeIcon icon={faXmark} />
                  </div>
                </div>
                <div className="event-profile">
                  <FontAwesomeIcon
                    style={{ margin: "0 10px 0 0" }}
                    icon={faPodcast}
                  />
                  {myEvent && myEvent.speaker}
                </div>
                <div className="event-profile">
                  <FontAwesomeIcon
                    style={{ margin: "0 10px 0 0" }}
                    icon={faUniversity}
                  />
                  Shri Vaishanav Vidyapeeth Vishwavidyalaya
                  {/* {myEvent && myEvent.speaker} */}
                </div>
                <div className="event-minor">
                  <div>
                    <FontAwesomeIcon
                      style={{ margin: "0 10px 0 0" }}
                      icon={faLocationDot}
                    />
                    {myEvent && myEvent.venue}
                  </div>
                  <div>
                    <FontAwesomeIcon
                      style={{ margin: "0 10px 0 0" }}
                      icon={faCalendarAlt}
                    />
                    {myEvent && myEvent.eventDate}
                  </div>

                  <div>
                    <FontAwesomeIcon
                      style={{ margin: "0 10px 0 0" }}
                      icon={faClock}
                    />
                    {myEvent && myEvent.eventTime}
                  </div>
                </div>
                <div className="Pre-Event-desc">
                  <b>Descrpition</b>
                  <br />
                  {myEvent && myEvent.desc}
                </div>
                <div className="preview-button">
                  {role && role !== "Super_Admin" ? (
                    id && myEvent && id !== myEvent.postedBy._id ? (
                      new Date(myEvent && myEvent.eventDate).getTime() >
                        new Date(mindate).getTime() ? (
                        interestedBtn ? (
                          <button
                            type="button"
                            onClick={() => {
                              attendanceUpdate(myEvent && myEvent._id);
                              setInterestedBtn(false);
                            }}
                          >
                            Interested
                          </button>
                        ) : (
                          <button
                            type="button"
                            style={{
                              pointerEvents: "none",
                              backgroundColor: "gray",
                            }}
                          >
                            Interested
                          </button>
                        )
                      ) : (
                        ""
                      )
                    ) : (
                      ""
                    )
                  ) : (
                    ""
                  )}

                  {(role === "Admin" ||
                    role === "Super_Admin" ||
                    (id && myEvent && id == myEvent.postedBy._id)) && (
                      <button
                        onClick={() => {
                          handleDeleteShow()
                        }}
                      >
                        Delete Event
                      </button>
                    )}

                  {deletebtn && (
                    <Modal
                      show={deletebtn}
                      onHide={() => setDeleteBtn(false)}
                    >
                      <Modal.Header closeButton>
                        <Modal.Title>Are you sure ?</Modal.Title>
                      </Modal.Header>
                      <Modal.Body style={{ color: "black", display: "flex" }}>
                        Do you really want to delete this Event ? This process
                        cannot be undone.
                      </Modal.Body>
                      <Modal.Footer style={{ justifyContent: "right" }}>
                        {loading ? (
                          <div
                            class="spinner-border text-danger"
                            role="status"
                            style={{ height: "15px", width: "15px" }}
                          >
                            <span class="visually-hidden">Loading...</span>
                          </div>
                        ) : (
                          <Button
                            variant="danger"
                            onClick={() => cancelEvent(myEvent._id)}
                          >
                            Delete
                          </Button>
                        )}

                        <Button
                          variant="light"
                          onClick={() => setDeleteBtn(false)}
                        >
                          Cancel
                        </Button>
                      </Modal.Footer>
                    </Modal>
                  )}
                </div>
                {MAVisibility && <div style={{ textAlign: "center" }}>
                  {role === "Admin" ||
                    role === "Super_Admin" ||
                    (id && myEvent && id == myEvent.postedBy._id) ? (
                    <button className="Mark-Attendence-btn">
                      <Link
                        to={"/attendance/" + (myEvent && myEvent.title)}
                        state={{ eventId: myEvent && myEvent._id }}
                        onClick={() => {
                          setEventPre("Calendar-view-events-hide");
                        }}
                      >
                        {
                          myEvent && myEvent.attendanceSubmitted
                            ? "View Attendance"
                            : "Mark Attendance"
                        }
                      </Link>
                    </button>
                  ) : (
                    ""
                  )}
                </div>}
              </div>
            </div>
          ) : (
            ""
          )}
        </div>

        {/* -----------------Large right side Calendar------------------- */}
        <div className="React-Big-Calendar-Original">
          <Calendar
            views={["month","agenda", "day"]}
            selectable
            localizer={localizer}
            defaultDate={new Date()}
            defaultView="month"
            events={eventData}
            onSelectEvent={handleEvent}
            // showMultiDayTimes
            // eventPropGetter={eventPropGetter}
            onSelectSlot={handleSelect}
          />
        </div>

        {/* to show popup to add event (Add Event) */}
        {addEventModel ? (
          <div className="Calendar-add-drop-container">
            <div className="Calendar-add-drop">
              <form onSubmit={addEvent}>
                <div className="calender-add-title">
                  <span>Create an Event</span>
                  <div
                    className="cancel-button"
                    onClick={() => {
                      setAddEventModel(false);
                    }}
                  >
                    <FontAwesomeIcon icon={faXmark} />
                  </div>
                </div>
                <div className="Calendar-title">
                  <span>Title</span>
                  <input
                    type="text"
                    required
                    placeholder="Add Event Title"
                    value={title}
                    maxlength="50"
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div
                  style={{
                    border: "1.5px solid black",
                    padding: "10px 10px 15px 10px",
                    borderRadius: "10px",
                  }}
                >
                  <span style={{ fontWeight: "600" }}>General</span>
                  <div className="input-container">
                    <FontAwesomeIcon
                      style={{ margin: "7px 10px 0 0" }}
                      icon={faFlag}
                    />
                    <select
                      required
                      value={scope}
                      onChange={(e) => setScope(e.target.value)}
                    >
                      <option
                      value=""
                       selected
                       disabled 
                      >
                        Select Community
                      </option>
                      <option value="public">Public</option>
                      <option value="community">Community</option>
                    </select>
                  </div>
                  <div className="input-container">
                    <FontAwesomeIcon
                      style={{ margin: "7px 10px 0 0" }}
                      icon={faPodcast}
                    />
                    <input
                      type="Speaker Name"
                      placeholder="Add Speaker Name"
                      value={speaker}
                      required
                      onChange={(e) => setSpeaker(e.target.value)}
                    ></input>
                  </div>
                  <div className="input-container">
                    <FontAwesomeIcon
                      style={{ margin: "7px 10px 0 0" }}
                      icon={faCalendarAlt}
                    />
                    <input
                      type="date"
                      required
                      value={eventDate}
                      min={mindate}
                      onChange={(e) => setEventDate(e.target.value)}
                    ></input>
                  </div>
                  <div className="input-container">
                    <FontAwesomeIcon
                      style={{ margin: "7px 10px 0 0" }}
                      icon={faClock}
                    />
                    <input
                      type="time"
                      required
                      value={eventTime}
                      onChange={(e) => setEventTime(e.target.value)}
                    ></input>
                  </div>
                  <div className="input-container">
                    <FontAwesomeIcon
                      style={{ margin: "7px 15px 0 0" }}
                      icon={faLocationDot}
                    />
                    <input
                      type="text"
                      placeholder="Add Venue...."
                      value={venue}
                      required
                      onChange={(e) => setVenue(e.target.value)}
                    />
                  </div>
                </div>

                <div
                  className="input-container input-container1"
                  style={{
                    margin: "25px 0 25px 0",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div className="description">Descrpition</div>
                  <textarea
                    name="message"
                    rows="3"
                    cols="30"
                    placeholder="About . . ."
                    value={desc}
                    required
                    onChange={(e) => setDesc(e.target.value)}
                  ></textarea>
                </div>
                <div className="submit-button">
                  <button className="Calendar-submit" type="submit">
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  );
}