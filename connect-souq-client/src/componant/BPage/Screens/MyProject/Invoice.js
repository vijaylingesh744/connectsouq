import React, { useEffect, useState, useRef } from 'react'
import FetchData from '../../../fetch-api/Apifetch';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import "./input.css"
import Modal from "react-bootstrap/Modal";
import { handleImageError, Imagesource } from '../../../utils/Function';
import Swal from 'sweetalert2';
import InvoiceModal from './InvoiceModal';

var invoiceData = [
  {
    id: 0,
    userimg: "1724588137171-profile.jpg",
    name: "Sara Kumar",
    industry: "IT Industry",
    invoiceid: "INV-RQRUBSB",
    date: "19-10-2024",
    cost: "800 USD",
    cost_date: "23-12-2023",
  }
]
const Invoice = () => {
  const Location = useLocation();
  const { state } = Location;
  const [viewModal, setModal] = useState(false);
  const paypalRef = useRef();
  const [projectdata, setProjectData] = useState([]);
  const [clientData, setClientData] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [user] = useState(JSON.parse(localStorage.getItem("LOGINDATA")).user);
  const [formData, setFormData] = useState({
    projectId: "",
    bpId: user._id,
    senderId: user._id,
    receiverId: "",
    bpCharges: "",
    email: "",
    mop: "",
    transactionNo: "692e2Dce12392817w",
    remark: "",
    dueDate: "",
    amount: "",
    currency: "",
    invoiceNo: "XBGHJSD"
  });

  const [ModalView, setModalView] = useState(false);
  const [ShareInvoiceData, setShareInvoiceData] = useState({
    receiverCharges: '',
    amount: '',
    bp_charges: '',
    csFee: '0',
    tax: '0',
    currency: '',
    invoiceNo: '',
    transactionNo: '',
    client_id: '',
    senderId: user?._id,
    receiverId: "",
    projectId: ""
  });
  const [TabInvoice, setTabInvoice] = useState([
    {
      product: "",
      quantity: "",
      amount: "",
    },
  ]);

  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      invoiceNo: "INV-" + generateInvoiceNumber(7),
      transactionNo: "CONSQ-" + generateInvoiceNumber(12)
    }));
  }, []);

  useEffect(() => {
    if (!window.paypal || !viewModal) return;

    window.paypal.Buttons({
      createOrder: (data, actions) => {
        return actions.order.create({
          purchase_units: [{
            amount: {
              value: "12",
            },
          }],
        });
      },
      onApprove: (data, actions) => {
        return actions.order.capture().then((details) => {
          alert(`Transaction completed by ${details.payer.name.given}`);
          setModal(false);
        });
      },
      onError: (err) => {
        console.error('PayPal Button Error:', err);
      },
    }).render(paypalRef.current);
  }, [viewModal]);

  useEffect(() => {
    if (user?._id) {
      onReqProjectList(user?._id);
    }
  }, [user])

  function generateInvoiceNumber(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }
    return result;
  }

  const onReqProjectList = async (ID) => {
    try {
      const res = await FetchData(`notify_list/${ID}`, 'GET', null, true, false);
      if (res.success) {
        setProjectData(res.data);
      }
    } catch (error) {
      console.error("Error fetching project list:", error.message);
    }
  };

  const onReqClientList = async (ID) => {
    try {
      const res = await FetchData(`list/project/${ID}`, 'GET', null, true, false);
      if (res.status) {
        setClientData(res.data)
      }
    } catch (error) {
      console.error("Error fetching client list:", error.message);
    }
  }

  const onSelectProject = (ID) => {
    onReqClientList(ID);
  }

  const PayPalModal = () => {
    return (
      <Modal show={viewModal}
        className="modelfilter mode mx-auto modal-lg"
        size="mdmd" style={{ height: "auto" }}>
        <Modal.Header>
          <h4 style={{ marginLeft: '20px' }}>View Invoice</h4>
          <i class="fa fa-times" aria-hidden="true" style={{ cursor: 'pointer' }} onClick={() => setModal(!viewModal)}></i>
        </Modal.Header>
        <Modal.Body style={{ overflowY: "scroll", '&::-webkit-scrollbar': { width: 12, } }}>
          <div ref={paypalRef} />
        </Modal.Body>
      </Modal>
    )
  }

  const onHandleRiseInvoice = () => {
    setModalView(true)
    setShareInvoiceData((previnvoiceData) => ({
      ...previnvoiceData,
      csFee: "",
      tax: "",
      invoiceNo: "INV-" + generateInvoiceNumber(7),
      transactionNo: "CONSQ-" + generateInvoiceNumber(12)
    }));
    setTabInvoice([
      {
        product: "",
        quantity: "",
        amount: "",
      }])
  }

  const HandleShareInvoice = async () => {
    setModalView(false)
    var updatedInvoiceData = {
      ...ShareInvoiceData,
      receiverCharges: TabInvoice
    };
    if (state.matchedField == "receiverData") {
      updatedInvoiceData.client_id = state.sender
      updatedInvoiceData.receiverId = state.sender
    } else {
      updatedInvoiceData.client_id = state.receive
      updatedInvoiceData.receiverId = state.receive
    }
    try {
      const res = await FetchData(`invoice_trans/add`, "POST", JSON.stringify(updatedInvoiceData), false, false)
      console.log(res);
      setShareInvoiceData({
        receiverCharges: '',
        amount: '',
        bp_charges: '',
        csFee: '0',
        tax: '0',
        currency: '',
        invoiceNo: '',
        transactionNo: '',
        senderId: user?._id,
      })
      setTabInvoice([
        {
          product: "",
          quantity: "",
          amount: "",
        }])
      setShareInvoiceData((previnvoiceData) => ({
        ...previnvoiceData,
        invoiceNo: "INV-" + generateInvoiceNumber(7),
        transactionNo: "CONSQ-" + generateInvoiceNumber(12)
      }));
    } catch (err) {
      console.log(err);
    }
  }

  const updateShareInvoiceData = (updatedData) => {
    setShareInvoiceData((prevData) => ({
      ...prevData,
      ...updatedData,
    }));
  };
  return (
    <div className="body-wrapper">
      <div className="container-fluid">
        <div className="row mt-0 mx-0">
          <div className="col-lg-12 d-flex align-items-strech">
            <div className="card w-100">
              <div className="card-body p-3">
                <div className="d-sm-flex d-block align-items-center justify-content-between mb-2">
                  <div className="mb-3 mb-sm-0">
                    <h5 className="text-title">Invoice</h5>
                    <p className="card-subtitle mb-0">loreum ipsum dolar sit amet</p>
                  </div>
                  <div className="d-flex column-gap-2 align-items-center">
                    <img src="/images/icons/settings.png" width={20} height={20} />
                    <button className="btn btn-outline-success" onClick={() => onHandleRiseInvoice()}>+ Add</button>
                  </div>
                </div>
                <div className="container-fluid d-flex py-0 px-1 mt-3">
                  <div
                    className={`mr-2 px-1 ${activeTab == 0 && "active-tap"}`}
                    style={{ cursor: "pointer" }}
                    onClick={() => { setActiveTab(0) }}
                  >
                    <span className="fontsubtitle font-weight-bold">Paid</span>
                  </div>
                  <div
                    className={`mx-2 px-1 ${activeTab == 1 && "active-tap"}`}
                    style={{ cursor: "pointer" }}
                    onClick={() => { setActiveTab(1) }}
                  >
                    <span className="fontsubtitle font-weight-bold">Unpaid</span>
                  </div>
                </div>
                <div className="table-responsive project-table">
                  <table className="table align-middle text-nowrap mb-0">
                    <tbody className="border-top">
                      {invoiceData.map((item, index) => {
                        const isLastRow = index === invoiceData.length - 1 ? 'border-0' : '';
                        return (
                          <tr key={index}>
                            <td className={`align-content-center ${isLastRow}`}>
                              <p className="mb-0 fs-3">{index + 1}</p>
                            </td>
                            <td className={`align-content-center ps-0 py-1 ${isLastRow}`}>
                              <div className="d-flex align-items-center">
                                <div className="me-2 pe-1">
                                  <img
                                    src={Imagesource(item?.userimg)}
                                    onError={handleImageError}
                                    className="rounded-circle"
                                    width={40}
                                    height={40}
                                    alt=""
                                  />
                                </div>
                                <div>
                                  <p className="fw-semibold mb-1 text-14">{item.name}</p>
                                  <p className="mb-0 fs-3 text-muted text-12">{item.industry}</p>
                                </div>
                              </div>
                            </td>
                            <td className={`align-content-center ${isLastRow}`}>
                              <div>
                                <p className="fw-semibold text-color-primary mb-1 text-14">{item.invoiceid}</p>
                                <p className="mb-0 fs-3 text-muted text-12">{item.date}</p>
                              </div>
                            </td>
                            <td className={`align-content-center ${isLastRow}`}>
                              <div>
                                <p className="fw-semibold text-color-primary mb-1 text-14   ">{item.cost}</p>
                                <p className="mb-0 fs-3 text-muted text-12">{item.cost_date}</p>
                              </div>
                            </td>
                            <td className={`align-content-center ${isLastRow}`}>
                              <div
                                className="px-1 py-1 rounded text-center text-12"
                                style={{
                                  background: "rgb(205, 255, 232)",
                                  color: "rgb(86, 224, 161)"
                                }}
                              >
                                You
                              </div>
                            </td>
                            <td className={`align-content-center text-end ${isLastRow}`}>
                              <div className="d-flex flex-column flex-lg-row justify-content-center">
                                <button
                                  className="btn py-1 fontsubtitle font-weight-bold text-white mx-1"
                                  style={{ background: "rgb(69, 53, 193)" }}
                                >
                                  View
                                </button>
                                <div
                                  className="btn py-1 fontsubtitle font-weight-bold text-white mx-1"
                                  style={{ background: "rgb(17, 151, 148)" }}
                                  onClick={() => setModal(true)}
                                >
                                  Pay
                                </div>
                                <button
                                  className="btn btn-outline-green py-1 mx-1"
                                >
                                  Edit
                                </button>
                              </div>
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
      <div style={{ display: viewModal ? "block" : "none" }}>
        <PayPalModal />
      </div>

      <InvoiceModal
        ModalView={ModalView}
        setModalView={setModalView}
        invoiceData={ShareInvoiceData}
        setInvoiceData={setShareInvoiceData}
        TabInvoice={TabInvoice}
        setTabInvoice={setTabInvoice}
        HandleShareInvoice={HandleShareInvoice}
        updateShareInvoiceData={updateShareInvoiceData}
        ProjectData={projectdata}
        ClientData={clientData}
        onSelectProject={onSelectProject}
      />
    </div>
  )
}

export default Invoice
