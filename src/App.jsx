import { RouterProvider } from "react-router-dom";
import { router } from "./router";

function App() {
  // Test 1.0.5
  return <RouterProvider router={router}></RouterProvider>;
}

export default App;