'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/src/store/userStore';
import { NewUser, validateUser, ValidationError } from '@/src/types/user';

export default function UserSetup() {
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);
  const [errors, setErrors] = useState<string[]>([]);
  const [lifespan, setLifespan] = useState(80);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newUser: NewUser = {
      name: formData.get('name') as string,
      birthDate: new Date(formData.get('birthDate') as string),
      expectedLifespan: Number(formData.get('expectedLifespan')),
      email: formData.get('email') as string
    };

    const validationErrors = validateUser(newUser);
    if (validationErrors.length > 0) {
      setErrors(validationErrors.map((err: ValidationError) => err.message));
      return;
    }

    try {
      setUser(newUser);
      router.push('/dashboard');
    } catch (error) {
      setErrors(['保存用户信息失败，请重试']);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-3xl shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-4 text-purple-600">开启你的人生旅程</h1>
        <p className="text-gray-500 text-center mb-8">记录第一个精彩瞬间</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="text-gray-600">
              你的名字
            </label>
            <div className="relative">
              <input
                type="text"
                name="name"
                id="name"
                className="w-full p-3 pr-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="输入你的名字"
                required
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2">👤</span>
            </div>
          </div>

          <div>
            <label htmlFor="birthDate" className="text-gray-600">
              出生日期
            </label>
            <div className="relative">
              <input
                type="date"
                name="birthDate"
                id="birthDate"
                className="w-full p-3 pr-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2">📅</span>
            </div>
          </div>

          <div>
            <label htmlFor="expectedLifespan" className="text-gray-600">
              预期寿命
            </label>
            <div className="relative">
              <input
                type="range"
                name="expectedLifespan"
                id="expectedLifespan"
                min="1"
                max="120"
                value={lifespan}
                onChange={(e) => setLifespan(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                required
              />
              <div className="text-center mt-2 text-purple-600">{lifespan} 岁</div>
            </div>
          </div>

          <div>
            <label htmlFor="email" className="text-gray-600">
              电子邮箱
            </label>
            <div className="relative">
              <input
                type="email"
                name="email"
                id="email"
                className="w-full p-3 pr-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="your@email.com"
                required
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2">✉️</span>
            </div>
          </div>

          {errors.length > 0 && (
            <div className="p-4 bg-red-50 rounded-lg">
              {errors.map((error, index) => (
                <p key={index} className="text-red-500">{error}</p>
              ))}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-4 text-lg font-semibold text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
          >
            开启人生新篇章
          </button>
        </form>
      </div>
    </div>
  );
} 