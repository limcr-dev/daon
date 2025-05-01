import { useEffect, useState } from "react";
import Loading from './loading';
import './css/news.css'; // 🔥 스타일 따로 빼줄거야!

function News_more() {

	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetch("/crawl")
			.then((res) => res.json())
			.then((data) => {
				if (data && Array.isArray(data.news)) {
				  setData(data);
				} else {
				  setData({ news: [] }); // 안전하게 초기화
				}
				setLoading(false);
			  })
			.catch((err) => {
				console.error(err);
				setData({ news: [] });
				setLoading(false);
			});
	}, []);

	return (
		<div className="news-container">
			{loading ? (
				<Loading />
			) : (
				data && data.news && data.news.length > 0 ? (
					<div>
						{(data.news || []).reduce((acc, item, index, arr) => {
							const prev = arr[index - 1];
							const isNewCategory = index === 0 || item.rankingnews_name !== prev.rankingnews_name;

							if (isNewCategory) {
								acc.push(
									<h3 key={`category-${index}`} className="news-category">
										{item.rankingnews_name}
									</h3>
								);
							}

							acc.push(
								<div key={index} className="news-item">
									{item.rank}. <a href={item.url} target="_blank" rel="noopener noreferrer">{item.title}</a>
								</div>
							);

							return acc;
						}, [])}
					</div>
				) : (
					<p>데이터 없음</p>
				)
			)}
		</div>
	);
}

export default News_more;
