import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import {ThemeProvider} from "@/components/theme-provider.tsx";
import "./index.css";
import '@radix-ui/themes/styles.css';
import {Provider} from "react-redux";
import store from "@/store";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <Provider store={store}>
        <ThemeProvider>
            <App/>
        </ThemeProvider>
    </Provider>
);
