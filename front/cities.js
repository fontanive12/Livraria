const ENDPOINT = "http://177.44.248.42/bookstore";


const getStates = () => {
    return axios.get(`${ENDPOINT}/states`);
}

const loadTable = () => {
    axios.get(`${ENDPOINT}/cities`)
        .then((response) => {
            if (response.status === 200) {
                const data = response.data;
                var trHTML = '';
                data.forEach(element => {
                    trHTML += '<tr>';
                    trHTML += '<td>' + element.id + '</td>';
                    trHTML += '<td>' + element.name + '</td>';
                    trHTML += '<td>' + element.cep + '</td>';
                    trHTML += '<td>' + element.State.name + '</td>';
                    trHTML += '<td><button type="button" class="btn btn-outline-secondary" onclick="showCityEditBox(' + element.id + ')"><img src="/images/edit.png"></button>';
                    trHTML += '<button type="button" class="btn btn-outline-danger" onclick="cityDelete(' + element.id + ')"><img src="/images/delete.png"></button></td>';
                    trHTML += "</tr>";
                });
                document.getElementById("mytable").innerHTML = trHTML;
            }
        })
};

loadTable();



const listingCities = () => {
    const input1 = document.querySelector("#listingCities");
    const listingCities = input1.value;

    axios.get(`${ENDPOINT}/cities?name=` + listingCities)
        .then((response) => {
            if (response.status === 200) {
                const data = response.data;
                var trHTML = '';

                // console.log(data);

                data.forEach(element => {
                    trHTML += '<tr>';
                    trHTML += '<td>' + element.id + '</td>';
                    trHTML += '<td>' + element.name + '</td>';
                    trHTML += '<td>' + element.cep + '</td>';
                    trHTML += '<td>' + element.State.name + '</td>';
                    trHTML += '<td><button type="button" class="btn btn-outline-secondary" onclick="showCityEditBox(' + element.id + ')"><img src="/images/edit.png"></button>';
                    trHTML += '<button type="button" class="btn btn-outline-danger" onclick="cityDelete(' + element.id + ')"><img src="/images/delete.png"></button></td>';
                    trHTML += "</tr>";
                });
                    document.getElementById("mytable").innerHTML = trHTML;
            }
        })
};



const createStatesCombo = async (id) => {
    const states = await getStates();
    const data = states.data;
    let select = '<select class="swal2-input" id="states_id">';
    
    select += `<option value = "0" selected disabled>Select a state</option>`

    for (let i = 0; i < data.length; i++) {
        const element = data[i];
        if (id === element.id) {
            select += `<option value="${element.id}" selected>${element.name}</option>`
        } else {
            select += `<option value ="${element.id}">${element.name}</option>`
        }
    }
    select += '</select>';
    return select;
}


const cityCreate = () => {
    const name = document.getElementById("name").value;
    const cep = document.getElementById("cep").value;
    const states_id = document.getElementById("states_id").value;

    axios.post(`${ENDPOINT}/cities`, {
        name: name,
        StateId: states_id,
        cep: cep,
    })
        .then((response) => {
            Swal.fire(`City ${response.data.name} created`);
            loadTable();
        }, (error) => {
            Swal.fire(`Error to create city: ${error.response.data.error} `)
                .then(() => {
                    showCityCreateBox();
                })
        });
}

const getCity = (id) => {
    return axios.get(`${ENDPOINT}/cities/` + id);
}

const cityEdit = () => {
    const id = document.getElementById("id").value;
    const name = document.getElementById("name").value;
    const cep = document.getElementById("cep").value;
    const states_id = document.getElementById("states_id").value;

    axios.put(`${ENDPOINT}/cities/` + id, {
        name: name,
        cep: cep,
        StateId: states_id,
    })
        .then((response) => {
            Swal.fire(`City ${response.data.name} updated`);
            loadTable();
        }, (error) => {
            Swal.fire(`Error to update city: ${error.response.data.error} `)
                .then(() => {
                    showCityEditBox(id);
                })
        });
}

const cityDelete = async (id) => {
    const city = await getCity(id);
    const data = city.data;
    axios.delete(`${ENDPOINT}/cities/` + id)
        .then((response) => {
            Swal.fire(`City ${data.name} deleted`);
            loadTable();
        }, (error) => {
            Swal.fire(`Error to delete city: ${error.response.data.error} `);
            loadTable();
        });
};

const showCityCreateBox = async () => {
    const states = await createStatesCombo();
    Swal.fire({
        title: 'Create city',
        html:
            '<input id="id" type="hidden">' +
            '<input id="name" class="swal2-input" placeholder="Name">' +
            '<input id="cep" class="swal2-input" placeholder="CEP">' +
            states,
        focusConfirm: false,
        showCancelButton: true,
        preConfirm: () => {
            cityCreate();
        }
    });
}

const showCityEditBox = async (id) => {
    const states = await createStatesCombo();
    const city = await getCity(id);
    const data = city.data;
    Swal.fire({
        title: 'Edit city',
        html:
            '<input id="id" type="hidden" value=' + data.id + '>' +
            '<input id="name" class="swal2-input" placeholder="Name" value="' + data.name + '">' +
            '<input id="cep" class="swal2-input" placeholder="CEP" value="' + data.cep + '">' +
            states,
        focusConfirm: false,
        showCancelButton: true,
        preConfirm: () => {
            cityEdit();
        }
    });

}