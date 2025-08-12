import React, { useState, useRef, useEffect } from 'react';
import './CardGeneratorPage.css';
import PageContainer from '../../components/PageContainer';
import { Rnd } from 'react-rnd';
import tinycolor from 'tinycolor2';

type ElementName = 'title' | 'description' | 'footer' | 'image' | 'imageBack' | 'divider1' | 'divider2' | null;

const GenericCardPreview = (
    { cardProps, image, imageBorder, onImageUpdate, imageSize, imageRotation, titleProps, descriptionProps, footerProps, onElementUpdate, divider1, divider2, setDivider1, setDivider2, smartGuides, handleDragStart, handleDragStop, activeElement, onElementClick }:
    { 
      cardProps: any,
      image: string | null,
      imageBorder: any,
      onImageUpdate: (element: 'image', pos: any, size: any) => void,
      imageSize: { x: number, y: number, width: number | string, height: number | string },
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
      handleDragStop: (element: string, d: any, size: any) => void,
      activeElement: ElementName,
      onElementClick: (element: ElementName, e: React.MouseEvent<Element, MouseEvent>) => void;
    }
) => {
  const { frame, borderColor, backgroundColor, backgroundImage, fontFamily } = cardProps;
  const showBorder = !frame;

  const getElementStyles = (props: any, name: ElementName): React.CSSProperties => {
    const styles: React.CSSProperties = {
        zIndex: activeElement === name ? 10 : 4,
        background: props.backgroundColor,
        border: 'none',
    };
    if (props.border?.active) {
        styles.border = `${props.border.width}px solid ${props.border.color}`;
        styles.borderRadius = props.border.style === 'rounded' ? '8px' : '0px';
    }
    if (activeElement === name) {
      styles.outline = `2px dashed grey`;
      styles.outlineOffset = '2px';
    }
    return styles;
  }

  const getTextStyles = (props: any, name: ElementName): React.CSSProperties => {
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

    if (name === 'description') {
      styles.alignItems = 'flex-start';
      styles.textAlign = 'left';
      styles.whiteSpace = 'pre-wrap';
      // No extra padding top, padding is handled by the main style
    }

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
      backgroundImage: frame ? 'none' : (backgroundImage ? `url(${backgroundImage})` : 'none'),
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      fontFamily: fontFamily,
      boxSizing: 'border-box',
      position: 'relative',
      zIndex: 2
  }

  return (
    <div className="card-wrapper" onClick={(e) => onElementClick(null, e)}>
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
            {activeElement && (
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  zIndex: 9, // Above inactive elements, below the active one
                }}
                onClick={(e) => onElementClick(null, e)}
              />
            )}
            {smartGuides.vertical && <div className="smart-guide vertical" style={{ left: smartGuides.vertical }}></div>}
            {smartGuides.horizontal && <div className="smart-guide horizontal" style={{ top: smartGuides.horizontal }}></div>}

            {image && (
            <Rnd
                style={{
                  zIndex: activeElement === 'image' ? 10 : 3,
                  border: imageBorder.active ? `${imageBorder.width}px solid ${imageBorder.color}` : 'none',
                  boxSizing: 'border-box',
                  outline: activeElement === 'image' ? `2px dashed ${!imageBorder.lockAspectRatio ? '#007bff' : 'grey'}` : 'none',
                  outlineOffset: '2px',
                }}
                size={{ width: imageSize.width, height: imageSize.height }}
                position={{ x: imageSize.x, y: imageSize.y }}
                onDragStart={(e) => { e.stopPropagation(); handleDragStart(); onElementClick('image', e as any);}}
                onDragStop={(_e, d) =>
                  handleDragStop('image', d, imageSize)
                }
                onResizeStart={(e) => { e.stopPropagation(); onElementClick('image', e as any); }}
                onResizeStop={(_e, _dir, ref, _del, pos) =>
                  onImageUpdate('image', pos, {
                    width: ref.style.width,
                    height: ref.style.height,
                  })
                }
                lockAspectRatio={imageBorder.lockAspectRatio}
                bounds="parent"
                className={activeElement === 'image' ? 'interactive-element active' : 'interactive-element'}
                onClick={(e: React.MouseEvent<Element, MouseEvent>) => onElementClick('image', e)}
              >
                <img
                  src={image}
                  alt="Custom content"
                  style={{
                    width: '100%',
                    height: '100%',
                    transform: `rotate(${imageRotation}deg)`,
                    objectFit: 'cover',
                    pointerEvents: 'none',
                  }}
                />
              </Rnd>
            )}
  
            <Rnd
              style={{ zIndex: activeElement === 'divider1' ? 10 : 5, display: 'flex', alignItems: 'center', justifyContent: 'center', border: activeElement === 'divider1' ? '1px dashed grey' : 'none',}}
              size={{ width: divider1.width, height: divider1.height }}
              position={{ x: divider1.x, y: divider1.y }}
              onDragStart={(e) => { e.stopPropagation(); onElementClick('divider1', e as any); handleDragStart(); }}
              onDragStop={(_e, d) => { setDivider1({ ...divider1, x: d.x, y: d.y }); handleDragStop('divider1', d, {width: divider1.width, height: divider1.height}) }}
              onResizeStop={(_e, _dir, ref, _del, pos) => setDivider1({ ...pos, width: parseInt(ref.style.width), height: parseInt(ref.style.height) })}
              bounds="parent"
              className={activeElement === 'divider1' ? 'interactive-element active' : 'interactive-element'}
              onClick={(e: React.MouseEvent<Element, MouseEvent>) => onElementClick('divider1', e)}
              enableResizing={{ top: false, right: true, bottom: false, left: true, topRight: false, bottomRight: false, bottomLeft: false, topLeft: false }}
            >
              <div className="filigree-divider"></div>
            </Rnd>
            
            <Rnd
              style={getElementStyles(titleProps, 'title')}
              size={{ width: titleProps.width, height: titleProps.height }}
              position={{ x: titleProps.x, y: titleProps.y }}
              onDragStart={(e) => { e.stopPropagation(); onElementClick('title', e as any); handleDragStart(); }}
              onDragStop={(_e, d) =>
                handleDragStop(
                  'title',
                  d,
                  { width: titleProps.width, height: titleProps.height }
                )
              }
              onResizeStart={(e) => { e.stopPropagation(); onElementClick('title', e as any); }}
              onResizeStop={(_e, _dir, ref, _del, pos) =>
                onElementUpdate('title', pos, {
                  width: ref.style.width,
                  height: ref.style.height,
                })
              }
              bounds="parent"
              className={activeElement === 'title' ? 'interactive-element active' : 'interactive-element'}
              onClick={(e: React.MouseEvent<Element, MouseEvent>) => onElementClick('title', e)}
            >
              <h3 style={{ ...getTextStyles(titleProps, 'title'), fontSize: '1.2em' }}>
                {textWrapper(titleProps.text, titleProps)}
              </h3>
            </Rnd>
  
            <Rnd
              style={getElementStyles(descriptionProps, 'description')}
              size={{
                width: descriptionProps.width,
                height: descriptionProps.height,
              }}
              position={{ x: descriptionProps.x, y: descriptionProps.y }}
              onDragStart={(e) => { e.stopPropagation(); onElementClick('description', e as any); handleDragStart(); }}
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
              onResizeStart={(e) => { e.stopPropagation(); onElementClick('description', e as any); }}
              onResizeStop={(_e, _dir, ref, _del, pos) =>
                onElementUpdate('description', pos, {
                  width: ref.style.width,
                  height: ref.style.height,
                })
              }
              bounds="parent"
              className={activeElement === 'description' ? 'interactive-element active' : 'interactive-element'}
              onClick={(e: React.MouseEvent<Element, MouseEvent>) => onElementClick('description', e)}
            >
              <div
                style={{
                  ...getTextStyles(descriptionProps, 'description'),
                  fontSize: '0.9em',
                }}
              >
                {textWrapper(descriptionProps.text, descriptionProps)}
              </div>
            </Rnd>

            <Rnd
              style={{ zIndex: activeElement === 'divider2' ? 10 : 5, display: 'flex', alignItems: 'center', justifyContent: 'center', border: activeElement === 'divider2' ? '1px dashed grey' : 'none',}}
              size={{ width: divider2.width, height: divider2.height }}
              position={{ x: divider2.x, y: divider2.y }}
              onDragStart={(e) => { e.stopPropagation(); onElementClick('divider2', e as any); handleDragStart(); }}
              onDragStop={(_e, d) => { setDivider2({ ...divider2, x: d.x, y: d.y }); handleDragStop('divider2', d, {width: divider2.width, height: divider2.height}) }}
              onResizeStop={(_e, _dir, ref, _del, pos) => setDivider2({ ...pos, width: parseInt(ref.style.width), height: parseInt(ref.style.height) })}
              bounds="parent"
              className={activeElement === 'divider2' ? 'interactive-element active' : 'interactive-element'}
              onClick={(e: React.MouseEvent<Element, MouseEvent>) => onElementClick('divider2', e)}
              enableResizing={{ top: false, right: true, bottom: false, left: true, topRight: false, bottomRight: false, bottomLeft: false, topLeft: false }}
            >
              <div className="filigree-divider"></div>
            </Rnd>
  
            <Rnd
              style={getElementStyles(footerProps, 'footer')}
              size={{ width: footerProps.width, height: footerProps.height }}
              position={{ x: footerProps.x, y: footerProps.y }}
              onDragStart={(e) => { e.stopPropagation(); onElementClick('footer', e as any); handleDragStart(); }}
              onDragStop={(_e, d) =>
                handleDragStop(
                  'footer',
                  d,
                  { width: footerProps.width, height: footerProps.height }
                )
              }
              onResizeStart={(e) => { e.stopPropagation(); onElementClick('footer', e as any); }}
              onResizeStop={(_e, _dir, ref, _del, pos) =>
                onElementUpdate('footer', pos, {
                  width: ref.style.width,
                  height: ref.style.height,
                })
              }
              bounds="parent"
              className={activeElement === 'footer' ? 'interactive-element active' : 'interactive-element'}
              onClick={(e: React.MouseEvent<Element, MouseEvent>) => onElementClick('footer', e)}
            >
              <footer
                style={{ ...getTextStyles(footerProps, 'footer'), fontSize: '0.8em' }}
              >
                {textWrapper(footerProps.text, footerProps)}
              </footer>
            </Rnd>
          </div>
        </div>
    </div>
  );
}

const CardBackPreview = ({ cardProps, imageBack, imageBackSize, onImageUpdate, activeElement, onElementClick, handleDragStart, handleDragStop, imageBorder }: { cardProps: any, imageBack: string | null, imageBackSize: any, onImageUpdate: any, activeElement: ElementName, onElementClick: (element: ElementName, e: React.MouseEvent<Element, MouseEvent>) => void, handleDragStart: () => void, handleDragStop: (element: string, d: any, size: any) => void, imageBorder: any }) => {
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
      }} onClick={(e: React.MouseEvent<Element, MouseEvent>) => onElementClick(null, e)}>
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
                 {imageBack && (
                    <Rnd
                        style={{
                            zIndex: activeElement === 'imageBack' ? 10 : 3,
                            border: 'none',
                            boxSizing: 'border-box',
                            outline: activeElement === 'imageBack' ? `2px dashed ${!imageBorder.lockAspectRatio ? '#007bff' : 'grey'}` : 'none',
                            outlineOffset: '2px',
                        }}
                        size={{ width: imageBackSize.width, height: imageBackSize.height }}
                        position={{ x: imageBackSize.x, y: imageBackSize.y }}
                        onDragStart={(e) => { e.stopPropagation(); handleDragStart(); onElementClick('imageBack', e as any);}}
                        onDragStop={(_e, d) => handleDragStop('imageBack', d, imageBackSize)}
                        onResizeStart={(e) => { e.stopPropagation(); onElementClick('imageBack', e as any);}}
                        onResizeStop={(_e, _dir, ref, _del, pos) =>
                            onImageUpdate('imageBack', pos, {
                                width: ref.style.width,
                                height: ref.style.height,
                            })
                        }
                        lockAspectRatio={imageBorder.lockAspectRatio}
                        bounds="parent"
                        className={activeElement === 'imageBack' ? 'interactive-element active' : 'interactive-element'}
                        onClick={(e: React.MouseEvent<Element, MouseEvent>) => onElementClick('imageBack', e)}
                    >
                        <img
                            src={imageBack}
                            alt="Custom content back"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                pointerEvents: 'none',
                            }}
                        />
                    </Rnd>
                )}
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
  }
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

  const handleDragStop = (element: string, d: any, size: {width: string | number, height: string | number}) => {
    setIsDragging(false);
    document.body.classList.remove('is-dragging');
    setSmartGuides({ vertical: null, horizontal: null });
    if (element === 'image' || element === 'imageBack') {
      handleImageUpdate(element, { x: d.x, y: d.y }, {width: String(size.width), height: String(size.height)});
    } else {
      handleElementUpdate(element, { x: d.x, y: d.y }, {width: String(size.width), height: String(size.height)});
    }
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
        </main>
      </div>
    </PageContainer>
  );
}

export default CardGeneratorPage;
