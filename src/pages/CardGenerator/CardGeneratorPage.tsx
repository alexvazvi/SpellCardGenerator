import React, { useState } from 'react';
import './CardGeneratorPage.css';

// A simple generic card component for preview
import { Rnd } from 'react-rnd';

const GenericCardPreview = (
    { borderColor, fontFamily, frame, image, onImageUpdate, imageSize, imageRotation, titleProps, descriptionProps, footerProps, onElementUpdate }:
    { 
      borderColor: string, 
      fontFamily: string, 
      frame: string,
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
  const showBorder = !frame;

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
        color: 'inherit',
        fontFamily: 'inherit'
    };
    if (props.underline?.active) {
        styles.borderBottom = `${props.underline.thickness}px solid ${props.underline.color}`;
    }
    if (props.stroke?.active) {
        styles.WebkitTextStroke = `${props.stroke.width}px ${props.stroke.color}`;
    }
    return styles;
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
      
      <div style={{
        width: '100%',
        height: '100%',
        border: showBorder ? `10px solid ${borderColor}` : 'none',
        borderRadius: '15px',
        backgroundColor: frame ? 'transparent' : '#F5DEB3',
        fontFamily: fontFamily,
        boxSizing: 'border-box',
        position: 'relative',
        zIndex: 2
      }}>
        {/* Container for all interactive elements */}
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
            style={{ zIndex: 4, background: titleProps.backgroundColor }}
            size={{ width: titleProps.width, height: titleProps.height }}
            position={{ x: titleProps.x, y: titleProps.y }}
            onDragStop={(_e, d) => onElementUpdate('title', { x: d.x, y: d.y }, {width: titleProps.width, height: titleProps.height})}
            onResizeStop={(_e, _dir, ref, _del, pos) => onElementUpdate('title', pos, { width: ref.style.width, height: ref.style.height })}
            bounds="parent"
            className="interactive-element"
          >
            <h3 style={{ ...getTextStyles(titleProps), fontSize: '1.2em' }}>
              {titleProps.text}
            </h3>
          </Rnd>

          <Rnd
            style={{ zIndex: 4, background: descriptionProps.backgroundColor }}
            size={{ width: descriptionProps.width, height: descriptionProps.height }}
            position={{ x: descriptionProps.x, y: descriptionProps.y }}
            onDragStop={(_e, d) => onElementUpdate('description', { x: d.x, y: d.y }, {width: descriptionProps.width, height: descriptionProps.height})}
            onResizeStop={(_e, _dir, ref, _del, pos) => onElementUpdate('description', pos, { width: ref.style.width, height: ref.style.height })}
            bounds="parent"
            className="interactive-element"
          >
            <div style={{ ...getTextStyles(descriptionProps), fontSize: '0.9em', alignItems: 'flex-start', textAlign: 'left' }}>
              {descriptionProps.text}
            </div>
          </Rnd>
          
          <Rnd
            style={{ zIndex: 4, background: footerProps.backgroundColor }}
            size={{ width: footerProps.width, height: footerProps.height }}
            position={{ x: footerProps.x, y: footerProps.y }}
            onDragStop={(_e, d) => onElementUpdate('footer', { x: d.x, y: d.y }, {width: footerProps.width, height: footerProps.height})}
            onResizeStop={(_e, _dir, ref, _del, pos) => onElementUpdate('footer', pos, { width: ref.style.width, height: ref.style.height })}
            bounds="parent"
            className="interactive-element"
          >
            <footer style={{ ...getTextStyles(footerProps), fontSize: '0.8em' }}>
              {footerProps.text}
            </footer>
          </Rnd>

        </div>
      </div>
    </div>
  );
};


function CardGeneratorPage() {
  // Element properties state
  const [titleProps, setTitleProps] = useState({ 
    text: 'Título de la Carta', x: 40, y: 20, width: 240, height: 50, backgroundColor: 'rgba(0,0,0,0)',
    underline: { active: false, color: '#000000', thickness: 2 },
    stroke: { active: false, color: '#000000', width: 1 }
  });
  const [descriptionProps, setDescriptionProps] = useState({ 
    text: 'Esta es la descripción de la carta. Puedes escribir aquí los detalles del item o conjuro.', x: 30, y: 250, width: 260, height: 120, backgroundColor: 'rgba(0,0,0,0)',
    underline: { active: false, color: '#000000', thickness: 2 },
    stroke: { active: false, color: '#000000', width: 1 }
  });
  const [footerProps, setFooterProps] = useState({
    text: 'Texto de pie de página', x: 30, y: 380, width: 260, height: 40, backgroundColor: 'rgba(0,0,0,0)',
    underline: { active: false, color: '#000000', thickness: 2 },
    stroke: { active: false, color: '#000000', width: 1 }
  });

  // Card style state
  const [borderColor, setBorderColor] = useState('#8B4513'); // SaddleBrown
  const [fontFamily, setFontFamily] = useState('serif');
  const [selectedFrame, setSelectedFrame] = useState('');

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

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && e.target.result) {
          setImage(e.target.result as string);
        }
      };
      reader.readAsDataURL(event.target.files[0]);
    }
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
              <summary className="accordion-header">Estilos Generales</summary>
              <div className="accordion-content">
                <div className="form-group">
                  <label>Fuente:</label>
                  <select value={fontFamily} onChange={(e) => setFontFamily(e.target.value)} className="form-card-input">
                    <option value="serif">Serif (Clásica)</option>
                    <option value="sans-serif">Sans-Serif (Moderna)</option>
                    <option value="fantasy">Fantasy (Fantasía)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Marco (Imagen):</label>
                  <select value={selectedFrame} onChange={(e) => setSelectedFrame(e.target.value)} className="form-card-input">
                    {availableFrames.map(frame => (<option key={frame.value} value={frame.value}>{frame.name}</option>))}
                  </select>
                </div>
                 <div className="form-group">
                  <label>Color Borde (si no hay marco):</label>
                  <input type="color" value={borderColor} onChange={(e) => setBorderColor(e.target.value)} style={{width: '100%'}}/>
                </div>
              </div>
            </details>

            <details className="accordion-item">
              <summary className="accordion-header">Imagen</summary>
              <div className="accordion-content">
                <div className="form-group">
                  <label>Cargar Imagen:</label>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="form-card-input"/>
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
              <summary className="accordion-header">Título</summary>
              <div className="accordion-content">
                <div className="form-group">
                  <label>Texto:</label>
                  <input type="text" value={titleProps.text} onChange={(e) => setTitleProps(p => ({...p, text: e.target.value}))} className="form-card-input" />
                </div>
                <div className="form-group color-group">
                  <label>Color de Fondo:</label>
                  <div>
                    <input type="color" value={titleProps.backgroundColor} onChange={(e) => setTitleProps(p => ({...p, backgroundColor: e.target.value}))} />
                    <button type="button" onClick={() => setTitleProps(p => ({...p, backgroundColor: 'rgba(0,0,0,0)'}))} className="action-button-circular">T</button>
                  </div>
                </div>
                <div className="form-group inline-group">
                  <input type="checkbox" id="titleUnderline" checked={titleProps.underline.active} onChange={e => setTitleProps(p => ({...p, underline: {...p.underline, active: e.target.checked}}))} />
                  <label htmlFor="titleUnderline">Subrayado</label>
                  {titleProps.underline.active && <>
                    <input type="color" value={titleProps.underline.color} onChange={e => setTitleProps(p => ({...p, underline: {...p.underline, color: e.target.value}}))} />
                    <input type="number" min="1" max="10" value={titleProps.underline.thickness} onChange={e => setTitleProps(p => ({...p, underline: {...p.underline, thickness: parseInt(e.target.value)}}))} />px
                  </>}
                </div>
                <div className="form-group inline-group">
                  <input type="checkbox" id="titleStroke" checked={titleProps.stroke.active} onChange={e => setTitleProps(p => ({...p, stroke: {...p.stroke, active: e.target.checked}}))} />
                  <label htmlFor="titleStroke">Borde de Letra</label>
                  {titleProps.stroke.active && <>
                    <input type="color" value={titleProps.stroke.color} onChange={e => setTitleProps(p => ({...p, stroke: {...p.stroke, color: e.target.value}}))} />
                    <input type="number" min="1" max="10" value={titleProps.stroke.width} onChange={e => setTitleProps(p => ({...p, stroke: {...p.stroke, width: parseInt(e.target.value)}}))} />px
                  </>}
                </div>
              </div>
            </details>
            <details className="accordion-item">
              <summary className="accordion-header">Descripción</summary>
              <div className="accordion-content">
                <div className="form-group">
                  <label>Texto:</label>
                  <textarea value={descriptionProps.text} onChange={(e) => setDescriptionProps(p => ({...p, text: e.target.value}))} rows={4} className="form-card-textarea"/>
                </div>
                <div className="form-group color-group">
                  <label>Color de Fondo:</label>
                  <div>
                    <input type="color" value={descriptionProps.backgroundColor} onChange={(e) => setDescriptionProps(p => ({...p, backgroundColor: e.target.value}))} />
                    <button type="button" onClick={() => setDescriptionProps(p => ({...p, backgroundColor: 'rgba(0,0,0,0)'}))} className="action-button-circular">T</button>
                  </div>
                </div>
                 <div className="form-group inline-group">
                  <input type="checkbox" id="descUnderline" checked={descriptionProps.underline.active} onChange={e => setDescriptionProps(p => ({...p, underline: {...p.underline, active: e.target.checked}}))} />
                  <label htmlFor="descUnderline">Subrayado</label>
                  {descriptionProps.underline.active && <>
                    <input type="color" value={descriptionProps.underline.color} onChange={e => setDescriptionProps(p => ({...p, underline: {...p.underline, color: e.target.value}}))} />
                    <input type="number" min="1" max="10" value={descriptionProps.underline.thickness} onChange={e => setDescriptionProps(p => ({...p, underline: {...p.underline, thickness: parseInt(e.target.value)}}))} />px
                  </>}
                </div>
                <div className="form-group inline-group">
                  <input type="checkbox" id="descStroke" checked={descriptionProps.stroke.active} onChange={e => setDescriptionProps(p => ({...p, stroke: {...p.stroke, active: e.target.checked}}))} />
                  <label htmlFor="descStroke">Borde de Letra</label>
                  {descriptionProps.stroke.active && <>
                    <input type="color" value={descriptionProps.stroke.color} onChange={e => setDescriptionProps(p => ({...p, stroke: {...p.stroke, color: e.target.value}}))} />
                    <input type="number" min="1" max="10" value={descriptionProps.stroke.width} onChange={e => setDescriptionProps(p => ({...p, stroke: {...p.stroke, width: parseInt(e.target.value)}}))} />px
                  </>}
                </div>
              </div>
            </details>
            <details className="accordion-item">
              <summary className="accordion-header">Pie de Página</summary>
              <div className="accordion-content">
                <div className="form-group">
                  <label>Texto:</label>
                  <input type="text" value={footerProps.text} onChange={(e) => setFooterProps(p => ({...p, text: e.target.value}))} className="form-card-input" />
                </div>
                <div className="form-group color-group">
                  <label>Color de Fondo:</label>
                  <div>
                    <input type="color" value={footerProps.backgroundColor} onChange={(e) => setFooterProps(p => ({...p, backgroundColor: e.target.value}))} />
                    <button type="button" onClick={() => setFooterProps(p => ({...p, backgroundColor: 'rgba(0,0,0,0)'}))} className="action-button-circular">T</button>
                  </div>
                </div>
                <div className="form-group inline-group">
                  <input type="checkbox" id="footerUnderline" checked={footerProps.underline.active} onChange={e => setFooterProps(p => ({...p, underline: {...p.underline, active: e.target.checked}}))} />
                  <label htmlFor="footerUnderline">Subrayado</label>
                  {footerProps.underline.active && <>
                    <input type="color" value={footerProps.underline.color} onChange={e => setFooterProps(p => ({...p, underline: {...p.underline, color: e.target.value}}))} />
                    <input type="number" min="1" max="10" value={footerProps.underline.thickness} onChange={e => setFooterProps(p => ({...p, underline: {...p.underline, thickness: parseInt(e.target.value)}}))} />px
                  </>}
                </div>
                <div className="form-group inline-group">
                  <input type="checkbox" id="footerStroke" checked={footerProps.stroke.active} onChange={e => setFooterProps(p => ({...p, stroke: {...p.stroke, active: e.target.checked}}))} />
                  <label htmlFor="footerStroke">Borde de Letra</label>
                  {footerProps.stroke.active && <>
                    <input type="color" value={footerProps.stroke.color} onChange={e => setFooterProps(p => ({...p, stroke: {...p.stroke, color: e.target.value}}))} />
                    <input type="number" min="1" max="10" value={footerProps.stroke.width} onChange={e => setFooterProps(p => ({...p, stroke: {...p.stroke, width: parseInt(e.target.value)}}))} />px
                  </>}
                </div>
              </div>
            </details>

          </div>
        </div>
      </aside>
      <main className="preview-panel content-wrapper">
        <GenericCardPreview 
          borderColor={borderColor}
          fontFamily={fontFamily}
          frame={selectedFrame}
          image={image}
          onImageUpdate={handleImageUpdate}
          imageSize={imageSize}
          imageRotation={imageRotation}
          titleProps={titleProps}
          descriptionProps={descriptionProps}
          footerProps={footerProps}
          onElementUpdate={handleElementUpdate}
        />
      </main>
    </div>
  );
}

export default CardGeneratorPage;
