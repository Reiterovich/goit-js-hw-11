import Notiflix from 'notiflix';
import axios from 'axios';

import { searchPhoto, fetchUrl, photoSearch } from './apijs';
// import axios, { isCancel, AxiosError } from 'axios';

// const searchWord = 'dog';
// searchForm.reset();

const buttonEl = document.querySelector('button');
const galleryEl = document.querySelector('.gallery');
const searchForm = document.querySelector('#search-form');

buttonEl.addEventListener('click', buttonElFunction);
searchForm.addEventListener('input', searchEv);

// const searchWord = 'dog';

// Отримує значення
function searchEv(event) {
  const theme = event.target.value;
  console.log(theme);
  localStorage.setItem('value', theme);
}

function buttonElFunction(event) {
  event.preventDefault();
  const theme = localStorage.getItem('value');

  axios
    .get('https://pixabay.com/api', {
      params: {
        key: '39627856-9233c96fe211e3d33809b3df6',
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: 'true',
        q: `${theme}`,
      },
    })
    .then(
      res => {
        let data = res.data.hits;
        let breedsArray = [...data];
        if (theme && breedsArray.length !== 0) {
          createCard(breedsArray);
          Notiflix.Notify.success(
            `Hooray! We found ${breedsArray.length} images.`
          );
          console.log(breedsArray);
          searchForm.reset();
          localStorage.clear();
        } else {
          galleryEl.innerHTML = ' ';
          searchForm.reset();
          Notiflix.Notify.failure('Enter valide name');
        }
      }
      //   console.log(data);
    )
    .catch(err => {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      //   loaderP.hidden = true;
      //   showEl(errorP);
    });
}

function createCard(array) {
  const markup = array
    .map(
      ({
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `<div class="photo-card">
    <img src="${webformatURL}" alt="${tags}" loading="lazy" />
    <div class="info">
      <p class="info-item">
        <b>Likes: ${likes}</b>
      </p>
      <p class="info-item">
        <b>Views: ${views}</b>
      </p>
      <p class="info-item">
        <b>Comments: ${comments}</b>
      </p>
      <p class="info-item">
        <b>Downloads: ${downloads}</b>
      </p>
    </div>
  </div>`
    )
    .join(' ');
  galleryEl.innerHTML = markup;
}
