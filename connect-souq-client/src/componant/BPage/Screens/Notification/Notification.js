import React, { useState, useEffect, useRef, startTransition } from 'react'
import FetchData from '../../../fetch-api/Apifetch';
import { useNavigate } from 'react-router-dom';
import "../../../screens/FeedPage/style/style.css";
import { handleImageError, Imagesource } from '../../../utils/Function';
import { MainWrapper } from '../../../screens/layout/Shimmer';

const Notification = () => {
  const [UserData, setUserData] = useState(JSON.parse(localStorage.getItem("LOGINDATA")));
  const [listNatification, setListNotification] = useState([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  
  useEffect(() => {
    fetchNotifyList()
  }, [])

  const fetchNotifyList = async () => {
    setLoading(true)
    try {
      const res = await FetchData(`notify_list/${UserData?.user?._id}`, 'GET', null, true, false);
      if (res.success) {
        setListNotification(res.data);
        setLoading(false)
      }
    } catch (error) {
      console.error("Error fetching user list:", error.message);
    }
  };

  const HandleUpdate = async (item, status) => {
    startTransition(() => {
      navigate('/bp/preview', { state: item })
    })
  }
  return (
    <>
      <div>
        <section id="ads"></section>
        <aside id="left-aside"></aside>
        <div id="main-wrapper" className="body-wrapper mt-5 mt-lg-0">
          <main id="main-section" className="mt-2 mt-lg-0">
            <div className="container-fluid">
              <div className='card shadow-sm border rounded-0 p-3 mb-1'>
                <div className='d-flex justify-content-between'>
                  <span className='fontsubtitle font-weight-bold text-dark1'>Notifications</span>
                  <div className='d-flex align-items-center'>
                    <span className='fontcontent1 font-weight-light text-primary'>Mark all as read</span>
                    <a>
                      <img src="/images/icons/dotinfo.png" />
                    </a>
                  </div>
                </div>
              </div>


              <div className="card rounded border shadow-sm py-3 w-100">
{loading &&(
  <><MainWrapper/></>
)}

                {listNatification.map((item, index) => (
                  <div className="card p-3 mx-4 my-1 bg-light border">
                    <div className="card-content">
                      <img
                        src={Imagesource(item.user.profile)}
                        onError={handleImageError}
                        width={45}
                        height={45}
                        className="rounded-circle"
                      />
                      <div>
                        <div className='mb-1 mt-2 d-flex justify-content-start align-items-center column-gap-2'>{item.status != 1 ? (`Hi ${UserData?.user?.first_name + " " + UserData?.user?.last_name}, ${item.user.first_name + " " + item.user.last_name} has sent you an invite, would you like to accept & explore the business opportunity ?`) : (`You have accepted the request for the respective user!`)}</div>
                        <div className={` mb-1  `} style={{ fontWeight: "600", color: item.status === 0 ? "orange" : item.status == 1 ? "#4535C1" : "#e04d46" }}>{item.status == 0 ? (
                          <>
                            <i class="fas fa-hourglass-end"></i> Pending List
                          </>
                        ) : item.status == 1 ? (
                          <>
                            <i class="fas fa-circle-check"></i> Approved by Business Partner
                          </>
                        ) : (
                          <>
                            <i class="fas fa-ban" aria-hidden="true"></i> Rejected
                          </>)}
                        </div>
                      </div>
                      <div style={{ height: "70px", lineHeight: "70px" }}>
                        <button
                          onClick={() => HandleUpdate(item, 1)} 
                          //disabled={item.status == 1 || item.status == 2}
                          className="btn btn-connect small mx-1" style={{ fontSize: "12px", backgroundColor: "#4535C1", color: "white" }}>
                            View
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  )

}

export default Notification