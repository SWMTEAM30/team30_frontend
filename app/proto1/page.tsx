'use client'

import React, { useState, useEffect, useRef } from 'react';
import { Send, Heart, Bot, List, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

// 타입 정의
interface Item {
  id: number;
  name: string;
  style: string;
  image: string;
  description?: string;
  tags: string[];
}

interface Message {
  id: number;
  type: 'user' | 'ai';
  content: string;
  timestamp: string;
  showTrendItems?: boolean;
  showStyleItems?: boolean;
  showSimilarItems?: boolean;
  showSelectedItems?: boolean;
  styleType?: string;
  similarItems?: Item[];
}

const FashionAIChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [selectedItems, setSelectedItems] = useState<Item[]>([]);
  const [currentContext, setCurrentContext] = useState('waiting');
  const [lastShownStyle, setLastShownStyle] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 실제 패션 이미지 URL - 더 안정적인 이미지로 교체
  const trendItems: Item[] = [
    { 
      id: 1, 
      name: '시티보이 블레이저', 
      style: 'cityboy', 
      image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=600&fit=crop&crop=center',
      description: '깔끔한 시티보이 룩',
      tags: ['블레이저', '정장', '비즈니스']
    },
    { 
      id: 2, 
      name: '댄디 수트', 
      style: 'dandy', 
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&crop=center',
      description: '클래식한 댄디 스타일',
      tags: ['수트', '클래식', '포멀']
    },
    { 
      id: 3, 
      name: '캐주얼 후드티', 
      style: 'casual', 
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=600&fit=crop&crop=center',
      description: '편안한 캐주얼 룩',
      tags: ['후드티', '캐주얼', '편안한']
    },
    { 
      id: 4, 
      name: '스트릿 오버핏', 
      style: 'street', 
      image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400&h=600&fit=crop&crop=center',
      description: '힙한 스트릿 패션',
      tags: ['스트릿', '오버핏', '힙합']
    },
    { 
      id: 5, 
      name: '미니멀 니트', 
      style: 'minimal', 
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=600&fit=crop&crop=center',
      description: '미니멀한 스타일',
      tags: ['니트', '미니멀', '심플']
    },
    { 
      id: 6, 
      name: '빈티지 코트', 
      style: 'vintage', 
      image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=600&fit=crop&crop=center',
      description: '빈티지 감성',
      tags: ['코트', '빈티지', '클래식']
    }
  ];

  const styleItems: Record<string, Item[]> = {
    cityboy: [
      { 
        id: 101, 
        name: '네이비 블레이저', 
        style: 'cityboy', 
        image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=600&fit=crop&crop=center',
        tags: ['블레이저', '네이비', '정장']
      },
      { 
        id: 102, 
        name: '화이트 드레스셔츠', 
        style: 'cityboy', 
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&crop=center',
        tags: ['셔츠', '화이트', '드레스']
      },
      { 
        id: 103, 
        name: '슬림 치노팬츠', 
        style: 'cityboy', 
        image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=600&fit=crop&crop=center',
        tags: ['치노팬츠', '슬림', '베이지']
      },
      { 
        id: 104, 
        name: '브라운 로퍼', 
        style: 'cityboy', 
        image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400&h=600&fit=crop&crop=center',
        tags: ['로퍼', '브라운', '가죽']
      },
      { 
        id: 105, 
        name: '실버 시계', 
        style: 'cityboy', 
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=600&fit=crop&crop=center',
        tags: ['시계', '실버', '액세서리']
      }
    ],
    dandy: [
      { 
        id: 201, 
        name: '그레이 트위드 수트', 
        style: 'dandy', 
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&crop=center',
        tags: ['수트', '트위드', '그레이']
      },
      { 
        id: 202, 
        name: '포켓 스퀘어', 
        style: 'dandy', 
        image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=600&fit=crop&crop=center',
        tags: ['포켓스퀘어', '액세서리', '실크']
      },
      { 
        id: 203, 
        name: '스트라이프 셔츠', 
        style: 'dandy', 
        image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=600&fit=crop&crop=center',
        tags: ['셔츠', '스트라이프', '패턴']
      },
      { 
        id: 204, 
        name: '옥스포드 슈즈', 
        style: 'dandy', 
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=600&fit=crop&crop=center',
        tags: ['옥스포드', '가죽신발', '블랙']
      },
      { 
        id: 205, 
        name: '레더 벨트', 
        style: 'dandy', 
        image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400&h=600&fit=crop&crop=center',
        tags: ['벨트', '레더', '브라운']
      }
    ],
    casual: [
      { 
        id: 301, 
        name: '그레이 후드티', 
        style: 'casual', 
        image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=600&fit=crop&crop=center',
        tags: ['후드티', '그레이', '코튼']
      },
      { 
        id: 302, 
        name: '다크 데님 진', 
        style: 'casual', 
        image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400&h=600&fit=crop&crop=center',
        tags: ['데님', '진', '다크블루']
      },
      { 
        id: 303, 
        name: '화이트 스니커즈', 
        style: 'casual', 
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=600&fit=crop&crop=center',
        tags: ['스니커즈', '화이트', '캐주얼']
      },
      { 
        id: 304, 
        name: '블랙 백팩', 
        style: 'casual', 
        image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=600&fit=crop&crop=center',
        tags: ['백팩', '블랙', '가방']
      },
      { 
        id: 305, 
        name: '네이비 볼캡', 
        style: 'casual', 
        image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=600&fit=crop&crop=center',
        tags: ['볼캡', '네이비', '모자']
      }
    ],
    street: [
      { 
        id: 401, 
        name: '오버사이즈 후드티', 
        style: 'street', 
        image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400&h=600&fit=crop&crop=center',
        tags: ['후드티', '오버사이즈', '스트릿']
      },
      { 
        id: 402, 
        name: '와이드 카고팬츠', 
        style: 'street', 
        image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=600&fit=crop&crop=center',
        tags: ['카고팬츠', '와이드', '밀리터리']
      },
      { 
        id: 403, 
        name: '하이탑 스니커즈', 
        style: 'street', 
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=600&fit=crop&crop=center',
        tags: ['스니커즈', '하이탑', '블랙']
      },
      { 
        id: 404, 
        name: '버킷햇', 
        style: 'street', 
        image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=600&fit=crop&crop=center',
        tags: ['버킷햇', '모자', '스트릿']
      },
      { 
        id: 405, 
        name: '크로스백', 
        style: 'street', 
        image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=600&fit=crop&crop=center',
        tags: ['크로스백', '가방', '힙합']
      }
    ]
  };

  const getSimilarItems = (selectedItem: Item): Item[] => {
    const allItems = Object.values(styleItems).flat();
    const combinedItems = [...allItems, ...trendItems];
    
    return combinedItems.filter(item => {
      if (item.id === selectedItem.id) return false;
      const hasSameStyle = item.style === selectedItem.style;
      const hasCommonTags = selectedItem.tags && item.tags && 
        selectedItem.tags.some((tag: string) => item.tags.includes(tag));
      return hasSameStyle || hasCommonTags;
    }).slice(0, 5);
  };

  const addMessage = (type: 'user' | 'ai', content: string, options: Partial<Message> = {}) => {
    const newMessage: Message = {
      id: Date.now(),
      type,
      content,
      timestamp: new Date().toLocaleTimeString(),
      ...options
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleItemClick = (item: Item) => {
    setSelectedItems(prev => [...prev, item]);
    addMessage('user', `${item.name} 이게 좋아.`);
    
    if (item.id <= 6) {
      setCurrentContext('showing_style_items');
      setLastShownStyle(item.style);
      
      setTimeout(() => {
        const styleDescription = getStyleDescription(item.style);
        addMessage('ai', `오! ${styleDescription} 스타일의 옷을 좋아하시는군요? 이것과 관련해서 옷 추천 도와드릴까요?`);
      }, 500);
    } else {
      setTimeout(() => {
        addMessage('ai', `좋아요. 이런 것들을 좋아하시는군요! 더 비슷한 옷들을 가져올까요?`);
      }, 500);
    }
  };

  const getStyleDescription = (style: string): string => {
    const descriptions: Record<string, string> = {
      cityboy: '시티보이',
      dandy: '댄디',
      casual: '캐주얼',
      street: '스트릿',
      minimal: '미니멀',
      vintage: '빈티지'
    };
    return descriptions[style] || style;
  };

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    addMessage('user', userMessage);

    setTimeout(() => {
      handleAIResponse(userMessage);
    }, 500);

    setInput('');
  };

  const handleAIResponse = (userMessage: string) => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('옷') && lowerMessage.includes('추천')) {
      setCurrentContext('showing_trends');
      addMessage('ai', '요즘 트렌드는 이런 게 있어요!', { showTrendItems: true });
    } 
    else if (lowerMessage.includes('비슷한') && lowerMessage.includes('추천')) {
      if (selectedItems.length > 0) {
        const lastSelectedItem = selectedItems[selectedItems.length - 1];
        const similarItems = getSimilarItems(lastSelectedItem);
        addMessage('ai', `${lastSelectedItem.name}과 비슷한 스타일의 옷들을 추천해드릴게요!`, { 
          showSimilarItems: true, 
          similarItems: similarItems 
        });
      } else if (lastShownStyle) {
        addMessage('ai', `알겠어요, ${getStyleDescription(lastShownStyle)} 룩으로 5벌 추천드릴게요.`, { 
          showStyleItems: true, 
          styleType: lastShownStyle 
        });
      } else {
        addMessage('ai', '어떤 스타일의 옷을 원하시나요?');
      }
    }
    else if (lowerMessage.includes('다른 스타일') || lowerMessage.includes('도전')) {
      setCurrentContext('showing_trends');
      addMessage('ai', '그러면 요즘 트렌드의 옷을 다시 보여드릴게요.', { showTrendItems: true });
    }
    else if (lowerMessage.includes('골랐던') || lowerMessage.includes('목록') || lowerMessage.includes('선택한')) {
      addMessage('ai', '여태까지 골랐던 옷들 목록입니다.', { showSelectedItems: true });
    }
    else if (lowerMessage.includes('ㅇㅇ') || lowerMessage.includes('응') || lowerMessage.includes('네')) {
      if (currentContext === 'showing_style_items' && lastShownStyle) {
        addMessage('ai', `알겠어요, ${getStyleDescription(lastShownStyle)} 룩으로 5벌 추천드릴게요.`, { 
          showStyleItems: true, 
          styleType: lastShownStyle 
        });
      } else {
        addMessage('ai', '네, 어떤 도움이 필요하신가요?');
      }
    }
    else if (lowerMessage.includes('아니') || lowerMessage.includes('됐어') || lowerMessage.includes('충분')) {
      addMessage('ai', '알겠어요! 다른 도움이 필요하시면 언제든 말씀해주세요. 😊');
    }
    else {
      addMessage('ai', '무엇을 도와드릴까요? "옷 추천해줘", "비슷한 옷 추천해줘", "다른 스타일 보여줘" 등을 말씀해주세요!');
    }
  };

  return (
    <div className="max-w-2xl mx-auto h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <Bot className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Fashion AI</h1>
              <p className="text-sm text-gray-500">패션 스타일링 어시스턴트</p>
            </div>
          </div>
          <div 
            className="flex items-center space-x-2 text-sm text-gray-600 cursor-pointer hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors"
            onClick={() => {
              if (selectedItems.length > 0) {
                addMessage('ai', '여태까지 선택하신 옷들입니다!', { showSelectedItems: true });
              } else {
                addMessage('ai', '아직 선택한 옷이 없습니다. 옷을 선택해보세요!');
              }
            }}
          >
            <Sparkles className="w-4 h-4" />
            <span>선택한 옷: {selectedItems.length}개</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <Bot className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <p className="text-gray-600">안녕하세요! 패션 AI입니다.</p>
            <p className="text-gray-500 text-sm mt-2">"옷 추천해줘"라고 말씀해보세요!</p>
          </div>
        )}
        
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-full px-4 py-2 rounded-lg ${
              message.type === 'user' 
                ? 'bg-blue-500 text-white max-w-xs' 
                : 'bg-white text-gray-800 border shadow-sm max-w-sm'
            }`}>
              <div className="flex items-start space-x-2">
                {message.type === 'ai' && (
                  <Bot className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                  
                  {message.showTrendItems && (
                    <div className="mt-4">
                      <div className="overflow-x-auto scrollbar-hide w-full">
                        <div className="flex space-x-3 pb-2" style={{ width: 'max-content' }}>
                          {trendItems.map((item) => (
                            <div 
                              key={item.id}
                              className="flex-shrink-0 w-32 bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-all cursor-pointer transform hover:scale-105" 
                              onClick={() => handleItemClick(item)}
                            >
                              <div className="relative">
                                <img 
                                  src={item.image} 
                                  alt={item.name}
                                  className="w-full h-32 object-cover rounded-t-lg"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = '/cloth1.jpg'; // 기본 이미지로 대체
                                  }}
                                />
                                <div className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md">
                                  <Heart className="w-3 h-3 text-gray-400 hover:text-red-500" />
                                </div>
                              </div>
                              <div className="p-2">
                                <h3 className="font-medium text-xs mb-1">{item.name}</h3>
                                <p className="text-xs text-gray-600 mb-1">{item.description}</p>
                                <span className="text-xs bg-gray-100 px-1 py-0.5 rounded-full">
                                  {item.tags[0]}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {message.showStyleItems && message.styleType && (
                    <div className="mt-4">
                      <div className="overflow-x-auto scrollbar-hide w-full">
                        <div className="flex space-x-3 pb-2" style={{ width: 'max-content' }}>
                          {styleItems[message.styleType]?.map((item) => (
                            <div 
                              key={item.id}
                              className="flex-shrink-0 w-32 bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-all cursor-pointer transform hover:scale-105" 
                              onClick={() => handleItemClick(item)}
                            >
                              <div className="relative">
                                <img 
                                  src={item.image} 
                                  alt={item.name}
                                  className="w-full h-32 object-cover rounded-t-lg"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = '/cloth1.jpg';
                                  }}
                                />
                                <div className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md">
                                  <Heart className="w-3 h-3 text-gray-400 hover:text-red-500" />
                                </div>
                              </div>
                              <div className="p-2">
                                <h3 className="font-medium text-xs mb-1">{item.name}</h3>
                                <span className="text-xs bg-gray-100 px-1 py-0.5 rounded-full">
                                  {item.tags[0]}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {message.showSimilarItems && message.similarItems && (
                    <div className="mt-4">
                      <div className="overflow-x-auto scrollbar-hide w-full">
                        <div className="flex space-x-3 pb-2" style={{ width: 'max-content' }}>
                          {message.similarItems.map((item) => (
                            <div 
                              key={item.id}
                              className="flex-shrink-0 w-32 bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-all cursor-pointer transform hover:scale-105" 
                              onClick={() => handleItemClick(item)}
                            >
                              <div className="relative">
                                <img 
                                  src={item.image} 
                                  alt={item.name}
                                  className="w-full h-32 object-cover rounded-t-lg"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = '/cloth1.jpg';
                                  }}
                                />
                                <div className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md">
                                  <Heart className="w-3 h-3 text-gray-400 hover:text-red-500" />
                                </div>
                              </div>
                              <div className="p-2">
                                <h3 className="font-medium text-xs mb-1">{item.name}</h3>
                                <span className="text-xs bg-gray-100 px-1 py-0.5 rounded-full">
                                  {item.tags[0]}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {message.showSelectedItems && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg border">
                      <h3 className="font-bold text-lg mb-3 flex items-center">
                        <List className="w-5 h-5 mr-2" />
                        선택한 옷들 ({selectedItems.length}개)
                      </h3>
                      {selectedItems.length > 0 ? (
                        <div className="space-y-3">
                          <div className="overflow-x-auto scrollbar-hide w-full">
                            <div className="flex space-x-3 pb-2" style={{ width: 'max-content' }}>
                              {selectedItems.map((item, index) => (
                                <div key={`selected-${index}`} className="flex-shrink-0 w-32 bg-white rounded-lg shadow-md border border-gray-200">
                                  <div className="relative">
                                    <img 
                                      src={item.image} 
                                      alt={item.name}
                                      className="w-full h-32 object-cover rounded-t-lg"
                                      onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=600&fit=crop&crop=center';
                                      }}
                                    />
                                    <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                                      {index + 1}
                                    </div>
                                  </div>
                                  <div className="p-2">
                                    <h3 className="font-medium text-xs mb-1">{item.name}</h3>
                                    <p className="text-xs text-gray-600 mb-1">{item.description || ''}</p>
                                    <div className="flex flex-wrap gap-1">
                                      {item.tags.slice(0, 2).map((tag, tagIndex) => (
                                        <span key={tagIndex} className="text-xs bg-gray-100 px-1 py-0.5 rounded-full">
                                          {tag}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="text-sm text-gray-600">
                            총 {selectedItems.length}개의 아이템을 선택하셨습니다. 
                            {selectedItems.length >= 3 && ' 이제 코디네이션을 만들어보시겠어요?'}
                          </div>
                        </div>
                      ) : (
                        <div className="text-gray-500 text-center py-4">
                          <Heart className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                          <p>아직 선택한 옷이 없습니다.</p>
                          <p className="text-xs mt-1">옷을 클릭해서 선택해보세요!</p>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="text-xs text-gray-400 mt-2">{message.timestamp}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t px-4 py-3">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="메시지를 입력하세요... (예: 옷 추천해줘, 비슷한 옷 추천해줘)"
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSendMessage}
            className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          <button 
            onClick={() => setInput('옷 추천해줘')}
            className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full transition-colors"
          >
            옷 추천해줘
          </button>
          <button 
            onClick={() => setInput('비슷한 옷 추천해줘')}
            className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full transition-colors"
          >
            비슷한 옷 추천해줘
          </button>
          <button 
            onClick={() => setInput('다른 스타일 도전해보고 싶어')}
            className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full transition-colors"
          >
            다른 스타일 보여줘
          </button>
          <button 
            onClick={() => setInput('선택한 옷 목록 보여줘')}
            className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full transition-colors"
          >
            선택한 옷 목록
          </button>
        </div>
      </div>
    </div>
  );
};

export default FashionAIChat;