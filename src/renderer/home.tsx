import React, { useState } from "react";
import { SerialPort } from "serialport";
import { PortInfo } from "@serialport/bindings-interface";
import css from "@/assets/style/home.module.css";

function Port(props: { port: PortInfo; onclick: () => void }) {
    return <input type="button" value={(props.port as any).friendlyName ?? props.port.path} onClick={props.onclick} />;
}

export default function Home(props: { setPort: (port: SerialPort) => void }) {
    const [ports, setPorts] = useState([] as PortInfo[]);
    const [showMore, setShowMore] = useState(false);
    SerialPort.list().then(setPorts);
    return (
        <>
            <div className={css.container}>
                {ports.map(port => {
                    if (/arduino/i.test(port.manufacturer ?? "") || showMore)
                        return (
                            <Port
                                key={port.path}
                                port={port}
                                onclick={() => {
                                    const p = new SerialPort({ path: port.path, baudRate: 9600, autoOpen: false });
                                    p.open(e => {
                                        if (e) console.error(e);
                                        else props.setPort(p);
                                    });
                                }}
                            />
                        );
                })}
            </div>
            <input type="button" value={showMore ? "Show less" : "Show more"} onClick={() => setShowMore(!showMore)} />
        </>
    );
}
