/* 
  This is a SAMPLE FILE to get you started.
  Please, follow the project instructions to complete the tasks.
*/

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const errorMessage = document.getElementById('error-message');
  const placesList = document.getElementById('places-list');
  const loginLink = document.getElementById('login-link');
  const contryFilter = document.getElementById('country-filter');
  const placeDetailsSection = document.getElementById('place-details');
  const reviewsSection = document.getElementById('reviews');
  const addReviewSection = document.getElementById('add-review');

  function getCoockie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift
  }

  function checkAuthentification() {
    const token = getCookie('token');
    if (!token) {
      loginLink.style.display = 'block';
    } else {
      placesList.style.display = 'none';
      if (placesList) fetchPlaces(token);
      if (placeDetailsSection) fetchPlacesDetails(token, getPlaceIdFromURL());
    }
  }

  async function fetchPlaces(token) {
    try {
      const response = await fetch('http://localhost/5000/places', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error('HTTP error! status: ${response.status}');
      }
      const places = await response.json();
      displayPlaces(places);
    } catch (error) {
      console.error('Error fetching places', error);
      alert('An error occurred while fetching places. Please try again later.');
    }
  }

  async function fetchPlaceDetails(token, placeId) {
    try {
      const response = await fetch('http://localhost:5000/places/${placeId)', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error('HTTP error! status: ${response.status}');
      }
      const place = await response.json();
      displayPlaceDetails(place);
    } catch (error) {
      console.error('Error fetching place details', error);
    }
  }
  function displayPlaces(places) {
    placesList.innerHTML = '';

    places.forEach(place => {
      const placeCard = document.createElement('div');
      placeCard.className = 'place-card';
      placeCard.innerHTML = `
          <h2>${place.name}</h2>
          <p>Price per night: $${place.price}</p>
          <p>Location: ${place.city}, ${place.country}</p>
          <p>${place.description}</p>
          <button class="details-button" onclick="location.href='place.html?id=${place.id}'">View details</button>
      `;
      placesList.appendChild(placeCard);
    });
  }

  function displayPlaceDetails(place) {
    placeDetailsSection.querySelector('h1').textContent = place.name;
    placeDetailsSection.querySelector('.place-image-large').src = place.image_url;
    placeDetailsSection.querySelector('.place-info').innerHTML = `
      <p><strong>Host:</strong> ${place.host}</p>
      <p><strong>Price:</strong> $${place.price} per night</p>
      <p><strong>Location:</strong> ${place.city}, ${place.country}</p>
      <p><strong>Description:</strong>${place.description}</p>
      <p><strong>Amenities:</strong> ${place.amenities.join(', ')}</p>
   `;
    displayReviews(place.reviews);
  }

  function displayReviews(reviews) {
    reviewsSection.innerHTML = '<h2>Reviews</h2>';
    reviews.forEach(review => {
      const reviewCard = document.createElement('div');
      reviewCard.className = 'review-card';
      reviewCard.innerHTML = `
        <p><strong>User:</strong> ${review.user}</p>
        <p><strong>Comment:</strong> ${review.Comment}</p>
        <p class="review-rating">Rating: ${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</p>
      `;
      reviewsSection.appendChild(reviewItem);
    });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      try {
        const response = await loginUser(email, password);

        if (response.ok) {
          const data = await response.json();
          document.cookie = 'token=${data.access_token}; path=/';
          window.location.href = 'index.html';
        } else {
          const errorData = await response.json();
          errorMessage.textContent = 'Login failed: ${errorData.message || response.statusText}';
        }
      } catch (error) {
        errorMessage.textContent = 'An error occurred while logging in. Please try again later.';
      }
    });
  }

  async function loginUser(email, password) {
    return fetch('http://localhost/5000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
  }

  if (countryFilter) {
    contryFilter.addEventListener('change', (event) => {
      const selectedCountry = event.target.value;
      const placeCards = document.getElementsByClassName('place-card');

      Array.from(placeCqrds).forEach(card => {
        const placeLocation = card.querySelector('p:nth-child(3)').innerText;
        if (selectedCountry === 'all' || placeLocation.includes(selectedCountry)) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  }

  if (addReviewFrom) {
    addReviewForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const token = getCookie('token');
      const placeId = getPlaceIdFromURL();
      const reviewRating = document.getElementById('review-rating').value;
      const reviewText = document.getElementById('review-text').value;

      try {
        const response = await fetch('http://localhost:5000/places/${placeId}/reviews', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ rating: reviewRating, comment: reviewText })
        });

        if (response.ok) {
          fetchPlaceDetails(token, placeId);
        } else {
          const errorData = await response.json();
          console.error('Failed to add review: ${errorData.message || response.statusText}');
        }
      } catch (error) {
        console.error('Error adding review', error);
        alert('An error occurred while adding review. Please try again later.');
      }
    });
  }

  function getPlaceIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
  }

  checkAuthentification();
});