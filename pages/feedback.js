// pages/feedback.js
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Head from 'next/head';

export default function FeedbackPage() {
  const { data: session, status } = useSession();
  const [category, setCategory] = useState('other');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    if (status === 'authenticated') {
      loadHistory();
    }
  }, [status]);

  async function loadHistory() {
    try {
      setLoadingHistory(true);
      const res = await fetch('/api/feedback');
      if (!res.ok) {
        throw new Error('Failed to load feedback history');
      }
      const data = await res.json();
      setHistory(Array.isArray(data.feedbacks) ? data.feedbacks : []);
    } catch (err) {
      console.error('Load feedback history error:', err);
    } finally {
      setLoadingHistory(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      setSubmitError('标题和内容不能为空。');
      return;
    }

    setSubmitError('');
    setSubmitSuccess('');
    setSubmitting(true);

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category,
          subject: subject.trim(),
          message: message.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || '提交失败，请稍后再试。');
      }

      setSubmitSuccess('提交成功，我们已经收到你的反馈。');
      setSubject('');
      setMessage('');
      setHistory((prev) => [data.feedback, ...(Array.isArray(prev) ? prev : [])]);
    } catch (err) {
      console.error('Submit feedback error:', err);
      setSubmitError(err.message || '提交失败，请稍后再试。');
    } finally {
      setSubmitting(false);
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-600 text-sm">加载中...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="bg-white shadow rounded-2xl px-8 py-6 max-w-md text-center">
          <h1 className="text-2xl font-semibold mb-4">请先登录</h1>
          <p className="text-slate-600 mb-4">
            提交反馈需要账户登录。请先登录或注册，然后再访问本页面。
          </p>
          <a
            href="/auth/signin"
            className="inline-block px-4 py-2 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
          >
            去登录
          </a>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Feedback – LiveBackdrop</title>
      </Head>
      <div className="min-h-screen bg-slate-50 py-10 px-4">
        <div className="max-w-4xl mx-auto grid gap-8 md:grid-cols-[3fr,2fr]">
          <div className="bg-white rounded-2xl shadow p-6">
            <h1 className="text-2xl font-bold mb-2 text-slate-900">
              意见反馈
            </h1>
            <p className="text-sm text-slate-600 mb-4">
              使用过程中遇到问题、功能建议或账单相关问题，都可以在这里告诉我们。
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">
                  类型
                </label>
                <select
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="bug">遇到问题 / Bug</option>
                  <option value="idea">功能建议</option>
                  <option value="billing">账单 / 套餐相关</option>
                  <option value="other">其他</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">
                  标题
                </label>
                <input
                  type="text"
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="简单说一下你想反馈的内容..."
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">
                  详细说明
                </label>
                <textarea
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="请尽量描述清楚问题或建议，这有助于我们更快地理解和改进。"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              {submitError && (
                <p className="text-xs text-red-600">{submitError}</p>
              )}
              {submitSuccess && (
                <p className="text-xs text-green-600">{submitSuccess}</p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full md:w-auto px-5 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
              >
                {submitting ? '提交中...' : '提交反馈'}
              </button>
            </form>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-sm font-semibold text-slate-800 mb-3">
              我的历史反馈
            </h2>
            {loadingHistory ? (
              <p className="text-xs text-slate-500">正在加载历史反馈...</p>
            ) : history.length === 0 ? (
              <p className="text-xs text-slate-500">
                你还没有提交过反馈。提交之后，这里会显示最近的反馈记录，方便你查看处理情况。
              </p>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {history.map((item) => (
                  <div
                    key={item._id}
                    className="border border-slate-200 rounded-xl p-3"
                  >
                    <p className="text-xs text-slate-400 mb-1">
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleString()
                        : ''}
                    </p>
                    <p className="text-sm font-medium text-slate-800 mb-1">
                      {item.subject}
                    </p>
                    <p className="text-xs text-slate-500 line-clamp-3">
                      {item.message}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      类型：{item.category || 'other'} · 状态：
                      {item.status || 'open'}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
