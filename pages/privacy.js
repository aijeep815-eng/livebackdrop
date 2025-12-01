import Head from 'next/head';

export default function PrivacyPage() {
  return (
    <>
      <Head>
        <title>隐私政策 - LiveBackdrop</title>
      </Head>
      <div className="min-h-screen bg-slate-50 py-12 px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow border border-slate-200 px-6 py-6 space-y-4">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            LiveBackdrop 隐私政策
          </h1>
          <p className="text-xs text-slate-500">
            最近更新日期：2025-12-01
          </p>

          <p className="text-sm text-slate-700">
            我们非常重视你的隐私。本隐私政策说明我们如何收集、使用和保护你在使用 LiveBackdrop
            过程中提供的信息。使用本服务，即表示你同意本隐私政策的内容。
          </p>

          <section className="space-y-2 text-sm text-slate-700">
            <h2 className="text-base font-semibold text-slate-900">
              1. 我们收集哪些信息
            </h2>
            <p>
              1.1 账号信息：例如邮箱地址、昵称、登录方式（邮箱登录、Google 登录等）。
            </p>
            <p>
              1.2 使用数据：包括生成次数、上传次数、图像实验室使用情况等，用于统计和限额判断。
            </p>
            <p>
              1.3 日志信息：如 IP 地址（部分场景）、浏览器信息、访问时间，用于安全和调试。
            </p>
            <p>
              1.4 订阅信息：由支付服务提供商（如 Stripe）返回的订阅状态、付款结果等（我们一般不会存储完整银行卡号等敏感信息）。
            </p>
          </section>

          <section className="space-y-2 text-sm text-slate-700">
            <h2 className="text-base font-semibold text-slate-900">
              2. 我们如何使用这些信息
            </h2>
            <p>2.1 提供和维护服务（例如登录、生成虚拟背景、保存历史记录）。</p>
            <p>2.2 判断套餐和使用限额，确保服务公平使用。</p>
            <p>2.3 统计产品使用情况，用于改进功能和优化体验。</p>
            <p>2.4 处理订阅、付款以及相关通知（如订阅到期提醒）。</p>
          </section>

          <section className="space-y-2 text-sm text-slate-700">
            <h2 className="text-base font-semibold text-slate-900">
              3. 第三方服务
            </h2>
            <p>
              3.1 我们可能使用第三方服务，如：身份认证（如 Google Login）、支付服务（如 Stripe）、云存储与 CDN、分析工具等。
            </p>
            <p>
              3.2 这些服务提供商可能会根据各自的隐私政策处理你的数据，我们会尽量选择声誉良好、合规的服务商。
            </p>
          </section>

          <section className="space-y-2 text-sm text-slate-700">
            <h2 className="text-base font-semibold text-slate-900">
              4. Cookie 与本地存储
            </h2>
            <p>
              为了实现登录状态、语言偏好等功能，我们可能会使用 Cookie 或浏览器本地存储。
              你可以在浏览器中管理或删除 Cookie，但这可能影响部分功能的正常使用。
            </p>
          </section>

          <section className="space-y-2 text-sm text-slate-700">
            <h2 className="text-base font-semibold text-slate-900">
              5. 数据安全
            </h2>
            <p>
              我们会在合理的范围内采取技术和管理措施保护你的数据安全，例如使用加密连接（HTTPS）传输数据。
              但互联网环境下不存在绝对安全，我们无法保证信息在任何情况下都不会被未经授权访问。
            </p>
          </section>

          <section className="space-y-2 text-sm text-slate-700">
            <h2 className="text-base font-semibold text-slate-900">
              6. 数据保留与删除
            </h2>
            <p>
              我们会在提供服务所必需的时间内保留你的数据。当你注销账号或我们不再需要相关数据时，会在合理时间内删除或匿名化处理。
            </p>
          </section>

          <section className="space-y-2 text-sm text-slate-700">
            <h2 className="text-base font-semibold text-slate-900">
              7. 儿童与未成年人
            </h2>
            <p>
              本服务主要面向成年用户。如你是未成年人，请在监护人同意并指导下使用本服务。
            </p>
          </section>

          <section className="space-y-2 text-sm text-slate-700">
            <h2 className="text-base font-semibold text-slate-900">
              8. 隐私政策的变更
            </h2>
            <p>
              随着服务发展，我们可能会不时更新本隐私政策。重要变更我们会在站内进行提示，更新后的政策自公布时起生效。
            </p>
          </section>

          <section className="space-y-2 text-sm text-slate-700">
            <h2 className="text-base font-semibold text-slate-900">
              9. 联系方式
            </h2>
            <p>
              如你对本隐私政策有疑问或希望删除相关数据，可以通过网站提供的联系方式与我们取得联系。
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
