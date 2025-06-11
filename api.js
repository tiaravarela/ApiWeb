$(document).ready(function () {
    $('#close-info').on('click', function() {
    $('.container').hide();
  });

  // Lista de razas válidas para evitar búsquedas inválidas
  const razasValidas = [
    "Abyssinian",
    "Aegean",
    "American Bobtail",
    "American Curl",
    "American Shorthair",
    "American Wirehair",
    "Arabian Mau",
    "Asian",
    "Asian Semi-longhair",
    "Balinese",
    "Bengal",
    "Birman",
    "Bombay",
    "British Shorthair",
    "Burmese",
    "Chartreux",
    "Cornish Rex",
    "Devon Rex",
    "Egyptian Mau",
    "European Burmese",
    "Havana",
    "Himalayan",
    "Japanese Bobtail",
    "Korat",
    "Maine Coon",
    "Manx",
    "Norwegian Forest",
    "Ocicat",
    "Oriental",
    "Persian",
    "Ragdoll",
    "Russian Blue",
    "Scottish Fold",
    "Siamese",
    "Siberian",
    "Singapura",
    "Somali",
    "Sphynx",
    "Tonkinese",
    "Turkish Angora",
    "Turkish Van"
  ];

  // Imagen por defecto si API no devuelve imagen
  const defaultImage = 'default-cat.jpg';

  // Convierte texto a formato "Título"
  function toTitleCase(str) {
    return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }

  function fetchCatInfo(name) {
    $('.container').hide(); // Hide container initially
    $('#error-msg').text('');
    $('#breed-name').text('Cargando...');
    $('#cat-info').html('');
    $('#cat-image').attr('src', defaultImage);
    $('#cat-card').hide();

    if (!razasValidas.includes(name)) {
      $('#breed-name').text('Raza no válida');
      $('#error-msg').text('Por favor, escribe una raza válida.');
      $('#cat-info').html('');
      $('#cat-card').hide();
      $('.container').show(); // Show container for error message
      return;
    }

    $.ajax({
      method: 'GET',
      url: 'https://api.api-ninjas.com/v1/cats?name=' + encodeURIComponent(name),
      headers: { 'X-Api-Key': 'dghHHXMSX+YiLu69DzXouA==CXyKC1He3ZiHr2cZ' },
      contentType: 'application/json',
      success: function(result) {
        if (result.length > 0) {
          const cat = result[0];
          $('#breed-name').text(cat.name);

          let html = `
            <p><strong>Tamaño:</strong> ${cat.length || 'N/A'}</p>
            <p><strong>Origen:</strong> ${cat.origin || 'N/A'}</p>
            <p><strong>Salud General:</strong> ${cat.general_health || 'N/A'} / 5</p>
            <p><strong>Pérdida de Pelo:</strong> ${cat.shedding || 'N/A'} / 5</p>
            <p><strong>Amigable con la Familia:</strong> ${cat.family_friendly || 'N/A'} / 5</p>
            <p><strong>Amigable con Niños:</strong> ${cat.children_friendly || 'N/A'} / 5</p>
            <p><strong>Amigable con otras Mascotas:</strong> ${cat.other_pets_friendly || 'N/A'} / 5</p>
            <p><strong>Nivel de Juego:</strong> ${cat.playfulness || 'N/A'} / 5</p>
            <p><strong>Nivel de Aseo:</strong> ${cat.grooming || 'N/A'} / 5</p>
            <p><strong>Inteligencia:</strong> ${cat.intelligence || 'N/A'} / 5</p>
            <p><strong>Peso:</strong> ${cat.min_weight && cat.max_weight ? cat.min_weight + ' - ' + cat.max_weight + ' libras' : 'N/A'}</p>
            <p><strong>Esperanza de Vida:</strong> ${cat.min_life_expectancy && cat.max_life_expectancy ? cat.min_life_expectancy + ' - ' + cat.max_life_expectancy + ' años' : 'N/A'}</p>
          `;

          $('#cat-info').html(html);

          if (cat.image_link) {
            $('#cat-image').attr('src', cat.image_link);
          } else {
            $('#cat-image').attr('src', defaultImage);
          }

          $('#cat-card').show();
          $('.container').show(); // Show container on successful data load
        } else {
          $('#breed-name').text('No encontrado');
          $('#error-msg').text('No se encontró información sobre esta raza.');
          $('#cat-info').html('');
          $('#cat-image').attr('src', defaultImage);
          $('#cat-card').hide();
          $('.container').show(); // Show container for error message
        }
      },
      error: function(jqXHR) {
        $('#breed-name').text('Error');
        $('#error-msg').text('Error al obtener los datos del gato: ' + jqXHR.statusText);
        $('#cat-info').html('');
        $('#cat-image').attr('src', defaultImage);
        $('#cat-card').hide();
        $('.container').show(); // Show container for error message
      }
    });
  }

  // Función para cargar imágenes de todas las razas
  function loadBreedImages() {
    razasValidas.forEach(function(breed) {
      $.ajax({
        method: 'GET',
        url: 'https://api.api-ninjas.com/v1/cats?name=' + encodeURIComponent(breed),
        headers: { 'X-Api-Key': 'dghHHXMSX+YiLu69DzXouA==CXyKC1He3ZiHr2cZ' },
        contentType: 'application/json',
        success: function(result) {
          const imageUrl = result.length > 0 && result[0].image_link ? result[0].image_link : defaultImage;
          const breedCard = $(`
            <div class="breed-card" data-breed="${breed}">
              <img src="${imageUrl}" alt="${breed}" />
              <span>${breed}</span>
            </div>
          `);
          $('#breed-list').append(breedCard);
        },
        error: function() {
          const breedCard = $(`
            <div class="breed-card" data-breed="${breed}">
              <img src="${defaultImage}" alt="${breed}" />
              <span>${breed}</span>
            </div>
          `);
          $('#breed-list').append(breedCard);
        }
      });
    });
  }

  // Cargar imágenes al iniciar
  loadBreedImages();

  // Evento de búsqueda
  $('#search-form').on('submit', function(e) {
    e.preventDefault();
    const breedNameRaw = $('#search-input').val().trim();
    const breedName = toTitleCase(breedNameRaw);
    fetchCatInfo(breedName);
  });

  // Evento de clic en las tarjetas de raza
  $('#breed-list').on('click', '.breed-card', function() {
    const breedName = $(this).data('breed');
    $('#search-input').val(breedName);
    fetchCatInfo(breedName);
  });
  
});