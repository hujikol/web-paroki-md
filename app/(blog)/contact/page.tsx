import ContactForm from "@/components/contact/ContactForm";

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-12 text-center">
        <h1 className="text-5xl font-bold mb-4 text-gray-900 dark:text-white">
          Get in Touch
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Have a question or want to work together? We'd love to hear from you.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12">
        <ContactForm />
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
          <div className="text-3xl mb-3">📧</div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Email</h3>
          <p className="text-gray-600 dark:text-gray-400">We'll respond within 24 hours</p>
        </div>
        
        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
          <div className="text-3xl mb-3">💬</div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Support</h3>
          <p className="text-gray-600 dark:text-gray-400">Available Monday to Friday</p>
        </div>
        
        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
          <div className="text-3xl mb-3">🚀</div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Quick Response</h3>
          <p className="text-gray-600 dark:text-gray-400">Fast and helpful replies</p>
        </div>
      </div>
    </div>
  );
}
