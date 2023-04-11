import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import {
  faLocationDot,
  faClock,
  faCirclePlus,
  faCalendarAlt,
  faXmark,
  faPodcast,
  faFlag,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./EditProfile.css";

const EditProfile = ({ Userbio, open, setOpen }) => {
  const role = JSON.parse(localStorage.getItem("user")).role;


  // const [dataChanges, setDataChanges] = useState('nnnnn');
  const [data, setData] = useState('');
  const [show, setShow] = useState(false);
  const [file, setFile] = useState("Images/girl.jpg");
  const [image, setImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imgg, setImgg] = useState();
  const [img, setImg] = useState("");
  const [url, setUrl] = useState("");
  const [email, setEmail] = useState("");

  const [bio, setBio] = useState('');

  
  const handleClose = () => {
    setOpen(false);
    // uploadPic();
    setBio(Userbio);
    console.log(Userbio, bio);
  };
  const handleShow = () => setShow(true);

  function handleChange(e) {
    setFile(URL.createObjectURL(e.target.files[0]));
    setImgg(e.target.files[0]);
    setImage(!image);
  }

  useEffect(() => {
    if (url) {
      update(data);
    }
  }, [url]);

  useEffect(() => {
    getUserDetails();
    // updateDetail(data)
    handleClose();
    getUser();
  }, [data]);

  const update = async (data) => {
    // console.log(data)
    let result = await fetch(`http://localhost:8000/updatePic/${data}`, {
      method: "put",
      body: JSON.stringify({ url }),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    });

    result = await result.json();

    console.log(result)
  };

  const getUserDetails = async () => {
    // console.log(params)
    let result = await fetch(`http://localhost:8000/user/${data}`);
    result = await result.json();
    setEmail(result.email);
  };

  const updateDetail = async (data) => {
    // console.log(data)
    setLoading(true);
    let result = await fetch(`http://localhost:8000/updateDetail/${data}`, {
      method: "put",
      body: JSON.stringify({ bio }),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    });

    result = await result.json();
    // console.log(result)

    setLoading(false);
    setOpen(false);
  // window.location.reload();
    
    // console.log(result)
  };



 


// update(data);
  const uploadPic  = ()=>{
    const data = new FormData();
    data.append("file", imgg);
    data.append("upload_preset", "feedbox-community-web");
    data.append("cloud_name", "feedbox-community-web");
    fetch(
      "https://api.cloudinary.com/v1_1/feedbox-community-web/image/upload",
      {
        method: "post",
        body: data,
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setUrl(data.url);
        console.log(data.url)
        setLoading(false);
        setOpen(false);
        alert("Profile updated successfully!");
        window.location.href="/profile"
       
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // useEffect(() => {
  //   getUser();
  // },[]);
  // const userId = JSON.parse(localStorage.getItem("user")).decodedToken._id;
  // console.log(userId)
  const getUser = async () => {
    // console.log(id)
    let result = await fetch(`http://localhost:8000/user`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    });
    result = await result.json();
    setData(result._id);
    if(bio===''){
      setBio(result.bio)
    }
    // if (result) {
    //   getUser();
    // }
  };

  // console.log(`State bio is : ${Userbio}`);
  // console.log(`bio is : and ${bio}`);

  return (
    <div>
      {open ? (
        <div
          style={{
            zIndex: "99999999",
          }}
        >
          <Modal show={open}>
            <Modal.Header>
              <Modal.Title>Edit Profile</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                {role === 'Super_Admin'? '' :<Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlTextarea1"
                >
                  <Form.Label>About </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    onChange={(e) => setBio(e.target.value)}
                    value={bio}
                  />
                </Form.Group>}

                <Form.Group>
                  <div>
                    <label className="block">Profile Photo</label>
                    <div
                      className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md"
                      style={{
                        maxHeight: "250px",
                        minHeight: "250px",
                        width: "250px",
                        margin: "0 auto",
                      }}
                    >
                      {image ? (
                        <div>
                          <FontAwesomeIcon
                            icon={faXmark}
                            onClick={() => setImage(false)}
                            className="Edit-Profile-cancel"
                          />
                          <img
                            src={file}
                            alt=""
                            style={{
                              maxHeight: "200px",
                              minHeight: "200px",
                              width: "200px",
                              marginTop: "-25px",
                            }}
                            className="object-cover	"
                          />
                        </div>
                      ) : (
                        <div className="space-y-1 text-center">
                          <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 48 48"
                            aria-hidden="True"
                          >
                            <path
                              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
                          <div className="flex text-sm text-gray-600 flex justify-center">
                            <label
                              for="file-upload"
                              className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                            >
                              <span className="flex justify-center">
                                Upload a file
                              </span>
                              <input
                                onChange={handleChange}
                                id="file-upload"
                                name="file-upload"
                                type="file"
                                className="sr-only "
                              />
                            </label>
                          </div>
                          <p className="text-xs text-gray-500">
                            PNG, JPG, GIF up to 10MB
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button variant="primary">
              {loading ? (
                <div
                  className="spinner-border text-white"
                  role="status"
                  style={{ height: "15px", width: "15px" }}
                >
                  <span className="visually-hidden">Loading...</span>
                </div>
              ) : (
                <Button
                  
                  onClick={() => {
                    // handleClose();
                    updateDetail(data);
                    //  update(data)
                    uploadPic();
                  }}
                >
                  Save Changes
                </Button>
              )}
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default EditProfile;