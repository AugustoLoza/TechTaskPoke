import React from 'react';
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonBadge } from '@ionic/react';


const CardPoke = ({ name, imageUrl, experiencia, altura, peso, habilidades, tipo }) => {
  const cardStyle = {
    backgroundImage: `url(${imageUrl})`,
    backgroundSize: 'contain', // Puedes ajustar este valor según tus necesidades
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    minHeight: '200px',
    color: 'white',
  };

  return (
    <IonCard style={cardStyle}>
      <IonCardHeader>
        <IonCardTitle>{name}</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <p><strong>Tipo:</strong> {tipo.map(t => t)}</p>
        <p><strong>Experiencia:</strong> {experiencia}</p>
        <p><strong>Altura:</strong> {altura}</p>
        <p><strong>Peso:</strong> {peso}</p>
        <p><strong>Habilidades:</strong> {habilidades.join(', ')}</p>
      </IonCardContent>
    </IonCard>
  );
};

export default CardPoke;