import React, { useState, useEffect } from 'react'
import FetchData from '../../fetch-api/Apifetch';
import Calender from '../Screens/Calender/CalenderOne';
import { handleImageError, Imagesource, validateForm } from "../../utils/Function.js";

function Dashboard() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('LOGINDATA')).user);
  const [ProjectList, setProjectList] = useState([]);

  useEffect(() => {
    localStorage.removeItem('VERIFYDATA')
    listProject();
    if (!user?.transaction_login) {
      changeLoginstatus()
    }
  }, [])
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
        setProjectList(res.data);
      }
    } catch (error) {
      console.error("Error fetching user list:", error.message);
    }
  };

  const changeLoginstatus = async () => {
    var data = {
      transaction_login: 1,
      registerType: 'USER'
    }
    try {
      const res = await FetchData(`update/user/${user._id}`, 'POST', JSON.stringify(data), false, false)
      if (res.success) {
        // setClientNotification(res.data)
        // console.log(res.data);
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="container-fluid" style={{ paddingTop: "75px" }}>
      <div className="container-fluid">
        <Calender />
        <div className="mb-2 px-2">
          <div className="row">
            <div className="col-lg-4 d-flex align-items-strech">
              <div className="card w-100">
                <div className="card-body p-3">
                  <div className="d-sm-flex d-block align-items-center justify-content-between mb-2">
                    <div className="mb-3 mb-sm-0">
                      <h5 className="text-title">Invoice</h5>
                      <p className="card-subtitle mb-0">Average sales</p>
                    </div>
                    <div className="mb-3 mb-sm-0">
                      <div>
                        <p
                          className="card-subtitle mb-0 font-weight-bold"
                          role="button"
                          onClick={() => window.location.href = "/bp/project-invoice"}>View All</p>
                      </div>
                    </div>
                  </div>
                  <div className="table-responsive project-table">
                    <table className="table align-middle text-nowrap mb-0">
                    <thead>
                        <tr className="text-muted fw-semibold">
                          <th scope="col" className="ps-0">
                            Assigned
                          </th>
                          <th scope="col"></th>
                        </tr>
                      </thead>
                      <tbody className="border-top">
                        {ProjectList.map((item, index) => {
                          const isLastRow = index === ProjectList.length - 1 ? 'border-0' : '';
                          return (
                            <tr key={index}>
                              <td className={`ps-0 py-1 ${isLastRow}`}>
                                <div className="d-flex align-items-center">
                                  <div className="me-2 pe-1">
                                    <img
                                      src={Imagesource(item?.user?.profile)}
                                      onError={handleImageError}
                                      className="rounded-circle"
                                      width={40}
                                      height={40}
                                      alt=""
                                    />
                                  </div>
                                  <div>
                                    <h6 className="fw-semibold mb-1">{item.user?.first_name}&nbsp;{item.user?.last_name}</h6>
                                  </div>
                                </div>
                              </td>
                              <td className={`align-content-center text-end ${isLastRow}`}>
                                <span className="btn btn-connect text-white py-1">
                                  View
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-8 d-flex align-items-strech">
              <div className="card w-100">
                <div className="card-body p-3">
                  <div className="d-sm-flex d-block align-items-center justify-content-between mb-2">
                    <div className="mb-3 mb-sm-0">
                      <h5 className="text-title">My Projects</h5>
                      <p className="card-subtitle mb-0">loreum ipsum dolar sit amet</p>
                    </div>
                    <div className="mb-3 mb-sm-0">
                      <div>
                        <p
                          className="card-subtitle mb-0 font-weight-bold"
                          role="button"
                          onClick={() => window.location.href = "project-connection/"}>View All</p>
                      </div>
                    </div>
                  </div>
                  <div className="table-responsive project-table">
                    <table className="table align-middle text-nowrap mb-0">
                      <thead>
                        <tr className="text-muted fw-semibold">
                          <th scope="col" className="ps-0">
                            Assigned
                          </th>
                          <th scope="col">Project</th>
                          <th scope="col" className='text-end pr-3'>No of User</th>
                        </tr>
                      </thead>
                      <tbody className="border-top">
                        {ProjectList.map((item, index) => {
                          const isLastRow = index === ProjectList.length - 1 ? 'border-0' : '';
                          return (
                            <tr key={index}>
                              <td className={`ps-0 py-1 ${isLastRow}`}>
                                <div className="d-flex align-items-center">
                                  <div className="me-2 pe-1">
                                    <img
                                      src={Imagesource(item?.user?.profile)}
                                      onError={handleImageError}
                                      className="rounded-circle"
                                      width={40}
                                      height={40}
                                      alt=""
                                    />
                                  </div>
                                  <div>
                                    <h6 className="fw-semibold mb-1">{item.user?.first_name}&nbsp;{item.user?.last_name}</h6>
                                  </div>
                                </div>
                              </td>
                              <td className={`align-content-center ${isLastRow}`}>
                                <p className="mb-0 fs-3">{item.project.title}</p>
                              </td>
                              <td className={`align-content-center text-end ${isLastRow}`}>
                                <span className="btn btn-connect text-white py-1">
                                  {item?.connect_project.length} Users
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  )
}

export default Dashboard
