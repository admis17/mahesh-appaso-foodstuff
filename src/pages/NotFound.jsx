import Seo from '../components/Seo'
import Button from '../components/Button'
import SectionTag from '../components/SectionTag'

export default function NotFound() {
  return (
    <>
      <Seo
        title="Page Not Found | Mahesh Rice Trading"
        description="The page you're looking for doesn't exist."
        path="/404"
        noindex
      />
      <section className="bg-ivory min-h-[70vh] flex items-center">
        <div className="max-w-2xl mx-auto px-6 py-24 text-center">
          <SectionTag className="justify-center">404</SectionTag>
          <h1 className="display-heading text-[clamp(2rem,4vw,3rem)] text-ink mt-5 mb-6">
            We Couldn&apos;t Find That <span className="display-accent text-rust">Page</span>
          </h1>
          <p className="text-slate text-lg mb-9 leading-relaxed">
            The page you're looking for may have moved or no longer exists. Try one of these instead.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button to="/" variant="gold" size="lg">Back to Home</Button>
            <Button to="/products" variant="outline-dark" size="lg">View Products</Button>
          </div>
        </div>
      </section>
    </>
  )
}
