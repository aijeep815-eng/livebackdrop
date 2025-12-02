import Head from "next/head";
import NavBar from "../components/NavBar";
import { getSession } from "next-auth/react";
import dbConnect from "../lib/dbConnect";
import User from "../models/User";

export default function WebhookTestPage({ authed, user, error }) {
  const title = "Webhook Test · Subscription Status - LiveBackdrop";

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta
          name="description"
          content="Debug page to verify Stripe webhook and subscription status for the current user."
        />
      </Head>

      <NavBar />

      <main className="min-h-screen bg-slate-50 px-4 py-16">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg border border-slate-200 p-6 md:p-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Webhook Test · Subscription Status
          </h1>
          <p className="text-sm text-slate-600 mb-6">
            This page helps you verify whether your Stripe webhook is correctly
            updating the user&apos;s subscription data in MongoDB.
          </p>

          {!authed && (
            <div className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              You are not logged in. Please sign in first, then come back to
              this page and refresh.
            </div>
          )}

          {authed && error && (
            <div className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800 mb-4">
              {error}
            </div>
          )}

          {authed && user && (
            <div className="space-y-4">
              <section className="rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-sm">
                <h2 className="font-semibold text-slate-900 mb-2">
                  Current User
                </h2>
                <p>
                  <span className="font-medium text-slate-700">User ID:</span>{" "}
                  <span className="font-mono text-xs break-all">
                    {user.id}
                  </span>
                </p>
                <p>
                  <span className="font-medium text-slate-700">Email:</span>{" "}
                  <span className="font-mono text-xs break-all">
                    {user.email || "(no email stored)"}
                  </span>
                </p>
                <p>
                  <span className="font-medium text-slate-700">Plan:</span>{" "}
                  <span
                    className={
                      "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold " +
                      (user.plan === "creator"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-100 text-slate-700")
                    }
                  >
                    {user.plan || "unknown"}
                  </span>
                </p>
              </section>

              <section className="rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-sm">
                <h2 className="font-semibold text-slate-900 mb-2">
                  Stripe Fields (from MongoDB)
                </h2>
                <p>
                  <span className="font-medium text-slate-700">
                    stripeCustomerId:
                  </span>{" "}
                  <span className="font-mono text-xs break-all">
                    {user.stripeCustomerId || "(null)"}
                  </span>
                </p>
                <p>
                  <span className="font-medium text-slate-700">
                    stripeSubscriptionId:
                  </span>{" "}
                  <span className="font-mono text-xs break-all">
                    {user.stripeSubscriptionId || "(null)"}
                  </span>
                </p>
                <p>
                  <span className="font-medium text-slate-700">Created at:</span>{" "}
                  <span className="font-mono text-xs">
                    {user.createdAt || "(n/a)"}
                  </span>
                </p>
                <p>
                  <span className="font-medium text-slate-700">Updated at:</span>{" "}
                  <span className="font-mono text-xs">
                    {user.updatedAt || "(n/a)"}
                  </span>
                </p>
              </section>

              <section className="rounded-xl bg-blue-50 border border-blue-200 px-4 py-3 text-xs text-slate-800">
                <h2 className="font-semibold text-slate-900 mb-1">
                  How to use this page
                </h2>
                <ol className="list-decimal ml-4 space-y-1">
                  <li>Log in with the user you want to test.</li>
                  <li>
                    Start a Stripe checkout for the Creator plan (in test mode)
                    and complete payment with a test card.
                  </li>
                  <li>
                    Refresh this page:
                    <ul className="list-disc ml-4">
                      <li>
                        <code className="font-mono">
                          plan
                        </code>{" "}
                        should be <strong>creator</strong>
                      </li>
                      <li>
                        <code className="font-mono">
                          stripeCustomerId
                        </code>{" "}
                        and{" "}
                        <code className="font-mono">
                          stripeSubscriptionId
                        </code>{" "}
                        should have values.
                      </li>
                    </ul>
                  </li>
                  <li>
                    In Stripe, cancel the subscription (still in test mode), then
                    refresh this page again:
                    <ul className="list-disc ml-4">
                      <li>
                        <code className="font-mono">
                          plan
                        </code>{" "}
                        should go back to <strong>free</strong>
                      </li>
                      <li>
                        <code className="font-mono">
                          stripeSubscriptionId
                        </code>{" "}
                        may be cleared.
                      </li>
                    </ul>
                  </li>
                </ol>
              </section>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      props: {
        authed: false,
      },
    };
  }

  try {
    await dbConnect();
    const mongoUser = await User.findOne({ email: session.user.email });

    if (!mongoUser) {
      return {
        props: {
          authed: true,
          error: "No user found in database for this session.",
        },
      };
    }

    return {
      props: {
        authed: true,
        user: {
          id: mongoUser._id.toString(),
          email: mongoUser.email || "",
          plan: mongoUser.plan || "",
          stripeCustomerId: mongoUser.stripeCustomerId || "",
          stripeSubscriptionId: mongoUser.stripeSubscriptionId || "",
          createdAt: mongoUser.createdAt
            ? mongoUser.createdAt.toISOString()
            : "",
          updatedAt: mongoUser.updatedAt
            ? mongoUser.updatedAt.toISOString()
            : "",
        },
      },
    };
  } catch (err) {
    console.error("Error loading webhook test user data:", err);
    return {
      props: {
        authed: true,
        error: "Error loading user data. Check server logs for details.",
      },
    };
  }
}