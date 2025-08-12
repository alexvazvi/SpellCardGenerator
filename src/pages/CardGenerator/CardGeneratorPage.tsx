import React, { useState, useRef, useEffect } from 'react';
import './CardGeneratorPage.css';
import PageContainer from '../../components/PageContainer';
import type { DraggableData } from 'react-rnd';
import tinycolor from 'tinycolor2';
import CardBackPreview from '../../components/CardBackPreview';
import GenericCardPreview from '../../components/GenericCardPreview';

type ElementName = 'title' | 'description' | 'footer' | 'image' | 'imageBack' | 'divider1' | 'divider2' | null;


function CardGeneratorPage() {
  // Card properties state
  const [cardProps, setCardProps] = useState({
    borderColor: '#8B4513',
    borderWidth: 3, // New state for border thickness
    fontFamily: 'serif',
    frame: '',
    frameBack: '',
    backgroundColor: '#F5DEB3',
    backgroundImage: null as string | null,
    backBackgroundColor: '#8B4513',
    backBackgroundImage: 'https://www.transparenttextures.com/patterns/leather.png',
    backPatternColor: '#000000',
    backPatternOpacity: 0.5,
  });

  const updateCardProps = (props: Partial<typeof cardProps>) => {
    setCardProps(prev => ({ ...prev, ...props }));
  };

  const defaultBorderColor = tinycolor(cardProps.borderColor).darken(20).toString();

  // Element properties state
  const [titleProps, setTitleProps] = useState({ 
    text: 'Bola de Fuego', x: 40, y: 20, width: 240, height: 'auto' as (number | 'auto'),
    color: '#000000',
    backgroundColor: 'rgba(0,0,0,0)',
    highlight: { active: false, color: '#ffff00' },
    stroke: { active: false, color: '#000000', width: 1 },
    border: { active: false, style: 'rounded', width: 2, color: defaultBorderColor }
  });
  const [descriptionProps, setDescriptionProps] = useState({ 
    text: 'Una explosión de llamas rugientes estalla en un punto de tu elección dentro del alcance. Cada criatura en una esfera de 20 pies de radio centrada en ese punto debe hacer una tirada de salvación de Destreza. Recibe 8d6 de daño por fuego si falla, o la mitad si tiene éxito.', x: 30, y: 180, width: 260, height: 'auto' as (number | 'auto'),
    color: '#000000',
    backgroundColor: 'rgba(0,0,0,0)',
    highlight: { active: false, color: '#ffff00' },
    stroke: { active: false, color: '#000000', width: 1 },
    border: { active: false, style: 'rounded', width: 2, color: defaultBorderColor }
  });
  const [footerProps, setFooterProps] = useState({
    text: 'D&D 5e Conjuro', x: 30, y: 380, width: 260, height: 'auto' as (number | 'auto'),
    color: '#000000',
    backgroundColor: 'rgba(0,0,0,0)',
    highlight: { active: false, color: '#ffff00' },
    stroke: { active: false, color: '#000000', width: 1 },
    border: { active: false, style: 'rounded', width: 2, color: defaultBorderColor }
  });

  // Image state
  const [image, setImage] = useState<string | null>(null);
  const [imageSize, setImageSize] = useState({ x: 85, y: 100, width: 150, height: 150 });
  const [imageRotation, setImageRotation] = useState(0);
  const [imageBorder, setImageBorder] = useState({ active: false, color: '#000000', width: 3, lockAspectRatio: true });

  const [imageBack, setImageBack] = useState<string | null>(null);
  const [imageBackSize, setImageBackSize] = useState({ x: 85, y: 150, width: 150, height: 150 });


  // State for decorative dividers
  const [divider1, setDivider1] = useState({ x: 40, y: 80, width: 240, height: 10 });
  const [divider2, setDivider2] = useState({ x: 40, y: 230, width: 240, height: 10 });

  // State for card flip and interaction refinement
  const [isFlipped, setIsFlipped] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [smartGuides, setSmartGuides] = useState<{vertical: number | null, horizontal: number | null}>({ vertical: null, horizontal: null });
  const [activeElement, setActiveElement] = useState<ElementName>(null);
  const clickTimeout = useRef<number | null>(null);
  const elementClicked = useRef(false);
  const mouseDownPos = useRef({ x: 0, y: 0 });
  const [openAccordion, setOpenAccordion] = useState<string | null>('card-styles');

  const handleAccordionToggle = (name: string) => {
    setOpenAccordion(prev => prev === name ? null : name);
  };
  const backPatterns = [
    { name: 'None', url: '' },
    { name: 'Old Leather', url: 'https://www.transparenttextures.com/patterns/leather.png' },
    { name: 'Dark Wood', url: 'https://www.transparenttextures.com/patterns/dark-wood.png' },
    { name: 'Arcane Circles', url: 'https://www.transparenttextures.com/patterns/arches.png' },
    { name: 'Parchment', url: 'https://www.transparenttextures.com/patterns/clean-gray-paper.png' },
    { name: 'Dragon Scales', url: 'https://www.transparenttextures.com/patterns/gplay.png' },
  ];

  // Frame options
  const availableFrames = [
    { name: 'Sin Marco', value: '' },
    { name: 'Marco Clásico', value: '/frames/classic-frame.png' },
    { name: 'Marco Élfico', value: '/frames/elvish-frame.png' },
    { name: 'Marco Enano', value: '/frames/dwarven-frame.png' },
  ];

  const availableFramesBack = [
    { name: 'Sin Marco', value: '' },
    { name: 'Marco Clásico (Trasero)', value: '/frames/classic-frame-back.png' },
    // Agrega aquí más marcos traseros si los tienes
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, callback: (result: string) => void) => {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && e.target.result) {
          callback(e.target.result as string);
        }
      };
      reader.readAsDataURL(event.target.files[0]);
    }
    event.target.value = ''; // Reset file input
  };

  const handleImageUpdate = (element: 'image' | 'imageBack', pos: {x: number, y: number}, size: {width: string, height: string}) => {
    const newSize = {
        width: parseInt(size.width.replace('px', '')),
        height: parseInt(size.height.replace('px', ''))
    };

    if (element === 'image') {
        setImageSize(prev => ({
            ...prev,
            x: pos.x,
            y: pos.y,
            width: newSize.width,
            height: newSize.height
        }));
    } else {
        setImageBackSize(prev => ({
            ...prev,
            x: pos.x,
            y: pos.y,
            width: newSize.width,
            height: newSize.height
        }));
    }
  };

  const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWidth = parseInt(e.target.value);
    if (activeElement === 'image' && typeof imageSize.width === 'number' && imageSize.width > 0) {
        const aspectRatio = (imageSize.height as number) / (imageSize.width as number);
        const newHeight = newWidth * aspectRatio;
        setImageSize(prev => ({ ...prev, width: newWidth, height: Math.round(newHeight) }));
    } else if (activeElement === 'imageBack' && typeof imageBackSize.width === 'number' && imageBackSize.width > 0) {
        const aspectRatio = (imageBackSize.height as number) / (imageBackSize.width as number);
        const newHeight = newWidth * aspectRatio;
        setImageBackSize(prev => ({ ...prev, width: newWidth, height: Math.round(newHeight) }));
    }
  }

  const handleDragStart = () => {
    setIsDragging(true);
    if (clickTimeout.current) {
        clearTimeout(clickTimeout.current);
        clickTimeout.current = null;
    }
    document.body.classList.add('is-dragging');
  };

  const handleDragStop = (element: string, d: DraggableData, size: {width: string | number, height: string | number}) => {
    setIsDragging(false);
    document.body.classList.remove('is-dragging');
    setSmartGuides({ vertical: null, horizontal: null });
    if (element === 'image' || element === 'imageBack') {
      handleImageUpdate(element as 'image' | 'imageBack', { x: d.x, y: d.y }, {width: String(size.width), height: String(size.height)});
    } else {
      handleElementUpdate(element, { x: d.x, y: d.y }, {width: String(size.width), height: String(size.height)});
    }
  };
  const handleSaveCard = () => {
    const cardState = {
      id: Date.now(),
      cardProps,
      titleProps,
      descriptionProps,
      footerProps,
      image,
      imageSize,
      imageRotation,
      imageBorder,
      imageBack,
      imageBackSize,
      divider1,
      divider2,
    };

    try {
      const savedCards = JSON.parse(localStorage.getItem('savedCards') || '[]');
      savedCards.push(cardState);
      localStorage.setItem('savedCards', JSON.stringify(savedCards));
      alert('¡Carta guardada con éxito!');
    } catch (error) {
      console.error('Error al guardar la carta:', error);
      alert('Hubo un error al intentar guardar la carta.');
    }
  };
  const handleElementUpdate = (element: string, pos: {x: number, y: number}, size: {width: string, height: string}) => {
    const newSize = { width: parseInt(size.width), height: parseInt(size.height) };
    const newPos = { x: pos.x, y: pos.y };

    const cardWidth = 320;
    const snapThreshold = 5;

    const elementCenterX = pos.x + newSize.width / 2;
    const cardCenterX = cardWidth / 2;

    if (Math.abs(elementCenterX - cardCenterX) < snapThreshold) {
      newPos.x = cardCenterX - newSize.width / 2;
      setSmartGuides(guides => ({ ...guides, vertical: cardCenterX }));
    } else {
      setSmartGuides(guides => ({ ...guides, vertical: null }));
    }

    const cardHeight = 450;
    const elementCenterY = pos.y + newSize.height / 2;
    const cardCenterY = cardHeight / 2;

    if (Math.abs(elementCenterY - cardCenterY) < snapThreshold) {
      newPos.y = cardCenterY - newSize.height / 2;
      setSmartGuides(guides => ({ ...guides, horizontal: cardCenterY }));
    } else {
      setSmartGuides(guides => ({ ...guides, horizontal: null }));
    }

    const finalSize = { width: newSize.width, height: newSize.height };

    switch(element) {
      case 'title':
        setTitleProps(p => ({ ...p, ...newPos, ...finalSize as { width: number, height: number } }));
        break;
      case 'description':
        setDescriptionProps(p => ({ ...p, ...newPos, ...finalSize as { width: number, height: number } }));
        break;
      case 'footer':
        setFooterProps(p => ({ ...p, ...newPos, ...finalSize as { width: number, height: number } }));
        break;
    }
  }
  
  const handleElementClick = (element: ElementName, e: React.MouseEvent<Element, MouseEvent>) => {
    e.stopPropagation();
    elementClicked.current = true;
    setActiveElement(element);
  };
  
  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
      const moveThreshold = 5;
      const movedX = Math.abs(e.clientX - mouseDownPos.current.x);
      const movedY = Math.abs(e.clientY - mouseDownPos.current.y);
      
      // If an element was active, this click is only to deselect it.
      if (activeElement) {
        setActiveElement(null);
        elementClicked.current = false;
        return;
      }

      // If we are dragging, or clicking on an element, or moving the mouse too much, don't flip
      if (isDragging || elementClicked.current || movedX > moveThreshold || movedY > moveThreshold) {
        elementClicked.current = false; // Reset for next interaction
        return;
      }

      // Simple click detection to flip
      if (clickTimeout.current) {
          clearTimeout(clickTimeout.current);
          clickTimeout.current = null;
      }
      setIsFlipped(prev => !prev);
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
            setActiveElement(null);
        }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
        window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <PageContainer>
      <div className="page-header card-gen-header">
        <h1 className="page-title">Creador de Cartas</h1>
        <p className="page-subtitle">Diseña cartas de item, monstruos o cualquier cosa que imagines.</p>
      </div>
      <div className="card-generator-layout">
        <aside className="forms-column">
          <div className="spell-form-as-card">
            <div className="customization-header">
              <h2 className="customization-title">Personalizar Carta</h2>
            </div>
            <div className="card-body">
              
              <details className="accordion-item" open={openAccordion === 'card-styles'} onClick={(e) => { e.preventDefault(); handleAccordionToggle('card-styles'); }}>
                <summary className="accordion-header">Estilos de Carta</summary>
                <div className="accordion-content form-grid" onClick={(e) => e.stopPropagation()}>
                  <div className="form-group">
                    <label>Fuente:</label>
                    <select value={cardProps.fontFamily} onChange={(e) => updateCardProps({ fontFamily: e.target.value })} className="form-card-input">
                      <option value="serif">Serif (Clásica)</option>
                      <option value="sans-serif">Sans-Serif (Moderna)</option>
                      <option value="fantasy">Fantasy (Fantasía)</option>
                      <option value="'Cinzel', serif">Cinzel (Épica)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    {/* Placeholder for grid alignment */}
                  </div>
                  <div className="form-group">
                    <label>Marco Frontal:</label>
                    <select value={cardProps.frame} onChange={(e) => updateCardProps({ frame: e.target.value })} className="form-card-input">
                      {availableFrames.map(frame => (<option key={frame.value} value={frame.value}>{frame.name}</option>))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Marco Trasero:</label>
                    <select value={cardProps.frameBack} onChange={(e) => updateCardProps({ frameBack: e.target.value })} className="form-card-input">
                      {availableFramesBack.map(frame => (<option key={frame.value} value={frame.value}>{frame.name}</option>))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Color Borde (sin marco):</label>
                    <input type="color" value={cardProps.borderColor} onChange={(e) => updateCardProps({ borderColor: e.target.value })} style={{width: '100%'}}/>
                  </div>
                  <div className="form-group">
                    <label>Grosor Borde ({cardProps.borderWidth}px):</label>
                    <input type="range" min="0" max="20" value={cardProps.borderWidth} onChange={(e) => updateCardProps({ borderWidth: parseInt(e.target.value) })} />
                  </div>
                   <div className="form-group">
                    <label>Color Fondo (Frontal):</label>
                    <input type="color" value={cardProps.backgroundColor} onChange={(e) => updateCardProps({ backgroundColor: e.target.value })} style={{width: '100%'}}/>
                  </div>
                  <div className="form-group">
                    <label>Color Fondo (Trasera):</label>
                    <input type="color" value={cardProps.backBackgroundColor} onChange={(e) => updateCardProps({ backBackgroundColor: e.target.value })} style={{width: '100%'}}/>
                  </div>
                  <div className="form-group grid-col-span-2">
                    <label>Imagen Fondo (Trasera):</label>
                    <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, (res) => updateCardProps({ backBackgroundImage: res }))} className="form-card-input"/>
                  </div>
                  <div className="form-group grid-col-span-2">
                    <label>Patrón de Fondo (Trasera):</label>
                    <div className="pattern-selector">
                      {backPatterns.map(pattern => (
                        <div
                          key={pattern.name}
                          className={`pattern-thumbnail ${cardProps.backBackgroundImage === pattern.url ? 'active' : ''}`}
                          style={{
                            backgroundColor: cardProps.backPatternColor,
                            '--pattern-image': `url(${pattern.url})`,
                          } as React.CSSProperties}
                          onClick={(e) => { e.stopPropagation(); updateCardProps({ backBackgroundImage: pattern.url }); }}
                          title={pattern.name}
                        >
                          {!pattern.url && 'N/A'}
                        </div>
                      ))}
                    </div>
                  </div>
                  {cardProps.backBackgroundImage && (
                    <div className="form-grid-group grid-col-span-2">
                        <div className="form-group">
                            <label>Color del Patrón:</label>
                            <input type="color" value={cardProps.backPatternColor} onClick={(e) => e.stopPropagation()} onChange={(e) => updateCardProps({ backPatternColor: e.target.value })} style={{width: '100%'}}/>
                        </div>
                        <div className="form-group">
                            <label>Opacidad del Patrón ({Math.round(cardProps.backPatternOpacity * 100)}%):</label>
                            <input type="range" min="0" max="1" step="0.05" value={cardProps.backPatternOpacity} onClick={(e) => e.stopPropagation()} onChange={(e) => updateCardProps({ backPatternOpacity: parseFloat(e.target.value) })} />
                        </div>
                    </div>
                  )}
                </div>
                <div className="save-card-container">
              <button className="save-card-button" onClick={handleSaveCard}>Guardar Carta</button>
            </div>
              </details>

              <details className="accordion-item" open={openAccordion === 'main-image' || ['image', 'imageBack'].includes(activeElement || '')} onClick={(e) => { e.preventDefault(); handleAccordionToggle('main-image'); }}>
                <summary className="accordion-header">Imagen Principal</summary>
                <div className="accordion-content form-grid" onClick={(e) => e.stopPropagation()}>
                  <div className="form-group">
                    <label>Cargar Imagen (Frontal):</label>
                    <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, setImage)} className="form-card-input"/>
                  </div>
                   <div className="form-group">
                    <label>Cargar Imagen (Trasera):</label>
                    <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, setImageBack)} className="form-card-input"/>
                  </div>
                  
                  <div className="form-group grid-col-span-2">
                    {(image && activeElement === 'image') || (imageBack && activeElement === 'imageBack') ? (
                    <div className="form-grid-group">
                      <div className="form-group">
                        <label>Tamaño ({activeElement === 'image' ? Math.round(imageSize.width as number) : Math.round(imageBackSize.width as number)}px):</label>
                        <input
                          type="range"
                          min="50"
                          max="500"
                          value={activeElement === 'image' ? imageSize.width : imageBackSize.width as number}
                          onChange={handleSizeChange}
                        />
                      </div>
                      <div className="form-group">
                        <label>Rotación ({imageRotation}°):</label>
                        <input
                          type="range"
                          min="0"
                          max="360"
                          value={imageRotation}
                          onChange={(e) => setImageRotation(parseInt(e.target.value))}
                        />
                      </div>
                    </div>
                    ) : <p className="grid-col-span-2">Selecciona una imagen en la carta para ver sus opciones.</p>}
                  </div>
                  <div className="options-group grid-col-span-2">
                    <div className="form-group inline-group">
                        <input
                          type="checkbox"
                          id="imageBorder"
                          checked={imageBorder.active}
                          onChange={(e) =>
                            setImageBorder((p) => ({ ...p, active: e.target.checked }))
                          }
                        />
                        <label htmlFor="imageBorder">Borde de Imagen</label>
                        {imageBorder.active && (
                          <>
                            <input
                              type="color"
                              value={imageBorder.color}
                              onChange={(e) =>
                                setImageBorder((p) => ({ ...p, color: e.target.value }))
                              }
                            />
                            <input
                              type="number"
                              min="1"
                              max="20"
                              value={imageBorder.width}
                              onChange={(e) =>
                                setImageBorder((p) => ({
                                  ...p,
                                  width: parseInt(e.target.value),
                                }))
                              }
                            />
                            px
                          </>
                        )}
                      </div>
                       <div className="form-group inline-group">
                          <input
                              type="checkbox"
                              id="cropMode"
                              checked={!imageBorder.lockAspectRatio}
                              onChange={(e) => setImageBorder(p => ({ ...p, lockAspectRatio: !e.target.checked }))}
                          />
                          <label htmlFor="cropMode">Recortar</label>
                      </div>
                  </div>
                </div>
              </details>

              {/* Repetir para Título, Descripción y Pie de Página */}
              {/* Ejemplo para Título */}
              <details className="accordion-item" open={openAccordion === 'title' || activeElement === 'title'} onClick={(e) => { e.preventDefault(); handleAccordionToggle('title'); }}>
                <summary className="accordion-header">Elemento: Título</summary>
                <div className="accordion-content form-grid" onClick={(e) => e.stopPropagation()}>
                  <div className="form-group grid-col-span-2">
                    <label>Texto:</label>
                    <input type="text" value={titleProps.text} onChange={(e) => setTitleProps(p => ({...p, text: e.target.value, height: 'auto'}))} className="form-card-input" />
                  </div>
                  <div className="form-group">
                    <label>Color Texto:</label>
                    <input type="color" style={{width: '100%'}} value={titleProps.color} onChange={(e) => setTitleProps(p => ({...p, color: e.target.value}))} />
                  </div>
                  <div className="form-group">
                    <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span>Fondo:</span>
                      <button type="button" onClick={(e) => {e.stopPropagation(); setTitleProps(p => ({...p, backgroundColor: 'rgba(0,0,0,0)'}))}} className="action-button-circular" title="Fondo transparente">T</button>
                    </label>
                    <input type="color" style={{width: '100%'}} value={titleProps.backgroundColor} onChange={(e) => setTitleProps(p => ({...p, backgroundColor: e.target.value}))} />
                  </div>
                  <div className="options-group grid-col-span-2">
                    <div className="form-group inline-group compact-options">
                      <input type="checkbox" id="titleHighlight" checked={titleProps.highlight.active} onChange={e => setTitleProps(p => ({...p, highlight: {...p.highlight, active: e.target.checked}}))} />
                      <label htmlFor="titleHighlight">Resaltado</label>
                      {titleProps.highlight.active && <input type="color" value={titleProps.highlight.color} onChange={e => setTitleProps(p => ({...p, highlight: {...p.highlight, color: e.target.value}}))} />}
                    </div>
                     <div className="form-group inline-group compact-options">
                        <input type="checkbox" id="titleStroke" checked={titleProps.stroke.active} onChange={e => setTitleProps(p => ({...p, stroke: {...p.stroke, active: e.target.checked}}))} />
                        <label htmlFor="titleStroke">Borde de Letra</label>
                        {titleProps.stroke.active && <>
                          <input type="color" value={titleProps.stroke.color} onChange={e => setTitleProps(p => ({...p, stroke: {...p.stroke, color: e.target.value}}))} />
                          <input type="number" min="1" max="10" value={titleProps.stroke.width} onChange={e => setTitleProps(p => ({...p, stroke: {...p.stroke, width: parseInt(e.target.value)}}))} />px
                        </>}
                      </div>
                     <div className="form-group inline-group compact-options">
                          <input type="checkbox" id="titleBorder" checked={titleProps.border.active} onChange={e => setTitleProps(p => ({...p, border: {...p.border, active: e.target.checked}}))} />
                          <label htmlFor="titleBorder">Borde de Caja</label>
                        {titleProps.border.active && <>
                          <input type="color" value={titleProps.border.color} onChange={e => setTitleProps(p => ({...p, border: {...p.border, color: e.target.value}}))} />
                          <input type="number" min="1" max="10" value={titleProps.border.width} onChange={e => setTitleProps(p => ({...p, border: {...p.border, width: parseInt(e.target.value)}}))} />px
                          <select value={titleProps.border.style} onChange={e => setTitleProps(p => ({...p, border: {...p.border, style: e.target.value}}))}>
                            <option value="rounded">Redondo</option>
                            <option value="square">Cuadrado</option>
                          </select>
                        </>}
                      </div>
                  </div>
                </div>
              </details>
              <details className="accordion-item" open={openAccordion === 'description' || activeElement === 'description'} onClick={(e) => { e.preventDefault(); handleAccordionToggle('description'); }}>
                <summary className="accordion-header">Elemento: Descripción</summary>
                <div className="accordion-content form-grid" onClick={(e) => e.stopPropagation()}>
                  <div className="form-group grid-col-span-2">
                    <label>Texto:</label>
                    <textarea value={descriptionProps.text} onChange={(e) => setDescriptionProps(p => ({...p, text: e.target.value, height: 'auto'}))} rows={4} className="form-card-textarea"/>
                  </div>
                   <div className="form-group">
                    <label>Color Texto:</label>
                    <input type="color" style={{width: '100%'}} value={descriptionProps.color} onChange={(e) => setDescriptionProps(p => ({...p, color: e.target.value}))} />
                  </div>
                  <div className="form-group">
                     <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span>Fondo:</span>
                      <button type="button" onClick={(e) => {e.stopPropagation(); setDescriptionProps(p => ({...p, backgroundColor: 'rgba(0,0,0,0)'}))}} className="action-button-circular" title="Fondo transparente">T</button>
                    </label>
                    <input type="color" style={{width: '100%'}} value={descriptionProps.backgroundColor} onChange={(e) => setDescriptionProps(p => ({...p, backgroundColor: e.target.value}))} />
                  </div>
                  <div className="options-group grid-col-span-2">
                    <div className="form-group inline-group compact-options">
                      <input type="checkbox" id="descHighlight" checked={descriptionProps.highlight.active} onChange={e => setDescriptionProps(p => ({...p, highlight: {...p.highlight, active: e.target.checked}}))} />
                      <label htmlFor="descHighlight">Resaltado</label>
                      {descriptionProps.highlight.active && <input type="color" value={descriptionProps.highlight.color} onChange={e => setDescriptionProps(p => ({...p, highlight: {...p.highlight, color: e.target.value}}))} />}
                    </div>
                    <div className="form-group inline-group compact-options">
                        <input type="checkbox" id="descStroke" checked={descriptionProps.stroke.active} onChange={e => setDescriptionProps(p => ({...p, stroke: {...p.stroke, active: e.target.checked}}))} />
                        <label htmlFor="descStroke">Borde de Letra</label>
                      {descriptionProps.stroke.active && <>
                        <input type="color" value={descriptionProps.stroke.color} onChange={e => setDescriptionProps(p => ({...p, stroke: {...p.stroke, color: e.target.value}}))} />
                        <input type="number" min="1" max="10" value={descriptionProps.stroke.width} onChange={e => setDescriptionProps(p => ({...p, stroke: {...p.stroke, width: parseInt(e.target.value)}}))} />px
                      </>}
                    </div>
                     <div className="form-group inline-group compact-options">
                        <input type="checkbox" id="descBorder" checked={descriptionProps.border.active} onChange={e => setDescriptionProps(p => ({...p, border: {...p.border, active: e.target.checked}}))} />
                        <label htmlFor="descBorder">Borde de Caja</label>
                      {descriptionProps.border.active && <>
                        <input type="color" value={descriptionProps.border.color} onChange={e => setDescriptionProps(p => ({...p, border: {...p.border, color: e.target.value}}))} />
                        <input type="number" min="1" max="10" value={descriptionProps.border.width} onChange={e => setDescriptionProps(p => ({...p, border: {...p.border, width: parseInt(e.target.value)}}))} />px
                        <select value={descriptionProps.border.style} onChange={e => setDescriptionProps(p => ({...p, border: {...p.border, style: e.target.value}}))}>
                          <option value="rounded">Redondo</option>
                          <option value="square">Cuadrado</option>
                        </select>
                      </>}
                    </div>
                  </div>
                </div>
              </details>
              <details className="accordion-item" open={openAccordion === 'footer' || activeElement === 'footer'} onClick={(e) => { e.preventDefault(); handleAccordionToggle('footer'); }}>
                <summary className="accordion-header">Elemento: Pie de Página</summary>
                <div className="accordion-content form-grid" onClick={(e) => e.stopPropagation()}>
                  <div className="form-group grid-col-span-2">
                    <label>Texto:</label>
                    <input type="text" value={footerProps.text} onChange={(e) => setFooterProps(p => ({...p, text: e.target.value, height: 'auto'}))} className="form-card-input" />
                  </div>
                  <div className="form-group">
                    <label>Color Texto:</label>
                    <input type="color" style={{width: '100%'}} value={footerProps.color} onChange={(e) => setFooterProps(p => ({...p, color: e.target.value}))} />
                  </div>
                  <div className="form-group">
                    <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span>Fondo:</span>
                      <button type="button" onClick={(e) => {e.stopPropagation(); setFooterProps(p => ({...p, backgroundColor: 'rgba(0,0,0,0)'}))}} className="action-button-circular" title="Fondo transparente">T</button>
                    </label>
                    <input type="color" style={{width: '100%'}} value={footerProps.backgroundColor} onChange={(e) => setFooterProps(p => ({...p, backgroundColor: e.target.value}))} />
                  </div>
                  <div className="options-group grid-col-span-2">
                    <div className="form-group inline-group compact-options">
                      <input type="checkbox" id="footerHighlight" checked={footerProps.highlight.active} onChange={e => setFooterProps(p => ({...p, highlight: {...p.highlight, active: e.target.checked}}))} />
                      <label htmlFor="footerHighlight">Resaltado</label>
                      {footerProps.highlight.active && <input type="color" value={footerProps.highlight.color} onChange={e => setFooterProps(p => ({...p, highlight: {...p.highlight, color: e.target.value}}))} />}
                    </div>
                    <div className="form-group inline-group compact-options">
                        <input type="checkbox" id="footerStroke" checked={footerProps.stroke.active} onChange={e => setFooterProps(p => ({...p, stroke: {...p.stroke, active: e.target.checked}}))} />
                        <label htmlFor="footerStroke">Borde de Letra</label>
                      {footerProps.stroke.active && <>
                        <input type="color" value={footerProps.stroke.color} onChange={e => setFooterProps(p => ({...p, stroke: {...p.stroke, color: e.target.value}}))} />
                        <input type="number" min="1" max="10" value={footerProps.stroke.width} onChange={e => setFooterProps(p => ({...p, stroke: {...p.stroke, width: parseInt(e.target.value)}}))} />px
                      </>}
                    </div>
                     <div className="form-group inline-group compact-options">
                        <input type="checkbox" id="footerBorder" checked={footerProps.border.active} onChange={e => setFooterProps(p => ({...p, border: {...p.border, active: e.target.checked}}))} />
                        <label htmlFor="footerBorder">Borde de Caja</label>
                      {footerProps.border.active && <>
                        <input type="color" value={footerProps.border.color} onChange={e => setFooterProps(p => ({...p, border: {...p.border, color: e.target.value}}))} />
                        <input type="number" min="1" max="10" value={footerProps.border.width} onChange={e => setFooterProps(p => ({...p, border: {...p.border, width: parseInt(e.target.value)}}))} />px
                         <select value={footerProps.border.style} onChange={e => setFooterProps(p => ({...p, border: {...p.border, style: e.target.value}}))}>
                          <option value="rounded">Redondo</option>
                          <option value="square">Cuadrado</option>
                        </select>
                      </>}
                    </div>
                  </div>
                </div>
              </details>

            </div>
          </div>
        </aside>
        <main className="preview-panel">
          <div 
            className="card-flipper-container" 
            onMouseUp={(e) => handleCardClick(e)} 
            onMouseDown={(e) => {
              elementClicked.current = false;
              mouseDownPos.current = { x: e.clientX, y: e.clientY };
              if (clickTimeout.current) clearTimeout(clickTimeout.current); 
              clickTimeout.current = window.setTimeout(() => clickTimeout.current = null, 200);
            }}
          >
            <div className={`card-flipper ${isFlipped ? 'is-flipped' : ''}`}>
              <div className="card-face card-front">
                <GenericCardPreview 
                  cardProps={cardProps}
                  image={image}
                  imageBorder={imageBorder}
                  onImageUpdate={handleImageUpdate}
                  imageSize={imageSize}
                  imageRotation={imageRotation}
                  titleProps={titleProps}
                  descriptionProps={descriptionProps}
                  footerProps={footerProps}
                  onElementUpdate={handleElementUpdate}
                  divider1={divider1}
                  divider2={divider2}
                  setDivider1={setDivider1}
                  setDivider2={setDivider2}
                  smartGuides={smartGuides}
                  handleDragStart={handleDragStart}
                  handleDragStop={handleDragStop}
                  activeElement={activeElement}
                  onElementClick={handleElementClick}
                />
              </div>
              <div className="card-face card-back">
                <CardBackPreview 
                  cardProps={cardProps} 
                  imageBack={imageBack}
                  imageBackSize={imageBackSize}
                  onImageUpdate={handleImageUpdate}
                  activeElement={activeElement}
                  onElementClick={handleElementClick}
                  handleDragStart={handleDragStart}
                  handleDragStop={handleDragStop}
                  imageBorder={imageBorder}
                />
              </div>
            </div>
          </div>
           <div className="save-card-fab-container">
            <button className="action-button-circular" onClick={handleSaveCard} title="Guardar Carta">
              <i className="fas fa-save"></i>
            </button>
          </div>
        </main>
      </div>
    </PageContainer>
  );
}

export default CardGeneratorPage;