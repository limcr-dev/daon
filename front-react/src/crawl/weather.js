import { useEffect, useState } from "react";
import Loading from './loading';
import './weather.css';

function Weather() {
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
        "흐림": process.env.PUBLIC_URL + "/image/weather/blur.png",
        "구름많음": process.env.PUBLIC_URL + "/image/weather/many_cloudy.png",
        "비": process.env.PUBLIC_URL + "/image/weather/rainy.png",
        "눈": process.env.PUBLIC_URL + "/image/weather/snowy.png",
        "구름많고 한때 비": process.env.PUBLIC_URL + "/image/weather/cloudy_and_rainy.png",
        "흐리고 비": process.env.PUBLIC_URL + "/image/weather/rainy.png"
    };

    const formatWeatherData = (text) => {
        // 날짜 추출
        const dateMatch = text.match(/^(.+?)\s+/);
        const date = dateMatch ? dateMatch[1] : "날짜 없음";

        // 앞에 날씨
        const morningMatch = text.match(/\d+%\s*(맑음|흐림|구름많음|비|눈|구름많고 한때 비|흐리고 비)/);  // 날씨 이미지가 많아서 추후 추가예정..
        const morningCondition = morningMatch ? morningMatch[1] : null;

        // 최저/최고 기온 추출
        const lowTempMatch = text.match(/최저기온(\d+°)/);
        const lowTemp = lowTempMatch ? lowTempMatch[1] : "N/A";

        const highTempMatch = text.match(/최고기온(\d+°)/);
        const highTemp = highTempMatch ? highTempMatch[1] : "N/A";

        return {
            date,
            morningIcon: morningCondition ? weatherIcons[morningCondition] : null,
            lowTemp,
            highTemp
        };
    };

    return (
        <div>
            {loading ? <Loading /> : (
                data ? (
                    <div>
                        <p>⛅ 위치: {data.location} </p>
                        <ul>
                            {data.weekly.map((item, index) => {
                                const formatted = formatWeatherData(item);
                                console.log("가공된 데이터:", formatted); 
                                console.log("원본 데이터:", item);
                                return (
                                    <li key={index} className="weather-item">
                                        <span className="date">{formatted.date}</span>
                                        <span className="temp-low"> 최저기온 {formatted.lowTemp} </span> /
                                        <span className="temp-high"> 최고기온 {formatted.highTemp} </span>
                                        {formatted.morningIcon !== null ? (
                                            <img src={formatted.morningIcon} alt="오전" className="weather-icon" />
                                        ) : (
                                            <span> ⛅ </span> 
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ) : <p>데이터 없음</p>
            )}
        </div>
    );
}

export default Weather;

