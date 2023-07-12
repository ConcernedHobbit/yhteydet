import React from "react";
import ReactDOM from "react-dom/client";
import Freeplay from "./Freeplay";
import "./index.css";
import { RouterProvider, createBrowserRouter, Link } from "react-router-dom";
import Daily from "./Daily";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Daily />,
    errorElement: (
      <>
        <h1 style={{ marginBlock: "1rem" }}>Tapahtui virhe.</h1>
        <div style={{ display: "flex", gap: "1rem" }}>
          <Link to="/">
            <button>Päivän yhteydet</button>
          </Link>
          <Link to="/vapaapeli">
            <button>Vapaapeli</button>
          </Link>
        </div>
      </>
    ),
  },
  {
    path: "/vapaapeli",
    element: <Freeplay />,
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
