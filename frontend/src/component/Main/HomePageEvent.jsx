import React, { useState, useEffect } from "react";
import "./HomePageEvent.css";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom"
import Scrollbars from "react-custom-scrollbars";

const HomePageEvent = (props) => {
  const [event, setEvent] = useState([]);

  const handleEvents = (res) => {
    // res ----> all events coming from props
    let today = new Date();
    let result = [];
    res.map((event) => {
      let eveDate = new Date(event.eventDate + " " + event.eventTime);
      if (today < eveDate) {
        result.push(event)
      }
    })
    result = result.reverse()

    if (props.clgData) {
      if (result.length > 0) {
        if (props.clgData === "All") {
          setEvent(result)
        } else {
          let array = [];
          if (props.eveD) {
            result.map((eve) => {
              if (eve.postedBy.collegeName === props.clgData && eve.eventDate === props.eveD) {
                array.push(eve);
              }
            })
          } else {
            result.map((eve) => {
              if (eve.postedBy.collegeName === props.clgData) {
                array.push(eve);
              }
            })
          }
          if (array.length > 0) {
            setEvent(array);
          } else {
            setEvent([])
          }
        }
      }
    } else if (props.eveD) {
      let array = [];
      result.map((eve) => {
        if (eve.eventDate === props.eveD) {
          array.push(eve);
        }
      })
      if (array.length > 0) {
        setEvent(array);
      } else {
        setEvent([])
      }
    } else {
      setEvent(result)
    }
  }

  useEffect(() => {
    if (props.allEvents) {
      handleEvents(props.allEvents);
    }
  }, [props, props.clgData]);

  return (
    <div className="overall-main-page-event">
      <div className="event-main-div-res">
        {event && event.length > 0 ? event.map((item) => (
          <div className="HomePageEvent" key={item._id}>
            <div className="upcoming_event_title">{item.title}</div>
            <div className="home-page-event-time">
              <img src="Images/clock.svg" alt="" />
              <p className="home-page-event-time-p">
                Event Date : {item.eventDate}
              </p>
            </div>
            <div className="home-page-event-description">{item.desc}</div>
            <div className="home-page-event-button">
              <Link to='/calendar' state={{ eventId: item._id }}>
                <button className="home-page-event-button-knowmore">
                  Know More
                </button>
              </Link>
            </div>
          </div>
        )) :
          <div className="HomePageEvent">
            <div style={{ justifyContent: "center", textAlign: "center" }}>No Upcoming Events !</div>
          </div>
        }
      </div>

      {/* mobile view */}
      <div className="main-event-carousel">

        <Carousel
          autoPlay interval="5000"
          showArrows={true}
          showIndicators={true}
          showThumbs={false}
          infiniteLoop
        >
          {event.map((item, index) => (
            <div className="HomePageEvent">
              <Scrollbars style={{ height: "150px" }}>
                <h2> {item.title} </h2>
                <div className="home-page-event-time">
                  <FontAwesomeIcon icon={faClock} className="fa-xl" />
                  <p className="home-page-event-time-p">{item.eventDate}</p>
                </div>
                <div className="home-page-event-description">
                  {item.desc}
                </div>
                <div className="home-page-event-button pb-3">
                  <Link to='/calendar' state={{ eventId: item._id }}>
                    <button className="home-page-event-button-knowmore">
                      Know More
                    </button></Link>
                  {/* <button className="home-page-event-button-interested">
                  Interested
                </button> */}
                </div>
              </Scrollbars>
            </div>
          ))}
        </Carousel>
      </div>
    </div>
  );
};

export default HomePageEvent;
