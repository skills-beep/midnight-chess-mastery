
import { Github, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t py-8 mt-auto">
      <div className="container px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-muted-foreground text-center md:text-left">
            Designed and Developed by Bishal Sharma
          </p>
          
          <div className="flex items-center gap-4">
            <a 
              href="https://github.com/skills-beep" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="GitHub Profile"
            >
              <Github className="h-5 w-5" />
            </a>
            <a 
              href="https://www.linkedin.com/in/bishal-sharma-12b7211b6/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="LinkedIn Profile"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <a 
              href="mailto:bishalsharma153@gmail.com" 
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Email"
            >
              <Mail className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
