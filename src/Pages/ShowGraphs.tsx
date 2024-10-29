import { type Event, dynamoClient } from "src/services/dynamoClient";
import LineChart, { transformData } from "src/Components/LineChart";
import React, { useEffect, useState } from "react";

function ShowGraphs(): React.JSX.Element {
    const [exercises, setExercises] = useState<Event[]>([]);
    const [biometrics, setBiometrics] = useState<Event[]>([]);

    useEffect(() => {
        dynamoClient.get("healthpoint-exercise").then((events) => {
            setExercises(events);
        }).catch(e => console.error(e));
        dynamoClient.get("healthpoint-biometrics").then((events) => {
            setBiometrics(events);
        }).catch(e => console.error(e));
    }, []);

    return (
        <div id="graphs">
            <div className="canvas-container">
                { exercises.length > 0 ? 
                    <LineChart data={transformData(exercises, "exercise", "5km")} name="5km Run (mins)" />
                    : "Loading..."}
            </div>
            <div className="canvas-container">
                { biometrics.length > 0 ? 
                    <LineChart data={transformData(biometrics, "type", "weight")} name="Body Weight (kg)" />
                    : "Loading..."}
            </div>
        </div>
    );
}

export default ShowGraphs;
