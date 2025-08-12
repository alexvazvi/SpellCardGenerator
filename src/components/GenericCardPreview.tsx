import React from 'react';
import { Rnd } from 'react-rnd';

type ElementName = 'title' | 'description' | 'footer' | 'image' | 'imageBack' | 'divider1' | 'divider2' | null;

import type { CardProps, TextElementProps, ImageState, DividerState } from '../types';
import type { DraggableData } from 'react-rnd';
interface GenericCardPreviewProps {
  cardProps: CardProps;
  image: string | null;
  imageBorder: {
    active: boolean;
    color: string;
    width: number;
    lockAspectRatio: boolean;
  };
  onImageUpdate: (element: 'image' | 'imageBack', pos: { x: number; y: number }, size: { width: string; height: string }) => void;
  imageSize: ImageState;
  imageRotation: number;
  titleProps: TextElementProps;
  descriptionProps: TextElementProps;
  footerProps: TextElementProps;
  onElementUpdate: (element: string, pos: { x: number; y: number }, size: { width: string; height: string }) => void;
  divider1: DividerState;
  divider2: DividerState;
  setDivider1: (state: DividerState) => void;
  setDivider2: (state: DividerState) => void;
  smartGuides: {
    vertical: number | null;
    horizontal: number | null;
  };
  handleDragStart: () => void;
  handleDragStop: (element: string, d: DraggableData, size: { width: number | string; height: number | string }) => void;
  activeElement: ElementName;
  onElementClick: (element: ElementName, e: React.MouseEvent<Element, MouseEvent>) => void;
}

const GenericCardPreview: React.FC<GenericCardPreviewProps> = ({
  cardProps,
  image,
  imageBorder,
  onImageUpdate,
  imageSize,
  imageRotation,
  titleProps,
  descriptionProps,
  footerProps,
  onElementUpdate,
  divider1,
  divider2,
  setDivider1,
  setDivider2,
  smartGuides,
  handleDragStart,
  handleDragStop,
  activeElement,
  onElementClick,
}) => {
  const { frame, borderColor, backgroundColor, backgroundImage, fontFamily } = cardProps;
  const showBorder = !frame;

  const getElementStyles = (props: TextElementProps, name: ElementName): React.CSSProperties => {
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

  const getTextStyles = (props: TextElementProps, name: ElementName): React.CSSProperties => {
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

  const textWrapper = (text: string, props: TextElementProps) => {
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
                onDragStart={(e) => { e.stopPropagation(); handleDragStart(); onElementClick('image', e as React.MouseEvent<Element, MouseEvent>);}}
                onDragStop={(_e, d) =>
                  handleDragStop('image', d, imageSize)
                }
                onResizeStart={(e) => { e.stopPropagation(); onElementClick('image', e as React.MouseEvent<Element, MouseEvent>); }}
                onResizeStop={(_e, _dir, ref, _delta, pos) =>
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
              onDragStart={(e) => { e.stopPropagation(); onElementClick('divider1', e as React.MouseEvent<Element, MouseEvent>); handleDragStart(); }}
              onDragStop={(_e, d) => { setDivider1({ ...divider1, x: d.x, y: d.y }); handleDragStop('divider1', d, {width: divider1.width, height: divider1.height}) }}
              onResizeStop={(_e, _dir, ref, _delta, pos) => setDivider1({ ...pos, width: parseInt(ref.style.width), height: parseInt(ref.style.height) })}
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
              onDragStart={(e) => { e.stopPropagation(); onElementClick('title', e as React.MouseEvent<Element, MouseEvent>); handleDragStart(); }}
              onDragStop={(_e, d) =>
                handleDragStop(
                  'title',
                  d,
                  { width: titleProps.width, height: titleProps.height }
                )
              }
              onResizeStart={(e) => { e.stopPropagation(); onElementClick('title', e as React.MouseEvent<Element, MouseEvent>); }}
              onResizeStop={(_e, _dir, ref, _delta, pos) =>
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
              onDragStart={(e) => { e.stopPropagation(); onElementClick('description', e as React.MouseEvent<Element, MouseEvent>); handleDragStart(); }}
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
              onResizeStart={(e) => { e.stopPropagation(); onElementClick('description', e as React.MouseEvent<Element, MouseEvent>); }}
              onResizeStop={(_e, _dir, ref, _delta, pos) =>
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
              onDragStart={(e) => { e.stopPropagation(); onElementClick('divider2', e as React.MouseEvent<Element, MouseEvent>); handleDragStart(); }}
              onDragStop={(_e, d) => { setDivider2({ ...divider2, x: d.x, y: d.y }); handleDragStop('divider2', d, {width: divider2.width, height: divider2.height}) }}
              onResizeStop={(_e, _dir, ref, _delta, pos) => setDivider2({ ...pos, width: parseInt(ref.style.width), height: parseInt(ref.style.height) })}
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
              onDragStart={(e) => { e.stopPropagation(); onElementClick('footer', e as React.MouseEvent<Element, MouseEvent>); handleDragStart(); }}
              onDragStop={(_e, d) =>
                handleDragStop(
                  'footer',
                  d,
                  { width: footerProps.width, height: footerProps.height }
                )
              }
              onResizeStart={(e) => { e.stopPropagation(); onElementClick('footer', e as React.MouseEvent<Element, MouseEvent>); }}
              onResizeStop={(_e, _dir, ref, _delta, pos) =>
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

export default GenericCardPreview;
