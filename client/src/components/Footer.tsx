const Footer = () => {
  return (
    <footer className="border-t mt-8">
      <div className="max-w-6xl mx-auto px-4 py-6 text-sm text-gray-600 flex items-center justify-between">
        <p>© {new Date().getFullYear()} Movie Tickets</p>
        <p>Made with ❤️ for great movie nights</p>
      </div>
    </footer>
  )
}

export default Footer
