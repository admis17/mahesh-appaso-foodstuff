// `data` is always an object we build ourselves (never raw user input), so
// serializing it into a script tag here is safe.
export default function JsonLd({ data }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
