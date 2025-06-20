
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cream-50">
      {/* Simple Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/80 border-b border-white/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              UniFind
            </Link>
            
            <div className="flex items-center space-x-8">
              <Link to="/" className="text-gray-600 hover:text-purple-600 transition-colors">HOME</Link>
              <Link to="/catalog" className="text-gray-600 hover:text-purple-600 transition-colors">CATALOG</Link>
              <Link to="/about" className="text-purple-600 font-medium">ABOUT US</Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-20">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              About UniFind
            </h1>
            <p className="text-xl text-gray-600">
              Connecting our university community through lost and found items
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="backdrop-blur-md bg-white/40 rounded-3xl p-8 border border-white/30 shadow-xl mb-8"
          >
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed">
              UniFind was created to help students reunite with their lost belongings quickly and efficiently. 
              We understand how stressful it can be to lose important items during your academic journey, 
              and we're here to make the recovery process as smooth as possible.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="backdrop-blur-md bg-white/40 rounded-3xl p-8 border border-white/30 shadow-xl"
          >
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">How It Works</h2>
            <div className="space-y-4 text-gray-600">
              <p><strong>Report:</strong> Found something? Quickly report it with photos and details.</p>
              <p><strong>Search:</strong> Lost something? Use our smart filters to find it.</p>
              <p><strong>Connect:</strong> Get in touch with the finder or owner safely through our platform.</p>
              <p><strong>Reunite:</strong> Arrange a safe pickup location on campus.</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default About;
