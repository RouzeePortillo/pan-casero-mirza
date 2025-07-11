let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;

document.addEventListener('DOMContentLoaded', () => {
    showSlide(currentSlide);
    setInterval(nextSlide, 3000); // Cambia la imagen cada 3 segundos
});

function showSlide(index) {
    if (index >= totalSlides) {
        currentSlide = 0;
    } else if (index < 0) {
        currentSlide = totalSlides - 1;
    } else {
        currentSlide = index;
    }
    const offset = -currentSlide * 100;
    document.querySelector('.slides').style.transform = `translateX(${offset}%)`;
}

function nextSlide() {
    showSlide(currentSlide + 1);
}

function prevSlide() {
    showSlide(currentSlide - 1);
}

//Viendo

document.addEventListener('DOMContentLoaded', () => {
  const productos = document.querySelectorAll('.card-product');
  const spanCarrito = document.querySelector('.content-shopping-cart .number');

  // Reiniciar carrito al cargar
  localStorage.setItem('carrito', JSON.stringify([]));
  actualizarCarrito();

  function guardarEnStorage(clave, producto) {
    let lista = JSON.parse(localStorage.getItem(clave)) || [];
    lista.push(producto);
    localStorage.setItem(clave, JSON.stringify(lista));
  }

  function actualizarCarrito() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    spanCarrito.textContent = `(${carrito.length})`;
  }

  function eliminarDelCarrito(nombre) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    carrito = carrito.filter(p => p.nombre !== nombre);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarCarrito();
    alert(`${nombre} eliminado del carrito.`);
  }

  productos.forEach(producto => {
    const nombre = producto.dataset.nombre;
    const precio = producto.dataset.precio;
    const img = producto.dataset.img;

    // 🛒 Agregar al carrito
    const btnCarrito = producto.querySelector('.add-cart');
    if (btnCarrito) {
      btnCarrito.addEventListener('click', () => {
        guardarEnStorage('carrito', { nombre, precio, img });
        actualizarCarrito();
        alert(`${nombre} agregado al carrito.`);
      });
    }

    // 👁️ Eliminar del carrito
    const btnVer = producto.querySelector('.btn-ver');
    if (btnVer) {
      btnVer.addEventListener('click', () => {
        eliminarDelCarrito(nombre);
      });
    }

    // ❤️ Agregar a favoritos
    const btnFav = producto.querySelector('.btn-fav');
    if (btnFav) {
      btnFav.addEventListener('click', () => {
        guardarEnStorage('favoritos', { nombre, precio, img });
        alert(`${nombre} agregado a favoritos.`);
      });
    }

    // 🔁 Compartir producto
    const btnComp = producto.querySelector('.btn-comp');
    if (btnComp) {
      btnComp.addEventListener('click', () => {
        if (navigator.share) {
          navigator.share({
            title: nombre,
            text: `¡Mira este producto: ${nombre} a solo ${precio}!`,
            url: window.location.href
          }).catch(err => console.log('Error al compartir:', err));
        } else {
          alert('Tu navegador no admite compartir.');
        }
      });
    }
  });
});

//estrellas PROBANDOOOOOO

function pintarEstrellas(starsContainer, valorSeleccionado) {
  const estrellas = starsContainer.querySelectorAll('i');
  estrellas.forEach(estrella => {
    const valor = parseInt(estrella.dataset.valor);
    if (valor <= valorSeleccionado) {
      estrella.classList.add('active');
      // Reinicia animación si ya la tenía
      estrella.classList.remove('animate');
      void estrella.offsetWidth; // Reflujo para reiniciar animación
      estrella.classList.add('animate');
    } else {
      estrella.classList.remove('active', 'animate');
    }
  });
}


function cargarCalificaciones() {
  const calificaciones = JSON.parse(localStorage.getItem('calificaciones')) || {};
  document.querySelectorAll('.stars').forEach(container => {
    const nombre = container.dataset.nombre;
    if (calificaciones[nombre]) {
      pintarEstrellas(container, calificaciones[nombre]);
    }
  });
}

document.querySelectorAll('.stars').forEach(container => {
  const nombre = container.dataset.nombre;
  const estrellas = container.querySelectorAll('i');

  estrellas.forEach(estrella => {
    estrella.addEventListener('click', () => {
      const valor = parseInt(estrella.dataset.valor);
      pintarEstrellas(container, valor);

      let calificaciones = JSON.parse(localStorage.getItem('calificaciones')) || {};
      calificaciones[nombre] = valor;
      localStorage.setItem('calificaciones', JSON.stringify(calificaciones));
    });
  });
});

// Al cargar la página, aplica las calificaciones guardadas
cargarCalificaciones();




//OTROOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOo
document.addEventListener('DOMContentLoaded', () => {
  const actualizarContador = () => {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    document.getElementById('carrito-contador').textContent = `Contador de Compras ( ${carrito.length} )`;
  };

  actualizarContador();

  document.querySelectorAll('.card-comidita').forEach(producto => {
    const nombre = producto.dataset.nombre;
    const precio = producto.dataset.precio;
    const img = producto.dataset.img;

    const estrellaContainer = producto.querySelector('.stars');
    const estrellas = estrellaContainer.querySelectorAll('i');

    const pintarEstrellasYMensaje = (valor) => {
      estrellas.forEach(e => {
        e.classList.toggle('active', e.dataset.valor <= valor);
        e.classList.remove('animate');
        void e.offsetWidth;
        e.classList.add('animate');
      });

      const porcentaje = valor * 20;
      const mensaje = producto.querySelector('.mensaje-calificacion');
      mensaje.textContent = `Calificaste con ${porcentaje}% este producto`;
      mensaje.style.display = 'block';

      const calificaciones = JSON.parse(localStorage.getItem('calificaciones')) || {};
      calificaciones[nombre] = valor;
      localStorage.setItem('calificaciones', JSON.stringify(calificaciones));
    };

    estrellas.forEach(e => {
      e.addEventListener('click', () => {
        const valor = parseInt(e.dataset.valor);
        pintarEstrellasYMensaje(valor);
      });
    });

    const guardadas = JSON.parse(localStorage.getItem('calificaciones')) || {};
    if (guardadas[nombre]) {
      pintarEstrellasYMensaje(guardadas[nombre]);
    }

    producto.querySelector('.info')?.addEventListener('click', () => {
      const desc = producto.querySelector('.descripcion-producto');
      desc.style.display = desc.style.display === 'none' ? 'block' : 'none';
    });

    producto.querySelector('.ametraka')?.addEventListener('click', () => {
      const lista = JSON.parse(localStorage.getItem('favoritos')) || [];
      lista.push({ nombre, precio, img });
      localStorage.setItem('favoritos', JSON.stringify(lista));
      const favMsg = producto.querySelector('.mensaje-favorito');
      favMsg.style.display = 'block';
      alert(`${nombre} agregado a favoritos`);
    });

    producto.querySelector('.cineee')?.addEventListener('click', () => {
      const lista = JSON.parse(localStorage.getItem('carrito')) || [];
      lista.push({ nombre, precio, img });
      localStorage.setItem('carrito', JSON.stringify(lista));
      actualizarContador();
      alert(`${nombre} agregado al carrito.`);
    });

    producto.querySelector('.barcobasurero')?.addEventListener('click', () => {
      const eliminarDe = clave => {
        let lista = JSON.parse(localStorage.getItem(clave)) || [];
        lista = lista.filter(p => p.nombre !== nombre);
        localStorage.setItem(clave, JSON.stringify(lista));
      };
      eliminarDe('carrito');
      eliminarDe('favoritos');
      actualizarContador();
      alert(`${nombre} eliminado del carrito y de favoritos (Si aplica).`);
      const favMsg = producto.querySelector('.mensaje-favorito');
      favMsg.style.display = 'none';
    });
  });
});


//COPIAR CUENTA

document.querySelectorAll('.btn-copiar').forEach(btn => {
  const txtOriginal = btn.textContent;          // «Copiar cuenta»

  btn.addEventListener('click', () => {
    const numero = btn.dataset.cuenta.trim();   // solo el número
    navigator.clipboard.writeText(numero).then(() => {
      btn.textContent = '¡Listo!';              // feedback mínimo
      setTimeout(() => (btn.textContent = txtOriginal), 1000);
    });
  });
});

