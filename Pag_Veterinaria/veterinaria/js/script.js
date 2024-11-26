// Información de servicios
const services = [
    {
      name: "Consultas Médicas",
      description: "Atención profesional para la salud de tus mascotas.",
      image: "https://via.placeholder.com/250x150?text=Consultas"
    },
    {
      name: "Vacunación",
      description: "Vacunas para proteger a tus mascotas de enfermedades.",
      image: "https://via.placeholder.com/250x150?text=Vacunación"
    },
    {
      name: "Baño y Peluquería",
      description: "Higiene y cuidado estético para tus compañeros peludos.",
      image: "https://via.placeholder.com/250x150?text=Baño+Peluquería"
    },
    {
      name: "Cirugías Menores",
      description: "Procedimientos quirúrgicos realizados con total seguridad.",
      image: "https://via.placeholder.com/250x150?text=Cirugías"
    },
    {
      name: "Emergencias 24/7",
      description: "Estamos disponibles para atender emergencias todo el día.",
      image: "https://via.placeholder.com/250x150?text=Emergencias"
    }
  ];
  
  // Generar tarjetas dinámicamente
  const servicesList = document.getElementById("servicesList");
  
  if (servicesList) {
    services.forEach(service => {
      const card = document.createElement("div");
      card.classList.add("service-card");
  
      card.innerHTML = `
        <img src="${service.image}" alt="${service.name}">
        <h3>${service.name}</h3>
        <p>${service.description}</p>
      `;
  
      servicesList.appendChild(card);
    });
  }
  