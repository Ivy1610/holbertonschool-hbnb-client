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
        const response = await fetch('http://your-api-url/login', {
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

  async function fetchPlaces(token, placeId) {
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
     <h2>${place.title}</h2>
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
  placesDetailsSection.querySelector('.place-info').innerHTML = `
  
     <p>Price per night: $${place.price}</p>
     <p>Location: ${place.city}, ${place.country}</p>
     <p>${place.description}</p>
     <button class="back-button" onclick="location.href='index.html'">Back to list</button>
   `;
  placesList.style.display = 'none';
  placeDetails.style.display = 'block';
}
if (loginForm) {
  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    await loginUser(email, password);
  });
}
});

async function loginUser(email, password) {
  try {
    const response = await fetch('http://127.0.0.1:5000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      document.cookie = 'token=${data.access_token}; path=/';
      window.location.href = '/';
    } else {
      const errorData = await response.json();
      alert('Login failed! ' + (errorData.message || response.statusText));
    }
  } catch (error) {
    console.error('Error logging in', error);
    alert('An error occurred while logging in. Please try again later.');
  }
}