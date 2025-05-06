
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ThemeToggle } from "@/components/ThemeToggle";
import SoundControls from "@/components/SoundControls";
import { 
  Award, 
  Puzzle, 
  Users, 
  Settings,
  ChevronRight,
  Play,
  Clock,
  Trophy,
  Brain,
  Zap,
  BarChart2
} from "lucide-react";

// Chess piece animation
const ChessPiece = ({ piece, delay, x, y }) => (
  <motion.div
    className="absolute text-4xl md:text-6xl select-none"
    initial={{ opacity: 0, x, y: y - 100 }}
    animate={{ 
      opacity: [0, 1, 1, 0], 
      x: [x, x + 50, x + 100, x + 150],
      y: [y - 100, y, y + 50, y + 100],
      rotate: [0, 5, -5, 0]
    }}
    transition={{ 
      delay, 
      duration: 8, 
      repeat: Infinity, 
      ease: "easeInOut" 
    }}
  >
    {piece}
  </motion.div>
);

// Floating Element
const FloatingElement = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ y: 0 }}
    animate={{ y: [0, -10, 0] }}
    transition={{
      duration: 4,
      delay,
      repeat: Infinity,
      ease: "easeInOut"
    }}
  >
    {children}
  </motion.div>
);

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      
      {/* Animated Chess Pieces Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <ChessPiece piece="♟" delay={0} x={100} y={200} />
        <ChessPiece piece="♞" delay={1} x={300} y={400} />
        <ChessPiece piece="♜" delay={2} x={700} y={300} />
        <ChessPiece piece="♛" delay={3} x={900} y={200} />
        <ChessPiece piece="♚" delay={4} x={500} y={500} />
        <ChessPiece piece="♝" delay={5} x={200} y={600} />
      </div>
      
      <main className="flex-1 container px-4 py-8 md:py-16 relative z-10">
        {/* Hero Section with Glowing Effect */}
        <section className="mb-16">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className="mb-8"
            >
              <motion.div
                className="relative mx-auto w-24 h-24 md:w-32 md:h-32 mb-6"
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: 360 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
                <div className="absolute inset-2 rounded-full bg-primary/40" />
                <div className="absolute inset-4 rounded-full bg-primary/60" />
                <div className="absolute inset-6 rounded-full bg-primary/80 flex items-center justify-center">
                  <span className="text-3xl md:text-4xl text-white">♔</span>
                </div>
              </motion.div>
            </motion.div>
            
            <motion.h1 
              className="text-4xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              Welcome to Chess Master
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-muted-foreground mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              Play chess online against friends or challenge our AI opponent
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              <Link to="/play">
                <Button size="lg" className="text-lg px-8 gap-2 bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-400 shadow-lg">
                  Play Now <Play className="h-4 w-4" />
                </Button>
              </Link>
              
              <Link to="/play">
                <Button variant="outline" size="lg" className="text-lg px-8 gap-2 border-primary text-primary hover:bg-primary/10">
                  Play Against AI <Settings className="h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
        
        {/* Features Section with Cards */}
        <section className="mb-16">
          <motion.h2 
            className="text-3xl font-bold text-center mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Premium Features
          </motion.h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Users className="h-8 w-8 text-primary mb-4" />,
                title: "Multiplayer",
                description: "Challenge friends or find opponents online for competitive matches",
                color: "from-blue-500/20 to-blue-600/20",
                iconBg: "bg-blue-500"
              },
              {
                icon: <Puzzle className="h-8 w-8 text-primary mb-4" />,
                title: "Puzzles",
                description: "Improve your skills with a variety of chess puzzles at all difficulty levels",
                color: "from-green-500/20 to-green-600/20",
                iconBg: "bg-green-500"
              },
              {
                icon: <Award className="h-8 w-8 text-primary mb-4" />,
                title: "Achievements",
                description: "Earn badges and trophies as you master different aspects of chess",
                color: "from-yellow-500/20 to-yellow-600/20",
                iconBg: "bg-yellow-500"
              },
              {
                icon: <Brain className="h-8 w-8 text-primary mb-4" />,
                title: "AI Training",
                description: "Practice against our adaptive AI that learns from your playing style",
                color: "from-purple-500/20 to-purple-600/20",
                iconBg: "bg-purple-500"
              }
            ].map((feature, index) => (
              <motion.div 
                key={index}
                className={`bg-gradient-to-br ${feature.color} backdrop-blur-sm p-6 rounded-xl border border-white/10 shadow-xl hover:shadow-2xl transition-all duration-300`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <FloatingElement delay={index * 0.5}>
                  <div className={`${feature.iconBg} w-16 h-16 rounded-lg flex items-center justify-center text-white`}>
                    {feature.icon}
                  </div>
                </FloatingElement>
                <h3 className="text-xl font-bold mb-2 mt-4">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </section>
        
        {/* Why Choose Us Section */}
        <section className="mb-16">
          <motion.h2 
            className="text-3xl font-bold text-center mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Why Choose Chess Master
          </motion.h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Clock className="h-6 w-6" />,
                title: "Rapid Gameplay",
                description: "Quick matchmaking and smooth gameplay experience"
              },
              {
                icon: <Trophy className="h-6 w-6" />,
                title: "Daily Tournaments",
                description: "Compete in daily tournaments with players worldwide"
              },
              {
                icon: <Zap className="h-6 w-6" />,
                title: "Skill Development",
                description: "Advanced analysis tools to improve your chess skills"
              },
              {
                icon: <BarChart2 className="h-6 w-6" />,
                title: "Progress Tracking",
                description: "Track your rating progress and game statistics"
              },
              {
                icon: <Users className="h-6 w-6" />,
                title: "Global Community",
                description: "Join thousands of chess enthusiasts from around the world"
              },
              {
                icon: <Settings className="h-6 w-6" />,
                title: "Customization",
                description: "Personalize your chess experience with themes and piece styles"
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="flex gap-4 items-start"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="p-3 bg-primary/10 rounded-lg text-primary">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
        
        {/* CTA Section with Glowing Border */}
        <section className="mb-16">
          <div className="max-w-3xl mx-auto text-center bg-card/80 backdrop-blur-sm p-8 md:p-12 rounded-lg shadow-xl border border-primary/20 relative overflow-hidden">
            {/* Animated glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-500 rounded-lg blur opacity-30"></div>
            <div className="relative">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary to-purple-500 rounded-full flex items-center justify-center"
              >
                <span className="text-white text-3xl">♕</span>
              </motion.div>
              
              <h2 className="text-3xl font-bold mb-4">Ready to play?</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Jump into a game now and experience the new Chess Master
              </p>
              <Link to="/play">
                <Button size="lg" className="text-lg px-8 bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-400">
                  Start Playing
                </Button>
              </Link>
              
              <div className="mt-8">
                <h3 className="text-lg font-medium mb-3">Sound Settings</h3>
                <SoundControls />
              </div>
            </div>
          </div>
        </section>
        
        {/* Chess Board Animation */}
        <section className="mb-16">
          <div className="max-w-lg mx-auto">
            <motion.div 
              className="grid grid-cols-8 grid-rows-8 rounded-lg overflow-hidden shadow-xl"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              {Array.from({ length: 64 }).map((_, i) => {
                const row = Math.floor(i / 8);
                const col = i % 8;
                const isLight = (row + col) % 2 === 0;
                
                return (
                  <motion.div 
                    key={i}
                    className={`aspect-square ${isLight ? 'bg-[#F0D9B5]' : 'bg-[#B58863]'}`}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.005 }}
                  />
                );
              })}
            </motion.div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
