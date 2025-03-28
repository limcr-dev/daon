import { useEffect } from "react";

const Test = () => {

    useEffect(() => {
        fetch("http://localhost:8081/", {
            method: "GET"
        })
        .then(res => res.json() // 응답이 오면 javascript object로 바꾸겠다.
        )
        .then(data => {
            console.log("응답", data);
        }

        )

    }, []);
        return (
            <div>

            </div>
        )
    }
export default Test;