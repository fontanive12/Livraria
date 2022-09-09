const ENDPOINT = "http://localhost:3000";

const getCities = () => {
    return axios.get(`${ENDPOINT}/cities`);
}

const loadTable = () => {
    axios.get(`${ENDPOINT}/publishers`)
        .then((response) => {
            if (response.status === 200) {
                const data = response.data;
                var trHTML = '';
                data.forEach(element => {
                    trHTML += '<tr>';
                    trHTML += '<td>' + element.id + '</td>';
                    trHTML += '<td>' + element.name + '</td>';
                    trHTML += '<td>' + element.City.name + '</td>';
                    // trHTML += '<td>' + element.City.StateId + '</td>';
                    trHTML += '<td><button type="button" class="btn btn-outline-secondary" onclick="showPublisherEditBox(' + element.id + ')">Edit</button>';
                    trHTML += '<button type="button" class="btn btn-outline-danger" onclick="publisherDelete(' + element.id + ')">Del</button></td>';
                    trHTML += "</tr>";
                });
                document.getElementById("mytable").innerHTML = trHTML;
            }
        })
};

loadTable();

const createStatesCombo = async (id) => {
    const states = await getStates();
    const data = states.data;
    let select = '<select class="swal2-input" id="cities_id">';

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

const publisherCreate = () => {
    const name = document.getElementById("name").value;
    const cities_id = document.getElementById("cities_id").value;

    axios.post(`${ENDPOINT}/publishers`, {
        name: name,
        CityId: cities_id,
        // StateId: states_id,
    })
        .then((response) => {
            Swal.fire(`Publisher ${response.data.name} created`);
            loadTable();
        }, (error) => {
            Swal.fire(`Error to create publisher: ${error.response.data.error} `)
                .then(() => {
                    showPublisherCreateBox();
                })
        });
}

const getPublisher = (id) => {
    return axios.get(`${ENDPOINT}/publishers/` + id);
}

const publisherEdit = () => {
    const id = document.getElementById("id").value;
    const name = document.getElementById("name").value;
    const cities_id = document.getElementById("cities_id").value;
    // const states_id = document.getElementById("states_id").value;

    axios.put(`${ENDPOINT}/publishers/` + id, {
        name: name,
        CityId: cities_id,
        // StateId: states_id,
    })
        .then((response) => {
            Swal.fire(`Publisher ${response.data.name} updated`);
            loadTable();
        }, (error) => {
            Swal.fire(`Error to update publisher: ${error.response.data.error} `)
                .then(() => {
                    showPublisherEditBox(id);
                })
        });
}

const publisherDelete = async (id) => {
    const publisher = await getPublisher(id);
    const data = publisher.data;
    axios.delete(`${ENDPOINT}/publishers/` + id)
        .then((response) => {
            Swal.fire(`Publisher ${data.name} deleted`);
            loadTable();
        }, (error) => {
            Swal.fire(`Error to delete publisher: ${error.response.data.error} `);
            loadTable();
        });
};

const showPublisherCreateBox = () => {
    Swal.fire({
        title: 'Create publisher',
        html:
            '<input id="id" type="hidden">' +
            '<input id="name" class="swal2-input" placeholder="Name">' +
            '<input id="cities_id" class="swal2-input" placeholder="cities_id">', 
            // '<input id="states_id" class="swal2-input" placeholder="states_id">',
        focusConfirm: false,
        showCancelButton: true,
        preConfirm: () => {
            publisherCreate();
        }
    });
}

const showPublisherEditBox = async (id) => {
    const publisher = await getPublisher(id);
    const data = publisher.data;
    Swal.fire({
        title: 'Edit cipublisherty',
        html:
            '<input id="id" type="hidden" value=' + data.id + '>' +
            '<input id="name" class="swal2-input" placeholder="Name" value="' + data.name + '">' +
            '<input id="cities_id" class="swal2-input" placeholder="cities_id" value="' + data.CityId + '">',
            // '<input id="states_id" class="swal2-input" placeholder="states_id" value="' + data.StateId + '">',
        focusConfirm: false,
        showCancelButton: true,
        preConfirm: () => {
            publisherEdit();
        }
    });

}