import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import FetchData from '../../../fetch-api/Apifetch';
import "./chatgroup.css"
import { handleImageError } from '../../../utils/Function';
const Chatgroup = () => {
  const [userData, setUserData] = useState(JSON.parse(localStorage.getItem("LOGINDATA"))?.user);
  const [addDiv, setAddDiv] = useState(false);
  const [listChat, setListChat] = useState()
  const [selectedItem, setselectedItem] = useState();
  const [isExpanded, setIsExpanded] = useState(true);
  const navigate = useNavigate();
  const [formdata, setFormData] = useState({
    bussiness_id: userData?._id,
    title: "",
    connecting_list: []
  })

  useEffect(() => {
    listGroupChat()
  }, []);

  const handleGroupAdd = async () => {
    try {
      const res = await FetchData("businesscommunity/add", 'POST', JSON.stringify(formdata), false, false)
      console.log(res);
      if (res.status) {
        setFormData({
          ...formdata,
          title: ''
        })
        setAddDiv(false)
        listGroupChat()

      }
    } catch (err) {
      console.log(err);
    }
  }

  const listGroupChat = async () => {
    try {
      const res = await FetchData(`businesscommunity/list/${userData._id}`, 'Get', null, false, false)
      console.log(res.data);
      setListChat(res.data)
      setselectedItem(res.data[0])
    }
    catch (err) {
      console.log(err);
    }
  }

  const handlechatbox = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <div
      className='mx-auto scroll px-0'
      style={{ overflowY: "scroll", maxHeight: "100vh", scrollbarWidth: "none" }}>
      <div className="container-fluid " style={{ marginTop: "70px" }}>
        <div className="card overflow-hidden chat-application">
          <div className="d-flex align-items-center justify-content-between gap-6 m-3 d-lg-none">
            <button
              className="btn btn-primary d-flex"
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target="#chat-sidebar"
              aria-controls="chat-sidebar"
            >
              <i className="ti ti-menu-2 fs-5" />
            </button>
            <form className="position-relative w-100">
              <input
                type="text"
                className="form-control search-chat py-2 ps-5"
                id="text-srh"
                placeholder="Search Contact"
              />
              <i className="ti ti-search position-absolute top-50 start-0 translate-middle-y fs-6 text-dark ms-3" />
            </form>
          </div>
          <div className="d-flex">
            <div className={`${isExpanded ? 'w-30' : 'w-0'} d-none d-lg-block border-end user-chat-box chatwidth`}>
              <div className="px-1 py-2" style={{ marginBottom: "5px", marginRight: "1px", boxShadow: "#d1cfcf 2px 2px 1px" }}>
                <div className='d-flex justify-content-between py-4'>
                  <h6 className="text-title mb-2 ml-2">
                    My Groups
                  </h6>

                  <a onClick={() => { setAddDiv(!addDiv) }} style={{ cursor: 'pointer' }}> {!addDiv ? (<i class="ti ti-plus fs-5" style={{ color: "gray", marginRight: "10px" }}></i>) : (<i class="fas fa-solid fa-xmark" style={{ color: "gray", marginRight: "10px" }}></i>)}</a>
                </div>
                {addDiv && (
                  <div className="d-flex align-items-center justify-content-between flex-column mb-3 mt-3">

                    <div className="d-flex align-items-center justify-content-center ">

                      <div className="position-relative">
                        <img
                          src="/bp-assets/images/profile/user-1.jpg"
                          alt="user1"
                          width={80}
                          height={80}
                          className="rounded-circle"
                        />

                      </div>

                    </div>

                    <div className="ms-3">
                      {/* <h6 className="fw-semibold mb-2 mt-2">ConnectSouq Team <i class="fa-solid fa-pen" style={{color:"grey"}}></i></h6> */}
                      <div> <input className="fw-semibold mb-2 mt-2  gname" onChange={(e) => { setFormData({ ...formdata, ["title"]: e.target.value }) }} value={formdata.title} placeholder='ConnectSouq Team' />
                        <a style={{ cursor: 'pointer' }} >{!formdata.title ? (<i class="fas fa-solid fa-pen" style={{ color: "grey" }}></i>) : (<i onClick={() => { handleGroupAdd() }} class="fas fa-solid fa-check" style={{ color: "grey" }}></i>)}</a></div>
                    </div>
                  </div>
                )}
              </div>
              {listChat && listChat.map(item => (
                <>
                  <div
                    className="card pro-card-shadow px-2 py-2 column-gap-3"
                    style={{ cursor: "pointer", background: selectedItem == item ? "#4535C1" : "#FFFFFF" }}
                    onClick={() => { setselectedItem(item) }}
                  >
                    <div className="card-content">
                      <div className="d-flex align-items-center">
                        <img
                          src="/bp-assets/images/profile/user-1.jpg"
                          onError={handleImageError}
                          width={35}
                          height={35}
                          className={`${selectedItem == item ? "rounded-white" : "rounded-primary"}`} />
                      </div>
                      <div className="d-flex flex-column">
                        <span
                          className={`text-title text-capitalize mt-1 text-12 ${selectedItem == item ? "text-white" : "text-black"}`}>
                          {item.title}
                        </span>
                        <span
                          className={`text-secondary mt-1 text-12 ${selectedItem == item ? "text-white" : "text-body-secondary"}`}>
                          active
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              ))}
            </div>

            <div className="w-70 w-xs-100 chat-container">
              <div className="chat-box-inner-part h-100">
                <div className="chat-not-selected h-100 d-none">
                  <div className="d-flex align-items-center justify-content-center h-100 p-5">
                    <div className="text-center">
                      <span className="text-primary">
                        <i className="ti ti-message-dots fs-10" />
                      </span>
                      <h6 className="mt-2">Open chat from the list</h6>
                    </div>
                  </div>
                </div>
                {!listChat ? (
                  <div className="chatting-box d-flex justify-content-center h-100 align-items-center ">
                    <span><h5>Create a group to start the chat</h5></span>
                  </div>
                ) : (
                  <div className="chatting-box d-block">
                    <div className="p-9 border-bottom chat-meta-user d-flex align-items-center justify-content-between chat-nav" >
                      <div
                        className="hstack gap-3 current-chat-user-name"
                        style={{ cursor: "pointer" }}
                      >
                        <div className="position-relative">
                          {isExpanded ? (<img
                            src="/bp-assets/images/profile/user-1.jpg"
                            alt="user1"
                            width={48}
                            height={48}
                            className="rounded-circle"
                            onClick={() => { handlechatbox() }}
                          />) : (<i class="fas fa-solid fa-chevron-left" onClick={() => { handlechatbox() }}></i>)}
                          {isExpanded && <span className="position-absolute bottom-0 end-0 p-1 badge rounded-pill bg-success">
                            <span className="visually-hidden">New alerts</span>
                          </span>}
                        </div>
                        <div>
                          <h6 className="mb-1 name fw-semibold" />
                          <p className="mb-0 h5 uppercase">{selectedItem?.title}</p>
                          <p style={{ marginBottom: "0px", color: "gray" }}>Last seen 3 min ago</p>
                        </div>
                      </div>
                      <ul className="list-unstyled mb-0 d-flex align-items-center">
                        <li>
                          <a
                            className="text-dark px-2 fs-7 bg-hover-primary nav-icon-hover position-relative z-index-5"
                            href="javascript:void(0)"
                          >
                            <i className="ti ti-phone" />
                          </a>
                        </li>
                        <li>
                          <a
                            className="text-dark px-2 fs-7 bg-hover-primary nav-icon-hover position-relative z-index-5"
                            href="javascript:void(0)"
                          >
                            <i className="ti ti-video" />
                          </a>
                        </li>
                        <li>
                          <a onClick={() => { setIsExpanded(false) }}
                            className="chat-menu text-dark px-2 fs-7 bg-hover-primary nav-icon-hover position-relative z-index-5"
                            href="javascript:void(0)"
                          >
                            <i class="fas fa-solid fa-ellipsis"></i>
                          </a>
                        </li>
                      </ul>
                    </div>
                    <div className="d-flex parent-chat-box">
                      <div className="chat-box w-xs-100">
                        <div
                          className="p-9"
                          data-simplebar="init"
                          style={{ height: "60vh", maxHeight: "60vh" }}
                        >
                          <div
                            className="simplebar-wrapper"
                            style={{ margin: "-20px" }}
                          >
                            <div className="simplebar-height-auto-observer-wrapper">
                              <div className="simplebar-height-auto-observer" />
                            </div>
                            <div
                              className="simplebar-mask"
                              style={{ background: "rgb(231, 231, 231)" }}
                            >
                              <div
                                className="simplebar-offset"
                                style={{ right: 0, bottom: 0 }}
                              >
                                <div
                                  className="simplebar-content-wrapper chat-bg"
                                  tabIndex={0}
                                  role="region"
                                  aria-label="scrollable content"
                                  style={{ height: "100%", overflow: "scroll" }}
                                >
                                  <div
                                    className="simplebar-content"
                                    style={{ padding: 20 }}
                                  >
                                    <div
                                      className="chat-list chat active-chat"
                                      data-user-id={1}
                                    >
                                      <div className="hstack gap-3 align-items-start mb-7 justify-content-end">
                                        <div>
                                          <h6 className="fs-2 text-muted">
                                            Sara, 12:20 PM
                                          </h6>
                                          <div
                                            className="p-2  fs-3"
                                            style={{
                                              backgroundColor: "#4535C1",
                                              color: "white",
                                              borderRadius: "10px 10px 0px 10px"
                                            }}
                                          >
                                            Hi!
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          className="px-9 py-6 chat-send-message-footer"

                        >
                          <div className="d-flex align-items-center justify-content-between">
                            <div className="d-flex align-items-center gap-2 w-85">
                              <a
                                className="position-relative nav-icon-hover z-index-5"
                                href="javascript:void(0)"
                              >
                                <i className="ti ti-paperclip" />

                              </a>
                              <input
                                type="text"
                                className="form-control message-type-box text-muted border-0 p-0 ms-2 input-sech"
                                placeholder="Type a Message"
                                fdprocessedid="0p3op"
                                defaultValue=""
                              />
                            </div>
                            <ul className="list-unstyledn mb-0 d-flex align-items-center">
                              <li>
                                <a
                                  className="text-dark px-2 fs-7 bg-hover-primary nav-icon-hover position-relative z-index-5"
                                  href="javascript:void(0)"
                                >

                                  <i className="ti ti-mood-smile text-dark bg-hover-primary fs-7" />
                                </a>
                              </li>
                              <li>
                                <a
                                  className="text-dark px-2 fs-7 bg-hover-primary nav-icon-hover position-relative z-index-5"
                                  href="javascript:void(0)"
                                >
                                  <i className="ti ti-microphone" />

                                </a>
                              </li>
                              <li>
                                <a
                                  className="text-dark px-2 fs-7 bg-hover-primary nav-icon-hover position-relative z-index-5"
                                  href="javascript:void(0)"
                                >
                                  <i class="fas fa-solid fa-paper-plane"></i>
                                </a>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className={`${!isExpanded ? 'w-30' : 'w-0'} d-none d-lg-block user-chat-box chatwidth m-3`} style={{ marginBottom: "5px" }}>
              <div className='card mb-2'>
                <div className='d-flex justify-content-between w-100 p-3'>
                  <i onClick={() => { setIsExpanded(true) }} class="fas fa-solid fa-xmark" style={{ color: "gray", marginRight: "10px", cursor: 'pointer' }}></i>
                  <i onClick={() => { navigate('/bp/add_chatgroup', { state: selectedItem }) }} class="fas fa-solid fa-plus" style={{ color: "gray", marginRight: "10px", cursor: 'pointer' }}></i>
                </div>
                <div className="d-flex align-items-center justify-content-between flex-column ">

                  <div className="d-flex align-items-center justify-content-center ">

                    <div className="position-relative">
                      <img
                        src="/bp-assets/images/profile/user-1.jpg"
                        alt="user1"
                        width={80}
                        height={80}
                        className="rounded-circle"
                      />

                    </div>

                  </div>

                  <div className="w-100 d-flex flex-column align-items-center pt-2">
                    <h6 className="fw-semibold mb-0 mt-2">{selectedItem?.title} <i class="fas fa-solid fa-pen" style={{ color: "grey" }}></i></h6>
                    <p>Group 3 members</p>
                  </div>
                </div>
              </div>

              <div className='card d-flex mb-2'>
                <div className='d-flex justify-content-between p-2'>
                  <span><p>Add group description</p></span>
                  <i class="fas fa-solid fa-pen" style={{ color: "grey" }}></i>
                </div>
                <div className='px-2'>
                  <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                </div>

              </div>

              <div className='card d-flex mb-2'>
                <div className='d-flex justify-content-between p-2'>
                  <span><p>Media, links and docs</p></span>
                  <i class="fas fa-solid fa-chevron-right" style={{ color: "grey" }}></i>
                </div>
                <div className='d-flex column-gap-4 px-4 pb-3'>
                  <div className='card bg-light'>
                    <img src="/bp-assets/images/profile/user-1.jpg" width={50} height={50} />
                  </div>
                  <div className='card bg-light'>
                    <img src="/bp-assets/images/profile/user-1.jpg" width={50} height={50} />
                  </div>
                  <div className='card bg-light'>
                    <img src="/bp-assets/images/profile/user-1.jpg" width={50} height={50} />
                  </div>

                </div>
              </div>

              <div className='card'>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chatgroup
