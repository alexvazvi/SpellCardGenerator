import React, { useState } from 'react';
import './CardGeneratorPage.css';
import PageContainer from '../../components/PageContainer';
import { Rnd } from 'react-rnd';
import tinycolor from 'tinycolor2';

const GenericCardPreview = (
    { cardProps, image, imageBorder, onImageUpdate, imageSize, imageRotation, titleProps, descriptionProps, footerProps, onElementUpdate, divider1, divider2, setDivider1, setDivider2, smartGuides, handleDragStart, handleDragStop }:
    { 
      cardProps: any,
      image: string | null,
      imageBorder: any,
      onImageUpdate: (style: any, size: any) => void,
      imageSize: { width: number, height: number },
      imageRotation: number,
      titleProps: any,
      descriptionProps: any,
      footerProps: any,
      onElementUpdate: (element: string, pos: any, size: any) => void,
      divider1: any,
      divider2: any,
      setDivider1: (pos: any) => void,
      setDivider2: (pos: any) => void,
      smartGuides: { vertical: number | null, horizontal: number | null },
      handleDragStart: () => void,
      handleDragStop: (element: string, d: any, size: {width: any, height: any}) => void
    }
) => {
  const { frame, borderColor, backgroundColor, backgroundImage, fontFamily } = cardProps;
  const showBorder = !frame;

  const getElementStyles = (props: any): React.CSSProperties => {
    const styles: React.CSSProperties = {
        zIndex: 4,
        background: props.backgroundColor,
    };
    if (props.border?.active) {
        styles.border = `${props.border.width}px solid ${props.border.color}`;
        styles.borderRadius = props.border.style === 'rounded' ? '8px' : '0px';
    }
    return styles;
  }

  const getTextStyles = (props: any): React.CSSProperties => {
    const styles: React.CSSProperties = {
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center', /* Re-center the content within the draggable box */
        margin: 0,
        padding: '5px',
        boxSizing: 'border-box',
        textAlign: 'center', /* Re-center the text itself */
        overflow: 'hidden',
        lineHeight: 1.2,
        color: props.color,
        fontFamily: 'inherit'
    };
    if (props.stroke?.active) {
        styles.WebkitTextStroke = `${props.stroke.width}px ${props.stroke.color}`;
    }
    return styles;
  }

  const textWrapper = (text: string, props: any) => {
    if (props.highlight?.active) {
      return (
        <span style={{ backgroundColor: props.highlight.color, padding: '0.1em 0.2em', boxDecorationBreak: 'clone' }}>
          {text}
        </span>
      );
    }
    return text;
  }

  const cardBaseStyle: React.CSSProperties = {
      width: '100%',
      height: '100%',
      border: showBorder ? `${cardProps.borderWidth}px solid ${borderColor}` : 'none',
      borderRadius: '15px',
      backgroundColor: frame ? 'transparent' : backgroundColor,
      backgroundImage: frame ? 'none' : `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      fontFamily: fontFamily,
      boxSizing: 'border-box',
      position: 'relative',
      zIndex: 2
  }

  return (
    <div className="card-wrapper">
      <div className="card" style={cardBaseStyle}>
        {frame && (
          <img
            src={frame}
            alt="Card Frame"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
              zIndex: 1,
              objectFit: 'fill',
            }}
          />
        )}
  
        <div className="card-content-area">
            {smartGuides.vertical && <div className="smart-guide vertical" style={{ left: smartGuides.vertical }}></div>}
            {smartGuides.horizontal && <div className="smart-guide horizontal" style={{ top: smartGuides.horizontal }}></div>}

            {image && (
            <Rnd
                style={{
                  zIndex: 3,
                  border: imageBorder.active ? `${imageBorder.width}px solid ${imageBorder.color}` : 'none',
                  boxSizing: 'border-box'
                }}
                size={{ width: imageSize.width, height: imageSize.height }}
                default={{
                  x: 160 - imageSize.width / 2,
                  y: 100,
                  width: imageSize.width,
                  height: imageSize.height,
                }}
                onDragStop={(_e, d) =>
                  onImageUpdate({ x: d.x, y: d.y }, imageSize)
                }
                onResizeStop={(_e, _dir, ref, _del, pos) =>
                  onImageUpdate(pos, {
                    width: ref.style.width,
                    height: ref.style.height,
                  })
                }
                lockAspectRatio
                bounds="parent"
              >
                <img
                  src={image}
                  alt="Custom content"
                  style={{
                    width: '100%',
                    height: '100%',
                    transform: `rotate(${imageRotation}deg)`,
                    pointerEvents: 'none',
                  }}
                />
              </Rnd>
            )}
  
            <Rnd
              style={{ zIndex: 5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              size={{ width: divider1.width, height: divider1.height }}
              position={{ x: divider1.x, y: divider1.y }}
              onDragStop={(_e, d) => setDivider1({ ...divider1, x: d.x, y: d.y })}
              onResizeStop={(_e, _dir, ref, _del, pos) => setDivider1({ ...pos, width: parseInt(ref.style.width), height: parseInt(ref.style.height) })}
              bounds="parent"
              className="interactive-element"
              enableResizing={{ top: false, right: true, bottom: false, left: true, topRight: false, bottomRight: false, bottomLeft: false, topLeft: false }}
            >
              <div className="filigree-divider"></div>
            </Rnd>
            
            <Rnd
              style={getElementStyles(titleProps)}
              size={{ width: titleProps.width, height: titleProps.height }}
              position={{ x: titleProps.x, y: titleProps.y }}
              onDragStart={handleDragStart}
              onDragStop={(_e, d) =>
                handleDragStop(
                  'title',
                  d,
                  { width: titleProps.width, height: titleProps.height }
                )
              }
              onResizeStop={(_e, _dir, ref, _del, pos) =>
                onElementUpdate('title', pos, {
                  width: ref.style.width,
                  height: ref.style.height,
                })
              }
              bounds="parent"
              className="interactive-element"
            >
              <h3 style={{ ...getTextStyles(titleProps), fontSize: '1.2em' }}>
                {textWrapper(titleProps.text, titleProps)}
              </h3>
            </Rnd>
  
            <Rnd
              style={getElementStyles(descriptionProps)}
              size={{
                width: descriptionProps.width,
                height: descriptionProps.height,
              }}
              position={{ x: descriptionProps.x, y: descriptionProps.y }}
              onDragStart={handleDragStart}
              onDragStop={(_e, d) =>
                handleDragStop(
                  'description',
                  d,
                  {
                    width: descriptionProps.width,
                    height: descriptionProps.height,
                  }
                )
              }
              onResizeStop={(_e, _dir, ref, _del, pos) =>
                onElementUpdate('description', pos, {
                  width: ref.style.width,
                  height: ref.style.height,
                })
              }
              bounds="parent"
              className="interactive-element"
            >
              <div
                style={{
                  ...getTextStyles(descriptionProps),
                  fontSize: '0.9em',
                  alignItems: 'flex-start',
                  textAlign: 'left',
                  whiteSpace: 'pre-wrap',
                  paddingTop: '20px',
                }}
              >
                {textWrapper(descriptionProps.text, descriptionProps)}
              </div>
            </Rnd>

            <Rnd
              style={{ zIndex: 5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              size={{ width: divider2.width, height: divider2.height }}
              position={{ x: divider2.x, y: divider2.y }}
              onDragStop={(_e, d) => setDivider2({ ...divider2, x: d.x, y: d.y })}
              onResizeStop={(_e, _dir, ref, _del, pos) => setDivider2({ ...pos, width: parseInt(ref.style.width), height: parseInt(ref.style.height) })}
              bounds="parent"
              className="interactive-element"
              enableResizing={{ top: false, right: true, bottom: false, left: true, topRight: false, bottomRight: false, bottomLeft: false, topLeft: false }}
            >
              <div className="filigree-divider"></div>
            </Rnd>
  
            <Rnd
              style={getElementStyles(footerProps)}
              size={{ width: footerProps.width, height: footerProps.height }}
              position={{ x: footerProps.x, y: footerProps.y }}
              onDragStart={handleDragStart}
              onDragStop={(_e, d) =>
                handleDragStop(
                  'footer',
                  d,
                  { width: footerProps.width, height: footerProps.height }
                )
              }
              onResizeStop={(_e, _dir, ref, _del, pos) =>
                onElementUpdate('footer', pos, {
                  width: ref.style.width,
                  height: ref.style.height,
                })
              }
              bounds="parent"
              className="interactive-element"
            >
              <footer
                style={{ ...getTextStyles(footerProps), fontSize: '0.8em' }}
              >
                {textWrapper(footerProps.text, footerProps)}
              </footer>
            </Rnd>
          </div>
        </div>
    </div>
  );
}

const CardBackPreview = ({ cardProps }: { cardProps: any }) => {
  const { frameBack, borderColor, backBackgroundColor, backBackgroundImage } = cardProps;
  const showBorder = !frameBack;

  const cardBaseStyle: React.CSSProperties = {
      width: '100%',
      height: '100%',
      border: showBorder ? `10px solid ${borderColor}` : 'none',
      borderRadius: '15px',
      backgroundColor: frameBack ? 'transparent' : backBackgroundColor,
      boxSizing: 'border-box',
      position: 'relative',
      zIndex: 2,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
  }

  return (
      <div style={{
          width: '320px',
          height: '450px',
          position: 'relative',
          boxSizing: 'border-box',
          overflow: 'hidden',
          borderRadius: '15px',
      }}>
          <div style={cardBaseStyle}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: `url(${backBackgroundImage})`,
                backgroundColor: cardProps.backPatternColor,
                opacity: cardProps.backPatternOpacity,
                zIndex: 2, // Lower zIndex
              }}></div>
          </div>
          {/* Move frame to be rendered on top */}
          {frameBack && <img src={frameBack} alt="Card Frame Back" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 3, objectFit: 'fill' }}/>}
      </div>
  )
}


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
    text: 'Bola de Fuego', x: 40, y: 20, width: 240, height: 50,
    color: '#000000',
    backgroundColor: 'rgba(0,0,0,0)',
    highlight: { active: false, color: '#ffff00' },
    stroke: { active: false, color: '#000000', width: 1 },
    border: { active: false, style: 'rounded', width: 2, color: defaultBorderColor }
  });
  const [descriptionProps, setDescriptionProps] = useState({ 
    text: 'Una explosión de llamas rugientes estalla en un punto de tu elección dentro del alcance. Cada criatura en una esfera de 20 pies de radio centrada en ese punto debe hacer una tirada de salvación de Destreza. Recibe 8d6 de daño por fuego si falla, o la mitad si tiene éxito.', x: 30, y: 180, width: 260, height: 220,
    color: '#000000',
    backgroundColor: 'rgba(0,0,0,0)',
    highlight: { active: false, color: '#ffff00' },
    stroke: { active: false, color: '#000000', width: 1 },
    border: { active: false, style: 'rounded', width: 2, color: defaultBorderColor }
  });
  const [footerProps, setFooterProps] = useState({
    text: 'D&D 5e Conjuro', x: 30, y: 380, width: 260, height: 40,
    color: '#000000',
    backgroundColor: 'rgba(0,0,0,0)',
    highlight: { active: false, color: '#ffff00' },
    stroke: { active: false, color: '#000000', width: 1 },
    border: { active: false, style: 'rounded', width: 2, color: defaultBorderColor }
  });

  // Image state
  const [image, setImage] = useState<string | null>(null);
  const [imageSize, setImageSize] = useState({ width: 150, height: 150 });
  const [imageRotation, setImageRotation] = useState(0);
  const [imageBorder, setImageBorder] = useState({ active: false, color: '#000000', width: 3 });

  // State for decorative dividers
  const [divider1, setDivider1] = useState({ x: 40, y: 80, width: 240, height: 10 });
  const [divider2, setDivider2] = useState({ x: 40, y: 230, width: 240, height: 10 });

  // State for card flip and interaction refinement
  const [isFlipped, setIsFlipped] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [smartGuides, setSmartGuides] = useState<{vertical: number | null, horizontal: number | null}>({ vertical: null, horizontal: null });

  // Pattern options for card back
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

  const handleImageUpdate = (_pos: any, size: any) => {
    // The size object from Rnd comes as '150px', so we parse it to a number
    setImageSize({ width: parseInt(size.width), height: parseInt(size.height) });
  };

  const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWidth = parseInt(e.target.value);
    if (imageSize.width > 0) { // Avoid division by zero
        const aspectRatio = imageSize.height / imageSize.width;
        const newHeight = newWidth * aspectRatio;
        setImageSize({ width: newWidth, height: Math.round(newHeight) });
    }
  }

  const handleDragStart = () => {
    setIsDragging(true);
    document.body.classList.add('is-dragging');
  };

  const handleDragStop = (element: string, d: any, size: {width: string, height: string}) => {
    setIsDragging(false);
    document.body.classList.remove('is-dragging');
    setSmartGuides({ vertical: null, horizontal: null });
    handleElementUpdate(element, { x: d.x, y: d.y }, size);
  };

  const handleElementUpdate = (element: string, pos: {x: number, y: number}, size: {width: string, height: string}) => {
    const newSize = { width: parseInt(size.width), height: parseInt(size.height) };
    let newPos = { x: pos.x, y: pos.y };

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

    switch(element) {
      case 'title':
        setTitleProps(p => ({ ...p, ...newPos, ...newSize }));
        break;
      case 'description':
        setDescriptionProps(p => ({ ...p, ...newPos, ...newSize }));
        break;
      case 'footer':
        setFooterProps(p => ({ ...p, ...newPos, ...newSize }));
        break;
    }
  }

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
            <div className="card-body" style={{overflowY: 'auto', maxHeight: 'calc(100vh - 120px)'}}>
              
              <details className="accordion-item" open>
                <summary className="accordion-header">Estilos de Carta</summary>
                <div className="accordion-content">
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
                    <label>Color Borde (si no hay marco):</label>
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
                  <div className="form-group">
                    <label>Imagen Fondo (Trasera):</label>
                    <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, (res) => updateCardProps({ backBackgroundImage: res }))} className="form-card-input"/>
                  </div>
                  <div className="form-group">
                    <label>Patrón de Fondo (Trasera):</label>
                    <div className="pattern-selector">
                      {backPatterns.map(pattern => (
                        <div 
                          key={pattern.name}
                          className={`pattern-thumbnail ${cardProps.backBackgroundImage === pattern.url ? 'active' : ''}`}
                          style={{ backgroundImage: pattern.url ? `url(${pattern.url})` : 'none', backgroundColor: !pattern.url ? 'var(--color-parchment-darker)' : 'transparent' }}
                          onClick={() => updateCardProps({ backBackgroundImage: pattern.url })}
                          title={pattern.name}
                        >
                          {!pattern.url && 'N/A'}
                        </div>
                      ))}
                    </div>
                  </div>
                  {cardProps.backBackgroundImage && (
                    <>
                      <div className="form-group">
                        <label>Color del Patrón:</label>
                        <input type="color" value={cardProps.backPatternColor} onChange={(e) => updateCardProps({ backPatternColor: e.target.value })} style={{width: '100%'}}/>
                      </div>
                      <div className="form-group">
                        <label>Opacidad del Patrón ({Math.round(cardProps.backPatternOpacity * 100)}%):</label>
                        <input type="range" min="0" max="1" step="0.05" value={cardProps.backPatternOpacity} onChange={(e) => updateCardProps({ backPatternOpacity: parseFloat(e.target.value) })} />
                      </div>
                    </>
                  )}
                </div>
              </details>

              <details className="accordion-item">
                <summary className="accordion-header">Imagen Principal</summary>
                <div className="accordion-content">
                  <div className="form-group">
                    <label>Cargar Imagen:</label>
                    <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, setImage)} className="form-card-input"/>
                  </div>
                  {image && (
  <>
    <div className="form-group">
      <label>Tamaño ({Math.round(imageSize.width)}px):</label>
      <input
        type="range"
        min="50"
        max="500"
        value={imageSize.width}
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
  </>
)}

                </div>
              </details>

              {/* Repetir para Título, Descripción y Pie de Página */}
              {/* Ejemplo para Título */}
              <details className="accordion-item">
                <summary className="accordion-header">Elemento: Título</summary>
                <div className="accordion-content">
                  <div className="form-group">
                    <label>Texto:</label>
                    <input type="text" value={titleProps.text} onChange={(e) => setTitleProps(p => ({...p, text: e.target.value}))} className="form-card-input" />
                  </div>
                  <div className="form-group color-group">
                    <label>Color Texto:</label>
                    <input type="color" value={titleProps.color} onChange={(e) => setTitleProps(p => ({...p, color: e.target.value}))} />
                    <label>Fondo:</label>
                    <input type="color" value={titleProps.backgroundColor} onChange={(e) => setTitleProps(p => ({...p, backgroundColor: e.target.value}))} />
                    <button type="button" onClick={() => setTitleProps(p => ({...p, backgroundColor: 'rgba(0,0,0,0)'}))} className="action-button-circular" title="Fondo transparente">T</button>
                  </div>
                  <div className="form-group inline-group">
                    <input type="checkbox" id="titleHighlight" checked={titleProps.highlight.active} onChange={e => setTitleProps(p => ({...p, highlight: {...p.highlight, active: e.target.checked}}))} />
                    <label htmlFor="titleHighlight">Resaltado</label>
                    {titleProps.highlight.active && <input type="color" value={titleProps.highlight.color} onChange={e => setTitleProps(p => ({...p, highlight: {...p.highlight, color: e.target.value}}))} />}
                  </div>
                  <div className="form-group inline-group">
                    <input type="checkbox" id="titleStroke" checked={titleProps.stroke.active} onChange={e => setTitleProps(p => ({...p, stroke: {...p.stroke, active: e.target.checked}}))} />
                    <label htmlFor="titleStroke">Borde de Letra</label>
                    {titleProps.stroke.active && <>
                      <input type="color" value={titleProps.stroke.color} onChange={e => setTitleProps(p => ({...p, stroke: {...p.stroke, color: e.target.value}}))} />
                      <input type="number" min="1" max="10" value={titleProps.stroke.width} onChange={e => setTitleProps(p => ({...p, stroke: {...p.stroke, width: parseInt(e.target.value)}}))} />px
                    </>}
                  </div>
                  <div className="form-group inline-group">
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
              </details>
              <details className="accordion-item">
                <summary className="accordion-header">Elemento: Descripción</summary>
                <div className="accordion-content">
                  <div className="form-group">
                    <label>Texto:</label>
                    <textarea value={descriptionProps.text} onChange={(e) => setDescriptionProps(p => ({...p, text: e.target.value}))} rows={4} className="form-card-textarea"/>
                  </div>
                  <div className="form-group color-group">
                    <label>Color Texto:</label>
                    <input type="color" value={descriptionProps.color} onChange={(e) => setDescriptionProps(p => ({...p, color: e.target.value}))} />
                    <label>Fondo:</label>
                    <input type="color" value={descriptionProps.backgroundColor} onChange={(e) => setDescriptionProps(p => ({...p, backgroundColor: e.target.value}))} />
                    <button type="button" onClick={() => setDescriptionProps(p => ({...p, backgroundColor: 'rgba(0,0,0,0)'}))} className="action-button-circular" title="Fondo transparente">T</button>
                  </div>
                  <div className="form-group inline-group">
                    <input type="checkbox" id="descHighlight" checked={descriptionProps.highlight.active} onChange={e => setDescriptionProps(p => ({...p, highlight: {...p.highlight, active: e.target.checked}}))} />
                    <label htmlFor="descHighlight">Resaltado</label>
                    {descriptionProps.highlight.active && <input type="color" value={descriptionProps.highlight.color} onChange={e => setDescriptionProps(p => ({...p, highlight: {...p.highlight, color: e.target.value}}))} />}
                  </div>
                  <div className="form-group inline-group">
                    <input type="checkbox" id="descStroke" checked={descriptionProps.stroke.active} onChange={e => setDescriptionProps(p => ({...p, stroke: {...p.stroke, active: e.target.checked}}))} />
                    <label htmlFor="descStroke">Borde de Letra</label>
                    {descriptionProps.stroke.active && <>
                      <input type="color" value={descriptionProps.stroke.color} onChange={e => setDescriptionProps(p => ({...p, stroke: {...p.stroke, color: e.target.value}}))} />
                      <input type="number" min="1" max="10" value={descriptionProps.stroke.width} onChange={e => setDescriptionProps(p => ({...p, stroke: {...p.stroke, width: parseInt(e.target.value)}}))} />px
                    </>}
                  </div>
                   <div className="form-group inline-group">
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
              </details>
              <details className="accordion-item">
                <summary className="accordion-header">Elemento: Pie de Página</summary>
                <div className="accordion-content">
                  <div className="form-group">
                    <label>Texto:</label>
                    <input type="text" value={footerProps.text} onChange={(e) => setFooterProps(p => ({...p, text: e.target.value}))} className="form-card-input" />
                  </div>
                  <div className="form-group color-group">
                    <label>Color Texto:</label>
                    <input type="color" value={footerProps.color} onChange={(e) => setFooterProps(p => ({...p, color: e.target.value}))} />
                    <label>Fondo:</label>
                    <input type="color" value={footerProps.backgroundColor} onChange={(e) => setFooterProps(p => ({...p, backgroundColor: e.target.value}))} />
                    <button type="button" onClick={() => setFooterProps(p => ({...p, backgroundColor: 'rgba(0,0,0,0)'}))} className="action-button-circular" title="Fondo transparente">T</button>
                  </div>
                  <div className="form-group inline-group">
                    <input type="checkbox" id="footerHighlight" checked={footerProps.highlight.active} onChange={e => setFooterProps(p => ({...p, highlight: {...p.highlight, active: e.target.checked}}))} />
                    <label htmlFor="footerHighlight">Resaltado</label>
                    {footerProps.highlight.active && <input type="color" value={footerProps.highlight.color} onChange={e => setFooterProps(p => ({...p, highlight: {...p.highlight, color: e.target.value}}))} />}
                  </div>
                  <div className="form-group inline-group">
                    <input type="checkbox" id="footerStroke" checked={footerProps.stroke.active} onChange={e => setFooterProps(p => ({...p, stroke: {...p.stroke, active: e.target.checked}}))} />
                    <label htmlFor="footerStroke">Borde de Letra</label>
                    {footerProps.stroke.active && <>
                      <input type="color" value={footerProps.stroke.color} onChange={e => setFooterProps(p => ({...p, stroke: {...p.stroke, color: e.target.value}}))} />
                      <input type="number" min="1" max="10" value={footerProps.stroke.width} onChange={e => setFooterProps(p => ({...p, stroke: {...p.stroke, width: parseInt(e.target.value)}}))} />px
                    </>}
                  </div>
                   <div className="form-group inline-group">
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
              </details>

            </div>
          </div>
        </aside>
        <main className="preview-panel">
          <div className="card-flipper-container" onClick={() => { if (!isDragging) setIsFlipped(!isFlipped); }}>
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
                />
              </div>
              <div className="card-face card-back">
                <CardBackPreview cardProps={cardProps} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </PageContainer>
  );
}

export default CardGeneratorPage;
