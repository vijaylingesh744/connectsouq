import React, { useState, useEffect } from "react";
import FetchData from "../../../fetch-api/Apifetch";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ref, push, get, onValue, off } from "firebase/database";
import { db } from "../../../../firebase.js";
import Modal from "react-bootstrap/Modal";
import { handleImageError, Imagesource, validateForm } from "../../../utils/Function.js";
import { BASE_URL } from "../../../utils/ApiRoute";
import BuinessParner from "./Split/BuinessParner.js";
import { toast } from "react-toastify";
import "./chartscreen.css"
import LeftSide from "../../../screens/FeedPage/PostData/LeftSide"

const Chats = () => {
  const { id } = useParams();
  const location = useLocation();
  const { state } = location;
  const [ProjectList, setProjectList] = useState([]);
  const [ProjectList1, setProjectList1] = useState([]);
  const [CurrentProject, setCurrentProject] = useState({});
  const [viewproject, setviewProject] = useState();
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("LOGINDATA")).user
  );
  const navigate = useNavigate();
  useEffect(() => {
    // listProjects(id);
    console.log(state);
  }, []);
  const [formData, setFormData] = useState({
    projectId: "",
    bpId: user._id,
    senderId: user._id,
    receiverId: "",
    bpCharges: "",
    email: "",
    mop: "",
    // pInitiation: "",
    transactionNo: "692e2Dce12392817w",
    // dateTime: "",
    remark: "",
    // csFee: "",
    dueDate: "",
    amount: "",
    currency: "",
    invoiceNo: "XBGHJSD",
  });


  const listProjects = async (ids) => {
    try {
      const res = await FetchData(
        `list/project/${ids}`,
        "GET",
        null,
        true,
        false
      );
      if (res.status) {
        setProjectList(res.data);
        setviewProject(ids);
        console.log(res.data);
        setSelectedItem(res.data[0]);
        setSelectedChat({
          project_id: res.data[0]?.project_id,
          user_id: res.data[0]?.userdata._id,
          email: res.data[0]?.userdata?.gmail,
        });
        setFormData((prevFormData) => ({
          ...prevFormData,
          receiverId: res.data[0]?.userdata?._id
        }));
      }
    } catch (error) {
      console.error("Error fetching user list:", error.message);
    }
  };

  const [node, setNode] = useState("");
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [selectedItem, setSelectedItem] = useState({});
  const [selectedChat, setSelectedChat] = useState({});

  useEffect(() => {
    listProject()
    fetch();
  }, []);

  const fetch = async (id = node) => {
    const data = await getAllMessages(id);
    setMessages(data);
  };
  const chatData = async (id = selectedItem?.nodeId) => {
    setNode(id);
    fetch(id);
  };

  const getAllMessages = async (nodeId = node) => {
    console.log("nodeID,", nodeId);
    const dbName = `chats/${nodeId}`;
    const messagesRef = ref(db, dbName);
    const snapshot = await get(messagesRef);
    const messagesWithIds = [];
    snapshot.forEach((childSnapshot) => {
      const messageId = childSnapshot.key;
      const messageData = childSnapshot.val();
      messagesWithIds.push({ id: messageId, ...messageData });
    });
    return messagesWithIds;
  };

  const listenForNewMessages = (nodeId = node, callback) => {
    const dbName = `chats/${nodeId}`;
    const messagesRef = ref(db, dbName);

    // Set up a listener to receive real-time updates
    const listenerCallback = (snapshot) => {
      const messagesWithIds = [];
      snapshot.forEach((childSnapshot) => {
        const messageId = childSnapshot.key;
        const messageData = childSnapshot.val();
        messagesWithIds.push({ id: messageId, ...messageData });
      });
      callback(messagesWithIds);
    };

    // Add the listener
    onValue(messagesRef, listenerCallback);

    // Return the function to remove the listener
    return () => {
      off(messagesRef, listenerCallback);
    };
  };

  useEffect(() => {
    const unsubscribe = listenForNewMessages(node, (messages) => {
      chatData();
    });
    setFormData((prevFormData) => ({
      ...prevFormData,
      invoiceNo: "INV-" + generateInvoiceNumber(7),
      transactionNo: "CONSQ-" + generateInvoiceNumber(12),
      projectId: selectedChat?.project_id, // Replace with actual project ID
      email: selectedChat?.email,
      client_id: selectedChat?.user_id,
    }));
    return () => {
      unsubscribe();
    };
  }, [node]);

  const sendMessage = async () => {
    if (messageText.trim() !== "") {
      const messagesRef = ref(db, `chats/${node}`);
      push(messagesRef, {
        _id: Date.parse(new Date()),
        chatID: user._id + selectedItem?.userdata?._id, //user id+ business user id
        text: messageText,
        image: "",
        video: "",
        audio: "",
        type: 0,
        createdAt: new Date().toString(),
        date: new Date().toLocaleString().split(",")[0],
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        user: {
          _id: user._id,
          name: user.first_name,
          profile: user?.randomprofile,
        },
        senderId: user._id,
        receiverId: selectedItem?.userdata?._id,
      });
      fetch(node);
      setMessageText("");
    }
  };

  const listProject = async () => {
    try {
      const res = await FetchData(
        `notify_list/${user?._id}`,
        "GET",
        null,
        true,
        false
      );
      if (res.success) {
        setProjectList1(res.data);
        if (res.data[0]) {
          var item = res.data[0]
          listProjects(item.project_id)
          ChangeSize("project", 5)
          ChangeSize("user", 6)
          ChangeSize("chat", 0)
          ChangeSize("profile", 3)
          ChangeSize("project_item", item.project);
          ChangeSize("project_profile", item?.user?.profile);
          ChangeSize("projectId", 0)
        }
      }
    } catch (error) {
      console.error("Error fetching user list:", error.message);
    }
  };

  function generateInvoiceNumber(length) {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let result = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }
    return result;
  }

  const setInvoiceData = async () => {
    try {
      const res = await FetchData(
        `transaction/add`,
        "POST",
        JSON.stringify(formData),
        true,
        false
      );
      if (res.status) {
        toast.success("Invoice added successfully");

        setFormData({
          projectId: "",
          bpId: user._id,
          senderId: user._id,
          receiverId: selectedItem?.userdata?._id,
          bpCharges: "",
          email: "",
          mop: "",
          // pInitiation: "",
          transactionNo: "692e2Dce12392817w",
          // dateTime: "",
          remark: "",
          // csFee: "",
          dueDate: "",
          amount: "",
          currency: "",
          invoiceNo: "XBGHJSD",
        });

        // if (state) {
        //     // navigate(`/bp/project-connection/${state?.project_id}`)
        // } else {

        //     setProject(true);
        //     setInvoice(false);
        // }
      }
      //   if (res.success) {
      //     fetchNotifyList()
      //   }
      //   Swal.fire({
      //     title: 'Success!',
      //     text: 'Notification Sent To Customer.',
      //     icon: 'success'
      //   });
    } catch (error) {
      console.error("Error fetching user list:", error.message);
      // setInvoiceButton(false)
      setFormData({
        projectId: "",
        bpId: user._id,
        senderId: user._id,
        receiverId: selectedItem?.userdata?._id,
        bpCharges: "",
        email: "",
        mop: "",
        // pInitiation: "",
        transactionNo: "692e2Dce12392817w",
        // dateTime: "",
        remark: "",
        // csFee: "",
        dueDate: "",
        amount: "",
        currency: "",
        invoiceNo: "XBGHJSD",
      });
    }
  };

  const [changesize, setChangeSize] = useState({
    project: "7",
    user: "0",
    chat: "0",
    profile: "3",
  })

  const ChangeSize = (name, id) => {
    setChangeSize(prevChangesize => ({
      ...prevChangesize,
      [name]: id
    }));
  };

  return (
    <>
      <div className="container-fluid" style={{ paddingTop: "75px" }}>
        {/* className="body-wrapper" */}
        <div className="container-fluid">
          <div className="row mt-0 mx-0">
            <div className="col-lg-12 d-flex align-items-strech">
              <div className="card w-100">
                <div className="card-body p-3">
                  <div className="d-sm-flex d-block align-items-center justify-content-between">
                    <p className="text-title m-0">Project List</p>
                    <button
                      className="btn btn-outline-success py-1"
                      onClick={() => navigate(`/bp/cs-vault`, { state: viewproject })}
                    >+ Add</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-2 px-2">
            <div className="row" style={{ flexWrap: "nowrap", overflow: "hidden", overflowX: "scroll", height: "75vh" }}>
              <div className={`${changesize.chat == 0 ? "col-lg-7" : "d-none"} d-flex align-items-strech`}>
                <div className="card w-100">
                  <div className="card-body p-3 overflow-y-scroll hidden-scrollbar">
                    <div className="d-sm-flex d-block align-items-center justify-content-between mb-0">
                      <div className="mb-3 mb-sm-0">
                        <h5 className="text-title">My Projects</h5>
                        <p className="card-subtitle mb-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas elit arcu,
                          ut leo in, sagittis. Suspendisse bibendum felis ut aliquet.</p>
                        <form className="position-relative w-100 py-2">
                          <input
                            type="text"
                            className="form-control search-chat py-2 ps-5"
                            id="text-srh"
                            placeholder="Search Project"
                          />
                          <i className="ti ti-search position-absolute top-50 start-0 translate-middle-y fs-6 text-dark ms-3" />
                        </form>
                      </div>
                    </div>

                    <div className="container-fluid px-0 py-2 hidden-scrollbar" >
                      {ProjectList1 && ProjectList1.map((item, index) => (
                        <div className="card pro-card-shadow px-2 py-2 mb-1"
                          style={{
                            cursor: "pointer",
                            background: changesize?.projectId == index ? "#4535C1" : "#FFFFFF",
                          }}
                          onClick={() => {
                            listProjects(item.project_id)
                            ChangeSize("project", 5)
                            ChangeSize("user", 6)
                            ChangeSize("chat", 0)
                            ChangeSize("profile", 3)
                            ChangeSize("project_item", item.project);
                            ChangeSize("project_profile", item?.user?.profile);
                            ChangeSize("projectId", index)
                          }}>
                          <div className="card-content">
                            <img
                              src={Imagesource(item?.user?.profile)}
                              onError={handleImageError}
                              width={35}
                              height={35}
                              className={`${changesize?.projectId == index ? "rounded-white" : "rounded-primary"}`} />
                            <div className="d-flex flex-column">
                              <span
                                className={`text-title text-capitalize mt-1 text-12 ${changesize?.projectId == index ? "text-white" : "text-black"}`}>
                                {item.project.title}
                              </span>
                              <span
                                className={`text-secondary mt-1 text-12 ${changesize?.projectId == index ? "text-white" : "text-body-secondary"}`}>
                                {item.project.desc}
                              </span>
                              <div className="d-flex mt-1 align-items-center ">
                                {item?.connect_project.length > 0 && <div className="d-flex align-items-center mr-2">
                                  {item?.connect_project.slice(0, 5).map(() => (
                                    <img
                                      key={index}
                                      src="/images/profile/img00.png"
                                      onError={handleImageError}
                                      width={12}
                                      height={12}
                                      className="rounded-circle shadow"
                                      style={{ left: index * 7 }}
                                    />
                                  ))}
                                </div>}
                                <span
                                  className={`text-secondary text-10 ${changesize?.projectId == index ? "text-white" : "text-body-secondary"}`}>
                                  &nbsp;{item?.connect_project.length} Clients
                                </span>
                              </div>
                            </div>
                            <div>
                              <button className="btn btn-outline-connect text-connect py-1">View</button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-5 d-flex align-items-strech">
                <div className="card w-100">
                  <div className="card-body p-3 overflow-y-scroll hidden-scrollbar">
                    <div className="card pro-card-shadow px-2 py-2 mb-1"
                      style={{ cursor: "pointer", background: "#4535C1" }}>
                      <div className="card-content">
                        <div className="d-flex align-items-center">
                          <a className="text-title text-white mr-2" onClick={() => { ChangeSize("chat", 0) }}>
                            <i className="fa fa fa-arrow-left text-white" />
                          </a>
                          <img
                            src={Imagesource(changesize?.project_profile)}
                            onError={handleImageError}
                            width={35}
                            height={35}
                            className={`rounded-white`} />
                        </div>
                        <div className="d-flex flex-column">
                          <span
                            className={`text-title text-capitalize mt-1 text-12 text-white`}>
                            {changesize?.project_item?.title}
                          </span>
                          <span
                            className={`text-secondary mt-1 text-12 text-white`}>
                            {changesize?.project_item?.desc}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <form className="position-relative w-100 py-2">
                        <input
                          type="text"
                          className="form-control search-chat py-2 ps-5"
                          id="text-srh"
                          placeholder="Search Project"
                        />
                        <i className="ti ti-search position-absolute top-50 start-0 translate-middle-y fs-6 text-dark ms-3" />
                      </form>
                    </div>
                    <div className="container-fluid px-0 py-3 hidden-scrollbar" >
                      {ProjectList && ProjectList.map((item, index) => (
                        <div className="card shadow-none mb-1 p-2"
                          style={{
                            border: changesize?.chatId == index ? "0.8px solid #4535C1" : "0.8px solid lightgray",
                          }}
                          onClick={() => {
                            ChangeSize("project", 3)
                            if (item.status == 0) {
                              console.log(selectedChat);
                              return;
                            }
                            ChangeSize("chatId", index)
                            ChangeSize("user", 3)
                            ChangeSize("profile", 0)
                            ChangeSize("chat", 6)
                            setSelectedChat({
                              project_id: item?.project_id,
                              user_id: item?.userdata?._id,
                              email: item?.userdata?.gmail,
                            });
                            setCurrentProject(item);
                            setSelectedItem(item);
                            chatData(item?.userdata._id);
                          }}
                        >
                          <div className="card-content">
                            <img src={Imagesource(item?.userdata?.profile)} onError={handleImageError} width={35} height={35} className='rounded-circle ' />
                            <div className="card shadow-none border-0 mb-0">
                              <span className="fontcontent1 font-weight-bold text-dark1">{item.userdata?.first_name}&nbsp;{item.userdata?.last_name}</span>
                              {item.status !== 0 ? (
                                <span className="fontcontent2 font-weight-normal ">
                                  {item?.userdata.user_type == "0"
                                    ? "Buyer"
                                    : "Seller"}
                                </span>
                              ) : (
                                <span className="fs-3 text-truncate text-danger text-body-color d-block">
                                  Waiting for Approval
                                </span>
                              )}
                            </div>
                            <div></div>
                          </div>

                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className={`${changesize.chat == 0 ? "d-none" : "col-lg-7"} d-flex align-items-strech`}>
                <div className="card w-100">
                  <div className="card-body p-3 overflow-y-scroll hidden-scrollbar">
                    <div className="">
                      <div id="main-wrapper background4" className=" d-block">
                        <div
                          className="container-fluid rounded-2 d-flex justify-content-between py-2 pl-4 background shadow-sm"
                          style={{ position: "sticky", top: "0%" }}
                        >
                          <div className="d-flex column-gap-2 align-items-center">
                            <img
                              src={`${selectedItem?.userdata?.profile ? `${BASE_URL + selectedItem?.userdata?.profile}` : `/images/profile/img0${selectedItem?.userdata?.randomprofile}.png`}`}
                              style={{ width: 33, height: 33, borderRadius: "50%" }}
                            />
                            <div className="d-flex flex-column">
                              <span className="chatname">
                                {selectedItem?.userdata?.first_name}
                                {" "}
                                {selectedItem?.userdata?.last_name}</span>
                              <span className="chatactive">last seen 3 hours ago</span>
                            </div>
                          </div>
                          <div className="d-flex justify-content-between align-items-center column-gap-3">
                            <span style={{ cursor: "pointer" }} onClick={() => { setInvoiceData() }}>
                              <i className="fa fa-archive" aria-hidden="true" />
                            </span>
                          </div>
                        </div>
                        <div className="chat-container hidden-scrollbar  container-fluid background1 mt-1 py-3">
                          <div className="chat-messages">
                            <p className="chattime text-center">Today 12:27 PM</p>
                            {Array.isArray(messages) && messages.map(message => (
                              <span className={'px-3 pt-2 my-2 pb-1 ' + (message.senderId === user._id ? 'user-message' : 'bot-message')}>
                                {message.text}
                                <p className={'mb-0 mx-25 pt-2 pb-1 ' + (message.senderId === user._id ? 'usermessagetime' : 'botmessagetime')}>{message.time}</p>
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="container-fluid background mt-1 position-fix">
                          <div className="d-flex inputback align-items-center justify-content-around px-2 bg-white column-gap-3">
                            <img src="/images/icons/attach.png" style={{ width: 20, height: 20 }} />
                            <input
                              type="text"
                              className="bg-white"
                              placeholder="Type a message..."
                              defaultValue=""
                              style={{ border: "none" }}
                              value={messageText} onChange={e => setMessageText(e.target.value)}
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  sendMessage();
                                }
                              }}
                            />
                            <button className="sendbutton d-flex align-items-center justify-content-center"
                              onClick={() => {
                                sendMessage();
                              }} >
                              <img
                                src="/images/icons/paper-plane 1.png"
                                style={{ width: 16, height: 16 }}
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div id="main-wrapper" className="mt-5 mt-lg-0 d-none">
            <main id="main-section" className="mt-2 mt-lg-0 row">
              <div className={`bg-white col-${changesize.project} ${changesize.project == 6 ? "offset-3" : "offset-0"} p-1 transition-offset transition-width ${changesize.project == 0 ? "d-none" : "block"}`}>
                <div className="p-2">
                  <span className="fontsubtitle font-weight-bold text-dark1 py-2 pl-2">My Projects</span>
                  <form className="position-relative w-100 py-2">
                    <input
                      type="text"
                      className="form-control search-chat py-2 ps-5"
                      id="text-srh"
                      placeholder="Search Project"
                    />
                    <i className="ti ti-search position-absolute top-50 start-0 translate-middle-y fs-6 text-dark ms-3" />
                  </form>
                  <div className="container-fluid px-0 py-3 hidden-scrollbar" >
                    {ProjectList1 && ProjectList1.map((item, index) => (
                      <div className="card shadow-sm px-2 py-3 mb-1"
                        style={{
                          cursor: "pointer",
                          border: changesize?.projectId == index ? "2px solid green" : "none",
                        }}
                        onClick={() => {
                          listProjects(item.project_id)
                          ChangeSize("project", 5)
                          ChangeSize("user", 6)
                          ChangeSize("chat", 0)
                          ChangeSize("profile", 3)
                          ChangeSize("projectId", index)
                        }}>
                        <div className="card-content">
                          <img src={Imagesource(item?.user?.profile)} onError={handleImageError} width={35} height={35} className='rounded-circle ' />
                          <div className="card shadow-none border-0 mb-0">
                            <span className="fontcontent1 font-weight-bold text-dark1">{item.project.title}</span>
                            <div className="d-flex align-items-center ">
                              <div className="d-flex align-items-center">
                                {Array.from({ length: 4 }, (_, index) => (
                                  <img
                                    key={index}
                                    src="/images/profile/img00.png"
                                    onError={handleImageError}
                                    width={12}
                                    height={12} // Adjust height as needed
                                    className="rounded-circle shadow"
                                    style={{ position: 'absolute', left: index * 7 }}
                                  />
                                ))}
                              </div>
                              <small style={{ marginLeft: "40px" }} className="fontsmall font-weight-normal">&nbsp;{item?.connect_project.length} Clients</small>
                            </div>
                          </div>
                          <div>
                            <button className="btn btn-outline-connect text-connect">View</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className={`bg-white col-${changesize.user} p-1 transition-width ${changesize.user == 0 ? "d-none" : "block"}`}>
                <div className="p-2">
                  <div className="d-flex justify-content-between align-items-center"><span className="fontsubtitle font-weight-bold text-dark1 py-2 pl-2">Projects Chatlist</span>
                    <i class="fa fa-plus pr-2 fontsubtitle text-dark1" aria-hidden="true"
                      onClick={() => navigate(`/bp/cs-vault`, { state: viewproject })}
                    ></i>
                  </div>
                  <form className="position-relative w-100 py-2">
                    <input
                      type="text"
                      className="form-control search-chat py-2 ps-5"
                      id="text-srh"
                      placeholder="Search Project"
                    />
                    <i className="ti ti-search position-absolute top-50 start-0 translate-middle-y fs-6 text-dark ms-3" />
                  </form>
                  <div className="container-fluid px-0 py-3 hidden-scrollbar" >
                    {ProjectList && ProjectList.map((item, index) => (
                      <div className="card shadow-sm  mb-1 p-2"
                        style={{
                          border: changesize?.chatId == index ? "2px solid green" : "none",
                        }}
                        onClick={() => {
                          ChangeSize("project", 3)
                          if (item.status == 0) {
                            console.log(selectedChat);
                            return;
                          }
                          ChangeSize("chatId", index)
                          ChangeSize("user", 3)
                          ChangeSize("profile", 0)
                          ChangeSize("chat", 6)
                          setSelectedChat({
                            project_id: item?.project_id,
                            user_id: item?.userdata?._id,
                            email: item?.userdata?.gmail,
                          });
                          setCurrentProject(item);
                          setSelectedItem(item);
                          chatData(item?.userdata._id);
                        }}
                      >
                        <div className="card-content">
                          <img src={Imagesource(item?.userdata?.profile)} onError={handleImageError} width={35} height={35} className='rounded-circle ' />
                          <div className="card shadow-none border-0 mb-0">
                            <span className="fontcontent1 font-weight-bold text-dark1">{item.userdata?.first_name}&nbsp;{item.userdata?.last_name}</span>
                            {item.status !== 0 ? (
                              <span className="fontcontent2 font-weight-normal ">
                                {item?.userdata.user_type == "0"
                                  ? "Buyer"
                                  : "Seller"}
                              </span>
                            ) : (
                              <span className="fs-3 text-truncate text-danger text-body-color d-block">
                                Waiting for Approval
                              </span>
                            )}
                          </div>
                          <div></div>
                        </div>

                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className={`bg-white col-${changesize.chat} p-1 transition-width ${changesize.chat == 0 ? "d-none" : "block"}`}>
                <div className="">
                  <div id="main-wrapper background4" className=" d-block">
                    <div
                      className="container-fluid rounded-2 d-flex justify-content-between py-2 pl-4 background shadow-sm"
                      style={{ position: "sticky", top: "0%" }}
                    >
                      <div className="d-flex column-gap-2 align-items-center">
                        <img
                          src={`${selectedItem?.userdata?.profile ? `${BASE_URL + selectedItem?.userdata?.profile}` : `/images/profile/img0${selectedItem?.userdata?.randomprofile}.png`}`}
                          style={{ width: 33, height: 33, borderRadius: "50%" }}
                        />
                        <div className="d-flex flex-column">
                          <span className="chatname">
                            {selectedItem?.userdata?.first_name}
                            {" "}
                            {selectedItem?.userdata?.last_name}</span>
                          <span className="chatactive">last seen 3 hours ago</span>
                        </div>
                      </div>
                      <div className="d-flex justify-content-between align-items-center column-gap-3">
                        <span style={{ cursor: "pointer" }} onClick={() => { setInvoiceData() }}>
                          <i className="fa fa-archive" aria-hidden="true" />
                        </span>
                      </div>
                    </div>
                    <div className="chat-container hidden-scrollbar  container-fluid background1 mt-1 py-3">
                      <div className="chat-messages">
                        <p className="chattime text-center">Today 12:27 PM</p>
                        {Array.isArray(messages) && messages.map(message => (
                          <span className={'px-3 pt-2 my-2 pb-1 ' + (message.senderId === user._id ? 'user-message' : 'bot-message')}>
                            {message.text}
                            <p className={'mb-0 mx-25 pt-2 pb-1 ' + (message.senderId === user._id ? 'usermessagetime' : 'botmessagetime')}>{message.time}</p>
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="container-fluid background mt-1 position-fix">
                      <div className="d-flex inputback align-items-center justify-content-around px-2 bg-white column-gap-3">
                        <img src="/images/icons/attach.png" style={{ width: 20, height: 20 }} />
                        <input
                          type="text"
                          className="bg-white"
                          placeholder="Type a message..."
                          defaultValue=""
                          style={{ border: "none" }}
                          value={messageText} onChange={e => setMessageText(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              sendMessage();
                            }
                          }}
                        />
                        <button className="sendbutton d-flex align-items-center justify-content-center"
                          onClick={() => {
                            sendMessage();
                          }} >
                          <img
                            src="/images/icons/paper-plane 1.png"
                            style={{ width: 16, height: 16 }}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chats;
