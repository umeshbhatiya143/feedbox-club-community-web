import React, { useEffect, useState } from "react";
import "./CreatePost.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFaceSmile, faImage, faXmark, } from "@fortawesome/free-solid-svg-icons";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import axios from "axios"
import { useStateValue } from "../../StateProvider";

const CreatePost = ({allColleges }) => {
  const [show, setShow] = useState(false);
  const [file, setFile] = useState([]);
  const [textDisplay, setTextDisplay] = useState(false);
  const [image, setImage] = useState([]);
  const [desc, setDesc] = useState("");
  const [scope, setScope] = useState();
  const [loading, setLoading] = useState(false);
  const [zeroImage, setZeroImage] = useState(false);
  const [required, setRequired] = useState(false);

  const [{currentUser}]= useStateValue();
  let user = currentUser;

  let allClgs = allColleges && allColleges

  function handleSelect(e) {
    setScope(e.target.value)
  }

  let count = 0;
  function handleChange(e) {
    console.log(file.length);
    if (file.length >= 0) {
      setZeroImage(true);
    }


    if (file.length == 5) {
      setTextDisplay(true);
      setTimeout(() => {
        setTextDisplay(false);
      }, 5000);
    }

    let limit = file.length + e.target.files.length;
    for (let i = count; i < e.target.files.length && i < 5 && file.length < 5 && limit < 6; i++) {
      setFile((arr) => [...arr, URL.createObjectURL(e.target.files[i])]);
      console.log(e.target.files[i]);
      setImage(arr => [...arr, e.target.files[i]]);
      count++;
    }

    if (e.target.files.length > 5 || limit >= 6) {
      setTextDisplay(true);
      setTimeout(() => {
        setTextDisplay(false);
      }, 3000);
    }
    console.log(`image array :${e.target.files}`);
  }

  function deleteFile(e) {
    console.log(` delte file e : ${e}`);
    const s = file.filter((item, index) => index !== e);
    const s2 = image.filter((item, index) => index !== e);
    console.log(s.length);
    setFile(s);
    setImage(s2);

    if (s.length == 0) {
      setZeroImage(false);
    }
    count--;
  }

  useEffect(() => {
    setLoading(false);
  }, [loading]);

  /// get all cloudinary images
  const postDetails = () => {
    const promises = image.map((file) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "feedbox-community-web");
      return axios.post(
        "https://api.cloudinary.com/v1_1/feedbox-community-web/image/upload",
        formData
      );
    });
    Promise.all(promises)
      .then((responses) => {
        const urls = responses.map(
          (res) => res.data.secure_url
        );
        CreatePost(urls);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  // Create a post
  const CreatePost = (urls) => {
    const data = fetch("http://localhost:8000/create-post", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      },
      body: JSON.stringify({
        desc,
        scope,
        collegeName: user && user.collegeName,
        img: urls,
      })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          console.log("error");
        } else {
          alert("Posted Successfully...")
          setImage([]);
          setLoading(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const handleClose = () => {
    setShow(false)
    setFile([]);
    setImage([]);
    setDesc([]);
  };
  const handleShow = () => setShow(true);

  return (
    <>
      <div className="CreatePost">
        <div className="create-post-profile">
          <img src={user && user.img} alt="" />
        </div>
        <div className="create-post-start" onClick={handleShow}>
          <div className="create-post-start-content">Create a post</div>
          <div className="create-post-start-content-icon">
            <FontAwesomeIcon
              className="fa-xl"
              style={{ margin: "0px 15px" }}
              icon={faImage}
            />
            <FontAwesomeIcon className="fa-xl" icon={faFaceSmile} />
          </div>
        </div>

        <Modal
          show={show}
          onHide={handleClose}
          className="profile-section-overall"
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <div className="create_post_home_page" >
                Create a post
              </div>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="modal-body">
            <form>
              <div className="modal-profile-section">
                <div className="modal-profile-section-image">
                  <img src={user && user.img} alt="" />
                </div>
                <div className="modal-profile-section-content">
                  {/* <h5>{JSON.parse(auth).name}</h5> */}
                  <div>{user && user.name}</div>

                  <select required name="type" onChange={handleSelect}>
                    <option disabled hidden selected value="Select">Select</option>
                    <option value="public">Public</option>
                    {allClgs && allClgs.length > 0 &&
                      allClgs.map((clg) => <option value={clg}>{clg}</option>)}
                  </select>
                  {
                    required ? <div className="error-text-create-post" >
                      **select type of post you want to create.
                    </div> : ''
                  }
                </div>
              </div>
              <textarea
                type="text"
                rows="3"
                className="modal-input"
                placeholder="what do you want to talk about ?"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
              ></textarea>
              <div className="image-chooosen-upload-overall-div">
                {file.map((files, index) => (
                  <div className="image-chooosen-upload-div">
                    <FontAwesomeIcon
                      icon={faXmark}
                      className="fa-xmark-circle-create-post"
                      onClick={() => deleteFile(index)}
                    />
                    {/* <button type="button" className="btn-close"></button> */}
                    <img src={files} className="image-chooosen-upload" />
                  </div>
                ))}
              </div>

              {textDisplay ? (
                <div className="error-text-create-post">
                  **upto 5 images can be uploaded.
                </div>
              ) : (
                <div></div>
              )}
            </form>
          </Modal.Body>
          <Modal.Footer className="modal-footer">
            <div className="modal-footer-upload">
              <label for="files" class="btn">
                <FontAwesomeIcon
                  icon={faImage}
                  className="fa-xl"
                ></FontAwesomeIcon>
              </label>
              <input
                id="files"
                style={{ visibility: "hidden" }}
                type="file"
                onChange={handleChange}
                accept="image/*"
                multiple
              />
            </div>
            <div>
              {
                (zeroImage || desc.length > 0)  && scope ?
                  <Button
                    variant="primary"
                    onClick={function (event) {
                      handleClose();
                      postDetails();
                    }}
                  >
                    Post
                  </Button> :
                  <Button disabled
                    variant="primary"
                    onClick={function (event) {
                      handleClose();
                      postDetails();
                    }}
                  >
                    Post
                  </Button>
              }

            </div>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default CreatePost;
