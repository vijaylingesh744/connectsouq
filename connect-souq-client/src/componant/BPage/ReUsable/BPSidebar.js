import React, { useState, useEffect } from 'react'
// import {CLIENT_URL} from '../../utils/ApiRoute'
import { useNavigate, useLocation } from 'react-router-dom'

function BPSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [User, setUser] = useState(JSON.parse(localStorage.getItem('User')))

  var BPList = [
    {
      name: "Dashboard",
      icon: "/bp-assets/images/logos/dashboard.png",
      href: '/bp/dashboard'
    },
    {
      name: "CS Vault",
      icon: '/bp-assets/images/logos/link2.png',
      href: "/bp/cs-vault"
    },
    {
      name: "Chat",
      icon: '/bp-assets/images/logos/Business CS.png',
      href: "/bp/chatgroup"
    },
    {
      name: "Projects",
      icon: '/bp-assets/images/logos/Business CS.png',
      href: "/bp/project-connection"
    },
    {
      name: 'Invoice',
      icon: '/bp-assets/images/logos/Transaction.png',
      href: '/bp/project-invoice'
    },
    {
      name: 'Transactions',
      icon: '/bp-assets/images/logos/Transaction.png',
      href: '/transaction'
    },
    {
      name: "Notifications",
      icon: '/bp-assets/images/logos/bell.png',
      href: "/bp/notification"
    },
  ];

  const SidebarItems = [
    {
      icon: "/images/icons/settings.png",
      name: "Account Setting",
      href: '#'
    },
  ];

  return (
    <>
      <aside className="left-sidebar with-vertical">
        <div className="brand-logo d-flex align-items-center justify-content-between">
          <a href="" className="text-nowrap logo-img">
            <img
              src="/bp-assets/images/logos/C_logo.png"
              className="dark-logo"
              alt="logo-dark"
              style={{ width: "60px", height: "36px" }}
            />
          </a>
          <a
            onClick={() => {
              const mainWrapper = document.getElementById("main-wrapper");
              if (mainWrapper && mainWrapper.classList.contains("show-sidebar")) {
                mainWrapper.classList.remove("show-sidebar");
              }
            }}
            href="javascript:void(0)"
            className="sidebartoggler ms-auto text-decoration-none fs-5 d-block d-xl-none">
            <i className="fa-times fas" />
          </a>
        </div>
        <nav className="sidebar-nav scroll-sidebar scrollerhide" >
          <ul id="sidebarnav">
            {BPList && BPList.map((item) => (
              <li className="sidebar-item" style={{ cursor: 'pointer' }}>
                <a className={`sidebar-link ${location.pathname === item.href ? "active" : "in-active"}`}
                  onClick={() => { window.location.href = item.href }} aria-expanded="false">
                  <span>
                    <img src={item.icon} width={"16px"} height={"16px"} />
                  </span>
                  <span className="hide-menu text-title text-14 font-weight-normal">{item.name}</span>
                </a>
              </li>
            ))}
            {SidebarItems.map((item, index) => (
              <li className="sidebar-item" key={index}>
                <a className="sidebar-link" href={item.href} aria-expanded="false">
                  <span style={{ width: "20px" }}>
                    <img src={item.icon} width={"20px"} height={"20px"} />
                  </span>
                  <span className="hide-menu text-title text-14 font-weight-normal">{item.name}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="fixed-profile p-3 mx-4 mb-2 rounded mt-3" style={{ background: '#4B38A7' }}>
          <div className="hstack gap-3">
            <div className="john-img">
              <img
                src="/bp-assets/images/profile/user-1.jpg"
                className="rounded-circle"
                width={40}
                height={40}
                alt=""
              />
            </div>
            <div className="john-title text-white">
              <h6 className="mb-0 fs-4 fw-semibold text-white">qcodesinfotech</h6>
              <span className="fs-2">Designer</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

export default BPSidebar
