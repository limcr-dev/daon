from flask import Flask, jsonify
import requests
from bs4 import BeautifulSoup
from flask_cors import CORS, cross_origin

app = Flask(__name__)
CORS(app)

# cors = CORS(app, resources={r"/*": {"origins": "*"}})

@app.route('/crawl')
@cross_origin()
def crawl():
    weather_url = 'https://search.naver.com/search.naver?query=날씨'
    news_url = 'https://news.naver.com/main/ranking/popularDay.naver'
    headers = {"User-Agent": "Mozilla/5.0"}
    # {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36'}

    # 날씨
    weather_html = requests.get(weather_url, headers=headers)
    weather_soup = BeautifulSoup(weather_html.text, 'html.parser')

    # 위치
    address_element = weather_soup.find('div', {'class': 'title_area _area_panel'})
    address = address_element.find('h2', {'class': 'title'}).text if address_element else "알 수 없음"

    # 현재 온도
    temperature_element = weather_soup.find('div', {'class': 'temperature_text'})
    temperature = temperature_element.text.strip()[5:] if temperature_element else "N/A"

    # 어제
    temperature_info = weather_soup.find('div', {'class': 'temperature_info'})
    comparison = temperature_info.text if temperature_info else "N/A"

    # 날씨 상태
    weather_status_element = weather_soup.find('span', {'class': 'weather before_slash'})
    weather_status = weather_status_element.text if weather_status_element else "N/A"

    # 공기 상태
    air_quality = []
    air_element = weather_soup.find('ul', {'class': 'today_chart_list'})
    if air_element:
        info = air_element.find_all('li', {'class': 'item_today'})
        air_quality = [i.text.strip() for i in info]

    # 주간 날씨
    weekly_forecast = []
    weekly_weather = weather_soup.find("ul", {"class": "week_list"})
    if weekly_weather:
        week_items = weekly_weather.find_all("li", {"class": "week_item"})
        weekly_forecast = [item.text.strip() for item in week_items]

    # 뉴스
    news_html = requests.get(news_url, headers=headers)
    news_soup = BeautifulSoup(news_html.text, 'html.parser')

    rankingnews_boxs = news_soup.select(
        '#wrap > div.rankingnews._popularWelBase._persist > div.rankingnews_box_wrap._popularRanking > div > div')

    news_list = []

    for box in rankingnews_boxs:
        rankingnews_name = box.select_one('a > strong').text if box.select_one('a > strong') else "알 수 없음"
        rankingnews_lists = box.select('ul > li')

        for list in rankingnews_lists:
            rank = list.select_one('em').text if list.select_one('em') else "N/A"
            title = list.select_one('div > a').text if list.select_one('div > a') else "제목 없음"
            url = list.select_one('div > a')['href'] if list.select_one('div > a') else "#"

            news_list.append({
                'rankingnews_name': rankingnews_name,
                'rank': rank,
                'title': title,
                'url': url
            })

    # JSON 형태로 반환
    return jsonify({
        # 날씨
        'weather': {
            "location": address,
            "temperature": temperature,
            "weather_status": weather_status,
            "air_quality": air_quality,
            "comparison": comparison,
            "weekly": weekly_forecast
        },
        'news': news_list
    })

if __name__ == '__main__':
    app.run(debug=True)

