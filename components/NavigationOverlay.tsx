import React, { useState, useEffect, useRef } from 'react';

const menuItems = [
  { label: "Som On/Off", color: "rgba(255, 204, 0, 0.6)", icon: "🔊" },
  { label: "Podcast", color: "rgba(34, 204, 255, 0.6)", icon: "🎙️" },
  { label: "Vídeos", color: "rgba(255, 69, 0, 0.6)", icon: "🎬" },
  { label: "Vídeos: Alunos", color: "rgba(224, 174, 111, 0.6)", icon: "🎓" },
  { label: "Jogos", color: "rgba(223, 208, 181, 0.6)", icon: "🎮" },
  { label: "Em Construção", color: "rgba(175, 238, 238, 0.6)", icon: "🏗️" }
];

const podcastEpisodes = [
  { title: "01 - O Cometa 3I/ATLAS", url: "https://youtu.be/aLWF3b7Wc-0" },
  { title: "02 - Prémio Nobel da Química (2025)", url: "https://youtu.be/GoTd7Gj5TsE" },
  { title: "03 - Chip Fotónico", url: "https://youtu.be/hNQ9_xlMJAs" },
  { title: "04 - Prémio Nobel da Física (2025)", url: "https://youtu.be/OW-HDBr-uKU" },
  { title: "05 - Podcast Virtual com o Prof. Doutor Hernâni Cidade", url: "https://youtu.be/BhhGYjoJc1w" },
];

const videoItems = [
  { title: "01 - Banda Desenhada - Vida e Obra do Dr. Hernâni Cidade", url: "https://youtu.be/VtQXm3k-ot4" }
];

const studentVideoItems = [
  { title: "01 - Sofia Zhuo - Metais da Tabela Periódica: Suas Propriedades e Aplicações", url: "https://youtu.be/_oWNXtW7n_A" },
  { title: "02 - Sofia Zhuo - Metais: Degradação, Proteção e Complexos", url: "https://youtu.be/TAb5-tRDndg" }
];

const gameItems = [
  { title: "01 - 9.º ano - M9 - Impulsão", url: "https://manuel-nita-9ano-impulsao-9sao.vercel.app/" },
  { title: "02 - 9.º ano - M10 - Circuitos Elétricos Simples", url: "https://manuel-nita-9ano-circuitoseletricos.vercel.app/" }
];

export default function NavigationOverlay() {
  const [maxIndex, setMaxIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  
  // Estados dos Menus
  const [isPodcastOpen, setIsPodcastOpen] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [isStudentVideoOpen, setIsStudentVideoOpen] = useState(false);
  const [isGamesOpen, setIsGamesOpen] = useState(false);
  const [isConstructionOpen, setIsConstructionOpen] = useState(false);
  
  // Estado para lembrar se a música estava a tocar antes de abrir um menu
  const [wasPlayingBeforeMenu, setWasPlayingBeforeMenu] = useState(false);

  // CORREÇÃO: Usar ficheiro local diretamente
  const [audioSrc, setAudioSrc] = useState("/musica.mp3");
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const fadeIntervalRef = useRef<number | null>(null);
  const TARGET_VOLUME = 0.3;

  // Função para fazer o Fade In de 5 segundos
  const fadeAudioIn = () => {
    const audio = audioRef.current;
    if (!audio) return;

    // Limpa intervalo anterior se existir
    if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);

    audio.volume = 0;
    audio.play().then(() => {
      setIsPlaying(true);
      
      // 5000ms total / 50ms steps = 100 steps
      // Incremento = Target / Steps
      const stepTime = 50;
      const steps = 5000 / stepTime; 
      const volumeStep = TARGET_VOLUME / steps;

      fadeIntervalRef.current = window.setInterval(() => {
        if (audio.volume < TARGET_VOLUME) {
          // Math.min garante que não ultrapassa o target devido a arredondamentos
          audio.volume = Math.min(audio.volume + volumeStep, TARGET_VOLUME);
        } else {
          if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
        }
      }, stepTime);
    }).catch(e => console.error("Erro ao iniciar áudio:", e));
  };

  const stopAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
    audio.pause();
    setIsPlaying(false);
  };

  useEffect(() => {
    // 1. Timer Welcome Screen (5 segundos)
    const timer = setTimeout(() => setShowWelcome(false), 5000);

    // 2. Audio Initialization (Volume começa a 0 para o fade funcionar)
    if (audioRef.current) {
        audioRef.current.volume = 0; 
        audioRef.current.load();
    }

    // 3. Planet Scroll Logic
    const handlePlanetScroll = (e: any) => {
      const progress = e.detail?.offset || 0;
      let currentSection = 0;
      if (progress > 0.08) currentSection = 1;
      if (progress > 0.25) currentSection = 2;
      if (progress > 0.42) currentSection = 3;
      if (progress > 0.60) currentSection = 4;
      if (progress > 0.80) currentSection = 5;
      setMaxIndex(prev => Math.max(prev, currentSection));
    };

    window.addEventListener('planetScroll', handlePlanetScroll);
    
    return () => { 
        window.removeEventListener('planetScroll', handlePlanetScroll); 
        clearTimeout(timer);
        if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
    };
  }, []);

  // 4. Lógica de Pausa Automática quando abre/fecha overlays
  useEffect(() => {
    const anyMenuOpen = isPodcastOpen || isVideoOpen || isStudentVideoOpen || isGamesOpen || isConstructionOpen;

    if (anyMenuOpen) {
      // Se abriu algum menu e a música estava a tocar
      if (isPlaying) {
        setWasPlayingBeforeMenu(true);
        stopAudio();
      } else {
        setWasPlayingBeforeMenu(false);
      }
    } else {
      // Se fechou todos os menus e a música estava a tocar antes
      if (wasPlayingBeforeMenu) {
        fadeAudioIn();
        setWasPlayingBeforeMenu(false); // Reset
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPodcastOpen, isVideoOpen, isStudentVideoOpen, isGamesOpen, isConstructionOpen]);

  const toggleSound = async () => {
    const audioEl = audioRef.current;
    if (!audioEl) return;

    try {
      if (audioEl.paused) {
        fadeAudioIn();
      } else {
        stopAudio();
      }
    } catch (err) {
      console.error("Erro na reprodução de áudio:", err);
      setIsPlaying(false);
    }
  };

  const handleClick = (index: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Evita que o clique propague para elementos abaixo
    
    // Lógica exclusiva para cada botão
    if (index === 0) {
      // Botão 0: Som (Amarelo/Sol)
      toggleSound();
    } else if (index === 1) {
      // Botão 1: Podcast (Azul)
      setIsPodcastOpen(true);
    } else if (index === 2) {
      // Botão 2: Vídeos (Vermelho/Marte)
      setIsVideoOpen(true);
    } else if (index === 3) {
      // Botão 3: Vídeos: Alunos (Bege/Júpiter)
      setIsStudentVideoOpen(true);
    } else if (index === 4) {
      // Botão 4: Jogos (Dourado Pálido/Saturno)
      setIsGamesOpen(true);
    } else if (index === 5) {
      // Botão 5: Em Construção (Ciano Pálido/Urano)
      setIsConstructionOpen(true);
    }
  };

  const openLink = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <>
      <audio 
        ref={audioRef} 
        src={audioSrc}
        loop 
        preload="auto"
        onError={(e) => {
          console.warn(`Erro no carregamento do áudio local (${audioSrc}):`, e.currentTarget.error?.message);
        }}
      />

      <style>{`
        .ui-fixed-container { position: fixed; top: 60px; right: 40px; display: flex; flex-direction: column; gap: 15px; z-index: 10000; pointer-events: none; }
        
        .cosmic-button {
          pointer-events: all; position: relative; width: 240px; height: 48px;
          background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(20px) saturate(160%);
          border: 1px solid rgba(255, 255, 255, 0.1); border-left: 4px solid var(--glow);
          border-radius: 4px; color: white; display: flex; align-items: center; justify-content: center;
          font-family: 'Inter', sans-serif; font-size: 11px; text-transform: uppercase; letter-spacing: 0.2rem;
          cursor: pointer; transition: 0.4s; overflow: hidden;
          text-decoration: none;
        }
        .cosmic-button.show { opacity: 1; transform: translateX(0); }
        .cosmic-button.hide { opacity: 0; transform: translateX(60px); }
        .cosmic-button:hover { background: rgba(255, 255, 255, 0.1); }
        .btn-icon { position: absolute; left: 18px; opacity: 0.6; }

        /* Overlay da Terra (Podcast) */
        .earth-overlay {
          position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
          background: black url('/paisagem_Terra.png') no-repeat center center;
          background-size: cover;
          z-index: 20000; display: flex; align-items: center; justify-content: center;
          
          /* Visibilidade e transição */
          opacity: ${isPodcastOpen ? '1' : '0'};
          visibility: ${isPodcastOpen ? 'visible' : 'hidden'};
          pointer-events: ${isPodcastOpen ? 'auto' : 'none'};
          transition: opacity 1s ease-in-out, visibility 0s linear ${isPodcastOpen ? '0s' : '1s'};
        }

        /* Overlay de Marte (Vídeos) */
        .mars-overlay {
          position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
          /* Gradiente vermelho escuro para simular Marte */
          background: radial-gradient(circle at center, #3a1103 0%, #000000 90%);
          z-index: 20000; display: flex; align-items: center; justify-content: center;
          
          /* Visibilidade e transição */
          opacity: ${isVideoOpen ? '1' : '0'};
          visibility: ${isVideoOpen ? 'visible' : 'hidden'};
          pointer-events: ${isVideoOpen ? 'auto' : 'none'};
          transition: opacity 1s ease-in-out, visibility 0s linear ${isVideoOpen ? '0s' : '1s'};
        }

        /* Overlay de Júpiter (Vídeos: Alunos) */
        .jupiter-overlay {
          position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
          /* Gradiente bege/castanho para simular Júpiter */
          background: radial-gradient(circle at center, #8b6c42 0%, #2b1d0e 60%, #000000 90%);
          z-index: 20000; display: flex; align-items: center; justify-content: center;
          
          /* Visibilidade e transição */
          opacity: ${isStudentVideoOpen ? '1' : '0'};
          visibility: ${isStudentVideoOpen ? 'visible' : 'hidden'};
          pointer-events: ${isStudentVideoOpen ? 'auto' : 'none'};
          transition: opacity 1s ease-in-out, visibility 0s linear ${isStudentVideoOpen ? '0s' : '1s'};
        }

        /* Overlay de Saturno (Jogos) */
        .saturn-overlay {
          position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
          /* Gradiente dourado/pálido para Saturno */
          background: radial-gradient(circle at center, #dfd0b5 0%, #3e3b32 60%, #000000 90%);
          z-index: 20000; display: flex; align-items: center; justify-content: center;
          
          /* Visibilidade e transição */
          opacity: ${isGamesOpen ? '1' : '0'};
          visibility: ${isGamesOpen ? 'visible' : 'hidden'};
          pointer-events: ${isGamesOpen ? 'auto' : 'none'};
          transition: opacity 1s ease-in-out, visibility 0s linear ${isGamesOpen ? '0s' : '1s'};
        }

        /* Overlay de Construção (Urano/Imagem Pedida) */
        .construction-overlay {
          position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
          /* background removido em favor da tag img direta para melhor carregamento */
          background: transparent;
          z-index: 20000; display: flex; align-items: center; justify-content: center;
          
          /* Visibilidade e transição */
          opacity: ${isConstructionOpen ? '1' : '0'};
          visibility: ${isConstructionOpen ? 'visible' : 'hidden'};
          pointer-events: ${isConstructionOpen ? 'auto' : 'none'};
          transition: opacity 1s ease-in-out, visibility 0s linear ${isConstructionOpen ? '0s' : '1s'};
        }

        .podcast-box {
          background: rgba(0, 0, 0, 0.6); backdrop-filter: blur(25px);
          padding: 60px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1);
          text-align: center; color: white; 
          width: 90%; max-width: 600px;
          box-shadow: 0 20px 50px rgba(0,0,0,0.8);
          display: flex; flex-direction: column; align-items: center;
        }

        .episode-list {
          display: flex; flex-direction: column; gap: 12px; margin-top: 30px; width: 100%;
        }

        .back-btn {
          margin-top: 40px; padding: 12px 40px; background: rgba(255,255,255,0.9); color: black;
          border-radius: 2px; cursor: pointer; font-size: 10px; font-weight: bold;
          text-transform: uppercase; letter-spacing: 3px; border: none; transition: 0.3s;
        }
        .back-btn:hover { background: #ffcc00; }

        .welcome-screen { 
          position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; 
          display: flex; align-items: center; justify-content: center; 
          background: black; z-index: 999999; 
          transition: opacity 1.5s ease-out; 
          cursor: pointer;
        }

        @keyframes pulse-warning {
          0% { 
            transform: scale(1); 
            color: #ff8c00; 
            text-shadow: 0 0 10px rgba(255, 140, 0, 0.3); 
          }
          50% { 
            transform: scale(1.15); 
            color: #ffff00; 
            text-shadow: 
              0 0 20px rgba(255, 215, 0, 1),
              0 0 40px rgba(255, 165, 0, 0.8),
              0 0 60px rgba(255, 69, 0, 0.6);
          }
          100% { 
            transform: scale(1); 
            color: #ff8c00; 
            text-shadow: 0 0 10px rgba(255, 140, 0, 0.3); 
          }
        }

        .welcome-title {
          letter-spacing: 1.5rem;
          font-size: 2rem;
          text-align: center;
          text-transform: uppercase;
          animation: pulse-warning 2s infinite ease-in-out;
        }
      `}</style>

      <div 
        className="welcome-screen" 
        style={{ 
          opacity: showWelcome ? 1 : 0,
          pointerEvents: showWelcome ? 'all' : 'none'
        }}
        onClick={() => {
           // Iniciar música com fade-in ao clicar no welcome screen (se não estiver a tocar)
           if (audioRef.current && audioRef.current.paused) {
             fadeAudioIn();
           }
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <h1 className="welcome-title">Welcome Commander</h1>
          <p style={{ color: 'white', opacity: 0.4, fontSize: '10px', marginTop: '20px', letterSpacing: '2px' }}>
            CLIQUE PARA INICIAR SISTEMAS
          </p>
        </div>
      </div>

      {/* OVERLAY DE PODCAST (TERRA) */}
      <div className="earth-overlay">
        <div className="podcast-box">
          <h2 style={{ letterSpacing: '1rem', fontSize: '1.8rem', marginBottom: '5px' }}>EARTH</h2>
          <p style={{ fontSize: '9px', opacity: 0.6, letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '40px' }}>Transmissões da Biosfera</p>
          
          <div className="episode-list">
            {podcastEpisodes.map((ep, i) => (
              <button 
                key={i} 
                onClick={() => openLink(ep.url)}
                className="cosmic-button" 
                style={{ width: '100%', '--glow': 'rgba(34, 204, 255, 0.6)', justifyContent: 'center' } as React.CSSProperties}
              >
                {ep.title}
              </button>
            ))}
          </div>

          <button className="back-btn" onClick={() => setIsPodcastOpen(false)}>Regressar à Missão</button>
        </div>
      </div>

      {/* OVERLAY DE VÍDEOS (MARTE) */}
      <div className="mars-overlay">
        <div className="podcast-box">
          <h2 style={{ letterSpacing: '1rem', fontSize: '1.8rem', marginBottom: '5px', color: '#ff4500' }}>MARS</h2>
          <p style={{ fontSize: '9px', opacity: 0.6, letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '40px' }}>Arquivos Visuais</p>
          
          <div className="episode-list">
            {videoItems.map((item, i) => (
              <button 
                key={i} 
                onClick={() => openLink(item.url)}
                className="cosmic-button" 
                style={{ width: '100%', '--glow': 'rgba(255, 69, 0, 0.8)', justifyContent: 'center' } as React.CSSProperties}
              >
                {item.title}
              </button>
            ))}
          </div>

          <button className="back-btn" onClick={() => setIsVideoOpen(false)}>Regressar à Missão</button>
        </div>
      </div>

      {/* OVERLAY DE VÍDEOS: ALUNOS (JUPITER) */}
      <div className="jupiter-overlay">
        <div className="podcast-box">
          <h2 style={{ letterSpacing: '1rem', fontSize: '1.8rem', marginBottom: '5px', color: '#e0ae6f' }}>JÚPITER</h2>
          <p style={{ fontSize: '9px', opacity: 0.6, letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '40px' }}>Registos da Academia</p>
          
          <div className="episode-list">
            {studentVideoItems.map((item, i) => (
              <button 
                key={i} 
                onClick={() => openLink(item.url)}
                className="cosmic-button" 
                style={{ 
                  width: '100%', 
                  height: 'auto', 
                  minHeight: '48px', 
                  padding: '12px 20px', 
                  lineHeight: '1.4', 
                  textAlign: 'center', 
                  '--glow': 'rgba(224, 174, 111, 0.8)', 
                  justifyContent: 'center' 
                } as React.CSSProperties}
              >
                {item.title}
              </button>
            ))}
          </div>

          <button className="back-btn" onClick={() => setIsStudentVideoOpen(false)}>Regressar à Missão</button>
        </div>
      </div>

      {/* OVERLAY DE JOGOS (SATURNO) */}
      <div className="saturn-overlay">
        <div className="podcast-box">
          <h2 style={{ letterSpacing: '1rem', fontSize: '1.8rem', marginBottom: '5px', color: '#dfd0b5' }}>SATURNO</h2>
          <p style={{ fontSize: '9px', opacity: 0.6, letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '40px' }}>Simulações Interativas</p>
          
          <div className="episode-list">
            {gameItems.map((item, i) => (
              <button 
                key={i} 
                onClick={() => openLink(item.url)}
                className="cosmic-button" 
                style={{ 
                  width: '100%', 
                  height: 'auto', 
                  minHeight: '48px', 
                  padding: '12px 20px', 
                  lineHeight: '1.4', 
                  textAlign: 'center', 
                  '--glow': 'rgba(223, 208, 181, 0.8)', 
                  justifyContent: 'center' 
                } as React.CSSProperties}
              >
                {item.title}
              </button>
            ))}
          </div>

          <button className="back-btn" onClick={() => setIsGamesOpen(false)}>Regressar à Missão</button>
        </div>
      </div>

      {/* OVERLAY DE CONSTRUÇÃO (URANO/IMAGEM DE MARTE) */}
      <div className="construction-overlay">
        {/* Usamos img tag direta em vez de CSS background para garantir o carregamento correto */}
        <img 
          src="/paisagemmarte.jpg" 
          alt="Paisagem de Marte" 
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: -1 }}
        />
        <div className="podcast-box">
          <h2 style={{ letterSpacing: '1rem', fontSize: '1.8rem', marginBottom: '5px', color: '#afeeee' }}>EM CONSTRUÇÃO</h2>
          <p style={{ fontSize: '9px', opacity: 0.6, letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '40px' }}>Exploração Futura</p>
          
          <div className="text-sm text-gray-300 font-light" style={{ marginBottom: '30px' }}>
             Esta área do sistema está a ser mapeada.
          </div>

          <button className="back-btn" onClick={() => setIsConstructionOpen(false)}>Regressar à Missão</button>
        </div>
      </div>

      {/* MENU LATERAL */}
      <div className="ui-fixed-container">
        {menuItems.map((item, index) => (
          <button
            key={index}
            className={`cosmic-button ${index <= maxIndex ? 'show' : 'hide'}`}
            style={{ '--glow': item.color } as React.CSSProperties}
            onClick={(e) => handleClick(index, e)}
          >
            <span className="btn-icon">
               {index === 0 ? (isPlaying ? "🔊" : "🔇") : item.icon}
            </span>
            {item.label}
          </button>
        ))}
      </div>
    </>
  );
}