
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { ThemeToggle } from "@/components/ThemeToggle";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <main className="container px-4 py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
            Welcome to Chess Master
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8">
            Play chess online against friends or challenge our AI opponent
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/play">
              <Button size="lg" className="text-lg px-8">
                Play Now
              </Button>
            </Link>
            
            <Link to="/play">
              <Button variant="outline" size="lg" className="text-lg px-8">
                Play Against AI
              </Button>
            </Link>
          </div>
          
          <div className="mt-20 grid md:grid-cols-3 gap-8">
            <div className="bg-card p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-4">♟️</div>
              <h3 className="text-xl font-bold mb-2">Interactive Gameplay</h3>
              <p className="text-muted-foreground">
                Drag and drop pieces with legal move highlights and smooth animations
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-4">⏱️</div>
              <h3 className="text-xl font-bold mb-2">Timed Matches</h3>
              <p className="text-muted-foreground">
                10-minute timer per player with visual and countdown alerts
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-4">🤖</div>
              <h3 className="text-xl font-bold mb-2">AI Opponent</h3>
              <p className="text-muted-foreground">
                Challenge our computer opponent when friends aren't available
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="border-t py-8">
        <div className="container px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground">
              Chess Master - Play chess online
            </p>
            
            <div className="flex items-center gap-4">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
