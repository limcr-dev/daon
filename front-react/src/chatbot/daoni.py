# 필요한 라이브러리
import pandas as pd
import google.generativeai as genai
import streamlit as st
import requests
from google.generativeai.types import GenerationConfig
from fuzzywuzzy import process
from io import StringIO
from datetime import datetime  # 추가: 날짜/시간 가져오기
from urllib.parse import urlencode

# --- 기본 설정 ---

# Gemini API 키 불러오기
with open('daon_new.txt', 'r', encoding='utf-8') as f:
    gemini_key = f.read().strip()

# 네이버 뉴스 검색 API 키
NAVER_CLIENT_ID = "jzvU2UYK2Gafst3U9KLp"
NAVER_CLIENT_SECRET = "DEoJU1yopL"

# CSV 파일 경로
file_path = "daon_guide.csv"

# Streamlit 기본 세팅
st.title("Daon 그룹웨어 챗봇 - 다오니")

# CSV 데이터 읽어오기
data = pd.read_csv(file_path, encoding='utf-8-sig')
data.columns = data.columns.str.strip()

# Gemini 설정
genai.configure(api_key=gemini_key)

@st.cache_resource
def load_model():
    model = genai.GenerativeModel(
        model_name='gemini-1.5-flash',
        generation_config=GenerationConfig(
            max_output_tokens=1000,
            temperature=0.5
        )
    )
    return model

model = load_model()

# CSV 데이터 필터링
info_show = data[data["공개"] == "Y"]

info = []
for index, row in info_show.iterrows():
    info.append({
        "subject": row["항목"],
        "answer": row["내용"]
    })

# --- 기능 함수들 ---

# CSV 질문 유사도 검색
def get_response_from_csv(prompt, info_list, threshold=70):
    subjects = [item["subject"] for item in info_list]
    match, score = process.extractOne(prompt, subjects)
    if score >= threshold:
        for item in info_list:
            if item["subject"] == match:
                return item["answer"]
    return None

# 뉴스 질문 판별
def is_news_question(prompt):
    keywords = ["뉴스", "기사", "보도", "속보"]
    return any(word in prompt for word in keywords)

# 네이버 뉴스 검색
def search_news_online(prompt, client_id, client_secret):
    headers = {
        "X-Naver-Client-Id": client_id,
        "X-Naver-Client-Secret": client_secret
    }
    params = {
        "query": prompt,
        "display": 5
    }
    url = "https://openapi.naver.com/v1/search/news.json?" + urlencode(params)  # <-- 직접 조합!
    response = requests.get(url, headers=headers)

    if response.status_code == 200:
        news_items = response.json().get('items', [])
        results = ""
        for item in news_items:
            title = item["title"].replace("<b>", "").replace("</b>", "")
            link = item["link"]
            results += f"- [{title}]({link})\n"
        return results if results else "관련 뉴스를 찾을 수 없습니다."
    else:
        return f"뉴스 검색 실패! 상태 코드: {response.status_code}"



# 최종 응답 처리
def get_chatbot_response(prompt, info_list, model, chat_session, client_id, client_secret):
    csv_answer = get_response_from_csv(prompt, info_list)
    if csv_answer:
        return csv_answer

    if is_news_question(prompt):
        return search_news_online(prompt, client_id, client_secret)

    response = chat_session.send_message(prompt)
    return response.text

# 대화 기록 txt 저장용 함수
def save_chat_history_as_txt(chat_history):
    output = StringIO()
    for chat in chat_history:
        output.write(f"User: {chat['user']}\n")
        output.write(f"Bot: {chat['bot']}\n")
        output.write("-" * 40 + "\n")
    return output.getvalue()  # StringIO → 문자열로 변환

# --- Streamlit 챗봇 동작 ---

# 챗 세션 관리
if "chat_session" not in st.session_state:
    st.session_state["chat_session"] = model.start_chat(history=[])

# 대화 기록 세션 관리
if "chat_history" not in st.session_state:
    st.session_state["chat_history"] = []

# 채팅 입력 처리
if prompt := st.chat_input("다오니 챗봇입니다. 무엇을 도와드릴까요? :"):
    with st.chat_message("user"):
        st.markdown(prompt)
    
    with st.chat_message("ai"):
        message_placeholder = st.empty()
        full_response = ""

        with st.spinner("메시지 답변 처리 중 입니다."):
            answer = get_chatbot_response(
                prompt,
                info,
                model,
                st.session_state.chat_session,
                NAVER_CLIENT_ID,
                NAVER_CLIENT_SECRET
            )
            message_placeholder.markdown(answer)

        # 대화 기록 저장
        st.session_state.chat_history.append({
            "user": prompt,
            "bot": answer
        })

# --- 대화 기록 다운로드 버튼 ---

if st.session_state.chat_history:
    chat_txt_file = save_chat_history_as_txt(st.session_state.chat_history)

    # 현재 날짜와 시간 가져오기
    now = datetime.now()
    timestamp = now.strftime("%Y%m%d_%H%M")  # "20250419_1530" 포맷

    st.download_button(
        label="📝 대화 기록 다운로드 (txt)",
        data=chat_txt_file,
        file_name=f"chat_history_{timestamp}.txt",  # 날짜+시간 넣기!
        mime="text/plain"
    )
