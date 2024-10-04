import React, { useEffect, useState } from "react";
import { Modal, NavItem } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import FetchData from "../../../fetch-api/Apifetch";
import { BASE_URL } from "../../../utils/ApiRoute";
import ImgView from "../../FeedPage/PostData/ImgView";
import { useNavigate } from 'react-router-dom';
import { capitalizeFirstLetter, FormatCommentDateDifference, FormatDateDifference, handleImageError, Imagesource, Linkcheck } from "../../../utils/Function";
// import {CheckGuest} from "../../../utils/Function"
import { toast } from "react-toastify";
import { useRef } from "react";
import AdminContent from "./AdminContent";
import EditModal from "./EditModal";
import Swal from "sweetalert2";

const Post = ({ item,setIndex,isShow,pageFollowstatus }) => {
  const reactionImages = {
    1: "/images/feed_images/like1.png",
    2: "/images/feed_images/like1.png",
    3: "/images/feed_images/like1.png",
    4: "/images/feed_images/like1.png",
  };
  const navigate = useNavigate();
  const path = window.location.pathname
  const { t } = useTranslation(); 
  const textareaRef = useRef(null); // Create a ref for the textarea
  const [dropDown1, setDropDown1] = useState(false)
  const [userData, setUserData] = useState(JSON.parse(localStorage.getItem('LOGINDATA'))?.user)
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [commentText, setCommentText] = useState();
  const [Alreadycommendenter, setAlreadycommendenter] = useState(true);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isModalDropdownOpen, setModalDropdownOpen] = useState(false);
  const [disable, setDisable] = useState(false);
  const [dropDown, setDropDown] = useState(false)
  const [SignDropdown, setSignDropdown] = useState(false);
  const [EditcommentText, setEditCommentText] = useState({});
  const [editingCommentId, setEditingCommentId] = useState(null); // Track the ID of the comment being edited
  const [editModal, seteditmodal] = useState(false)
  const [EditModalData, setEditModalData]= useState()
  const userReaction = item?.reaction?.find(
    (reaction) => reaction.reacted_by === userData?._id
  );
  const [selectedReaction, setSelectedReaction] = useState(userReaction?.reaction_type);
  const handleCommentClick = () => {
    if(pageFollowstatus == 1){
      setShowCommentInput(!showCommentInput);
    }else{
      setSignDropdown(!SignDropdown)
    }
  };
  const [showFullText, setShowFullText] = useState(false);
  const articleRef = useRef(null);
  const ModalEdit = (item)=>{
    setEditModalData(item)
    seteditmodal(!editModal)
  }

  const toggleFullText=()=>{
    setShowFullText(!showFullText);
    if(showFullText){
      if (articleRef.current) {
        const topOffset = articleRef.current.getBoundingClientRect().top + window.pageYOffset - 100;
        window.scrollTo({ top: topOffset, behavior: 'auto' });
      } 
    }
  };
  const AddComment = async (item) => {
    if (!commentText || commentText.trim().length < 2 || disable) {
      return;
    }
    try {
      setDisable(true);
      var data = JSON.stringify({
        post_id: item?._id,
        msg: commentText,
        user_id: userData._id,
        commented_by: userData._id,
      });
      const res = await FetchData("comment", "POST", data, true, false);
      console.log(res.status);
      setAlreadycommendenter(res.status);
      setCommentText("");
      setDisable(false);
      setIndex((pre)=>pre+1);
    } catch (error) {
      setIndex((pre)=>pre+1);
      setCommentText("");
    }
  };
  const UserImg = [
    "img01.png",
    "img02.png",
    "img03.png",
    "img04.png",
    "img05.png",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setAlreadycommendenter(true); // Toggle between true and false
    }, 3000); // Interval in milliseconds (e.g., 10000ms = 10 seconds)
    return () => clearInterval(interval);
  }, []);

  const addPostReaction = async (reactionType) => {
    try {
      const data = JSON.stringify({
        post_id: item?._id,
        reaction_type: reactionType,
        reacted_by: userData._id,
      });
      const response = await FetchData(
        "post_reaction",
        "POST",
        data,
        true,
        false
      );
      setIndex((pre)=>pre+1)
    } catch (error) {
      setIndex((pre)=>pre+1)
    }
  };
  const handleDelete = async (Post_id) => {
  if(path != "/pages"){
    try {
      const res = await FetchData(`delete/pagepost/${Post_id}`, "GET", null, false, false);
      toast.success("Post Removed")
      setIndex((pre)=>pre+1);
    } catch (err) {
      console.log(err);
      setIndex((pre)=>pre+1);
    }
  }else{
    try {
      const res = await FetchData(`delete/pagepost/${Post_id}`, "GET", null, false, false);
      setIndex((pre)=>pre+1)
      toast.success("Post Removed")
    } catch (err) {
      setIndex((pre)=>pre+1)
    }
  }
  }

  const removePostReaction = async (reactionId) => {
    try {
      const deleteUrl = `post_reaction/delete/${reactionId}`;
      const response = await FetchData(deleteUrl, "GET", null, true, false);
      setIndex((pre)=>pre+1)
      console.log("Remove reaction response:", response);
    } catch (error) {
      setIndex((pre)=>pre+1)
      console.error("Error removing reaction:", error.message);
    }
  };

  const handleReactionClick = async () => {
    try {
      if(pageFollowstatus != 1){
        setSignDropdown(!SignDropdown)
        return;
      }
      if (userReaction) {
        await removePostReaction(userReaction._id);
        setSelectedReaction(null);
      } else {
        await addPostReaction(4);
        setSelectedReaction(4);
      }
    } catch (error) {
      console.error("Error handling reaction click:", error.message);
    }
  };

  const [showModal, setShowModal] = useState(false);
  const [imgSrc, setImgSrc] = useState("");

  const handleClose = () => {
    setShowModal(false);
  };
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleShow = (imgSrc, index = 0) => {
    setImgSrc(imgSrc);
    setCurrentIndex(index)
    setShowModal(true);
  };

  const isRTL = (text) => {
    // A simple check for Arabic and Hebrew characters
    const rtlPattern = /[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/;
    // const rtlPattern = /[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\u0700-\u074F\u0780-\u07BF\u0900-\u097F\u1BC0-\u1BFF\u10840-\u1085F\u10A00-\u10A5F\u10A60-\u10A7F]/;
    return rtlPattern.test(text);
  };

  const formattedText = (text) => {
    const paraList = text?.replace(/\n/g, '<br>');
    const description = showFullText ? paraList : (paraList?.length > 200 ? paraList.substring(0, 190) + '...' : paraList)
    const rtl = isRTL(text);
    return (
      <div>
        <div style={{ whiteSpace: 'pre-wrap' }}>
        <Linkcheck content={description} rtl={rtl}/>
        </div>
        {item?.description?.length > 250 && !showFullText && (
          <span className=" fontcontent2 font-weight-light"
            style={{cursor: 'pointer' }}
            onClick={toggleFullText}
          >
            ..{t('see')} {t('more')}
          </span>
        )
        }
        
      </div>
    );
  }
  const commentEditOpt = (value) => {
    setEditingCommentId(value?._id)
    setDropDown1(false)
    setEditCommentText(value?.msg)
  }

  const EditComment = async (value) => {

    console.log(value);
    console.log(EditcommentText);
    
    const data = {
            post_id: value.post_id,
            user_id: value.user_id,
            msg: EditcommentText,
            commented_by:value?.commented_by
}
    try{
      const res = await FetchData('comment/update/'+value?._id,'POST',JSON.stringify(data),false,false)
      console.log(res);
      setIndex((pre)=>pre+1)
      setEditingCommentId(null)

    }catch(err){
      console.log(err);
    }
  }
  const openCommentDeleteModal = async (Cmt_id) => {
    Swal.fire({
      title: 'Delete Comment?',
      html: '<span style="font-size: 16px; font-weight: bold;">Do you want to delete your Comment!</span>',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4535C1',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Delete!',
      cancelButtonText: 'Cancel',
      customClass: {
        confirmButton: 'swal2-confirm-custom',
        cancelButton: 'swal2-cancel-custom',
        title: 'swal2-title',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        DeleteComment(Cmt_id)
      }
    });
  }
  const DeleteComment = async (cmt_id) => {
    console.log(cmt_id);
    try{
      const res = await FetchData('comment/delete/'+cmt_id, 'GET', null, false, false)
      console.log(res);
      setIndex((pre)=>pre+1)
    }catch(err){
      console.log(err);
    }
  }

  return (
    <article className="mt-2" ref={articleRef}  style={{border:"0.5px solid #dbdbdb",borderRadius:"10px"}}>
      <div id="post-author">
        <a>
          <div style={{cursor:'pointer'}}
            onClick={() => {
              if(item?.users?._id !== userData?._id){
              navigate(`/user/${item?.users._id}`, {state:item})
              }
            }}>
            <img
              src={`${item?.users?.profile ? `${Imagesource(item?.users?.profile)}` : `/images/profile/img0${item?.users?.randomprofile}.png`}`}
              style={{objectFit:'cover'}}
              onError={handleImageError}
            />
            <div>
              <div>
                <span id="post-author-name" className="font-weight-bold text-dark1">
                  {item?.users.first_name}{" "}{item?.users.last_name}
                </span>
              </div>
              <span style={{fontWeight:"500"}}>{item?.users?.designation ? capitalizeFirstLetter(item?.users?.designation):"Designation"}</span>
              <div className="d-flex  pt-1 align-items-center"><span className="text-secondary1 fonthint" style={{fontWeight:"500"}}>
                {FormatDateDifference(item?.createdAt)} {FormatDateDifference(item?.createdAt) != "Just now" && "ago."}</span>
              </div>
            </div>
          </div>
        </a>
        <div onMouseEnter={() => { setDropDown(!dropDown) }} onMouseLeave={() => { setDropDown(!dropDown) }}>
          <div style={{rotate:"90deg"}} >
            <span className="fas fa-circle" aria-hidden="true" />
            <span className="fas fa-circle" aria-hidden="true" />
            <span className="fas fa-circle" aria-hidden="true" />
          </div>
          {dropDown && 
          <div className="bg-white rounded " style={{ width: 'fit-content', height: "auto", boxShadow: '1px 1px 3px 1px grey', position: "absolute", borderRadius: '0px',zIndex:1 }}>
            <ul>
              {userData._id == item?.users?._id && <li className="fontcontent1 px-3 py-2 text-dark hovering" onClick={()=>ModalEdit(item)}>Edit </li>}
              {(userData._id == item?.users?._id || isShow) && <li onClick={()=>{handleDelete(item?._id) }} 
              className="fontcontent1 px-3 py-2 text-dark hovering">Remove</li>}
              {userData._id != item?.users?._id && <li className="fontcontent1 px-3 py-2 text-danger">Report spam</li>}
            </ul>
          </div>}
        </div>
      </div>
      <div id="post-data">
        <p className="fonttext font-weight-1">
          {formattedText(item?.description)}
        </p>
        {item?.media_type == 1 && ImgView(item?.media_url.length, item, handleShow)}
      </div>
      <div id="post-interactions" >
        <div id="interactions-btns" className="py-1">
          <div className={`dropdown ${isDropdownOpen ? "show" : ""}`}// onMouseEnter={() => setDropdownOpen(true)}// onMouseLeave={() => setDropdownOpen(false)}
            >
            {selectedReaction ? (
              <button
                className="btn-dropdown column-gap-1 w-100"
                type="button"
                aria-haspopup="true"
                style={{rowGap:'1px',height:'auto'}}
                aria-expanded={isDropdownOpen}
                onClick={() => handleReactionClick()}
              >
                <div style={{height:'25px',display:'flex',alignItems:'end'}}>
                  {selectedReaction ? (
                    <img
                      src={reactionImages[selectedReaction]}
                      width="25px"
                      alt=""
                      style={{ cursor: "pointer",marginBottom:'2px' }}
                    />
                  ) : (
                    <span
                      className="far fa-thumbs-up fa-flip-horizontal"
                      aria-hidden="true"
                      style={{ cursor: "pointer",marginBottom:'2px'  }}
                    />
                  )}
                </div>
                <div>
                  {item?.reaction && item?.reaction.length != 0
                    ? item?.reaction.length
                    : 0}
                  {/* <span> {t(item?.reaction.length <= 1 ? 'like':'likes')}</span> */}
                </div>
              </button>
            ) : (
              <button
                className="btn-dropdown column-gap-1 w-100"
                type="button"
                id="likeDropdown"
                style={{rowGap:'1px',height:'auto'}}
                // data-toggle="dropdown"
                // aria-haspopup="true"
                aria-expanded={isDropdownOpen}
                onClick={() => handleReactionClick(2)}
              >
                <div style={{height:'25px',display:'flex',alignItems:'end'}}>
                  {selectedReaction ? (
                    <img
                      src={reactionImages[selectedReaction]}
                      width="25px"
                      alt=""
                      style={{ cursor: "pointer",marginBottom:'2px'  }}
                    />
                  ) : (
                    <img src="/images/feed_images/like-reaction.png" width={25}
                     style={{ cursor: "pointer" }}/>
                  )}
                </div>
                <div>
                  {item?.reaction && item?.reaction.length != 0
                    ? item?.reaction.length
                    :0}
                  {/* <span>{t(item?.reaction?.length <= 1 ? 'like':'likes')}</span> */}
                </div>
              </button>
            )}
                     <div className={`dropdown-menu rounded-0 py-0 ${SignDropdown ? "show " : ""
                }`}
                style={{
                  position: "absolute",
                  top: "60px",
                  borderRadius: "10px",
                  width: "250px",
                  height:'auto'
                }}
                >
                  <div className="d-flex flex-column px-2 py-2">
                    <div>
                    <span className="fontsubtitle font-weight-bold">Like or Comment this post?</span>
                    <p className="fontcontent1 text-secondary">You need Join a Group</p>
                    </div>
                  </div>

            </div>
          </div>
          <button onClick={handleCommentClick} className="align-items-center h-auto column-gap-1" style={{height:'auto'}}>
            <div style={{height:'25px',display:'flex',alignItems:'end'}}>
              <img src="/images/feed_images/comment-icon.png" width={25}/>
            </div>
            <div>
             
              <span> {item?.CommentUsers && item?.CommentUsers.length != 0
                ? item?.CommentUsers.length
                : 0}
                {/* {t(item?.CommentUsers.length <= 1 ? 'comment':'comments')} */}
                </span>

            </div>
          </button>
          <button className=" align-items-center h-auto column-gap-1" style={{rowGap:'1px',height:'auto'}}>
            <div style={{height:'25px',display:'flex',alignItems:'end'}}>
                <img src="/images/feed_images/share-icon.png" width={23}/>
            </div>
            <div>
               <span>10</span>
            </div>
          </button>
          <button className=" align-items-center h-auto column-gap-1" style={{rowGap:'1px',height:'auto'}}>
            <div style={{height:'25px',display:'flex',alignItems:'end'}}>
                <img src="/images/icons/repeat.png" width={23}/>
            </div>
            <div>
               <span>12</span>
            </div>
          </button>
        </div>
        <div id="post-author" className="pb-3"
          style={{
            position: "sticky",
            top: 0,
            zIndex: 11,
            paddingTop: "5px"
          }}>
            <a >
              <div>
                <img
                src={`${userData?.profile ? `${Imagesource(userData?.profile)}` : `/images/profile/img0${userData?.randomprofile}.png`}`}
                alt=""
                style={{ width: '40px', height: '40px' }}
                onError={handleImageError}
                />
                <div className="d-flex align-items-center flex-row w-100" 
                style={{
                  borderRadius: '10px',
                  background: '#EDEDEDE0'
                }}>
                  <input
                    type="text"
                    className={`col-form-label ${!Alreadycommendenter ? 'red-placeholder' : ""}`}
                    placeholder={!Alreadycommendenter ? "Comment Already Added" : 'Write a comment...'}
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    style={{
                      width: '100%',
                      paddingLeft: 20,
                      borderRadius: 30,
                      border: "none",
                      background: '#EDEDEDE0',
                    }}
                  />
                  <div className="d-flex column-gap-1 mr-3">
                  <img
                    src="/images/icons/send.png"
                    alt=""
                    width="40px"
                    onClick={() => AddComment(item)}
                    style={{
                      position: "relative",
                      height: 26,
                      width: 26,
                      cursor: "pointer",
                      borderRadius: 0
                    }}
                  />
                </div>
                </div>
              </div>
            </a>
          </div>
      </div>
      {showCommentInput && (
        <div
          className="inputs pb-3"
          style={{ maxHeight: "300px", overflow: "scroll" }}
        >
          
          {item?.CommentUsers &&
            item?.CommentUsers.map((msgitem) => (
              <div>
                <div id="post-author">
                  <a>
                    <div>
                      <img
                        src={`${msgitem.CommentUsers?.profile ? `${BASE_URL + msgitem.CommentUsers?.profile}` : `/images/profile/img0${msgitem.CommentUsers?.randomprofile}.png`}`}
                        onError={handleImageError}
                        style={{ position: "relative"}}
                      />
                     <div className="d-flex" style={{backgroundColor:'#FAFAFA',  borderRadius:'0px 5px 8px'}}>
                        <div className="d-flex px-2">
                        <div className="containers mt-1 py-2" >
                          <div className="d-flex align-items-center">
                          <h6 className="pl-0">
                            <span className="text-dark1 fontcontent1 font-weight-semibold" >{msgitem.CommentUsers?.first_name + " " + msgitem.CommentUsers?.last_name}</span>
                          </h6>
                          <h6 className="fonthint text-secondary1">{FormatCommentDateDifference(msgitem.createdAt)}</h6>
                          </div>
                          {/* <div className="fontcontent2 text-dark1">
                            {msgitem.msg}
                          </div> */}
                          {editingCommentId === msgitem?._id ? (
        <div className="d-flex flex-column">
          <textarea 
          style={{minWidth:'475px'}}
            type="text" 
            value={EditcommentText} 
            onChange={(e) => setEditCommentText(e.target.value)} 
            className="form-control border-0 p-0 fontcontent2 text-dark1" 
            ref={textareaRef}
          />
          <div className="d-flex mt-2">
            <button className="btn btn-connect rounded-01 py-1 mr-2" disabled={EditcommentText == msgitem?.msg || !EditcommentText} onClick={()=>EditComment(msgitem)}>Save</button>
            <button className="btn btn-secondary rounded-01 py-1 btn-sm" onClick={() => commentEditOpt(null)}>Cancel</button>
          </div>
        </div>
      ) : (
        <div className="fontcontent2 text-dark1">
          {msgitem.msg}
        </div>
      )}
                        </div>
                        {editingCommentId !== msgitem?._id &&
                        <div style={{maxWidth:'8px'}} onMouseEnter={() => { setDropDown1(msgitem?._id) }} onMouseLeave={() => { setDropDown1(false) }}>
          <div className="d-flex flex-column mt-2 ml-1" style={{ rotate: "90deg" }} role='button'  >
            <span className="fas fa-circle" aria-hidden="true"  style={{fontSize:'3px',padding:'1px'}}/>
            <span className="fas fa-circle" aria-hidden="true"  style={{fontSize:'3px',padding:'1px'}}/>
            <span className="fas fa-circle" aria-hidden="true"  style={{fontSize:'3px',padding:'1px'}}/>
          </div>
          {dropDown1 == msgitem?._id &&
            <div className="bg-white " style={{ width: 'max-content', height: "auto",right:'130px', boxShadow: '1px 1px 3px 1px grey', position: "relative",top:'2px', borderRadius: '2px', zIndex: 2 }}>
              <ul>
                {userData._id == msgitem.CommentUsers?._id && <li onClick={()=>commentEditOpt(msgitem)} className="fontcontent1 px-3 py-2 text-dark hovering">Edit</li>}
                {userData._id == msgitem.CommentUsers?._id && <li onClick={() => { openCommentDeleteModal(msgitem?._id) }} className="fontcontent1 px-3 py-2 text-dark hovering">Delete Comment</li>}
                {userData._id != msgitem.CommentUsers?._id && <li className="fontcontent1 px-3 py-2 text-danger hovering">Report Comment</li>}
              </ul>
            </div>}
        </div>
        }
                        </div>
                      
                      </div>
                    </div>
                  </a>
                </div>
              </div>
            ))}
        </div>
      )}

      <Modal
        show={showModal}
        onHide={handleClose}
        imgSrc={imgSrc}
        className="modelfilter modal-xl modaltop"
        size="lgg"
      >
        <Modal.Body className="blackback px-0 pt-0 pb-0">
          <div
            className="row m-0 scrollhide modalsize1"
            style={{overflowX:'hidden'}}
          >
            <div className="col-12 col-lg-12">
              <p style={{ position: "absolute", color: "white", top: "5%", zIndex: '99999', display: imgSrc.length == 1 ? "none" : "block" }}>
                {" "}
                {currentIndex + 1}/{imgSrc.length}
                {" "}
              </p>
              <div className="pb-4 d-none d-md-block d-lg-block" onClick={handleClose} style={{ cursor: 'pointer',position:'relative',top:'5%',left:'98%' }}>
                    <i class="fa fa-times text-white" aria-hidden="true"></i>

                  </div>

              <div className="d-flex flex-row align-items-center justify-content-center" style={{ position: "relative" }}>
                <span
                  style={{ cursor: "pointer", position: "absolute", left: "-10px", zIndex: 99999, display: imgSrc.length == 1 ? "none" : "block" }}
                  onClick={() => {
                    if (currentIndex > 0) {
                      setCurrentIndex(currentIndex - 1);
                    }
                  }}
                >
                  <i className="fa fa-chevron-left text-white" style={{ fontSize: '30px' }} />
                </span>
                <img
                  src={BASE_URL + imgSrc[currentIndex]}
                  alt=""
                  className="imagesize pt-4"
                  style={{ objectFit: "contain", backgroundColor: "black" }}
                />
                <span
                  style={{ cursor: "pointer", position: "absolute", right: "-10px", zIndex: 99999, display: imgSrc.length == 1 ? "none" : "block" }}

                  onClick={() => {
                    if (currentIndex + 1 < imgSrc.length) {
                      setCurrentIndex(currentIndex + 1);
                    }
                  }}
                >
                  <i className="fa fa-chevron-right text-white" style={{ fontSize: '30px' }} />
                </span>
              </div>
            </div>
            <div
              className="col-12 col-lg-12 px-0"
              style={{ maxHeight: "210px"}}
            >
              <div className="h-100 border-rad2-2 p-3 scrollhide" style={{overflowY:'auto',maxHeight:'250px',background:'#000000b3'}}>
                <div className="d-flex align-items-center justify-content-between"
                >
                  <div className="d-flex align-items-center column-gap-2">
                    <img
                      src={
                        "/images/profile/" +
                        UserImg[item?.users?.randomprofile ?? 0]
                      }
                      alt=""
                      width={"40px"}
                      height={"40px"}
                    />
                    <div>
                      <div>
                        <strong id="post-author-name" className="letter-spacing text-white">
                          {item?.users.first_name + " " + item?.users.last_name}
                        </strong>
                      </div>
                      <span style={{ fontSize: 12 }} className="text-white">
                        {capitalizeFirstLetter(item?.users?.designation?item?.users?.designation:"Designation")}</span>
                    </div>
                  </div>
                </div>
                <div className="pt-2 py-3 smscroll scrollhide">
                  <p className="modal-texting text-white">
                    {/* {showFullText
                      ? item?.description
                      : item?.description.substring(0, 100)} */}
                    {formattedText(item?.description)}

                  </p>
                  
                  {/* <div className="d-flex flex-wrap hastags text-white">
                    <span>#robotics</span>
                    <span>#updates</span>
                    <span>#youthwing</span>
                    <span>#techgroups</span>
                    <span>#Qcodes</span>
                    <span>#environment</span>
                  </div> */}

                  <div style={{ borderBottom: '1px solid gray', marginTop: '8px' }}></div>

                  <div id="post-interactions">
                    <div id="interaction-btns" className="pt-2">
                      <div
                        className={`dropdown ${isModalDropdownOpen ? "show" : ""}`}
                        onMouseEnter={() => setModalDropdownOpen(true)}
                        onMouseLeave={() => setModalDropdownOpen(false)}
                      >
                        <button
                          className="btn-dropdown"
                          type="button"
                          // id="likeDropdown"
                          // data-toggle="dropdown"
                          // aria-haspopup="true"
                          // aria-expanded={isModalDropdownOpen}
                        >
                          <div>
                            {selectedReaction ? (
                              <img
                                src={reactionImages[selectedReaction]}
                                width="25px"
                                alt=""
                                onClick={() => handleReactionClick(null)}
                                style={{ cursor: "pointer" }}
                              />
                            ) : (
                              <span
                                className="far fa-thumbs-up fa-flip-horizontal"
                                aria-hidden="true"
                                onClick={() => handleReactionClick(1)}
                                style={{ cursor: "pointer" }}
                              />
                            )}
                          </div>
                          <div className="interactiontext">
                            {item?.reaction && item?.reaction.length != 0
                              ? item?.reaction.length
                              : ""}{" "}
                            <span > Like</span>
                          </div>
                        </button>
                      </div>
                      <button onClick={handleCommentClick}>
                        <div>
                          <span
                            className="far fa-comment-dots fa-flip-horizontal"
                            aria-hidden="true"
                          />
                        </div>
                        <div className="interactiontext">
                          {item?.CommentUsers && item?.CommentUsers.length != 0
                            ? item?.CommentUsers.length
                            : ""}{" "}
                          <span>Comment</span>
                        </div>
                      </button>
                      <button>
                        <div>
                          <span className="far fa-share-square" aria-hidden="true" />
                        </div>
                        <div className="interactiontext">
                          <span>Share</span>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      <div>
      <EditModal item={EditModalData} modal={editModal} setModal={seteditmodal}/>
      </div>
    </article>
  );
};

export default Post;
