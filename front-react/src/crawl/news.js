import { useEffect, useState } from "react";
import Loading from './loading';
import './css/news.css'; // 같은 스타일 사용

function News() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/crawl")
      .then((res) => res.json())
      .then((data) => {
        console.log('데이터 :', data.news);
        setData(data.news || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <Loading />;

  const firstCategory = data.length > 0 ? data[0].rankingnews_name : "뉴스";

  return (
    <div style={{ padding: '10px' }}>
      <div style={{ fontWeight: 'bold', marginBottom: '10px', borderBottom: '2px solid #3498db', paddingBottom: '5px', fontSize: '16px' }}>
        {firstCategory}
      </div>
      {data.slice(0, 5).map((item, index) => (
        <div key={index} style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span style={{ fontWeight: '600', fontSize: '14px' }}>{index + 1}.</span>
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              textDecoration: 'none',
              color: '#2980b9',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '400px',
              fontSize: '14px'
            }}
          >
            {item.title}
          </a>
        </div>
      ))}
    </div>
  );
}

export default News;
