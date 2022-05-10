import { SerialPort } from "serialport";
import React from "react";
import Data from "./data";

export default function Panel(props: { port: SerialPort; onclose: () => void }) {
    const [color, setColor] = React.useState("#FFFFFF");

    return (
        <div>
            <h1>Panel</h1>

            <div>
                <input
                    type="color"
                    value={color}
                    onInput={e => {
                        Data.setColor((e as any).target.value);
                        setColor((e as any).target.value);
                    }}
                />
            </div>

            <input
                type="button"
                value="Disconnect"
                onClick={() =>
                    props.port.close(e => {
                        if (e) console.error(e);
                        props.onclose();
                    })
                }
            />
        </div>
    );
}
