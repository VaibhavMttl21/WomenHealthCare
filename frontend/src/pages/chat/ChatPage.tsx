import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { MessageCircle, Send, Heart, Plus } from '../../components/ui/Icons';

const ChatPage: React.FC = () => {
  const { t } = useTranslation();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      content: 'Hello! I\'m your health assistant. How can I help you today?',
      timestamp: new Date(Date.now() - 5 * 60 * 1000)
    },
    {
      id: 2,
      sender: 'user',
      content: 'I\'m experiencing some morning sickness. Is this normal during pregnancy?',
      timestamp: new Date(Date.now() - 3 * 60 * 1000)
    },
    {
      id: 3,
      sender: 'ai',
      content: 'Morning sickness is very common during pregnancy, especially in the first trimester. It affects about 70-80% of pregnant women. However, if symptoms are severe or you\'re unable to keep food down, please consult your doctor.',
      timestamp: new Date(Date.now() - 2 * 60 * 1000)
    }
  ]);

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        sender: 'user' as const,
        content: message,
        timestamp: new Date()
      };
      setMessages([...messages, newMessage]);
      setMessage('');
      
      // Simulate AI response
      setTimeout(() => {
        const aiResponse = {
          id: messages.length + 2,
          sender: 'ai' as const,
          content: 'Thank you for your question. Based on your symptoms, I recommend consulting with your healthcare provider for personalized advice.',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiResponse]);
      }, 1000);
    }
  };

  const suggestedQuestions = [
    'What should I eat during pregnancy?',
    'How often should I visit the doctor?',
    'What are normal pregnancy symptoms?',
    'How to manage pregnancy discomfort?'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Heart className="h-8 w-8 text-pink-500 mr-3" />
          <h1 className="text-3xl font-bold text-gray-800">{t('chat.healthAssistant')}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Chat History Sidebar */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{t('chat.chatHistory')}</span>
                <Button size="sm" variant="ghost">
                  <Plus className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="p-3 bg-blue-50 rounded-lg cursor-pointer">
                  <div className="font-medium text-sm">Health Questions</div>
                  <div className="text-xs text-gray-600">Today</div>
                </div>
                <div className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <div className="font-medium text-sm">Nutrition Advice</div>
                  <div className="text-xs text-gray-600">Yesterday</div>
                </div>
                <div className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <div className="font-medium text-sm">Exercise Guidelines</div>
                  <div className="text-xs text-gray-600">2 days ago</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Chat Area */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-green-500" />
                AI Health Assistant
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {/* Messages Area */}
              <div className="h-96 overflow-y-auto p-6 space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        msg.sender === 'user'
                          ? 'bg-pink-500 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                      <p className={`text-xs mt-1 ${
                        msg.sender === 'user' ? 'text-pink-100' : 'text-gray-500'
                      }`}>
                        {msg.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Suggested Questions */}
              <div className="px-6 py-4 border-t">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  {t('chat.suggestedQuestions')}:
                </p>
                <div className="flex flex-wrap gap-2">
                  {suggestedQuestions.map((question, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => setMessage(question)}
                      className="text-xs"
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Message Input */}
              <div className="p-6 border-t">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder={t('chat.typeMessage')}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                    className="bg-pink-500 hover:bg-pink-600"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
