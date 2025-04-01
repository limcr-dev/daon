import { useEffect, useState } from "react";
import Loading from './loading';

function Weather_more() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("http://127.0.0.1:5000/crawl")
            .then((res) => res.json())
            .then((data) => {
                setTimeout(() => {
                    console.log('데이터 :', data)
                    setData(data.weather);
                    setLoading(false);
                }, 2000);
            })
            .catch((err) => {
                console.error(err);
                setTimeout(() => setLoading(false), 2000);
            });
    }, []);

    const weatherIcons = {
        "맑음": process.env.PUBLIC_URL + "/image/weather/sunny.png",
        "흐림": process.env.PUBLIC_URL + "/image/weather/cloudy.png",
        "구름많음": process.env.PUBLIC_URL + "/image/weather/many_cloudy.png",
        "비": process.env.PUBLIC_URL + "/image/weather/rainy.png",
        "눈": process.env.PUBLIC_URL + "/image/weather/snowy.png",
        "구름많고 한때 비": process.env.PUBLIC_URL + "/image/weather/cloudy_and_rainy.png",
        "흐리고 비": process.env.PUBLIC_URL + "/image/weather/cloudy_and_rainy.png"
    };

    return (
        <div>
            {loading ? <Loading /> : (
                data ? (
                    <div>
                        <p>📍 위치: {data.location}</p>
                        <p>🌡 온도: {data.temperature}</p>
                        <p>⛅ 날씨: {data.weather_status}</p>
                        <p style={{fontSize:'12px'}}>{data.comparison}</p>
                        <p>💨 공기질: {data.air_quality.join(" | ").slice(0,-20)}</p>
                    </div>
                ) : <p>데이터 없음</p>
            )}
        </div>
    );
}

export default Weather_more;

