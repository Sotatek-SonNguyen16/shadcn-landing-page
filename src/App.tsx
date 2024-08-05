import "./App.css";
import {RouterProvider} from "react-router-dom";
import {router} from "@/Router.tsx";
import {Suspense} from "react";
import PageSkeleton from "@/components/PageSkeleton.tsx";

function App() {
    return (
        <Suspense fallback={<PageSkeleton/>}>
            <RouterProvider router={router}/>
        </Suspense>
    );
}

export default App;
