import React, { useCallback } from "react";
import { Modal } from "react-bootstrap";
import "./../../../screens/Function/style/Modal.css";

const SelectStyle = {
  outline: "none",
  padding: "3px 3px",
  border: "none",
  borderBottom: "1px solid gray",
}
const InvoiceModal = ({
  ModalView,
  setModalView,
  invoiceData,
  setInvoiceData,
  TabInvoice,
  setTabInvoice,
  HandleShareInvoice,
  ProjectData,
  ClientData,
  onSelectProject,
}) => {
  const path = window.location.pathname;

  const formatDate = useCallback((date, format) => {
    const map = {
      MM: ("0" + (date.getMonth() + 1)).slice(-2),
      DD: ("0" + date.getDate()).slice(-2),
      YYYY: date.getFullYear()
    };
    return format.replace(/MM|DD|YYYY/gi, matched => map[matched]);
  }, []);

  const AddItemInvoice = useCallback(
    () => {
      setTabInvoice(prevTabInvoice => [
        ...prevTabInvoice,
        {
          id: Date.now(),
          product: "",
          quantity: "",
          amount: ""
        }
      ]);
    },
    [setTabInvoice]
  );

  const handleinputs = useCallback(
    (e, index) => {
      const { name, value } = e.target;
      setTabInvoice(prevTabInvoice => {
        const newTabInvoice = [...prevTabInvoice];
        newTabInvoice[index] = {
          ...newTabInvoice[index],
          [name]: value
        };
        return newTabInvoice;
      });
    },
    [setTabInvoice]
  );

  const handletax = useCallback(
    e => {
      const { name, value } = e.target;
      const percentageValue = parseFloat(value) / 100 * invoiceData.amount;
      if (name === "CS_tax") {
        setInvoiceData({ ...invoiceData, csFee: percentageValue.toFixed(2) });
      } else if (name === "tax") {
        setInvoiceData({ ...invoiceData, tax: percentageValue.toFixed(2) });
      }
    },
    [invoiceData, setInvoiceData]
  );

  const RemoveItemInvoice = useCallback(
    id => {
      setTabInvoice(prevTabInvoice =>
        prevTabInvoice.filter(item => item.id !== id)
      );
    },
    [setTabInvoice]
  );

  return (
    <Modal show={ModalView} className="modelfilter modal-xl h-auto" size="sl">
      <Modal.Body style={{ overflowY: "scroll", height: "90vh" }}>
        <div className="d-flex justify-content-end">
          <span
            style={{ cursor: "pointer" }}
            onClick={() => setModalView(false)}
          >
            <i class="fa fa-times" aria-hidden="true" />
          </span>
        </div>

        <div className="d-flex justify-content-between align-items-center px-3">
          <div className="d-flex flex-column align-items-start row-gap-05">
            <img
              src={"/images/icons/smalllogo.png"}
              alt="Logo"
              style={{ width: "100px" }}
            />
          </div>
          <div className="d-flex flex-column align-items-end row-gap-05">
            <h4 className="font-weight-bold" style={{ color: "#4535C1" }}>
              INVOICE
            </h4>
            <span className="fontcontent1 font-weight-bold">
              {invoiceData.invoiceNo}
            </span>
            <span className="fontcontent1 font-weight-bold">
              {invoiceData.transactionNo}
            </span>
            <span className="fontcontent1 font-weight-bold">
              Date: {formatDate(new Date(), "DD/MM/YYYY")}
            </span>
          </div>
        </div>

        <div className="container mt-4 text-justify">
          <span className="fontcontent1 font-weight-bold">
            This invoice is raised for the project work undertaken...
          </span>
        </div>

        <div className="container-fluid mt-3">
          <table className="table">
            <thead>
              <tr className="text-center">
                <th scope="col" className="d-none d-md-block d-lg-block">
                  S.No
                </th>
                <th scope="col">Product</th>
                <th scope="col">Quantity</th>
                <th scope="col" className="w-25">
                  Amount
                </th>
                <th scope="col" onClick={AddItemInvoice}>
                  <img
                    src={"/images/icons/add (7) 1.png"}
                    alt="Add"
                    style={{ cursor: "pointer" }}
                    width={20}
                  />
                </th>
              </tr>
            </thead>
            <tbody>
              {TabInvoice.map((item, index) =>
                <tr key={item.id} className="text-center">
                  <th
                    scope="row"
                    className="fontcontent1 d-none d-md-block d-lg-block"
                  >
                    {index + 1}
                  </th>
                  <td>
                    <input
                      type="text"
                      name="product"
                      value={item.product}
                      className="inputwidth"
                      onChange={e => handleinputs(e, index)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="quantity"
                      className="inputwidth"
                      value={item.quantity}
                      onChange={e => handleinputs(e, index)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="amount"
                      className="inputwidth"
                      value={item.amount}
                      onChange={e => handleinputs(e, index)}
                    />
                  </td>
                  <td onClick={() => RemoveItemInvoice(item.id)}>
                    <img
                      src={"/images/icons/minus 1.png"}
                      alt="Remove"
                      style={{ cursor: "pointer" }}
                      width={20}
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="row justify-content-between">
            <div className="col-lg-5 col-5 d-flex flex-column align-items-start">
              <div className="d-flex justify-content-start align-items-end w-100 mt-3">
                <span className="fontcontent1 font-weight-bold w-20 text-right">
                  Project:
                </span>
                <select className="inputwidth w-30 ml-2" style={SelectStyle}
                  onChange={e => {
                    onSelectProject(e.target.value);
                    setInvoiceData({ ...invoiceData, projectId: e.target.value })
                  }}>
                  <option value="">Select Project</option>
                  {ProjectData.map(item =>
                    <option value={item.project_id}>
                      {item?.project?.title}
                    </option>
                  )}
                </select>
              </div>

              <div className="d-flex justify-content-start align-items-end w-100 mt-3">
                <span className="fontcontent1 font-weight-bold w-20 text-right">
                  Client:
                </span>
                <select className="inputwidth w-30 ml-2" style={SelectStyle}
                  onChange={e => {
                    setInvoiceData({ ...invoiceData, client_id: e.target.value })
                  }}>
                  <option value="">Select Client</option>
                  {ClientData.map(item =>
                    <option value={item.userdata._id}>
                      {item?.userdata?.first_name}
                    </option>
                  )}
                </select>
              </div>
            </div>
            <div className="col-lg-5 col-5 d-flex flex-column align-items-end">
              <div className="d-flex justify-content-end w-100 mt-3">
                <span className="fontcontent1 font-weight-bold w-50 text-right">
                  Total Amount:
                </span>
                <span
                  className="fontcontent1 font-weight-bold w-50"
                  style={{ color: "#4535C1" }}
                >
                  {invoiceData.amount}
                </span>
              </div>

              {path === "/notify" &&
                <div className="d-flex justify-content-end w-100 mt-3">
                  <span className="fontcontent1 font-weight-bold w-50 text-right">
                    Business partner:
                  </span>
                  <span
                    className="fontcontent1 font-weight-bold w-50"
                    style={{ color: "#4535C1" }}
                  >
                    200.00
                  </span>
                </div>}

              <div className="d-flex justify-content-end w-100 mt-3">
                <span className="fontcontent1 font-weight-bold w-50 text-right">
                  Connect Souq:
                </span>
                <input
                  type="number"
                  name="CS_tax"
                  className="w-25 pl-2 border-bottom"
                  onChange={handletax}
                  style={{ border: "none" }}
                />
                <span
                  className="fontcontent1 font-weight-bold w-50"
                  style={{ color: "#4535C1" }}
                >
                  {invoiceData.csFee}
                </span>
              </div>

              <div className="d-flex justify-content-end w-100 mt-3">
                <span className="fontcontent1 font-weight-bold w-50 text-right">
                  Tax:
                </span>
                <input
                  type="number"
                  name="tax"
                  className="w-25 pl-2 border-bottom"
                  onChange={handletax}
                  style={{ border: "none" }}
                />
                <span
                  className="fontcontent1 font-weight-bold w-50"
                  style={{ color: "#4535C1" }}
                >
                  {invoiceData.tax || 0.0}
                </span>
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-end mt-3">
            <button
              className="border-0 rounded text-white p-2 fontcontent1 font-weight-bold"
              style={{ background: "#4535C1" }}
              onClick={HandleShareInvoice}
            >
              Share Invoice
            </button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default InvoiceModal;
