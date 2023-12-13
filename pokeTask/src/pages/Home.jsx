import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonButtons,
  IonLabel,
  IonList,
  IonGrid,
  IonRow,
  IonCol,
  IonRefresher,
  IonRefresherContent,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import './Home.css';
import CardPoke from '../components/CardPoke';

const Home = () => {
  const history = useHistory();
  const [pokemons, setPokemons] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const refresherRef = useRef(null);


  // Funcion para que hace el llamado a la API y trae los pokemones
  const fetchPokemons = async (pageNumber) => {
    try {
      setLoading(true);
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=12&offset=${(pageNumber - 1) * 12}`);
      const newPokemons = response.data.results;
      const detailedPokemons = await Promise.all(
        newPokemons.map(async (pokemon) => {
          const details = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`);
          return {
            name: pokemon.name,
            imageUrl: details.data.sprites.front_default,
            experiencia: details.data.base_experience,
            altura: details.data.height,
            peso: details.data.weight,
            habilidades: details.data.abilities.map((ability) => ability.ability.name),
            tipo: details.data.types.map((t) => t.type.name),
          };
        })
      );
      setPokemons(detailedPokemons);
      const totalCount = response.data.count;
      const totalPages = Math.ceil(totalCount / 12);
      setTotalPages(totalPages);
      // Actualizar la URL en el historial de navegación
      history.replace(`/home?page=${pageNumber}`);
    } catch (error) {
      console.error('Error fetching pokemons:', error);
    } finally {
      setLoading(false);
    }
  };
  const loadPage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      fetchPokemons(newPage); // Llama a fetchPokemons con la nueva página
    }
  };

  const loadPrevPage = () => {
    loadPage(page - 1);
  };

  const loadNextPage = () => {
    loadPage(page + 1);
  };

  // Recarga la página actual al realizar el gesto de refresco
  const handleRefresh = (event) => {
    setTimeout(() => {
      fetchPokemons(page);
      event.detail.complete();
    }, 2000);

  };

  useEffect(() => {

    const pageNumber = parseInt(new URLSearchParams(window.location.search).get('page'), 10) || 1;
    if (!isNaN(pageNumber)) {
      setPage(pageNumber);
    }

    fetchPokemons(pageNumber);
  }, [history]);


  const generatePageButtons = () => {
    const buttons = [];
    const visiblePages = Math.min(totalPages, 10);
    const startPage = Math.max(1, Math.min(page - Math.floor(visiblePages / 2), totalPages - visiblePages + 1));

    for (let i = 0; i < visiblePages; i++) {
      const pageNumber = startPage + i;
      buttons.push(
        <IonButton
          key={pageNumber}
          button
          onClick={() => loadPage(pageNumber)}
          color={pageNumber === page ? 'primary' : ''}


        >
          <IonLabel >{pageNumber}</IonLabel>
        </IonButton>
      );
    }

    return buttons;
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle className="ion-text-center ion-margin">POKEMON</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonRefresher slot="fixed" ref={refresherRef} onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tab 1</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonGrid>
          <IonRow>
            {pokemons.map((pokemon) => (
              <IonCol key={pokemon.name} size="12" size-md="4" size-lg="3">
                <CardPoke
                  name={pokemon.name}
                  imageUrl={pokemon.imageUrl}
                  experiencia={pokemon.experiencia}
                  altura={pokemon.altura}
                  peso={pokemon.peso}
                  habilidades={pokemon.habilidades}
                  tipo={pokemon.tipo}
                />
              </IonCol>
            ))}
          </IonRow>
        </IonGrid>
        <IonButtons className="ion-text-center ion-margin" style={{ display: 'flex', justifyContent: 'center' }} >
          <IonButton onClick={loadPrevPage} disabled={page === 1}>
            Prev
          </IonButton>
          <IonList>{generatePageButtons()}</IonList>
          <IonButton onClick={loadNextPage} disabled={page === totalPages}>
            Next
          </IonButton>
        </IonButtons>
      </IonContent>
    </IonPage>
  );
};

export default Home;