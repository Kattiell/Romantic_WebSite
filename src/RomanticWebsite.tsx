import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Heart, ChevronLeft, ChevronRight } from 'lucide-react';

interface TimeCount {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface LanternProps {
  index: number;
  left: number;
  delay: number;
  size: number;
  duration: number;
  speedVariation: number;
}

interface Config {
  birthDate: Date;
  relationshipStartDate: Date;
  backgroundImage: string;
  loveName: string;
  backgroundOpacity: number;
  unlockPassword: string;
  unlockPhoto: string;
  backgroundMusic: string;
}

const FloatingLantern: React.FC<LanternProps> = ({ index, left, delay, size, duration, speedVariation }) => {
  const sunRotationSpeed = 8 + (index % 3) * 2;
  
  return (
    <div
      className="absolute bottom-0 rounded-md pointer-events-none flex items-center justify-center relative"
      style={{
        left: `${left}%`,
        width: `${size}px`,
        height: `${size * 2}px`,
        background: 'linear-gradient(to top, #ffdb9b, #fff1c1)',
        willChange: 'transform, opacity',
        animation: `floatUp ${duration * speedVariation}s linear infinite, lanternGlow ${4 + (index % 2)}s ease-in-out infinite`,
        animationDelay: `${delay}s, ${(index % 3) * 0.7 - 2}s`
      }}
    >
      <svg 
        width={size * 0.7} 
        height={size * 0.7} 
        viewBox="0 0 100 100" 
        className="opacity-100 relative z-10"
        style={{
          animation: `rotateSun ${sunRotationSpeed}s linear infinite, innerGlow ${3 + (index % 2)}s ease-in-out infinite`,
          animationDelay: `${-sunRotationSpeed/2}s, ${-(index % 3) * 0.7 - 1}s`,
          willChange: 'transform, opacity',
          filter: 'drop-shadow(0 0 6px rgba(255, 215, 0, 0.7))'
        }}
      >
        <g fill="#FFD700" stroke="#000000" strokeWidth="1.5">
          <path d="M50,8 L50,28" />
          <path d="M75,25 L60,40" />
          <path d="M92,50 L72,50" />
          <path d="M75,75 L60,60" />
          <path d="M50,92 L50,72" />
          <path d="M25,75 L40,60" />
          <path d="M8,50 L28,50" />
          <path d="M25,25 L40,40" />
        </g>
        
        <circle 
          cx="50" 
          cy="50" 
          r="20" 
          fill="url(#sunGradient)" 
          stroke="#000000" 
          strokeWidth="1.5"
        />
        
        <defs>
          <radialGradient id="sunGradient" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#FFFF99" />
            <stop offset="70%" stopColor="#FFD700" />
            <stop offset="100%" stopColor="#FFA500" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
};

const RomanticWebsite: React.FC = () => {
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [isUnlocking, setIsUnlocking] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);
  const [showMainContent, setShowMainContent] = useState<boolean>(false);
  
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [isLetterModalOpen, setIsLetterModalOpen] = useState<boolean>(false);
  const [typedText, setTypedText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [isCandleLit, setIsCandleLit] = useState<boolean>(true);
  
  const [timeSinceBirth, setTimeSinceBirth] = useState<TimeCount>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const [timeSinceRelationship, setTimeSinceRelationship] = useState<TimeCount>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const audioRef = useRef<HTMLAudioElement>(null);

  const config: Config = {
    birthDate: new Date('2002-09-21T10:30:00'),
    relationshipStartDate: new Date('2024-09-17T00:00:00'),
    backgroundImage: 'nw.jpg',
    loveName: 'Meu Amor',
    backgroundOpacity: 0.5,
    unlockPassword: '170924',
    unlockPhoto: '14.jpeg',
    backgroundMusic: 'music.mp3'
  };

  const generateRandomLanterns = () => {
    const lanternCount = 60;
    return Array.from({ length: lanternCount }, (_, i) => ({
      left: Math.random() * 100,
      delay: -(Math.random() * 35 + 15),
      size: 10 + Math.random() * 12,
      duration: 18 + Math.random() * 12,
      speedVariation: 0.5 + Math.random() * 0.4
    }));
  };

  const [lanterns] = useState(generateRandomLanterns());

  const loveLetterText = `Meu amor, hoje celebramos o dia mais especial de todos: o dia em que o mundo teve a sorte de te receber. Cada aniversário seu é um presente para mim também, porque me lembra o quanto sou feliz por ter você ao meu lado.

Desde que te conheci, minha vida ganhou mais cor, mais sentido e muito mais amor. Você é meu porto seguro, meu sorriso favorito e o motivo dos meus melhores dias.

Neste dia especial, quero te lembrar o quanto te amo e o quanto sou grato por dividir a vida contigo. Que este novo ciclo seja cheio de alegrias, conquistas e sonhos realizados — estarei aqui, ao seu lado, em cada passo.

Feliz aniversário, meu amor. Que nunca falte amor, saúde, risadas... e muitos beijos meus! 💖

Seu coração apaixonado ❤️`;

  const photoSlides = [
    {
      title: "Primeiro Encontro",
      caption: "O momento em que soube que você era especial. Seu sorriso iluminou meu coração para sempre.",
      date: "24 de Agosto, 2024",
      image: "9.jpeg"
    },
    {
      title: "Primeiro Buquê",
      caption: "O primeiro buquê que te entreguei marcou o início de algo especial. Cada flor representava um sentimento, e todos eles eram sobre você.",
      date: "07 de Setembro, 2024",
      image: "11.jpeg"
    },
    {
      title: "Nosso Amor",
      caption: "Cada momento ao seu lado fortalece o que somos juntos — um amor verdadeiro, cheio de cumplicidade e carinho que só nós entendemos.",
      date: "18 de Setembro, 2024",
      image: "25.jpg"
    },
    {
      title: "Primeiro Cinema",
      caption: "A magia do filme refletida no brilho dos seus olhos fez cada segundo da surpresa valer a pena.",
      date: "20 de Setembro, 2024",
      image: "10.jpeg"
    },
    {
      title: "Primeiro beijo style",
      caption: "Entre cenas e sorrisos, esse beijo foi o verdadeiro clímax da noite — como se o filme tivesse sido escrito só pra nós.",
      date: "23 de Setembro, 2024",
      image: "4.jpeg"
    },
    {
      title: "Segundo Buquê",
      caption: "Se o primeiro foi o início, este é a confirmação. Cada flor carrega um pedaço do que construímos juntos — carinho, cuidado e a promessa de continuar florescendo ao seu lado.",
      date: "01 de Fevereiro, 2025",
      image: "22.jpeg"
    },
  ];

  const memories = [
    {
      title: "Memória 1",
      caption: "Um momento especial capturado no tempo, brilhando em nossos corações para sempre",
      image: "15.jpeg"
    },
    {
      title: "Memória 2", 
      caption: "Cada lembrança nossa é um tesouro que guardo com carinho no coração",
      image: "16.jpeg"
    },
    {
      title: "Memória 3",
      caption: "Momentos como estes fazem nossa história de amor ainda mais especial",
      image: "17.jpeg"
    },
    {
      title: "Memória 4",
      caption: "É vivendo esses instantes que percebo o quanto sou feliz por ter você",
      image: "18.jpeg"
    },
    {
      title: "Memória 5",
      caption: "Você transforma qualquer momento em uma lembrança eterna",
      image: "19.jpeg"
    },
    {
      title: "Memória 6",
      caption: "Nossa história é feita de detalhes simples que se tornam eternos",
      image: "20.jpeg"
    },
    {
      title: "Memória 7",
      caption: "Cada novo dia contigo é um capítulo lindo do nosso conto de amor",
      image: "21.jpeg"
    },
     {
      title: "Memória 8",
      caption: "Você transforma até o silêncio em lembrança boa",
      image: "23.jpg"
    },
         {
      title: "Memória 9",
      caption: "Tem dias que nem precisam de nada — só de você pra se tornarem inesquecíveis",
      image: "24.jpg"
    },
    
  ];

  const addDigit = (digit: string) => {
    if (password.length < 6) {
      setPassword(prev => prev + digit);
      setShowError(false);
    }
  };

  const removeDigit = () => {
    setPassword(prev => prev.slice(0, -1));
    setShowError(false);
  };

  const checkPassword = useCallback(() => {
    if (password === config.unlockPassword) {
      setIsUnlocking(true);
      
      if (config.backgroundMusic && audioRef.current) {
        audioRef.current.volume = 0.1;
        audioRef.current.play().catch(console.error);
        
        let currentVolume = 0.1;
        const volumeInterval = setInterval(() => {
          if (currentVolume < 0.7) {
            currentVolume += 0.05;
            if (audioRef.current) {
              audioRef.current.volume = Math.min(currentVolume, 0.7);
            }
          } else {
            clearInterval(volumeInterval);
          }
        }, 150);
      }
      
      setTimeout(() => {
        setShowMainContent(true);
      }, 1000);
      setTimeout(() => {
        setIsUnlocked(true);
      }, 3000);
    } else {
      setShowError(true);
      setPassword('');
      setTimeout(() => {
        setShowError(false);
      }, 2000);
    }
  }, [password, config.unlockPassword, config.backgroundMusic]);

  useEffect(() => {
    if (password.length === 6) {
      setTimeout(checkPassword, 500);
    }
  }, [password, checkPassword]);

  const scrollToNextSection = () => {
    const nextSection = document.querySelector('[data-section="birthday-cake"]');
    if (nextSection) {
      nextSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const nextSlide = (): void => {
    setCurrentSlide((prev: number) => (prev + 1) % photoSlides.length);
  };

  const prevSlide = (): void => {
    setCurrentSlide((prev: number) => (prev - 1 + photoSlides.length) % photoSlides.length);
  };

  const openLetterModal = () => {
    setIsLetterModalOpen(true);
    setTypedText('');
    setIsTyping(true);
    // Bloqueia scroll do body
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
  };

  const closeLetterModal = () => {
    setIsLetterModalOpen(false);
    setTypedText('');
    setIsTyping(false);
    // Restaura scroll do body
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.width = '';
  };

  useEffect(() => {
    const calculateTimes = () => {
      const now = new Date();
      
      if (config.birthDate && config.birthDate instanceof Date && !isNaN(config.birthDate.getTime())) {
        const birthDiff = now.getTime() - config.birthDate.getTime();
        if (birthDiff >= 0) {
          const birthDays = Math.floor(birthDiff / (1000 * 60 * 60 * 24));
          const birthHours = Math.floor((birthDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const birthMinutes = Math.floor((birthDiff % (1000 * 60 * 60)) / (1000 * 60));
          const birthSeconds = Math.floor((birthDiff % (1000 * 60)) / 1000);

          setTimeSinceBirth({ 
            days: birthDays, 
            hours: birthHours, 
            minutes: birthMinutes, 
            seconds: birthSeconds 
          });
        }
      }

      if (config.relationshipStartDate && config.relationshipStartDate instanceof Date && !isNaN(config.relationshipStartDate.getTime())) {
        const relationshipDiff = now.getTime() - config.relationshipStartDate.getTime();
        if (relationshipDiff >= 0) {
          const relationshipDays = Math.floor(relationshipDiff / (1000 * 60 * 60 * 24));
          const relationshipHours = Math.floor((relationshipDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const relationshipMinutes = Math.floor((relationshipDiff % (1000 * 60 * 60)) / (1000 * 60));
          const relationshipSeconds = Math.floor((relationshipDiff % (1000 * 60)) / 1000);

          setTimeSinceRelationship({ 
            days: relationshipDays, 
            hours: relationshipHours, 
            minutes: relationshipMinutes, 
            seconds: relationshipSeconds 
          });
        }
      }
    };

    calculateTimes();
    const interval = setInterval(calculateTimes, 1000);
    return () => clearInterval(interval);
  }, [config.birthDate, config.relationshipStartDate]);

  useEffect(() => {
    if (isTyping && isLetterModalOpen) {
      let index = 0;
      const timer = setInterval(() => {
        if (index < loveLetterText.length) {
          setTypedText(loveLetterText.slice(0, index + 1));
          index++;
        } else {
          setIsTyping(false);
          clearInterval(timer);
        }
      }, 50);

      return () => clearInterval(timer);
    }
  }, [isTyping, isLetterModalOpen, loveLetterText]);

  useEffect(() => {
    setVisibleSections(prev => new Set([...Array.from(prev), 'hero']));
    
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev: number) => (prev + 1) % photoSlides.length);
    }, 7000);

    // Cleanup para garantir que o scroll seja restaurado
    return () => {
      clearInterval(slideInterval);
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.classList.remove('modal-open');
    };
  }, [photoSlides.length]);

  // useEffect específico para gerenciar o modal
  useEffect(() => {
    if (isLetterModalOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    
    // Cleanup quando o modal fecha
    return () => {
      if (!isLetterModalOpen) {
        document.body.classList.remove('modal-open');
      }
    };
  }, [isLetterModalOpen]);

  return (
    <div className="min-h-screen relative w-full bg-gray-900" style={{ 
      overscrollBehavior: 'none',
      minHeight: '100vh'
    }}>
      <style>{`
        /* Estilos de animação e layout - SCROLL CORRIGIDO */
        * {
          box-sizing: border-box;
        }
        
        html {
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
          overscroll-behavior: none;
          height: 100%;
        }
        
        body {
          margin: 0;
          padding: 0;
          -webkit-overflow-scrolling: touch;
          overscroll-behavior: none;
          min-height: 100vh;
          height: 100%;
        }
        
        /* Scroll suave para dispositivos móveis */
        .main-container {
          -webkit-overflow-scrolling: touch;
          scroll-behavior: smooth;
          overscroll-behavior: none;
          min-height: 100vh;
        }
        
        /* Fix específico para prevenir fundo azul no mobile */
        #__next, [data-reactroot] {
          overscroll-behavior: none !important;
        }
        
        /* Previne overscroll em iOS Safari */
        .min-h-screen {
          overscroll-behavior: none;
          -webkit-overscroll-behavior: none;
        }
        
        /* Layout espacial sem bordas visuais - Otimizado para mobile */
        .top-section {
          width: 100%;
          min-height: 120px;
          margin-bottom: 15px;
        }
        
        @media (min-width: 640px) {
          .top-section {
            min-height: 160px;
            margin-bottom: 20px;
          }
        }
        
        .bottom-left {
          width: 100%;
          min-height: 280px;
        }
        
        .bottom-right {
          width: 100%;
          min-height: 200px;
        }
        
        @media (min-width: 640px) {
          .bottom-left {
            min-height: 320px;
          }
          
          .bottom-right {
            min-height: 280px;
          }
        }
        
        @media (min-width: 1024px) {
          .top-section {
            min-height: 180px;
          }
          
          .bottom-left {
            width: calc(60% - 10px);
            float: left;
            margin-right: 20px;
            min-height: 350px;
          }
          
          .bottom-right {
            width: calc(40% - 10px);
            float: right;
            min-height: 350px;
          }
        }
        
        .clear-float {
          clear: both;
        }
        
        @keyframes floatUp {
          0% {
            transform: translate3d(0px, 130vh, 0) scale(1);
            opacity: 0.7;
          }
          3% {
            opacity: 1;
            transform: translate3d(1px, 125vh, 0) scale(1);
          }
          10% {
            transform: translate3d(-2px, 110vh, 0) scale(0.99);
          }
          20% {
            transform: translate3d(3px, 90vh, 0) scale(0.97);
          }
          30% {
            transform: translate3d(-2px, 70vh, 0) scale(0.95);
          }
          40% {
            transform: translate3d(4px, 50vh, 0) scale(0.93);
          }
          50% {
            transform: translate3d(-1px, 30vh, 0) scale(0.92);
          }
          60% {
            transform: translate3d(3px, 10vh, 0) scale(0.91);
          }
          70% {
            transform: translate3d(-2px, -10vh, 0) scale(0.90);
          }
          80% {
            transform: translate3d(1px, -25vh, 0) scale(0.88);
            opacity: 1;
          }
          90% {
            transform: translate3d(-1px, -35vh, 0) scale(0.82);
            opacity: 0.6;
          }
          100% {
            transform: translate3d(1px, -45vh, 0) scale(0.75);
            opacity: 0;
          }
        }
        
        @keyframes floatingHearts {
          0% {
            transform: translateY(120vh) translateX(0px) rotate(0deg);
            opacity: 0;
          }
          5% {
            opacity: 0.8;
          }
          25% {
            transform: translateY(75vh) translateX(15px) rotate(90deg);
            opacity: 1;
          }
          50% {
            transform: translateY(40vh) translateX(-10px) rotate(180deg);
            opacity: 0.9;
          }
          75% {
            transform: translateY(15vh) translateX(20px) rotate(270deg);
            opacity: 0.7;
          }
          95% {
            opacity: 0.3;
          }
          100% {
            transform: translateY(-20vh) translateX(5px) rotate(360deg);
            opacity: 0;
          }
        }
        
        @keyframes petalsDown {
          0% {
            transform: translateY(-30vh) translateX(0px) rotate(0deg);
            opacity: 0;
          }
          5% {
            opacity: 0.7;
          }
          25% {
            transform: translateY(25vh) translateX(8px) rotate(45deg);
            opacity: 0.8;
          }
          50% {
            transform: translateY(60vh) translateX(-5px) rotate(90deg);
            opacity: 0.6;
          }
          75% {
            transform: translateY(90vh) translateX(12px) rotate(135deg);
            opacity: 0.4;
          }
          95% {
            opacity: 0.1;
          }
          100% {
            transform: translateY(130vh) translateX(15px) rotate(180deg);
            opacity: 0;
          }
        }
        
        @keyframes fallDown {
          0% {
            transform: translateY(-100vh) translateX(0px) rotate(0deg) scale(1);
            opacity: 0;
          }
          5% {
            opacity: 0.8;
            transform: translateY(-80vh) translateX(3px) rotate(15deg) scale(1.05);
          }
          15% {
            transform: translateY(-60vh) translateX(-5px) rotate(45deg) scale(0.95);
            opacity: 1;
          }
          25% {
            transform: translateY(-40vh) translateX(8px) rotate(75deg) scale(1.1);
            opacity: 0.9;
          }
          35% {
            transform: translateY(-20vh) translateX(-4px) rotate(105deg) scale(0.85);
            opacity: 1;
          }
          45% {
            transform: translateY(0vh) translateX(6px) rotate(135deg) scale(1);
            opacity: 0.8;
          }
          55% {
            transform: translateY(20vh) translateX(-8px) rotate(165deg) scale(0.9);
            opacity: 0.9;
          }
          65% {
            transform: translateY(40vh) translateX(5px) rotate(195deg) scale(1.05);
            opacity: 0.7;
          }
          75% {
            transform: translateY(60vh) translateX(-3px) rotate(225deg) scale(0.8);
            opacity: 0.6;
          }
          85% {
            transform: translateY(80vh) translateX(2px) rotate(255deg) scale(0.7);
            opacity: 0.4;
          }
          95% {
            transform: translateY(100vh) translateX(-1px) rotate(285deg) scale(0.6);
            opacity: 0.2;
          }
          100% {
            transform: translateY(120vh) translateX(0px) rotate(315deg) scale(0.5);
            opacity: 0;
          }
        }
        
        @keyframes sparkle {
          0%, 100% {
            opacity: 0;
            transform: translateY(0px) translateX(0px) scale(0) rotate(0deg);
          }
          10% {
            opacity: 0.5;
            transform: translateY(-5px) translateX(2px) scale(0.8) rotate(45deg);
          }
          25% {
            opacity: 1;
            transform: translateY(-10px) translateX(-3px) scale(1.2) rotate(90deg);
          }
          50% {
            opacity: 0.8;
            transform: translateY(-8px) translateX(4px) scale(1) rotate(180deg);
          }
          75% {
            opacity: 0.6;
            transform: translateY(-12px) translateX(-2px) scale(1.5) rotate(270deg);
          }
          90% {
            opacity: 0.3;
            transform: translateY(-15px) translateX(1px) scale(0.9) rotate(320deg);
          }
        }
        
        @keyframes unlockReveal {
          0% {
            opacity: 1;
            backdrop-filter: blur(10px);
            transform: scale(1);
          }
          30% {
            opacity: 0.8;
            backdrop-filter: blur(15px);
            transform: scale(1.02);
          }
          60% {
            opacity: 0.4;
            backdrop-filter: blur(25px);
            transform: scale(1.05);
          }
          80% {
            opacity: 0.2;
            backdrop-filter: blur(35px);
            transform: scale(1.08);
          }
          100% {
            opacity: 0;
            backdrop-filter: blur(50px);
            transform: scale(1.1);
          }
        }
        
        @keyframes contentFadeIn {
          0% {
            opacity: 0;
            transform: scale(0.95) translateY(20px);
            filter: blur(10px);
          }
          40% {
            opacity: 0.3;
            transform: scale(0.97) translateY(10px);
            filter: blur(5px);
          }
          70% {
            opacity: 0.7;
            transform: scale(0.99) translateY(5px);
            filter: blur(2px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0px);
            filter: blur(0px);
          }
        }
        
        @keyframes unlockParticles {
          0% {
            opacity: 0;
            transform: scale(0) rotate(0deg);
          }
          20% {
            opacity: 1;
            transform: scale(1) rotate(90deg);
          }
          80% {
            opacity: 1;
            transform: scale(1.5) rotate(270deg);
          }
          100% {
            opacity: 0;
            transform: scale(2) rotate(360deg);
          }
        }
        
        @keyframes magicCircle {
          0% {
            opacity: 0;
            transform: scale(0) rotate(0deg);
            border-radius: 50%;
          }
          50% {
            opacity: 0.8;
            transform: scale(1) rotate(180deg);
            border-radius: 50%;
          }
          100% {
            opacity: 0;
            transform: scale(3) rotate(360deg);
            border-radius: 0%;
          }
        }
        
        /* Otimizações gerais para mobile - SCROLL MELHORADO */
        .unlock-screen {
          background: rgba(45, 27, 0, 0.8);
          backdrop-filter: blur(10px);
          width: 100vw;
          height: 100vh;
          min-height: 600px;
          margin: 0;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
        }
        
        .unlock-container {
          animation: slideUp 1s ease-out;
          width: 100%;
          height: auto;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
        }
        
        /* Ajustes para telas muito pequenas */
        @media (max-height: 600px) {
          .unlock-container {
            padding: 0.5rem;
            justify-content: flex-start;
          }
          
          .top-section {
            min-height: 80px;
            margin-bottom: 10px;
          }
          
          .bottom-left {
            min-height: 200px;
          }
          
          .bottom-right {
            min-height: 140px;
          }
        }
        
        /* Otimização para iPhone SE e telas muito pequenas */
        @media (max-height: 568px) {
          .unlock-screen {
            min-height: unset;
          }
          
          .unlock-container {
            padding: 0.25rem;
            gap: 0.5rem;
          }
          
          .top-section {
            min-height: 60px;
            margin-bottom: 5px;
          }
        }
        
        .unlock-success {
          animation: unlockReveal 3s ease-out forwards;
          z-index: 10;
          width: 100vw;
          height: 100vh;
        }
        
        .main-content-revealing {
          animation: contentFadeIn 3s ease-out forwards;
        }
        
        @keyframes slideUp {
          0% {
            transform: translateY(100vh);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        @keyframes romanticGlow {
          0%, 100% {
            box-shadow: 0 0 10px rgba(255, 182, 193, 0.3);
          }
          50% {
            box-shadow: 0 0 20px rgba(255, 182, 193, 0.5);
          }
        }
        
        .password-dot {
          transition: all 0.4s ease;
        }
        
        .password-dot.filled {
          animation: romanticGlow 3s ease-in-out infinite;
        }
        
        @keyframes errorShake {
          0%, 20%, 40%, 60%, 80% {
            transform: translateX(-10px);
          }
          10%, 30%, 50%, 70%, 90% {
            transform: translateX(10px);
          }
          100% {
            transform: translateX(0);
          }
        }
        
        .error-display {
          animation: errorShake 0.5s ease-in-out;
        }
        
        @keyframes heartPulse {
          0%, 100% {
            transform: scale(1) rotate(0deg);
            opacity: 0.8;
          }
          25% {
            transform: scale(1.1) rotate(2deg);
            opacity: 1;
          }
          50% {
            transform: scale(1.2) rotate(-1deg);
            opacity: 0.9;
          }
          75% {
            transform: scale(1.05) rotate(1deg);
            opacity: 1;
          }
        }
        
        @keyframes flame {
          0% {
            transform: scale(1) rotate(-1deg);
            opacity: 1;
          }
          15% {
            transform: scale(1.05) rotate(1deg);
            opacity: 0.95;
          }
          30% {
            transform: scale(0.95) rotate(-0.5deg);
            opacity: 1;
          }
          45% {
            transform: scale(1.08) rotate(1.5deg);
            opacity: 0.9;
          }
          60% {
            transform: scale(0.92) rotate(-1deg);
            opacity: 1;
          }
          75% {
            transform: scale(1.03) rotate(0.5deg);
            opacity: 0.95;
          }
          90% {
            transform: scale(0.98) rotate(-0.8deg);
            opacity: 1;
          }
          100% {
            transform: scale(1) rotate(-1deg);
            opacity: 1;
          }
        }
        
        @keyframes smoke {
          0% {
            opacity: 0;
            transform: translateY(0) scale(0.3) rotate(0deg);
          }
          20% {
            opacity: 0.6;
            transform: translateY(-10px) scale(0.7) rotate(5deg);
          }
          40% {
            opacity: 0.8;
            transform: translateY(-20px) scale(1) rotate(-3deg);
          }
          60% {
            opacity: 0.6;
            transform: translateY(-30px) scale(1.3) rotate(8deg);
          }
          80% {
            opacity: 0.3;
            transform: translateY(-40px) scale(1.6) rotate(-5deg);
          }
          100% {
            opacity: 0;
            transform: translateY(-50px) scale(2) rotate(10deg);
          }
        }
        
        .candle-flame {
          animation: flame 2s ease-in-out infinite;
        }
        
        .candle-smoke {
          animation: smoke 3s ease-out infinite;
          opacity: 0;
        }
        
        .candle-smoke.visible {
          opacity: 1;
        }
        
        /* Melhorias para animações fluidas e performance */
        .floating-particle {
          transform: translateZ(0);
          backface-visibility: hidden;
          perspective: 1000px;
          will-change: transform, opacity;
        }
        
        /* Configurações para animações mais suaves */
        @media (prefers-reduced-motion: no-preference) {
          .floating-particle {
            animation-timing-function: linear;
            animation-fill-mode: both;
          }
        }
        
        /* Suavização global para animações */
        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        /* Otimização para GPU */
        .unlock-container,
        .floating-particle {
          transform: translate3d(0, 0, 0);
        }
        
        @keyframes lanternGlow {
          0%, 100% {
            box-shadow: 0 0 15px 3px rgba(255, 183, 0, 0.6);
          }
          50% {
            box-shadow: 0 0 20px 5px rgba(255, 183, 0, 0.8);
          }
        }
        
        @keyframes innerGlow {
          0%, 100% {
            opacity: 0.9;
          }
          50% {
            opacity: 1;
          }
        }
        
        @keyframes rotateSun {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        
        @keyframes neonGlow {
          0%, 100% {
            filter: drop-shadow(0 0 10px #ff1744) drop-shadow(0 0 20px #ff1744) drop-shadow(0 0 30px #ff1744);
          }
          50% {
            filter: drop-shadow(0 0 15px #ff1744) drop-shadow(0 0 30px #ff1744) drop-shadow(0 0 45px #ff1744);
          }
        }
        
        @keyframes heartBeat {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }
        
        @keyframes blink {
          50% { 
            border-color: transparent;
          }
        }
        
        .glass-card {
          background: rgba(55, 65, 81, 0.3);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 1rem;
        }
        
        .neon-heart {
          filter: drop-shadow(0 0 10px #ff1744) drop-shadow(0 0 20px #ff1744) drop-shadow(0 0 30px #ff1744);
          animation: neonGlow 2s ease-in-out infinite, heartBeat 1.5s ease-in-out infinite;
        }
        
        .typing-cursor::after {
          content: '|';
          animation: blink 1s infinite;
          color: #d50000;
        }

        /* Estilos para o modal da carta - SCROLL BLOQUEADO */
        .letter-modal-backdrop {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important; 
          right: 0 !important;
          bottom: 0 !important;
          z-index: 9999 !important;
          background: rgba(0, 0, 0, 0.9) !important;
          backdrop-filter: blur(10px) !important;
          overflow-y: auto !important;
          -webkit-overflow-scrolling: touch !important;
          padding: 16px !important;
          overscroll-behavior: contain !important;
        }

        .letter-modal-content {
          position: relative !important;
          z-index: 10000 !important;
          max-height: none !important;
          margin: auto !important;
          overflow: visible !important;
        }

        /* Bloqueia scroll do body quando modal está aberto */
        body.modal-open {
          overflow: hidden !important;
          position: fixed !important;
          width: 100% !important;
          height: 100vh !important;
        }

        /* Animações para os contadores de tempo */
        @keyframes counterGlow {
          0%, 100% {
            text-shadow: 0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor;
          }
          50% {
            text-shadow: 0 0 15px currentColor, 0 0 30px currentColor, 0 0 45px currentColor;
          }
        }

        @keyframes birthdayPulse {
          0%, 100% {
            transform: scale(1);
            filter: brightness(1);
          }
          50% {
            transform: scale(1.02);
            filter: brightness(1.1);
          }
        }

        @keyframes lovePulse {
          0%, 100% {
            transform: scale(1);
            filter: hue-rotate(0deg);
          }
          50% {
            transform: scale(1.02);
            filter: hue-rotate(10deg);
          }
        }

        .counter-birth {
          animation: counterGlow 3s ease-in-out infinite, birthdayPulse 4s ease-in-out infinite;
        }

        .counter-love {
          animation: counterGlow 2.5s ease-in-out infinite, lovePulse 3.5s ease-in-out infinite;
          animation-delay: 1s, 0.5s;
        }

        @keyframes floatingEmoji {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          25% {
            transform: translateY(-5px) rotate(2deg);
          }
          50% {
            transform: translateY(-3px) rotate(-1deg);
          }
          75% {
            transform: translateY(-7px) rotate(1deg);
          }
        }

        .floating-emoji {
          animation: floatingEmoji 3s ease-in-out infinite;
        }

        /* Fix para scroll touch em iOS - PREVINE FUNDO AZUL */
        * {
          -webkit-touch-callout: none;
          -webkit-text-size-adjust: none;
          -webkit-tap-highlight-color: rgba(0,0,0,0);
        }

        /* Melhor scroll para elementos com overflow */
        .scrollable {
          -webkit-overflow-scrolling: touch;
          overscroll-behavior: none;
          -webkit-overscroll-behavior: none;
        }
        
        /* Fix específico para iOS Safari - Previne bounce */
        @supports (-webkit-overflow-scrolling: touch) {
          html, body {
            overscroll-behavior-y: none;
            -webkit-overscroll-behavior-y: none;
            position: fixed;
            overflow: hidden;
            width: 100%;
            height: 100vh;
          }
          
          .main-container {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;
            overscroll-behavior: none;
          }
        }
        
        /* Fallback para outros navegadores mobile */
        @supports not (-webkit-overflow-scrolling: touch) {
          html, body {
            overscroll-behavior: none;
          }
        }
        
        /* Manter só as regras essenciais de overscroll sem forçar background */
        body::before {
          content: '';
          position: fixed;
          top: -100vh;
          left: 0;
          right: 0;
          height: 300vh;
          background: transparent;
          z-index: -1;
        }
      `}</style>

      {config.backgroundMusic && (
        <audio 
          ref={audioRef} 
          loop 
          autoPlay
          style={{ display: 'none' }}
        >
          <source src={`/${config.backgroundMusic}`} type="audio/mpeg" />
        </audio>
      )}

      {config.backgroundImage && (
        <div 
          className="fixed inset-0 bg-cover bg-center bg-no-repeat z-0 w-full h-full"
          style={{
            backgroundImage: `url('${config.backgroundImage.startsWith('http') ? config.backgroundImage : `/${config.backgroundImage}`}')`,
            margin: 0,
            padding: 0,
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
            minHeight: '100vh',
            width: '100vw',
            height: '100vh'
          }}
        />
      )}

      {!config.backgroundImage && (
        <div 
          className="fixed inset-0 z-0 w-full h-full" 
          style={{ 
            background: 'radial-gradient(ellipse at bottom, #1f2937 0%, #111827 50%, #000000 100%)', 
            margin: 0, 
            padding: 0,
            minHeight: '100vh'
          }} 
        />
      )}

      {config.backgroundImage && (
        <div 
          className="fixed inset-0 bg-black z-1 w-full h-full"
          style={{ opacity: config.backgroundOpacity, margin: 0, padding: 0 }}
        ></div>
      )}

      {!isUnlocked && (
        <div className={`fixed inset-0 z-10 unlock-screen flex items-center justify-center w-full h-full ${isUnlocking ? 'unlock-success' : ''}`} style={{ margin: 0, padding: 0 }}>
          
          {isUnlocking && (
            <div className="fixed inset-0 flex items-center justify-center z-30 pointer-events-none">
              <div className="text-center space-y-3 sm:space-y-4">
                <div className="text-4xl lg:text-5xl animate-pulse" style={{animationDuration: '3s'}}>💖</div>
                <div className="space-y-2 sm:space-y-3">
                  <p className="text-pink-300 text-xl sm:text-2xl lg:text-3xl font-bold animate-pulse" style={{ fontFamily: 'cursive', animationDuration: '2.5s' }}>
                    Abrindo nosso coração...
                  </p>
                  <p className="text-pink-200 text-sm sm:text-base lg:text-lg opacity-80">
                    ✨ Preparando nossa jornada de amor ✨
                  </p>
                  <div className="text-yellow-300 text-xs sm:text-sm lg:text-base opacity-70 italic">
                    "O amor é a chave que abre todos os corações" 💕
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {!isUnlocking && (
            <>
              <div className="fixed inset-0 pointer-events-none z-16 overflow-hidden">
                {Array.from({ length: 15 }, (_, i) => ( 
                  <div
                    key={`falling-heart-${i}`}
                    className="absolute floating-particle"
                    style={{
                      left: `${i * 6}%`, 
                      top: '0%',
                      fontSize: `${8 + (i % 4) * 3}px`,
                      color: i % 3 === 0 ? '#f472b6' : i % 3 === 1 ? '#ec4899' : '#be185d',
                      animation: `fallDown ${6 + (i % 3) * 2}s linear infinite`,
                      animationDelay: `${-i * 0.4}s`, 
                      willChange: 'transform',
                      opacity: 0.7 + (i % 3) * 0.1
                    }}
                  >
                    {i % 4 === 0 ? '💕' : i % 4 === 1 ? '❤️' : i % 4 === 2 ? '💖' : '💗'}
                  </div>
                ))}
              </div>
              <div className="fixed inset-0 pointer-events-none z-15 overflow-hidden">
                {Array.from({ length: 12 }, (_, i) => ( 
                  <div
                    key={`floating-heart-${i}`}
                    className="absolute text-pink-300 floating-particle"
                    style={{
                      left: `${i * 8}%`, 
                      fontSize: `${10 + (i % 4) * 3}px`,
                      animation: `floatingHearts ${8 + (i % 3) * 2}s linear infinite`,
                      animationDelay: `${-i * 0.5}s`,
                      willChange: 'transform',
                      opacity: 0.7 + (i % 3) * 0.1
                    }}
                  >
                    💕
                  </div>
                ))}
              </div>

              <div className="fixed inset-0 pointer-events-none z-14 overflow-hidden">
                {Array.from({ length: 15 }, (_, i) => ( 
                  <div
                    key={`petal-${i}`}
                    className="absolute text-pink-200 floating-particle"
                    style={{
                      left: `${i * 6}%`,
                      fontSize: `${5 + (i % 3) * 2}px`,
                      animation: `petalsDown ${6 + (i % 4) * 2}s linear infinite`,
                      animationDelay: `${-i * 0.4}s`,
                      willChange: 'transform',
                      opacity: 0.4 + (i % 2) * 0.2
                    }}
                  >
                    🌸
                  </div>
                ))}
              </div>

              <div className="fixed inset-0 pointer-events-none z-13 overflow-hidden">
                {Array.from({ length: 20 }, (_, i) => (
                  <div
                    key={`sparkle-${i}`}
                    className="absolute text-yellow-300 floating-particle"
                    style={{
                      left: `${i * 5}%`,
                      top: `${(i % 8) * 12.5}%`,
                      fontSize: `${3 + (i % 3) * 2}px`,
                      animation: `sparkle ${2 + (i % 3) * 1}s ease-in-out infinite`,
                      animationDelay: `${-i * 0.1}s`,
                      willChange: 'transform',
                      opacity: 0.5 + (i % 2) * 0.3
                    }}
                  >
                    ✨
                  </div>
                ))}
              </div>
            </>
          )}
          
          <div className="unlock-container max-w-6xl w-full h-full px-3 sm:px-6 lg:px-8 py-2 sm:py-6 relative z-20 scrollable">           
            {!isUnlocking && (
              <div className="top-section mb-3 sm:mb-6">
                <div className="text-center h-full flex flex-col justify-center space-y-2 sm:space-y-4">
                  <div className="text-3xl sm:text-5xl lg:text-7xl animate-pulse" style={{animationDuration: '3s', animationDelay: '-1.5s'}}>💖</div>
                  <h1 className="text-lg sm:text-2xl md:text-4xl lg:text-5xl font-bold text-pink-300 leading-tight" style={{ fontFamily: 'cursive' }}>
                    Nosso Momento Mágico
                  </h1>
                  <p className="text-pink-200 text-xs sm:text-sm md:text-lg lg:text-xl leading-relaxed">
                    Digite a data que marcou o início da nossa história de amor
                  </p>
                  <p className="text-pink-100 text-xs opacity-75 italic">
                    💕 (Formato: DDMMAA) 💕
                  </p>
                  <div className="text-yellow-300 text-xs sm:text-sm lg:text-base opacity-80">
                    ✨ O dia em que nossos corações se encontraram ✨
                  </div>
                </div>
              </div>
            )}
            
            {!isUnlocking && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-12 xl:gap-16 items-center justify-items-center w-full max-w-6xl mx-auto">           
              <div className="bottom-left order-2 lg:order-1 flex flex-col justify-center w-full max-w-xs sm:max-w-md mx-auto lg:max-w-none">
                <div className="h-full flex flex-col justify-center space-y-3 sm:space-y-6">
                  <div className="flex justify-center">
                    <div className="flex space-x-2 sm:space-x-3 lg:space-x-5">
                      {[...Array(6)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-5 h-5 sm:w-6 sm:h-6 lg:w-10 lg:h-10 rounded-full border-2 border-pink-300 password-dot ${
                            i < password.length ? 'filled' : ''
                          } ${showError ? 'error-display' : ''}`}
                          style={{
                            background: i < password.length ? 'linear-gradient(45deg, #FFB6C1, #FF69B4)' : 'transparent',
                            boxShadow: i < password.length ? '0 0 15px rgba(255, 182, 193, 0.8), 0 0 25px rgba(255, 105, 180, 0.4)' : 'none',
                            animation: i < password.length ? 'romanticGlow 2s ease-in-out infinite' : 'none'
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  {showError && (
                    <div className="text-center space-y-1 sm:space-y-2">
                      <div className="text-xl sm:text-2xl lg:text-3xl animate-bounce">💔</div>
                      <div className="space-y-1">
                        <p className="text-red-300 text-sm sm:text-base lg:text-xl font-bold error-display" style={{ fontFamily: 'cursive' }}>
                          Ops! Essa não é nossa data especial...
                        </p>
                        <p className="text-red-200 text-xs lg:text-base opacity-80">
                          Tente novamente, meu amor 💕
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="max-w-[240px] sm:max-w-xs mx-auto space-y-2 sm:space-y-4">
                    <div className="grid grid-cols-3 gap-2 sm:gap-3">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                        <button
                          key={num}
                          onClick={() => addDigit(num.toString())}
                          className="number-btn w-12 h-12 sm:w-14 sm:h-14 lg:w-20 lg:h-20 rounded-lg sm:rounded-xl text-base sm:text-lg lg:text-2xl font-bold text-gray-800 hover:text-gray-900 touch-manipulation relative overflow-hidden transition-all duration-300 transform hover:scale-105"
                          style={{
                            background: 'linear-gradient(135deg, #FFB6C1, #FFE4E1)',
                            border: '2px solid #FF69B4',
                            boxShadow: '0 4px 15px rgba(255, 182, 193, 0.3)'
                          }}
                          disabled={isUnlocking}
                        >
                          <span className="relative z-10">{num}</span>
                          <div className="absolute inset-0 bg-gradient-to-r from-pink-200 to-rose-200 opacity-0 hover:opacity-40 transition-opacity duration-300"></div>
                        </button>
                      ))}
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 sm:gap-3">
                      <div></div>
                      <button
                        onClick={() => addDigit('0')}
                        className="number-btn w-12 h-12 sm:w-14 sm:h-14 lg:w-20 lg:h-20 rounded-lg sm:rounded-xl text-base sm:text-lg lg:text-2xl font-bold text-gray-800 hover:text-gray-900 touch-manipulation relative overflow-hidden transition-all duration-300 transform hover:scale-105"
                        style={{
                          background: 'linear-gradient(135deg, #FFB6C1, #FFE4E1)',
                          border: '2px solid #FF69B4',
                          boxShadow: '0 4px 15px rgba(255, 182, 193, 0.3)'
                        }}
                        disabled={isUnlocking}
                      >
                        <span className="relative z-10">0</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-pink-200 to-rose-200 opacity-0 hover:opacity-40 transition-opacity duration-300"></div>
                      </button>
                      <button
                        onClick={removeDigit}
                        className="number-btn w-12 h-12 sm:w-14 sm:h-14 lg:w-20 lg:h-20 rounded-lg sm:rounded-xl text-sm sm:text-base lg:text-xl font-bold text-gray-800 hover:text-gray-900 flex items-center justify-center touch-manipulation relative overflow-hidden transition-all duration-300 transform hover:scale-105"
                        style={{
                          background: 'linear-gradient(135deg, #FFB6C1, #FFE4E1)',
                          border: '2px solid #FF69B4',
                          boxShadow: '0 4px 15px rgba(255, 182, 193, 0.3)'
                        }}
                        disabled={isUnlocking}
                      >
                        <span className="relative z-10">⌫</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-pink-200 to-rose-200 opacity-0 hover:opacity-40 transition-opacity duration-300"></div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* SEÇÃO INFERIOR DIREITA - FOTO DO CASAL */}
              <div className="bottom-right order-1 lg:order-2 flex justify-center items-center w-full">
                <div className="relative">
                  <div 
                    className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-80 lg:h-80 xl:w-88 xl:h-88 rounded-xl sm:rounded-2xl lg:rounded-[2rem] overflow-hidden shadow-2xl"
                    style={{
                      border: '3px solid #FF69B4',
                      boxShadow: '0 0 20px rgba(255, 182, 193, 0.5), 0 0 40px rgba(255, 105, 180, 0.3)',
                      animation: 'heartPulse 6s ease-in-out infinite'
                    }}
                  >
                    {config.unlockPhoto ? (
                      <img 
                        src={`/${config.unlockPhoto}`} 
                        alt="Nossa foto especial"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-pink-300 via-rose-400 to-red-400 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 opacity-20">
                          <div className="absolute top-2 left-2 sm:top-4 sm:left-4 text-lg sm:text-2xl animate-pulse" style={{animationDuration: '4s'}}>💕</div>
                          <div className="absolute top-4 right-3 sm:top-8 sm:right-6 text-base sm:text-xl animate-pulse" style={{animationDelay: '1s', animationDuration: '5s'}}>❤️</div>
                          <div className="absolute bottom-3 left-4 sm:bottom-6 sm:left-8 text-sm sm:text-lg animate-pulse" style={{animationDelay: '2s', animationDuration: '6s'}}>💖</div>
                          <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 text-lg sm:text-2xl animate-pulse" style={{animationDelay: '3s', animationDuration: '4s'}}>💝</div>
                        </div>
                        
                        <div className="text-white text-center p-2 sm:p-4 lg:p-8 relative z-10">
                          <div className="text-2xl sm:text-4xl md:text-5xl lg:text-8xl mb-1 sm:mb-3 lg:mb-6 animate-pulse">💕</div>
                          <div className="text-xs sm:text-base md:text-lg lg:text-3xl font-bold mb-1 sm:mb-2" style={{ fontFamily: 'cursive' }}>Nossa Foto Especial</div>
                          <div className="text-xs sm:text-sm lg:text-lg opacity-90 mb-1 sm:mb-2">Adicione uma foto que representa nosso amor</div>
                          <div className="text-xs opacity-70 mt-1 sm:mt-2">✨ Edite config.unlockPhoto ✨</div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* EFEITO DE BRILHO ROMÂNTICO */}
                  <div className="absolute inset-0 rounded-xl sm:rounded-2xl lg:rounded-[2rem] bg-gradient-to-t from-transparent via-pink-200/15 to-transparent animate-pulse" style={{animationDuration: '5s', animationDelay: '-2.5s'}}></div>
                  
                  {/* CORAÇÕES FLUTUANTES AO REDOR DA FOTO */}
                  <div className="absolute -top-2 -left-2 sm:-top-3 sm:-left-3 text-base sm:text-lg lg:text-2xl text-pink-300" style={{animation: 'heartPulse 7s ease-in-out infinite', animationDelay: '-3s'}}>💕</div>
                  <div className="absolute -top-1 -right-2 sm:-top-2 sm:-right-4 text-sm sm:text-base lg:text-xl text-red-300" style={{animation: 'heartPulse 9s ease-in-out infinite', animationDelay: '-5s'}}>❤️</div>
                  <div className="absolute -bottom-2 -left-2 sm:-bottom-3 sm:-left-4 text-sm sm:text-base lg:text-xl text-pink-400" style={{animation: 'heartPulse 8s ease-in-out infinite', animationDelay: '-2s'}}>💖</div>
                  <div className="absolute -bottom-1 -right-2 sm:-bottom-2 sm:-right-3 text-base sm:text-lg lg:text-2xl text-rose-300" style={{animation: 'heartPulse 10s ease-in-out infinite', animationDelay: '-7s'}}>💝</div>
                </div>
              </div>
            </div>
            )}
            
            {/* MENSAGEM ROMÂNTICA NO RODAPÉ */}
            {!isUnlocking && (
              <div className="text-center mt-4 sm:mt-6 lg:mt-12 px-4">
                <p className="text-pink-200 text-xs sm:text-sm lg:text-base italic opacity-80 max-w-2xl mx-auto leading-relaxed">
                  "O amor não se mede em tempo, mas em momentos que fazem o tempo parar" 💕
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 🌟 SITE PRINCIPAL */}
      {(isUnlocked || showMainContent) && (
        <div className={`main-container ${showMainContent && !isUnlocked ? 'opacity-0' : 'opacity-100'} transition-opacity duration-1000 ease-out`}>
          
          {/* 🏮 LANTERNAS FLUTUANTES */}
          <div className="fixed inset-0 pointer-events-none z-5 overflow-hidden">
            {lanterns.map((lantern, index) => (
              <FloatingLantern
                key={index}
                index={index}
                left={lantern.left}
                delay={lantern.delay}
                size={lantern.size}
                duration={lantern.duration}
                speedVariation={lantern.speedVariation}
              />
            ))}
          </div>

          {/* Coração Neon Flutuante */}
          <div className="fixed top-8 right-8 z-50">
            <button
              onClick={openLetterModal}
              className="relative group transition-all duration-300 hover:scale-110 touch-manipulation"
            >
              <Heart 
                className="w-20 h-20 text-red-500 neon-heart fill-current" 
                fill="currentColor"
              />
              
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white font-bold text-sm drop-shadow-lg">
                <span className="leading-tight">Leia</span>
                <span className="leading-tight">Carta</span>
              </div>
            </button>
          </div>

          {/* Modal da Carta de Amor */}
          {isLetterModalOpen && (
            <div 
              className="letter-modal-backdrop fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-90 backdrop-blur-lg scrollable" 
              style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  closeLetterModal();
                }
              }}
              onTouchMove={(e) => {
                // Previne scroll quando toca fora do conteúdo do modal
                if (e.target === e.currentTarget) {
                  e.preventDefault();
                }
              }}
            >
              <div className="letter-modal-content bg-gradient-to-br from-pink-100 to-rose-200 max-w-2xl w-full p-8 rounded-2xl shadow-2xl relative border-2 border-red-400 z-[10000] my-4">
                <button
                  onClick={closeLetterModal}
                  className="absolute top-4 right-4 text-red-600 hover:text-red-800 text-3xl font-bold z-[10001] transition-colors duration-200 touch-manipulation"
                >
                  ×
                </button>
                
                <div className="text-center mb-8">
                  <h2 className="text-4xl font-bold text-red-600 mb-4" style={{ fontFamily: 'cursive' }}>
                    Carta do Meu Coração
                  </h2>
                  <div className="w-16 h-1 bg-red-400 mx-auto"></div>
                </div>
                
                <div className="bg-white/50 p-8 rounded-lg border border-red-200">
                  <p className={`text-gray-700 text-lg leading-relaxed whitespace-pre-line ${isTyping ? 'typing-cursor' : ''}`}>
                    {typedText}
                  </p>
                </div>
                
                <div className="text-right mt-6">
                  <p className="text-red-600 font-bold text-xl italic" style={{ fontFamily: 'cursive' }}>
                    Com todo meu amor, Gabriel ❤️
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Conteúdo principal */}
          <div className="relative z-20 min-h-screen px-2 sm:px-4 py-4 sm:py-8 scrollable">
            
            {/* Seção Hero */}
            <section 
              className="h-screen flex items-center justify-center mb-4 sm:mb-8"
              data-section="hero"
            >
              <div className="text-center max-w-4xl mx-auto px-4">
                <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold mb-6 sm:mb-8 text-yellow-400">
                  {config.loveName}
                </h1>
                <Heart className="w-12 h-12 sm:w-16 sm:h-16 text-yellow-400 mx-auto mb-6 sm:mb-8 animate-pulse" fill="currentColor" />
                <p className="text-lg sm:text-xl md:text-2xl text-yellow-300 mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed">
                  Sob o brilho de mil lanternas, nosso amor se eleva eterno
                </p>
                <button 
                  onClick={scrollToNextSection}
                  className="glass-card text-yellow-300 px-6 sm:px-8 py-3 sm:py-4 rounded-full hover:bg-yellow-400/20 transition-all duration-300 transform hover:scale-105 flex items-center gap-2 mx-auto cursor-pointer text-sm sm:text-base touch-manipulation"
                >
                  Comece Nossa Jornada 
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </button>
              </div>
            </section>

            {/* Seção do Bolinho de Aniversário */}
            <section 
              className="py-8 sm:py-16 px-2 sm:px-4 mb-8 sm:mb-16"
              data-section="birthday-cake"
            >
              <div className="max-w-md mx-auto text-center">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-yellow-400 text-center mb-6 sm:mb-8">
                  Feliz Aniversário! 🎉
                </h2>
                
                <div className="flex justify-center">
                  <div 
                    className="relative cursor-pointer transition-all duration-300 hover:scale-105 touch-manipulation"
                    onMouseEnter={() => {
                      setIsCandleLit(false);
                    }}
                    onMouseLeave={() => {
                      setTimeout(() => setIsCandleLit(true), 800);
                    }}
                    onTouchStart={() => {
                      setIsCandleLit(false);
                      setTimeout(() => setIsCandleLit(true), 2000);
                    }}
                  >
                    <svg width="160" height="144" viewBox="0 0 200 180" className="mx-auto sm:w-[200px] sm:h-[180px]">
                      <ellipse cx="100" cy="160" rx="80" ry="15" fill="#8B4513" />
                      <rect x="20" y="80" width="160" height="80" rx="10" fill="#DEB887" />
                      <rect x="25" y="70" width="150" height="15" rx="7" fill="#FFB6C1" />
                      <circle cx="50" cy="120" r="8" fill="#FF69B4" />
                      <circle cx="100" cy="130" r="8" fill="#FF1493" />
                      <circle cx="150" cy="120" r="8" fill="#FF69B4" />
                      <rect x="95" y="40" width="10" height="40" rx="2" fill="#FFFF99" />
                      <line x1="100" y1="40" x2="100" y2="35" stroke="#8B4513" strokeWidth="2" />
                      
                      {isCandleLit && (
                        <g className="candle-flame">
                          <ellipse cx="100" cy="28" rx="8" ry="14" fill="url(#flameGradient)" />
                          <ellipse cx="100" cy="30" rx="6" ry="10" fill="url(#flameGradient2)" />
                        </g>
                      )}
                      
                      {!isCandleLit && (
                        <g className="candle-smoke visible">
                          <circle cx="100" cy="35" r="1.5" fill="#666" opacity="0.6" />
                          <circle cx="101" cy="30" r="2" fill="#999" opacity="0.4" />
                          <circle cx="99" cy="25" r="1.5" fill="#666" opacity="0.5" />
                          <circle cx="102" cy="20" r="2.5" fill="#ccc" opacity="0.3" />
                          <circle cx="98" cy="15" r="1.5" fill="#999" opacity="0.2" />
                        </g>
                      )}
                      
                      <defs>
                        <linearGradient id="flameGradient" x1="0%" y1="100%" x2="0%" y2="0%">
                          <stop offset="0%" stopColor="#FF4500" />
                          <stop offset="50%" stopColor="#FFA500" />
                          <stop offset="100%" stopColor="#FFFF00" />
                        </linearGradient>
                        <linearGradient id="flameGradient2" x1="0%" y1="100%" x2="0%" y2="0%">
                          <stop offset="0%" stopColor="#FF6347" />
                          <stop offset="50%" stopColor="#FFD700" />
                          <stop offset="100%" stopColor="#FFFF99" />
                        </linearGradient>
                      </defs>
                    </svg>
                    
                    <div className="text-center mt-3 sm:mt-4">
                      <p className="text-yellow-300 text-base sm:text-lg mb-1 sm:mb-2">
                        {isCandleLit ? "🕯️ Toque para apagar!" : "💨 Parabéns! Faça um pedido!"}
                      </p>
                      <p className="text-yellow-200 text-xs sm:text-sm opacity-75">
                        {isCandleLit ? "👆 Basta tocar na vela" : "✨ A vela vai reacender automaticamente"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Contadores de Tempo */}
            <section 
              className="flex justify-center mb-8 sm:mb-16 px-2 sm:px-4"
              data-section="birthday"
            >
              <div className="max-w-6xl w-full">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-yellow-400 text-center mb-8 sm:mb-12">
                  Nosso Tempo Juntos ⏰💕
                </h2>
                
                <div className={`grid gap-6 sm:gap-8 ${
                  (config.birthDate && config.birthDate instanceof Date && !isNaN(config.birthDate.getTime())) && 
                  (config.relationshipStartDate && config.relationshipStartDate instanceof Date && !isNaN(config.relationshipStartDate.getTime()))
                    ? 'grid-cols-1 lg:grid-cols-2' 
                    : 'grid-cols-1 max-w-lg mx-auto'
                }`}>
                  
                  {/* Contador - Tempo de Vida */}
                  {config.birthDate && config.birthDate instanceof Date && !isNaN(config.birthDate.getTime()) && (
                    <div className="glass-card p-6 sm:p-8 text-center">
                      <div className="mb-4 sm:mb-6">
                        <div className="text-3xl sm:text-4xl mb-2 floating-emoji">🎂</div>
                        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-yellow-400 mb-2">
                          Desde Que Você Nasceu
                        </h3>
                        <p className="text-gray-300 text-xs sm:text-sm opacity-75 italic">
                          Iluminando o mundo desde 21 de Setembro de 2002
                        </p>
                      </div>
                      
                      <div className="text-xl sm:text-3xl md:text-4xl font-mono font-bold text-yellow-400 mb-3 tracking-wider counter-birth">
                        {String(timeSinceBirth.days).padStart(4, '0')}:
                        {String(timeSinceBirth.hours).padStart(2, '0')}:
                        {String(timeSinceBirth.minutes).padStart(2, '0')}:
                        {String(timeSinceBirth.seconds).padStart(2, '0')}
                      </div>
                      
                      <p className="text-gray-300 text-xs sm:text-sm mb-3 sm:mb-4">
                        Dias : Horas : Min : Seg
                      </p>
                      
                      <p className="text-gray-300 text-xs sm:text-base leading-relaxed italic">
                        Cada segundo é um presente que você dá ao mundo, meu amor
                      </p>
                    </div>
                  )}

                  {/* Contador - Tempo de Relacionamento */}
                  {config.relationshipStartDate && config.relationshipStartDate instanceof Date && !isNaN(config.relationshipStartDate.getTime()) && (
                    <div className="glass-card p-6 sm:p-8 text-center">
                      <div className="mb-4 sm:mb-6">
                        <div className="text-3xl sm:text-4xl mb-2 floating-emoji" style={{ animationDelay: '1.5s' }}>💕</div>
                        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-pink-400 mb-2">
                          Nosso Amor Crescendo
                        </h3>
                        <p className="text-gray-300 text-xs sm:text-sm opacity-75 italic">
                          Desde 17 de Setembro de 2024 - O dia em que tudo começou
                        </p>
                      </div>
                      
                      <div className="text-xl sm:text-3xl md:text-4xl font-mono font-bold text-pink-400 mb-3 tracking-wider counter-love">
                        {String(timeSinceRelationship.days).padStart(3, '0')}:
                        {String(timeSinceRelationship.hours).padStart(2, '0')}:
                        {String(timeSinceRelationship.minutes).padStart(2, '0')}:
                        {String(timeSinceRelationship.seconds).padStart(2, '0')}
                      </div>
                      
                      <p className="text-gray-300 text-xs sm:text-sm mb-3 sm:mb-4">
                        Dias : Horas : Min : Seg
                      </p>
                      
                      <p className="text-gray-300 text-xs sm:text-base leading-relaxed italic">
                        Cada momento juntos constrói nossa história de amor
                      </p>
                    </div>
                  )}
                  
                </div>
                
                {/* Mensagem especial embaixo */}
                {(
                  (config.birthDate && config.birthDate instanceof Date && !isNaN(config.birthDate.getTime())) ||
                  (config.relationshipStartDate && config.relationshipStartDate instanceof Date && !isNaN(config.relationshipStartDate.getTime()))
                ) && (
                  <div className="text-center mt-6 sm:mt-8">
                    <div className="glass-card p-4 sm:p-6 max-w-2xl mx-auto">
                      <div className="text-2xl sm:text-3xl mb-3 floating-emoji" style={{ animationDelay: '3s' }}>✨💖✨</div>
                      <p className="text-yellow-300 text-sm sm:text-lg font-bold mb-2">
                        "O tempo não para, mas nosso amor cresce a cada segundo"
                      </p>
                      <p className="text-gray-300 text-xs sm:text-sm italic opacity-80">
                        {(config.birthDate && config.birthDate instanceof Date && !isNaN(config.birthDate.getTime())) && 
                         (config.relationshipStartDate && config.relationshipStartDate instanceof Date && !isNaN(config.relationshipStartDate.getTime()))
                          ? "Dois contadores, uma única verdade: você é o melhor de todos os meus tempos"
                          : "Cada momento é precioso quando é vivido com amor"
                        }
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Carrossel de Fotos */}
            <section 
              className="py-8 sm:py-16 px-2 sm:px-4 mb-8 sm:mb-16"
              data-section="photos-carousel"
            >
              <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-yellow-400 text-center mb-8 sm:mb-12">
                  Nossos Momentos Lindos
                </h2>
                
                <div className="flex items-center justify-center">
                  <button 
                    onClick={prevSlide}
                    className="bg-yellow-400/20 hover:bg-yellow-400/40 rounded-full p-3 sm:p-4 transition-all duration-300 transform hover:scale-110 mr-3 sm:mr-8 z-30 backdrop-blur-sm border border-yellow-400/30 touch-manipulation"
                  >
                    <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-yellow-400" />
                  </button>

                  <div className="relative w-full max-w-4xl overflow-hidden rounded-xl sm:rounded-2xl md:rounded-3xl">
                    <div 
                      className="flex transition-all duration-1000 ease-in-out"
                      style={{ 
                        transform: `translateX(-${currentSlide * 100}%)`,
                        willChange: 'transform'
                      }}
                    >
                      {photoSlides.map((slide, index) => (
                        <div key={index} className="w-full flex-shrink-0 px-2 sm:px-4">
                          <div className="glass-card p-4 sm:p-8 text-center">
                            <div className="aspect-square rounded-xl sm:rounded-2xl mb-4 sm:mb-6 flex items-center justify-center max-w-lg mx-auto overflow-hidden">
                              {slide.image ? (
                                <img 
                                  src={`/${slide.image}`} 
                                  alt={slide.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                                  <div className="text-white text-center p-4">
                                    <div className="text-2xl sm:text-4xl font-bold mb-2">{slide.title}</div>
                                    <div className="text-sm sm:text-lg opacity-80 mb-2">Adicione sua foto aqui</div>
                                    <div className="text-xs sm:text-sm opacity-70">Edite o campo 'image' no código</div>
                                  </div>
                                </div>
                              )}
                            </div>
                            
                            <h3 className="text-xl sm:text-2xl font-bold text-yellow-400 mb-2 sm:mb-4">{slide.title}</h3>
                            <p className="text-gray-300 text-sm sm:text-lg leading-relaxed max-w-2xl mx-auto">
                              {slide.caption}
                            </p>
                            <p className="text-yellow-300 text-xs sm:text-sm mt-2 opacity-75">
                              {slide.date}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-center mt-4 sm:mt-6 md:mt-8 space-x-2 sm:space-x-3">
                      {photoSlides.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentSlide(index)}
                          className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full transition-all duration-500 ease-out touch-manipulation ${
                            index === currentSlide 
                              ? 'bg-yellow-400 scale-125 shadow-lg' 
                              : 'bg-yellow-400/50 hover:bg-yellow-400/80 hover:scale-110'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <button 
                    onClick={nextSlide}
                    className="bg-yellow-400/20 hover:bg-yellow-400/40 rounded-full p-3 sm:p-4 transition-all duration-300 transform hover:scale-110 ml-3 sm:ml-8 z-30 backdrop-blur-sm border border-yellow-400/30 touch-manipulation"
                  >
                    <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-yellow-400" />
                  </button>
                </div>
              </div>
            </section>

            {/* Nossas Memórias */}
            <section 
              className="py-8 sm:py-16 px-2 sm:px-4 mb-8 sm:mb-16"
              data-section="memories"
            >
              <div className="max-w-2xl mx-auto">
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-yellow-400 text-center mb-8 sm:mb-12">
                  Nossas Memórias
                </h2>
                
                <div className="space-y-6 sm:space-y-8">
                  {memories.map((memory, i) => (
                    <div key={i} className="glass-card p-4 sm:p-6">
                      <div className="aspect-square rounded-xl sm:rounded-2xl mb-4 sm:mb-6 flex items-center justify-center overflow-hidden">
                        {memory.image ? (
                          <img 
                            src={`/${memory.image}`} 
                            alt={memory.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                            <div className="text-white text-center p-4">
                              <div className="text-xl sm:text-3xl font-bold mb-2">{memory.title}</div>
                              <div className="text-xs sm:text-sm opacity-80">Adicione sua foto aqui</div>
                            </div>
                          </div>
                        )}
                      </div>
                      <h4 className="text-xl sm:text-2xl font-bold text-yellow-400 mb-2 sm:mb-3 text-center">{memory.title}</h4>
                      <p className="text-gray-300 text-center leading-relaxed text-sm sm:text-base">
                        {memory.caption}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Seção final */}
            <section 
              className="flex justify-center py-8 sm:py-16 px-2 sm:px-4"
              data-section="final"
            >
              <div className="text-center">
                <Heart className="w-16 h-16 sm:w-20 sm:h-20 text-yellow-400 mx-auto mb-4 animate-pulse" fill="currentColor" />
                <p className="text-xl sm:text-2xl text-yellow-300 font-bold">
                  Para Sempre e Eternamente ✨
                </p>
              </div>
            </section>

          </div>
        </div>
      )}  
    </div>
  );
};

export default RomanticWebsite;