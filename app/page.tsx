
export default function HomePage() {
  return (
    <>
      <main className="max-w-4xl mx-auto px-6 py-20 text-center space-y-12">
        <section>
          <h1 className="text-5xl font-extrabold mb-6 text-gray-900">
            Showcase Your Skills with a Personal Portfolio
          </h1>

          <p className="text-gray-700 text-lg max-w-3xl mx-auto leading-relaxed mb-6">
            Build your professional identity with ease. This platform empowers you to craft a stunning portfolio that highlights your <span className="font-semibold text-blue-600">skills</span>, showcases your <span className="font-semibold text-blue-600">projects</span>, and summarizes your <span className="font-semibold text-blue-600">experience</span> — all in one place.
          </p>

          <p className="text-gray-600 text-base max-w-3xl mx-auto leading-relaxed">
            Whether you're a developer, designer, freelancer, or creative professional, your personalized portfolio will help you stand out to potential employers, clients, and collaborators.
            Upload your resume, add detailed descriptions, and share your story with the world — all with a sleek and modern interface.
          </p>
        </section>

        <section className="flex flex-col md:flex-row justify-center gap-10 mt-12">
          <div className="flex flex-col items-center max-w-xs">
            <div className="text-4xl mb-3">🚀</div>
            <h3 className="font-semibold text-lg mb-1">Easy to Use</h3>
            <p className="text-gray-600 text-sm">Intuitive tools to quickly create and update your portfolio without any hassle.</p>
          </div>

          <div className="flex flex-col items-center max-w-xs">
            <div className="text-4xl mb-3">🎨</div>
            <h3 className="font-semibold text-lg mb-1">Customizable Design</h3>
            <p className="text-gray-600 text-sm">Choose from elegant templates and personalize your look to match your style.</p>
          </div>

          <div className="flex flex-col items-center max-w-xs">
            <div className="text-4xl mb-3">🔗</div>
            <h3 className="font-semibold text-lg mb-1">Share Easily</h3>
            <p className="text-gray-600 text-sm">Share your public profile link on social media or include it in job applications.</p>
          </div>
        </section>

        <section>
          <a
            href="/login"
            className="inline-block bg-blue-600 text-white text-lg px-10 py-4 rounded-lg shadow-lg hover:bg-blue-700 transition transform hover:-translate-y-1"
          >
            Get Started
          </a>
        </section>
      </main>
    </>
  );
}
