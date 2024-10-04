import React, { useState, useEffect } from 'react'
import FetchData from '../../../fetch-api/Apifetch';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Swal from 'sweetalert2';
// import { LoaderSpin } from '../../utils/Function';
import { useLocation, useNavigate } from 'react-router-dom';
import Skeleton from "react-loading-skeleton";
import { handleImageError } from '../../../utils/Function';

const Bussinesscommunity = () => {
  const navigate = useNavigate()
  const [userList, setUserList] = useState([]);
  const [UserData, setUserData] = useState(JSON.parse(localStorage.getItem("User")));
  const [page, setPage] = useState(1);
  const location = useLocation();
  const { state } = location;
  const [paginationInfo, setPaginationInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [businessList, setBusinessList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [Userproject, setUserproject] = useState({});
  const [selectedItems, setSelectedItems] = useState([]);
  const [skill, Setskills] = useState([])
  const [options, setOptions] = useState([]);
  const handleCheckboxChange = (title) => {
    if (selectedItems.includes(title)) {
      setSelectedItems(selectedItems.filter(item => item !== title));
    } else {
      setSelectedItems([...selectedItems, title]);
    }
  }
  useEffect(() => {
    console.log(state);
    dataList()
  }, [])

  const [listNatification, setListNotification] = useState([])
  const [selectedItem, setSelectedItem] = useState(false)
  useEffect(() => {
    fetchNotifyList()
    ListConnectedBusiness()
  }, []);

  const [show, setShow] = useState(false);
  const handleShow = (item) => {
    setUserproject(item)
    setShow(true);
  };

  const fetchNotifyList = async () => {
    try {
      const res = await FetchData(`notify_list/${UserData._id}`, 'GET', null, true, false);
      if (res.success) {
        const Listvalue = res.data
        setListNotification(Listvalue.filter(item => item.status == 1));
        setLoading(false)
      }
    } catch (error) {
      console.error("Error fetching user list:", error.message);
    }
  };

  const [Formdata, setFormData] = useState({
    location: "",
    user_type: "1",
    country: "",
    city: "",
  })

  const dataList = async () => {
    const res = await FetchData("industry", 'GET', null, false, false);
    setOptions(res.data.data);
  }

  const FetchApiData = async (id) => {
    const res = await FetchData("skill/" + id, 'GET', null, false, false);
    Setskills(res.data.data)
  }

  useEffect(() => {
    HandleSubmit();
  }, [page]);


  const [filterText, setFilterText] = useState('');
  const handleFilterChange = (event) => {
    setFilterText(event.target.value);
  };
  const [showFilter, setFilter] = useState(false);

  const HandleSubmit = async () => {
    setLoading(true)
    if (Formdata.filter_by == "1") {
      fetchUserList()
      return
    }
    setFilter(true)
    var Objectdata = { ...Formdata, ["skills"]: selectedItems }
    const res = await FetchData("filter_user/connection", 'Post', JSON.stringify(Objectdata), false, false);
    setUserList(res.data.users);
    // console.log(res.data.users);

    setPaginationInfo(res.data.pagination || null);
    setLoading(false)
  }

  const Handleaddbusinesscommunity = async (item) => {
    const data = [
      {
        id: item._id,
        first_name: item.first_name,
        last_name: item.last_name,
        status: item.status

      }
    ];

    const apiData = {
      bussiness_id: UserData._id,
      connecting_list: data
    }

    try {
      const res = await FetchData(`businesscommunity/add`, 'POST', JSON.stringify(apiData), true, false);
      console.log(res);
    } catch (error) {
      console.error("Error fetching user list:", error.message);
    }
  }

  const fetchUserList = async () => {
    try {
      var query = `page=${page}&limit=10`
      if (page > 1) {
        Swal.fire({
          title: 'info!',
          text: 'You will Need Refer Minimum 5 Users',
          icon: 'info'
        });
        return
      }
      if (searchQuery) {
        query = `page=${page}&limit=15&search=${searchQuery}`
      }

      var url = `list/user?${query}`
      if (Formdata.filter_by == "1") {
        url = `list/business?${query}&location=${Formdata.location}`
      }
      const res = await FetchData(url, 'GET', null, true, false);
      if (res.success) {
        if (Formdata.filter_by == "1") {
          setBusinessList(res.data.data)
        } else {
          setUserList(res.data.users);
        }
        setPaginationInfo(res.data.pagination || null);
      } else {
        console.error("Error fetching user list:", res.message);
      }
    } catch (error) {
      console.error("Error fetching user list:", error.message);
    }
  };

  const ListConnectedBusiness = async () => {
    try {
      const res = await FetchData(`businesscommunity/list/${UserData?._id}`, 'GET', null, false, false);
      console.log(res);
    }
    catch (err) {
      console.error("Error fetching connected business list:", err.message);
    }
  }

  var card = {
    border: "0.5px solid rgba(128, 128, 128, 0.31)",
    borderRadius: "10px",
  }

  const UserList = () => {
    return (
      <div className='mx-auto scroll justify-content-around px-0 gap-2 scrollerhide'
        style={{ overflowY: "scroll", maxHeight: "100vh", scrollbarWidth: "none", borderRadius: '2%', display: "flex", flexWrap: "wrap" }}>
        {userList && userList.map(item => (
          <div className="card p-2 my-1 border card-content1 col-12 col-md-8">
            <img
              src={`/images/profile/img0${item.randomprofile}.png`}
              onError={handleImageError}
              width={45}
              height={45}
              className="rounded-circle"
            />
            <div>
              <div className='mb-1 d-flex justify-content-start align-items-center column-gap-2'>
                <span
                  className="text-dark1 fontsubtitle font-weight-bold"
                  style={{ whiteSpace: 'nowrap', overflowX: 'hidden', textOverflow: 'ellipsis', minWidth: '30%', maxWidth: '40%' }}>
                  {item.first_name} {item.last_name}
                </span>
              </div>
              <div className='d-flex'>
                <span className="text-dark1 fontcontent2 font-weight-light">
                  ConnectSouq&nbsp;{item.user_type == "1" ? "Business Partner" : item.user_type == "0" ? "Buyer" : "Seller"}
                </span>
              </div>
              <div className='d-flex'>
                <span className="text-dark1 fontcontent2 font-weight-light">
                  From {item?.country && item?.city ? item.country + " " + item.city : "India"}
                </span>
              </div>
            </div>
            <button
              className="btn btn-connect "
              onClick={() => navigate('/bp/agreement', { state: item })}>
              Add to connect
            </button>
          </div>
        ))}
      </div>
    )
  }
  const UserListOld = () => {
    return (
      <div className='mx-auto scroll px-0 scrollerhide'
        style={{ overflowY: "scroll", maxHeight: "100vh", scrollbarWidth: "none", borderRadius: '2%' }}>
        {userList && userList.map(item => (
          <div className="d-flex bg-white  justify-content-between my-1 px-4 py-2" style={card}>
            <div className="px-3 w-50 d-flex">
              <div className="align-items-center d-flex">
                <img
                  src={`/images/profile/img0${item.randomprofile}.png`}
                  style={{ width: 45, height: 45, borderRadius: "50%" }}
                />
              </div>
              <div className='mx-2'>
                <div className="small font-weight-bold">{item.first_name} {item.last_name}</div>
                <p className="text-secondary m-0" style={{ fontSize: 12 }}>
                  {item.user_type == "1" ? "Business Partner" : item.user_type == "0" ? "Buyer" : "Seller"}
                  {item?.country && item?.city ? item.country + " " + item.city : "India"}
                </p>
              </div>
            </div>
            <div>
            </div>
            <div className="align-items-center d-flex">
              <button className="btn btn-primary small"
                onClick={() =>
                  //  Handleaddbusinesscommunity(item)
                  navigate('/bp/agreement', { state: item })
                }
                style={{
                  fontSize: "12px", backgroundColor: "#4535C1",
                  color: "white"
                }} >
                Add to Connect
              </button>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (

    <>
      <div className="container-fluid" style={{ paddingTop: "75px" }}>
        <div className="container-fluid">
          <div className="row mt-0 mx-0">
            <div className="col-lg-12 d-flex align-items-strech">
              <div className="card w-100">
                <div className="card-body p-3">
                  <div className="d-sm-flex d-block align-items-center justify-content-between">
                    <p className="text-title m-0">Project List</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-2 px-2">
              <div className="row" style={{ flexWrap: "nowrap", overflow: "hidden", overflowX: "scroll", height: "75vh" }}>
                <div className="row my-2 mx-auto">
                  <div className='col-12 col-md-12'>
                    {loading || userList.length == 0 ? (
                      <div>
                        <Skeleton height={"120px"} />
                        <Skeleton height={"120px"} />
                        <Skeleton height={"120px"} />
                      </div>
                    ) : (
                      <UserList />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )



}

export default Bussinesscommunity