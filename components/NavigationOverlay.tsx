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

export default function NavigationOverlay() {
  const [maxIndex, setMaxIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [isPodcastOpen, setIsPodcastOpen] = useState(false);
  
  // CORREÇÃO: Usar ficheiro local diretamente
  const [audioSrc, setAudioSrc] = useState("/musica.mp3");
  
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    // 1. Timer Welcome Screen (5 segundos)
    const timer = setTimeout(() => setShowWelcome(false), 5000);

    // 2. Audio Initialization
    if (audioRef.current) {
        audioRef.current.volume = 0.3; 
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
    };
  }, []);

  const toggleSound = async () => {
    const audioEl = audioRef.current;
    if (!audioEl) return;

    try {
      if (audioEl.paused) {
        if (audioEl.readyState === 0 || audioEl.error) {
             console.log("Estado do áudio inválido, a recarregar...");
             audioEl.load();
        }
        await audioEl.play();
        setIsPlaying(true);
      } else {
        audioEl.pause();
        setIsPlaying(false);
      }
    } catch (err) {
      console.error("Erro na reprodução de áudio:", err);
      setIsPlaying(false);
    }
  };

  const handleClick = (index: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Evita que o clique propague para elementos abaixo ou cause efeitos colaterais
    
    // Lógica exclusiva para cada botão usando if/else if
    if (index === 0) {
      // Botão 0: Som (Amarelo/Sol) - Apenas alterna o som
      toggleSound();
    } else if (index === 1) {
      // Botão 1: Podcast (Azul) - Abre o menu de podcasts
      setIsPodcastOpen(true);
    } 
    // Outros botões (Vídeos, Jogos, etc.) não têm ação definida aqui, 
    // garantindo que não abrem o menu de podcast por engano.
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

        .earth-overlay {
          position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
          background: black url('/paisagem_Terra.png') no-repeat center center;
          background-size: cover;
          z-index: 20000; display: flex; align-items: center; justify-content: center;
          
          /* CORREÇÃO: Visibilidade e transição para evitar cliques fantasma quando oculto */
          opacity: ${isPodcastOpen ? '1' : '0'};
          visibility: ${isPodcastOpen ? 'visible' : 'hidden'};
          pointer-events: ${isPodcastOpen ? 'auto' : 'none'};
          
          /* A transição de visibilidade tem delay de 1s ao fechar para permitir o fade out */
          transition: opacity 1s ease-in-out, visibility 0s linear ${isPodcastOpen ? '0s' : '1s'};
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
      `}</style>

      <div 
        className="welcome-screen" 
        style={{ 
          opacity: showWelcome ? 1 : 0,
          pointerEvents: showWelcome ? 'all' : 'none'
        }}
        onClick={() => {
           if (audioRef.current && audioRef.current.paused) {
             toggleSound();
           }
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ color: 'white', letterSpacing: '1.5rem', fontSize: '2rem', textAlign: 'center' }}>Welcome Commander</h1>
          <p style={{ color: 'white', opacity: 0.4, fontSize: '10px', marginTop: '20px', letterSpacing: '2px' }}>
            CLIQUE PARA INICIAR SISTEMAS
          </p>
        </div>
      </div>

      <div className="earth-overlay">
        <div className="podcast-box">
          <h2 style={{ letterSpacing: '1rem', fontSize: '1.8rem', marginBottom: '5px' }}>EARTH</h2>
          <p style={{ fontSize: '9px', opacity: 0.6, letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '40px' }}>Transmissões da Biosfera</p>
          
          <div className="episode-list">
            {podcastEpisodes.map((ep, i) => (
              <a 
                key={i} 
                href={ep.url} 
                target="_blank"
                rel="noreferrer" 
                className="cosmic-button" 
                style={{ width: '100%', '--glow': 'rgba(34, 204, 255, 0.6)', justifyContent: 'center' } as React.CSSProperties}
              >
                {ep.title}
              </a>
            ))}
          </div>

          <button className="back-btn" onClick={() => setIsPodcastOpen(false)}>Regressar à Missão</button>
        </div>
      </div>

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