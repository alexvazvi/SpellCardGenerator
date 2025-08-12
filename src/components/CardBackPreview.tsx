import React from 'react';
import { Rnd } from 'react-rnd';

type ElementName = 'title' | 'description' | 'footer' | 'image' | 'imageBack' | 'divider1' | 'divider2' | null;

import type { CardProps, ImageState } from '../types';
import type { DraggableData } from 'react-rnd';

interface CardBackPreviewProps {
  cardProps: CardProps;
  imageBack: string | null;
  imageBackSize: ImageState;
  onImageUpdate: (element: 'image' | 'imageBack', pos: { x: number; y: number }, size: { width: string; height: string }) => void;
  activeElement: ElementName;
  onElementClick: (element: ElementName, e: React.MouseEvent<Element, MouseEvent>) => void;
  handleDragStart: () => void;
  handleDragStop: (element: string, d: DraggableData, size: { width: number | string; height: number | string }) => void;
  imageBorder: {
    active: boolean;
    color: string;
    width: number;
    lockAspectRatio: boolean;
  };
}

const CardBackPreview: React.FC<CardBackPreviewProps> = ({
  cardProps,
  imageBack,
  imageBackSize,
  onImageUpdate,
  activeElement,
  onElementClick,
  handleDragStart,
  handleDragStop,
  imageBorder
}) => {
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
                        onDragStart={(e) => { e.stopPropagation(); handleDragStart(); onElementClick('imageBack', e as React.MouseEvent<Element, MouseEvent>);}}
                        onDragStop={(_e, d) => handleDragStop('imageBack', d, imageBackSize)}
                        onResizeStart={(e) => { e.stopPropagation(); onElementClick('imageBack', e as React.MouseEvent<Element, MouseEvent>);}}
                        onResizeStop={(_e, _dir, ref, _delta, pos) =>
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

export default CardBackPreview;
