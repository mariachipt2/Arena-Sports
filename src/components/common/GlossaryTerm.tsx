import React, { useState, useRef, useEffect } from 'react';

const GLOSSARY_DICTIONARY: { [key: string]: string } = {
  'xg': 'Gols Esperados (xG): Métrica que calcula a probabilidade de uma finalização virar gol, baseando-se em fatores como ângulo, distância do gol e posicionamento dos defensores.',
  'var': 'Árbitro de Vídeo (VAR): Tecnologia que permite revisar lances cruciais e polêmicos (como gols, pênaltis e cartões vermelhos) através de gravações em vídeo.',
  'formação': 'Formação Tática: A disposição estrutural dos jogadores no campo. Por exemplo, 4-3-3 indica 4 defensores, 3 meio-campistas e 3 atacantes.',
  'posse': 'Posse de Bola: O percentual de tempo em que uma equipe manteve o controle físico da bola durante a partida.',
  'finalizações': 'Finalizações: A soma de todas as tentativas de chute ou cabeceio direcionados ao gol adversário.',
  'chutes no gol': 'Chutes no Gol: Chutes que iriam direto para dentro da rede se o goleiro (ou o último defensor) não realizasse a defesa.',
  'impedimento': 'Impedimento: Infração marcada quando um atacante recebe a bola à frente do último defensor adversário no campo de ataque.',
  'faltas': 'Faltas: Infrações cometidas por contato físico excessivo ou jogadas que desrespeitam as regras do futebol.',
  'escanteio': 'Escanteio (Tiro de Canto): Cobrança realizada nos cantos do campo após a bola sair pela linha de fundo com último toque de um defensor.'
};

interface GlossaryTermProps {
  termKey: string;
  children: React.ReactNode;
}

export const GlossaryTerm: React.FC<GlossaryTermProps> = ({ termKey, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);
  const explanation = GLOSSARY_DICTIONARY[termKey.toLowerCase().trim()];

  // Fecha o tooltip se o usuário clicar fora dele
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  if (!explanation) {
    return <>{children}</>;
  }

  return (
    <span 
      ref={containerRef} 
      style={{ 
        position: 'relative', 
        display: 'inline-flex',
        alignItems: 'center',
        cursor: 'help'
      }}
      onClick={(e) => {
        e.stopPropagation();
        setIsOpen(!isOpen);
      }}
    >
      <span 
        style={{ 
          borderBottom: '1.5px dotted var(--color-primary)', 
          paddingBottom: '1px',
          color: 'inherit',
          fontWeight: 'inherit'
        }}
      >
        {children}
      </span>
      
      {/* Popover Explicativo */}
      {isOpen && (
        <span
          style={{
            position: 'absolute',
            bottom: '125%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '240px',
            backgroundColor: '#1f2533',
            color: '#ffffff',
            padding: '12px',
            borderRadius: '12px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.08)',
            fontSize: '0.75rem',
            fontWeight: 'normal',
            lineHeight: '1.4',
            textAlign: 'left',
            zIndex: 9999,
            cursor: 'default',
            display: 'block'
          }}
          onClick={(e) => e.stopPropagation()} // Evita fechar ao clicar dentro
        >
          {explanation}
          
          {/* Pequena seta apontando para o termo */}
          <span
            style={{
              position: 'absolute',
              top: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              borderWidth: '6px',
              borderStyle: 'solid',
              borderColor: '#1f2533 transparent transparent transparent',
              display: 'block',
              width: '0',
              height: '0'
            }}
          ></span>
        </span>
      )}
    </span>
  );
};

export default GlossaryTerm;
