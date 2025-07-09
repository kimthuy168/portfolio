import { auth } from "./api/auth/auth"

export default async function HomePage() {
  const session = await auth()
  const isLoggedIn = !!session?.user?.id

  return (
    <main className="max-w-4xl mx-auto px-6 py-20 text-center space-y-12">
      <section>
        <h1 className="text-5xl font-extrabold mb-6 text-gray-900 dark:text-white">
          Showcase Your Skills with a Personal Portfolio
        </h1>

        <p className="text-gray-700 dark:text-gray-300 text-lg max-w-3xl mx-auto leading-relaxed mb-6">
          Build your professional identity with ease. This platform empowers you to craft a stunning portfolio that highlights your <span className="font-semibold text-blue-600 dark:text-blue-400">skills</span>, showcases your <span className="font-semibold text-blue-600 dark:text-blue-400">projects</span>, and summarizes your <span className="font-semibold text-blue-600 dark:text-blue-400">experience</span> — all in one place.
        </p>

        <p className="text-gray-600 dark:text-gray-400 text-base max-w-3xl mx-auto leading-relaxed">
          Whether you're a developer, designer, freelancer, or creative professional, your personalized portfolio will help you stand out to potential employers, clients, and collaborators.
          Upload your resume, add detailed descriptions, and share your story with the world — all with a sleek and modern interface.
        </p>
      </section>

      <section className="flex flex-col md:flex-row justify-center gap-10 mt-12">
        <Feature icon="🚀" title="Easy to Use" description="Intuitive tools to quickly create and update your portfolio without any hassle." />
        <Feature icon="🎨" title="Customizable Design" description="Choose from elegant templates and personalize your look to match your style." />
        <Feature icon="🔗" title="Share Easily" description="Share your public profile link on social media or include it in job applications." />
      </section>

      <section className="pt-8 space-x-4">
        {!isLoggedIn ? (
          <a
            href="/login"
            className="inline-block bg-blue-600 text-white text-lg px-10 py-4 rounded-lg shadow-lg hover:bg-blue-700 transition transform hover:-translate-y-1"
            aria-label="Get started by logging in"
          >
            Get Started
          </a>
        ) : (
          <>
            <a
              href={`/user/${session.user?.id}`}
              className="inline-block bg-green-600 text-white text-lg px-8 py-3 rounded-lg shadow hover:bg-green-700 transition hover:-translate-y-1"
              aria-label="View your portfolio"
            >
              View Portfolio
            </a>
            <a
              href={`/dashboard/${session.user?.id}`}
              className="inline-block bg-gray-800 text-white text-lg px-8 py-3 rounded-lg shadow hover:bg-gray-900 transition hover:-translate-y-1"
              aria-label="Go to your dashboard"
            >
              Go to Dashboard
            </a>
          </>
        )}
      </section>
    </main>
  )
}

function Feature({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="flex flex-col items-center max-w-xs text-center">
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="font-semibold text-lg mb-1 text-gray-900 dark:text-white">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm">{description}</p>
    </div>
  )
}
