/* 
  This is a SAMPLE FILE to get you started.
  Please, follow the project instructions to complete the tasks.
*/

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');

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
    const response = await fetch('/login', {
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