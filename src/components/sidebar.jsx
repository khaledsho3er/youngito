import React, { useState } from "react";

import {
  IoHomeOutline,
  IoMail,
  IoSettingsOutline,
  IoMenu,
  IoCloseSharp,
} from "react-icons/io5";
import { FaRegUser } from "react-icons/fa";
import { SlCalender } from "react-icons/sl";
import TaskCalendar from "../Pages/calender";
const CollapsibleSidebar = () => {
  const [expanded, setExpanded] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [selectedComponent, setSelectedComponent] = useState("Home"); // Track selected section

  // Sample menu items - replace with your own icons as needed
  const menuItems = [
    { icon: <IoHomeOutline size={20} />, label: "Home", key: "Home" },
    { icon: <FaRegUser size={20} />, label: "Profile", key: "Profile" },
    { icon: <SlCalender size={20} />, label: "Calendar", key: "Calendar" },
    { icon: <IoMail size={20} />, label: "Messages", key: "Messages" },
    {
      icon: <IoSettingsOutline size={20} />,
      label: "Settings",
      key: "Settings",
    },
  ];

  return (
    <div className="container">
      <div
        className={`sidebar ${
          expanded ? "sidebar-expanded" : "sidebar-collapsed"
        }`}
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
      >
        <div className="header">
          <span className={expanded ? "title" : "hidden"}>Menu</span>
          <button className="menu-button">
            {expanded ? <IoCloseSharp size={20} /> : <IoMenu size={20} />}
          </button>
        </div>

        <nav className="nav">
          <ul className="menu-list">
            {menuItems.map((item, index) => (
              <li key={index} className="menu-item">
                <button
                  style={{
                    backgroundColor: "transparent",
                  }}
                  className={`menu-link ${
                    hoveredItem === index ? "menu-link-hover" : ""
                  }`}
                  onClick={() => setSelectedComponent(item.key)} // Change selected component
                  onMouseEnter={() => setHoveredItem(index)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <div className="icon-container">{item.icon}</div>
                  <span
                    className={`${
                      expanded ? "icon-label visible" : "icon-label hidden"
                    }`}
                  >
                    {item.label}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="main-content">
        {selectedComponent === "Calendar" ? (
          <TaskCalendar />
        ) : (
          <div>
            <h1 className="main-title">{selectedComponent}</h1>
            <p>Your page content goes here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollapsibleSidebar;
