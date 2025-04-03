import { useEffect, useState } from "react";
import Loading from './loading';

function News_more() {

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("http://127.0.0.1:5000/crawl")
            .then((res) => res.json())
            .then((data) => {
                setTimeout(() => {
                    console.log('데이터 :', data)
                    setData(data);
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
                data.length > 0 ? (
                    <ul>
                        {data.map((item, index) => {
                            const showCategory = index === 0 || item.rankingnews_name !== data[index - 1].rankingnews_name;

                            return (
                                <li key={index}>
                                    {showCategory && <strong>{item.rankingnews_name}</strong>}
                                    <p>{item.rank}. <a href={item.url} target="_blank" rel="noopener noreferrer">{item.title}</a></p>
                                </li>
                            );
                        })}
                    </ul>
                ) : <p>데이터 없음</p>
            )}
        </div>
    );
}

export default News_more;