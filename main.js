//Listen for submit
document.getElementById('zipForm').addEventListener('submit', getLocationInfo);

// Listen For Delete button in output div
// Nota: Para eliminar el contenido del div outpu
document.querySelector('body').addEventListener('click', deleteLocation);

function getLocationInfo(e) {
    // Nota: Se utiliza e.preventDefault ya que al hacer submit form intentará enviar los
    //         datos a una página web.
    e.preventDefault();

    // Get value from input
    const zip = document.querySelector('.zip').value;
    // console.log(zip);

    // Make request
    fetch(`http://api.zippopotam.us/MX/${zip}`)
        // Nota: En caso de que regrese texto se usa:
        //     .then((res) => res.text())
        .then(res => {
            // res.json()
            // Nota: Se valida que la respuesta no sea 404 (Not Found)
            //      En caso de que presente resultado status será 200
            if (res.status != 200) {
                // Nota: Muestra ícono de X al final del input
                showIcon('remove');

                // Nota: Muestra mensaje de error en div #output
                document.querySelector('#output').innerHTML = `
                
                    <article class="message is-danger">
                        <div class="message-body">
                            No existe el Código postal: ${zip}
                            <button class="delete"></button>
                        </div>
                    </article>
                `;
                
                // Nota: Muestra texto de error debajo de input.
                document.getElementById('helpError').innerHTML = `No hay resultados para el código Postal: ${zip} <button class="delete"></button>`;
                
                // Nota: Muestrar error, enviado a sección catch
                throw Error(res.statusText);
            } else {
                // Muestra ícono de font awesome 
                showIcon('check');
                
                return res.json();
            }
        })
        .then(data => {
            console.log(data);

            let output = '';

            data.places.forEach(place => {
                output += `
                    <article class="message is-primary">
                        <div class="message-header">
                            <p>Información Del Código Postal: ${data['post code']}</p>
                            <button class="delete"></button>
                        </div>
                        <div class="message-body">
                            <ul>
                                <li><strong>Colonia: </strong>${place['place name']}</li>
                                <li><strong>Estado: </strong>${place['state']}</li>
                                <li><strong>Longitud: </strong>${place['longitude']}</li>
                                <li><strong>Latitud: </strong>${place['latitude']}</li>
                            </ul>
                        </div>
                    </article>
                    
                `;
            });

            // Insert into output div

            document.getElementById('output').innerHTML = output;

        })
        .catch(err => console.log(err));

}

// Nota: Muestra el ícono de font awesome al final del input, después de realizar la búsqueda.
        // mostrará una x en caso de no encontrar información sobre el código postal
        // o palomita en caso de encontrar resultado
function showIcon(icon) {
    // Clear icons
    document.querySelector('.icon-remove').style.display = 'none';
    document.querySelector('.icon-check').style.display = 'none';

    // Show correct icon
    document.querySelector(`.icon-${icon}`).style.display = 'inline-flex';
}

// Nota: Delete location div
function deleteLocation(e) {
    console.log(123);
    // Nota: Se verifica si se hizo click en el button (X)
    if (e.target.className == 'delete') {
        // Nota: Elimina el contenido del div
        // document.getElementById('output').innerHTML = '';

        // Nota: Solución de Traversy Media
            // 1.- Remueve div output
            // 2.- Elimina contenido de input 
            // 3.- Elimina icon de input
        document.querySelector('.message').remove();
        document.querySelector('.zip').value = '';
        document.querySelector('.icon-check').remove();

        // Nota: Omar, elimina texto de error debajo de input
        document.getElementById('helpError').innerHTML = '';
        document.querySelector('.icon-remove').remove();
    }
}