import { HashRouter as Router, Route, Routes } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import { useState } from "react";
import Sidebar from "./scenes/global/Sidebar";
import LoginForm from "./scenes/login/NewLogin";
import ActiveTabList from "./scenes/ActiveTab";
import Topbar from "./scenes/global/Topbar";
import { ColorContext } from "./scenes/global/context/ColorContext";
import secureLocalStorage from "react-secure-storage";
import { PermissionContext } from "./scenes/global/context/PermissionContext.js";
import { ToastContainer } from "react-toastify";

import ScrollToTop from "./components/ScrollTop.js";
import useIdleLogout from "./utils/useIdleLogout.js";

function App({ isCollapsed }) {
  const [theme, colorMode] = useMode();
  const [color, setColor] = useState("#CA8717");
  const [permissions, setPermissions] = useState({});
  const handleLogout = () => {
    // localStorage.removeItem("userName");
    secureLocalStorage.clear();
    sessionStorage.clear();
    window.location.href = "/";
  };

  const isLoggedIn = !!sessionStorage.getItem("sessionId");
  useIdleLogout(handleLogout, isLoggedIn);

  return (
    <>
      <Router>
        <ColorModeContext.Provider value={colorMode}>
          <ColorContext.Provider value={{ color, setColor }}>
            {/* <PermissionContext.Provider value={{ permissions, setPermissions }}> */}
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <Routes>
                <Route path="/" element={<LoginForm />} />
                <Route
                  path="/*"
                  element={
                    <div>
                      <Topbar onLogout={handleLogout} />
                      <div className="flex">
                        <div
                          // className="flex float-left h-full side-bar w-auto"
                          style={{
                            width: isCollapsed ? "60px" : "200px",
                            marginTop: "60px",
                            height: "calc(100vh - 60px)",
                            position: "fixed",
                            left: 0,
                            top: 0,
                          }}
                        >
                          <Sidebar />
                        </div>
                        <div
                          className="bg-gray-200 active-tab-container"
                          style={{
                            marginLeft: isCollapsed ? "60px" : "200px",

                            height: "calc(100vh - 60px)",
                            overflowY: "auto",
                            flexGrow: 1,
                            width: "100%",
                          }}
                        >
                          <ActiveTabList />
                        </div>
                      </div>
                    </div>
                  }
                />
              </Routes>
            </ThemeProvider>
            {/* </PermissionContext.Provider> */}
          </ColorContext.Provider>
        </ColorModeContext.Provider>
      </Router>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
