import React, { useEffect, useRef } from "react";
// import { dynamoClient } from "services/dynamoClient";
import { BrowserMultiFormatReader } from "@zxing/browser";

function AddCalories(): React.JSX.Element {
    const videoRef = useRef<HTMLVideoElement>(null);
    const resultRef = useRef<HTMLDivElement>(null);
    const codeReader = new BrowserMultiFormatReader();

    useEffect((): void => {
        console.log("VERSION?");
        BrowserMultiFormatReader.listVideoInputDevices().then((videoInputDevices): void => {
            const device = videoInputDevices[1].deviceId;
            codeReader.decodeFromVideoDevice(device, "video", (result, error) => {
                console.log(resultRef);
                if (result && resultRef.current) {
                    resultRef.current.innerText = result.toString();
                }
                if (error && resultRef.current) {
                    resultRef.current.innerText = error.message;
                }
                console.log(result);
            }).catch((e: Error) => {
                if (resultRef.current) {
                    resultRef.current.innerText = e.message;
                }
            });
        }).catch((e: Error) => {
            if (resultRef.current) {
                resultRef.current.innerText = e.message;
            }
        });

    });


    return (
        <div>
            <video id="video" ref={videoRef} style={{ width: "50px", height: "50px" }} />
            <div ref={resultRef} />
            <pre><code id="result" /></pre>
        </div>
    );
    
}

export default AddCalories;
