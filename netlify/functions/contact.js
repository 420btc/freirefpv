const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  // Solo permitir solicitudes POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Método no permitido' })
    };
  }

  try {
    const data = JSON.parse(event.body);
    const { name, email, phone, message, service } = data;
    
    // Validar que todos los campos requeridos estén presentes
    if (!name || !email || !message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Faltan campos requeridos' })
      };
    }
    
    // Configuración de EmailJS
    const emailjsServiceId = 'service_freire_fpv';
    const emailjsTemplateId = 'template_contacto';
    const emailjsUserId = process.env.EMAILJS_USER_ID || 'user_id_default';
    
    // Preparar datos para EmailJS
    const emailjsData = {
      service_id: emailjsServiceId,
      template_id: emailjsTemplateId,
      user_id: emailjsUserId,
      template_params: {
        from_name: name,
        from_email: email,
        from_phone: phone || 'No proporcionado',
        message: message,
        requested_service: service || 'No especificado'
      }
    };
    
    // Enviar correo electrónico a través de EmailJS
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(emailjsData)
    });
    
    if (response.ok) {
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true, message: 'Mensaje enviado correctamente' })
      };
    } else {
      const errorData = await response.text();
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: errorData || 'Error al enviar el mensaje' })
      };
    }
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error interno del servidor' })
    };
  }
};
