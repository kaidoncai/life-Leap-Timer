'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/src/store/userStore';

export default function Dashboard() {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{type: 'user' | 'assistant', content: string}>>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!user) {
      router.push('/');
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  // 计算年龄和时间相关数据
  const calculateTimeData = () => {
    const birthDate = new Date(user.birthDate);
    const age = currentTime.getFullYear() - birthDate.getFullYear();
    const remainingYears = user.expectedLifespan - age;
    
    // 计算天数
    const timeDiff = currentTime.getTime() - birthDate.getTime();
    const daysPassed = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const remainingDays = (remainingYears * 365);
    
    const progressPercentage = Math.round((age / user.expectedLifespan) * 100);

    return {
      age,
      remainingYears,
      daysPassed,
      remainingDays,
      progressPercentage: Math.min(100, progressPercentage)
    };
  };

  const timeData = calculateTimeData();

  // 获取激励语
  const getMotivationalQuote = () => {
    const quotes = [
      "时间是生命的画布，每一刻都是创造精彩的机会",
      "珍惜当下，因为每一个瞬间都是独特的礼物",
      "生命的意义不在于长度，而在于如何绽放光彩",
      "今天的每一步都是通向梦想的阶梯",
      "把握现在，让每一天都成为人生的杰作"
    ];
    return quotes[Math.floor(Math.random() * quotes.length)];
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // 添加用户消息到历史记录
    setChatHistory(prev => [...prev, { type: 'user', content: message }]);

    // 模拟AI助手回复
    setTimeout(() => {
      const response = getAIResponse(message);
      setChatHistory(prev => [...prev, { type: 'assistant', content: response }]);
    }, 500);

    setMessage('');
  };

  const getAIResponse = (userMessage: string) => {
    const responses = [
      "我理解你的想法。记住，每一天都是新的开始，充满无限可能！",
      "这是个很好的问题。让我们一起探索如何更好地规划你的时间。",
      "保持积极的心态很重要。我建议你可以试着制定一个短期目标。",
      "生命的意义在于创造和成长。你已经做得很棒了！",
      "让我们一起规划一下，如何让每一天都更有意义。"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* 修改顶部主题栏 */}
      <div className="bg-purple-600 text-white py-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-1">生命跃进计时器</h1>
          <p className="text-base opacity-90">让每一天都充满意义</p>
        </div>
      </div>

      {/* 修改内容区域的最大宽度 */}
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* 欢迎区域 */}
        <div className="bg-white rounded-3xl shadow-sm p-6">
          <h2 className="text-2xl font-bold text-purple-600">欢迎, {user.name}!</h2>
          <p className="text-gray-600 mt-2">
            你已经在地球上度过了 {timeData.age} 年
          </p>
          <p className="text-purple-600 mt-4 italic">
            "{getMotivationalQuote()}"
          </p>
        </div>

        {/* 生命统计卡片 */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl shadow-sm p-6">
            <h2 className="text-gray-600">当前年龄</h2>
            <div className="text-3xl font-bold text-purple-600 mt-2">
              {timeData.age} 岁
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {timeData.daysPassed.toLocaleString()} 天
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-sm p-6">
            <h2 className="text-gray-600">预期剩余时间</h2>
            <div className="text-3xl font-bold text-purple-600 mt-2">
              {timeData.remainingYears} 年
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {timeData.remainingDays.toLocaleString()} 天
            </div>
          </div>
        </div>

        {/* 生命进度条 */}
        <div className="bg-white rounded-3xl shadow-sm p-6">
          <h2 className="text-gray-600 mb-4">生命进度</h2>
          <div className="relative pt-1">
            <div className="overflow-hidden h-2 text-xs flex rounded-full bg-purple-100">
              <div
                style={{ width: `${timeData.progressPercentage}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-600 transition-all duration-500"
              ></div>
            </div>
            <div className="text-right mt-1">
              <span className="text-sm font-semibold text-purple-600">
                {timeData.progressPercentage}%
              </span>
            </div>
          </div>
        </div>

        {/* 今日提醒 */}
        <div className="bg-white rounded-3xl shadow-sm p-6">
          <h2 className="text-gray-600 mb-4 font-bold text-lg">今日提醒</h2>
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-center">
              <span className="mr-2">🌟</span>
              珍惜每一天，创造属于你的精彩人生
            </li>
            <li className="flex items-center">
              <span className="mr-2">🎯</span>
              设定目标，规划未来，让生命更有方向
            </li>
            <li className="flex items-center">
              <span className="mr-2">💪</span>
              保持积极心态，迎接每一个挑战
            </li>
          </ul>
        </div>

        {/* AI助手聊天区域 */}
        <div className="bg-white rounded-3xl shadow-sm p-6">
          <h2 className="text-gray-600 mb-4 flex items-center font-bold text-lg">
            <span className="mr-2">🤖</span>
            智能助手
          </h2>
          <div className="h-48 overflow-y-auto mb-4 space-y-3">
            {chatHistory.map((chat, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg ${
                  chat.type === 'user'
                    ? 'bg-purple-50 ml-8'
                    : 'bg-gray-50 mr-8'
                }`}
              >
                {chat.content}
              </div>
            ))}
          </div>
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="有什么想问的吗？"
              className="flex-1 p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              发送
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 