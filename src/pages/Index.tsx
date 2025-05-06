
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
  ChevronRight
} from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      
      <main className="flex-1 container px-4 py-8 md:py-16">
        {/* Hero Section */}
        <section className="mb-16">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1 
              className="text-4xl md:text-6xl font-extrabold mb-6"
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
                <Button size="lg" className="text-lg px-8 gap-2">
                  Play Now <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
              
              <Link to="/play">
                <Button variant="outline" size="lg" className="text-lg px-8 gap-2">
                  Play Against AI <Settings className="h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
        
        {/* Features Section */}
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
                description: "Challenge friends or find opponents online for competitive matches"
              },
              {
                icon: <Puzzle className="h-8 w-8 text-primary mb-4" />,
                title: "Puzzles",
                description: "Improve your skills with a variety of chess puzzles at all difficulty levels"
              },
              {
                icon: <Award className="h-8 w-8 text-primary mb-4" />,
                title: "Achievements",
                description: "Earn badges and trophies as you master different aspects of chess"
              },
              {
                icon: <Settings className="h-8 w-8 text-primary mb-4" />,
                title: "AI Training",
                description: "Practice against our adaptive AI that learns from your playing style"
              }
            ].map((feature, index) => (
              <motion.div 
                key={index}
                className="bg-card p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {feature.icon}
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="mb-16">
          <div className="max-w-3xl mx-auto text-center bg-card p-8 md:p-12 rounded-lg shadow-md">
            <h2 className="text-3xl font-bold mb-4">Ready to play?</h2>
            <p className="text-lg text-muted-foreground mb-6">
              Jump into a game now and experience the new Chess Master
            </p>
            <Link to="/play">
              <Button size="lg" className="text-lg px-8">
                Start Playing
              </Button>
            </Link>
            
            <div className="mt-8">
              <h3 className="text-lg font-medium mb-3">Sound Settings</h3>
              <SoundControls />
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
