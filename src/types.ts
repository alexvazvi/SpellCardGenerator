
// Definimos una interfaz base para las propiedades de los elementos de texto
export export interface TextElementProps {
  text: string;
  x: number;
  y: number;
  width: number | 'auto';
  height: number | 'auto';
  color: string;
  backgroundColor: string;
  highlight: {
    active: boolean;
    color: string;
  };
  stroke: {
    active: boolean;
    color: string;
    width: number;
  };
  border: {
    active: boolean;
    style: string;
    width: number;
    color: string;
  };
}

// Definimos la interfaz para las propiedades generales de la carta
export interface CardProps {
  borderColor: string;
  borderWidth: number;
  fontFamily: string;
  frame: string;
  frameBack: string;
  backgroundColor: string;
  backgroundImage: string | null;
  backBackgroundColor: string;
  backBackgroundImage: string | null;
  backPatternColor: string;
  backPatternOpacity: number;
}

// Definimos la interfaz para el estado de una imagen
export interface ImageState {
  x: number;
  y: number;
  width: number;
  height: number;
}
export interface DividerState {
  x: number;
  y: number;
  width: number;
  height: number;
}

// Definimos la interfaz principal para una carta guardada
export interface Card {
  id: number;
  cardProps: CardProps;
  titleProps: TextElementProps;
  descriptionProps: TextElementProps;
  footerProps: TextElementProps;
  image: string | null;
  imageSize: ImageState;
  imageRotation: number;
  imageBorder: {
    active: boolean;
    color: string;
    width: number;
    lockAspectRatio: boolean;
  };
  imageBack: string | null;
  imageBackSize: ImageState;
  divider1: DividerState;
  divider2: DividerState;
}

