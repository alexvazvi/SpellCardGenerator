import React, { useState } from 'react';
import './CardGeneratorPage.css';

import { Rnd } from 'react-rnd';
import tinycolor from 'tinycolor2';

const GenericCardPreview = (
    { cardProps, image, onImageUpdate, imageSize, imageRotation, titleProps, descriptionProps, footerProps, onElementUpdate }:
    { 
      cardProps: any,
      image: string | null,
      onImageUpdate: (style: any, size: any) => void,
      imageSize: { width: number, height: number },
      imageRotation: number,
      titleProps: any,
      descriptionProps: any,
      footerProps: any,
      onElementUpdate: (element: string, pos: any, size: any) => void
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
        justifyContent: 'center',
        margin: 0,
        padding: '5px',
        boxSizing: 'border-box',
        textAlign: 'center',
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
      border: showBorder ? `10px solid ${borderColor}` : 'none',
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
    <div style={{
      width: '320px',
      height: '450px',
      position: 'relative',
      boxSizing: 'border-box',
      overflow: 'hidden',
      borderRadius: '15px',
    }}>
      {frame && <img src={frame} alt="Card Frame" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1, objectFit: 'fill' }}/>}
      
      <div style={cardBaseStyle}>
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          {image && (
            <Rnd
                style={{ zIndex: 3 }}
                size={{ width: imageSize.width, height: imageSize.height }}
                default={{ x: 160 - (imageSize.width / 2), y: 100, width: imageSize.width, height: imageSize.height }}
                onDragStop={(_e, d) => onImageUpdate({ x: d.x, y: d.y }, imageSize)}
                onResizeStop={(_e, _dir, ref, _del, pos) => onImageUpdate(pos, { width: ref.style.width, height: ref.style.height })}
                lockAspectRatio
                bounds="parent"
            >
                <img src={image} alt="Custom content" style={{ width: '100%', height: '100%', transform: `rotate(${imageRotation}deg)`, pointerEvents: 'none' }} />
            </Rnd>
          )}

          <Rnd
            style={getElementStyles(titleProps)}
            size={{ width: titleProps.width, height: titleProps.height }}
            position={{ x: titleProps.x, y: titleProps.y }}
            onDragStop={(_e, d) => onElementUpdate('title', { x: d.x, y: d.y }, {width: titleProps.width, height: titleProps.height})}
            onResizeStop={(_e, _dir, ref, _del, pos) => onElementUpdate('title', pos, { width: ref.style.width, height: ref.style.height })}
            bounds="parent"
            className="interactive-element"
          >
            <h3 style={{ ...getTextStyles(titleProps), fontSize: '1.2em' }}>
              {textWrapper(titleProps.text, titleProps)}
            </h3>
          </Rnd>

          <Rnd
            style={getElementStyles(descriptionProps)}
            size={{ width: descriptionProps.width, height: descriptionProps.height }}
            position={{ x: descriptionProps.x, y: descriptionProps.y }}
            onDragStop={(_e, d) => onElementUpdate('description', { x: d.x, y: d.y }, {width: descriptionProps.width, height: descriptionProps.height})}
            onResizeStop={(_e, _dir, ref, _del, pos) => onElementUpdate('description', pos, { width: ref.style.width, height: ref.style.height })}
            bounds="parent"
            className="interactive-element"
          >
            <div style={{ ...getTextStyles(descriptionProps), fontSize: '0.9em', alignItems: 'flex-start', textAlign: 'left', whiteSpace: 'pre-wrap' }}>
               {textWrapper(descriptionProps.text, descriptionProps)}
            </div>
          </Rnd>
          
          <Rnd
            style={getElementStyles(footerProps)}
            size={{ width: footerProps.width, height: footerProps.height }}
            position={{ x: footerProps.x, y: footerProps.y }}
            onDragStop={(_e, d) => onElementUpdate('footer', { x: d.x, y: d.y }, {width: footerProps.width, height: footerProps.height})}
            onResizeStop={(_e, _dir, ref, _del, pos) => onElementUpdate('footer', pos, { width: ref.style.width, height: ref.style.height })}
            bounds="parent"
            className="interactive-element"
          >
            <footer style={{ ...getTextStyles(footerProps), fontSize: '0.8em' }}>
              {textWrapper(footerProps.text, footerProps)}
            </footer>
          </Rnd>

        </div>
      </div>
    </div>
  );
};

const CardBackPreview = ({ cardProps }: { cardProps: any }) => {
  const { frame, borderColor, backBackgroundColor, backBackgroundImage } = cardProps;
  const showBorder = !frame;

  const cardBaseStyle: React.CSSProperties = {
      width: '100%',
      height: '100%',
      border: showBorder ? `10px solid ${borderColor}` : 'none',
      borderRadius: '15px',
      backgroundColor: frame ? 'transparent' : backBackgroundColor,
      backgroundImage: `url(${backBackgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
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
          {frame && <img src={frame} alt="Card Frame" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1, objectFit: 'fill' }}/>}
          <div style={cardBaseStyle}>
              {/* Content for the back can go here if needed later */}
          </div>
      </div>
  )
}


function CardGeneratorPage() {
  // Card properties state
  const [cardProps, setCardProps] = useState({
    borderColor: '#8B4513',
    fontFamily: 'serif',
    frame: '',
    backgroundColor: '#F5DEB3',
    backgroundImage: null as string | null,
    backBackgroundColor: '#8B4513',
    backBackgroundImage: null as string | null,
  });

  const updateCardProps = (props: Partial<typeof cardProps>) => {
    setCardProps(prev => ({ ...prev, ...props }));
  };

  const defaultBorderColor = tinycolor(cardProps.borderColor).darken(20).toString();

  // Element properties state
  const [titleProps, setTitleProps] = useState({ 
    text: 'Título de la Carta', x: 40, y: 20, width: 240, height: 50,
    color: '#000000',
    backgroundColor: 'rgba(0,0,0,0)',
    highlight: { active: false, color: '#ffff00' },
    stroke: { active: false, color: '#000000', width: 1 },
    border: { active: false, style: 'rounded', width: 2, color: defaultBorderColor }
  });
  const [descriptionProps, setDescriptionProps] = useState({ 
    text: 'Esta es la descripción de la carta. Puedes escribir aquí los detalles del item o conjuro.', x: 30, y: 250, width: 260, height: 120,
    color: '#000000',
    backgroundColor: 'rgba(0,0,0,0)',
    highlight: { active: false, color: '#ffff00' },
    stroke: { active: false, color: '#000000', width: 1 },
    border: { active: false, style: 'rounded', width: 2, color: defaultBorderColor }
  });
  const [footerProps, setFooterProps] = useState({
    text: 'Texto de pie de página', x: 30, y: 380, width: 260, height: 40,
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

  // Frame options
  const availableFrames = [
    { name: 'Sin Marco', value: '' },
    { name: 'Marco Clásico', value: '/frames/classic-frame.png' },
    { name: 'Marco Élfico', value: '/frames/elvish-frame.png' },
    { name: 'Marco Enano', value: '/frames/dwarven-frame.png' },
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

  const handleElementUpdate = (element: string, pos: {x: number, y: number}, size: {width: string, height: string}) => {
    const newSize = { width: parseInt(size.width), height: parseInt(size.height) };
    const newPos = { x: pos.x, y: pos.y };
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
    <div className="card-generator-layout main-container">
      <aside className="forms-column">
        <div className="spell-form-as-card">
          <div className="card-header">
            <h2 className="card-title form-card-input" style={{textAlign: 'center', margin: '0'}}>Personalizar Carta</h2>
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
                  <label>Marco (Imagen):</label>
                  <select value={cardProps.frame} onChange={(e) => updateCardProps({ frame: e.target.value })} className="form-card-input">
                    {availableFrames.map(frame => (<option key={frame.value} value={frame.value}>{frame.name}</option>))}
                  </select>
                </div>
                 <div className="form-group">
                  <label>Color Borde (si no hay marco):</label>
                  <input type="color" value={cardProps.borderColor} onChange={(e) => updateCardProps({ borderColor: e.target.value })} style={{width: '100%'}}/>
                </div>
                <div className="form-group">
                  <label>Color Fondo (Frontal):</label>
                  <input type="color" value={cardProps.backgroundColor} onChange={(e) => updateCardProps({ backgroundColor: e.target.value })} style={{width: '100%'}}/>
                </div>
                <div className="form-group">
                  <label>Imagen Fondo (Frontal):</label>
                  <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, (res) => updateCardProps({ backgroundImage: res }))} className="form-card-input"/>
                </div>
                <div className="form-group">
                  <label>Color Fondo (Trasera):</label>
                  <input type="color" value={cardProps.backBackgroundColor} onChange={(e) => updateCardProps({ backBackgroundColor: e.target.value })} style={{width: '100%'}}/>
                </div>
                <div className="form-group">
                  <label>Imagen Fondo (Trasera):</label>
                  <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, (res) => updateCardProps({ backBackgroundImage: res }))} className="form-card-input"/>
                </div>
              </div>
            </details>

            <details className="accordion-item">
              <summary className="accordion-header">Imagen Principal</summary>
              <div className="accordion-content">
                <div className="form-group">
                  <label>Cargar Imagen:</label>
                  <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, setImage)} className="form-card-input"/>
                </div>
                {image && (<>
                  <div className="form-group">
                    <label>Tamaño ({Math.round(imageSize.width)}px):</label>
                    <input type="range" min="50" max="500" value={imageSize.width} onChange={handleSizeChange} />
                  </div>
                  <div className="form-group">
                    <label>Rotación ({imageRotation}°):</label>
                    <input type="range" min="0" max="360" value={imageRotation} onChange={(e) => setImageRotation(parseInt(e.target.value))} />
                  </div>
                </>)}
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
      <main className="preview-panel content-wrapper" style={{ display: 'flex', gap: '2rem', alignItems: 'center', justifyContent: 'center' }}>
        <GenericCardPreview 
          cardProps={cardProps}
          image={image}
          onImageUpdate={handleImageUpdate}
          imageSize={imageSize}
          imageRotation={imageRotation}
          titleProps={titleProps}
          descriptionProps={descriptionProps}
          footerProps={footerProps}
          onElementUpdate={handleElementUpdate}
        />
        <CardBackPreview cardProps={cardProps} />
      </main>
    </div>
  );
}

export default CardGeneratorPage;
