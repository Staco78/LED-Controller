import React, { useState } from "react";
import Data from "./data";
import Home from "./home";
import Panel from "./panel";

export default function App() {
    const [page, setPage] = useState(0);
    const [port, setPort] = useState(null as any);

    switch (page) {
        case 0:
            return (
                <Home
                    setPort={p => {
                        Data.setPort(p);
                        setPort(p);
                        setPage(1);
                    }}
                />
            );

        case 1:
            return <Panel port={port} onclose={() => setPage(0)} />;

        default:
            return <p>Error page not found</p>;
    }
}
