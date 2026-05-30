import React, { useState, useEffect, useRef } from 'react';

const menuItems = [
  { label: "Som On/Off", color: "rgba(255, 204, 0, 0.6)", icon: "🔊" },
  { label: "Podcast", color: "rgba(34, 204, 255, 0.6)", icon: "🎙️" },
  { label: "Vídeos", color: "rgba(255, 69, 0, 0.6)", icon: "🎬" },
  { label: "Vídeos: Alunos", color: "rgba(224, 174, 111, 0.6)", icon: "🎓" },
  { label: "Jogos", color: "rgba(223, 208, 181, 0.6)", icon: "🎮" },
  { label: "Bandas Desenhadas", color: "rgba(175, 238, 238, 0.6)", icon: "📚" }
];

const podcastEpisodes = [
  { title: "01 - O Cometa 3I/ATLAS", url: "https://youtu.be/aLWF3b7Wc-0" },
  { title: "02 - Prémio Nobel da Química (2025)", url: "https://youtu.be/GoTd7Gj5TsE" },
  { title: "03 - Chip Fotónico", url: "https://youtu.be/hNQ9_xlMJAs" },
  { title: "04 - Prémio Nobel da Física (2025)", url: "https://youtu.be/OW-HDBr-uKU" },
  { title: "05 - Podcast Virtual com o Prof. Doutor Hernâni Cidade", url: "https://youtu.be/BhhGYjoJc1w" },
  { title: "06 - Efeitos da Corrente Elétrica", url: "https://youtu.be/JDU6U92X7rg" },
  { title: "07 - Estrutura Atómica", url: "https://youtu.be/-nXaXyVGT8k" },
  { title: "08 - Distribuição Eletrónica de Átomos e Iões", url: "https://youtu.be/ZyoTgP7JTi4" },
  { title: "09 - Organização da Tabela Periódica", url: "https://youtu.be/pYFsGMUr1Lg" },
  { title: "10 - Metais e Não Metais", url: "https://youtu.be/ppmsUIeIjso" },
  { title: "11 - Metais Alcalinos e Alcalinoterrosos", url: "https://youtu.be/XFVbn7ZLuqQ" },
  { title: "12 - Halogéneos e Gases Nobres. Elementos Químicos no Corpo Humano.", url: "https://youtu.be/qosGVgNnBiI" },
  { title: "13 - Ligação Química. Ligação Covalente, Iónica e Metálica", url: "https://youtu.be/e5mLcRUKWpc" },
  { title: "14 - Hidrocarbonetos Saturados e Insaturados", url: "https://youtu.be/2b0hhC4P3VA" }
];

const videoItems = [
  { title: "01 - Feliz Natal, alumni!", url: "https://youtu.be/VatEyRKtvRs" },
  { title: "02 - Bom Carnaval, alumni!!", url: "https://youtu.be/sUgSt23DXFs" },
  { title: "03 - Banda Desenhada - Vida e Obra do Dr. Hernâni Cidade", url: "https://youtu.be/VtQXm3k-ot4" },
  { title: "04 - Andrei Shakarov - Pequena Biografia", url: "https://youtu.be/MFh1y30oSpY" },
  { title: "05 - Coro Química do 12.º A - Concerto de Páscoa", url: "https://youtu.be/0zQv_DbtSoU" },
  { title: "06 - Gerações dos Direitos Humanos (DAC Economia/Química - 12.º ano)", url: "https://youtu.be/a8n5y1r2iR0" }
];

const studentVideoItems = [
  { title: "01 - Sofia Zhuo - Metais da Tabela Periódica: Suas Propriedades e Aplicações", url: "https://youtu.be/_oWNXtW7n_A" },
  { title: "02 - Sofia Zhuo - Metais: Degradação, Proteção e Complexos", url: "https://youtu.be/TAb5-tRDndg" },
  { title: "03 - SOFIA ZHUO - SCC DR. HERNÂNI CIDADE (2026) - HIDROGÉNIO VERDE", url: "https://youtu.be/lhR2mSZyCyo" },
  { title: "04 - Alice Pita, Diogo Fernandes, Joana Pereira - SCC DR. HERNÂNI CIDADE (2026) - BATERIAS DO ESTADO SÓLIDO", url: "https://youtu.be/--kKgyUEYUA" },
  { title: "05 - Francisco Queiroz, Henrique Lezama, Luís Capitão e Luís Nunes - SCC DR. HERNÂNI CIDADE (2026) - NANOTECNOLOGIA", url: "https://youtu.be/y3ZB6BQIQGs" },
  { title: "06 - Catarina Caraças - Marie Curie", url: "https://youtu.be/DOQpk92HEW0" },
  { title: "07 - Francisco Queiroz, Henrique Lezama, Luís Capitão e Luís Nunes - Andrei Shakarov", url: "https://youtu.be/cTQU7fbTpow" },
  { title: "08 - Sofia Zhuo - Chien Shiung Wu", url: "https://youtu.be/IMQlnYgOhCs" },
  { title: "09 - Carolina Guerreiro - Lise Meitner", url: "https://youtu.be/5xL1mjEsKm8" },
  { title: "10 - Alice Pita, Diogo Fernandes, Joana Pereira - A Penicilina", url: "https://youtu.be/5K-fe9Tfzjw" },
  { title: "11 - Sofia Zhuo - A Sacarina", url: "https://youtu.be/vMjPVlougzg" },
  { title: "12 - Catarina Caraças - A Aspirina", url: "https://youtu.be/HqoL-S1Gblw" },
  { title: "13 - Francisco Queiroz, Henrique Lezama, Luís Capitão e Luís Nunes - O DDT", url: "https://youtu.be/F5X9btLwWbo" }
];

const gameItems = [
  { title: "01 - 9.º ano - M9 - Impulsão", url: "https://manuel-nita-9ano-impulsao-9sao.vercel.app/" },
  { title: "02 - 9.º ano - M10 - Circuitos Elétricos Simples", url: "https://manuel-nita-9ano-circuitoseletricos.vercel.app/" },
  { title: "03 - 9.º ano - [M13-M19] - Química", url: "https://quem-quer-ser-milionario-com-a-tp.netlify.app/" }
];

const comicsItems = [
  { title: "01 - O Mistério da Potência (M12 - Física)", url: "https://pdfhost.io/pt-PT/v/jKBcN9XWbM_O_mistério_da_potência" },
  { title: "02 - O Mistério da Estrutura Atómica (M13 - Química)", url: "https://pdfhost.io/pt-PT/v/YGe8xyzREW_O_Mistério_da_Estrutura_Atómica__M13_-_Química_" },
  { title: "03 - Distribuição Eletrónica de Átomo e Iões (M14 - Química)", url: "https://pdfhost.io/pt-PT/v/scGzz3KRg3_M14_-_Distribuição_Eletrónica_de_Átomo_e_Iões" },
  { title: "04 - Organização da Tabela Periódica (M15 - Química)", url: "https://pdfhost.io/pt-PT/v/vWbUHd8YeY_M15_-_Organização_da_Tabela_Periódica" },
  { title: "05 - Metais e Não Metais (M16 - Química)", url: "https://pdfhost.io/pt-PT/v/rrnhHTM5jK_Metais_e_Não_Metais" },
  { title: "06 - Metais e Não Metais (M16 - Química)", url: "https://pdfhost.io/pt-PT/v/zZhJpdtJju_M16_-_Metais_e_Não_Metais" },
  { title: "07 - Metais Alcalinos e Alcalinoterrosos (M17 - Química)", url: "https://pdfhost.io/pt-PT/v/wF7zb8cXMk_M17_-_Metais_Alcalinos_e_Alcalinoterroros" },
  { title: "08 - Halogénios. Gases Nobres. Elementos Químicos no Corpo Humano (M18 - Química)", url: "https://pdfhost.io/pt-PT/v/k7xAaY7QuE_M18_-_Halogénios__Gases_nobres__Elementos_Químicos_no_Corpo_Humano_" },
  { title: "09 - Ligação Química. Ligação Covalente, ligação iónica e ligação metálica (M19 - Química)", url: "https://pdfhost.io/pt-PT/v/Dn3DHWwYuk_M19_-_Ligação_Química__Ligação_covalente__ligação_iónica_e_ligação_metálica_" },
  { title: "10 - Hidrocarbonetos Saturados e Insaturados (M20 - Química)", url: "https://pdfhost.io/pt-PT/v/LjRcLhsT3e_M20_-_Hidrocarbonetos_Saturados_e_Insaturados" }
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

  // Áudio Local conforme instrução
  const [audioSrc] = useState("/musica.mp3");
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const fadeIntervalRef = useRef<number | null>(null);
  const TARGET_VOLUME = 0.3;

  // Função para fazer o Fade In de 5 segundos
  const fadeAudioIn = () => {
    const audio = audioRef.current;
    if (!audio) return;

    // Limpa intervalo anterior se existir
    if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);

    // Se o áudio estiver parado ou sem source carregado, tenta carregar
    if (audio.readyState === 0) {
        audio.load();
    }

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
    }).catch(e => {
        console.error("Erro ao iniciar áudio (Autoplay block ou erro de rede):", e);
        setIsPlaying(false);
    });
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
        // Não chamamos load() aqui automaticamente para evitar erro de autoplay bloqueado antes da interação
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
      // Botão 5: Bandas Desenhadas (Ciano Pálido/Urano)
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
            console.error("Erro ao carregar o ficheiro de áudio local (/musica.mp3):", e.currentTarget.error);
        }}
      />

      <style>{`
        .ui-fixed-container { 
            position: fixed; top: 60px; right: 40px; 
            display: flex; flex-direction: column; gap: 15px; 
            z-index: 10000; pointer-events: none; 
        }
        
        .cosmic-button {
          /* REMOVIDO pointer-events: all; para ser controlado pelas classes show/hide */
          position: relative; width: 240px; height: 48px;
          background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(20px) saturate(160%);
          border: 1px solid rgba(255, 255, 255, 0.1); border-left: 4px solid var(--glow);
          border-radius: 4px; color: white; display: flex; align-items: center; justify-content: center;
          font-family: 'Inter', sans-serif; font-size: 11px; text-transform: uppercase; letter-spacing: 0.2rem;
          cursor: pointer; transition: 0.4s; overflow: hidden;
          text-decoration: none;
        }
        
        /* CORREÇÃO MENU FANTASMA: pointer-events dinâmico */
        .cosmic-button.show { opacity: 1; transform: translateX(0); pointer-events: auto; }
        .cosmic-button.hide { opacity: 0; transform: translateX(60px); pointer-events: none; }
        
        .cosmic-button:hover { background: rgba(255, 255, 255, 0.1); }
        .btn-icon { position: absolute; left: 18px; opacity: 0.6; }

        .podcast-box {
          background: rgba(0, 0, 0, 0.6); backdrop-filter: blur(25px);
          padding: 60px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1);
          text-align: center; color: white; 
          width: 90%; max-width: 600px;
          box-shadow: 0 20px 50px rgba(0,0,0,0.8);
          display: flex; flex-direction: column; align-items: center;
          max-height: 85vh; overflow-y: auto; /* Scroll se for muito alto no mobile */
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

        /* --- RESPONSIVIDADE MOBILE --- */
        @media (max-width: 768px) {
            .ui-fixed-container {
                top: auto;
                bottom: 20px;
                right: 20px;
                gap: 8px;
            }
            
            .cosmic-button {
                width: 180px; /* Botões mais pequenos */
                height: 40px;
                font-size: 9px;
                letter-spacing: 0.1rem;
            }
            
            .podcast-box {
                padding: 30px 20px;
                width: 95%;
            }

            .podcast-box h2 {
                font-size: 1.4rem !important;
                letter-spacing: 0.5rem !important;
            }

            .welcome-title {
                font-size: 1.2rem !important;
                letter-spacing: 0.8rem !important;
            }
        }

        /* Overlay da Terra (Podcast) */
        .earth-overlay {
          position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
          background: transparent;
          z-index: 20000; display: flex; align-items: center; justify-content: center;
          opacity: ${isPodcastOpen ? '1' : '0'};
          visibility: ${isPodcastOpen ? 'visible' : 'hidden'};
          pointer-events: ${isPodcastOpen ? 'auto' : 'none'};
          transition: opacity 1s ease-in-out, visibility 0s linear ${isPodcastOpen ? '0s' : '1s'};
        }

        /* Overlay de Marte (Vídeos) */
        .mars-overlay {
          position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
          background: transparent;
          z-index: 20000; display: flex; align-items: center; justify-content: center;
          opacity: ${isVideoOpen ? '1' : '0'};
          visibility: ${isVideoOpen ? 'visible' : 'hidden'};
          pointer-events: ${isVideoOpen ? 'auto' : 'none'};
          transition: opacity 1s ease-in-out, visibility 0s linear ${isVideoOpen ? '0s' : '1s'};
        }

        /* Overlay de Júpiter (Vídeos: Alunos) */
        .jupiter-overlay {
          position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
          background: transparent;
          z-index: 20000; display: flex; align-items: center; justify-content: center;
          opacity: ${isStudentVideoOpen ? '1' : '0'};
          visibility: ${isStudentVideoOpen ? 'visible' : 'hidden'};
          pointer-events: ${isStudentVideoOpen ? 'auto' : 'none'};
          transition: opacity 1s ease-in-out, visibility 0s linear ${isStudentVideoOpen ? '0s' : '1s'};
        }

        /* Overlay de Saturno (Jogos) */
        .saturn-overlay {
          position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
          background: transparent;
          z-index: 20000; display: flex; align-items: center; justify-content: center;
          opacity: ${isGamesOpen ? '1' : '0'};
          visibility: ${isGamesOpen ? 'visible' : 'hidden'};
          pointer-events: ${isGamesOpen ? 'auto' : 'none'};
          transition: opacity 1s ease-in-out, visibility 0s linear ${isGamesOpen ? '0s' : '1s'};
        }

        /* Overlay de Construção (Urano/Imagem Pedida) */
        .construction-overlay {
          position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
          background: transparent;
          z-index: 20000; display: flex; align-items: center; justify-content: center;
          opacity: ${isConstructionOpen ? '1' : '0'};
          visibility: ${isConstructionOpen ? 'visible' : 'hidden'};
          pointer-events: ${isConstructionOpen ? 'auto' : 'none'};
          transition: opacity 1s ease-in-out, visibility 0s linear ${isConstructionOpen ? '0s' : '1s'};
        }

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
        {/* Fundo do Podcast */}
        <img 
          src="/gaia.png" 
          alt="Fundo Gaia" 
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: -1 }}
        />
        <div 
          className="podcast-box"
          style={{ 
              background: 'rgba(0, 0, 0, 0.2)', 
              backdropFilter: 'blur(5px)', 
              border: '1px solid rgba(175, 238, 238, 0.2)', 
              boxShadow: '0 20px 50px rgba(0,0,0,0.8)' 
          }}
        >
          <h2 style={{ letterSpacing: '1rem', fontSize: '1.8rem', marginBottom: '5px' }}>GAIA</h2>
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
        {/* Fundo de Marte */}
        <img 
          src="/marte.png" 
          alt="Fundo Marte" 
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: -1 }}
        />
        <div 
          className="podcast-box"
          style={{ 
              background: 'rgba(0, 0, 0, 0.2)', 
              backdropFilter: 'blur(5px)', 
              border: '1px solid rgba(255, 69, 0, 0.2)', 
              boxShadow: '0 20px 50px rgba(0,0,0,0.8)' 
          }}
        >
          <h2 style={{ letterSpacing: '1rem', fontSize: '1.8rem', marginBottom: '5px', color: '#ff4500' }}>MARTE</h2>
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
        {/* Fundo de Júpiter */}
        <img 
          src="/jupiter.png" 
          alt="Fundo Júpiter" 
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: -1 }}
        />
        <div 
          className="podcast-box"
          style={{ 
              background: 'rgba(0, 0, 0, 0.2)', 
              backdropFilter: 'blur(5px)', 
              border: '1px solid rgba(224, 174, 111, 0.2)', 
              boxShadow: '0 20px 50px rgba(0,0,0,0.8)' 
          }}
        >
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
        {/* Fundo de Saturno */}
        <img 
          src="/saturno.png" 
          alt="Fundo Saturno" 
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: -1 }}
        />
        <div 
          className="podcast-box"
          style={{ 
              background: 'rgba(0, 0, 0, 0.2)', 
              backdropFilter: 'blur(5px)', 
              border: '1px solid rgba(223, 208, 181, 0.2)', 
              boxShadow: '0 20px 50px rgba(0,0,0,0.8)' 
          }}
        >
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

      {/* OVERLAY DE BANDAS DESENHADAS */}
      <div className="construction-overlay">
        {/* Fundo da Banda Desenhada */}
        <img 
          src="/banda-desenhada.png" 
          alt="Fundo Banda Desenhada" 
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: -1 }}
        />
        <div 
            className="podcast-box" 
            style={{ 
                background: 'rgba(0, 0, 0, 0.2)', 
                backdropFilter: 'blur(5px)', 
                border: '1px solid rgba(175, 238, 238, 0.2)', 
                boxShadow: '0 20px 50px rgba(0,0,0,0.8)' 
            }}
        >
          <h2 style={{ letterSpacing: '1rem', fontSize: '1.8rem', marginBottom: '5px', color: '#afeeee' }}>BANDAS DESENHADAS</h2>
          <p style={{ fontSize: '9px', opacity: 0.6, letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '40px' }}>Narrativas Visuais</p>
          
          <div className="episode-list">
            {comicsItems.map((item, i) => (
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
                  '--glow': 'rgba(175, 238, 238, 0.8)', 
                  justifyContent: 'center' 
                } as React.CSSProperties}
              >
                {item.title}
              </button>
            ))}
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