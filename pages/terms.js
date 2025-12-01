import Head from 'next/head';

export default function TermsPage() {
  return (
    <>
      <Head>
        <title>服务条款 - LiveBackdrop</title>
      </Head>
      <div className="min-h-screen bg-slate-50 py-12 px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow border border-slate-200 px-6 py-6 space-y-4">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            LiveBackdrop 服务条款
          </h1>
          <p className="text-xs text-slate-500">
            最近更新日期：2025-12-01
          </p>

          <p className="text-sm text-slate-700">
            欢迎使用 LiveBackdrop（下称「本服务」）。本服务由站点所有者运营。
            使用本网站及相关功能（包括 AI 生成虚拟背景、图像实验室、素材上传等），
            即表示你同意本服务条款。如果你不同意其中任何内容，请不要使用本服务。
          </p>

          <section className="space-y-2 text-sm text-slate-700">
            <h2 className="text-base font-semibold text-slate-900">
              1. 账号与访问
            </h2>
            <p>1.1 你需要创建账号并登录后才能使用部分功能（包括生成历史、图像实验室等）。</p>
            <p>1.2 你有责任妥善保管账号和密码，不得与他人共享，因账号泄露导致的损失由你自行承担。</p>
            <p>1.3 我们有权在你违反本条款或滥用服务时，暂停或终止你的访问权限。</p>
          </section>

          <section className="space-y-2 text-sm text-slate-700">
            <h2 className="text-base font-semibold text-slate-900">
              2. 订阅与付款
            </h2>
            <p>
              2.1 本服务提供免费套餐与付费订阅套餐（如 CreatorUnlimited）。具体功能、价格和限额以页面展示为准。
            </p>
            <p>
              2.2 付费订阅通常以月度或年度形式自动续费。你可以在订阅页面或 Stripe 订阅管理中随时取消续费。
            </p>
            <p>
              2.3 已经产生的订阅费用通常不予退还，除非适用法律或我们另行书面说明。
            </p>
          </section>

          <section className="space-y-2 text-sm text-slate-700">
            <h2 className="text-base font-semibold text-slate-900">
              3. 内容与使用规范
            </h2>
            <p>
              3.1 你使用本服务生成或上传的内容应遵守适用法律法规，不得包含暴力、仇恨、色情、违法宣传等内容。
            </p>
            <p>
              3.2 你对自己上传的素材及生成结果负责，包括但不限于是否侵犯第三方的版权、商标或隐私权。
            </p>
            <p>
              3.3 你不得尝试绕过使用限额、攻击服务器、爬取大量数据或进行其他滥用行为。
            </p>
          </section>

          <section className="space-y-2 text-sm text-slate-700">
            <h2 className="text-base font-semibold text-slate-900">
              4. AI 生成结果与免责声明
            </h2>
            <p>
              4.1 本服务通过调用第三方 AI 接口生成虚拟背景，我们不保证所有结果都完全准确、适用或无错误。
            </p>
            <p>
              4.2 生成结果仅供参考及个人/商业使用，你在使用结果进行直播、宣传或其他商业行为时，应自行判断适用性与合法性。
            </p>
            <p>
              4.3 因使用本服务或生成结果导致的任何直接或间接损失，我们在法律允许的范围内不承担赔偿责任。
            </p>
          </section>

          <section className="space-y-2 text-sm text-slate-700">
            <h2 className="text-base font-semibold text-slate-900">
              5. 服务变更与中断
            </h2>
            <p>
              5.1 我们有权根据实际情况随时对功能、套餐、价格进行调整，并在站内公告或页面更新中予以说明。
            </p>
            <p>
              5.2 因设备维护、服务器故障、第三方服务异常或不可抗力导致的服务中断，我们会尽量恢复，但不对由此产生的损失负责。
            </p>
          </section>

          <section className="space-y-2 text-sm text-slate-700">
            <h2 className="text-base font-semibold text-slate-900">
              6. 适用法律
            </h2>
            <p>
              本条款受你所在地区的适用法律约束。如条款部分内容与强制性法律相冲突，以法律规定为准，其余条款继续有效。
            </p>
          </section>

          <section className="space-y-2 text-sm text-slate-700">
            <h2 className="text-base font-semibold text-slate-900">
              7. 联系方式
            </h2>
            <p>
              如对本服务条款有任何疑问，可以通过网站中提供的联系方式与我们取得联系。
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
