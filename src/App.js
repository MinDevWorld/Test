import './App.css';
import { parseJsonData } from './utils/jsonParser';
import PageContent from './components/PageContent';
// import pageDataRaw from './data/2A_21a.json';
// import pageDataRaw from './data/B_1a.json';
// import pageDataRaw from './data/3A_2a.json';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useSearchParams } from 'react-router-dom';
import axios from 'axios';

/* 
  npm install axios 
  npm install react-router-dom
*/

// getResizeEventListener 함수 정의
export const getResizeEventListener = (standardWidth, standardHeight) => {
  return () => {
    const root = document.querySelector("#root");
    const app = document.querySelector("#App");

    if (!app) return;

    // 원하는 해상도로 width, height 고정
    app.style.width = `${standardWidth}px`;
    app.style.height = `${standardHeight}px`;

    let width = root.clientWidth;
    let height = width * (standardHeight / standardWidth);
    
    // style.zoom을 이용하여, 화면을 크기를 조정
    app.style.zoom = height / standardHeight;

    // app.style.transform = `scale(${height / standardHeight})`;
    // app.style.transformOrigin = '50 50'; // Scale from the top-left corner

    if (height > root.clientHeight) {
      height = root.clientHeight;
      width = height * (standardWidth / standardHeight);
      
      // style.zoom을 이용하여, 화면을 크기를 조정
      app.style.zoom = width / standardWidth;
      // app.style.transform = `scale(${width / standardWidth})`;
    }
  };
};


function App() {
  const [searchParams] = useSearchParams();
  const [pageData, setPageData] = useState(null);

  const sub = searchParams.get('sub') || 'chinese';
  const step = searchParams.get('step') || 'B';
  const set = searchParams.get('set') || '001';

  console.log(sub, step, set);
  
  useEffect(() => {
    const url = `/resource/${sub}/${step}/${set}/bookInfo.json`;
    axios.get(url)
      .then(response => {
        const jsonData = parseJsonData(response.data);
        setPageData(jsonData);
      })
      .catch(error => console.error("Error loading JSON data:", error));
  }, [sub, step, set]);


  // useEffect(() => {
  //   // // 실제 환경에서는 API 호출 등을 통해 데이터를 가져올 수 있습니다.
  //   // // 여기서는 예시로 JSON 데이터를 직접 사용합니다.
  //   // const jsonData = parseJsonData(pageDataRaw);
  //   // setPageData(jsonData);


  //   // JSON 데이터 불러오기
  //   axios.get('/resource/chinese/B/001/bookInfo.json')
  //   .then(response => {
  //     const jsonData = parseJsonData(response.data);
  //     setPageData(jsonData);

  //   })
  //   .catch(error => console.error("Error loading JSON data:", error));
  // }, []);


  useEffect(() => {
    const resizeListener = getResizeEventListener(1200, 2000);

    if (pageData) {
      window.addEventListener('resize', resizeListener);
      resizeListener();
    }

    return () => {
      window.removeEventListener('resize', resizeListener);
    };
  }, [pageData]);

  if (!pageData) return <div>Loading...</div>;

  return (
    <div id="App" className='app-container'>
      <PageContent pageData={pageData} sub={sub} step={step} set={set} />
    </div>
  );
}

function AppWrapper() {
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <Routes>
        <Route path="/" element={<App />} />
      </Routes>
    </Router>
  );
}

export default AppWrapper;
// export default App;
