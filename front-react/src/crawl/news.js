import { useEffect, useState } from "react";
import Loading from './loading';

function News() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("http://127.0.0.1:5000/crawl")
            .then((res) => res.json())
            .then((data) => {
                setTimeout(() => {
                    console.log('데이터 :', data.news)
                    setData(data.news);
                    setLoading(false);
                }, 2000);
            })
            .catch((err) => {
                console.error(err);
                setTimeout(() => setLoading(false), 2000);
            });
    }, []);

    return (
        <div>
            {loading ? <Loading /> : (
                data && data.length > 0 ? (
                    (() => {
                        const firstCategory = data[0]?.rankingnews_name || "뉴스";
                        const newsList = data.filter(item => item.rankingnews_name === firstCategory).slice(0, 3);

                        return (
                            <div>
                                <strong>[{firstCategory}]</strong>
                                <ul>
                                    {newsList.map((item, index) => (
                                        <li key={index}>
                                            {index + 1}. <a href={item.url} target="_blank" rel="noopener noreferrer">{item.title}</a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        );
                    })()
                ) : <p>데이터 없음</p>
            )}
        </div>
    );
}

export default News;