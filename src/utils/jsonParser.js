// src/utils/jsonParser.js

/**
 * 전체 JSON 데이터를 파싱합니다.
 * @param {Object} jsonData - 원본 JSON 데이터
 * @returns {Object} 파싱된 데이터
 */
export const parseJsonData = (jsonData) => {
    return {
        pages: parsePages(jsonData.pageList),
        resources: parseResources(jsonData.resourceList)
    };
};
    
/**
 * 페이지 리스트를 파싱합니다.
 * @param {Array} pageList - 원본 페이지 리스트
 * @returns {Array} 파싱된 페이지 리스트
 */
const parsePages = (pageList) => {
    return pageList.map(page => ({
        pageImg: page.pageImageGuid,
        items: parsePageItems(page.pageItemList),
        scenarios: parseScenarios(page.scenarios),
        title_1: page.title_1,
        title_2: page.title_2,
        subtitle_1: page.subtitle_1,
        subtitle_2: page.subtitle_2,
        subtitle_head: page.subtitle_head
    }));
};
    
/**
 * 페이지 아이템들을 파싱합니다.
 * @param {Array} itemList - 원본 아이템 리스트
 * @returns {Array} 파싱된 아이템 리스트
 */
const parsePageItems = (itemList) => {
    return itemList.map(item => {
        switch (item.itemType) {
        case 'Sound':
            return parseSoundItem(item);
        case 'Focus':
            return parseFocusItem(item);
        case 'WriteArea':
            return parseWriteAreaItem(item);
        case 'Click':
            return parseClickItem(item);
        default:
            console.warn(`Unknown item type: ${item.itemType}`);
            return item;
        }
    });
};
    
/**
 * 사운드 아이템을 파싱합니다.
 * @param {Object} item - 사운드 아이템
 * @returns {Object} 파싱된 사운드 아이템
 */
const parseSoundItem = (item) => ({
    guid: item.guid,
    id: item.itemId,
    type: 'sound',
    resourceId: item.resGuid,
    isVisible: item.isVisible
});
    
/**
 * 포커스 아이템을 파싱합니다.
 * @param {Object} item - 포커스 아이템
 * @returns {Object} 파싱된 포커스 아이템
 */
const parseFocusItem = (item) => ({
    guid: item.guid,
    id: item.itemId,
    type: 'focus',
    isVisible: item.isVisible,
    position: {
        x: item.x,
        y: item.y,
        width: item.width,
        height: item.height
    },
    focusIndex: item.focusIndex
});

/**
 * 쓰기 아이템을 파싱합니다.
 * @param {Object} item - 쓰기 아이템
 * @returns {Object} 파싱된 쓰기 아이템
 */
const parseWriteAreaItem = (item) => ({
    guid: item.guid,
    id: item.itemId,
    type: 'write',
    isVisible: item.isVisible,
    position: {
        x: item.x,
        y: item.y,
        width: item.width,
        height: item.height,
    },
    enterEvent: {
        eventType: item.enterEvent.eventType,
        linkGuid: item.enterEvent.linkGuid
    },
    finishEvent: {
        eventType: item.finishEvent.eventType,
        linkGuid: item.finishEvent.linkGuid
    }
});

/**
 * 클릭 아이템을 파싱합니다.
 * @param {Object} item - 클릭 아이템
 * @returns {Object} 파싱된 클릭 아이템
 */
const parseClickItem = (item) => ({
    guid: item.guid,
    id: item.itemId,
    type: 'click',
    isVisible: item.isVisible,
    position: {
        x: item.x,
        y: item.y,
        width: item.width,
        height: item.height
    },
    clickEvent: {
        eventType: item.clickEvent.eventType,
        linkGuid: item.clickEvent.linkGuid
    }
});
    
/**
 * 시나리오를 파싱합니다.
 * @param {Array} scenarios - 원본 시나리오 리스트
 * @returns {Array} 파싱된 시나리오 리스트
 */
const parseScenarios = (scenarios) => {
    return scenarios.map(scenario => ({
        guid: scenario.guid,
        id: scenario.scenarioId,
        timeline: parseTimeline(scenario.timeline),
        finishEvent: {
            eventType: scenario.finishEvent.eventType,
            linkGuid: scenario.finishEvent.linkGuid
        }
    }));
};
  
/**
 * 타임라인을 파싱합니다.
 * @param {Array} timeline - 원본 타임라인
 * @returns {Array} 파싱된 타임라인
 */
const parseTimeline = (timeline) => {
    return timeline.map(item => ({
      guid: item.itemGuid,
      type: item.timelineType,
      keyframes: parseKeyframes(item.keyframes)
    }));
};
  
/**
 * 키프레임을 파싱합니다.
 * @param {Array} keyframes - 원본 키프레임 리스트
 * @returns {Array} 파싱된 키프레임 리스트
 */
const parseKeyframes = (keyframes) => {
    return keyframes.map(keyframe => ({
      time: keyframe.time,
      value: keyframe.value
    }));
};
  
/**
 * 리소스 리스트를 파싱합니다.
 * @param {Array} resourceList - 원본 리소스 리스트
 * @returns {Object} 파싱된 리소스 객체
 */
const parseResources = (resourceList) => {
    return resourceList.reduce((acc, resource) => {
      acc[resource.guid] = {
        type: resource.resourceType,
        path: resource.path
      };
      return acc;
    }, {});
};
    
/**
 * 특정 페이지의 배경 이미지 경로를 가져옵니다.
 * @param {Object} parsedData - 파싱된 전체 데이터
 * @param {string} pageId - 페이지 ID
 * @returns {string|null} 배경 이미지 경로
 */
export const getBackgroundImagePath = (parsedData, pageId) => {
    const page = parsedData.pages.find(p => p.id === pageId);
    if (page && parsedData.resources[page.id]) {
      return parsedData.resources[page.id].path;
    }
    return null;
};
    
/**
 * 특정 아이템의 리소스 경로를 가져옵니다.
 * @param {Object} parsedData - 파싱된 전체 데이터
 * @param {string} itemId - 아이템 ID
 * @returns {string|null} 리소스 경로
 */
export const getItemResourcePath = (parsedData, itemId) => {
    const item = parsedData.pages.flatMap(p => p.items).find(i => i.id === itemId);
    if (item && item.resourceId && parsedData.resources[item.resourceId]) {
      return parsedData.resources[item.resourceId].path;
    }
    return null;
};